/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error, json } from "@sveltejs/kit";
import { sanitizeFilter } from "mongoose";
import { validateProjectShortDescription, validateProjectTags, validateProjectTitle } from "../../create/server-validation";

export async function POST({ request, params: { projectId } }) {
    const {
        project: { shortDesc, tags, title },
    } = await request.json();

    // Validate project details
    let validationResult = validateProjectTitle(title);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    validationResult = validateProjectTags(tags);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    validationResult = validateProjectShortDescription(shortDesc);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    await ProjectSchema.findOneAndUpdate(sanitizeFilter({ _id: projectId }), {
        title,
        $addToSet: { tags },
        shortDesc,
    });

    return json({ message: "Project has been updated." });
}
