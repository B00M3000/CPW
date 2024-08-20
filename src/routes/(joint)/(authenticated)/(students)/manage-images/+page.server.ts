/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { stringifyObjectId } from "@/lib/utils.js";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";

export async function load({ locals, depends }) {
    depends("user:imagelist");

    const images = await Promise.all((await (await ImageSchema.find({ ownerId: locals.user.id }, 'size description projectId createdAt').sort({ createdAt: -1 }).lean())?.map(stringifyObjectId).map(injectProjects)));
    const projects = (await ProjectSchema.find({ studentId: locals.user?.id }, 'title').lean())?.map(stringifyObjectId);
    
    return { images, projects }
}

async function injectProjects(image: any) {
    image.project = stringifyObjectId(await ProjectSchema.findById(image.projectId, 'title').lean());
    return image;
}
