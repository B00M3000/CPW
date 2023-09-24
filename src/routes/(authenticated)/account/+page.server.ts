import { AssetSchema } from "@/server/mongo/schemas/asset.js";
import { ProjectSchema } from "@/server/mongo/schemas/project";

export async function load({ locals }){

    const projectCount = await ProjectSchema.count({ studentId: locals.user?.id });
    const projectCountNotPublished = await ProjectSchema.count({ publish: false, studentId: locals.user?.id})
    const assetCount =  await AssetSchema.count({ ownderId: locals.user?.id })
    return { projectCount, projectCountNotPublished, assetCount};
}