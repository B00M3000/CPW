/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { parseIntOrElse, stringifyObjectId } from "@/lib/utils";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";

export async function load({ url: { searchParams } }) {
    // paginate
    const page = Math.min(parseIntOrElse(searchParams.get("page"), 0), 10000);
    const items = Math.min(parseIntOrElse(searchParams.get("items"), 10), 50);
    const skip = page * items;

    const inflatedImages = await Promise.all(
        (
            await ImageSchema.find({}, "projectId description")
                .lean()
                .sort("-createdAt")
                .limit(items)
                .skip(skip)
        )
            ?.map(stringifyObjectId)
            .map(injectProjects),
    );
    const totalImageCount = await ImageSchema.find().count();
    return {
        images: inflatedImages,
        page: page || 0,
        items: items || 10,
        totalImageCount,
    };
}

async function injectProjects(image: any) {
    image.project = stringifyObjectId(
        await ProjectSchema.findById(image.projectId, "title").lean(),
    );
    return image;
}
