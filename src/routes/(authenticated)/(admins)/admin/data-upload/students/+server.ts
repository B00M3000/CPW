import { parseCSV } from '@/lib/utils.js';
import { studentDataUpload } from '@/lib/data-upload';
import { error } from '@sveltejs/kit';
import { validateCSV } from '@/lib/utils';

const { fields: studentDataUploadFields } = studentDataUpload;

export async function POST({ request }) {
    const rawCSV = await request.text();

    const parsedCSV = await parseCSV(rawCSV);
    const headings = parsedCSV[0];
    const entries = parsedCSV.slice(1);

    if(!validateCSV(headings, entries, studentDataUploadFields)) throw error(400, { message: "Data failed validation." })


}

interface Request {
    filter: any;
    query: any;
}

function generateRequests(headings: string[], entries: string[][]) {
    let headingsIndexes: Record<string, number> = {}

    Object.keys(studentDataUploadFields).forEach((fieldName: string) => {
        headingsIndexes[fieldName] = headings.indexOf(fieldName);
    })

    let requests: Request[] = []; 

    entries.forEach(entry => requests.push({
        filter: {
            schoolId: entry[headingsIndexes["Identifier"]]
        },
        query: {
            schoolId: entry[headingsIndexes["Identifier"]],
            email: entry[headingsIndexes["Email"]],
            graduationYear: entry[headingsIndexes["Graduation Year"]]
        }
    }))

    studentDataUploadFields['Advisee Identifier']
    studentDataUploadFields['Advisor Identifier']
}