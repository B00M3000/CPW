import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { error, json } from "@sveltejs/kit";

export async function GET({ url: { searchParams } }) {
    const compound: any = {};
    const parsedLimit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const limit = Number.isFinite(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), 10)
        : 10;

    const name = searchParams.get("name")?.trim();
    if (!name) return error(400, "Missing mentor name search parameter.");
    if (name.length > 0) {
        compound.must = {
            text: {
                query: name,
                path: "name",
                fuzzy: {
                    maxEdits: 2,
                },
            },
        };
    }

    const organization = searchParams.get("organization")?.trim();
    if (organization && organization.length > 0) {
        compound.should = {
            text: {
                query: organization,
                path: "organization",
                fuzzy: {
                    maxEdits: 2,
                },
            },
        };
    }

    const pipline = [
        {
            $search: {
                index: "mentorDeduplication",
                compound,
            },
        },
    ];

    const mentors = await MentorSchema.aggregate(pipline)
        .sort({
            score: { $meta: "searchScore" },
        })
        .limit(limit)
        .project({
            _id: 1,
            name: 1,
            organization: 1,
            email: 1,
        });

    return json({ mentors });
}
