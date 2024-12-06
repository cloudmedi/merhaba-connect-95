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
    
    // First check for ANY existing tokens for this MAC address
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

    // If there are any existing tokens for this MAC address, return the most recent one
    if (existingTokens && existingTokens.length > 0) {
      const mostRecentToken = existingTokens[0];
      console.log('Using existing token:', {
        token: mostRecentToken.token,
        status: mostRecentToken.status,
        expires_at: mostRecentToken.expires_at,
        mac_address: mostRecentToken.mac_address
      });

      // Validate the token data structure
      if (!mostRecentToken.token || !mostRecentToken.status || !mostRecentToken.expires_at || !mostRecentToken.mac_address) {
        throw new Error('Invalid token data structure');
      }

      return mostRecentToken as DeviceToken;
    }

    console.log('No tokens found for this MAC address, creating new one...');

    // Create new token only if no tokens exist for this MAC address
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .insert({
        token,
        mac_address: macAddress,
        status: 'active', // Explicitly set status as active
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