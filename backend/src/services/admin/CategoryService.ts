import { Category } from '../../models/admin/Category';

export class CategoryService {
  async createCategory(data: { name: string; description?: string; position: number; createdBy: string }) {
    try {
      const category = new Category(data);
      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories() {
    try {
      return await Category.find().sort({ position: 1 });
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: string, data: { name?: string; description?: string; position?: number }) {
    try {
      const category = await Category.findByIdAndUpdate(id, data, { new: true });
      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      await Category.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}