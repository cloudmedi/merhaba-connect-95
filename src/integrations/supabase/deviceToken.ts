import { supabase } from './client';

export interface DeviceToken {
  id: string;
  token: string;
  status: 'active' | 'inactive' | 'used';
  created_at: string;
  used_at: string | null;
  expires_at: string;
  mac_address: string;
  system_info: Record<string, any>;
  last_system_update: string;
}

export async function createDeviceToken(macAddress: string): Promise<DeviceToken> {
  try {
    console.log('Starting device token check for MAC:', macAddress);
    
    const { data: existingToken, error: checkError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (checkError) {
      console.error('Error checking token:', checkError);
      throw checkError;
    }
    
    if (existingToken) {
      console.log('Found existing token:', existingToken);
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
      .select()
      .single();

    if (tokenError) {
      console.error('Error creating token:', tokenError);
      throw tokenError;
    }

    console.log('Created new token:', tokenData);
    return tokenData as DeviceToken;
  } catch (error) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}