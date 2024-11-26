import * as si from 'systeminformation';
import { networkInterfaces } from 'os';
import { platform } from 'os';
import { v5 as uuidv5 } from 'uuid';

// UUID namespace for our application (generated once using v4)
const NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

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
    
  return fingerprintString;
}

export async function getDeviceIdentifier(): Promise<string> {
  try {
    // First try to get MAC address
    const macAddress = await getMacAddress();
    let identifier: string;
    
    if (macAddress) {
      identifier = macAddress.replace(/:/g, '');
    } else {
      // Fallback to system fingerprint
      identifier = await getSystemFingerprint();
    }
    
    // Add platform prefix to make the identifier more unique
    const platformType = platform();
    const prefix = platformType === 'win32' ? 'win' : 
                  platformType === 'darwin' ? 'mac' : 
                  platformType === 'linux' ? 'linux' : 'desktop';
    
    // Generate a UUID v5 using the identifier
    const deviceId = uuidv5(`${prefix}_${identifier}`, NAMESPACE);
    return deviceId;
  } catch (error) {
    console.error('Error getting device identifier:', error);
    // Last resort: generate a UUID v5 from random data
    const random = Math.random().toString(36).substring(2, 15);
    return uuidv5(random, NAMESPACE);
  }
}