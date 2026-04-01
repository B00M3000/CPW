import { ProjectSchema } from "@/server/mongo/schemas/project";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import {
    validateMentorInformation,
    validateProjectShortDescription,
    validateProjectTags,
    validateProjectTitle,
} from "@/routes/(joint)/(authenticated)/(students)/manage-projects/create/server-validation";
import { json } from "@sveltejs/kit";

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
