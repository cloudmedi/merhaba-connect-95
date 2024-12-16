import { Mood } from '../../models/admin/Mood';

export class MoodService {
  async createMood(data: { name: string; description?: string; icon?: string; createdBy: string }) {
    try {
      const mood = new Mood(data);
      await mood.save();
      return mood;
    } catch (error) {
      throw error;
    }
  }

  async getAllMoods() {
    try {
      return await Mood.find().sort({ name: 1 });
    } catch (error) {
      throw error;
    }
  }

  async updateMood(id: string, data: { name?: string; description?: string; icon?: string }) {
    try {
      const mood = await Mood.findByIdAndUpdate(id, data, { new: true });
      return mood;
    } catch (error) {
      throw error;
    }
  }

  async deleteMood(id: string) {
    try {
      await Mood.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}