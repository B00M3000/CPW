/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export const load = async ({ params, parent }) => {
    const { project } = await parent();

    const mentor = stringifyObjectId(await MentorSchema.findById(project?.mentorId).lean())

    return { mentor };
}