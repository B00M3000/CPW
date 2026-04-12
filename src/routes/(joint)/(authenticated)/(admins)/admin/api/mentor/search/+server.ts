import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { UserSchema } from "@/server/mongo/schemas/user";
import type { RequestEvent } from "@sveltejs/kit";
import { error, json } from "@sveltejs/kit";

export async function GET({ url: { searchParams } }: RequestEvent) {
    const q = searchParams.get('q')?.trim();
    if(!q) error(400, "Search must contain a query.")

    let compound = {
        should: [
            {
                text: {
                    query: q,
                    path: "name",
                    fuzzy: {
                        maxEdits: 2,
                    },
                },
            },
            {
                text: {
                    query: q,
                    path: "organization",
                    fuzzy: {
                        maxEdits: 2,
                    },
                },
            },
        ],
        minimumShouldMatch: 1
    }

    const rawMentors = await MentorSchema.aggregate()
        .search({
            index: "mentorDeduplication",
            compound,
        })
        .sort({
            score: { $meta: "searchScore" },
        } as any)
        .limit(50)
        .project({
            _id: 1,
            name: 1,
            organization: 1,
            email: 1,
        });

    const allMentorIds = rawMentors.map((mentor) => mentor._id.toString());

    const projects = await ProjectSchema.find(
        { mentorId: { $in: allMentorIds } },
        "mentorId title year studentId",
    )
        .lean()
        .sort({ year: -1 });

    const studentIds = [...new Set(projects.map((project) => project.studentId))];
    const students = await UserSchema.find(
        { _id: { $in: studentIds } },
        "name",
    ).lean();

    const studentNameById = new Map(
        students.map((student) => [student._id.toString(), student.name || "Unknown Student"]),
    );

    const projectsByMentorId = new Map<string, any[]>();
    for (const project of projects) {
        if (!projectsByMentorId.has(project.mentorId)) {
            projectsByMentorId.set(project.mentorId, []);
        }
        projectsByMentorId.get(project.mentorId)!.push(project);
    }

    const mentors = rawMentors.map((mentor) => {
        const mentorId = mentor._id.toString();
        const mentorProjects = projectsByMentorId.get(mentorId) || [];
        return {
            ...mentor,
            projectCount: mentorProjects.length,
            projects: mentorProjects.slice(0, 4).map((project) => ({
                _id: project._id.toString(),
                title: project.title,
                year: project.year,
                studentName:
                    studentNameById.get(project.studentId.toString()) ||
                    "Unknown Student",
            })),
        };
    });

    return json({ mentors });
}
