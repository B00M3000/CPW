/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { UserSchema } from '@/server/mongo/schemas/user.js';
import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';

export async function load({ locals }) {
    const students = await Promise.all(locals.user.adviseeIds.map(async adviseeId => {
        const counter = await ProjectSchema.count({ studentId: adviseeId, underReview: true })
        return {  ...stringifyObjectId(await UserSchema.findOne({ schoolId: adviseeId }).lean()), counter };
    })) 

    console.log(students);

    return { students }; 
};
