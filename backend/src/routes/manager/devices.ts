import express from 'express';
import { Device } from '../../models/manager/Device';
import { authMiddleware } from '../../middleware/auth.middleware';
import { managerMiddleware } from '../../middleware/manager.middleware';
import { logger } from '../../utils/logger';

const router = express.Router();

// Register device and get token
router.post('/register', async (req, res) => {
  try {
    const { macAddress, systemInfo } = req.body;

    // MAC adresi ile mevcut cihazı kontrol et
    let device = await Device.findOne({ macAddress });

    if (device) {
      // Cihaz varsa token'ı güncelle
      device.systemInfo = systemInfo;
      device.lastSeen = new Date();
      await device.save();
      
      return res.json({
        token: device.token,
        status: 'active',
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        mac_address: macAddress,
        system_info: systemInfo
      });
    }

    // Yeni cihaz oluştur
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    device = new Device({
      name: `Device-${token}`,
      token,
      macAddress,
      systemInfo,
      status: 'offline',
      lastSeen: new Date()
    });

    await device.save();

    return res.json({
      token: device.token,
      status: 'active',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      mac_address: macAddress,
      system_info: systemInfo
    });
  } catch (error) {
    logger.error('Error registering device:', error);
    return res.status(500).json({ error: 'Failed to register device' });
  }
});

// Verify device token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const device = await Device.findOne({ token });

    return res.json({
      valid: !!device
    });
  } catch (error) {
    logger.error('Error verifying device token:', error);
    return res.status(500).json({ error: 'Failed to verify token' });
  }
});

// Get all devices
router.get('/', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const devices = await Device.find().populate('branchId');
    return res.json(devices);
  } catch (error) {
    logger.error('Error fetching devices:', error);
    return res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Update device
router.put('/:id', authMiddleware, managerMiddleware, async (req, res) => {
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
router.delete('/:id', authMiddleware, managerMiddleware, async (req, res) => {
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