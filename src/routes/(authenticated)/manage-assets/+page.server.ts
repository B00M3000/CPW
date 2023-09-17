import { AssetSchema } from "@/server/mongo/schemas/asset";

export async function load({ locals }) {
    const assets = await AssetSchema.find({ ownerId: locals.user.id }, 'size description');

    return { assets }
}