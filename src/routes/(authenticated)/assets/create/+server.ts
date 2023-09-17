import { AssetSchema } from '@/server/mongo/schemas/asset'
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const contentType = request.headers.get('content-type') || '';

    if(!/^image\/.*$/.test(contentType)) return error(400, "Must be an image/*")

    const data = Buffer.from(await request.arrayBuffer());

    console.log(locals)

    const asset = new AssetSchema({ data, contentType, ownerId: locals.user.id })

    const res = await asset.save();

    return json({ assetId: res._id }, { status: 200 })
}