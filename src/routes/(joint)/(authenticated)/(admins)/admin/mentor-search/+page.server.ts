/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import {
    MentorSchema,
    type MentorDocument,
    type MentorDocumentData,
} from "@/server/mongo/schemas/mentor";
import { buildRegex, stringifyObjectId } from "@/lib/utils";
import type { FilterQuery } from "mongoose";

export async function load({ url }) {
    const searchParams = url.searchParams;

    const dbQuery: FilterQuery<MentorDocument> = {};

    const name = searchParams.get("name")?.split(" ");
    if (name) {
        dbQuery.name = buildRegex(name);
    }

    const organization = searchParams.get("organization")?.split("");
    if (organization) {
        dbQuery.organization = buildRegex(organization);
    }

    const email = searchParams.get("email");
    if (email) {
        dbQuery.email = buildRegex([email]);
    }

    const filteredMentors: MentorDocumentData[] =
        (await MentorSchema.find(dbQuery).lean()) || [];
    const mentors = filteredMentors.map(stringifyObjectId);

    return { mentors };
}
