import express from 'express';
import { User } from '../../models/admin/User';
import { adminAuth } from '../../middleware/auth.middleware';
import { logger } from '../../utils/logger';

const router = express.Router();

// Tüm kullanıcıları getir
router.get('/', adminAuth, async (_req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Yeni kullanıcı oluştur
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

// ID'ye göre kullanıcı getir
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

// Kullanıcı güncelle
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    logger.error('Error updating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Kullanıcı sil
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