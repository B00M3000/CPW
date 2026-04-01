/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { canViewProject } from "@/server/project-access";
import { error } from "@sveltejs/kit";

export async function load({ params, locals }) {
    const projectId = params.projectId;
    const project = await ProjectSchema.findById(projectId);

    if (!project) error(404, { message: "No project exists with this ID" });

    const allowedToView = canViewProject(locals.user, project);

    if (!allowedToView)
        error(403, {
            message: "Project is not published and cannot be viewed publicly.",
        });
}
