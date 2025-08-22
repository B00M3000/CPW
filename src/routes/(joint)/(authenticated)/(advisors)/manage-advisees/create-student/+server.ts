import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import z from 'zod';
import { UserSchema } from '@/server/mongo/schemas/user';
import { AccessLevel, AccountType } from '@/lib/enums';
import { currentYear } from '@/lib/utils';

const studentSchema = z.object({
    graduationYear: z.number().int().min(currentYear()).max(currentYear() + 4),
    email: z.string().email(),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100)
});

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const data = await request.json();

        studentSchema.parse(data)

        const user = await UserSchema.insertOne({
            graduationYear: data.graduationYear,
            email: data.email,
            accessLevel: AccessLevel.Normal,
            accountType: AccountType.Student,
            firstName: data.firstName,
            lastName: data.lastName,
            name: `${data.firstName} ${data.lastName}`
        })

        await UserSchema.updateOne({
            _id: locals.user?._id
        }, {
            $push: {
                adviseeIds: user._id.toString()
            }
        })

        return json({ success: true, message: 'Student created successfully' });
    } catch (error) {
        console.error('Error creating student:', error);
        return json(
            { success: false, message: 'Failed to create student' },
            { status: 500 }
        );
    }
};
