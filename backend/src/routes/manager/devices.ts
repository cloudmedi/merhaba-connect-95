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
    logger.info('Device registration attempt:', { macAddress, systemInfo });

    // MAC adresi ile mevcut cihazı kontrol et
    let device = await Device.findOne({ macAddress });
    logger.info('Existing device check result:', { exists: !!device, macAddress });

    if (device) {
      logger.info('Updating existing device:', { deviceId: device._id });
      // Cihaz varsa token'ı güncelle
      device.systemInfo = systemInfo;
      device.lastSeen = new Date();
      await device.save();
      
      logger.info('Device updated successfully:', { deviceId: device._id, token: device.token });
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
    logger.info('Creating new device:', { macAddress, token });
    
    device = new Device({
      name: `Device-${token}`,
      token,
      macAddress,
      systemInfo,
      status: 'offline',
      lastSeen: new Date()
    });

    await device.save();
    logger.info('New device created successfully:', { deviceId: device._id, token });

    return res.json({
      token: device.token,
      status: 'active',
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      mac_address: macAddress,
      system_info: systemInfo
    });
  } catch (error) {
    logger.error('Error registering device:', { error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Failed to register device' });
  }
});

// Verify device token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    logger.info('Token verification attempt:', { token });

    const device = await Device.findOne({ token });
    logger.info('Token verification result:', { token, valid: !!device });

    return res.json({
      valid: !!device
    });
  } catch (error) {
    logger.error('Error verifying device token:', { error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Failed to verify token' });
  }
});

// Get all devices
router.get('/', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    logger.info('Fetching all devices');
    const devices = await Device.find().populate('branchId');
    logger.info('Devices fetched successfully:', { count: devices.length });
    return res.json(devices);
  } catch (error) {
    logger.error('Error fetching devices:', { error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Update device
router.put('/:id', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Updating device:', { deviceId: id, updates: req.body });

    const device = await Device.findByIdAndUpdate(id, req.body, { new: true });
    if (!device) {
      logger.warn('Device not found for update:', { deviceId: id });
      return res.status(404).json({ error: 'Device not found' });
    }

    logger.info('Device updated successfully:', { deviceId: id });
    return res.json(device);
  } catch (error) {
    logger.error('Error updating device:', { deviceId: req.params.id, error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Failed to update device' });
  }
});

// Delete device
router.delete('/:id', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    logger.info('Deleting device:', { deviceId: id });

    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      logger.warn('Device not found for deletion:', { deviceId: id });
      return res.status(404).json({ error: 'Device not found' });
    }

    logger.info('Device deleted successfully:', { deviceId: id });
    return res.status(204).send();
  } catch (error) {
    logger.error('Error deleting device:', { deviceId: req.params.id, error: error.message, stack: error.stack });
    return res.status(500).json({ error: 'Failed to delete device' });
  }
});

export default router;