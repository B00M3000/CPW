/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { getObject } from "@/server/aws";
import { AccessLevel, AccountType } from "@/lib/enums";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error } from "@sveltejs/kit";

export async function GET({ params: { imageId }, setHeaders, locals }) {
    const image = await ImageSchema.findById(imageId);

    if (!image) error(404, { message: "Image not found." });

    const project = await ProjectSchema.findById(
        image.projectId,
        "publish studentId",
    ).lean();

    if (!project) error(404, { message: "Image not found." });

    const user = locals.user;
    const isAdmin = user.accessLevel === AccessLevel.Admin;
    const isOwner = project.studentId === user._id;
    const isAdvisorOfOwner =
        user.accountType === AccountType.Advisor &&
        user.adviseeIds?.includes(project.studentId);

    if (!(project.publish || isAdmin || isOwner || isAdvisorOfOwner)) {
        error(403, { message: "Forbidden" });
    }

    const isPubliclyCacheable = project.publish || isAdmin;

    setHeaders({
        "Cache-Control": isPubliclyCacheable
            ? "public, max-age=1209600"
            : "private, max-age=3600", // shorter private cache for non-public content
    });

    const object = await getObject(image.s3Bucket, image.s3ObjectKey);

    return new Response(object?.Body, {
        status: 200,
        headers: { "Content-Type": image.type },
    });
}
