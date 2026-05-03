import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { UserSchema } from "@/server/mongo/schemas/user";
import { currentYear } from "@/lib/utils";
import { error, json } from "@sveltejs/kit";
import { AccountType } from "@/lib/enums";

export async function POST({ request }) {
    const body = await request.json();
    const { studentId, title, tags, shortDesc, mentorId, newMentor, year } = body;

    if (!studentId) error(400, "studentId is required");
    if (!title?.trim()) error(400, "title is required");
    if (!tags?.length) error(400, "At least one tag is required");
    if (!shortDesc?.trim()) error(400, "shortDesc is required");

    const student = await UserSchema.findById(studentId, "accountType").lean();
    if (!student) error(404, "Student not found");
    if ((student as any).accountType !== AccountType.Student) error(400, "User is not a student");

    let resolvedMentorId = mentorId;

    if (!resolvedMentorId) {
        if (!newMentor?.name || !newMentor?.email || !newMentor?.organization) {
            error(400, "Either an existing mentorId or new mentor details (name, email, organization) are required");
        }
        const mentor = await MentorSchema.create({
            name: newMentor.name.trim(),
            email: newMentor.email.trim(),
            organization: newMentor.organization.trim(),
            phoneNumber: newMentor.phoneNumber?.trim() || "",
        });
        resolvedMentorId = mentor._id.toString();
    } else {
        const mentor = await MentorSchema.findById(resolvedMentorId, "_id").lean();
        if (!mentor) error(404, "Mentor not found");
    }

    const projectYear = typeof year === "number" ? year : currentYear();

    const project = await ProjectSchema.create({
        studentId,
        title: title.trim(),
        year: projectYear,
        tags,
        shortDesc: shortDesc.trim(),
        fullReport: "",
        underReview: false,
        publish: false,
        mentorId: resolvedMentorId,
    });

    return json({ projectId: project._id.toString() });
}
