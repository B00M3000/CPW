export type Fields = Record<string, RegExp>;

export interface DataImport {
    name: string;
    fields: Fields;
}

export const studentDataImport: DataImport = {
    name: "Student",
    fields: {
        "Identifier": /(T|S)(\d+)/,
        "Email": /.+@.+\..+/,
        "Graduation Year": /\d{4}/
    }
}

export const teacherDataImport: DataImport = {
    name: "Teacher",
    fields: {
        "Identifier": /(T|S)(\d+)/,
        "Email": /.+@.+\..+/,
        "Administrator Access": /(|No|Yes)/ 
    }
}

export const advisorLinkageDataImport: DataImport = {
    name: "Advisee-Advisor Linkages",
    fields: {
        "Advisee Identifier": /(S)(\d+)/,
        "Advisor Identifier": /(T)(\d+)/,
    }
}

export interface Student {
    id: string;
    email: string;
    graduationYear: number;
    accountType: number;
}

export interface Teacher {
    id: string;
    email: string;
    accessLevel: number;
    accountType: number;
}

export interface AdvisorLinkage {
    adviseeId: string;
    advisorId: string;
}