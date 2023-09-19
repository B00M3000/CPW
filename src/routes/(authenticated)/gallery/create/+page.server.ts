import { stringifyObjectId } from "@/lib/utils.js";
import { AssetSchema } from "@/server/mongo/schemas/asset";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";

export async function load({ locals }) {

    const projects = (await ProjectSchema.find({ studentId: locals.user.id }, 'title').lean())?.map(stringifyObjectId);

    return { projects }
}