import api from '../lib/api';

export async function createDeviceToken(macAddress: string): Promise<{ token: string; status: string }> {
  try {
    console.log('Checking device token for MAC:', macAddress);
    
    // Önce mevcut cihazı kontrol et
    const response = await api.get(`/manager/devices/check/${macAddress}`);
    
    if (response.data && response.data.token) {
      console.log('Existing device found:', response.data);
      return {
        token: response.data.token,
        status: response.data.status
      };
    }

    // Mevcut cihaz yoksa yeni kayıt oluştur
    const { data } = await api.post('/manager/devices/register', {
      macAddress,
      systemInfo: await window.electronAPI.getSystemInfo()
    });

    if (!data.token) {
      throw new Error('No token received from server');
    }

    console.log('New device registered:', data);
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