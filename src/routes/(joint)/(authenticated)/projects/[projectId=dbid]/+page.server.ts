/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { error } from "@sveltejs/kit";

export async function load({ params: { projectId } }) {    
    const project = stringifyObjectId(await ProjectSchema.findById(projectId, "title shortDesc tags mentorId studentId fullReport").lean());

    if(!project) error(404, { message: "Project not found."});

    const student = stringifyObjectId(await UserSchema.findById(project?.studentId, "name picture").lean())
    const mentor = stringifyObjectId(await MentorSchema.findById(project?.mentorId, "name").lean());
    const inflatedImages = await Promise.all((await ImageSchema.find({ projectId }, 'projectId description').lean().sort('-createdAt'))?.map(stringifyObjectId).map(injectProjects));

    return { project, mentor, student, images: inflatedImages };
}

async function injectProjects(image: any) {
    image.project = stringifyObjectId(await ProjectSchema.findById(image.projectId, 'title').lean());
    return image;
}
