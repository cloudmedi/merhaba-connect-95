export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline';
  branches?: {
    name: string;
  };
}

export interface Group {
  id: string;
  name: string;
  devices: Device[];
}