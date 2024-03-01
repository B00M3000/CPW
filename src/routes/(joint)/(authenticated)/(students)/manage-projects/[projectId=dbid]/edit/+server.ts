/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from '@/server/mongo/schemas/project';
import { json } from '@sveltejs/kit';


export async function POST({ request  }) {
    const { project: { shortDesc, tags, title, _id } } = await request.json();

    await ProjectSchema.findOneAndUpdate({ _id }, { title, tags, shortDesc })

    return json({ message: "Project has been updated." });
}





