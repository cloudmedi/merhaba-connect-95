import express from 'express';
import { Token } from '../../models/manager/Token';
import { logger } from '../../utils/logger';

const router = express.Router();

// MAC adresi ile cihaz kontrolü
router.get('/check/:macAddress', async (req, res) => {
  try {
    const { macAddress } = req.params;
    logger.info('Checking device with MAC:', macAddress);

    const tokenRecord = await Token.findOne({ macAddress });
    
    if (tokenRecord) {
      logger.info('Existing token found:', tokenRecord);
      return res.json({
        token: tokenRecord.token,
        status: tokenRecord.status
      });
    }

    logger.info('No existing token found for MAC:', macAddress);
    return res.json(null);
  } catch (error) {
    logger.error('Error checking device:', error);
    return res.status(500).json({ error: 'Failed to check device' });
  }
});

// Register device and get token
router.post('/register', async (req, res) => {
  try {
    const { macAddress, systemInfo } = req.body;
    logger.info('Device registration attempt:', { macAddress, systemInfo });

    // MAC adresi ile mevcut token'ı kontrol et
    let tokenRecord = await Token.findOne({ macAddress });
    logger.info('Existing token check result:', { exists: !!tokenRecord, macAddress });

    if (tokenRecord) {
      logger.info('Returning existing token:', { token: tokenRecord.token });
      tokenRecord.lastSeen = new Date();
      await tokenRecord.save();
      
      return res.json({
        token: tokenRecord.token,
        status: tokenRecord.status
      });
    }

    // 6 haneli benzersiz token oluştur
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    logger.info('Generated new token:', token);
    
    // Yeni token kaydı oluştur
    tokenRecord = new Token({
      token,
      macAddress,
      systemInfo,
      status: 'pending',
      lastSeen: new Date()
    });

    await tokenRecord.save();
    logger.info('New token record created:', { token, macAddress });

    return res.json({
      token: tokenRecord.token,
      status: tokenRecord.status
    });
  } catch (error) {
    logger.error('Error registering device:', error);
    return res.status(500).json({ error: 'Failed to register device' });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    logger.info('Token verification attempt:', { token });

    const tokenRecord = await Token.findOne({ token });
    logger.info('Token verification result:', { token, valid: !!tokenRecord });

    return res.json({
      valid: !!tokenRecord
    });
  } catch (error) {
    logger.error('Error verifying token:', error);
    return res.status(500).json({ error: 'Failed to verify token' });
  }
});

export default router;