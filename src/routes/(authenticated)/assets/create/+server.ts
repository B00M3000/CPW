import { AssetSchema } from '@/server/mongo/schemas/asset'
import { error, json } from '@sveltejs/kit';
import { sum, zip } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';

const USER_ASSET_LIMIT = 1000 * 1000 * 10; // in b (10 MB)
const USER_DESC_LIMIT_IN_CHAR = 400;
const regex = /^data:.+\/(.+);base64,(.*)$/;

const mergeImagesAndDescs = (images: File[], descs: string[]) => images.map((image, i) => ({ image, desc: descs[i] }));

export async function POST({ request, locals }) {
    const formData = Array.from((await request.formData()).entries());

    const images = mergeImagesAndDescs(formData.filter(([k, v]) => /image/.test(k)).map(([k, v]) => v), formData.filter(([k, v]) => /desc\d+/.test(k)).map(([k, v]) => v));

    const spaceUsed = (await AssetSchema.find({ ownerId: locals.user.id }, 'size'))?.reduce((a, b) => a + b.size, 0) || 0;

    if(spaceUsed + sum(images.map(image => image.image.size)) > USER_ASSET_LIMIT) throw error(400, `You do not have enough space! Each user is limited to ${USER_ASSET_LIMIT} B of storage in assets.`);
    
    async function handleOneFile(image) {
        if (!/^image\/(png|jpeg|gif)$/.test(image.image.type)) throw error(400, "Must be an image/png, image/jpeg, or image/gif.")
        const data = Buffer.from(await image.image.arrayBuffer());

        let schema = new AssetSchema({
            contentType: image.image.type,
            data,
            desc: image.desc?.slice(0, USER_DESC_LIMIT_IN_CHAR),
            ownerId: locals.user.id,
            size: image.image.size
        })

        const res = await schema.save();

        return res._id;
    }

    const assetIds = await Promise.all(images.map(handleOneFile));

    const projectId = formData.find(([k, v]) => k === "projectId")
    if(projectId) ProjectSchema.findOneAndUpdate({ _id: projectId, studentId: locals.user.id }, { $push: { imageIds: { $each: assetIds }}})
    
    return json({ assetIds }, { status: 200 })
}


