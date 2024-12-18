import express from 'express';
import { AuthService } from '../../services/common/AuthService';
import { AuthController } from '../../controllers/auth.controller';

const router = express.Router();
const authService = new AuthService();
const authController = new AuthController();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    if (!user._id) {
      throw new Error('User ID is required');
    }
    const token = authService.generateToken(user._id.toString(), user.role);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/register', authController.register);

// Verify endpoint'ini güncelliyoruz - artık user bilgilerini de dönüyor
router.get('/verify', authController.verifyToken);

export default router;