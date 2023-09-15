import type { Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import cookie from 'cookie';
import { UserSchema } from '@/server/mongo/schemas/user';

const dbPromise = mongo();

export const handle: Handle = async ({ event, resolve }) => {
	try {
		await dbPromise;

		const cookies = cookie.parse(event.request.headers.get('cookie') || '');
		const session_id = cookies.session_id;

		if (session_id) {
			const user = await UserSchema.findOne({ sessionId: session_id });

			if (user) {
				event.locals.user = {
					id: user?._id.toString(),
					name: user?.name,
					email: user?.email,
					picture: user?.picture,
					sessionId: user?.sessionId,
					accountType: user?.accountType,
					accessLevel: user?.accessLevel
				};
			} else {
				//TBA: clear session cookie
			}
		} else {
			//TBA: clear session cookie
		}	

		const response = await resolve(event);

		return response;
	} catch (error) {
		console.error(error);

		return new Response(null, { status: 500 });
	}
};

export async function handleFetch({ request, fetch }) {
	return await fetch(request, {
		credentials: "same-origin"
	})
}