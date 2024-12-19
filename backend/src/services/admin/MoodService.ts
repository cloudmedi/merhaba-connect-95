import { Mood } from '../../models/admin/Mood';

export class MoodService {
  async getAllMoods(searchQuery?: string) {
    try {
      let query = Mood.find();
      
      if (searchQuery) {
        query = query.where('name', new RegExp(searchQuery, 'i'));
      }
      
      return await query.sort({ name: 1 });
    } catch (error) {
      throw error;
    }
  }

  async createMood(data: { name: string; description?: string; icon?: string; createdBy: string }) {
    try {
      const mood = new Mood(data);
      await mood.save();
      return mood;
    } catch (error) {
      throw error;
    }
  }

  async updateMood(id: string, data: { name?: string; description?: string; icon?: string }) {
    try {
      const mood = await Mood.findByIdAndUpdate(id, data, { new: true });
      if (!mood) {
        throw new Error('Mood not found');
      }
      return mood;
    } catch (error) {
      throw error;
    }
  }

  async deleteMood(id: string) {
    try {
      const result = await Mood.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Mood not found');
      }
    } catch (error) {
      throw error;
    }
  }
}