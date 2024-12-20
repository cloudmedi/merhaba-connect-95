import api from '../../lib/api';

interface DeviceToken {
  token: string;
  status: 'active' | 'used' | 'expired';
  expires_at: string;
  mac_address: string;
  system_info?: Record<string, any>;
}

export async function createDeviceToken(macAddress: string): Promise<DeviceToken> {
  try {
    console.log('Checking existing tokens for MAC:', macAddress);
    
    // Node.js backend'e istek at
    const { data: deviceToken } = await api.post('/manager/devices/register', {
      macAddress,
      systemInfo: await window.electronAPI.getSystemInfo()
    });

    if (!deviceToken) {
      throw new Error('Device token could not be created');
    }

    console.log('Device token received:', deviceToken);
    return deviceToken;

  } catch (error) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}

export async function verifyDeviceToken(token: string): Promise<boolean> {
  try {
    const { data } = await api.post('/manager/devices/verify', { token });
    return data.valid;
  } catch (error) {
    console.error('Error verifying device token:', error);
    return false;
  }
}