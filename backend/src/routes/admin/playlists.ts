import express, { Request, Response } from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { authMiddleware } from '../../middleware/auth.middleware';
import multer from 'multer';
import { ChunkUploadService } from '../../services/upload/ChunkUploadService';
import path from 'path';

// Extend Request type to include user and file properties
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
  io?: any;
  file?: Express.Multer.File;
}

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply auth middleware to all routes
router.use(authMiddleware);

// Add artwork upload endpoint using Bunny CDN
router.post('/upload-artwork', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExtension = path.extname(req.file.originalname);
    const uniqueFileName = `artwork/${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    
    const uploadService = new ChunkUploadService();
    const fileUrl = await uploadService.uploadFile(req.file.buffer, uniqueFileName);

    console.log('Artwork uploaded to Bunny CDN:', fileUrl);
    res.json({ url: fileUrl });

  } catch (error) {
    console.error('Error uploading artwork:', error);
    res.status(500).json({ error: 'Error uploading artwork' });
  }
});

// Playlist CRUD
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User ID is required' });
    }

    console.log('Creating playlist with data:', req.body);
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.createPlaylist({
      name: req.body.name,
      description: req.body.description,
      isPublic: req.body.is_public,
      isHero: req.body.is_hero,
      artworkUrl: req.body.artwork_url,
      songs: req.body.songs?.map((songId: string) => ({ songId, position: 0 })) || [],
      categories: req.body.categories || [],
      genre: req.body.genre_id,
      mood: req.body.mood_id,
      createdBy: req.user.id
    });
    res.json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Error creating playlist', details: errorMessage });
  }
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlists = await playlistService.getAllPlaylists();
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching playlists' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.updatePlaylist(req.params.id, req.body);
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Error updating playlist' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const playlistService = new PlaylistService(req.io);
    await playlistService.deletePlaylist(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting playlist' });
  }
});

export default router;