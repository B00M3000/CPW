import { ProjectSchema } from '@/server/mongo/schemas/project';
import { UserSchema } from '@/server/mongo/schemas/user';
import { error, json } from '@sveltejs/kit';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { stringifyObjectId } from "@/lib/utils";

export async function POST({ request, locals }) {
    const data = await request.json();

    console.log(data)
    const action = data.action?.toUpperCase()
    modifyMentor(data.currentMentor);

    if(action == "CREATE"){
        const project = data.currentProj;
        let schema = await ProjectSchema.findById(project.projectId)
        console.log(schema)
        if(schema){
            schema.title = project.title
            schema.tags = project.tags
            schema.shortDesc = project.shortDesc
            console.log(schema)
            schema.save()
        } else {
          console.log("???????????")
          throw error(400, 'Something happened when inserting mentor or student.');
        }

    } else {
        throw error(400, `Invalid Request Type! Must be CREATE, EDIT or DELETE given ${data.action.toUpperCase()}`)
    }   

    return json({ message: "Actions Successfully Executed." });
}

async function modifyMentor(mentor: any){
  //console.log(mentor)
  const foundMentor = await MentorSchema.findOne({ email: mentor.email});
  console.log(foundMentor)
  if(foundMentor){
    foundMentor.firstName = mentor.firstName;
    foundMentor.lastName = mentor.lastName;
    foundMentor.email = mentor.email;
    foundMentor.organization = mentor.organization;
    foundMentor.phoneNumber = mentor.phoneNumber;
    foundMentor.save()
  } else {
    throw error(400, "could not find mentor")
  }
}






