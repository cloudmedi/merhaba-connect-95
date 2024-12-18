import axiosInstance from '@/lib/axios';
import { toast } from "sonner";

export const categoryService = {
  async getCategories() {
    try {
      const { data } = await axiosInstance.get('/admin/categories');
      return data;
    } catch (error) {
      toast.error("Failed to fetch categories");
      throw error;
    }
  },

  async createCategory(category: { name: string; description: string }) {
    try {
      const { data } = await axiosInstance.post('/admin/categories', category);
      return data;
    } catch (error) {
      toast.error("Failed to create category");
      throw error;
    }
  },

  async updateCategory(categoryData: { id?: string; _id?: string; name?: string; description?: string }) {
    try {
      // Use either id or _id, whichever is available
      const categoryId = categoryData.id || categoryData._id;
      
      if (!categoryId) {
        throw new Error('Category ID is missing');
      }

      const { data } = await axiosInstance.put(`/admin/categories/${categoryId}`, {
        name: categoryData.name,
        description: categoryData.description
      });
      
      return data;
    } catch (error) {
      toast.error("Failed to update category");
      throw error;
    }
  },

  async updatePositions(updates: { id?: string; _id?: string; position: number }[]) {
    try {
      const formattedUpdates = updates.map(update => ({
        id: update.id || update._id,
        position: update.position
      }));

      const { data } = await axiosInstance.put('/admin/categories/positions', formattedUpdates);
      return data;
    } catch (error) {
      console.error('Error updating positions:', error);
      toast.error("Failed to update category positions");
      throw error;
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      await axiosInstance.delete(`/admin/categories/${categoryId}`);
    } catch (error) {
      toast.error("Failed to delete category");
      throw error;
    }
  }
};