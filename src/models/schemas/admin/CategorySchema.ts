import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: { type: String },
  position: { type: Number, required: true },
  createdBy: { type: String, required: true }
}, {
  timestamps: true
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);