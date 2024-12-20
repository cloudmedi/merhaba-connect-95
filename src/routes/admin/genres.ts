import express from 'express';
import { GenreService } from '../../services/admin/GenreService';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const genreService = new GenreService();

// Get all genres
router.get('/', authMiddleware, adminMiddleware, async (_req: AuthRequest, res) => {
  try {
    const genres = await genreService.getAllGenres();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Create genre
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const genre = await genreService.createGenre({
      ...req.body,
      createdBy: req.user?.id
    });
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create genre' });
  }
});

// Update genre
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const genre = await genreService.updateGenre(req.params.id, req.body);
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update genre' });
  }
});

// Delete genre
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    await genreService.deleteGenre(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete genre' });
  }
});

export default router;