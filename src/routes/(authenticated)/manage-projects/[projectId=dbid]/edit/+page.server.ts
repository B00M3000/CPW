import { ProjectSchema } from "@/server/mongo/schemas/project";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export const load = async ({ params, parent }) => {
    const { project } = await parent();

    const mentor = stringifyObjectId(await MentorSchema.findById(project?.mentorId).lean())

    return { mentor };
}