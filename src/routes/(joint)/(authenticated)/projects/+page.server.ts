/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import {
    ProjectSchema,
    type ProjectDocument,
    type ProjectDocumentData,
} from "@/server/mongo/schemas/project";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";
import {
    buildRegex,
    clamp,
    currentYear,
    parseIntOrElse,
    stringifyObjectId,
} from "@/lib/utils";

import lowRelevance from "@/lib/lowRelevance";
import type { FilterQuery } from "mongoose";

export async function load({ url: { searchParams } }) {
    const dbQuery: FilterQuery<ProjectDocument> = {};

    // Handle title querying
    const q = searchParams.get("q");
    if (q) {
        dbQuery.title = buildRegex(
            q.split(" ").filter((word) => {
                return !lowRelevance.includes(word) && !(word.length === 1);
            }),
        );
    }

    // Handle tag filtering
    const tags = searchParams.get("tags")?.split("_");
    if (tags) dbQuery.tags = { $all: tags };

    // Handle year range filtering
    dbQuery.year = {
        $gte: parseIntOrElse(searchParams.get("yearLower"), 2019),
    };
    dbQuery.year = {
        ...dbQuery.year,
        $lte: parseIntOrElse(searchParams.get("yearUpper"), currentYear()),
    };

    // Setting up cached injection of student and mentor data
    const cachedStudents: any = {};
    const cachedMentors: any = {};
    async function injectStudentAndMentor(project: any) {
        project.student =
            cachedStudents[project.studentId] ||
            stringifyObjectId(
                await UserSchema.findById(
                    project.studentId,
                    "name picture",
                ).lean(),
            );
        project.mentor =
            cachedMentors[project.mentorId] ||
            stringifyObjectId(
                await MentorSchema.findById(project.mentorId, "name").lean(),
            );
        return project;
    }

    let returnEmpty = false;

    // Handle searchin via mentor
    const mentorSearch = searchParams.get("mentorSearch");
    if (mentorSearch) {
        const mentorRegex = buildRegex(mentorSearch.split(" "));
        const mentors = (
            await MentorSchema.find({ name: mentorRegex }, "name").lean()
        )?.map(stringifyObjectId);
        if (mentors.length > 0) {
            mentors.forEach((m) => (cachedMentors[m._id] = m));
            dbQuery.mentorId = { $in: mentors.map((m) => m._id) };
        } else {
            returnEmpty = true;
        }
    }

    // Handle searching via student
    const studentSearch = searchParams.get("studentSearch");
    if (studentSearch) {
        const studentRegex = buildRegex(studentSearch.split(" "));
        const students = (
            await UserSchema.find({ name: studentRegex }, "name").lean()
        )?.map(stringifyObjectId);
        if (students.length > 0) {
            students.forEach((s) => (cachedMentors[s._id] = s));
            dbQuery.studentId = { $in: students.map((s) => s._id) };
        } else {
            returnEmpty = true;
        }
    }

    // only reveal published projects
    dbQuery.publish = true;

    // paginate
    const page = clamp(parseIntOrElse(searchParams.get("page"), 0), 0, 10000);
    const itemsPerPage = clamp(
        parseIntOrElse(searchParams.get("itemsPerPage"), 10),
        1,
        50,
    );
    const skip = page * itemsPerPage;

    const projects: ProjectDocumentData[] = returnEmpty
        ? []
        : (await ProjectSchema.find(
              dbQuery,
              "studentId title year tags mentorId shortDesc",
          )
              .limit(itemsPerPage)
              .skip(skip)
              .lean()
              .sort("-createdAt")) || [];
    const totalProjectCount: number = returnEmpty
        ? 0
        : await ProjectSchema.countDocuments(
              dbQuery
          );
    const inflatedProjects = await Promise.all(
        projects.map(stringifyObjectId).map(injectStudentAndMentor),
    );
    return {
        inflatedProjects,
        totalProjectCount,
        searchParameters: {
            query: q || "",
            tags: tags || [],
            yearUpper: dbQuery.yearUpper || currentYear(),
            yearLower: dbQuery.yearLower || 2019,
            mentorSearch: mentorSearch || "",
            studentSearch: studentSearch || "",
            page: page || 0,
            itemsPerPage: itemsPerPage || 10,
        },
    };
}
