import { error, json } from '@sveltejs/kit';
import { ProjectSchema } from '@/server/mongo/schemas/project';
import type { Project } from '@/interfaces/project.js';
import { MentorSchema } from '@/server/mongo/schemas/mentor';

export async function POST({ request, locals }) {
    const data = await request.json();
    const { action, projectId } = data
    
    if(action == "DELETE"){
        await ProjectSchema.deleteOne({ _id: projectId, studentId: locals.user.id });
        
        const mentorId = data.mentorId;
        const projectsOfMentor = await ProjectSchema.find({ mentorId: mentorId }) || [];

        if(projectsOfMentor.length == 0){
            await MentorSchema.deleteOne({ _id: mentorId })
        }
    } else if (action == "PUBLISH"){
        let schema = await ProjectSchema.findOne({ _id: projectId, studentId: locals.user.id }, 'publish');

        console.log(schema)

        if(schema){
            await ProjectSchema.updateOne({ _id: projectId }, { publish: !schema.publish })
        }
    } else {
        throw error(400, `Invalid action type provided. Given ${action}.`)
    }
    
    return json({ message: "Action Successfully Executed." });
}