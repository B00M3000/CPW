import mongoose from 'mongoose';

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
    sessionId: { type: String, required: true, unique: true },
    googleId: { type: String, required: true, unique: true },
    accountType: { type: Number, required: true, default: 0 },
    accessLevel: { type: Number, required: true, default: 0 }
  },
  { timestamps: true },
);

export type UserDocument = mongoose.HydratedDocument<UserDocumentData>;

export const UserSchema: mongoose.Model<UserDocumentData> =
  mongoose.models['Users'] || mongoose.model('Users', schema);