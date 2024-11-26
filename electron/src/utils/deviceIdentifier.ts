import * as si from 'systeminformation';
import { networkInterfaces } from 'os';
import { platform } from 'os';

async function getMacAddress(): Promise<string | null> {
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (!net.internal) {
        return net.mac;
      }
    }
  }
  return null;
}

async function getSystemFingerprint(): Promise<string> {
  const cpu = await si.cpu();
  const system = await si.system();
  const os = await si.osInfo();
  
  const fingerprintData = {
    cpu: cpu.brand,
    manufacturer: system.manufacturer,
    model: system.model,
    serial: system.serial,
    os: os.distro,
    platform: os.platform,
    hostname: os.hostname
  };
  
  // Create a stable string from the fingerprint data
  const fingerprintString = Object.values(fingerprintData)
    .filter(Boolean)
    .join('_');
  
  // Create a simple hash of the string
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export async function getDeviceIdentifier(): Promise<string> {
  const platformType = platform();
  let identifier: string;
  
  try {
    // First try to get MAC address
    const macAddress = await getMacAddress();
    if (macAddress) {
      identifier = macAddress.replace(/:/g, '');
    } else {
      // Fallback to system fingerprint
      identifier = await getSystemFingerprint();
    }
    
    // Add platform prefix
    const prefix = platformType === 'win32' ? 'win' : 
                  platformType === 'darwin' ? 'mac' : 
                  platformType === 'linux' ? 'linux' : 'desktop';
    
    return `${prefix}_${identifier}`;
  } catch (error) {
    console.error('Error getting device identifier:', error);
    // Last resort: generate a random identifier
    const random = Math.random().toString(36).substring(2, 15);
    return `${platformType}_${random}`;
  }
}