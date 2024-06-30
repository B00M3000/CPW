/*
 * Created on Thur Feb 29 2024
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { stringifyObjectId } from "@/lib/utils.js";
import { MobileKeySchema, type MobileKeyDocument } from "@/server/mongo/schemas/mobileKey";
import { error } from "@sveltejs/kit";

export async function load({ params, locals, url }) {
    const mobileKey = url.searchParams.get('mobileKey');
    const mobileKeyDoc: any = stringifyObjectId(await MobileKeySchema.findOne({ mobileKey }).lean());
    // if(!mobileKeyDoc) {
    //     return error(404, 'Mobile key not found! Please try again. (Mobile keys are only valid for a short period after they are generated.)');
    // }
    const user = stringifyObjectId(await MobileKeySchema.findById(mobileKeyDoc.userId).lean());
    const project = stringifyObjectId(await MobileKeySchema.findById(mobileKeyDoc.projectId).lean());

    return { user, project }
};
