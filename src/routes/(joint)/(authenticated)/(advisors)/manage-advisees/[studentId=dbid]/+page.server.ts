/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */


import { UserSchema } from '@/server/mongo/schemas/user.js';
import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { error } from '@sveltejs/kit';

export async function load({ locals, params: { studentId } }) {
    const student = stringifyObjectId(await UserSchema.findOne({ _id: studentId }).lean())
    if(!student) error(404, "Student not found.");
    const projects = (await ProjectSchema.find({ studentId: student._id }).lean())?.map(stringifyObjectId).map(p => ({ ...p, student })) || [];
    const inflatedProjects = await Promise.all(projects.map(injectMentor));

    return { student, projects: inflatedProjects }
};


async function injectMentor(project: any) {
    project.mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
    return project;
}
