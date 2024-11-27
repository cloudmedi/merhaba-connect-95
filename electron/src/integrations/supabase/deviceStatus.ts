import { supabase } from './client';

export async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    // First verify the token is valid and active
    const { data: tokenData, error: tokenError } = await supabase
      .from('device_tokens')
      .select('*')
      .eq('token', deviceToken)
      .eq('status', 'active')
      .single();

    if (tokenError || !tokenData) {
      console.error('Token verification failed:', tokenError);
      throw new Error('Invalid or expired token');
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      console.error('Token has expired');
      throw new Error('Token has expired');
    }

    // Get existing device and update status
    const { data: existingDevice, error: checkError } = await supabase
      .from('devices')
      .select('id, name, status')
      .eq('token', deviceToken)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking device:', checkError);
      throw checkError;
    }

    // Update device status with retry mechanism
    const maxRetries = 3;
    let retryCount = 0;
    let updateError = null;

    while (retryCount < maxRetries) {
      const { error } = await supabase
        .from('devices')
        .update({
          status,
          system_info: systemInfo || {},
          last_seen: new Date().toISOString(),
        })
        .eq('token', deviceToken);

      if (!error) {
        console.log('Device status updated successfully:', status);
        return;
      }

      updateError = error;
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }

    console.error('Failed to update device status after retries:', updateError);
    throw updateError;
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
}