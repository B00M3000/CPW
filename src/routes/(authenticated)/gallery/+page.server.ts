import { stringifyObjectId } from "@/lib/utils.js";
import { AssetSchema } from "@/server/mongo/schemas/asset";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";

export async function load({ locals }) {
    const assets = (await AssetSchema.find({}, 'size desc').lean())?.map(stringifyObjectId);
    

    return { assets }
}