/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { deleteObject } from "@/server/aws";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { error, json } from "@sveltejs/kit";

export async function DELETE({ locals, params: { imageId } }) {
    const image = await ImageSchema.findById(imageId);
    if (!image)
        error(404, { message: `Could not find image with id ${imageId}` });
    if (image.ownerId != locals.user._id)
        error(403, { message: `You do not own this image.` });

    await deleteObject(image.s3Bucket, image.s3ObjectKey);

    await ImageSchema.deleteOne({ _id: imageId });

    return json(
        { message: "Image has been deleted sucessfully!" },
        { status: 200 },
    );
}
