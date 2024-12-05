import { supabase } from './client';

export async function createDeviceToken(macAddress: string) {
  try {
    console.log('Starting device token check for MAC:', macAddress);
    
    // Sadece aktif tokeni kontrol et
    const { data: existingToken, error: checkError } = await supabase
      .from('device_tokens')
      .select('*')  // Tüm alanları seç
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking token:', checkError);
      throw checkError;
    }
    
    // Log token details
    if (existingToken) {
      console.log('Found existing token:', {
        token: existingToken.token,
        status: existingToken.status,
        expires_at: existingToken.expires_at,
        mac_address: existingToken.mac_address
      });
      return existingToken;
    }

    console.log('No existing token found, creating new one...');

    // Yeni token oluştur
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .insert({
        token,
        mac_address: macAddress,
        status: 'active',
        expires_at: expirationDate.toISOString(),
      })
      .select()
      .single();

    if (tokenError) {
      console.error('Error creating token:', tokenError);
      throw tokenError;
    }

    console.log('Created new token:', {
      token: tokenData.token,
      status: tokenData.status,
      expires_at: tokenData.expires_at,
      mac_address: tokenData.mac_address
    });
    
    return tokenData;
  } catch (error) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}