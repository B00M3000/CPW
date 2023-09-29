import { stringifyObjectId } from "@/lib/utils.js";
import { AssetSchema } from "@/server/mongo/schemas/asset";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";

export async function load({ locals, params }) {

    const id = params.id;
    const assets = (await AssetSchema.find({ projectId: id }, 'size desc').lean())?.map(stringifyObjectId);


    return { assets }
}