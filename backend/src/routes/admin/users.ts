import express from 'express';
import { User } from '../../models/admin/User';
import { adminAuth } from '../../middleware/auth';
import * as argon2 from 'argon2';
import mongoose from 'mongoose';

const router = express.Router();

// Get all users
router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'manager',
        companyName,
        isActive: true
      });

      await user.save({ session });

      // Create license if provided
      if (license) {
        const licenseDoc = new mongoose.model('License', {
          userId: user._id,
          type: license.type,
          startDate: license.start_date,
          endDate: license.end_date,
          quantity: license.quantity,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await licenseDoc.save({ session });
      }

      // Commit transaction
      await session.commitTransaction();
      
      // Return user without password
      const userResponse = user.toObject();
      const { password: _, ...userWithoutPassword } = userResponse;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      // If error occurs, abort transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;