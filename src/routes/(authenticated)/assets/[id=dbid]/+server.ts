import { AssetSchema, type AssetDocument } from '@/server/mongo/schemas/asset'
import { error } from '@sveltejs/kit';

export async function GET({ params: { id } }) {
    const asset = AssetSchema.findById(id);

    if(!asset) return error(404, "No Asset found with that ID");

    return new Response(asset.data, { status: 200, headers: { "Content-Type": asset.contentType }})
}