import { AccessLevel } from '@/lib/enums';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';

export async function load({ locals }) {
    const students = [];

    const advisor = stringifyObjectId(await UserSchema.findById(locals.user.id));

    for(const adviseeId of advisor.adviseeIds){
        const counter = await ProjectSchema.count({ studentId: adviseeId, underReview: true })
        students.push({student: stringifyObjectId(await UserSchema.findById(adviseeId).lean()), counter: counter});
    }
    return { students }
};
