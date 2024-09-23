/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { UserSchema } from "@/server/mongo/schemas/user.js";
import { currentYear, stringifyObjectId } from "@/lib/utils";
import type { User } from "@/interfaces/project.js";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";

export async function load({ locals }) {
    const students = await Promise.all(
        locals.user!.adviseeIds.map(async (adviseeId) => {
            const student: User | null = await UserSchema.findOne({
                _id: adviseeId,
            });
            const currentPending = !!(await ProjectSchema.exists({
                studentId: student?._id,
                year: currentYear(),
            }));
            const currentApproved = !!(await ProjectSchema.exists({
                studentId: student?._id,
                underReview: false,
                year: currentYear(),
            }));
            return {
                ...stringifyObjectId(
                    await UserSchema.findOne({ _id: adviseeId }).lean(),
                ),
                currentPending,
                currentApproved,
            };
        }),
    );

    return { students };
};
