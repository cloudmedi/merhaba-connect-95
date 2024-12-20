import express, { Response } from 'express';
import { PlaylistService } from '../../services/common/PlaylistService';
import { adminAuth } from '../../middleware/auth';
import { AuthRequest } from '../../types/express';
import multer from 'multer';
import { bunnyConfig } from '../../config/bunny';
import { logger } from '../../utils/logger';

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  }
});

const router = express.Router();

router.use(adminAuth);

// Upload artwork endpoint
router.post('/upload-artwork', upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = `artwork_${Date.now()}.${fileExtension}`;

    // Upload to Bunny CDN
    const bunnyUrl = `https://${bunnyConfig.baseUrl}/${bunnyConfig.storageZoneName}/artwork/${uniqueFileName}`;
    
    const uploadResponse = await fetch(bunnyUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': bunnyConfig.apiKey,
        'Content-Type': file.mimetype
      },
      body: file.buffer
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      logger.error('Failed to upload to Bunny CDN:', {
        status: uploadResponse.status,
        error: errorText
      });
      throw new Error('Failed to upload file to CDN');
    }

    // Construct the CDN URL for the uploaded file
    const cdnUrl = `https://${bunnyConfig.storageZoneName}.b-cdn.net/artwork/${uniqueFileName}`;
    
    return res.json({ 
      url: cdnUrl,
      message: 'Artwork uploaded successfully' 
    });

  } catch (error: any) {
    logger.error('Error uploading artwork:', error);
    return res.status(500).json({ 
      error: 'Failed to upload artwork',
      details: error.message 
    });
  }
});

// Hero playlist endpoint
router.get('/hero', async (_req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(_req.io);
    const heroPlaylist = await playlistService.getHeroPlaylist();
    return res.json(heroPlaylist);
  } catch (error) {
    console.error('Error fetching hero playlist:', error);
    return res.status(500).json({ error: 'Error fetching hero playlist' });
  }
});

// Get all playlists
router.get('/', async (req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlists = await playlistService.getAllPlaylists();
    return res.json(playlists);
  } catch (error: any) {
    console.error('Error fetching playlists:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch playlists',
      details: error.message 
    });
  }
});

// Create playlist
router.post('/', async (req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.createPlaylist(req.body);
    return res.status(201).json(playlist);
  } catch (error: any) {
    console.error('Error creating playlist:', error);
    return res.status(500).json({ 
      error: 'Failed to create playlist',
      details: error.message 
    });
  }
});

// Update playlist
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Playlist ID is required' });
    }

    const playlistService = new PlaylistService(req.io);
    const playlist = await playlistService.updatePlaylist(id, req.body);
    return res.json(playlist);
  } catch (error: any) {
    console.error('Error updating playlist:', error);
    return res.status(500).json({ 
      error: 'Failed to update playlist',
      details: error.message 
    });
  }
});

// Delete playlist
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const playlistService = new PlaylistService(req.io);
    await playlistService.deletePlaylist(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting playlist:', error);
    return res.status(500).json({ 
      error: 'Failed to delete playlist',
      details: error.message 
    });
  }
});

export default router;