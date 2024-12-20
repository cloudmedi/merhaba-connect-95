import express from 'express';
import { Token } from '../../models/manager/Token';
import { logger } from '../../utils/logger';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { token, macAddress } = req.body;
    
    if (!token || !macAddress) {
      return res.status(400).json({ error: 'Token ve MAC adresi gerekli' });
    }
    
    logger.info('Token registration attempt:', { token, macAddress });

    // MAC adresi kontrolü
    let existingToken = await Token.findOne({ macAddress });
    
    if (existingToken) {
      logger.info('Updating existing token for MAC address:', macAddress);
      existingToken.token = token;
      await existingToken.save();
      return res.json(existingToken);
    }

    // Yeni token oluştur
    const newToken = new Token({
      token,
      macAddress,
      isUsed: false
    });

    await newToken.save();
    logger.info('New token registered:', { token, macAddress });

    return res.json(newToken);
  } catch (error) {
    logger.error('Token registration error:', error);
    return res.status(500).json({ error: 'Token kaydedilemedi' });
  }
});

export default router;