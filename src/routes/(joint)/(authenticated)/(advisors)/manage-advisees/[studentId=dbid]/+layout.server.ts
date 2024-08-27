/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { error } from "@sveltejs/kit";
import { UserSchema } from "@/server/mongo/schemas/user.js";
import { stringifyObjectId } from "@/lib/utils.js";

export async function load({ locals, params: { studentId } }) {
    const student = stringifyObjectId(
        await UserSchema.findOne({ _id: studentId }).lean(),
    );
    if (!locals.user?.adviseeIds.includes(student.schoolId))
        error(403, "Access denied, not the adivosr of this student.");
}
