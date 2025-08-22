/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { error, redirect, type Handle } from "@sveltejs/kit";
import mongo from "@/server/mongo";
import { UserSchema, type UserDocument } from "@/server/mongo/schemas/user";
import { stringifyObjectId } from "@/lib/utils";
import { AccessLevel, AccountType } from "./lib/enums";

const dbPromise = mongo();

export const handle: Handle = async ({ event, resolve }) => {
    await dbPromise;

    const sessionId = event.cookies.get("session_id");

    if (sessionId) {
        const user = await UserSchema.findOneAndUpdate(
            { sessionId },
            { lastVisit: new Date() },
        )
            .select(
                "name firstName lastName email picture accountType accessLevel adviseeIds",
            )
            .lean();

        if (user) {
            event.locals.user = stringifyObjectId(user as UserDocument);
        } else {
            event.cookies.delete("session_id", { path: "/" });
        }
    }


    if(event.route.id?.includes("(authenticated)") && !event.locals.user) {
        return redirect(307, "/login");
    }

    if(event.route.id?.includes("(students)") && event.locals.user.accountType != AccountType.Student) {
        return error(403, { message: "Only Students" });
    }

    if(event.route.id?.includes("(advisors)") && event.locals.user.accountType != AccountType.Advisor) {
        return error(403, { message: "Only Advisors" });
    }

    if(event.route.id?.includes("(admins)") && event.locals.user.accessLevel != AccessLevel.Admin) {
        return error(403, { message: "Only Admins" });
    }

    return await resolve(event);
};

// export async function handleError({  }) {

// }

export async function handleFetch({ request, fetch }) {
    return await fetch(request, {
        credentials: "same-origin",
    });
}
