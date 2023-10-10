import mongoose from 'mongoose';

interface GhostDocumentData {
    schoolId: string;
    graduationYear?: number;
    email: string;
    accountType: number;
    accessLevel: number;
}

const schema = new mongoose.Schema(
  {
    schoolId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    accountType: { type: Number, required: true },
    accessLevel: { type: Number, required: true },
    graduationYear: { type: Number },
  },
  { timestamps: true },
);

export type GhostDocument = mongoose.HydratedDocument<GhostDocumentData>;

export const GhostSchema: mongoose.Model<GhostDocumentData> =
  mongoose.models['Ghosts'] || mongoose.model('Ghosts', schema);