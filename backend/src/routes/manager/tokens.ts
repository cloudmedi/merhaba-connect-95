import express from 'express';
import { Token } from '../../models/manager/Token';
import { logger } from '../../utils/logger';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { token, macAddress } = req.body;
    
    logger.info('Token registration request received:', { token, macAddress });
    
    if (!token || !macAddress) {
      logger.error('Missing required fields:', { token: !!token, macAddress: !!macAddress });
      return res.status(400).json({ error: 'Token ve MAC adresi gerekli' });
    }

    // MAC adresi kontrolü
    let existingToken = await Token.findOne({ macAddress });
    logger.info('Existing token check:', { exists: !!existingToken, macAddress });
    
    if (existingToken) {
      logger.info('Updating existing token:', { oldToken: existingToken.token, newToken: token });
      existingToken.token = token;
      await existingToken.save();
      logger.info('Token updated successfully:', existingToken);
      return res.json(existingToken);
    }

    // Yeni token oluştur
    const newToken = new Token({
      token,
      macAddress,
      isUsed: false
    });

    logger.info('Creating new token:', { token, macAddress });
    await newToken.save();
    logger.info('New token created successfully:', newToken);

    return res.json(newToken);
  } catch (error) {
    logger.error('Token registration error:', error);
    return res.status(500).json({ error: 'Token kaydedilemedi' });
  }
});

export default router;