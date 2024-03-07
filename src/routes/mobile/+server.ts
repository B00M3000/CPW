/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { uploadObject } from '@/server/aws';
import { error, json } from '@sveltejs/kit';

import { AWS_S3_IMAGES_BUCKET, USER_IMAGE_SPACE_LIMIT, USER_IMAGE_DESCRIPTION_LIMIT } from '$env/static/private';

import { ImageSchema } from '@/server/mongo/schemas/image';
import { ProjectSchema } from '@/server/mongo/schemas/project';
import sharp from 'sharp';
import { MobileKeySchema } from '@/server/mongo/schemas/mobileKey';
import { stringifyObjectId } from '@/lib/utils';

const isValidImageType = /(^image)(\/)[a-zA-Z0-9_]*/ ///image\/(png|jpeg)/

const _USER_IMAGE_SPACE_LIMIT = parseInt(USER_IMAGE_SPACE_LIMIT)
const _USER_IMAGE_DESCRIPTION_LIMIT = parseInt(USER_IMAGE_DESCRIPTION_LIMIT)

export async function PUT({ request, locals }) {
    const formData = await request.formData();

    const mobileKey = formData.get('mobileKey')

    if(!mobileKey) throw error(400, { message: "No mobile key provided." })

    const mobileKeyDoc: any = stringifyObjectId(await MobileKeySchema.findOne({ mobileKey }).lean());

    if(!mobileKeyDoc) throw error(404, { message: "Mobile key not found! Please try again. (Mobile keys are only valid for a short period after they are generated.)" })

    const imageField = formData.get('image')

    if((imageField instanceof File)) throw error(400, { message: "No image file contained in request." }) // remived !

    const imageFile: File = imageField;

    if(!isValidImageType.test(imageFile.type)) throw error(400, { message: "Image file must be of type image/png,image/jpeg" })

    const { totalSize } = await ImageSchema.aggregate([{ $match: { ownerId: mobileKey.userId }}, { $group: { _id: null, totalSize: { $sum: "$size" } } }])

    if(totalSize + imageFile.size > _USER_IMAGE_SPACE_LIMIT) throw error(400, { message: "You exceed the alloted amount of space by uploading this image. Please ask website administrators for an expanded quota or manage your assets accordingly." })

    let imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    if(/image\/jpeg/.test(imageFile.type)) {
        const compressed = await sharp(imageBuffer).jpeg({ quality: 20 }).toBuffer();
        if(compressed.byteLength < imageBuffer.byteLength) imageBuffer = compressed
    }

    if(/image\/png/.test(imageFile.type)) {
        const compressed = await sharp(imageBuffer).png({ compressionLevel: 9 }).toBuffer();
        if(compressed.byteLength < imageBuffer.byteLength) imageBuffer = compressed
    }

    const object = await uploadObject(AWS_S3_IMAGES_BUCKET, `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}.${imageFile.type.split('/')[1]}`, imageBuffer)

    await new ImageSchema({
        type: imageFile.type,
        s3Bucket: object.Bucket,
        s3ObjectKey: object.Key,
        size: imageFile.size,
        description: "",
        ownerId: mobileKeyDoc.userId,
        projectId: mobileKeyDoc.projectId
    }).save()

    return json({
        message: "Image was successfully uploaded to project!"
    }, { status: 200 })
}