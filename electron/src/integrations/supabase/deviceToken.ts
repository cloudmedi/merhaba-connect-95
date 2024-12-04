import { createClient } from '@supabase/supabase-js';
import { supabase } from './client';

export async function createDeviceToken(macAddress: string) {
  try {
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    // Get system info
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    if (!systemInfo) {
      throw new Error('Could not get system information');
    }

    // First check if there's an existing active token
    const { data: existingToken, error: checkError } = await supabase
      .from('device_tokens')
      .select('token, system_info')
      .eq('mac_address', macAddress)
      .eq('status', 'active')
      .maybeSingle();

    if (checkError) throw checkError;
    
    // If token exists, return it
    if (existingToken) {
      // Update system info for existing token
      const { error: updateError } = await supabase
        .from('device_tokens')
        .update({
          system_info: systemInfo,
          last_system_update: new Date().toISOString()
        })
        .eq('token', existingToken.token);

      if (updateError) throw updateError;
      return existingToken;
    }

    // If no active token exists, create a new one
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
      throw new Error('Failed to create device token');
    }
    
    if (!tokenData) {
      throw new Error('No token data returned after creation');
    }

    return tokenData;
  } catch (error: any) {
    console.error('Error in createDeviceToken:', error);
    throw error;
  }
}

export async function updateDeviceSystemInfo(token: string) {
  try {
    const systemInfo = await (window as any).electronAPI.getSystemInfo();
    if (!systemInfo) {
      throw new Error('Could not get system information');
    }
    
    const { error } = await supabase
      .from('device_tokens')
      .update({
        system_info: systemInfo,
        last_system_update: new Date().toISOString()
      })
      .eq('token', token);

    if (error) {
      console.error('Error updating system info:', error);
      throw error;
    }
  } catch (error: any) {
    console.error('Error in updateDeviceSystemInfo:', error);
    throw error;
  }
}