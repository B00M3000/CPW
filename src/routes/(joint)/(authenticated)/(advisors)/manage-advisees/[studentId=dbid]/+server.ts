import { UserSchema } from '@/server/mongo/schemas/user.js';
import { error, json } from '@sveltejs/kit';

async function isValidStudent(id: string) {
    return UserSchema.exists({ _id: id });
}

async function validStudentGate(studentId: string) {
    if(!isValidStudent(studentId)) {
        error(404, `Student with ${studentId} id does not exist.`);
    }
}

export async function PUT({ locals, params: { studentId } }) {
    validStudentGate(studentId);

    await UserSchema.updateOne({ _id: locals.user?._id }, { $addToSet: { adviseeIds: studentId } });

    return json({ message: `Student with ${studentId} id has been added to your advisee list.` });
}

export async function DELETE({ locals, params: { studentId } }) {
    validStudentGate(studentId);

    await UserSchema.updateOne({ _id: locals.user?._id }, { $pull: { adviseeIds: studentId } });

    return json({ message: `Student with ${studentId} id has been removed from your advisee list.` });
}
