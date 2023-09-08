import { AccessLevel } from '@/lib/enums';
import { MentorSchema } from '@/server/mongo/schemas/mentor.js';
import { error } from '@sveltejs/kit';
import { buildRegex, stringifyObjectId } from '@/lib/utils';

export async function load({ params, locals }) {
    const mentor = stringifyObjectId(await MentorSchema.findById(params.id).lean());
    return { mentor }
};
