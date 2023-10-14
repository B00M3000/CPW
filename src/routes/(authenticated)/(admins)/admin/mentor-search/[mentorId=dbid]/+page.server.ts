import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { stringifyObjectId } from "@/lib/utils";

export async function load({ params: { mentorId } }) {
    const mentor = stringifyObjectId(await MentorSchema.findById(mentorId).lean())
    
    return { mentor, mentorId };
}