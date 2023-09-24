import { ProjectSchema } from '@/server/mongo/schemas/project';
import { UserSchema } from '@/server/mongo/schemas/user';
import { error, json } from '@sveltejs/kit';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { stringifyObjectId } from "@/lib/utils";

export async function POST({ request  }) {
    const { mentor, project } = await request.json();

    await MentorSchema.findOneAndUpdate({ email: mentor.email }, {
      ...mentor
    })

    await ProjectSchema.findOneAndUpdate({ _id: project._id }, {
      ...project
    })

    return json({ message: "Project has been updated." });
}





