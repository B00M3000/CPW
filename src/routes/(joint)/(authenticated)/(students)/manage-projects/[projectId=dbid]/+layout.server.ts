import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error } from "@sveltejs/kit";

export async function load({ params: { projectId }, locals }) {
    const project = await ProjectSchema.findById(projectId, "studentId");
    if (!project) error(404, "Project not found!");
    if (project.studentId != locals.user._id)
        error(403, "You cannot manage this project!");
}
