/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */


import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';


export async function load({ locals, params }) {
    const projectId = params.projectId;
    const studentId = params.studentId;
    const project = stringifyObjectId(await ProjectSchema.findById(projectId).lean());

    return { project, studentId }
};

