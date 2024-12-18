import axiosInstance from '@/lib/axios';
import { toast } from "sonner";

export const categoryService = {
  async getCategories() {
    try {
      const { data } = await axiosInstance.get('/admin/categories');
      return data;
    } catch (error) {
      console.error('Error in getCategories:', error);
      toast.error("Failed to fetch categories");
      throw error;
    }
  },

  async createCategory(category: { name: string; description: string }) {
    try {
      const { data } = await axiosInstance.post('/admin/categories', category);
      return data;
    } catch (error) {
      console.error('Error in createCategory:', error);
      toast.error("Failed to create category");
      throw error;
    }
  },

  async updateCategory(categoryData: { id?: string; _id?: string; name?: string; description?: string }) {
    try {
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
      console.error('Error in updateCategory:', error);
      toast.error("Failed to update category");
      throw error;
    }
  },

  async deleteCategory(categoryId: string) {
    try {
      if (!categoryId) {
        throw new Error('Category ID is missing');
      }
      console.log('Deleting category with ID:', categoryId);
      await axiosInstance.delete(`/admin/categories/${categoryId}`);
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      toast.error("Failed to delete category");
      throw error;
    }
  },

  async updatePositions(updates: { id: string; position: number }[]) {
    try {
      const { data } = await axiosInstance.put('/admin/categories/positions', updates);
      return data;
    } catch (error) {
      console.error('Error in updatePositions:', error);
      toast.error("Failed to update category positions");
      throw error;
    }
  }
};