import { supabase } from './client';

export async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    console.log('Starting device status update:', { deviceToken, status });

    // First verify the token exists and is active
    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', deviceToken)
      .single();

    if (tokenError) {
      console.error('Token verification failed:', tokenError);
      throw new Error(`Token verification failed: ${tokenError.message}`);
    }

    if (!tokenData) {
      console.error('Token not found');
      throw new Error('Token not found');
    }

    // Check if token is expired
    const expirationDate = new Date(tokenData.expires_at);
    if (expirationDate < new Date()) {
      console.error('Token has expired:', expirationDate);
      throw new Error('Token has expired');
    }

    // Update device status
    const { data: updateData, error: updateError } = await supabase
      .from('devices')
      .update({
        status,
        system_info: systemInfo || {},
        last_seen: new Date().toISOString(),
      })
      .eq('token', deviceToken)
      .select();

    if (updateError) {
      console.error('Error updating device:', updateError);
      throw updateError;
    }

    console.log('Device status successfully updated to:', status);
    return updateData;

  } catch (error) {
    console.error('Error in updateDeviceStatus:', error);
    throw error;
  }
}