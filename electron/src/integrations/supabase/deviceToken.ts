import { createClient } from '@supabase/supabase-js';
import { supabase } from './client';

export async function createDeviceToken(macAddress: string) {
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  // First check if there's an existing active token
  const { data: existingToken, error: checkError } = await supabase
    .from('device_tokens')
    .select('token')
    .eq('mac_address', macAddress)
    .eq('status', 'active')
    .maybeSingle();

  if (checkError) throw checkError;
  
  // If token exists, return it
  if (existingToken) {
    return existingToken;
  }

  // If no active token exists, create a new one
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

  return tokenData;
}