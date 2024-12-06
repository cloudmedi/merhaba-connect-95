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
    const { data: allTokens, error: checkError } = await supabase
      .from('device_tokens')
      .select('token, status, expires_at, mac_address, system_info')
      .eq('mac_address', macAddress)
      .order('created_at', { ascending: false });

    if (checkError) {
      console.error('Error checking tokens:', checkError);
      throw checkError;
    }

    console.log('Found tokens:', allTokens);

    // Look for an active and non-expired token
    const activeToken = allTokens?.find(token => {
      const isActive = token.status === 'active';
      const isNotExpired = new Date(token.expires_at) > new Date();
      return isActive && isNotExpired;
    });
    
    if (activeToken) {
      console.log('Found existing active token:', {
        token: activeToken.token,
        status: activeToken.status,
        expires_at: activeToken.expires_at,
        mac_address: activeToken.mac_address
      });

      // Validate the token data structure
      if (!activeToken.token || !activeToken.status || !activeToken.expires_at || !activeToken.mac_address) {
        throw new Error('Invalid token data structure');
      }

      return activeToken as DeviceToken;
    }

    console.log('No valid active token found, creating new one...');

    // Deactivate all existing tokens for this MAC address
    if (allTokens && allTokens.length > 0) {
      const { error: updateError } = await supabase
        .from('device_tokens')
        .update({ status: 'expired' })
        .eq('mac_address', macAddress);

      if (updateError) {
        console.error('Error deactivating old tokens:', updateError);
      }
    }

    // Create new token
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