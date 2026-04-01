import { UserSchema } from "@/server/mongo/schemas/user";
import { AccountType } from "@/lib/enums";
import { json } from "@sveltejs/kit";
import { stringifyObjectId } from "@/lib/utils";

export async function GET({ url: { searchParams } }) {
    const email = searchParams.get("email")?.trim().toLowerCase();
    if (!email) return json({ user: null });

    const user = await UserSchema.findOne(
        { email, accountType: AccountType.Student },
        "_id name email graduationYear"
    ).lean();

    if (!user) return json({ user: null });
    return json({ user: stringifyObjectId(user) });
}
