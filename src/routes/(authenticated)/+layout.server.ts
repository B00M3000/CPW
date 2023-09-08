import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    if(!locals.user) throw error(403, "Access denied, please login.");
};
