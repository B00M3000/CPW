import { MobileKeySchema } from '@/server/mongo/schemas/mobileKey';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import { error } from '@sveltejs/kit';

import { nanoid } from 'nanoid';

export async function load({ params, locals, url }) {
    const projectId = url.searchParams.get('projectId');

    if(!projectId) {
        return error(400, "No project ID provided in query.")
    }

    const project = await ProjectSchema.findById(projectId);

    if(!project) {
        return error(404, "Project not found.")
    }

    if(locals?.user?.id != project.studentId) {
        return error(403, "Please do not mess with other peoples projects.")
    }

    let mobileKey: string = nanoid();

    await new MobileKeySchema({ projectId, userId: locals?.user?.id, mobileKey }).save()

    return { mobileKey }
};
