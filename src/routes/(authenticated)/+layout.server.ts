import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    if(locals.user) return { session: { user: locals.user } }
    else throw error(403, "Access denied, please login.");
};
