import express from 'express';
import { User } from '../../models/admin/User';
import { License } from '../../models/admin/License';
import { adminAuth } from '../../middleware/auth';
import * as argon2 from 'argon2';

const router = express.Router();

// Get all users with their licenses
router.get('/', adminAuth, async (_req, res) => {
  try {
    const users = await User.find().select('-password');
    
    const usersWithLicenses = await Promise.all(users.map(async (user) => {
      const license = await License.findOne({ 
        userId: user._id,
        isActive: true 
      }).sort({ endDate: -1 });
      
      return {
        ...user.toObject(),
        license: license ? {
          id: license._id,
          type: license.type,
          startDate: license.startDate,
          endDate: license.endDate
        } : null
      };
    }));

    return res.json(usersWithLicenses);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Create user with license
router.post('/', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, companyName, license } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await argon2.hash(password);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'manager',
      companyName,
      isActive: true
    });

    await user.save();

    if (license) {
      const licenseDoc = new License({
        userId: user._id,
        type: license.type,
        startDate: license.start_date,
        endDate: license.end_date,
        quantity: license.quantity,
        isActive: true
      });

      await licenseDoc.save();
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { firstName, lastName, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, role, isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;