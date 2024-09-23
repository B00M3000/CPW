import { UserSchema } from "@/server/mongo/schemas/user";
import { error } from "@sveltejs/kit";

export async function GET({ url: { searchParams } }) {
    const q = searchParams.get('q')?.trim();
    if(!q) error(400, "Search must contain a query.")

    const mentors = await UserSchema.find({  })
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
