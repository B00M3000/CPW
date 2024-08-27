/*
 * Created on Sat Oct 14 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { stringifyObjectId } from "@/lib/utils";

export async function load({ params: { mentorId } }) {
    const mentor = stringifyObjectId(
        await MentorSchema.findById(mentorId).lean(),
    );

    return { mentor, mentorId };
}
