/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { error, json } from '@sveltejs/kit';
import { ProjectSchema } from '@/server/mongo/schemas/project';

export async function POST({ request }) {
    const data = await request.json();
    const { action, projectId } = data
    if(action == "APPROVE"){
        await ProjectSchema.findOneAndUpdate({_id: projectId}, {
            underReview: false,
            publish: true
        });
        return json({ message: "Project has been approved." });
        
    } else if (action == "UNAPPROVE"){
        await ProjectSchema.findOneAndUpdate({_id: projectId}, {
            underReview: true,
            publish: false
        });
        return json({ message: "Project has been unapproved." });

    } else {
        error(400, `Invalid action type provided. Given ${action}.`);
    }
}
    
