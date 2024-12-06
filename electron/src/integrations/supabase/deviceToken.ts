import { supabase } from './client';

interface DeviceToken {
  token: string;
  status: 'active' | 'used' | 'expired';
  expires_at: string;
  mac_address: string;
  system_info?: Record<string, any>;
}

export async function createDeviceToken(macAddress: string): Promise<DeviceToken> {
  try {
    console.log('Starting device token check for MAC:', macAddress);
    
    const { data: existingToken, error: checkError } = await supabase
      .from('device_tokens')
      .select('token, status, expires_at, mac_address, system_info')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking token:', checkError);
      throw checkError;
    }
    
    if (existingToken) {
      console.log('Found existing token:', {
        token: existingToken.token,
        status: existingToken.status,
        expires_at: existingToken.expires_at,
        mac_address: existingToken.mac_address
      });

      // Validate the token data structure
      if (!existingToken.token || !existingToken.status || !existingToken.expires_at || !existingToken.mac_address) {
        throw new Error('Invalid token data structure');
      }

      return existingToken as DeviceToken;
    }

    console.log('No existing token found, creating new one...');

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
      .select('token, status, expires_at, mac_address, system_info')
      .single();

    if (tokenError) {
      console.error('Error creating token:', tokenError);
      throw tokenError;
    }

    if (!tokenData || !tokenData.token || !tokenData.status || !tokenData.expires_at || !tokenData.mac_address) {
      throw new Error('Failed to create valid token data');
    }

    console.log('Created new token:', {
      token: tokenData.token,
      status: tokenData.status,
      expires_at: tokenData.expires_at,
      mac_address: tokenData.mac_address
    });
    
    return tokenData as DeviceToken;
  } catch (error) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}