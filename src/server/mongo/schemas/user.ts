import mongoose from 'mongoose';

interface UserData {
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
    session_id: { type: String, required: true },
    google_id: { type: String, required: true },
  },
  { timestamps: true },
);
export type UserDocument = mongoose.HydratedDocument<UserData>;

export const UserSchema: mongoose.Model<UserData> =
  mongoose.models['Users'] || mongoose.model('Users', schema);