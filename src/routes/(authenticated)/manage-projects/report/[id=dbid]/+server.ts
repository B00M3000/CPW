import { ProjectSchema } from '@/server/mongo/schemas/project';
import { UserSchema } from '@/server/mongo/schemas/user';
import { stringifyObjectId } from "@/lib/utils";
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    const data = await request.json();
    const action = data.action?.toUpperCase()
    if(action == "CREATE"){
        const project = data;
        let schema = await ProjectSchema.findById(project.projectId)
        if(schema){
            schema.fullReport = project.fullReport;
            schema.save()
        } else {
          throw error(400, 'Something happened when inserting mentor or student.');
        }

    } else {
        throw error(400, `Invalid Request Type! Must be CREATE, EDIT or DELETE given ${data.action.toUpperCase()}`)
    }   

    return json({ message: "Actions Successfully Executed." });
}








