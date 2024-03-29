/*
 * Created on Sun Oct 15 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { parseCSV } from '@/lib/utils.js';
import { studentDataUpload } from '@/lib/data-upload';
import { error, json } from '@sveltejs/kit';
import { validateCSV } from '@/lib/utils';
import { AccessLevel, AccountType } from '@/lib/enums';
import { UserSchema } from '@/server/mongo/schemas/user';

const { fields: studentDataUploadFields } = studentDataUpload;

export async function POST({ request }) {
    const rawCSV = await request.text();

    const parsedCSV = await parseCSV(rawCSV);
    const headings = parsedCSV[0];
    const entries = parsedCSV.slice(1);

    if(!validateCSV(headings, entries, studentDataUploadFields)) throw error(400, { message: "Data failed validation." })

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
            graduationYear: number;
            accessLevel: number;
            accountType: number;
        };
        upsert: true;
    }
}

function generateOperations(headings: string[], entries: string[][]): Operation[] {
    let headingsIndexes: Record<string, number> = {}

    Object.keys(studentDataUploadFields).forEach((fieldName: string) => {
        headingsIndexes[fieldName] = headings.indexOf(fieldName);
    })

    let operations: Operation[] = []; 

    entries.forEach(entry => operations.push({
        updateOne: {
            filter: {
                schoolId: entry[headingsIndexes["SID"]]
            },
            update: {
                schoolId: entry[headingsIndexes["SID"]],
                email: entry[headingsIndexes["Email"]],
                graduationYear: parseInt(entry[headingsIndexes["GY"]]),
                accessLevel: AccessLevel.Normal,
                accountType: AccountType.Student
            },
            upsert: true
        }
    }))

    return operations;
}