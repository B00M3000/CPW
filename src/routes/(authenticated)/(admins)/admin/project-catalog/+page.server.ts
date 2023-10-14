/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";

async function injectStudentAndMentor(project: any) {
    project.student = stringifyObjectId(await UserSchema.findById(project.studentId, 'firstName lastName picture').lean());
    project.mentor =  stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
    return project;
}
export const load: PageServerLoad = async ({ }) => {
    const projects = (await ProjectSchema.find({ year:  new Date().getFullYear() }).lean())
    const inflatedProjects = await Promise.all(projects.map(stringifyObjectId).map(injectStudentAndMentor))
    return { projects };

}
