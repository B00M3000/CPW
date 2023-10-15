/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { buildRegex, stringifyObjectId } from '@/lib/utils';
import { UserSchema } from '@/server/mongo/schemas/user';
import { error, json } from '@sveltejs/kit';

export async function GET({ url }) {
    const searchParams = url.searchParams;

    const query = searchParams.get('query');

    if(query) {
        const students = (await UserSchema.find({ $or: [ { email: buildRegex([ query ]) }, { name: buildRegex(query.split(" ")) } ] }, 'name email').lean())?.map(stringifyObjectId);

        return json({ students })
    } else {
        throw error(400, "You must submit a query.")
    }
}