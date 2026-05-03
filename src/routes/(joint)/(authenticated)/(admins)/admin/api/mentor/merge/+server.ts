import { MentorSchema } from "@/server/mongo/schemas/mentor";
import { ProjectSchema } from "@/server/mongo/schemas/project";
import { error, json } from "@sveltejs/kit";

export async function POST({ request }) {
    const { primaryId, duplicateId } = await request.json();

    if (!primaryId || !duplicateId) error(400, "Request must contain primaryId and duplicateId");
    if (primaryId === duplicateId) error(400, "primaryId and duplicateId must be different");

    const session = await MentorSchema.db.startSession();

    try {
        await session.withTransaction(async () => {
            const [primary, duplicate] = await Promise.all([
                MentorSchema.findById(primaryId).session(session).lean(),
                MentorSchema.findById(duplicateId).session(session).lean(),
            ]);

            if (!primary) error(404, "Primary mentor not found");
            if (!duplicate) error(404, "Duplicate mentor not found");

            // Re-point all projects that reference the duplicate to the primary mentor
            await ProjectSchema.updateMany(
                { mentorId: duplicateId },
                { mentorId: primaryId },
                { session },
            );

            // Archive the duplicate's information into the primary's mergedInformation array
            const mergedInfo = {
                name: duplicate.name,
                email: duplicate.email,
                organization: duplicate.organization,
                phoneNumber: duplicate.phoneNumber,
                originalId: duplicateId,
                mergedAt: new Date(),
            };
            await MentorSchema.updateOne(
                { _id: primaryId },
                { $push: { mergedInformation: mergedInfo } },
                { session },
            );

            // Remove the duplicate mentor document
            await MentorSchema.deleteOne({ _id: duplicateId }, { session });
        });

        return json({ message: "Mentors merged successfully!" });
    } finally {
        await session.endSession();
    }
}
