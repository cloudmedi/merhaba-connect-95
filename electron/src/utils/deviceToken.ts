import api from '../lib/api';

export async function createDeviceToken(macAddress: string): Promise<{ token: string; status: string }> {
  try {
    console.log('Checking device token for MAC:', macAddress);
    
    const { data } = await api.post('/manager/devices/register', {
      macAddress,
      systemInfo: await window.electronAPI.getSystemInfo()
    });

    if (!data.token) {
      throw new Error('No token received from server');
    }

    console.log('Device token received:', data);
    return {
      token: data.token,
      status: data.status
    };
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