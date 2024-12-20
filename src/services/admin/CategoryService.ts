import { Category } from '../../models/schemas/admin/CategorySchema';
import type { ICategory } from '../../models/schemas/admin/CategorySchema';

export class CategoryService {
  async getAllCategories(): Promise<ICategory[]> {
    try {
      return await Category.find().sort({ position: 1 });
    } catch (error) {
      throw error;
    }
  }

  async createCategory(data: { name: string; description?: string; createdBy: string }): Promise<ICategory> {
    try {
      const maxPositionCategory = await Category.findOne().sort({ position: -1 });
      const nextPosition = maxPositionCategory ? maxPositionCategory.position + 1 : 1;

      const category = new Category({
        ...data,
        position: nextPosition
      });
      
      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: string, data: { name?: string; description?: string; position?: number }): Promise<ICategory | null> {
    try {
      if (!id) {
        throw new Error('Category ID is required');
      }

      const category = await Category.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!category) {
        throw new Error('Category not found');
      }

      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    try {
      const result = await Category.findByIdAndDelete(id);
      if (!result) {
        throw new Error('Category not found');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}