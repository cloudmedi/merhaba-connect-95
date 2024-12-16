import express from 'express';
import { ScheduleService } from '../../services/manager/ScheduleService';
import { validateScheduleInput } from '../../middleware/validation';

const router = express.Router();
const scheduleService = new ScheduleService();

router.get('/', async (req, res, next) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

router.post('/', validateScheduleInput, async (req, res, next) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateScheduleInput, async (req, res, next) => {
  try {
    const schedule = await scheduleService.updateSchedule(req.params.id, req.body);
    res.json(schedule);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await scheduleService.deleteSchedule(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;