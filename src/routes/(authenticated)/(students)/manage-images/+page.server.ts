/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { stringifyObjectId } from "@/lib/utils.js";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";

export async function load({ locals }) {
    const images = await Promise.all((await ImageSchema.find({ ownerId: locals.user.id }, 'size description projectId').lean())?.map(stringifyObjectId).map(injectProjects));
    return { images }
}

async function injectProjects(image: any) {
    image.project = stringifyObjectId(await ProjectSchema.findById(image.projectId, 'title').lean());
    return image;
}