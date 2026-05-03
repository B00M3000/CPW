import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error, json } from "@sveltejs/kit";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";

export async function GET({ url: { searchParams } }) {
    const mentorId = searchParams.get("mentorId")?.trim();
    if (!mentorId) error(400, "mentorId is required");

    const projects = await ProjectSchema.find({ mentorId }, "_id title year studentId").lean();
    const inflated = await Promise.all(projects.map(stringifyObjectId).map(async (p: any) => {
        const student = await UserSchema.findById(p.studentId, "name").lean();
        p.studentName = student ? (student as any).name : "Unknown";
        return p;
    }));

    return json({ projects: inflated });
}
