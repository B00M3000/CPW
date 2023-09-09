import { GhostSchema } from '@/server/mongo/schemas/ghost';
import { UserSchema } from '@/server/mongo/schemas/user';
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
    const action = data.action.toUpperCase()
    if(action == "CREATE" || action == "EDIT"){
        const { email, accessLevel, accountType } = data;
        await GhostSchema.findOneAndUpdate({ email }, { email, accessLevel, accountType }, { upsert: true })
        await UserSchema.findOneAndUpdate({ email }, { $unset: { sessionId: "" } })
    } else if(action == "DELETE"){
        const { email } = data;
        await GhostSchema.deleteOne({ email })
    } else {
        throw error(400, `Invalid Request Type! Must be CREATE, EDIT or DELETE given ${data.action.toUpperCase()}`)
    }   
}