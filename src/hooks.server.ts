import { json, type Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';
import { UserSchema } from '@/server/mongo/schemas/user';

const dbPromise = mongo();

export const handle: Handle = async ({ event, resolve }) => {
	await dbPromise;

	const sessionId = event.cookies.get('session_id');

	if(sessionId) {
		const user = await UserSchema.findOne({ sessionId });

		if(user) {
			event.locals.user = {
				id: user._id.toString(),
				name: user.name,
				email: user.email,
				picture: user.picture,
				sessionId: user.sessionId,
				accountType: user.accountType,
				accessLevel: user.accessLevel,
				adviseeIds: user.adviseeIds
			};
		} else {
			event.cookies.delete('session_id');
		}
	}

	return await resolve(event);
};

export async function handleFetch({ request, fetch }) {
	return await fetch(request, {
		credentials: "same-origin"
	})
}