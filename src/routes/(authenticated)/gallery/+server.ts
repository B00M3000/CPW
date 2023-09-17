import { ProjectSchema } from '@/server/mongo/schemas/project';
import { UserSchema } from '@/server/mongo/schemas/user';
import { stringifyObjectId } from "@/lib/utils";
import { error, json } from '@sveltejs/kit';
import { AssetSchema } from '@/server/mongo/schemas/asset.js';

export async function POST({ request }) {
    const data = await request.json();
    const action = data.action?.toUpperCase()

    if(action == "CREATE"){
        const images: File[] = data.files;
        for(const image in images){
            console.log(image)
            let schema = new AssetSchema({ 
                contentType: image.type, 
                ownerId: data.ownerId,
                desc: data.desc,
                data:
              })
        }

    } else {
        throw error(400, `Invalid Request Type! Must be CREATE, EDIT or DELETE given ${data.action.toUpperCase()}`)
    }   

    return json({ message: "Actions Successfully Executed." });
}
