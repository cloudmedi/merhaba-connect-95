import { Announcement } from '../../models/manager/Announcement';
import { WebSocketService } from '../common/WebSocketService';
import { logger } from '../../utils/logger';

export class AnnouncementService {
  private wsService: WebSocketService;

  constructor(io: any) {
    this.wsService = new WebSocketService(io);
  }

  async createAnnouncement(data: {
    title: string;
    message: string;
    startDate: Date;
    endDate: Date;
    status: string;
    branchIds: string[];
    createdBy: string;
    files?: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      duration?: number;
    }>;
  }) {
    try {
      const announcement = new Announcement(data);
      await announcement.save();
      
      this.wsService.emitNotification(data.createdBy, {
        type: 'announcement-created',
        data: announcement
      });
      
      return announcement;
    } catch (error) {
      logger.error('Error creating announcement:', error);
      throw error;
    }
  }

  async getAllAnnouncements() {
    try {
      return await Announcement.find()
        .populate('branchIds')
        .populate('createdBy')
        .sort({ createdAt: -1 });
    } catch (error) {
      logger.error('Error getting announcements:', error);
      throw error;
    }
  }

  async updateAnnouncement(id: string, data: {
    title?: string;
    message?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    branchIds?: string[];
    files?: Array<{
      fileName: string;
      fileUrl: string;
      fileType: string;
      duration?: number;
    }>;
  }) {
    try {
      const announcement = await Announcement.findByIdAndUpdate(id, data, { new: true })
        .populate('branchIds')
        .populate('createdBy');
      
      if (announcement) {
        this.wsService.emitNotification(announcement.createdBy.toString(), {
          type: 'announcement-updated',
          data: announcement
        });
      }
      
      return announcement;
    } catch (error) {
      logger.error('Error updating announcement:', error);
      throw error;
    }
  }

  async deleteAnnouncement(id: string) {
    try {
      await Announcement.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting announcement:', error);
      throw error;
    }
  }
}