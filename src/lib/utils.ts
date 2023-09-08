export function buildRegex(keywords: string[]){
    return new RegExp(keywords.map((w:string) => `(?=.*?${w})`).join("") + ".*",   "i");
}

export function stringifyObjectId(document: Object | null | undefined) {
    if(document) document._id = document?._id.toString();
    return document
}