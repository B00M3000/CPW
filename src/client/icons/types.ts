/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

export interface SVG {
    attributes?: SVGAttributes;
    source: string;
}

export interface SVGAttributes {
    viewBox?: string;
    stroke?: string;
    fill?: string;
}