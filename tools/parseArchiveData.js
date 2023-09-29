import fs from 'fs';

const projects23 = fs.readFileSync("CWS-PWD/raw-data/projects23.csv");


// interface Project {
//     "lastName": string;
//     "firstName": string;
//     "studentId": string;
//     "yearOfGrad": number;
//     "tags": [];
//     "desc": string;
//     "mentorFirst": string;
//     "mentorLast": string;
//     "mentorOrg": string;
//     "mentorEmail": string;
// }

console.log(projects23)


