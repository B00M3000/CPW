import { AssetSchema } from '@/server/mongo/schemas/asset'
import { error, json } from '@sveltejs/kit';

const USER_ASSET_LIMIT_IN_KB = 1000 * 10; // in kb (10 MB)
const USER_DESC_LIMIT_IN_CHAR = 200;
const regex = /^data:.+\/(.+);base64,(.*)$/;

export async function POST({ request, locals, url }) {
    const { files } = await request.json();
    

    async function handleOneFile(file: any) {
        if (!/^image\/.*$/.test(file.type)) throw error(400, "Must be an image/*")
        const data = Buffer.from(file.src.match(regex)[2], "base64");
        const size = Math.ceil(data.byteLength / 1000);
        const spaceUsed = (await AssetSchema.find({ ownerId: locals.user.id }, 'size'))?.reduce((a, b) => a + b.size, 0) || 0;

        if (size + spaceUsed > USER_ASSET_LIMIT_IN_KB) throw error(400, `You do not have enough space! Each user is limited to ${USER_ASSET_LIMIT_IN_KB} KB of storage in assets.`);

        let schema = new AssetSchema({
            contentType: file.type,
            data: data,
            desc: file.desc?.slice(0, USER_DESC_LIMIT_IN_CHAR),
            ownerId: locals.user.id,
            size
        })

        const res = await schema.save();

        return res._id;
    }

    const assetIds = await Promise.all(files.map(handleOneFile));


    return json({ assetIds }, { status: 200 })
}


