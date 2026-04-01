import { getObject } from "@/server/aws";
import {
    canPubliclyCacheProjectAsset,
    canViewProject,
} from "@/server/project-access";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error } from "@sveltejs/kit";

function safeInlineFilename(fileName: string) {
    return (fileName || "report.pdf").replace(/["\\\r\n]/g, "_");
}

export async function GET({ locals, params: { projectId }, setHeaders }) {
    if (!locals.user) {
        error(403, { message: "Not authenticated." });
    }

    const project = await ProjectSchema.findById(projectId, "studentId publish pdf").lean();

    if (!project?.pdf?.s3ObjectKey) {
        error(404, { message: "Project PDF not found." });
    }

    if (!canViewProject(locals.user, project)) {
        error(403, { message: "You do not have access to this PDF." });
    }

    const object = await getObject(project.pdf.s3Bucket, project.pdf.s3ObjectKey);
    const isPublished = canPubliclyCacheProjectAsset(locals.user, project);

    setHeaders({
        "Cache-Control": isPublished ? "public, max-age=1209600" : "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": `inline; filename="${safeInlineFilename(project.pdf.fileName)}"`,
    });

    return new Response(object.Body, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
        },
    });
}
