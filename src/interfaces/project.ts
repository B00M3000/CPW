/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */


export interface Student {
    _id: string
    studentId: string; // unique identifier
    firstName: string;
    lastName: string;
    yearOfGraduation: number;
    picture: string;
}

export interface Project {
    _id : string;
    studentId: string;
    title: string;
    year: number;
    subject: string;
    tags: string[];
    mentorId: string;
    shortDesc: string;
    fullReport: string;
    publish: boolean;
    underReview: boolean;
}

export interface User {
    _id : string;
    name : string;
    firstName : string;
    lastName : string;
    email : string;
    schoolId : string;
    accountType : number;
    accessLevel : number;
    graduationYear : number;
    adviseeIds : string[];
}

export interface Mentor {
    firstName: string;
    lastName: string;
    organization: string;
    email: string;
    phoneNumber: number;
}



