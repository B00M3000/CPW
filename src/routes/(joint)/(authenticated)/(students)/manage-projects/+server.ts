/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { error, json } from "@sveltejs/kit";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ImageSchema } from "@/server/mongo/schemas/image.js";
import type { ObjectId } from "mongoose";

interface PublishSchema {
    _id: ObjectId;
    publish: boolean;
}

export async function POST({ request, locals }) {
    const data = await request.json();
    const { action, projectId } = data;
    const project = await ProjectSchema.findOne({
        _id: projectId,
        studentId: locals.user?._id,
    });
    if (!project) error(403, "Dont mess with other peoples projects.");

    if (action == "PUBLISH") {
        let schema: PublishSchema | null = await ProjectSchema.findOne(
            { _id: projectId, studentId: locals.user?._id },
            "publish",
        );

        if (schema) {
            await ProjectSchema.updateOne(
                { _id: projectId },
                { publish: !schema.publish },
            );
        }
    } else {
        error(400, `Invalid action type provided. Given ${action}.`);
    }

    return json({ message: "Action Successfully Executed." });
}
