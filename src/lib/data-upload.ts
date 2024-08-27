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
        SID: /S(\d+)/,
        Email: /^([a-z]|\d|-)+@.+\..+$/,
        GY: /\d{4}/,
    },
};

export const teacherDataUpload: DataUpload = {
    name: "Teacher",
    fields: {
        TID: /T(\d+)/,
        Email: /^([a-z]|\d|-)+@.+\..+$/,
        AA: /(|No|Yes)/,
    },
};

export const advisorLinkageDataUpload: DataUpload = {
    name: "Advisor Linkages",
    fields: {
        SID: /S(\d+)/,
        TID: /T(\d+)/,
    },
};

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
