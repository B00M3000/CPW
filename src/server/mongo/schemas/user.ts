/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import mongoose from "mongoose";

interface UserDocumentData {
    name: string;
    firstName: string;
    lastName: string;
    picture: string;
    googleId: string;
    email: string;
    sessionId: string;
    accountType: number;
    accessLevel: number;
    adviseeIds: string[];
    graduationYear: number;
    lastVisit: Date;
}

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        picture: { type: String, required: true },
        email: { type: String, required: true },
        sessionId: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { sessionId: { $type: "string" } },
            },
        },
        googleId: {
            type: String,
            index: {
                unique: true,
                partialFilterExpression: { sessionId: { $type: "string" } },
            },
        },
        accountType: { type: Number, required: true, default: 0 },
        accessLevel: { type: Number, required: true, default: 0 },
        adviseeIds: { type: [String], required: true, default: [] },
        graduationYear: { type: Number },
        lastVisit: { type: Date },
    },
    { timestamps: true },
);

export type UserDocument = mongoose.HydratedDocument<UserDocumentData>;

export const UserSchema: mongoose.Model<UserDocumentData> =
    mongoose.models["Users"] || mongoose.model("Users", schema);
