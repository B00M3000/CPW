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

    const isAdmin = locals.user?.accessLevel === AccessLevel.Admin;

    // Admins see all images regardless of publish status, so no project filter is needed.
    // For non-admins we still need to restrict to images from published projects.
    let visibleProjectIds: string[] | null = null;
    if (!isAdmin) {
        visibleProjectIds = (
            await ProjectSchema.find({ publish: true }, "_id").lean()
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
    }

    const imageFilter = visibleProjectIds
        ? { projectId: { $in: visibleProjectIds } }
        : {};

    if (mode === "random") {
        const randomImages = (
            await ImageSchema.aggregate([
                {
                    $match: imageFilter,
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
            imageFilter,
            "projectId description",
        )
            .lean()
            .sort("-createdAt")
            .limit(items)
            .skip(skip)
    ).map(stringifyObjectId);

    const inflatedImages = await inflateImagesWithProjects(recentImages);
    const totalImageCount = await ImageSchema.countDocuments(imageFilter);
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
