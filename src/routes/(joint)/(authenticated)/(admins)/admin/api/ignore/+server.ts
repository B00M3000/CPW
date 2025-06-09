// Feature for the Year Status Page

import { UserSchema } from "@/server/mongo/schemas/user";
import { currentYear } from "@/lib/utils";
import { error, json } from "@sveltejs/kit";

// PUT: Set ignore flag for a user for the current year
export async function PUT({ request }) {
    const { userId } = await request.json();
    if (!userId) error(400, "Missing userId");

    console.log(`[IGNORE API] PUT request for userId: ${userId}`);

    const result = await UserSchema.updateOne(
        { _id: userId },
        { $set: { ignore: currentYear() } },
    );

    console.log(`[IGNORE API] PUT update result:`, result);

    return json({ message: "User ignored for current year" });
}

// DELETE: Remove ignore flag for a user (unset)
export async function DELETE({ request }) {
    const { userId } = await request.json();
    if (!userId) error(400, "Missing userId");

    console.log(`[IGNORE API] DELETE request for userId: ${userId}`);

    // Correct way to remove a field in MongoDB is with $unset
    const result = await UserSchema.updateOne(
        { _id: userId },
        { $unset: { ignore: "" } }
    );

    console.log(`[IGNORE API] DELETE update result:`, result);

    return json({ message: "User ignore flag removed", id: userId });
}

// This feature is for the Year Status Page
