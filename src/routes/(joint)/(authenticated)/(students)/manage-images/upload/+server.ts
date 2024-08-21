/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { uploadObject } from '@/server/aws';
import { error, json } from '@sveltejs/kit';

import type { PutObjectCommandOutput } from '@aws-sdk/client-s3';

import { AWS_S3_IMAGES_BUCKET, USER_IMAGE_SPACE_LIMIT, USER_IMAGE_DESCRIPTION_LIMIT } from '$env/static/private';

import { ImageSchema } from '@/server/mongo/schemas/image';
import { ProjectSchema } from '@/server/mongo/schemas/project';
import sharp from 'sharp';

const isValidImageType = /(^image)(\/)[a-zA-Z0-9_]*/ ///image\/(png|jpeg)/

const _USER_IMAGE_SPACE_LIMIT = parseInt(USER_IMAGE_SPACE_LIMIT)
const _USER_IMAGE_DESCRIPTION_LIMIT = parseInt(USER_IMAGE_DESCRIPTION_LIMIT)

export async function PUT({ request, locals }) {
    const formData = await request.formData();

    const imageField = formData.get('image')
    const descriptionField = formData.get('description')
    const projectIdField = formData.get('projectId')

    if(descriptionField) {
        if(!(typeof descriptionField == "string")) error(400, { message: "Description must be a string." });
        if(descriptionField.length > _USER_IMAGE_DESCRIPTION_LIMIT) error(400, { message: `Description must be less than ${USER_IMAGE_DESCRIPTION_LIMIT} characters.` });
    }
    
    if(!(typeof projectIdField == "string")) error(400, { message: "Project ID must be a string" });

    if(!(await ProjectSchema.exists({ _id: projectIdField }))) error(400, { message: "Project ID must be valid" });

    if((await ProjectSchema.findOne({ _id: projectIdField }))?.studentId != locals?.user?.id) error(403, { message: "No adding images to other peoples projets!" });

    const descriptionString: string = descriptionField;

    if(!(imageField instanceof File)) error(400, { message: "No image file contained in request." });

    const imageFile: File = imageField;

    if(!isValidImageType.test(imageFile.type)) error(400, { message: "Image file must be of type image/png,image/jpeg" });

    const { totalSize } = await ImageSchema.aggregate([{ $match: { ownerId: locals?.user?.id }}, { $group: { _id: null, totalSize: { $sum: "$size" } } }])

    if(totalSize + imageFile.size > _USER_IMAGE_SPACE_LIMIT) error(400, { message: "You exceed your alloted amount of space by uploading this image. Please ask website administrators for an expanded quota or manage your assets accordingly." });

    let imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    if(/image\/jpeg/.test(imageFile.type)) {
        const compressed = await sharp(imageBuffer).jpeg({ quality: 20 }).toBuffer();
        if(compressed.byteLength < imageBuffer.byteLength) imageBuffer = compressed
    }

    if(/image\/png/.test(imageFile.type)) {
        const compressed = await sharp(imageBuffer).png({ compressionLevel: 9 }).toBuffer();
        if(compressed.byteLength < imageBuffer.byteLength) imageBuffer = compressed
    }

    // no compression for gif's
    // if(/image\/gifs/.test(image.image.type)) {
    //     const compressed = await sharp(data).jpeg({ quality: 10 }).toBuffer();
    //     if(compressed.byteLength < data.byteLength) data = compressed
    // }

    const key: string = new Date().getTime() + '-' + Math.floor(Math.random() * 1000) + '.' + imageFile.type.split('/')[1];

    const response: PutObjectCommandOutput = await uploadObject(AWS_S3_IMAGES_BUCKET, key, imageBuffer);
    // maybe do something with the response idk

    const imageSchem = await new ImageSchema({
        type: imageFile.type,
        s3Bucket: AWS_S3_IMAGES_BUCKET,
        s3ObjectKey: key,
        size: imageFile.size,
        description: descriptionString,
        ownerId: locals.user.id,
        projectId: projectIdField
    }).save()

    return json({
        message: "Image was successfully uploaded to project!",
        imageLink: `/images/${imageSchem._id}`,
        image: imageSchem.toObject({ transform: (doc, ret) => { delete ret.s3Bucket; delete ret.s3ObjectKey; return ret } }),
        imageId: imageSchem._id
    }, { status: 200 })
}