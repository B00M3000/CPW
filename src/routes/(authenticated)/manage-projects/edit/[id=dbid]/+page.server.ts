import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    const project = stringifyObjectId(await ProjectSchema.findById(id).lean());
    const mentor = stringifyObjectId(await MentorSchema.findById(project.mentorId).lean())

    return { project, mentor };
}