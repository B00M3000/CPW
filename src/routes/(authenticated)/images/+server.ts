import { uploadObject } from '@/server/aws';
import { error, json } from '@sveltejs/kit';

import { AWS_S3_IMAGES_BUCKET, USER_IMAGE_SPACE_LIMIT, USER_IMAGE_DESCRIPTION_LIMIT } from '$env/static/private';

import { ImageSchema } from '@/server/mongo/schemas/image';
import { ProjectSchema } from '@/server/mongo/schemas/project';

const isValidImageType = /image\/(png|jpeg)/

const _USER_IMAGE_SPACE_LIMIT = parseInt(USER_IMAGE_SPACE_LIMIT)
const _USER_IMAGE_DESCRIPTION_LIMIT = parseInt(USER_IMAGE_DESCRIPTION_LIMIT)

export async function PUT({ request, locals }) {
    const formData = await request.formData();

    const imageField = formData.get('image')
    const descriptionField = formData.get('description')
    const projectIdField = formData.get('projectId')

    if(descriptionField) {
        if(!(typeof descriptionField == "string")) throw error(400, { message: "Description must be a string." })
        if(descriptionField.length > _USER_IMAGE_DESCRIPTION_LIMIT) throw error(400, { message: `Description must be less than ${USER_IMAGE_DESCRIPTION_LIMIT} characters.` })
    }
    
    if(!(typeof projectIdField == "string")) throw error(400, { message: "Project ID must be a string" })

    if(!(await ProjectSchema.exists({ _id: projectIdField }))) throw error(400, { message: "Project ID must be valid" })

    const descriptionString: string = descriptionField

    if(!(imageField instanceof File)) throw error(400, { message: "No image file contained in request." })

    const imageFile: File = imageField

    if(!isValidImageType.test(imageFile.type)) throw error(400, { message: "Image file must be of type image/png,image/jpeg" })

    const { totalSize } = await ImageSchema.aggregate([{ $match: { ownerId: locals.user.id }}, { $group: { _id: null, totalSize: { $sum: "$size" } } }])

    if(totalSize + imageFile.size > _USER_IMAGE_SPACE_LIMIT) throw error(400, { message: "You exceed your alloted amount of space by uploading this image. Please ask website administrators for an expanded quota or manage your assets accordingly." })

    const object = await uploadObject(AWS_S3_IMAGES_BUCKET, `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}.${imageFile.type.split('/')[1]}`, Buffer.from(await imageFile.arrayBuffer()))

    await new ImageSchema({
        type: imageFile.type,
        s3Bucket: object.Bucket,
        s3ObjectKey: object.Key,
        size: imageFile.size,
        description: descriptionString,
        ownerId: locals.user.id,
        projectId: projectIdField
    }).save()

    return json({
        message: "Image was successfully uploaded to project!"
    }, { status: 200 })
}