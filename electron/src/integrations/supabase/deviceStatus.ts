import { supabase } from './client';
import { validateDeviceToken } from './deviceToken';

export async function updateDeviceStatus(deviceToken: string, status: 'online' | 'offline', systemInfo: any) {
  try {
    // Get MAC address for token validation
    const macAddress = await (window as any).electronAPI.getMacAddress();
    if (!macAddress) {
      throw new Error('Could not get MAC address');
    }

    // Validate token before updating status
    const isValid = await validateDeviceToken(deviceToken, macAddress);
    if (!isValid) {
      throw new Error('Invalid or expired token');
    }

    // First create/update device if it doesn't exist
    const { data: device, error: createError } = await supabase
      .from('devices')
      .upsert({
        token: deviceToken,
        name: `Device ${deviceToken}`,
        category: 'player',
        status: status,
        system_info: systemInfo || {},
        last_seen: new Date().toISOString(),
      }, {
        onConflict: 'token'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating/updating device:', createError);
      throw createError;
    }

    // Update device status with retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      const { error: updateError } = await supabase
        .from('devices')
        .update({
          status,
          system_info: systemInfo || {},
          last_seen: new Date().toISOString(),
        })
        .eq('token', deviceToken);

      if (!updateError) {
        console.log('Device status updated successfully:', status);
        break;
      }

      console.error(`Update attempt ${retryCount + 1} failed:`, updateError);
      retryCount++;
      
      if (retryCount === maxRetries) {
        throw new Error('Failed to update device status after multiple attempts');
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
}