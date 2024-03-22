
/*
 * Created on Thur Feb 29 2024
 *
 * Copyright (c) 2024 Thomas Zhou
 */

import mongoose from 'mongoose';

interface MobileKeyDocumentData {
  projectId: string;
  mobileKey: string;
  userId: string;
  expireAt: Date;
}

const schema = new mongoose.Schema(
  {
    projectId: { type: String, required: true },
    mobileKey: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, expires: '3h' }
  },
  { timestamps: true },
);

export type MobileKeyDocument = mongoose.HydratedDocument<MobileKeyDocumentData>;

export const MobileKeySchema: mongoose.Model<MobileKeyDocumentData> =
  mongoose.models['Mobile Keys'] || mongoose.model('Mobile Keys', schema);