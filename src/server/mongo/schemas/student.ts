import mongoose from 'mongoose';



interface StudentDocumentData {
  studentId: string;
  firstName: string;
  lastName: string;
  projects: string[];
  mentorId: string;
  shortDesc: string;
  fullReport: string;
}

const schema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    tags: { type: [String], required: true },
    mentorId: { type: String, required: true },
    shortDesc: { type: String, required: true },
    fullReport: { type: String, required: true }
  },
  { timestamps: true },
);
export type ProjectDocument = mongoose.HydratedDocument<ProjectDocumentData>;

export const ProjectSchema: mongoose.Model<ProjectDocumentData> =
  mongoose.models['Projects'] || mongoose.model('Projects', schema);