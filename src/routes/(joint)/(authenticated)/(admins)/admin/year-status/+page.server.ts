/*
 * Created on Sun Feb 4 2024
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { currentYear, stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";
import { AccountType } from "@/lib/enums";

export const load = async () => {
    const allStudents = (
        await UserSchema.find({
            accountType: AccountType.Student,
            graduationYear: { $gte: currentYear() },
        }).lean()
    )?.map(stringifyObjectId);

    const projects = await ProjectSchema.find(
        { year: currentYear() },
        "studentId underReview title",
    ).lean();

    const missingStudents = allStudents.filter(
        (student) =>
            !projects.some((project) => project.studentId == student._id),
    );
    const inflatedUnapprovedProjects = await Promise.all(
        projects
            .filter((project) => project.underReview)
            ?.map(stringifyObjectId)
            .map(injectStudentAndAdvisor),
    );

    return { missingStudents, inflatedUnapprovedProjects };
};

async function injectStudentAndAdvisor(project: any) {
    project.student = stringifyObjectId(
        await UserSchema.findById(
            project.studentId,
            "name email graduationYear picture lastVisit",
        ).lean(),
    );
    project.advisor = stringifyObjectId(
        await UserSchema.findOne(
            { adviseeIds: project.student._id },
            "name email picture",
        ).lean(),
    );
    return project;
}
