import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const session_id = url.searchParams.get('session_id');

    if (session_id) {
        cookies.set('session_id', session_id, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });
    }

    return redirect(307, '/');
};
