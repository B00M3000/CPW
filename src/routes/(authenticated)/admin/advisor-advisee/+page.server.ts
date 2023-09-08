import { AccountType } from "@/lib/enums";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";

export async function load() {
    const advisors = (await UserSchema.find({ accountType: AccountType.Advisor }, 'advisees name email').lean())?.map(stringifyObjectId);
    return { advisors };
}