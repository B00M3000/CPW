import { stringifyObjectId } from "@/lib/utils.js";
import { ImageSchema } from "@/server/mongo/schemas/image";

export async function load({ locals }) {
    const images = (await ImageSchema.find({}, '').lean())?.map(stringifyObjectId);
    return { images }
}