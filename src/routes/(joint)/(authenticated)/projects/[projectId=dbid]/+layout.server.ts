/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { AccessLevel } from "@/lib/enums.js";
import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { error } from "@sveltejs/kit";

export async function load({ params, locals }) {
  const projectId = params.projectId;
  const project = await ProjectSchema.findById(projectId);

  if (!project) error(404, { message: "No project exists with this ID" });

  const allowedToView =
    project.studentId == locals?.user?._id ||
    locals?.user?.accountType == AccessLevel.Admin ||
    project.publish;

  if (!allowedToView)
    error(403, {
      message: "Project is not published and cannot be viewed publicly.",
    });
}
