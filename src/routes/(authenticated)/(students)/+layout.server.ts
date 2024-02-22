/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccountType } from '@/lib/enums.js';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    if(locals.user.accountType != AccountType.Student) throw error(403, { message: "Only students can access these pages." })
};
