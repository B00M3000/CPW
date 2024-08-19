/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import Papa from 'papaparse';
import type { Fields } from '@/lib/data-upload';
import escapeRegExp from "lodash/escapeRegExp";

export function buildRegex(keywords: string[]){
    return new RegExp(keywords.map(escapeRegExp).map((w:string) => `(?=.*?${w})`).join("") + ".*",   "i");
}

export function stringifyObjectId(document: Object | null | undefined) {
    if(document) document._id = document?._id.toString();
    return document
}

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

//Given a number of bytes, return a string
export function bytesToString(bytes: number){
    if(bytes < 1000) return `${bytes} B`;
    if(bytes < (1000 * 1000)) return `${Math.ceil(bytes / 1000)} KB`;
    if(bytes < (1000 * 1000 * 1000)) return `${Math.ceil(bytes / (1000 * 1000))} MB`;
    else return `${Math.ceil(bytes / (1000 * 1000 * 1000))} GB`;
}

export const zip = (a: unknown[], b: unknown[]) => a.map((k, i) => [k, b[i]]);

export const sum = (a: number[]) => a.reduce((a, b) => a + b, 0);

export async function parseCSV(file: File | string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: function (results: any) { resolve(results.data) },
      error: function (error: any) { reject(error.message) }
    });
  });
}

export function validateCSV(headings: string[], entries: string[][], fields: Fields) {
  return Object.keys(fields).every((fieldName: string) => headings.filter(h => h == fieldName).length == 1) 
  && headings.every((heading) => fields[heading]) 
  && entries.every((entry) => entry.every((part, i) => fields[headings[i]].test(part)));
}
