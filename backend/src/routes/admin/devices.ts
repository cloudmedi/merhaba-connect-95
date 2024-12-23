import express from 'express';
import { Device } from '../../models/manager/Device';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/auth.middleware';
import { logger } from '../../utils/logger';

const router = express.Router();

// Get all devices
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const devices = await Device.find().populate('branchId');
    res.json(devices);
  } catch (error) {
    logger.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Create new device
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const device = new Device(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    logger.error('Error creating device:', error);
    res.status(500).json({ error: 'Failed to create device' });
  }
});

// Update device
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    return res.json(device);
  } catch (error) {
    logger.error('Error updating device:', error);
    return res.status(500).json({ error: 'Failed to update device' });
  }
});

// Delete device
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const device = await Device.findByIdAndDelete(req.params.id);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting device:', error);
    return res.status(500).json({ error: 'Failed to delete device' });
  }
});

export default router;