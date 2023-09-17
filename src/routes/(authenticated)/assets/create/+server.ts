import { AssetSchema, type AssetDocument } from '@/server/mongo/schemas/asset'
import { error } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const data = await request.arrayBuffer();

    console.log(data);
}