/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export const load: PageServerLoad = async ({ locals, depends }) => {
    depends("user:projects");
    const studentId = locals.user?._id;
    const student = stringifyObjectId(
        await UserSchema.findById(studentId, "name picture").lean(),
    );
    const projects =
        (await ProjectSchema.find({ studentId }).lean())
            .map(stringifyObjectId)
            .map((p) => ({ ...p, student })) || [];
    const inflatedProjects = await Promise.all(projects.map(injectMentor));
    return { projects: inflatedProjects };
};

async function injectMentor(project: any) {
    project.mentor = stringifyObjectId(
        await MentorSchema.findById(project.mentorId, "name").lean(),
    );
    return project;
}
