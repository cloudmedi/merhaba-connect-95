import { Types } from 'mongoose';
import { WebSocketService } from '../WebSocketService';
import { Playlist } from '../../../models/common/Playlist';

export class BasePlaylistService {
  protected wsService: WebSocketService;

  constructor(io: any) {
    this.wsService = new WebSocketService(io);
  }

  protected async findPlaylistById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid playlist ID format');
    }
    return await Playlist.findById(id);
  }

  protected async validateManagerIds(managerIds: string[]) {
    return managerIds.map(id => {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid manager ID format: ${id}`);
      }
      return new Types.ObjectId(id);
    });
  }
}