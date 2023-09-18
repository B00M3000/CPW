import { AssetSchema } from '@/server/mongo/schemas/asset'
import { error, json } from '@sveltejs/kit';

const USER_ASSET_LIMIT_IN_KB = 1000 * 10; // in kb (10 MB)
const USER_DESC_LIMIT_IN_CHAR = 200;

export async function POST({ request, locals, url }) {
    const { files } = await request.json();


    for(let i = 0; i < files.length; i++){
        await handleOneFile(files[i], locals, request)
        console.log("here")
    }

    return json({ assetId: res._id, spaceLeftInKB: USER_ASSET_LIMIT_IN_KB - (spaceUsed + size) }, { status: 200 })
}


async function handleOneFile(file : any, locals: any, request: any){
    if(!/^image\/.*$/.test(file.type)) throw error(400, "Must be an image/*")

    const data = Buffer.from(await request.arrayBuffer());

    const size = Math.ceil(data.byteLength / 1000);

    const spaceUsed = (await AssetSchema.find({ ownerId: locals.user.id }, 'size'))?.reduce((a, b) => a + b.size, 0) || 0;

    if(size + spaceUsed > USER_ASSET_LIMIT_IN_KB) throw error(400, `You do not have enough space! Each user is limited to ${USER_ASSET_LIMIT_IN_KB} KB of storage in assets.`);
   let schema = new AssetSchema({
        conententType: file.type,
        data: file.data,
        desc: file.desc?.slice(0, USER_DESC_LIMIT_IN_CHAR),
        ownerId: locals.user.id,
        size: Math.ceil(file.size/1000)
   })

   await schema.save();
   
}