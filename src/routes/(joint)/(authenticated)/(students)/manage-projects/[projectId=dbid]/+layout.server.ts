/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { stringifyObjectId } from "@/lib/utils";
import { error } from "@sveltejs/kit";

export const load = async ({ params, locals }) => {
    const { projectId } = params;
    const project = stringifyObjectId(await ProjectSchema.findById(projectId).lean());

    if(!project) error(404, "Project not found!");

    if(project.studentId != locals.user.id) error(403, "You cannot manage this project!");

    return { project, projectId };
}