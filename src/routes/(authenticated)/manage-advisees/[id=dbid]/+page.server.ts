import { AccessLevel } from '@/lib/enums';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';

export async function load({ locals, params }) {
    const id = params.id;
    const student = stringifyObjectId(await UserSchema.findById(id).lean())
    const projects = (await ProjectSchema.find({ studentId: id }).lean()).map(stringifyObjectId);
    return { student, projects }
};
