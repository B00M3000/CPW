/*
 * Created on Sun Oct 15 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { parseCSV } from '@/lib/utils.js';
import { advisorLinkageDataUpload } from '@/lib/data-upload';
import { error } from '@sveltejs/kit';
import { validateCSV } from '@/lib/utils';
import { UserSchema } from '@/server/mongo/schemas/user.js';
import { AccountType } from '@/lib/enums.js';

const { fields: advisorLinkageDataUploadFields } = advisorLinkageDataUpload;

export async function POST({ request }) {
    const rawCSV = await request.text();

    const parsedCSV = await parseCSV(rawCSV);
    const headings = parsedCSV[0];
    const entries = parsedCSV.slice(1);

    if(!validateCSV(headings, entries, advisorLinkageDataUploadFields)) throw error(400, { message: "Data failed validation." })

    await UserSchema.updateMany({ accountType: AccountType.Advisor }, { adviseeIds: [] });
}

interface Operation {
    updateOne: {
        filter: {
            schoolId: string;
        };
        update: {
            adviseeIds: string[];
        };
        upsert: true;
    }
}

function generateOperations(headings: string[], entries: string[][]): Operation[] {
    let headingsIndexes: Record<string, number> = {}

    Object.keys(advisorLinkageDataUploadFields).forEach((fieldName: string) => {
        headingsIndexes[fieldName] = headings.indexOf(fieldName);
    })

    let advisors: Record<string, string[]> = {}

    entries.forEach(entry => {
        const advisorId = entry[headingsIndexes["Advisor ID"]];
        const adviseeId = entry[headingsIndexes["Advisee ID"]];
        if(!advisors[advisorId]) advisors[advisorId] = [adviseeId];
        else advisors[advisorId].push(adviseeId);
    })

    let operations: Operation[] = []; 

    Object.entries(advisors).forEach(([advisor, adviseeIds]) => operations.push({
        updateOne: {
            filter: {
                _id: entry[headingsIndexes["Identifier"]] // problem how do we know they have already logged in, i think we need separate table
            },
            update: {
                schoolId: entry[headingsIndexes["Identifier"]],
                email: entry[headingsIndexes["Email"]],
                graduationYear: entry[headingsIndexes["Graduation Year"]],
                accessLevel: AccessLevel.Normal,
                accountType: AccountType.Student
            },
            upsert: true
        }
    }))

    return operations;
}