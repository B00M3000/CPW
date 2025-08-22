/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { UserSchema, type UserDocument } from "@/server/mongo/schemas/user.js";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { currentYear, stringifyObjectId } from "@/lib/utils";
import { AccountType } from "@/lib/enums";
import { error, fail } from "@sveltejs/kit";
import z from "zod";

const QUERY_SCHEMA = z.string().min(0, "Search query cannot be empty").max(100, "Search query cannot exceed 100 characters").transform(x => x ?? "");
const YEARS_SCHEMA = z.array(z.number().int("Years must be integers")).transform(x => x ?? undefined);
const PAGE_SCHEMA = z.number({ invalid_type_error: "Page must be a number" }).int("Page must be an integer").min(1, "Page must be at least 1");
const LIMIT_SCHEMA = z.union([z.literal(5), z.literal(10), z.literal(25), z.literal(50), z.literal(100)], { errorMap: () => ({ message: "Limit must be one of: 5, 10, 25, 50, 100" }) });

// Validation schemas for form data
const CREATE_STUDENT_SCHEMA = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name cannot exceed 50 characters").trim(),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters").trim(),
    email: z.string().email("Please enter a valid email address").toLowerCase().trim(),
    graduationYear: z.number().int("Graduation year must be an integer").min(currentYear() - 10, "Invalid graduation year").max(currentYear() + 10, "Invalid graduation year"),
    advisorId: z.string().optional()
});

