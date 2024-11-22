export interface PlaylistItem {
  id: string;
  title: string;
  artist?: string;
  file_url: string;
  duration?: number;
}

export interface Announcement {
  id: string;
  title: string;
  file_url: string;
  schedule?: {
    time: string;
    repeat: 'once' | 'daily' | 'weekly';
    interval?: number;
  };
}

export interface DeviceStatus {
  id: string;
  isOnline: boolean;
  currentPlaylist?: string;
  currentTrack?: string;
  lastSync: Date;
  version: string;
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
}