/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { currentYear } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error, json } from "@sveltejs/kit";

export async function POST({ request, locals }) {
  const data = await request.json();
  const action = data.action.toUpperCase();
  let mentorId = data.mentorId;

  if (action != "CREATE")
    error(
      400,
      `Invalid Request Type! Must be CREATE given ${data.action.toUpperCase()}`
    );

  if (!mentorId) {
    const mentorSchema = new MentorSchema({
      ...data.mentor,
      name: `${data.mentor.firstName} ${data.mentor.lastName}`,
    });
    const savedMentorSchema = await mentorSchema.save();
    mentorId = savedMentorSchema._id;
  }

  const project = data.project;
  let schema = new ProjectSchema({
    title: project.title,
    year: currentYear(),
    tags: project.tags,
    shortDesc: project.shortDesc,
    fullReport: "",
    underReview: true,
    publish: false,
    mentorId: mentorId,
    studentId: locals.user?._id,
  });

  await schema.save();

  return json({ message: "Actions Successfully Executed." });
}
