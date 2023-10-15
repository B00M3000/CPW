/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema, type ProjectDocumentData } from "@/server/mongo/schemas/project";
import { stringifyObjectId } from "@/lib/utils";
import { error } from "@sveltejs/kit";

export const load = async ({ params }) => {
    const { projectId } = params;
    const project = stringifyObjectId(await ProjectSchema.findById(projectId).lean());

    if(!project) throw error(404, "Project not found!");

    return { project, projectId };
}