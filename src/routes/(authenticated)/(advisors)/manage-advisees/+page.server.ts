/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccessLevel } from '@/lib/enums';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';

export async function load({ locals }) {
    const students = [];
    
    locals.user?.adviseeIds.forEach(adviseeId => {
        const counter = await ProjectSchema.count({ studentId: adviseeId, underReview: true })
        students.push({ student: stringifyObjectId(await UserSchema.findById(adviseeId).lean()), counter });
    })

    return { students };
};
