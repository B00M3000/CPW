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
import { UserSchema, type UserDocument } from "@/server/mongo/schemas/user";
import {
    buildRegex,
    clamp,
    currentYear,
    parseIntOrElse,
    stringifyObjectId,
} from "@/lib/utils";

import lowRelevance from "@/lib/lowRelevance";
import type { FilterQuery } from "mongoose";
import Zod from "zod";

export async function load({ url: { searchParams } }) {
    const aggregate = ProjectSchema.aggregate();

    // Handle title querying
    const q = searchParams.get("q");
    if (q) {
        aggregate.search({
            index: "project_search",
            compound: {
                should: [
                    {
                        text: {
                            query: q,
                            path: "title",
                        }
                    },
                    {
                        text: {
                            query: q,
                            path: "shortDesc",
                        }
                    },
                    {
                        text: {
                            query: q,
                            path: "fullReport",
                        }
                    }
                ]
            }
        }).addFields({ score: { $meta: "searchScore" } }).sort({ score: -1 })
    } else {
        aggregate.sort("-createdAt")
    }

    // Handle tag filtering
    const tags = searchParams.get("tags")?.split("_");
    if (tags) aggregate.match({ tags: { $all: tags } });

    // Handle year range filtering
    let yearLower = parseIntOrElse(searchParams.get("yearLower"), 2019);
    let yearUpper = parseIntOrElse(searchParams.get("yearUpper"), currentYear());
    aggregate.match({
        year: {
            $gte: yearLower,
            $lte: yearUpper,
        }
    })

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
                ).lean() as UserDocument,
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
            // maybe add fuzzy searching
        )?.map(stringifyObjectId);
        if (mentors.length > 0) {
            mentors.forEach((m) => (cachedMentors[m._id] = m));
            aggregate.match({ mentorId: { $in: mentors.map((m) => m._id) } });
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
        // fuzzy searching? or also just add searching on client side
        if (students.length > 0) {
            students.forEach((s) => (cachedMentors[s._id] = s));
            aggregate.match({ studentId: { $in: students.map((s) => s._id) } });
        } else {
            returnEmpty = true;
        }
    }

    // only reveal published projects
    aggregate.match({ publish: true })

    // paginate
    const page = clamp(parseIntOrElse(searchParams.get("page"), 0), 0, 10000);
    const itemsPerPage = clamp(
        parseIntOrElse(searchParams.get("itemsPerPage"), 10),
        1,
        50,
    );
    const skip = page * itemsPerPage;

    const projects = returnEmpty
        ? []
        : (await ProjectSchema.aggregate(aggregate.pipeline())
              .project({
                  _id: 1,
                  studentId: 1,
                  title: 1,
                  year: 1,
                  tags: 1,
                  mentorId: 1,
                  shortDesc: 1,
              })
              .skip(skip)
              .limit(itemsPerPage)) || [];

    const totalProjectCount: number = returnEmpty
        ? 0
        : (await ProjectSchema.aggregate(aggregate.pipeline()).count("total"))[0]
              .total;

    const inflatedProjects = await Promise.all(
        projects.map(stringifyObjectId).map(injectStudentAndMentor),
    );

    // Removed debug console.log statement to avoid logging internal details in production.

    return {
        inflatedProjects,
        totalProjectCount,
        searchParameters: {
            query: q || "",
            tags: tags || [],
            yearUpper: yearUpper || currentYear(),
            yearLower: yearLower || 2019,
            mentorSearch: mentorSearch || "",
            studentSearch: studentSearch || "",
            page: page || 0,
            itemsPerPage: itemsPerPage || 10,
        },
    };
}
