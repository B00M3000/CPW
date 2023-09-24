import { ProjectSchema } from "@/server/mongo/schemas/project";
import { user } from "@/client/stores/user";

export async function load(){

    const projectCountPublished = await ProjectSchema.count({ publish: true, studentId: user.id });
    const projectCountNotPublished = await ProjectSchema.count({ publish: false, studentId: user.id})
    return { projectCountPublished, projectCountNotPublished };
}