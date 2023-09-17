import { ProjectSchema } from '@/server/mongo/schemas/project';
import { UserSchema } from '@/server/mongo/schemas/user';
import { error, json } from '@sveltejs/kit';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { stringifyObjectId } from "@/lib/utils";

export async function POST({ request, locals }) {
    const data = await request.json();
    const action = data.action.toUpperCase();
    let mentorId = data.mentorId;

    if(action != "CREATE") throw error(400, `Invalid Request Type! Must be CREATE given ${data.action.toUpperCase()}`)

    if(!mentorId) {
      const mentorSchema = new MentorSchema({
        ...data.mentor,
        name: `${data.mentor.firstName} ${data.mentor.lastName}`
      })
      const savedMentorSchema = await mentorSchema.save();
      mentorId = savedMentorSchema._id
    }

    const project = data.project;
    let schema = new ProjectSchema({ 
      title: project.title, 
      year: new Date().getFullYear(), 
      tags: project.tags, 
      shortDesc: project.shortDesc, 
      fullReport: "",
      underReview: true,
      publish: false,
      mentorId: mentorId,
      studentId: locals.user?.id 
    })

    await schema.save();

    return json({ message: "Actions Successfully Executed." });
}





