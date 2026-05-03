import { ProjectSchema } from "@/server/mongo/schemas/project.js";
import { stringifyObjectId } from "@/lib/utils";
import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { UserSchema } from "@/server/mongo/schemas/user";
import { error } from "@sveltejs/kit";

async function injectStudentAndMentor(project: any) {
    const student = await UserSchema.findById(project.studentId, "name email picture").lean();
    project.student = student ? stringifyObjectId(student as any) : null;
    const mentor = await MentorSchema.findById(project.mentorId, "name email phoneNumber organization").lean();
    project.mentor = mentor ? stringifyObjectId(mentor as any) : null;
    project.pdfUrl = project.pdf?.s3ObjectKey
        ? `/project-pdfs/${project._id.toString()}`
        : null;
    return project;
}

export async function load({ params: { projectId } }) {
    const raw = await ProjectSchema.findById(projectId).lean();
    if (!raw) error(404, "Project not found");
    const project = stringifyObjectId(raw as any);
    const inflatedProject = await injectStudentAndMentor(project);
    return { inflatedProject, projectId };
}
