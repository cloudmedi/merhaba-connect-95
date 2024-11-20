import { supabase } from './supabase';
import { Company, Branch, Device, Playlist, Song, Announcement, Schedule } from '@/types/api';

// Company Services
export const companyService = {
  async getCompany(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCompany(id: string, updates: Partial<Company>) {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Branch Services
export const branchService = {
  async getBranches(companyId: string) {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async createBranch(branch: Omit<Branch, 'id'>) {
    const { data, error } = await supabase
      .from('branches')
      .insert(branch)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateBranch(id: string, updates: Partial<Branch>) {
    const { data, error } = await supabase
      .from('branches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteBranch(id: string) {
    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Device Services
export const deviceService = {
  async getDevices(branchId: string) {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('branch_id', branchId);
    
    if (error) throw error;
    return data;
  },

  async createDevice(device: Omit<Device, 'id'>) {
    const { data, error } = await supabase
      .from('devices')
      .insert(device)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDevice(id: string, updates: Partial<Device>) {
    const { data, error } = await supabase
      .from('devices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDevice(id: string) {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Playlist Services
export const playlistService = {
  async getPlaylists(companyId: string) {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        songs:playlist_songs(
          song_id,
          songs(*)
        )
      `)
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async createPlaylist(playlist: Omit<Playlist, 'id'>) {
    const { data, error } = await supabase
      .from('playlists')
      .insert(playlist)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async addSongToPlaylist(playlistId: string, songId: string) {
    const { error } = await supabase
      .from('playlist_songs')
      .insert({ playlist_id: playlistId, song_id: songId });
    
    if (error) throw error;
  },

  async removeSongFromPlaylist(playlistId: string, songId: string) {
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .match({ playlist_id: playlistId, song_id: songId });
    
    if (error) throw error;
  }
};

// Announcement Services
export const announcementService = {
  async getAnnouncements(companyId: string) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('company_id', companyId);
    
    if (error) throw error;
    return data;
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id'>) {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateAnnouncement(id: string, updates: Partial<Announcement>) {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAnnouncement(id: string) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Schedule Services
export const scheduleService = {
  async getSchedules(branchId: string) {
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        playlists(*),
        announcements(*)
      `)
      .eq('branch_id', branchId);
    
    if (error) throw error;
    return data;
  },

  async createSchedule(schedule: Omit<Schedule, 'id'>) {
    const { data, error } = await supabase
      .from('schedules')
      .insert(schedule)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSchedule(id: string, updates: Partial<Schedule>) {
    const { data, error } = await supabase
      .from('schedules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSchedule(id: string) {
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
