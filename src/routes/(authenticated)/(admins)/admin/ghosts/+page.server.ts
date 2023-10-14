/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { stringifyObjectId } from "@/lib/utils";
import { GhostSchema } from "@/server/mongo/schemas/ghost";

export async function load() {
    const ghosts = (await GhostSchema.find().lean())?.map(stringifyObjectId) || [];
    
    return { ghosts };
}