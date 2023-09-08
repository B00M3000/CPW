import { ProjectSchema, type ProjectDocumentData } from '@/server/mongo/schemas/project';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { UserSchema } from '@/server/mongo/schemas/user';

import lowRelevance from "@/client/data/generated/low-relevance.json";

function buildRegex(keywords: string[]){
    return new RegExp(keywords.map((w:string) => `(?=.*?${w})`).join("") + ".*",   "i");
}

export async function load({ url }) {
    // const searchParams = url.searchParams

    // const tags = searchParams.get('tags')?.split("_")
    // const yearUpper = searchParams.get('yearUpper');
    // const yearLower = searchParams.get('yearLower');
    // const mentorSearch = searchParams.get('mentorSearch');
    // const studentSearch = searchParams.get('studentSearch');
    // const title = searchParams.get('query')?.split(" ");
    // let titleRegex: RegExp = new RegExp("/");

    // if(title){
    //     titleRegex = buildRegex(title.filter((word) => {
    //         return !lowRelevance.includes(word) && !(word.length === 1);
    //     }))
    // }

    // const projects = await ProjectSchema.find({ tags, title: titleRegex });

    const projects: ProjectDocumentData[] = await ProjectSchema.find({}, 'studentId title year tags mentorId shortDescription').lean();

    const inflatedProjects = await Promise.all(projects.map(injectStudentAndMentor))

    return { projects: inflatedProjects }
}

async function injectStudentAndMentor(project: ProjectDocumentData) {
    project.student = stringifyObjectId(await UserSchema.findById(project.studentId, 'firstName lastName').lean());
    project.mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
    return project;
}

function stringifyObjectId(document: Object | null | undefined){
    if(document) document._id = document?._id.toString();
    return document
}
