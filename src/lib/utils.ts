export function buildRegex(keywords: string[]){
    return new RegExp(keywords.map((w:string) => `(?=.*?${w})`).join("") + ".*",   "i");
}

export function stringifyObjectId(document: Object | null | undefined) {
    if(document) document._id = document?._id.toString();
    return document
}


//Given "x" bytes, return a string with the value
export function bytesToString(bytes: number){
    if(bytes < 1000) return `${bytes} B`;
    if(bytes < (1000 * 1000)) return `${Math.ceil(bytes / 1000)} KB`;
    if(bytes < (1000 * 1000 * 1000)) return `${Math.ceil(bytes / (1000 * 1000))} MB`;
}