import { deleteObject, uploadObject } from "@/server/aws";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { AWS_S3_IMAGES_BUCKET } from "$env/static/private";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { MAX_PDF_SIZE_BYTES } from "@/lib/constants/upload";

function assertPdfSignature(buffer: Buffer) {
    const signature = buffer.subarray(0, 5).toString("utf-8");
    return signature === "%PDF-";
}

function sanitizeFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120) || "report.pdf";
}

export const PUT: RequestHandler = async ({ request, locals, params: { projectId } }) => {
    if (!locals.user) {
        error(403, { message: "Not authenticated." });
    }

    const project = await ProjectSchema.findById(projectId, "studentId pdf").lean();
    if (!project) error(404, { message: "Project not found." });
    if (project.studentId !== locals.user._id)
        error(403, { message: "You cannot upload a PDF for another user's project." });

    const formData = await request.formData();
    const pdfField = formData.get("pdf");

    if (!(pdfField instanceof File)) {
        error(400, { message: "No PDF file found in request." });
    }

    const pdfFile: File = pdfField;
    const loweredName = pdfFile.name.toLowerCase();

    if (pdfFile.type !== "application/pdf") {
        error(400, { message: "File MIME type must be application/pdf." });
    }

    if (!loweredName.endsWith(".pdf")) {
        error(400, { message: "File extension must be .pdf." });
    }

    if (pdfFile.size <= 0) {
        error(400, { message: "PDF file cannot be empty." });
    }

    if (pdfFile.size > MAX_PDF_SIZE_BYTES) {
        error(400, { message: "PDF exceeds the 25 MB file size limit." });
    }

    const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
    if (!assertPdfSignature(fileBuffer)) {
        error(400, { message: "File does not contain a valid PDF signature." });
    }

    const key = `pdf/${new Date().getTime()}-${Math.floor(Math.random() * 1000)}.pdf`;

    await uploadObject(AWS_S3_IMAGES_BUCKET, key, fileBuffer);

    const newPdf = {
        fileName: sanitizeFileName(pdfFile.name),
        size: pdfFile.size,
        type: pdfFile.type,
        s3Bucket: AWS_S3_IMAGES_BUCKET,
        s3ObjectKey: key,
        uploadedAt: new Date(),
        uploaderId: locals.user._id,
    };

    try {
        await ProjectSchema.updateOne({ _id: projectId }, { pdf: newPdf });
    } catch (e) {
        await deleteObject(AWS_S3_IMAGES_BUCKET, key).catch(() => undefined);
        throw e;
    }

    if (project.pdf?.s3ObjectKey) {
        await deleteObject(project.pdf.s3Bucket, project.pdf.s3ObjectKey).catch(() => undefined);
    }

    return json({
        message: "PDF uploaded successfully.",
        pdf: {
            fileName: newPdf.fileName,
            size: newPdf.size,
            type: newPdf.type,
            uploadedAt: newPdf.uploadedAt,
        },
        pdfUrl: `/project-pdfs/${projectId}`,
    });
};

export const DELETE: RequestHandler = async ({ locals, params: { projectId } }) => {
    if (!locals.user) {
        error(403, { message: "Not authenticated." });
    }

    const project = await ProjectSchema.findById(projectId, "studentId pdf").lean();
    if (!project) error(404, { message: "Project not found." });
    if (project.studentId !== locals.user._id)
        error(403, { message: "You cannot remove a PDF for another user's project." });

    if (!project.pdf?.s3ObjectKey) {
        return json({ message: "No PDF to remove." });
    }

    await ProjectSchema.updateOne({ _id: projectId }, { $unset: { pdf: 1 } });
    await deleteObject(project.pdf.s3Bucket, project.pdf.s3ObjectKey).catch(() => undefined);

    return json({ message: "PDF removed successfully." });
};
