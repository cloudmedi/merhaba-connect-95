import express from 'express';
import { Device } from '../../models/schemas/manager/DeviceSchema';
import { Token } from '../../models/manager/Token';
import { authMiddleware } from '../../middleware/auth.middleware';
import { managerMiddleware } from '../../middleware/manager.middleware';
import { logger } from '../../utils/logger';

const router = express.Router();

// Get all devices
router.get('/', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const devices = await Device.find().populate('branchId');
    logger.info('Devices fetched successfully');
    res.json(devices);
  } catch (error) {
    logger.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Get pending tokens
router.get('/pending-tokens', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const tokens = await Token.find({ status: 'pending' });
    logger.info('Pending tokens fetched successfully');
    res.json(tokens);
  } catch (error) {
    logger.error('Error fetching pending tokens:', error);
    res.status(500).json({ error: 'Failed to fetch pending tokens' });
  }
});

// Approve token and create device
router.post('/approve-token/:tokenId', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { name, branchId, category } = req.body;

    const tokenRecord = await Token.findById(tokenId);
    if (!tokenRecord) {
      return res.status(404).json({ error: 'Token not found' });
    }

    const device = new Device({
      name,
      token: tokenRecord.token,
      branchId,
      category,
      status: 'offline',
      systemInfo: tokenRecord.systemInfo,
      createdBy: req.user.id
    });

    await device.save();
    tokenRecord.status = 'approved';
    await tokenRecord.save();

    logger.info('Device created and token approved successfully');
    res.json(device);
  } catch (error) {
    logger.error('Error approving token and creating device:', error);
    res.status(500).json({ error: 'Failed to approve token and create device' });
  }
});

export default router;