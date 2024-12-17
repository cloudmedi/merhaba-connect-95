import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: { 
    type: String, 
    required: true 
  },
  originalName: String,
  mimeType: String,
  size: Number,
  path: { 
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

export const File = mongoose.model('File', fileSchema);