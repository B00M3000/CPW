import { MentorSchema } from "@/server/mongo/schemas/mentor";
import {
    validateProjectTitle,
    validateProjectTags,
    validateProjectShortDescription,
    validateMentorInformation,
} from "./server-validation";
import { error, json } from "@sveltejs/kit";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { currentYear } from "@/lib/utils";

export async function POST({ locals: { user }, request }) {
    // eslint-disable-next-line prefer-const
    let { projectDetails, mentorInformation, existingMentorId, fullReport } = await request.json();

    // TODO: type of on all things to verify?

    // Validate project details
    let validationResult = validateProjectTitle(projectDetails.title);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    validationResult = validateProjectTags(projectDetails.tags);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    validationResult = validateProjectShortDescription(
        projectDetails.shortDescription,
    );
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    // Validate mentor information
    validationResult = validateMentorInformation(mentorInformation);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    // making sure full report isn't bloat
    if (fullReport && fullReport.length > 100000) {
        return error(400, "Full report is too long.");
    }

    if (!existingMentorId) {
        const mentorSchema = new MentorSchema({
            name: mentorInformation.fullName,
            organization: mentorInformation.organization,
            email: mentorInformation.email,
            phoneNumber: mentorInformation.phoneNumber,
        });
        const savedMentorSchema = await mentorSchema.save();
        existingMentorId = savedMentorSchema._id;
    } else {
        await MentorSchema.findByIdAndUpdate(existingMentorId, {
            mergedMentorInformation: { $push: { studentId: user?._id, ...mentorInformation } },
        })
    }

    const projectSchema = new ProjectSchema({
        title: projectDetails.title,
        year: currentYear(),
        tags: projectDetails.tags,
        shortDesc: projectDetails.shortDescription,
        fullReport: fullReport,
        underReview: true,
        publish: false,
        mentorId: existingMentorId,
        studentId: user?._id,
    });

    await projectSchema.save();

    return json({ message: "Project successfully created." });
}
