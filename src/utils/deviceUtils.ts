/**
 * Generates a unique 6-digit device token
 */
export function generateDeviceToken(): string {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

/**
 * Formats device status for display
 */
export function formatDeviceStatus(status: string): { label: string; color: string } {
  switch (status.toLowerCase()) {
    case 'online':
      return { label: 'Online', color: 'text-green-600' };
    case 'offline':
      return { label: 'Offline', color: 'text-gray-600' };
    case 'maintenance':
      return { label: 'Maintenance', color: 'text-yellow-600' };
    default:
      return { label: 'Unknown', color: 'text-gray-600' };
  }
}

/**
 * Formats system information for display
 */
export function formatSystemInfo(info: Record<string, any>): { label: string; value: string }[] {
  const result = [];
  
  if (info.version) {
    result.push({ label: 'Version', value: info.version });
  }
  if (info.os) {
    result.push({ label: 'Operating System', value: info.os });
  }
  if (info.memory) {
    result.push({ label: 'Memory Usage', value: `${info.memory}%` });
  }
  if (info.storage) {
    result.push({ label: 'Storage Usage', value: `${info.storage}%` });
  }
  if (info.lastUpdate) {
    result.push({ label: 'Last Update', value: new Date(info.lastUpdate).toLocaleString() });
  }
  
  return result;
}