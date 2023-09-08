import { ProjectSchema, type ProjectDocument, type ProjectDocumentData } from '@/server/mongo/schemas/project';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { UserSchema } from '@/server/mongo/schemas/user';

import lowRelevance from "@/client/data/generated/low-relevance.json";
import type { FilterQuery } from 'mongoose';

export async function load({ url }) {
    const searchParams = url.searchParams;

    const dbQuery: FilterQuery<ProjectDocument> = {};

    const title = searchParams.get('query')?.split(" ");
    if(title){
        dbQuery.title = buildRegex(title.filter((word) => {
            return !lowRelevance.includes(word) && !(word.length === 1);
        }))
    }

    const tags = searchParams.get('tags')?.split("_")
    if(tags) dbQuery.tags = tags

    const yearUpper = searchParams.get('yearUpper');
    const yearLower = searchParams.get('yearLower');
    if(yearLower || yearUpper) dbQuery.year = { $gte: yearLower ? parseInt(yearLower) : undefined, $lte: yearUpper ? parseInt(yearUpper) : undefined };

    let cachedStudents: any = {}
    let cachedMentors: any = {}

    async function injectStudentAndMentor(project: any) {
        project.student = cachedStudents[project.studentId] || stringifyObjectId(await UserSchema.findById(project.studentId, 'firstName lastName').lean());
        project.mentor = cachedMentors[project.mentorId] || stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
        return project;
    }

    const mentorSearch = searchParams.get('mentorSearch');
    if(mentorSearch){
        const mentorRegex = buildRegex(mentorSearch.split(" "))
        const mentors = (await MentorSchema.find({ name: mentorRegex }, 'firstName lastName').lean())?.map(stringifyObjectId);
        if(mentors.length > 0){
            mentors.forEach(m => cachedMentors[m._id] = m)
            dbQuery.mentorId = { $in: mentors.map(m => m._id)}
        }
    }

    const studentSearch = searchParams.get('studentSearch');
    if(studentSearch){
        const studentRegex = buildRegex(studentSearch.split(" "))
        console.log(studentRegex)
        const students = (await UserSchema.find({ name: studentRegex }, 'firstName lastName').lean())?.map(stringifyObjectId);
        if(students.length > 0){
            students.forEach(s => cachedMentors[s._id] = s)
            dbQuery.studentId = { $in: students.map(s => s._id)}
        }
    }

    console.log(dbQuery, cachedMentors, cachedStudents)

    const projects: ProjectDocumentData[] = await ProjectSchema.find(dbQuery, 'studentId title year tags mentorId shortDescription').lean();

    const inflatedProjects = await Promise.all(projects.map(stringifyObjectId).map(injectStudentAndMentor))

    return { projects: inflatedProjects }
}

function buildRegex(keywords: string[]){
    return new RegExp(keywords.map((w:string) => `(?=.*?${w})`).join("") + ".*",   "i");
}

function stringifyObjectId(document: Object | null | undefined) {
    if(document) document._id = document?._id.toString();
    return document
}
