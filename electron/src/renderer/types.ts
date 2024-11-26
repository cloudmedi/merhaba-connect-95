export interface SystemInfo {
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
  };
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
  };
  disk: Array<{
    fs: string;
    size: number;
    used: number;
    available: number;
  }>;
  network: Array<{
    iface: string;
    ip4: string;
    mac: string;
  }>;
}

declare global {
  interface Window {
    electronAPI: {
      getSystemInfo: () => Promise<SystemInfo>;
      getDeviceId: () => Promise<string>;
      getMacAddress: () => Promise<string | null>;
      onSystemInfoUpdate: (callback: (data: SystemInfo) => void) => void;
      getEnvVars: () => Promise<Record<string, string>>;
    };
  }
}