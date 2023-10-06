import Papa from 'papaparse';

export function buildRegex(keywords: string[]){
    return new RegExp(keywords.map((w:string) => `(?=.*?${w})`).join("") + ".*",   "i");
}

export function stringifyObjectId(document: Object | null | undefined) {
    if(document) document._id = document?._id.toString();
    return document
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

export async function parseCSV(file: File): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: function (results: any) { resolve(results.data) },
      error: function (error: any) { reject(error.message) }
    });
  });
}