/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error, json } from "@sveltejs/kit";

export async function POST({ request, locals, params: { projectId } }) {
    if (!locals.user) {
        error(403, "Not authenticated.");
    }

    const { fullReport } = await request.json();

    const project = await ProjectSchema.findById(projectId, "studentId pdf").lean();
    if (!project) {
        return json({ message: "Project not found." }, { status: 404 });
    }

    if (project.studentId.toString() !== locals.user._id.toString()) {
        error(403, "You cannot update another user's report.");
    }

    if (typeof fullReport !== "string") {
        return json({ message: "Report text must be a string." }, { status: 400 });
    }

    const safeFullReport = fullReport;

    if (!safeFullReport.trim() && !project.pdf?.s3ObjectKey) {
        return json(
            {
                message:
                    "A report must include text or a PDF upload before saving.",
            },
            { status: 400 },
        );
    }

    await ProjectSchema.findOneAndUpdate(
        {
            _id: projectId,
        },
        { fullReport: safeFullReport },
    );

    return json({ message: "Report updated successfully!" });
}
