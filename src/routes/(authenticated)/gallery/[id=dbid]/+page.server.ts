
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";
import { AssetSchema } from "@/server/mongo/schemas/asset";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    //const project = stringifyObjectId(await ProjectSchema.findOne({ imageIds: {id}}).lean());
    const asset = stringifyObjectId(await AssetSchema.findOne({ _id: id}, 'size desct ownerId').lean()); 
    const student = stringifyObjectId(await UserSchema.findById(asset?.ownerId).lean())
    console.log(asset)
    console.log(student)
    return { asset, student };
}