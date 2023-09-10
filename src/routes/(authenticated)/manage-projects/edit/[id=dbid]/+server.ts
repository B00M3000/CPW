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
        let schema = await ProjectSchema.findById(project._id)
        if(schema){
            schema.title = project.title
            schema.year = project.year 
            schema.tags = project.tags
            schema.shortDesc = project.shortDescription 
            schema.fullReport = project.fullReport
            schema.underReview = project.underReview
        } else {
          console.log("???????????")
          throw error(400, 'Something happened when inserting mentor or student.');
        }

    } else {
        throw error(400, `Invalid Request Type! Must be CREATE, EDIT or DELETE given ${data.action.toUpperCase()}`)
    }   

    return json({ message: "Actions Successfully Executed." });
}

async function modifyMentor(data: any){

  const foundMentor = await MentorSchema.findOne({ email: data.mentorEmail});

  if(foundMentor){
    foundMentor.firstName = data.mentorFirst;
    foundMentor.lastName = data.mentorLast;
    foundMentor.email = data.mentorEmail;
    foundMentor.organization = data.mentorOrg;
    foundMentor.phoneNumber = data.mentorPhone;
  } else {
    throw error(400, "could not find mentor")
  }
}






