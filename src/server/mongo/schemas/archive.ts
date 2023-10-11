import mongoose from 'mongoose';

export interface ArchiveDocumentData {
  title: string;
  year: number;
  mentorName: String;
  shortDesc: string;
  studentName: string;
}

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: true },
    shortDesc: { type: String, default: "" },
    mentorName: { type: String, required: true},
    studentName: { tyle: String, required: true }
  },
  { timestamps: true },
);
export type ArchiveDocuments = mongoose.HydratedDocument<ArchiveDocumentData>;

export const ArchiveSchema: mongoose.Model<ArchiveDocumentData> =
  mongoose.models['Archive'] || mongoose.model('Archive', schema);