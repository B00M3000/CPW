/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema, type ProjectDocument, type ProjectDocumentData } from '@/server/mongo/schemas/project';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { UserSchema } from '@/server/mongo/schemas/user';
import { buildRegex, stringifyObjectId } from '@/lib/utils';

import lowRelevance from "@/lib/lowRelevance";
import type { FilterQuery } from 'mongoose';

function parseIntOrElse(str: string | null, other: number): number {
    if(!str) return other;
    try { return parseInt(str); } 
    catch (e) { return other; }   
}

export async function load({ url: { searchParams } }) {
    const dbQuery: FilterQuery<ProjectDocument> = {};

    // Handle title querying
    const q = searchParams.get('q');
    if(q) {
        dbQuery.title = buildRegex(q.split(' ').filter((word) => {
            return !lowRelevance.includes(word) && !(word.length === 1);
        }))
    }

    // Handle tag filtering
    const tags = searchParams.get('tags')?.split("_");
    if(tags) dbQuery.tags = { $all: tags };

    // Handle year range filtering
    dbQuery.year = { $gte: parseIntOrElse(searchParams.get("yearLower"), 2019) };
    dbQuery.year = { ...dbQuery.year, $lte: parseIntOrElse(searchParams.get('yearUpper'), new Date().getFullYear()) };

    // Setting up cached injection of student and mentor data
    let cachedStudents: any = {};
    let cachedMentors: any = {};
    async function injectStudentAndMentor(project: any) {
        project.student = cachedStudents[project.studentId] || stringifyObjectId(await UserSchema.findById(project.studentId, 'firstName lastName picture').lean());
        project.mentor = cachedMentors[project.mentorId] || stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
        return project;
    }

    let returnEmpty = false;

    // Handle searchin via mentor
    const mentorSearch = searchParams.get('mentorSearch');
    if(mentorSearch){
        const mentorRegex = buildRegex(mentorSearch.split(" "))
        const mentors = (await MentorSchema.find({ name: mentorRegex }, 'firstName lastName').lean())?.map(stringifyObjectId);
        if(mentors.length > 0){
            mentors.forEach(m => cachedMentors[m._id] = m)
            dbQuery.mentorId = { $in: mentors.map(m => m._id)}
        } else {
            returnEmpty = true;
        }
    }

    // Handle searching via student
    const studentSearch = searchParams.get('studentSearch');
    if(studentSearch){
        const studentRegex = buildRegex(studentSearch.split(" "))
        const students = (await UserSchema.find({ name: studentRegex }, 'firstName lastName picture').lean())?.map(stringifyObjectId);
        if(students.length > 0){
            students.forEach(s => cachedMentors[s._id] = s)
            dbQuery.studentId = { $in: students.map(s => s._id)}
        } else {
            returnEmpty = true;
        }
    }

    // only reveal published projects
    dbQuery.publish = true;

    // paginate
    const page = Math.min(parseIntOrElse(searchParams.get('page'), 0), 10000);
    const itemsPerPage = Math.min(parseIntOrElse(searchParams.get('itemsPerPage'), 10), 50);
    console.log(searchParams.get("itemsPerPage"));
    const skip = page * itemsPerPage;

    const projects: ProjectDocumentData[] = returnEmpty ? [] : await ProjectSchema.find(dbQuery, 'studentId title year tags mentorId shortDesc').limit(itemsPerPage).skip(skip).lean() || [];
    const totalProjectCount: number = returnEmpty ? 0 : await ProjectSchema.find(dbQuery, 'studentId title year tags mentorId shortDesc').count();
    const inflatedProjects = await Promise.all(projects.map(stringifyObjectId).map(injectStudentAndMentor))
    return {
      inflatedProjects,
      totalProjectCount,
      searchParameters: {
        query: q || "",
        tags: tags || [],
        yearUpper: dbQuery.yearUpper || new Date().getFullYear(),
        yearLower: dbQuery.yearLower || 2019,
        mentorSearch: mentorSearch || "",
        studentSearch: studentSearch || "",
        page: page || 0,
        itemsPerPage: itemsPerPage || 10,
      },
      
    };
}
