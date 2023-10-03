import { error } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';

export async function load({ locals, params }) {
    let projectId = params.projectId;

    let project = await ProjectSchema.findById(projectId);
    if(project){
        if(!(locals.user.adviseeIds.includes(project.studentId))) throw error(403, "Access denied, not the adivosr of this student.") 
    } else {
        throw error(404, 'Invalid Project')
    }
};
