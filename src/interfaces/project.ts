/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

export interface Student {
    studentId: string; // unique identifier
    firstName: string;
    lastName: string;
    yearOfGraduation: number;
}

export interface Project {
    studentId: string;
    year: number;
    subject: string;
    tags: string[];
    mentor: Mentor;
    shortDesc: string;
    fullReport: string;
}

export interface Mentor {
    firstName: string;
    lastName: string;
    organization: string;
    email: string;
    phoneNumber: number;
}

