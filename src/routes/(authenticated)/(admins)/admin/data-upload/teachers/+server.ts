import { parseCSV } from '@/lib/utils.js';
import { teacherDataUpload } from '@/lib/data-upload';
import { error } from '@sveltejs/kit';
import { validateCSV } from '@/lib/utils';

const { fields: teacherDataUploadFields } = teacherDataUpload;

export async function POST({ request }) {
    const rawCSV = await request.text();

    const parsedCSV = await parseCSV(rawCSV);
    const headings = parsedCSV[0];
    const entries = parsedCSV.slice(1);

    if(!validateCSV(headings, entries, teacherDataUploadFields)) throw error(400, { message: "Data failed validation." })


}

function generateQueries(headings: string[], entries: string[][]) {
    teacherDataUploadFields['Advisee Identifier']
    teacherDataUploadFields['Advisor Identifier']
}