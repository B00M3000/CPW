/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { getObject } from "@/server/aws";
import {
    canPubliclyCacheProjectAsset,
    canViewProject,
} from "@/server/project-access";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params: { imageId }, setHeaders, locals }) => {
    if (!locals.user) {
        error(403, { message: "Not authenticated." });
    }

    const image = await ImageSchema.findById(imageId);

    if (!image) error(404, { message: "Image not found." });

    const project: any = await ProjectSchema.findById(
        image.projectId,
        "publish studentId",
    ).lean();

    if (!project) error(404, { message: "Image not found." });

    if (!canViewProject(locals.user, project)) {
        error(403, { message: "Forbidden" });
    }

    const isPubliclyCacheable = canPubliclyCacheProjectAsset(locals.user, project);

    setHeaders({
        "Cache-Control": isPubliclyCacheable
            ? "public, max-age=1209600"
            : "private, no-store",
    });

    const object = await getObject(image.s3Bucket, image.s3ObjectKey);

    return new Response(object?.Body as any, {
        status: 200,
        headers: { "Content-Type": image.type },
    });
};
