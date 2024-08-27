/*
 * Created on Sun Feb 4 2024
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import type { SVG } from "./types";

// <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//     <path d="M15 19V5l-8 7z"/>
// </svg>

export default {
    attributes: {
        viewBox: "0 0 24 24",
    },
    source: `<path d="M15 19V5l-8 7z"/>`,
} as SVG;
