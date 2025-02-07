/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { error } from "@sveltejs/kit";
import { UserSchema } from "@/server/mongo/schemas/user.js";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";

export async function load({ locals, params }) {
    let projectId = params.projectId;

    let project = await ProjectSchema.findById(projectId);
    if (project) {
        let student = await UserSchema.findById(project.studentId);
        if (!locals.user?.adviseeIds.includes(student._id.toString()))
            error(403, "Access denied, not the adivosr of this student.");
    } else {
        error(404, "Invalid Project");
    }
}
