import { AccountType } from '@/lib/enums.js';
import mongoose from 'mongoose';
import mongo from '@/server/mongo';
import { error, redirect } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user.js';

const dbPromise = mongo();

export async function load({ locals, depends, url, cookies }) {
    depends('app:logout');

    await dbPromise;

    function redirectToLogin() {
        throw redirect(307, `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`) 
    }

    const sessionId = cookies.get('session_id');

    if(!sessionId) return redirectToLogin();

    const user = await UserSchema.findOne({ sessionId });

    if(!user) {
        cookies.delete('session_id')
        return redirectToLogin();
    }

    locals.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.picture,
        sessionId: user.sessionId,
        accountType: user.accountType,
        accessLevel: user.accessLevel,
        adviseeIds: user.adviseeIds
    }

    if(locals.user.accountType == AccountType.Unknown) throw error(403, { message: "Account is not registered as a Student or Advisor." })
};


