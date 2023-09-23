import { ProjectSchema } from '@/server/mongo/schemas/project';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    const data = await request.json();

    const project = data;
    let schema = await ProjectSchema.findById(project.projectId)
    if(schema){
        schema.fullReport = project.fullReport;
        schema.save()
    } else {
        throw error(400, 'Something happened when inserting mentor or student.');
    }

    return json({ message: "Actions Successfully Executed." });
}








