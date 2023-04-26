import fs from 'fs';

const original_projects = JSON.parse(fs.readFileSync('./static/projects-2022.json'))

const new_projects = original_projects.map(p => ({
    studentId: p['Student ID'],
    subject: p['Project Subject'],
    year: 2022,
    tags: [p['Category 1']], // temp just the first
    mentor: {
        firstName: p['Mentor First Name'],
        lastName: p['Mentor Last Name'],
        organization: p['Mentor Organization'],
        email: p['Mentor E-mail'],
        phoneNumber: p['Mentor Phone Number']
    }, 
    shortDescription: "N/A",
    fullReport: "N/A"
}))

const new_students = original_projects.map(p => ({
    studentId: p['Student ID'],
    firstName: p['Name First'],
    lastName: p['Name Last'],
    yearOfGraduation: p['Year of Graduation'],
}))

fs.writeFileSync('./src/client/data/generated/projects.json', JSON.stringify(new_projects, null, 2))
fs.writeFileSync('./src/client/data/generated/students.json', JSON.stringify(new_students, null, 2))

console.log("New Files Generated and Saved!")