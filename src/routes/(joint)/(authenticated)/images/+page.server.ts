/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccessLevel } from "@/lib/enums";
import { clamp, parseIntOrElse, stringifyObjectId } from "@/lib/utils";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";

const RANDOM_MODE_ITEMS = 24;

type ImageMode = "recent" | "random";

export async function load({ url: { searchParams }, locals }) {
    const mode = parseMode(searchParams.get("mode"));

    // paginate (only used in recent mode)
    const page = clamp(parseIntOrElse(searchParams.get("page"), 0), 0, 100);
    const items = clamp(parseIntOrElse(searchParams.get("items"), 10), 1, 25);
    const skip = page * items;

    const projectFilter =
        locals.user?.accessLevel === AccessLevel.Admin ? {} : { publish: true };

    const visibleProjectIds = (
        await ProjectSchema.find(projectFilter, "_id").lean()
    ).map(({ _id }) => _id.toString());

    if (visibleProjectIds.length === 0) {
        return {
            images: [],
            page: 0,
            items,
            totalImageCount: 0,
            mode,
        };
    }

    if (mode === "random") {
        const randomImages = (
            await ImageSchema.aggregate([
                {
                    $match: {
                        projectId: { $in: visibleProjectIds },
                    },
                },
                {
                    $addFields: {
                        randomWeight: { $rand: {} },
                    },
                },
                {
                    $sort: {
                        projectId: 1,
                        randomWeight: 1,
                    },
                },
                {
                    $group: {
                        _id: "$projectId",
                        image: { $first: "$$ROOT" },
                    },
                },
                {
                    $replaceRoot: { newRoot: "$image" },
                },
                {
                    $sample: { size: RANDOM_MODE_ITEMS },
                },
                {
                    $project: {
                        _id: 1,
                        projectId: 1,
                        description: 1,
                    },
                },
            ])
        ).map(stringifyObjectId);

        const inflatedImages = await inflateImagesWithProjects(randomImages);
        return {
            images: inflatedImages,
            page: 0,
            items: RANDOM_MODE_ITEMS,
            totalImageCount: inflatedImages.length,
            mode,
        };
    }

    const recentImages = (
        await ImageSchema.find(
            { projectId: { $in: visibleProjectIds } },
            "projectId description",
        )
            .lean()
            .sort("-createdAt")
            .limit(items)
            .skip(skip)
    ).map(stringifyObjectId);

    const inflatedImages = await inflateImagesWithProjects(recentImages);
    const totalImageCount = await ImageSchema.countDocuments({
        projectId: { $in: visibleProjectIds },
    });
    return {
        images: inflatedImages,
        page,
        items,
        totalImageCount,
        mode,
    };
}

function parseMode(mode: string | null): ImageMode {
    if (mode === "random") return "random";
    return "recent";
}

async function inflateImagesWithProjects(images: any[]) {
    const uniqueProjectIds = [...new Set(images.map((image) => image.projectId))];
    const projectMap = new Map(
        (
            await ProjectSchema.find(
                { _id: { $in: uniqueProjectIds } },
                "title",
            ).lean()
        ).map((project) => {
            const stringified = stringifyObjectId(project);
            return [stringified._id, stringified];
        }),
    );

    return images.map((image) => ({
        ...image,
        project: projectMap.get(image.projectId),
    }));
}
