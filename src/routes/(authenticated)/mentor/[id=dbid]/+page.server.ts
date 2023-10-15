/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccessLevel } from '@/lib/enums';
import { MentorSchema } from '@/server/mongo/schemas/mentor.js';
import { error } from '@sveltejs/kit';
import { buildRegex, stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';

export async function load({ params, locals }) {
    const mentor = stringifyObjectId(await MentorSchema.findById(params.id).lean());
    const projects = (await ProjectSchema.find({ mentorId: mentor?._id, underReview: false }).lean()).map(stringifyObjectId)
    return { mentor, projects }
};
