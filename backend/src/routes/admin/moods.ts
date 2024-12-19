import express from 'express';
import { MoodService } from '../../services/admin/MoodService';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const moodService = new MoodService();

// Get all moods with search
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const searchQuery = req.query.search as string;
    const moods = await moodService.getAllMoods(searchQuery);
    res.json(moods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// Create mood
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const mood = await moodService.createMood({
      ...req.body,
      createdBy: req.user?.id
    });
    res.status(201).json(mood);
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(500).json({ error: 'Failed to create mood' });
  }
});

// Update mood
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const mood = await moodService.updateMood(req.params.id, req.body);
    res.json(mood);
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({ error: 'Failed to update mood' });
  }
});

// Delete mood
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    await moodService.deleteMood(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({ error: 'Failed to delete mood' });
  }
});

export default router;