/*
 * Created on Sat Oct 14 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";

async function injectStudentAndMentor(project: any) {
    project.student = stringifyObjectId(await UserSchema.findById(project.studentId, 'firstName lastName email picture').lean());
    project.mentor =  stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName email phoneNumber').lean());
    return project;
}

export async function load({ params: { projectId } }) {
    const project = stringifyObjectId(await ProjectSchema.findById(projectId).lean())
    const inflatedProject = await injectStudentAndMentor(project);
    return { inflatedProject, projectId };
}