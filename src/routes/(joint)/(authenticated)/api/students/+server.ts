/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccountType } from "@/lib/enums.js";
import { buildRegex, stringifyObjectId } from "@/lib/utils";
import { UserSchema, type UserDocument } from "@/server/mongo/schemas/user";
import { error, json } from "@sveltejs/kit";
import z from "zod";

const QUERY_SCHEMA = z.string().min(1, "Query must be at least 1 character long.");
const YEAR_LOWER_SCHEMA = z.number().int().nullish().transform((n) => n ?? 0);
const YEAR_UPPER_SCHEMA = z.number().int().nullish().transform((n) => n ?? 10000);

export async function GET({ url: { searchParams } }) {
    const query = QUERY_SCHEMA.parse(searchParams.get("query"));
    const yearLower = YEAR_LOWER_SCHEMA.parse(searchParams.get("yearLower"));
    const yearUpper = YEAR_UPPER_SCHEMA.parse(searchParams.get("yearUpper"));

    console.log(query, yearLower, yearUpper);

    const students = (await UserSchema.find(
        {
            graduationYear: {
                $gte: yearLower,
                $lte: yearUpper
            },
            $or: [
                { email: buildRegex([query]) },
                { name: buildRegex(query.split(" ")) },
            ],
            accountType: AccountType.Student
        },
        "name email graduationYear",
    ).lean() as UserDocument[])?.map(stringifyObjectId);

    return json({ students });
}
