/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from '@/server/mongo/schemas/project';
import { json } from '@sveltejs/kit';


export async function POST({ request  }) {
    const { project } = await request.json();

    await ProjectSchema.findOneAndUpdate({ _id: project._id }, {
      ...project
    })

    return json({ message: "Project has been updated." });
}





