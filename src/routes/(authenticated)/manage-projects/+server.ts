import { error, json } from '@sveltejs/kit';
import { ProjectSchema } from '@/server/mongo/schemas/project';
import type { Project } from '@/interfaces/project.js';
import { MentorSchema } from '@/server/mongo/schemas/mentor';

export async function POST({ request }) {
    const data = await request.json();
    const project = data[0].project
    const action = data[0].action;
    if(action == "DELETE"){
        await ProjectSchema.deleteOne({ _id: project._id });
        mentorDelete(project)
    } else {
        throw error(400, 'Something happened')
    }
    
    return json({ message: "Actions Successfully Executed." });
}

async function mentorDelete(data: any){
    const mentorId = data.mentorId;
    const projectsOfMentor = await ProjectSchema.find({ mentorId: mentorId}) || [];
    if(projectsOfMentor.length == 0 ){
        await MentorSchema.deleteOne({ _id: mentorId })
    }
}