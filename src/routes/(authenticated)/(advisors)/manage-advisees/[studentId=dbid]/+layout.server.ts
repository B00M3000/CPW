/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { error } from '@sveltejs/kit';

export async function load({ locals, params: { studentId } }) {
    //if(!(locals.user?.adviseeIds.includes(studentId))) throw error(403, "Access denied, not the adivosr of this student.") 
    // Fix later, passing the userId of the student so cannot compare with the StudentId of the adviseeIds
};
