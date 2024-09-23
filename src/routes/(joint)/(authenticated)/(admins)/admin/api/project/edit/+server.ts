import { ProjectSchema } from '@/server/mongo/schemas/project';
import { error, json, text } from '@sveltejs/kit';

export async function POST({ request }) {
    const newProjectInformation = await request.json();

    if(!newProjectInformation._id) error(400, "Request must contain a project _id!")

    await ProjectSchema.updateOne({ _id: newProjectInformation._id }, {
        ...newProjectInformation
    })

    return json({ message: "updated" })
}
