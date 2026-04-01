import { ProjectSchema } from "@/server/mongo/schemas/project";
import { UserSchema } from "@/server/mongo/schemas/user";
import { buildRegex, stringifyObjectId } from "@/lib/utils";
import { json } from "@sveltejs/kit";

export async function GET({ url: { searchParams } }) {
    const q = searchParams.get("q")?.trim();
    if (!q) return json({ projects: [] });

    const regex = buildRegex(q.split(/\s+/).filter(Boolean));

    // Search projects by title
    const byTitle = await ProjectSchema.find(
        { title: regex },
        "_id title year studentId underReview publish"
    ).limit(30).lean();

    // Search students by name to find their projects
    const students = await UserSchema.find({ name: regex }, "_id name").limit(20).lean();
    const studentIds = students.map((s: any) => s._id.toString());
    const byStudent = studentIds.length
        ? await ProjectSchema.find(
            { studentId: { $in: studentIds } },
            "_id title year studentId underReview publish"
          ).limit(30).lean()
        : [];

    // Merge and deduplicate
    const seen = new Set<string>();
    const allProjects = [...byTitle, ...byStudent].filter(p => {
        const id = p._id.toString();
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
    });

    const studentMap = new Map(students.map((s: any) => [s._id.toString(), (s as any).name]));

    const inflated = await Promise.all(allProjects.map(stringifyObjectId).map(async (p: any) => {
        if (studentMap.has(p.studentId)) {
            p.studentName = studentMap.get(p.studentId);
        } else {
            const student = await UserSchema.findById(p.studentId, "name").lean();
            p.studentName = student ? (student as any).name : "Unknown";
        }
        return p;
    }));

    return json({ projects: inflated });
}
