import express from 'express';
import { AuthService } from '../../services/common/AuthService';
import { adminAuth } from '../../middleware/auth';

const router = express.Router();
const authService = new AuthService();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    const token = authService.generateToken(user.id, user.role);
    res.json({ token, user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.get('/verify', adminAuth, (req, res) => {
  res.json({ message: 'Token is valid' });
});

export default router;