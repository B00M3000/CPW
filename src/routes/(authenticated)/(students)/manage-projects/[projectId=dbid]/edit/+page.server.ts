/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */


import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export const load = async ({ parent }) => {
    const { project } = await parent();

    const mentor = stringifyObjectId(await MentorSchema.findById(project?.mentorId).lean())

    return { mentor };
}