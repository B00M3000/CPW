import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { json, text } from "@sveltejs/kit";

function getValidLinkedMentorIds(mentorIds: unknown[]) {
    return new Set(
        mentorIds
            .filter(Boolean)
            .map((id) => String(id).trim())
            .filter((id) => /^[a-f\d]{24}$/i.test(id)),
    );
}

export async function GET({ url }: { url: URL }) {
    let includeMentors = false;
    let mentorLimit = 100;
    includeMentors = ["1", "true", "yes"].includes(
        (url.searchParams.get("includeMentors") || "").toLowerCase(),
    );

    const parsedLimit = Number.parseInt(url.searchParams.get("limit") || "", 10);
    if (Number.isFinite(parsedLimit)) {
        mentorLimit = Math.max(1, Math.min(parsedLimit, 1000));
    }

    const [allMentors, linkedMentorIdsRaw] = await Promise.all([
        MentorSchema.find({}, "_id name organization email").lean(),
        ProjectSchema.distinct("mentorId"),
    ]);

    const linkedMentorIds = getValidLinkedMentorIds(linkedMentorIdsRaw);
    const unlinkedMentors = allMentors.filter(
        (mentor) => !linkedMentorIds.has(mentor._id.toString()),
    );

    let unlinkedCount = 0;
    unlinkedCount = unlinkedMentors.length;

    if (!includeMentors) {
        return json({ unlinkedCount });
    }

    return json({
        unlinkedCount,
        unlinkedMentors: unlinkedMentors.slice(0, mentorLimit).map((mentor) => ({
            _id: mentor._id.toString(),
            name: (mentor as any).name ?? "",
            organization: (mentor as any).organization ?? "",
            email: (mentor as any).email ?? "",
        })),
    });
}

export async function DELETE() {
    const [allMentors, linkedMentorIdsRaw] = await Promise.all([
        MentorSchema.find({}, "_id").lean(),
        ProjectSchema.distinct("mentorId"),
    ]);
    const linkedMentorIds = getValidLinkedMentorIds(linkedMentorIdsRaw);
    const unlinkedMentorObjectIds = allMentors
        .filter((mentor) => !linkedMentorIds.has(mentor._id.toString()))
        .map((mentor) => mentor._id);

    const result = await MentorSchema.deleteMany({
        _id: { $in: unlinkedMentorObjectIds },
    });

    return text(`Purge complete! Deleted ${result.deletedCount ?? 0} unlinked mentors.`);
}
