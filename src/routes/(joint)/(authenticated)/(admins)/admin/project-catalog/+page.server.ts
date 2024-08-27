/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { currentYear, stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";

export const load = async () => {
    const projects = (await ProjectSchema.find({ year: currentYear() }, 'underReview studentId mentorId title').lean())
    const inflatedProjects = await Promise.all(projects.map(stringifyObjectId).map(injectStudentAndMentor))
    return { inflatedProjects };
}

async function injectStudentAndMentor(project: any) {
    project.student = stringifyObjectId(await UserSchema.findById(project.studentId, 'name picture').lean());
    project.mentor =  stringifyObjectId(await MentorSchema.findById(project.mentorId, 'name').lean());
    return project;
}
