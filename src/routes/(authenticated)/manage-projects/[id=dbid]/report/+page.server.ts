import { ProjectSchema } from "@/server/mongo/schemas/project";
import { stringifyObjectId } from "@/lib/utils";

export const load = async ({ params }) => {
    const id = params.id;
    const project = stringifyObjectId(await ProjectSchema.findById(id).lean());

    return { project, id };
}