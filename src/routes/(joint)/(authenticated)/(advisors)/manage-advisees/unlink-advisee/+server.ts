import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import z from 'zod';
import { UserSchema } from '@/server/mongo/schemas/user';
import { AccessLevel, AccountType } from '@/lib/enums';
import { currentYear } from '@/lib/utils';
import { objectIdHexRegexp } from '@/params/dbid';

const schema = z.object({
    _id: z.string().regex(objectIdHexRegexp)
});

export const POST: RequestHandler = async ({ request, locals }) => {
    const data = await request.json();

    let safeData = schema.parse(data);

    // Validate Student ID
    if(!await UserSchema.exists({ _id: safeData._id, accountType: AccountType.Student })) {
        return error(400, { message: "Not a student" });
    }

    await UserSchema.updateOne({
        _id: locals.user?._id
    }, {
        $pull: {
            adviseeIds: safeData._id
        }
    })

    return json({ success: true, message: 'Student unlinked successfully!!' });
};
