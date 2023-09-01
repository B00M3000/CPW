import mongoose from 'mongoose';

export enum AccountType {
  Unassisgned,
  Student,
  Advisor
}

export enum AccessLevel {
  Normal,
  Admin
}

interface UserDocumentData {
  name: string;
  picture: string;
  google_id: string;
  email: string
  session_id: string;
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    picture: { type: String, required: true },
    email: { type: String, required: true },
    session_id: { type: String, required: true, unique: true },
    google_id: { type: String, required: true, unique: true },
    account_type: { type: Number, required: true, default: 0 },
    access_level: { type: Number, required: true, default: 0 }
  },
  { timestamps: true },
);
export type UserDocument = mongoose.HydratedDocument<UserDocumentData>;

export const UserSchema: mongoose.Model<UserDocumentData> =
  mongoose.models['Users'] || mongoose.model('Users', schema);