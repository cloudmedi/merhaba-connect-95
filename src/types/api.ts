export interface Company {
  id: string;
  name: string;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  subscriptionEndsAt?: string;
  maxBranches: number;
  maxDevices: number;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: string;
  branchId: string;
  name: string;
  deviceType: 'player' | 'display' | 'controller';
  status: 'online' | 'offline' | 'maintenance';
  lastPingAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  companyId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string;
  duration: number;
  fileUrl: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  companyId: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  branchId: string;
  playlistId?: string;
  announcementId?: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  createdAt: string;
  updatedAt: string;
}