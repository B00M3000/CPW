import { AccessLevel } from '@/lib/enums';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    if(!(locals.user.accessLevel == AccessLevel.Admin)) throw error(403, "Access denied, not logged in as a website administrator.");
};
