import { UserSchema } from "@/server/mongo/schemas/user";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export const load: PageServerLoad = async ({ params }) => {
    const studentId = params.id;

    const student = stringifyObjectId(await UserSchema.findById(studentId).lean())
    const projects = (await ProjectSchema.find({ studentId }).lean())?.map(stringifyObjectId).map(p => ({ ...p, student })) || [];

    const inflatedProjects = await Promise.all(projects.map(injectMentor));

    return { projects: inflatedProjects, student };

}

async function injectMentor(project: any) {
    project.mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
    return project;
}