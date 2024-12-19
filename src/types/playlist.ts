import { Types } from 'mongoose';

export interface Song {
  _id: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  fileUrl?: string;
  artworkUrl?: string;
  bunnyId?: string;
  genre?: string[];
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  artworkUrl?: string;
  isPublic: boolean;
  isHero: boolean;
  createdBy: string;
  songs: Song[];
  genre?: any;
  mood?: any;
  assignedManagers: Array<{
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }>;
  playCount: number;
  lastPlayed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistCreateInput {
  name: string;
  description?: string;
  artworkUrl?: string;
  isPublic?: boolean;
  isHero?: boolean;
  genre?: string;
  mood?: string;
  songs?: string[];
  assignedManagers?: Array<{
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }>;
}

export interface PlaylistUpdateInput extends Partial<PlaylistCreateInput> {}