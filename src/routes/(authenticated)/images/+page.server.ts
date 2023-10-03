import { stringifyObjectId } from "@/lib/utils";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { ProjectSchema } from "@/server/mongo/schemas/project";

export async function load() {
    const inflatedImages = await Promise.all((await ImageSchema.find({}, 'projectId description').lean())?.map(stringifyObjectId).map(injectProjects));
    return { images: inflatedImages }
}

async function injectProjects(image: any) {
    image.project = stringifyObjectId(await ProjectSchema.findById(image.projectId, 'title').lean());
    return image;
}