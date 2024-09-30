import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { json, text } from "@sveltejs/kit";

export async function GET() {
    const allMentors = await MentorSchema.find({}, '')
    let unlinkedCount = 0;
    await Promise.all(allMentors.map(async ({ _id }) => {
        if(!await ProjectSchema.find({ mentorId: _id }).exists("_id", true)) unlinkedCount++;
    }))
    return json({ unlinkedCount })
}

export async function DELETE() {
    const allMentors = await MentorSchema.find({}, '')
    await Promise.all(allMentors.map(async ({ _id }) => {
        if(!await ProjectSchema.find({ mentorId: _id }).exists("_id", true)) MentorSchema.deleteOne({ _id });
    }))
    return text("Purge complete!")
}
