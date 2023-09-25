import { AssetSchema } from '@/server/mongo/schemas/asset'
import { error, json } from '@sveltejs/kit';
import { sum, zip } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import sharp from 'sharp'

const USER_ASSET_LIMIT = 1000 * 1000 * 5; // in b (5 MB)
const USER_DESC_LIMIT_IN_CHAR = 400;
const regex = /^data:.+\/(.+);base64,(.*)$/;

const mergeImagesAndDescs = (images: File[], descs: string[]) => images.map((image, i) => ({ image, desc: descs[i] }));

export async function POST({ request, locals }) {
    const formData = Array.from((await request.formData()).entries());

    const images = mergeImagesAndDescs(formData.filter(([k, v]) => /image/.test(k)).map(([k, v]) => v), formData.filter(([k, v]) => /desc\d+/.test(k)).map(([k, v]) => v));

    const spaceUsed = (await AssetSchema.find({ ownerId: locals.user.id }, 'size'))?.reduce((a, b) => a + b.size, 0) || 0;

    if(spaceUsed + sum(images.map(image => image.image.size)) > USER_ASSET_LIMIT) throw error(400, `You do not have enough space! Each user is limited to ${USER_ASSET_LIMIT} B of storage in assets.`);
    
    async function handleOneImage(image) {
        if (!/^image\/(png|jpeg|gif)$/.test(image.image.type)) throw error(400, "Must be an image/png, image/jpeg, or image/gif.")
        let data = Buffer.from(await image.image.arrayBuffer());

        if(/image\/jpeg/.test(image.image.type)) {
            const compressed = await sharp(data).jpeg({ quality: 20 }).toBuffer();
            if(compressed.byteLength < data.byteLength) data = compressed
        }

        if(/image\/png/.test(image.image.type)) {
            const compressed = await sharp(data).png({ compressionLevel: 9 }).toBuffer();
            if(compressed.byteLength < data.byteLength) data = compressed
        }

        // no compression for gif's
        // if(/image\/gifs/.test(image.image.type)) {
        //     const compressed = await sharp(data).jpeg({ quality: 10 }).toBuffer();
        //     if(compressed.byteLength < data.byteLength) data = compressed
        // }

        let schema = new AssetSchema({
            contentType: image.image.type,
            data,
            desc: image.desc?.slice(0, USER_DESC_LIMIT_IN_CHAR),
            ownerId: locals.user.id,
            size: data.byteLength
        })

        const res = await schema.save();

        return res._id;
    }

    const assetIds = await Promise.all(images.map(handleOneImage));

    const projectId = formData.find(([k, v]) => k === "projectId")
    if(projectId) ProjectSchema.findOneAndUpdate({ _id: projectId, studentId: locals.user.id }, { $push: { imageIds: { $each: assetIds }}})
    
    return json({ assetIds }, { status: 200 })
}


