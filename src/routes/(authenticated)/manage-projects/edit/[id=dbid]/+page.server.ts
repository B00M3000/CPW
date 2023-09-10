import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    const project = stringifyObjectId(await ProjectSchema.findById(id).lean());
    console.log(project)
    return { project };
}