/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import type { Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import { UserSchema } from '@/server/mongo/schemas/user';

const dbPromise = mongo();

export const handle: Handle = async ({ event, resolve }) => {
	await dbPromise;

	const sessionId = event.cookies.get('session_id');

	if(sessionId) {
		const user = await UserSchema.findOneAndUpdate(
			{ sessionId },
			{ lastVisit: new Date() }
		).select('id name firstName lastName email picture sessionId accountType accessLevel adviseeIds').lean();

		if(user) {
			event.locals.user = {
				...user,
				id: user._id.toString(),
			};
		} else {
			event.cookies.delete('session_id', { path: '/' });
		}
	}

	return await resolve(event);
};

export async function handleFetch({ request, fetch }) {
	return await fetch(request, {
		credentials: "same-origin"
	})
}
