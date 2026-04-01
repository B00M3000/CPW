import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { UserSchema } from "@/server/mongo/schemas/user";
import { json } from "@sveltejs/kit";
import { buildRegex, stringifyObjectId } from "@/lib/utils";

async function injectProjects(mentor: any) {
    const projects = await ProjectSchema.find(
        { mentorId: mentor._id.toString() },
        "_id title year studentId"
    ).limit(8).lean();

    mentor.projects = await Promise.all(projects.map(stringifyObjectId).map(async (p: any) => {
        const student = await UserSchema.findById(p.studentId, "name").lean();
        p.studentName = student ? (student as any).name : "Unknown";
        return p;
    }));
    mentor.projectCount = mentor.projects.length;
    return mentor;
}

export async function GET({ url: { searchParams } }) {
    const q = searchParams.get('q')?.trim();
    if (!q) return json({ mentors: [] });

    let mentors: any[] = [];

    try {
        const compound = {
            should: [
                { text: { query: q, path: "name", fuzzy: { maxEdits: 2 } } },
                { text: { query: q, path: "organization", fuzzy: { maxEdits: 2 } } },
            ],
            minimumShouldMatch: 1
        };

        mentors = await MentorSchema.aggregate()
            .search({ index: "mentorDeduplication", compound })
            .limit(30)
            .project({ _id: 1, name: 1, organization: 1, email: 1, phoneNumber: 1 });
    } catch {
        // Atlas search index may not be configured; fall back to regex search
        const regex = buildRegex(q.split(/\s+/).filter(Boolean));
        mentors = (await MentorSchema.find(
            { $or: [{ name: regex }, { organization: regex }] },
            "_id name organization email phoneNumber"
        ).limit(30).lean()).map(stringifyObjectId);
    }

    await Promise.all(mentors.map(injectProjects));

    return json({ mentors });
}
