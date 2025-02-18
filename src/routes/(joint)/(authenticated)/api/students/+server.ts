/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { buildRegex, stringifyObjectId } from "@/lib/utils";
import { UserSchema, type UserDocument } from "@/server/mongo/schemas/user";
import { error, json } from "@sveltejs/kit";
import z from "zod";

const QUERY_SCHEMA = z.string().min(1, "Query must be at least 1 character long.");

export async function GET({ url: { searchParams } }) {
    const query = QUERY_SCHEMA.parse(searchParams.get("query"));

    const students = (await UserSchema.find(
        {
            $or: [
                { email: buildRegex([query]) },
                { name: buildRegex(query.split(" ")) },
            ],
        },
        "name email",
    ).lean() as UserDocument[])?.map(stringifyObjectId);

    return json({ students });
}
