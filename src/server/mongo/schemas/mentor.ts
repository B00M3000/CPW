import mongoose from 'mongoose';

export interface MentorDocumentData {
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  phoneNumber: string;
}

const schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    organization: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  { timestamps: true },
);
export type MentorDocument = mongoose.HydratedDocument<MentorDocumentData>;

export const MentorSchema: mongoose.Model<MentorDocumentData> =
  mongoose.models['Mentors'] || mongoose.model('Mentors', schema);