/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { stringifyObjectId } from "@/lib/utils";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";

export async function load({ params }) {
    const projectId = params.projectId;
    const studentId = params.studentId;
    const project: any = await injectStudentAndMentor(
        stringifyObjectId(await ProjectSchema.findById(projectId).lean()),
    );
    return { project, studentId };
}

async function injectStudentAndMentor(project: any) {
    project.student = stringifyObjectId(
        await UserSchema.findById(
            project.studentId,
            "name email picture",
        ).lean(),
    );
    project.mentor = stringifyObjectId(
        await MentorSchema.findById(
            project.mentorId,
            "name email phoneNumber",
        ).lean(),
    );
    return project;
}
