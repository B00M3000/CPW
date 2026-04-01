/*
 * Created on Sat Oct 14 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";
import type { PageServerLoad } from "./$types";

async function injectStudentAndMentor(project: any) {
    const student = await UserSchema.findById(
        project.studentId,
        "name email picture",
    ).lean();
    const mentor = await MentorSchema.findById(
        project.mentorId,
        "name email phoneNumber",
    ).lean();

    if (!student || !mentor) {
        throw new Error("Could not inflate project relations.");
    }

    project.student = stringifyObjectId(
        student as any,
    );
    project.mentor = stringifyObjectId(
        mentor as any,
    );
    return project;
}

export const load: PageServerLoad = async ({ params: { projectId } }) => {
    const projectDoc = await ProjectSchema.findById(projectId).lean();
    if (!projectDoc) {
        throw new Error(`Project not found: ${projectId}`);
    }

    const project = stringifyObjectId(projectDoc as any);
    const inflatedProject = await injectStudentAndMentor(project);
    inflatedProject.pdfUrl = inflatedProject.pdf?.s3ObjectKey
        ? `/project-pdfs/${inflatedProject._id.toString()}`
        : null;
    return { inflatedProject, projectId };
};
