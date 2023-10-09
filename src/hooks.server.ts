import type { Handle } from '@sveltejs/kit';
import mongo from '@/server/mongo';

const dbPromise = mongo();

export const handle: Handle = async ({ event, resolve }) => {
	try {
		await dbPromise;

		return await resolve(event);
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