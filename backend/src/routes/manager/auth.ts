import express from 'express';
import { AuthService } from '../../services/common/AuthService';
import { validateLoginInput } from '../../middleware/validation';

const router = express.Router();
const authService = new AuthService();

router.post('/login', validateLoginInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    const token = authService.generateToken(user.id, user.role);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});

export default router;