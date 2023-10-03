import { getObject } from '@/server/aws';
import { ImageSchema } from '@/server/mongo/schemas/image';
import { error } from '@sveltejs/kit';

export async function GET({ params: { imageId }, url, setHeaders }) {
    const image = await ImageSchema.findById(imageId);   

    if(!image) throw error(404, { message: `Could not find image with id ${imageId}` });

    setHeaders({
        "cache-control": "max-age=1209600", // two weeks cache
    });

    const object = await getObject(image.s3Bucket, image.s3ObjectKey);

    return new Response(object?.Body, { status: 200, headers: { "Content-Type": image.type }})
}