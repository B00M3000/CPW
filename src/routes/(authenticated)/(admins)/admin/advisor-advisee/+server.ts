import { stringifyObjectId } from '@/lib/utils.js';
import { GhostSchema } from '@/server/mongo/schemas/ghost.js';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request }) {
    const data = await request.json();

    if(Array.isArray(data)){
        await Promise.all(data.map(handleOne))
    } else {
        await handleOne(data)
    }

    return json({ message: "Actions Successfully Executed." });
}

async function handleOne(data: any){
    const { email, adviseeEmails } = data;
    const adviseeIds = (await (UserSchema.find({ email: { $in: adviseeEmails }}, '_id').lean()))?.map(stringifyObjectId).map(a => a._id) || []
    await UserSchema.findOneAndUpdate({ email }, { adviseeIds })
}