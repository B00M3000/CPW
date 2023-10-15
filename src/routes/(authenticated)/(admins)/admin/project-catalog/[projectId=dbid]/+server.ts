import { ProjectSchema } from '@/server/mongo/schemas/project';
import { json } from '@sveltejs/kit';

export async function POST({ request, params: { projectId } }) {
    const req = await request.json();
    if(req.Action == "SAVE"){
        const fullReport = req.fullReport
        await ProjectSchema.findOneAndUpdate({
            _id: projectId
        }, { fullReport });
    } else if(req.Action == "PUBLISH") {
        const publish = req.publish;
        await ProjectSchema.findOneAndUpdate({
            _id: projectId
        }, { publish });
    }

    return json({ message: "Report updated successfully!" });
}
