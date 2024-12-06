import { supabase } from './client';

export async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    console.log('Starting device status update:', { deviceToken, status, systemInfo });

    // First verify the token exists and is active or used
    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', deviceToken)
      .in('status', ['active', 'used'])
      .single();

    if (tokenError || !tokenData) {
      console.log('Token not found or invalid status:', tokenError);
      return null;
    }

    // Check if token is expired
    const expirationDate = new Date(tokenData.expires_at);
    if (expirationDate < new Date()) {
      console.log('Token has expired, skipping status update');
      return null;
    }

    // If token is active, mark it as used when device comes online
    if (tokenData.status === 'active' && status === 'online') {
      const { error: tokenUpdateError } = await supabase
        .from('device_tokens')
        .update({ 
          status: 'used',
          last_system_update: new Date().toISOString()
        })
        .eq('token', deviceToken);

      if (tokenUpdateError) {
        console.error('Error updating token status:', tokenUpdateError);
        return null;
      }
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
      return null;
    }

    console.log('Device status successfully updated to:', status);
    return updateData;

  } catch (error) {
    console.error('Error in updateDeviceStatus:', error);
    return null;
  }
}