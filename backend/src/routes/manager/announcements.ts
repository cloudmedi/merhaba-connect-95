import express from 'express';
import { AnnouncementService } from '../../services/manager/AnnouncementService';
import { validateAnnouncementInput } from '../../middleware/validation';

const router = express.Router();
const announcementService = new AnnouncementService();

router.get('/', async (req, res, next) => {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    res.json(announcements);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateAnnouncementInput, async (req, res, next) => {
  try {
    const announcement = await announcementService.createAnnouncement(req.body);
    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateAnnouncementInput, async (req, res, next) => {
  try {
    const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
    res.json(announcement);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await announcementService.deleteAnnouncement(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;