/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { currentYear } from "@/lib/utils";
import mongoose from "mongoose";

interface UserDocumentData {
    name?: string;
    firstName?: string;
    lastName?: string;
    picture: string;
    googleId: string;
    email: string;
    sessionId: string;
    accountType: number;
    accessLevel: number;
    adviseeIds: string[];
    schoolId: string;
    graduationYear: number;
    lastVisit: Date;
    ignore?: number;
}

const schema = new mongoose.Schema(
    {
        name: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        picture: { type: String, required: true, default: "/assets/ghost.png" },
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
        // schoolId: { type: String, required: true, unique: true },
        accountType: { type: Number, required: true, default: 0 },
        accessLevel: { type: Number, required: true, default: 0 },
        adviseeIds: { type: [String], required: true, default: [] },
        graduationYear: { type: Number, required: true, default: () => currentYear() },
        lastVisit: { type: Date },
        ignore: { type: Number, required: false }
    },
    { timestamps: true },
);

export type UserDocument = mongoose.HydratedDocument<UserDocumentData>;

export const UserSchema: mongoose.Model<UserDocumentData> =
    mongoose.models["Users"] || mongoose.model("Users", schema);
