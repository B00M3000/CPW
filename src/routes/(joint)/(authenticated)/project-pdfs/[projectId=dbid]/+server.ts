import { AccessLevel, AccountType } from "@/lib/enums";
import { getObject } from "@/server/aws";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error } from "@sveltejs/kit";

function safeInlineFilename(fileName: string) {
    return (fileName || "report.pdf").replace(/["\\\r\n]/g, "_");
}

export async function GET({ locals, params: { projectId }, setHeaders }) {
    const project = await ProjectSchema.findById(projectId, "studentId publish pdf").lean();

    if (!project?.pdf?.s3ObjectKey) {
        error(404, { message: "Project PDF not found." });
    }

    const isOwner = project.studentId === locals.user._id;
    const isAdmin = locals.user.accessLevel === AccessLevel.Admin;
    const isAdvisorOfStudent =
        locals.user.accountType === AccountType.Advisor &&
        locals.user.adviseeIds?.includes(project.studentId);
    const isPublished = !!project.publish;

    if (!isPublished && !isOwner && !isAdmin && !isAdvisorOfStudent) {
        error(403, { message: "You do not have access to this PDF." });
    }

    const object = await getObject(project.pdf.s3Bucket, project.pdf.s3ObjectKey);

    setHeaders({
        "Cache-Control": isPublished ? "public, max-age=1209600" : "private, max-age=300",
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
