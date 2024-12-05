import { supabase } from './client';

export async function createDeviceToken(macAddress: string) {
  try {
    console.log('Checking for existing token:', macAddress);
    
    // Sadece aktif tokeni kontrol et
    const { data: existingToken, error: checkError } = await supabase
      .from('device_tokens')
      .select('token')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking token:', checkError);
      throw checkError;
    }
    
    // Varolan token varsa onu döndür
    if (existingToken) {
      console.log('Found existing token:', existingToken.token);
      return existingToken;
    }

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

    console.log('Created new token:', token);
    return tokenData;
  } catch (error) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}