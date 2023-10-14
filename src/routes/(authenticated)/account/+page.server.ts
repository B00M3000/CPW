/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";

export async function load({ locals }){
    const projectCount = await ProjectSchema.count({ studentId: locals.user.id });
    const projectCountNotPublished = await ProjectSchema.count({ publish: false, studentId: locals.user.id})
    const imageCount =  await ImageSchema.count({ ownerId: locals.user.id })
    return { projectCount, projectCountNotPublished, imageCount };
}