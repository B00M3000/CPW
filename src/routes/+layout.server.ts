import type { LayoutServerData } from './$types.js';

export const load: LayoutServerData = async ({ locals }) => {
    if(locals) return { session: { user: locals.user } }
};
