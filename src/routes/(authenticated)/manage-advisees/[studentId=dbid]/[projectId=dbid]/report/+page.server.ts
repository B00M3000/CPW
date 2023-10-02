import { AccessLevel } from '@/lib/enums';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { stringifyObjectId } from '@/lib/utils';
import { ProjectSchema } from '@/server/mongo/schemas/project.js';
import { MentorSchema } from '@/server/mongo/schemas/mentor';

export async function load({ locals, params }) {
    const projectId = params.projectId;
    const studentId = params.studentId;
    const project = stringifyObjectId(await ProjectSchema.findById(projectId).lean());

    return { project, studentId }
};

