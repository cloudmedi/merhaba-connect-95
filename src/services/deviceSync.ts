import localforage from 'localforage';
import { supabase } from '@/integrations/supabase/client';
import { DeviceStatus } from '@/types/player';

export async function syncWithServer(deviceId: string, token: string) {
  try {
    // Get local data
    const localPlaylists = await localforage.getItem('playlists');
    const localAnnouncements = await localforage.getItem('announcements');
    const localSchedule = await localforage.getItem('schedule');
    
    // Get system info
    const systemInfo = await window.electronAPI.getSystemInfo();
    
    // Update device status
    const status: DeviceStatus = {
      id: deviceId,
      isOnline: true,
      lastSync: new Date(),
      version: '1.0.0',
      ...systemInfo
    };
    
    // Sync with server
    const { error } = await supabase
      .from('devices')
      .update({
        status: 'online',
        system_info: status,
        last_seen: new Date().toISOString()
      })
      .eq('token', token);
      
    if (error) throw error;
    
    // Get latest data from server
    const { data: playlists } = await supabase
      .from('playlists')
      .select('*')
      .eq('device_id', deviceId);
      
    const { data: announcements } = await supabase
      .from('announcements')
      .select('*')
      .eq('device_id', deviceId);
      
    const { data: schedule } = await supabase
      .from('schedule_events')
      .select('*')
      .eq('device_id', deviceId);
    
    // Update local storage
    await localforage.setItem('playlists', playlists);
    await localforage.setItem('announcements', announcements);
    await localforage.setItem('schedule', schedule);
    
    return { playlists, announcements, schedule };
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}

export async function startPeriodicSync(deviceId: string, token: string, interval = 300000) {
  setInterval(() => {
    syncWithServer(deviceId, token).catch(console.error);
  }, interval);
}