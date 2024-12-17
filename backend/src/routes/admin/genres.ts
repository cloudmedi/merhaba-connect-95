import express from 'express';
import { Genre } from '../../models/admin/Genre';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

// Get all genres
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Create genre
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const genre = new Genre({
      ...req.body,
      createdBy: req.user.id
    });
    await genre.save();
    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create genre' });
  }
});

// Update genre
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(genre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update genre' });
  }
});

// Delete genre
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Genre.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete genre' });
  }
});

export default router;