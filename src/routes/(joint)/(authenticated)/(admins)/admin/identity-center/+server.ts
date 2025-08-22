import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import z from 'zod';
import { UserSchema } from '@/server/mongo/schemas/user';
import { ProjectSchema } from '@/server/mongo/schemas/project';
import { AccessLevel, AccountType } from '@/lib/enums';
import { currentYear } from '@/lib/utils';

const createStudentSchema = z.object({
    graduationYear: z.number().int().min(currentYear()).max(currentYear() + 4),
    email: z.string().email(),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100)
});

const linkAdvisorSchema = z.object({
    studentId: z.string(),
    advisorId: z.string()
});

const deleteUserSchema = z.object({
    userId: z.string()
});

// Create a new student
export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const data = await request.json();

        // Check if it's a create student request
        if (data.action === 'createStudent') {
            createStudentSchema.parse(data);

            // Check if email already exists
            const existingUser = await UserSchema.findOne({ email: data.email });
            if (existingUser) {
                return json(
                    { success: false, message: 'A user with this email already exists' },
                    { status: 400 }
                );
            }

            const user = await UserSchema.create({
                graduationYear: data.graduationYear,
                email: data.email,
                accessLevel: AccessLevel.Normal,
                accountType: AccountType.Student,
                firstName: data.firstName,
                lastName: data.lastName,
                name: `${data.firstName} ${data.lastName}`
            });

            return json({ success: true, message: 'Student created successfully', userId: user._id });
        }

        // Link advisor to student
        if (data.action === 'linkAdvisor') {
            linkAdvisorSchema.parse(data);

            // Check if student exists
            const student = await UserSchema.findById(data.studentId);
            if (!student) {
                return json(
                    { success: false, message: 'Student not found' },
                    { status: 404 }
                );
            }

            // Check if advisor exists
            const advisor = await UserSchema.findById(data.advisorId);
            if (!advisor) {
                return json(
                    { success: false, message: 'Advisor not found' },
                    { status: 404 }
                );
            }

            // Remove student from current advisor's list (if any)
            await UserSchema.updateMany(
                { adviseeIds: data.studentId },
                { $pull: { adviseeIds: data.studentId } }
            );

            // Add student to new advisor's list
            await UserSchema.updateOne(
                { _id: data.advisorId },
                { $addToSet: { adviseeIds: data.studentId } }
            );

            return json({ success: true, message: 'Advisor linked successfully' });
        }

        // Unlink advisor from student
        if (data.action === 'unlinkAdvisor') {
            const { studentId } = data;

            if (!studentId) {
                return json(
                    { success: false, message: 'Student ID is required' },
                    { status: 400 }
                );
            }

            // Remove student from all advisors' lists
            await UserSchema.updateMany(
                { adviseeIds: studentId },
                { $pull: { adviseeIds: studentId } }
            );

            return json({ success: true, message: 'Advisor unlinked successfully' });
        }

        return json(
            { success: false, message: 'Invalid action' },
            { status: 400 }
        );

    } catch (err) {
        console.error('Error in identity center POST:', err);
        return json(
            { success: false, message: 'Server error occurred' },
            { status: 500 }
        );
    }
};

// Delete a user (with safety checks)
export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        deleteUserSchema.parse(data);

        const user = await UserSchema.findById(data.userId);
        if (!user) {
            return json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        // Safety checks before deletion
        const hasProjects = await ProjectSchema.exists({ studentId: data.userId });
        if (hasProjects) {
            return json(
                { success: false, message: 'Cannot delete user: User has associated projects' },
                { status: 400 }
            );
        }

        // Check if user is an advisor with advisees
        if (user.adviseeIds && user.adviseeIds.length > 0) {
            return json(
                { success: false, message: 'Cannot delete user: User is an advisor with advisees' },
                { status: 400 }
            );
        }

        // Remove user from any advisor's advisee list (if they're a student)
        await UserSchema.updateMany(
            { adviseeIds: data.userId },
            { $pull: { adviseeIds: data.userId } }
        );

        // Delete the user
        await UserSchema.findByIdAndDelete(data.userId);

        return json({ success: true, message: 'User deleted successfully' });

    } catch (err) {
        console.error('Error in identity center DELETE:', err);
        return json(
            { success: false, message: 'Server error occurred' },
            { status: 500 }
        );
    }
};
