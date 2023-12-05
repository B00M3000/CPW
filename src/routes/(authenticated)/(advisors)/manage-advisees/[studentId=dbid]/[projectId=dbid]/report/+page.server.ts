/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */


import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import type { Project } from '@/interfaces/project.js';

export async function load({ params }) {
    const projectId = params.projectId;
    const studentId = params.studentId;
    const project : Project = stringifyObjectId(await ProjectSchema.findById(projectId).lean())!;
    return { project, studentId }
};

