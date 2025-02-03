/*
 * Created on Sun Feb 4 2024
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema, type ProjectDocument } from "@/server/mongo/schemas/project";
import { currentYear, stringifyObjectId } from "@/lib/utils";
import { UserSchema, type UserDocument } from "@/server/mongo/schemas/user";
import { AccountType } from "@/lib/enums";

export const load = async () => {
    const allStudents = (
        await UserSchema.find({
            accountType: AccountType.Student,
            graduationYear: { $gte: currentYear() },
        }).lean()
    )?.map((student) => stringifyObjectId(student as UserDocument)) || [];

    const projects = await ProjectSchema.find(
        { year: currentYear() },
        "studentId underReview title",
    ).lean();


    const missingStudents = await Promise.all(allStudents.filter(
        (student) =>
            !projects.some((project) => project.studentId == student._id),
    ).map(injectAdvisor));

    const inflatedUnapprovedProjects = await Promise.all(
        projects
            .filter((project) => project.underReview)
            ?.map((project) => stringifyObjectId(project as ProjectDocument))
            .map(injectStudentAndAdvisor),
    );


    return { missingStudents, inflatedUnapprovedProjects };
};

async function injectAdvisor(student: any) {
    const advisor = await UserSchema.findOne(
        { adviseeIds: student._id },
        "name email picture",
    ).lean() as UserDocument

    student.advisor = advisor ? stringifyObjectId(advisor) : undefined

    return student;
}


async function injectStudentAndAdvisor(project: any) {
    project.student = stringifyObjectId(
        await UserSchema.findById(
            project.studentId,
            "name email graduationYear schoolId picture",
        ).lean() as UserDocument
    );

    project.advisor = stringifyObjectId(
        await UserSchema.findOne(
            { adviseeIds: project.student._id },
            "name email picture",
        ).lean() as UserDocument
    );

    return project;
}
