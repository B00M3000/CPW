/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error } from "@sveltejs/kit";

export const load = async ({ locals, params: { projectId } }) => {
    const project = stringifyObjectId(
        await ProjectSchema.findById(
            projectId,
            "studentId mentorId title tags shortDesc",
        ).lean(),
    );
    if (!project) error(404, "Project not found!");
    if (project.studentId != locals.user._id)
        error(403, "You cannot manage this project!");
    const mentor = stringifyObjectId(
        await MentorSchema.findById(
            project.mentorId,
            "name organization email phoneNumber",
        ).lean(),
    );

    console.log(project, project.mentorId, mentor);

    return { mentor, project };
};
