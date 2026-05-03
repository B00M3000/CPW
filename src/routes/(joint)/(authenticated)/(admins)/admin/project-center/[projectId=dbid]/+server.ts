import { ProjectSchema } from "@/server/mongo/schemas/project";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import {
    validateMentorInformation,
    validateProjectShortDescription,
    validateProjectTags,
    validateProjectTitle,
} from "@/routes/(joint)/(authenticated)/(students)/manage-projects/create/server-validation";
import { deleteObject, uploadObject } from "@/server/aws";
import { AWS_S3_IMAGES_BUCKET } from "$env/static/private";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { MAX_PDF_SIZE_BYTES } from "@/lib/constants/upload";

const MAX_PDF_FILENAME_LENGTH = 120;

function assertPdfSignature(buffer: Buffer) {
    return buffer.subarray(0, 5).toString("utf-8") === "%PDF-";
}

function sanitizePdfFileName(name: string) {
    return name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, MAX_PDF_FILENAME_LENGTH) || "report.pdf";
}

export const PUT: RequestHandler = async ({ request, params: { projectId }, locals }) => {
    const project = await ProjectSchema.findById(projectId, "pdf").lean();
    if (!project) error(404, { message: "Project not found." });

    const formData = await request.formData();
    const pdfField = formData.get("pdf");
    if (!(pdfField instanceof File)) error(400, { message: "No PDF file found in request." });

    const pdfFile: File = pdfField;
    if (pdfFile.type !== "application/pdf") error(400, { message: "File MIME type must be application/pdf." });
    if (!pdfFile.name.toLowerCase().endsWith(".pdf")) error(400, { message: "File extension must be .pdf." });
    if (pdfFile.size <= 0) error(400, { message: "PDF file cannot be empty." });
    if (pdfFile.size > MAX_PDF_SIZE_BYTES) error(400, { message: "PDF exceeds the 25 MB file size limit." });

    const fileBuffer = Buffer.from(await pdfFile.arrayBuffer());
    if (!assertPdfSignature(fileBuffer)) error(400, { message: "File does not contain a valid PDF signature." });

    const key = `pdf/${Date.now()}-${Math.floor(Math.random() * 1000)}.pdf`;
    await uploadObject(AWS_S3_IMAGES_BUCKET, key, fileBuffer);

    const newPdf = {
        fileName: sanitizePdfFileName(pdfFile.name),
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

    return json({ message: "PDF uploaded successfully.", pdfUrl: `/project-pdfs/${projectId}` });
};

export const DELETE: RequestHandler = async ({ params: { projectId } }) => {
    const project = await ProjectSchema.findById(projectId, "pdf").lean();
    if (!project) error(404, { message: "Project not found." });

    if (!project.pdf?.s3ObjectKey) {
        return json({ message: "No PDF to remove." });
    }

    await ProjectSchema.updateOne({ _id: projectId }, { $unset: { pdf: 1 } });
    await deleteObject(project.pdf.s3Bucket, project.pdf.s3ObjectKey).catch(() => undefined);

    return json({ message: "PDF removed successfully." });
};

export async function POST({ request, params: { projectId } }) {
    const req = await request.json();
    if (req.Action == "SAVE") {
        const fullReport = req.fullReport;
        await ProjectSchema.findOneAndUpdate(
            { _id: projectId },
            { fullReport },
        );
    } else if (req.Action == "PUBLISH") {
        const publish = req.publish;
        await ProjectSchema.findOneAndUpdate(
            { _id: projectId },
            { publish },
        );
    } else if (req.Action == "UPDATE") {
        const { title, tags, shortDesc, mentor, existingMentorId } = req;

        let validationResult = validateProjectTitle(title);
        if (validationResult !== true) {
            return json({ message: validationResult.join(" ") }, { status: 400 });
        }

        validationResult = validateProjectTags(tags);
        if (validationResult !== true) {
            return json({ message: validationResult.join(" ") }, { status: 400 });
        }

        validationResult = validateProjectShortDescription(shortDesc);
        if (validationResult !== true) {
            return json({ message: validationResult.join(" ") }, { status: 400 });
        }

        const mentorInformation = {
            fullName: mentor?.name?.trim() || "",
            organization: mentor?.organization?.trim() || "",
            email: mentor?.email?.trim() || "",
            phoneNumber: mentor?.phoneNumber?.trim() || "",
        };

        validationResult = validateMentorInformation(mentorInformation);
        if (validationResult !== true) {
            return json({ message: validationResult.join(" ") }, { status: 400 });
        }

        const project = await ProjectSchema.findById(projectId, "mentorId").lean();
        if (!project) {
            return json({ message: "Project not found." }, { status: 404 });
        }

        const currentMentor = await MentorSchema.findById(
            project.mentorId,
            "name organization email phoneNumber",
        ).lean();
        if (!currentMentor) {
            return json({ message: "Current mentor not found." }, { status: 404 });
        }

        const mentorChanged =
            currentMentor.name.trim() !== mentorInformation.fullName ||
            currentMentor.organization.trim() !== mentorInformation.organization ||
            currentMentor.email.trim() !== mentorInformation.email ||
            (currentMentor.phoneNumber || "").trim() !== mentorInformation.phoneNumber;

        let nextMentorId = project.mentorId.toString();

        if (existingMentorId && existingMentorId !== nextMentorId) {
            const selectedMentor = await MentorSchema.findById(existingMentorId, "_id").lean();
            if (!selectedMentor) {
                return json({ message: "Selected existing mentor was not found." }, { status: 400 });
            }
            nextMentorId = existingMentorId;
        } else if (mentorChanged) {
            const newMentor = await MentorSchema.create({
                name: mentorInformation.fullName,
                email: mentorInformation.email,
                organization: mentorInformation.organization,
                phoneNumber: mentorInformation.phoneNumber,
            });
            nextMentorId = newMentor._id.toString();
        }

        const updated = await ProjectSchema.findOneAndUpdate(
            { _id: projectId },
            { title, tags, shortDesc, mentorId: nextMentorId },
        );
        if (!updated) {
            return json({ message: "Project not found." }, { status: 404 });
        }
    }

    return json({ message: "Project updated successfully!" });
}
