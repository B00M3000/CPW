/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccountType } from '@/lib/enums.js';
import mongoose from 'mongoose';
import mongo from '@/server/mongo';
import { error, redirect } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user.js';

export async function load({ locals, depends, url }) {
    if(!locals.user) redirect(307, `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`); 

    if(locals.user.accountType == AccountType.Unknown) error(403, { message: "Account is not registered as a Student or Advisor." });
};


