import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role
    });

    await user.save();

    const token = authService.generateToken(user.id, user.role);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);
    const token = authService.generateToken(user.id, user.role);
    
    user.lastLogin = new Date();
    await user.save();

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

export default router;