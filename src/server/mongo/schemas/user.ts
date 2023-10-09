import mongoose from 'mongoose';

interface UserDocumentData {
  name: string;
  firstName: string;
  lastName: string;
  picture: string;
  googleId: string;
  email: string
  sessionId: string;
  accountType: number;
  accessLevel: number;
  adviseeIds: string[];
}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    picture: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    sessionId: { type: String, unique: true },
    googleId: { type: String, required: true, unique: true },
    accountType: { type: Number, required: true, default: 0 },
    accessLevel: { type: Number, required: true, default: 0 },
    adviseeIds: { type: [String], required: true, default: [] }
  },
  { timestamps: true },
);

export type UserDocument = mongoose.HydratedDocument<UserDocumentData>;

export const UserSchema: mongoose.Model<UserDocumentData> =
  mongoose.models['Users'] || mongoose.model('Users', schema);