import { supabase } from './client';

export async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    console.log('Starting device status update:', { deviceToken, status });

    // First verify the token exists and is active
    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', deviceToken)
      .eq('status', 'active')
      .single();

    if (tokenError) {
      console.error('Token verification failed:', tokenError);
      return null;
    }

    if (!tokenData) {
      console.error('Token not found or not active');
      return null;
    }

    // Check if token is expired
    const expirationDate = new Date(tokenData.expires_at);
    if (expirationDate < new Date()) {
      console.error('Token has expired:', expirationDate);
      return null;
    }

    // First check if device exists
    const { data: existingDevice } = await supabase
      .from('devices')
      .select('*')
      .eq('token', deviceToken)
      .single();

    if (!existingDevice) {
      console.log('Device not found for token:', deviceToken);
      return null;
    }

    // Update device status only if device exists
    const { data: updateData, error: updateError } = await supabase
      .from('devices')
      .update({
        status,
        system_info: systemInfo || existingDevice.system_info,
        last_seen: new Date().toISOString(),
      })
      .eq('token', deviceToken)
      .select();

    if (updateError) {
      console.error('Error updating device:', updateError);
      return null;
    }

    console.log('Device status successfully updated to:', status);
    return updateData;

  } catch (error) {
    console.error('Error in updateDeviceStatus:', error);
    return null;
  }
}