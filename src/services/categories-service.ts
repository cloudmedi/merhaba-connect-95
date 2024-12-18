import axiosInstance from '@/lib/axios';
import { Category } from '@/pages/SuperAdmin/Categories/types';

export const categoryService = {
  getCategories: async () => {
    console.log("Fetching categories from API");
    const response = await axiosInstance.get<Category[]>('/admin/categories');
    console.log("Received categories:", response.data);
    return response.data;
  },

  createCategory: async (data: { name: string; description: string }) => {
    console.log("Creating category with data:", data);
    const response = await axiosInstance.post<Category>('/admin/categories', data);
    console.log("Created category:", response.data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name: string; description: string }) => {
    console.log("Updating category. ID:", id, "Data:", data);
    if (!id) {
      console.error("Category ID is missing in updateCategory");
      throw new Error('Category ID is required for update');
    }
    const response = await axiosInstance.put<Category>(`/admin/categories/${id}`, data);
    console.log("Updated category:", response.data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    console.log("Deleting category with ID:", id);
    await axiosInstance.delete(`/admin/categories/${id}`);
    console.log("Category deleted successfully");
  },

  updatePositions: async (updates: { id: string; position: number }[]) => {
    console.log("Updating category positions:", updates);
    const response = await axiosInstance.post('/admin/categories/positions', { positions: updates });
    console.log("Positions updated:", response.data);
    return response.data;
  }
};