import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    if(!locals.user.accountType) throw error(403, { message: "Only students can access these pages." })
};
