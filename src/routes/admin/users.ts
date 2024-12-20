import express from 'express';
import { adminAuth } from '../../middleware/auth';
import { User } from '../../models/admin/User';
import { logger } from '../../utils/logger';

const router = express.Router();

// Get all users
router.get('/', adminAuth, async (_req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    logger.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    logger.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    logger.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;