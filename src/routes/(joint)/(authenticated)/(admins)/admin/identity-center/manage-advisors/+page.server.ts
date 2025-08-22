import { fail } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user';
import { AccountType } from '@/lib/enums';
import { stringifyObjectId } from '@/lib/utils';
import z from 'zod';

// Validation schema for creating advisors
const CREATE_ADVISOR_SCHEMA = z.object({
    firstName: z.string().min(1, "First name is required").max(50, "First name cannot exceed 50 characters").trim(),
    lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters").trim(),
    email: z.string().email("Please enter a valid email address").toLowerCase().trim()
});

export async function load({ url }) {
    const searchQuery = url.searchParams.get('search') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build search filter
    let searchFilter: any = { accountType: AccountType.Advisor };

    if (searchQuery) {
        searchFilter.$or = [
            { name: { $regex: searchQuery, $options: 'i' } },
            { email: { $regex: searchQuery, $options: 'i' } },
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } }
        ];
    }

    // Get total count for pagination
    const totalCount = await UserSchema.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalCount / limit);

    // Get advisors with pagination
    const advisors = await UserSchema.find(searchFilter)
        .select('_id name firstName lastName email createdAt lastVisit adviseeIds')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    // Enhance advisors with additional data and convert ObjectIds to strings
    const enhancedAdvisors = advisors.map((advisor: any) => ({
        ...stringifyObjectId(advisor),
        adviseeCount: advisor.adviseeIds?.length || 0
    }));

    return {
        advisors: enhancedAdvisors,
        query: searchQuery,
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
    async createAdvisor({ request }) {
        try {
            const data = await request.formData();
            
            // Parse and validate form data with Zod
            const validationResult = CREATE_ADVISOR_SCHEMA.safeParse({
                firstName: data.get('firstName')?.toString(),
                lastName: data.get('lastName')?.toString(),
                email: data.get('email')?.toString()
            });

            if (!validationResult.success) {
                const errors = validationResult.error.errors;
                const errorMessage = errors.map(err => err.message).join(', ');
                return fail(400, { success: false, message: errorMessage });
            }

            const { firstName, lastName, email } = validationResult.data;

            // Check if user already exists
            const existingUser = await UserSchema.findOne({ email });
            if (existingUser) {
                return fail(400, { success: false, message: 'User with this email already exists' });
            }

            // Create new advisor
            const newUser = await UserSchema.create({
                firstName,
                lastName,
                name: `${firstName} ${lastName}`,
                email,
                accountType: AccountType.Advisor,
                accessLevel: 1,
                adviseeIds: [],
                createdAt: new Date()
            });

            return { success: true, message: 'Advisor created successfully' };
        } catch (error) {
            console.error('Error creating advisor:', error);
            return fail(500, { success: false, message: 'Failed to create advisor' });
        }
    },

    async deleteAdvisor({ request }) {
        try {
            const data = await request.formData();
            const advisorId = data.get('advisorId')?.toString();

            if (!advisorId) {
                return fail(400, { success: false, message: 'Advisor ID is required' });
            }

            const advisor = await UserSchema.findById(advisorId);
            if (!advisor) {
                return fail(404, { success: false, message: 'Advisor not found' });
            }

            if (advisor.accountType !== AccountType.Advisor) {
                return fail(400, { success: false, message: 'User is not an advisor' });
            }

            // Remove advisor from database
            await UserSchema.findByIdAndDelete(advisorId);

            return { success: true, message: 'Advisor deleted successfully' };
        } catch (error) {
            console.error('Error deleting advisor:', error);
            return fail(500, { success: false, message: 'Failed to delete advisor' });
        }
    }
};
