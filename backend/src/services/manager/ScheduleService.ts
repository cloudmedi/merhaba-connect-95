import { Schedule } from '../../models/manager/Schedule';
import { WebSocketService } from '../common/WebSocketService';
import { logger } from '../../utils/logger';

export class ScheduleService {
  private wsService: WebSocketService;

  constructor(io: any) {
    this.wsService = new WebSocketService(io);
  }

  async createSchedule(data: {
    title: string;
    description?: string;
    playlistId: string;
    startTime: Date;
    endTime: Date;
    recurrence?: object;
    notifications?: object;
    createdBy: string;
  }) {
    try {
      const schedule = new Schedule(data);
      await schedule.save();
      return schedule;
    } catch (error) {
      logger.error('Error creating schedule:', error);
      throw error;
    }
  }

  async getAllSchedules() {
    try {
      return await Schedule.find()
        .populate('playlistId')
        .sort({ startTime: 1 });
    } catch (error) {
      logger.error('Error getting schedules:', error);
      throw error;
    }
  }

  async updateSchedule(id: string, data: {
    title?: string;
    description?: string;
    playlistId?: string;
    startTime?: Date;
    endTime?: Date;
    recurrence?: object;
    notifications?: object;
  }) {
    try {
      const schedule = await Schedule.findByIdAndUpdate(id, data, { new: true })
        .populate('playlistId');
      return schedule;
    } catch (error) {
      logger.error('Error updating schedule:', error);
      throw error;
    }
  }

  async deleteSchedule(id: string) {
    try {
      await Schedule.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting schedule:', error);
      throw error;
    }
  }
}