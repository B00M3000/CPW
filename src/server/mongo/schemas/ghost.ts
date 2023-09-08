import mongoose from 'mongoose';

interface GhostDocumentData {
    email: string;
    accountType: number;
    accessLevel: number;
}

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    accountType: { type: Number, required: true },
    accessLevel: { type: Number, required: true }
  },
  { timestamps: true },
);

export type GhostDocument = mongoose.HydratedDocument<GhostDocumentData>;

export const GhostSchema: mongoose.Model<GhostDocumentData> =
  mongoose.models['Ghosts'] || mongoose.model('Ghosts', schema);