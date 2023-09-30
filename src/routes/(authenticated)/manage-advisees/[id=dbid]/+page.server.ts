import { AccessLevel } from '@/lib/enums';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import { MentorSchema } from '@/server/mongo/schemas/mentor';

export async function load({ locals, params }) {
    const id = params.id;
    const student = stringifyObjectId(await UserSchema.findById(id).lean())
    const projects = (await ProjectSchema.find({ studentId: id }).lean()).map(stringifyObjectId).map(p => ({ ...p, student })) || [];

    const inflatedProjects = await Promise.all(projects.map(injectMentor));

    return { student, projects: inflatedProjects }
};


async function injectMentor(project: any) {
    project.mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId, 'firstName lastName').lean());
    return project;
}
