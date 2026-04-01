/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error, json } from "@sveltejs/kit";
import { sanitizeFilter } from "mongoose";
import {
    validateMentorInformation,
    validateProjectShortDescription,
    validateProjectTags,
    validateProjectTitle,
} from "../../create/server-validation";
import { MentorSchema } from "@/server/mongo/schemas/mentor";

export async function POST({ locals, request, params: { projectId } }) {
    const {
        project: { shortDesc, tags, title },
        mentorInformation,
        existingMentorId,
    } = await request.json();

    const existingProject = await ProjectSchema.findOne(
        sanitizeFilter({ _id: projectId }),
        "studentId mentorId",
    ).lean();
    if (!existingProject) {
        return error(404, "Project not found.");
    }

    if (existingProject.studentId.toString() !== locals.user?._id?.toString()) {
        return error(403, "You cannot edit this project.");
    }

    // Validate project details
    let validationResult = validateProjectTitle(title);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    validationResult = validateProjectTags(tags);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    validationResult = validateProjectShortDescription(shortDesc);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    const incomingMentorInformation = {
        fullName: mentorInformation?.fullName?.trim() || "",
        organization: mentorInformation?.organization?.trim() || "",
        email: mentorInformation?.email?.trim() || "",
        phoneNumber: mentorInformation?.phoneNumber?.trim() || "",
    };

    validationResult = validateMentorInformation(incomingMentorInformation);
    if (validationResult !== true) {
        return error(400, validationResult.join(" "));
    }

    const currentMentor = await MentorSchema.findById(
        existingProject.mentorId,
        "name organization email phoneNumber",
    ).lean();
    if (!currentMentor) {
        return error(404, "Current mentor not found.");
    }

    const mentorChanged =
        currentMentor.name.trim() !== incomingMentorInformation.fullName ||
        currentMentor.organization.trim() !== incomingMentorInformation.organization ||
        currentMentor.email.trim() !== incomingMentorInformation.email ||
        (currentMentor.phoneNumber || "").trim() !== incomingMentorInformation.phoneNumber;

    let nextMentorId = existingProject.mentorId.toString();

    if (existingMentorId && existingMentorId !== nextMentorId) {
        const selectedMentor = await MentorSchema.findById(existingMentorId, "_id").lean();
        if (!selectedMentor) {
            return error(400, "Selected existing mentor was not found.");
        }
        nextMentorId = existingMentorId;
    } else if (mentorChanged) {
        const mentor = await MentorSchema.create({
            name: incomingMentorInformation.fullName,
            organization: incomingMentorInformation.organization,
            email: incomingMentorInformation.email,
            phoneNumber: incomingMentorInformation.phoneNumber,
        });
        nextMentorId = mentor._id.toString();
    }

    await ProjectSchema.findOneAndUpdate(sanitizeFilter({ _id: projectId }), {
        title,
        tags: [...new Set(tags)],
        shortDesc,
        mentorId: nextMentorId,
    });

    return json({ message: "Project has been updated." });
}
