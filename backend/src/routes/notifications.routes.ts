import express from 'express';
import { Notification } from '../models/schemas/admin/NotificationSchema';
import { auth } from '../middleware/auth';

const router = express.Router();

// Bildirimleri getir
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Bildirimler alınırken bir hata oluştu' });
  }
});

// Bildirimi okundu olarak işaretle
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Bildirim güncellenirken bir hata oluştu' });
  }
});

export default router;