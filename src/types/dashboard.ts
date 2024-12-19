export interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'table' | 'activity';
  title: string;
  position: number;
  size: 'small' | 'medium' | 'large';
  settings?: Record<string, any>;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  lastModified: Date;
}

export interface SystemMetric {
  activeUsers: number;
  totalSongs: number;
  activePlaylists: number;
  systemHealth: number;
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  responseTime: number;
  errorRate: number;
}

export interface ApiMetric {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: string;
}