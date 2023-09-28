import { stringifyObjectId } from "@/lib/utils.js";
import { AssetSchema } from "@/server/mongo/schemas/asset";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";

export async function load({ locals }) {
    const assets = (await AssetSchema.find({ ownerId: locals.user.id }, 'size desc').lean())?.map(stringifyObjectId);
    const projects = (await ProjectSchema.find({ studentId: locals.user.id }, 'title').lean())?.map(stringifyObjectId);

    return { assets, projects }
}