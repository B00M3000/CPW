import { AccountType } from '@/lib/enums.js';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    if(!locals.user.accountType == AccountType.Student) throw error(403, { message: "Only students can access these pages." })
};
