/*
 * Created on Sun Oct 15 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

export type Fields = Record<string, RegExp>;

export interface DataUpload {
    name: string;
    fields: Fields;
}

export const studentDataUpload: DataUpload = {
    name: "Student",
    fields: {
        "Identifier": /S(\d+)/,
        "Email": /.+@.+\..+/,
        "Graduation Year": /\d{4}/
    }
}

export const teacherDataUpload: DataUpload = {
    name: "Teacher",
    fields: {
        "Identifier": /T(\d+)/,
        "Email": /.+@.+\..+/,
        "Administrator Access": /(|No|Yes)/ 
    }
}

export const advisorLinkageDataUpload: DataUpload = {
    name: "Advisor Linkages",
    fields: {
        "Advisee Identifier": /S(\d+)/,
        "Advisor Identifier": /T(\d+)/,
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