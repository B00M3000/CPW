/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from '@/server/mongo/schemas/project';
import { error, json } from '@sveltejs/kit';
import { sanitizeFilter } from 'mongoose';

export async function POST({ request, params: { projectId } }) {
    const { project: { shortDesc, tags, title } } = await request.json();

    if (!(title.length < 100 && title.length > 12)) return error(400, "Please enter a project name between 12 and 200 characters.");
    if (!(tags.length >= 1 && tags.length <= 7)) return error(400, "Please select between 1 and 7 tags.");
    if (!(shortDesc.length > 100)) return error(400, "Please enter a short description with at least 100 characters to start. You can always edit it later.")

    await ProjectSchema.findOneAndUpdate(
        sanitizeFilter({ _id: projectId }),
        {
            title,
            tags: new Set(tags),
            shortDesc
        }
    );

    return json({ message: "Project has been updated." });
}
