/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccessLevel } from '@/lib/enums';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    if(!(locals.user.accessLevel == AccessLevel.Admin)) throw error(403, "Access denied, not logged in as a website administrator.");
};