export async function load({ url, depends }) {
    depends('admin:manage-students')

    const query = QUERY_SCHEMA.parse(url.searchParams.get('search') || "");
    const years = YEARS_SCHEMA.parse(JSON.parse(`[${url.searchParams.get('years') || ""}]`));
    const page = PAGE_SCHEMA.parse(parseInt(url.searchParams.get('page')) || 1);
    const limit = LIMIT_SCHEMA.parse(parseInt(url.searchParams.get('limit')) || 5);

    // Build the filter query
    let filter: any = {
        accountType: AccountType.Student
    };

    if (query) {
        filter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ];
    }

    if (years.length > 0) {
        filter.graduationYear = years;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalCount = await UserSchema.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get paginated students with the filters applied
    const allStudents = (
        await UserSchema.find(filter)
            .sort({ lastName: 1, firstName: 1 })
            .skip(skip)
            .limit(limit)
            .lean()
    )?.map((student) => stringifyObjectId(student as UserDocument)) || [];

    // Get all advisors for linking
    const allAdvisors = (
        await UserSchema.find(
            { accountType: AccountType.Advisor },
            "name firstName lastName email"
        )
        .sort({ lastName: 1, firstName: 1 })
        .lean()
    )?.map((advisor) => stringifyObjectId(advisor as UserDocument)) || [];

    // Enhance students with advisor and project info
    const enhancedStudents = await Promise.all(
        allStudents.map(async (student) => {
            // Find advisor
            const advisor = await UserSchema.findOne(
                { adviseeIds: student._id },
                "name firstName lastName email"
            ).lean();

            // Check if has current year project
            const hasCurrentProject = await ProjectSchema.exists({
                studentId: student._id,
                year: currentYear()
            });

            return {
                ...student,
                advisor: advisor ? stringifyObjectId(advisor as UserDocument) : null,
                hasCurrentProject: !!hasCurrentProject
            };
        })
    );

    // Get unique graduation years for filter buttons
    const graduationYears = await UserSchema.distinct('graduationYear', {
        accountType: AccountType.Student,
    });
    graduationYears.sort((a, b) => b - a);

    return {
        students: enhancedStudents,
        advisors: allAdvisors,
        graduationYears,
        query,
        years,
        pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
}

export const actions = {
    async createStudent({ request }) {
        try {
            const data = await request.formData();
            
            // Parse and validate form data with Zod
            const validationResult = CREATE_STUDENT_SCHEMA.safeParse({
                firstName: data.get('firstName')?.toString(),
                lastName: data.get('lastName')?.toString(),
                email: data.get('email')?.toString(),
                graduationYear: parseInt(data.get('graduationYear')?.toString() || ''),
                advisorId: data.get('advisorId')?.toString() || undefined
            });

            if (!validationResult.success) {
                const errors = validationResult.error.errors;
                const errorMessage = errors.map(err => err.message).join(', ');
                return fail(400, { success: false, message: errorMessage });
            }

            const { firstName, lastName, email, graduationYear, advisorId } = validationResult.data;

            // Check if user already exists
            const existingUser = await UserSchema.findOne({ email });
            if (existingUser) {
                return fail(400, { success: false, message: 'User with this email already exists' });
            }

            // Validate advisor if provided
            if (advisorId) {
                const advisor = await UserSchema.findById(advisorId);
                if (!advisor || advisor.accountType !== AccountType.Advisor) {
                    return fail(400, { success: false, message: 'Invalid advisor selected' });
                }
            }

            // Create new student
            const newUser = await UserSchema.create({
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email,
                graduationYear,
                accountType: AccountType.Student,
                accessLevel: 0,
                createdAt: new Date()
            });

            // Link advisor if provided
            if (advisorId) {
                await UserSchema.findByIdAndUpdate(
                    advisorId,
                    { $addToSet: { adviseeIds: newUser._id } }
                );
            }

            return { success: true, message: 'Student created successfully' + (advisorId ? ' and linked to advisor' : '') };
        } catch (error) {
            console.error('Error creating student:', error);
            return fail(500, { success: false, message: 'Failed to create student' });
        }
    },

    async linkAdvisor({ request }) {
        try {
            const data = await request.formData();
            const studentId = data.get('studentId')?.toString();
            const advisorId = data.get('advisorId')?.toString();

            if (!studentId || !advisorId) {
                return fail(400, { success: false, message: 'Student ID and Advisor ID are required' });
            }

            // Remove student from any existing advisor's adviseeIds
            await UserSchema.updateMany(
                { adviseeIds: studentId },
                { $pull: { adviseeIds: studentId } }
            );

            // Add student to new advisor's adviseeIds
            await UserSchema.findByIdAndUpdate(
                advisorId,
                { $addToSet: { adviseeIds: studentId } }
            );

            return { success: true, message: 'Advisor linked successfully' };
        } catch (error) {
            console.error('Error linking advisor:', error);
            return fail(500, { success: false, message: 'Failed to link advisor' });
        }
    },

    async unlinkAdvisor({ request }) {
        try {
            const data = await request.formData();
            const studentId = data.get('studentId')?.toString();

            if (!studentId) {
                return fail(400, { success: false, message: 'Student ID is required' });
            }

            // Remove student from all advisors' adviseeIds
            await UserSchema.updateMany(
                { adviseeIds: studentId },
                { $pull: { adviseeIds: studentId } }
            );

            return { success: true, message: 'Advisor unlinked successfully' };
        } catch (error) {
            console.error('Error unlinking advisor:', error);
            return fail(500, { success: false, message: 'Failed to unlink advisor' });
        }
    },

    async updateGradYear({ request }) {
        try {
            const data = await request.formData();
            const studentId = data.get('studentId')?.toString();
            const graduationYear = parseInt(data.get('graduationYear')?.toString() || '');

            if (!studentId || !graduationYear) {
                return fail(400, { success: false, message: 'Student ID and Graduation Year are required' });
            }

            // Validate graduation year range (reasonable years)
            const currentYearValue = currentYear();
            if (graduationYear < currentYearValue - 10 || graduationYear > currentYearValue + 10) {
                return fail(400, { success: false, message: 'Invalid graduation year' });
            }

            // Update the student's graduation year
            await UserSchema.findByIdAndUpdate(
                studentId,
                { graduationYear }
            );

            return { success: true, message: 'Graduation year updated successfully' };
        } catch (error) {
            console.error('Error updating graduation year:', error);
            return fail(500, { success: false, message: 'Failed to update graduation year' });
        }
    },

    async deleteUser({ request }) {
        try {
            const data = await request.formData();
            const userId = data.get('userId')?.toString();

            if (!userId) {
                return fail(400, { success: false, message: 'User ID is required' });
            }

            // Check if user has current projects
            const hasCurrentProject = await ProjectSchema.exists({
                studentId: userId,
                year: currentYear()
            });

            if (hasCurrentProject) {
                return fail(400, { success: false, message: 'Cannot delete user with active projects' });
            }

            // Check if user has advisees
            const user = await UserSchema.findById(userId);
            if (user?.adviseeIds && user.adviseeIds.length > 0) {
                return fail(400, { success: false, message: 'Cannot delete user with advisees' });
            }

            // Check if user has ever logged in (has lastVisit)
            if (user?.lastVisit) {
                return fail(400, { success: false, message: 'Cannot delete user who has logged in' });
            }

            // Remove user from any advisor's adviseeIds
            await UserSchema.updateMany(
                { adviseeIds: userId },
                { $pull: { adviseeIds: userId } }
            );

            // Delete the user
            await UserSchema.findByIdAndDelete(userId);

            return { success: true, message: 'User deleted successfully' };
        } catch (error) {
            console.error('Error deleting user:', error);
            return fail(500, { success: false, message: 'Failed to delete user' });
        }
    }
};
