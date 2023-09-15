import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export const load: PageServerLoad = async ({ locals }) => {
    const studentId = locals.user?.id;
    const student = stringifyObjectId(await UserSchema.findById(studentId).lean())
    const projects = (await ProjectSchema.find({studentId}).lean()).map(stringifyObjectId).map(p => ({ ...p, student })) || [];
    const inflatedProjects = await Promise.all(projects.map(injectMentor));
    return { projects }
}

async function injectMentor(project: any) {
    project.mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
    return project;
}