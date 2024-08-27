/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { deleteObject } from "@/server/aws";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { error, json } from "@sveltejs/kit";

export async function POST({ locals, params: { imageId }, request }) {
    const image = await ImageSchema.findById(imageId);
    if (!image)
        error(404, { message: `Could not find image with id ${imageId}` });
    if (image.ownerId != locals.user._id)
        error(403, { message: `You do not own this image.` });

    const description = await request.text();

    await ImageSchema.findOneAndUpdate({ _id: imageId }, { description });

    return json(
        { message: "Image description has been updated!" },
        { status: 200 },
    );
}
