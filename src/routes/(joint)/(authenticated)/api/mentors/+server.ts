/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { buildRegex, stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ url }) {
    const searchParams = url.searchParams;

    const query = searchParams.get("query");

    if (query) {
        const mentors = (
            await MentorSchema.find(
                {
                    $or: [
                        { organization: buildRegex([query]) },
                        { name: buildRegex(query.split(" ")) },
                    ],
                },
                "name organization",
            ).lean()
        )?.map(stringifyObjectId);

        return json({ mentors });
    } else {
        error(400, "You must submit a query.");
    }
}
