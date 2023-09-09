import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, depends }) {
    depends('app:logout');

    if(!locals.user) throw error(403, "Access denied, please login.");
};
