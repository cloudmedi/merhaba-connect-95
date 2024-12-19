export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  isHero: boolean;
  artworkUrl?: string;
  songs?: Array<{
    songId: {
      _id: string;
      title: string;
      artist?: string;
      album?: string;
      genre?: string[];
      duration?: number;
      fileUrl: string;
      bunnyId?: string;
      artworkUrl?: string;
      createdAt: string;
      updatedAt: string;
    };
    position: number;
    _id: string;
  }>;
  categories?: Array<{
    _id: string;
    name: string;
    description?: string;
    position: number;
    createdAt: string;
    updatedAt: string;
  }>;
  genre?: {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  mood?: {
    _id: string;
    name: string;
    description?: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
  };
  assignedManagers: Array<{
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }>;
  createdBy?: string;
  playCount: number;
  lastPlayed?: string;
  createdAt: string;
  updatedAt: string;
}
