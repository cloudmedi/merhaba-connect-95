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
      console.error('Token validation error:', tokenError);
      throw new Error('Invalid or expired token');
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      console.error('Token expired:', tokenData.expires_at);
      throw new Error('Token has expired');
    }

    // First create device if it doesn't exist
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

    // Enable realtime subscription for this device
    const channel = supabase.channel(`device_status_${deviceToken}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `token=eq.${deviceToken}`
        },
        (payload) => {
          console.log('Realtime device status update:', payload);
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return { success: true };
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
}