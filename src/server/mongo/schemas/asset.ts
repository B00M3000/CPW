import mongoose from 'mongoose';

interface AssetDocumentData {
    contentType: string;
    data: Buffer;
    desc: string;
}

const schema = new mongoose.Schema(
  {
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    desc: { type: String, required: true}
  },
  { timestamps: true },
);

export type AssetDocument = mongoose.HydratedDocument<AssetDocumentData>;

export const AssetSchema: mongoose.Model<AssetDocumentData> =
  mongoose.models['Assets'] || mongoose.model('Assets', schema);