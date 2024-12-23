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

// Get all songs
router.get('/', authMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    return res.json(songs);
  } catch (error) {
    logger.error('Error fetching songs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// EventSource endpoint for upload progress
router.get('/upload', authMiddleware, adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

    // Keep connection alive
    const keepAlive = setInterval(() => {
      if (!res.writableEnded) {
        res.write(': keepalive\n\n');
      }
    }, 15000);

    // Cleanup on client disconnect
    req.on('close', () => {
      clearInterval(keepAlive);
      if (!res.writableEnded) {
        res.end();
      }
    });

    return res; // Return the response object

  } catch (error) {
    logger.error('Error establishing EventSource connection:', error);
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: 'Connection failed' })}\n\n`);
      res.end();
    }
    return res;
  }
});

// Upload endpoint
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

      const uploadService = new SongUploadService();
      
      // Pass progress callback
      const progressCallback = (progress: number) => {
        if (!res.writableEnded) {
          res.write(`data: ${JSON.stringify({
            type: 'progress',
            fileName: req.file?.originalname,
            progress
          })}\n\n`);
        }
      };

      await uploadService.uploadSong(req.file, req.user?.id, progressCallback, res);
      return res;

    } catch (error: any) {
      logger.error('Error during upload process:', error);
      
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ 
          type: 'error', 
          error: error.message,
          fileName: req.file?.originalname
        })}\n\n`);
        res.end();
      }
      return res;
    }
});

// Delete song
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
    return res.json({ message: 'Song successfully deleted' });

  } catch (error: any) {
    logger.error('Error deleting song:', error);
    return res.status(500).json({ 
      error: 'Error deleting song',
      details: error.message 
    });
  }
});

export default router;