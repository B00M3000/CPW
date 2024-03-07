/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";

export async function load(){
    const projectCountPublished = await ProjectSchema.count({underReview: false});
    const projectCountNotPublished = await ProjectSchema.count({underReview: true})
    return { projectCountPublished, projectCountNotPublished };
}