import express from 'express';
import { MetricsService } from '../../services/common/MetricsService';
import { adminAuth } from '../../middleware/auth';

const router = express.Router();
const metricsService = new MetricsService();

router.use(adminAuth);

router.get('/system-metrics', async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const metrics = await metricsService.getSystemMetrics(startDate, endDate);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching system metrics' });
  }
});

router.get('/api-metrics', async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);
    const metrics = await metricsService.getApiMetrics(startDate, endDate);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching API metrics' });
  }
});

export default router;