import express from 'express';
import { DeviceService } from '../../services/manager/DeviceService';
import { validateDeviceInput } from '../../middleware/validation';

const router = express.Router();
const deviceService = new DeviceService();

router.get('/', async (req, res, next) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.json(devices);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateDeviceInput, async (req, res, next) => {
  try {
    const device = await deviceService.createDevice(req.body);
    res.status(201).json(device);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateDeviceInput, async (req, res, next) => {
  try {
    const device = await deviceService.updateDevice(req.params.id, req.body);
    res.json(device);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deviceService.deleteDevice(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;