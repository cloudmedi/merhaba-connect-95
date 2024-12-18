import axiosInstance from '@/lib/axios';
import { toast } from "sonner";
import { Mood } from '@/pages/SuperAdmin/Moods/types';

export const moodService = {
  async getMoods() {
    try {
      const { data } = await axiosInstance.get('/admin/moods');
      return data;
    } catch (error) {
      console.error('Error in getMoods:', error);
      toast.error("Failed to fetch moods");
      throw error;
    }
  },

  async createMood(mood: { name: string; description: string; icon: string }) {
    try {
      const { data } = await axiosInstance.post('/admin/moods', mood);
      return data;
    } catch (error) {
      console.error('Error in createMood:', error);
      toast.error("Failed to create mood");
      throw error;
    }
  },

  async updateMood(id: string, updates: { name?: string; description?: string; icon?: string }) {
    try {
      if (!id) {
        throw new Error('Mood ID is missing');
      }

      const { data } = await axiosInstance.put(`/admin/moods/${id}`, updates);
      return data;
    } catch (error) {
      console.error('Error in updateMood:', error);
      toast.error("Failed to update mood");
      throw error;
    }
  },

  async deleteMood(id: string) {
    try {
      if (!id) {
        throw new Error('Mood ID is missing');
      }
      console.log('Deleting mood with ID:', id);
      await axiosInstance.delete(`/admin/moods/${id}`);
    } catch (error) {
      console.error('Error in deleteMood:', error);
      toast.error("Failed to delete mood");
      throw error;
    }
  }
};