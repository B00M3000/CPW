import { MobileKeySchema } from "@/server/mongo/schemas/mobileKey";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { error } from "@sveltejs/kit";

import { nanoid } from "nanoid";

export async function GET({ locals, url }) {
    const projectId = url.searchParams.get("projectId");
    if (!projectId) error(400, "No project ID provided in query.");
    const project = await ProjectSchema.findById(projectId);
    if (!project) error(404, "Project not found.");
    if (locals?.user?._id != project.studentId)
        error(403, "Please do not mess with other peoples project images.");
    let mobileKey: string = nanoid();
    await new MobileKeySchema({
        projectId,
        userId: locals?.user?._id,
        mobileKey,
    }).save();
    return new Response(JSON.stringify({ mobileKey }), { status: 200 });
}
