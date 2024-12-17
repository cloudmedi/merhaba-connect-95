import path from 'path';
import fs from 'fs/promises';
import { File } from '../models/File';

export class FileService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, userId: string) {
    const fileDoc = new File({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedBy: userId
    });

    await fileDoc.save();
    return fileDoc;
  }

  async getFile(fileId: string) {
    return File.findById(fileId);
  }

  async deleteFile(fileId: string) {
    const file = await File.findById(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    await fs.unlink(file.path);
    await file.deleteOne();
  }
}