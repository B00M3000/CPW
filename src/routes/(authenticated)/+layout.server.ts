import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerData } from './$types.js';

export const load: LayoutServerData = async ({ locals }) => {
    if(locals.user) return { session: { user: locals.user } }
    else throw error(403, "Access denied, please login.");
};
