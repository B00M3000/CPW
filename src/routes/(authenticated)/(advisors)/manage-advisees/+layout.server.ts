import { AccountType } from '@/lib/enums';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    if(!(locals.user.accountType == AccountType.Advisor)) throw error(403, "Access denied, not logged in as an advisor.");
};
