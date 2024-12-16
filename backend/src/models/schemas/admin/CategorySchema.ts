import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  position: { type: Number, required: true }
}, {
  timestamps: true
});

export const Category = mongoose.model('Category', CategorySchema);