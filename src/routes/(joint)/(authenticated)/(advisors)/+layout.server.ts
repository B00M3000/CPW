/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccountType } from "@/lib/enums";
import { error } from "@sveltejs/kit";

export async function load({ locals }) {
    if (!(locals.user?.accountType == AccountType.Advisor))
        error(403, { message: "Only advisors can access these pages." });
}
