/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import type { ParamMatcher } from "@sveltejs/kit";
import mongoose from "mongoose";

// Extracted From
// https://github.com/Automattic/mongoose/blob/44530a6fc36392ff4cdcf0300cd8baa856d80b78/lib/index.js#L45
export const objectIdHexRegexp = /^[0-9A-Fa-f]{24}$/;

/**
 * Sveltekit matcher. Matches mongodb database ids.
 */
export const match: ParamMatcher = (param) => {
    if (typeof window === "undefined")
        return mongoose.isObjectIdOrHexString(param);

    // hard coded check for browsers
    return objectIdHexRegexp.test(param);
};
