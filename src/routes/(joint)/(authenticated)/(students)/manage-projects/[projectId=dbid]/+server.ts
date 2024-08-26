import { stringifyObjectId } from "@/lib/utils";
import { ImageSchema } from "@/server/mongo/schemas/image";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error, json } from "@sveltejs/kit";

export async function DELETE({ params: { projectId } }) {
    await ProjectSchema.deleteOne({ _id: projectId });

    await ImageSchema.deleteMany({ projectId });

    // const projectsOfMentor =
    //   (await ProjectSchema.find({ mentorId: project.mentorId })) || [];

    // if (projectsOfMentor.length == 0) {
    //   await MentorSchema.deleteOne({ _id: project.mentorId });
    // }

    // TODO: Later this will be replaced since there will be a separate mentor object per project

    await ImageSchema.deleteMany({ projectId: projectId });

    return json({ message: "Sucessfully deleted project." });
}
