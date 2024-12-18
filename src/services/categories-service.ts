import axiosInstance from '@/lib/axios';
import { Category } from '@/pages/SuperAdmin/Categories/types';

export const categoryService = {
  getCategories: async () => {
    const response = await axiosInstance.get<Category[]>('/admin/categories');
    return response.data;
  },

  createCategory: async (data: { name: string; description: string }) => {
    const response = await axiosInstance.post<Category>('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: { name: string; description: string }) => {
    if (!id) {
      throw new Error('Category ID is required for update');
    }
    const response = await axiosInstance.put<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    await axiosInstance.delete(`/admin/categories/${id}`);
  },

  updatePositions: async (updates: { id: string; position: number }[]) => {
    const response = await axiosInstance.post('/admin/categories/positions', { positions: updates });
    return response.data;
  }
};