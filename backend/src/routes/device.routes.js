import express from 'express';
import {
  registerDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  updateDeviceStatus
} from '../controllers/device.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getDevices)
  .post(registerDevice);

router.route('/:id')
  .get(getDeviceById)
  .put(updateDevice)
  .delete(deleteDevice);

router.put('/:id/status', updateDeviceStatus);

export default router;