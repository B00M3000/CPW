import type { Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import cookie from 'cookie';
import { UserSchema } from '@/server/mongo/schemas/user';

const dbPromise = mongo();

export const handle: Handle = async ({ event, resolve }) => {
	await dbPromise;

	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	const session_id = cookies.session_id;

	if (session_id) {
		const user = await UserSchema.findOne({ session_id });

		if (user) {
			event.locals.user = {
				id: user?._id.toString(),
				name: user?.name,
				email: user?.email,
				picture: user?.picture,
				session_id: user?.session_id,
				account_type: user?.account_type,
				access_level: user?.access_level
			};
		} else {
			//TBA: clear session cookie
		}
	} else {
		//TBA: clear session cookie
	}

	const response = await resolve(event);

	return response;
};
