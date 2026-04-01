import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { deleteObject } from "@/server/aws";
import { error, json } from "@sveltejs/kit";

export async function DELETE({ request }) {
    const { projectId } = await request.json();
    if (!projectId) error(400, "projectId is required");

    const project = await ProjectSchema.findById(projectId).lean();
    if (!project) error(404, "Project not found");

    // Clean up PDF from S3 if it exists
    if (project.pdf?.s3ObjectKey) {
        await deleteObject(project.pdf.s3Bucket, project.pdf.s3ObjectKey).catch(() => undefined);
    }

    await ProjectSchema.deleteOne({ _id: projectId });

    return json({ message: "Project deleted." });
}
