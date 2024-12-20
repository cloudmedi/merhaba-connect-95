import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  position: { type: Number, required: true },
  isPublic: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Category = mongoose.model('Category', CategorySchema);