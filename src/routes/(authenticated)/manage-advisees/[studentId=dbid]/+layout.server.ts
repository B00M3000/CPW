import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
    let studentId = params.studentId;

    if(!(locals.user.adviseeIds.includes(studentId))) throw error(403, "Access denied, not the adivosr of this student.") 
};
