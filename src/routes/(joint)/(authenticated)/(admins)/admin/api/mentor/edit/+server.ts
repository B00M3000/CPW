import { MentorSchema } from '@/server/mongo/schemas/mentor.js';
import { error, json, text } from '@sveltejs/kit';

export async function POST({ request }) {
    const newMentorInformation = await request.json();

    if(!newMentorInformation._id) error(400, "Request must contain a mentor _id!")

    await MentorSchema.updateOne({ _id: newMentorInformation._id }, {
        ...newMentorInformation
    })

    return json({ message: "updated" })
}
