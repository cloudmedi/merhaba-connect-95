import { Genre } from '../../models/admin/Genre';

export class GenreService {
  async createGenre(data: { name: string; description?: string; createdBy: string }) {
    try {
      const genre = new Genre(data);
      await genre.save();
      return genre;
    } catch (error) {
      throw error;
    }
  }

  async getAllGenres() {
    try {
      return await Genre.find().sort({ name: 1 });
    } catch (error) {
      throw error;
    }
  }

  async updateGenre(id: string, data: { name?: string; description?: string }) {
    try {
      const genre = await Genre.findByIdAndUpdate(id, data, { new: true });
      return genre;
    } catch (error) {
      throw error;
    }
  }

  async deleteGenre(id: string) {
    try {
      await Genre.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}