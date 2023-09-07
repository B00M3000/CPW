import { ProjectSchema } from '@/server/mongo/schemas/project';
import { MentorSchema } from '@/server/mongo/schemas/mentor';
import { UserSchema } from '@/server/mongo/schemas/user';
import lowRelevance from "@client/data/generated/low-relevance.json";
function buildRegex(keywords:string[]){
    return new RegExp(keywords.map((w:string) => `(?=.*?${w})`).join("") + ".*",   "i");
}


export async function load({ url }) {
    const searchParams = url.searchParams

    const tags = searchParams.get('tags')?.split("_")
    const yearUpper = searchParams.get('yearUpper');
    const yearLower = searchParams.get('yearLower');
    const mentorSearch = searchParams.get('mentorSearch');
    const studentSearch = searchParams.get('studentSearch');
    const title = searchParams.get('query')?.split(" ");
    let titleRegex: RegExp = new RegExp("/");

    if(title){
        titleRegex = buildRegex(title.filter((word) => {
            return !lowRelevance.includes(word) && !(word.length === 1);
        }))
    }
   
    

    const projects = await ProjectSchema.find({ tags, title: titleRegex})

    return { projects }
}