/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import Papa from "papaparse";
import escapeRegExp from "lodash/escapeRegExp";
import { Document, isValidObjectId, type ObjectId } from "mongoose";

export function currentYear() {
    const date = new Date();
    return date.getFullYear() + (date.getMonth() < 7 ? 0 : 1); // the month is zero-indexed
}

export function parseIntOrElse(str: string | null, other: number): number {
    if (!str) return other;
    try {
        return parseInt(str);
    } catch {
        return other;
    }
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function buildRegex(keywords: string[]) {
    return new RegExp(
        keywords
            .map(escapeRegExp)
            .map((w: string) => `(?=.*?${w})`)
            .join("") + ".*",
        "i",
    );
}

export function stringifyObjectId<T extends Document>(document: T): T & { _id: string } {
    if(!document) return document;
    if (!('_id' in document) || !isValidObjectId(document._id as ObjectId)) throw new Error('_id field must be of type ObjectId');
    document._id = (document._id as ObjectId).toString(); // very hacky fix but whatever
    return document as T & { _id: string };
}

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//Given a number of bytes, return a string
export function bytesToString(bytes: number) {
    if (bytes < 1000) return `${bytes} B`;
    if (bytes < 1000 * 1000) return `${Math.ceil(bytes / 1000)} KB`;
    if (bytes < 1000 * 1000 * 1000)
        return `${Math.ceil(bytes / (1000 * 1000))} MB`;
    else return `${Math.ceil(bytes / (1000 * 1000 * 1000))} GB`;
}

export const zip = (a: unknown[], b: unknown[]) => a.map((k, i) => [k, b[i]]);

export const sum = (a: number[]) => a.reduce((a, b) => a + b, 0);

export async function parseCSV(file: File | string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: function (results: any) {
                resolve(results.data);
            },
            error: function (error: any) {
                reject(error.message);
            },
        });
    });
}

// nl2br() and br2nl() functions are sourced from https://gist.github.com/yidas/41cc9272d3dff50f3c9560fb05e7255e

/**
 * This function is same as PHP's nl2br() with default parameters.
 *
 * @param {string} str Input text
 * @param {boolean} replaceMode Use replace instead of insert
 * @param {boolean} isXhtml Use XHTML
 * @return {string} Filtered text
 */
export function nl2br(str: string, replaceMode?: boolean, isXhtml?: boolean): string {
  let breakTag = (isXhtml) ? '<br />' : '<br>';
  let replaceStr = (replaceMode) ? '$1'+ breakTag : '$1'+ breakTag +'$2';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}

/**
 * This function inverses text from PHP's nl2br() with default parameters.
 *
 * @param {string} str Input text
 * @param {boolean} replaceMode Use replace instead of insert
 * @return {string} Filtered text
 */
export function br2nl(str: string, replaceMode?: boolean): string {
  let replaceStr = (replaceMode) ? "\n" : '';
  // Includes <br>, <BR>, <br />, </br>
  return str.replace(/<\s*\/?br\s*[\/]?>/gi, replaceStr);
}
