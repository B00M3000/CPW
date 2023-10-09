import { AccountType } from '@/lib/enums.js';
import mongoose from 'mongoose';
import mongo from '@/server/mongo';
import { error, redirect } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user.js';

const dbPromise = mongo();

export async function load({ locals, depends, url }) {
    depends('app:logout');

    if(!locals.user) throw redirect(307, `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`) 

    if(locals.user.accountType == AccountType.Unknown) throw error(403, { message: "Account is not registered as a Student or Advisor." })
};


