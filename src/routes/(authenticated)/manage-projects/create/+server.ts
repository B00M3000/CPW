import { ProjectSchema } from '@/server/mongo/schemas/project';
import { UserSchema } from '@/server/mongo/schemas/user';
import { error, json } from '@sveltejs/kit';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { stringifyObjectId } from "@/lib/utils";

export async function POST({ request, locals }) {
    const data = await request.json();
    const action = data[0].action?.toUpperCase()
    const mentorId = await createOrFindMentor(data[0]);
    console.log(mentorId)
    if(action == "CREATE"){
        const project = data[0];
        let schema = new ProjectSchema({ 
          title: project.title, 
          year: project.year, 
          tags: project.tags, 
          shortDesc: project.shortDescription, 
          fullReport: project.fullReport,
          underReview: project.underReview,
          mentorId: mentorId,
          studentId: locals.user?.id 
        })

        if(schema.mentorId && schema.studentId){
          await schema.save();
        } else {
          console.log("???????????")
          throw error(400, 'Something happened when inserting mentor or student.');
        }

    } else {
        throw error(400, `Invalid Request Type! Must be CREATE, EDIT or DELETE given ${data.action.toUpperCase()}`)
    }   

    return json({ message: "Actions Successfully Executed." });
}

async function createOrFindMentor(data: any){

  const foundMentor = await MentorSchema.findOne({ email: data.mentorEmail});

  if(foundMentor){
    return foundMentor._id.valueOf()
  } else {
    let mentorSchema = new MentorSchema({
      firstName: data.mentorFirst,
      lastName: data.mentorLast,
      name: data.mentorFirst + " " + data.mentorLast,
      organization: data.mentorOrg,
      email: data.mentorEmail,
      phoneNumber: data.mentorPhone
    });
    await mentorSchema.save();
    return mentorSchema._id.valueOf();
  }
}






