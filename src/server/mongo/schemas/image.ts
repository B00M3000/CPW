/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import mongoose from 'mongoose';

interface ImageDocumentData {
    type: string;
    s3Bucket: string;
    s3ObjectKey: string;
    size: number;
    description: string;
    ownerId: string;
    projectId: string;
    createdAt: Date;
}

const schema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    s3Bucket: { type: String, required: true },
    s3ObjectKey: { type: String, required: false },
    size: { type: Number, required: true },
    description: { type: String },
    projectId: { type: String, required: true },
    ownerId: { type: String, required: true }
  },
  { timestamps: true },
);

export type ImageDocument = mongoose.HydratedDocument<ImageDocumentData>;

export const ImageSchema: mongoose.Model<ImageDocumentData> =
  mongoose.models['Images'] || mongoose.model('Images', schema);