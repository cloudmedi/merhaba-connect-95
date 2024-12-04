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

    console.log('Token verification result:', { tokenData, tokenError });

    if (tokenError) {
      console.error('Token verification failed:', tokenError);
      throw new Error(`Token verification failed: ${tokenError.message}`);
    }

    if (!tokenData) {
      console.error('Token not found');
      throw new Error('Token not found');
    }

    if (tokenData.status !== 'active') {
      console.error('Token is not active:', tokenData.status);
      throw new Error(`Token is not active: ${tokenData.status}`);
    }

    // Check if token is expired
    const expirationDate = new Date(tokenData.expires_at);
    if (expirationDate < new Date()) {
      console.error('Token has expired:', expirationDate);
      throw new Error('Token has expired');
    }

    // Check for existing device
    const { data: existingDevice, error: checkError } = await supabase
      .from('devices')
      .select('id, name, status')
      .eq('token', deviceToken)
      .maybeSingle();

    console.log('Device check result:', { existingDevice, checkError });

    if (checkError) {
      console.error('Error checking device:', checkError);
      throw checkError;
    }

    // Only update status if device exists
    if (existingDevice) {
      console.log('Updating device status to:', status);
      
      const { data: updateData, error: updateError } = await supabase
        .from('devices')
        .update({
          status,
          system_info: systemInfo || {},
          last_seen: new Date().toISOString(),
        })
        .eq('token', deviceToken)
        .select();

      console.log('Update result:', { updateData, updateError });

      if (updateError) {
        console.error('Error updating device:', updateError);
        throw updateError;
      }
      
      console.log('Device status successfully updated to:', status);
    } else {
      console.log('No device found with token:', deviceToken);
    }
  } catch (error) {
    console.error('Error in updateDeviceStatus:', error);
    throw error;
  }
}