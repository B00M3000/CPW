import { ProjectSchema } from "@/server/mongo/schemas/project";
import type { PageServerLoad } from "./$types";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";
import { ImageSchema } from "@/server/mongo/schemas/image";

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    
    const project = stringifyObjectId(await ProjectSchema.findById(id).lean());
    const student = stringifyObjectId(await UserSchema.findById(project?.studentId).lean())
    const mentor = stringifyObjectId(await MentorSchema.findById(project?.mentorId).lean());
    const inflatedImages = await Promise.all((await ImageSchema.find({}, 'projectId description').lean())?.map(stringifyObjectId).map(injectProjects));

    return { project, mentor, student, images: inflatedImages };
}

async function injectProjects(image: any) {
    image.project = stringifyObjectId(await ProjectSchema.findById(image.projectId, 'title').lean());
    return image;
}