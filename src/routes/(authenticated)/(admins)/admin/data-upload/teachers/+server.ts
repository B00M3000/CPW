/*
 * Created on Sun Oct 15 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { parseCSV } from '@/lib/utils.js';
import { teacherDataUpload } from '@/lib/data-upload';
import { error, json } from '@sveltejs/kit';
import { validateCSV } from '@/lib/utils';
import { AccessLevel, AccountType } from '@/lib/enums';
import { UserSchema } from '@/server/mongo/schemas/user';

const { fields: teacherDataUploadFields } = teacherDataUpload;

export async function POST({ request }) {
    const rawCSV = await request.text();

    const parsedCSV = await parseCSV(rawCSV);
    const headings = parsedCSV[0];
    const entries = parsedCSV.slice(1);

    if(!validateCSV(headings, entries, teacherDataUploadFields)) throw error(400, { message: "Data failed validation." })

    const operations = generateOperations(headings, entries);

    await UserSchema.bulkWrite(operations);

    return json({ message: "Data uploaded successfully!" }, { status: 200 });
}

interface Operation {
    updateOne: {
        filter: {
            schoolId: string;
        };
        update: {
            schoolId: string;
            email: string;
            accessLevel: number;
            accountType: number;
        };
        upsert: true;
    }
}

function generateOperations(headings: string[], entries: string[][]): Operation[] {
    let headingsIndexes: Record<string, number> = {}

    Object.keys(teacherDataUploadFields).forEach((fieldName: string) => {
        headingsIndexes[fieldName] = headings.indexOf(fieldName);
    })

    let operations: Operation[] = []; 

    entries.forEach(entry => operations.push({
        updateOne: {
            filter: {
                schoolId: entry[headingsIndexes["TID"]]
            },
            update: {
                schoolId: entry[headingsIndexes["TID"]],
                email: entry[headingsIndexes["Email"]],
                accessLevel: /Yes/.test(entry[headingsIndexes["AA"]]) ? AccessLevel.Admin : AccessLevel.Normal,
                accountType: AccountType.Advisor
            },
            upsert: true
        }
    }))

    return operations;
}