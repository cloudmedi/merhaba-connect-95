import express, { Response } from 'express';
import { Song } from '../../models/schemas/admin/SongSchema';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';
import { SongUploadService } from '../../services/upload/SongUploadService';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 1
  }
});

interface AuthRequest extends express.Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const uploadService = new SongUploadService();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    logger.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  upload.single('file'),
  async (req: AuthRequest & { file?: Express.Multer.File }, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Set up SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });

      // Handle client disconnection
      req.on('close', () => {
        logger.info('Client disconnected, cancelling upload');
        uploadService.cancelUpload();
      });

      await uploadService.uploadSong(req.file, req.user?.id, res);

    } catch (error: any) {
      logger.error('Error during upload process:', error);
      
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
      }
    }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    if (song.bunnyId) {
      const fileExtension = song.fileUrl.split('.').pop();
      const fileName = `${song.bunnyId}.${fileExtension}`;
      const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/music/${fileName}`;
      
      logger.info(`Attempting to delete file from Bunny CDN: ${bunnyUrl}`);
      
      const deleteResponse = await fetch(bunnyUrl, {
        method: 'DELETE',
        headers: {
          'AccessKey': bunnyConfig.apiKey,
          'Accept': '*/*'
        }
      });

      if (!deleteResponse.ok && deleteResponse.status !== 404) {
        const errorText = await deleteResponse.text();
        logger.error('Failed to delete file from Bunny CDN:', {
          status: deleteResponse.status,
          statusText: deleteResponse.statusText,
          error: errorText
        });
        throw new Error(`Failed to delete file from CDN: ${errorText}`);
      }
    }

    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: 'Song successfully deleted' });

  } catch (error: any) {
    logger.error('Error deleting song:', error);
    res.status(500).json({ 
      error: 'Error deleting song',
      details: error.message 
    });
  }
});

export default router;