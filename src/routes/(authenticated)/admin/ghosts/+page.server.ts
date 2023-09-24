import { stringifyObjectId } from "@/lib/utils";
import { GhostSchema } from "@/server/mongo/schemas/ghost";

export async function load() {
    const ghosts = (await GhostSchema.find().lean())?.map(stringifyObjectId) || [];
    
    return { ghosts };
}