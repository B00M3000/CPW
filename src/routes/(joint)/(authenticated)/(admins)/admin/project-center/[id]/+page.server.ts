import { stringifyObjectId } from '@/lib/utils';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import { error } from '@sveltejs/kit';

export async function load({ params: { id }}) {
    const project = stringifyObjectId(await ProjectSchema.findById(id, 'report mentorId title shortDesc tags').lean());
    if(!project) error(404, "Project not found by that id.")

    const mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId).lean());

    return { project, mentor };
}
