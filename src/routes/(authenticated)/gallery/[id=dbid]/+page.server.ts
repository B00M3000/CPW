
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";
import { AssetSchema } from "@/server/mongo/schemas/asset";
import { ProjectSchema } from "@/server/mongo/schemas/project";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    const asset = stringifyObjectId(await AssetSchema.findOne({ _id: id}, 'size desct ownerId projectId').lean()); 
    const student = stringifyObjectId(await UserSchema.findById(asset?.ownerId).lean())
    const project = stringifyObjectId(await ProjectSchema.findById(asset?.projectId).lean());

    return { asset, student, project };
}