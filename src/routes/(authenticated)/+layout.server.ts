/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccountType } from '@/lib/enums.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, depends, url }) {
    depends('app:logout');

    if(!locals.user) throw redirect(307, `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`);
    if(locals.user.accountType == AccountType.Unknown) throw error(403, { message: "Account is not registered as a Student or Advisor." })
};
