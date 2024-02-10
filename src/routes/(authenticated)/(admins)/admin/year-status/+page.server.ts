/*
* Created on Sun Feb 4 2024
*
* Copyright (c) 2023 Thomas Zhou
*/

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";

const CURRENT_YEAR = new Date().getFullYear(); // out here for now, but should be changed later

export const load = async () => {
    const allStudents = (await UserSchema.find({ schoolId: { $regex: /S/ }, graduationYear: { $gte: CURRENT_YEAR } }).lean())?.map(stringifyObjectId);
    const projects = await ProjectSchema.find({ year: CURRENT_YEAR }, 'studentId underReview title').lean();

    const missingStudents = allStudents.filter(student => !projects.some(project => project.studentId == student._id));
    const inflatedUnapprovedProjects = await Promise.all(projects.filter(project => project.underReview)?.map(stringifyObjectId).map(injectStudent));

   return { missingStudents, inflatedUnapprovedProjects };
}

async function injectStudent(project: any) {
   project.student = stringifyObjectId(await UserSchema.findById(project.studentId, 'name graduationYear').lean());
   return project;
}
