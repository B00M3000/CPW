import { AccountType } from "@/lib/enums";
import { stringifyObjectId } from "@/lib/utils";
import { UserSchema } from "@/server/mongo/schemas/user";

export async function load() {
    const advisors = (await UserSchema.find({ accountType: AccountType.Advisor }, 'adviseeIds name email').lean())?.map(stringifyObjectId) || [];

    const inflatedAdvisors = await Promise.all(advisors.map(injectAdvisees));

    return { advisors: inflatedAdvisors };
}

async function injectAdvisees(advisor: any) {
    advisor.advisees = stringifyObjectId(await UserSchema.findById(advisor.studentId, 'firstName lastName').lean());
    return advisor;
}