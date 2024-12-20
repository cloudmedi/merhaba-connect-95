import api from '../lib/api';

export async function createDeviceToken(macAddress: string): Promise<{ token: string; status: string }> {
  try {
    console.log('Creating device token for MAC:', macAddress);
    
    // 6 haneli random token oluştur
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated token:', token);

    // Token'ı MongoDB'ye kaydet
    const { data } = await api.post('/manager/tokens/register', {
      token,
      macAddress
    });

    console.log('Token saved to MongoDB:', data);

    if (!data.token) {
      throw new Error('No token received from server');
    }

    return {
      token: data.token,
      status: 'active'
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