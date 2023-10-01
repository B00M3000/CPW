import { AWS_S3_IMAGES_BUCKET } from '$env/static/private';
import { getObject } from '@/server/aws';
import { ImageSchema } from '@/server/mongo/schemas/image';
import { error, json } from '@sveltejs/kit';

export async function GET({ params: { imageId }, url, setHeaders }) {
    
    const image = await ImageSchema.findById(imageId);   

    if(!image) throw error(404, "No Asset found with that ID");

    setHeaders({
        "cache-control": "max-age=1209600", // two weeks cache
    });

    const object = await getObject(image.s3Bucket, image.s3ObjectKey)

    return new Response(object?.Body, { status: 200, headers: { "Content-Type": image.type }})
}

// export async function DELETE({ params: { id }}) {
//     const res = await AssetSchema.deleteOne({ _id: id });
//     ProjectSchema.findOneAndUpdate({}, { $pull: { imageIds: { $in: [ id ]} } })
//     return json({ message: "Asset has been deleted sucessfully!"}, { status: 200 });
// }