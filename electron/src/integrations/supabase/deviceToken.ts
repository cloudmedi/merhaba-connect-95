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
    console.log('Checking existing tokens for MAC:', macAddress);
    
    const { data: existingTokens, error: checkError } = await supabase
      .from('device_tokens')
      .select('token, status, expires_at, mac_address, system_info')
      .eq('mac_address', macAddress)
      .order('created_at', { ascending: false });

    if (checkError) {
      console.error('Error checking tokens:', checkError);
      throw checkError;
    }

    console.log('Found tokens:', existingTokens);

    if (existingTokens && existingTokens.length > 0) {
      const mostRecentToken = existingTokens[0];
      console.log('Using existing token:', mostRecentToken);

      if (!mostRecentToken.token || !mostRecentToken.status || !mostRecentToken.expires_at || !mostRecentToken.mac_address) {
        throw new Error('Invalid token data structure');
      }

      const expirationDate = new Date(mostRecentToken.expires_at);
      if (mostRecentToken.status === 'expired' || expirationDate < new Date()) {
        console.log('Token expired, creating new one');
        return await createNewToken(macAddress);
      }

      return mostRecentToken;
    }

    return await createNewToken(macAddress);
  } catch (error) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}

async function createNewToken(macAddress: string): Promise<DeviceToken> {
  console.log('Creating new token for MAC:', macAddress);
  
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

  console.log('Created new token:', tokenData);
  
  return tokenData as DeviceToken;
}