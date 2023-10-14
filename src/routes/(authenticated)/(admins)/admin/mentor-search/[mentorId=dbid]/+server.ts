import { MentorSchema } from '@/server/mongo/schemas/mentor.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request  }) {
    const { mentor } = await request.json();
    await MentorSchema.findOneAndUpdate({ _id: mentor._id }, {
      ...mentor
    })

    return json({ message: "Mentor has been updated." });
}
