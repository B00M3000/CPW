import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, depends, url }) {
    depends('app:logout');

    if(!locals.user) throw redirect(307, `/login?redirect=${url.pathname}`);
};
