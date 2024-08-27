/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema, type ProjectDocument, type ProjectDocumentData } from '@/server/mongo/schemas/project';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { UserSchema } from '@/server/mongo/schemas/user';
import { stringifyObjectId } from '@/lib/utils';

import type { FilterQuery } from 'mongoose';

// TODO: reduce this since its not used or use it

export async function load() {
    const dbQuery: FilterQuery<ProjectDocument> = {};

    dbQuery.underReview = false;
    const projects: ProjectDocumentData[] = await ProjectSchema.aggregate([{ $match: { publish: true }}, { $sample: { size: 3 } }, { $project: { studentId: 1, title: 1, year: 1, tags: 1, mentorId: 1, shortDesc: 1 }}]) || [];

    const inflatedProjects = await Promise.all(projects.map(stringifyObjectId).map(injectStudentAndMentor))

    return { projects: inflatedProjects }
}

async function injectStudentAndMentor(project: any) {
    project.student = stringifyObjectId(await UserSchema.findById(project.studentId, 'firstName lastName').lean());
    project.mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
    return project;
}
