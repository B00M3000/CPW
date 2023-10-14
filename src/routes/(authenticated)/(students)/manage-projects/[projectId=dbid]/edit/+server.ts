/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from '@/server/mongo/schemas/project';
import { UserSchema } from '@/server/mongo/schemas/user';
import { error, json } from '@sveltejs/kit';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { stringifyObjectId } from "@/lib/utils";

export async function POST({ request  }) {
    const { project } = await request.json();

    await ProjectSchema.findOneAndUpdate({ _id: project._id }, {
      ...project
    })

    return json({ message: "Project has been updated." });
}





