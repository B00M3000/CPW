import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { error, json } from "@sveltejs/kit";

export async function GET({ url: { searchParams } }) {
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

    const mentors = await MentorSchema.aggregate()
        .search({
            index: "mentorDeduplication",
            compound,
        })
        .sort({
            score: { $meta: "textScore" },
        })
        .limit(50)
        .project({
            _id: 1,
            name: 1,
            organization: 1,
            email: 1,
        });

    return json({ mentors });
}
