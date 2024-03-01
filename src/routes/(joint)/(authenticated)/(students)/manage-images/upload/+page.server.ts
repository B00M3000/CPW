/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { stringifyObjectId } from "@/lib/utils.js";
import { ProjectSchema } from "@/server/mongo/schemas/project";


export async function load({ locals }) {
    const projects = (await ProjectSchema.find({ studentId: locals.user?.id }, 'title').lean())?.map(stringifyObjectId);
    return { projects }
}