import { Types } from 'mongoose';

export interface IPlaylist {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  isPublic: boolean;
  isHero: boolean;
  createdBy: Types.ObjectId;
  songs: Array<{
    songId: Types.ObjectId;
    position: number;
  }>;
  categories: Types.ObjectId[];
  genre?: Types.ObjectId;
  mood?: Types.ObjectId;
  artworkUrl?: string;
  assignedManagers: Types.ObjectId[];
  lastPlayed?: Date;
  playCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPlaylistAssignment {
  _id?: Types.ObjectId;
  playlistId: Types.ObjectId;
  userId: Types.ObjectId;
  status: 'pending' | 'active' | 'expired';
  scheduledAt: Date;
  expiresAt?: Date;
  lastPlayed?: Date;
  playCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPlaylistDocument extends IPlaylist, Document {
  _id: Types.ObjectId;
}

export interface IPlaylistAssignmentDocument extends IPlaylistAssignment, Document {
  _id: Types.ObjectId;
}

export type PlaylistCreateInput = Omit<IPlaylist, '_id' | 'createdAt' | 'updatedAt'>;
export type PlaylistUpdateInput = Partial<Omit<IPlaylist, '_id' | 'createdAt' | 'updatedAt'>>;