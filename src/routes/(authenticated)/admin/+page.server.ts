import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";

export async function load(){

    const projectCountPublished = await ProjectSchema.count({underReview: false});
    const projectCountNotPublished = await ProjectSchema.count({underReview: true})
    return { projectCountPublished, projectCountNotPublished };
}