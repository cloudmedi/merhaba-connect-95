import { supabase } from './client';

export async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    console.log('Updating device status:', { deviceToken, status, systemInfo });

    // First verify the token is valid and active
    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', deviceToken)
      .eq('status', 'active')
      .single();

    console.log('Token verification result:', { tokenData, tokenError });

    if (tokenError || !tokenData) {
      throw new Error('Invalid or expired token');
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Token has expired');
    }

    const { data: existingDevice, error: checkError } = await supabase
      .from('devices')
      .select('id, name, status')
      .eq('token', deviceToken)
      .maybeSingle();

    console.log('Device check result:', { existingDevice, checkError });

    if (checkError) throw checkError;

    // Only update status if device exists
    if (existingDevice) {
      console.log('Attempting to update device status to:', status);
      
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

      if (updateError) throw updateError;
      
      console.log('Device status successfully updated to:', status);
    } else {
      console.log('No device found with token:', deviceToken);
    }
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
}