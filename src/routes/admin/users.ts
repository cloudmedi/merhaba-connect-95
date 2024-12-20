import express, { Request, Response } from 'express';
import { User } from '../../models/admin/User';
import { adminAuth } from '../../middleware/auth';
import { logger } from '../../utils/logger';

const router = express.Router();

// Get all users
router.get('/', adminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
    return;
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Create user
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
    return;
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Get user by ID
router.get('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Update user
router.put('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
    return;
  } catch (error) {
    logger.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

// Delete user
router.delete('/:id', adminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
    return;
  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

export default router;