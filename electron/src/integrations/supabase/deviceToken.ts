import { supabase } from './client';

interface TokenData {
  token: string;
  mac_address: string;
  expires_at: string;
  status: 'active' | 'used' | 'expired';
}

export async function createDeviceToken(macAddress: string): Promise<TokenData> {
  try {
    // First check if there's an existing valid token
    const { data: existingToken, error: checkError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (checkError) throw checkError;
    
    // If valid token exists, return it
    if (existingToken) {
      return existingToken as TokenData;
    }

    // If existing token is expired or doesn't exist, create a new one
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .insert({
        token,
        mac_address: macAddress,
        status: 'active',
        expires_at: expirationDate.toISOString()
      })
      .select()
      .single();

    if (tokenError) throw tokenError;
    if (!tokenData) throw new Error('Failed to create device token');

    return tokenData as TokenData;
  } catch (error) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}

export async function validateDeviceToken(token: string, macAddress: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', token)
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('Error validating device token:', error);
    return false;
  }
}

export async function markTokenAsUsed(token: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('device_tokens')
      .update({ status: 'used', used_at: new Date().toISOString() })
      .eq('token', token);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking token as used:', error);
    throw error;
  }
}