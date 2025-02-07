/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import mongoose from "mongoose";

export interface MentorDocumentData {
    name: string;
    organization: string;
    email: string;
    phoneNumber: string;
    mergedInformation: object[];
}

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        organization: { type: String, required: true},
        email: { type: String, required: true },
        phoneNumber: { type: String },
        mergedInformation: { type: [Object], required: true, default: [] },
    },
    { timestamps: true },
);

schema.index({ name: "text", organization: "text" });

export type MentorDocument = mongoose.HydratedDocument<MentorDocumentData>;

export const MentorSchema: mongoose.Model<MentorDocumentData> =
    mongoose.models["Mentors"] || mongoose.model("Mentors", schema);
