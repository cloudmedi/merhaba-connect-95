import { SystemMetrics } from '../../models/admin/SystemMetrics';
import { ApiMetrics } from '../../models/admin/ApiMetrics';

export class MetricsService {
  async recordSystemMetrics(metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    uptime: number;
  }) {
    try {
      const systemMetrics = new SystemMetrics(metrics);
      await systemMetrics.save();
      return systemMetrics;
    } catch (error) {
      throw error;
    }
  }

  async recordApiMetrics(metrics: {
    endpoint: string;
    responseTime: number;
    statusCode: number;
    method: string;
  }) {
    try {
      const apiMetrics = new ApiMetrics(metrics);
      await apiMetrics.save();
      return apiMetrics;
    } catch (error) {
      throw error;
    }
  }

  async getSystemMetrics(startDate: Date, endDate: Date) {
    try {
      return await SystemMetrics.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }

  async getApiMetrics(startDate: Date, endDate: Date) {
    try {
      return await ApiMetrics.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }
}