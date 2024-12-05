import { supabase } from './client';

export async function createDeviceToken(macAddress: string) {
  try {
    console.log('Checking for existing token with MAC address:', macAddress);
    
    // First check if there's an existing active token
    const { data: existingToken, error: checkError } = await supabase
      .from('device_tokens')
      .select('token, system_info')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing token:', checkError);
      throw checkError;
    }
    
    // If token exists, return it
    if (existingToken) {
      console.log('Found existing token:', existingToken.token);
      return existingToken;
    }

    // If no active token exists, create a new one
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    // Get system info
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    if (!systemInfo) {
      throw new Error('Sistem bilgisi alınamadı');
    }

    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .insert({
        token,
        mac_address: macAddress,
        status: 'active',
        expires_at: expirationDate.toISOString(),
        system_info: systemInfo,
        last_system_update: new Date().toISOString()
      })
      .select()
      .single();

    if (tokenError) {
      console.error('Error creating device token:', tokenError);
      throw new Error('Token oluşturulamadı');
    }
    
    if (!tokenData) {
      throw new Error('Token oluşturma sonrası veri dönmedi');
    }

    console.log('Created new token:', tokenData.token);
    return tokenData;
  } catch (error: any) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}