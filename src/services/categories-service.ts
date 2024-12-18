import axiosInstance from '@/lib/axios';
import { toast } from "sonner";

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position');
    
    if (error) {
      toast.error("Failed to fetch categories");
      throw error;
    }
    
    return data;
  },

  async createCategory(category: { name: string; description: string }) {
    // Get the maximum position
    const { data: maxPositionData } = await supabase
      .from('categories')
      .select('position')
      .order('position', { ascending: false })
      .limit(1);

    const nextPosition = maxPositionData && maxPositionData.length > 0 
      ? (maxPositionData[0].position + 1) 
      : 1;

    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, position: nextPosition }])
      .select()
      .single();
    
    if (error) {
      toast.error("Failed to create category");
      throw error;
    }
    
    return data;
  },

  async updateCategory(category: { id?: string; _id?: string; name?: string; description?: string }) {
    // ID kontrolü - hem id hem de _id field'ını kontrol et
    const categoryId = category.id || category._id;
    
    console.log("Updating category with ID:", categoryId);
    
    if (!categoryId) {
      console.error("Category ID is missing in updateCategory");
      throw new Error('Category ID is missing');
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ 
        name: category.name,
        description: category.description 
      })
      .eq('id', categoryId)
      .select()
      .single();
    
    if (error) {
      toast.error("Failed to update category");
      throw error;
    }
    
    return data;
  },

  async updatePositions(updates: { id?: string; _id?: string; position: number }[]) {
    // Sort updates by new position to ensure consistent ordering
    const sortedUpdates = [...updates].sort((a, b) => a.position - b.position);
    
    // Use a temporary position offset to avoid conflicts
    const OFFSET = 10000;
    
    try {
      // First, move all positions to temporary positions
      for (const update of sortedUpdates) {
        const categoryId = update.id || update._id;
        if (!categoryId) {
          throw new Error('Category ID is missing in position update');
        }

        const { error } = await supabase
          .from('categories')
          .update({ position: update.position + OFFSET })
          .eq('id', categoryId);
          
        if (error) throw error;
      }
      
      // Then, set the final positions
      for (const update of sortedUpdates) {
        const categoryId = update.id || update._id;
        if (!categoryId) {
          throw new Error('Category ID is missing in position update');
        }

        const { error } = await supabase
          .from('categories')
          .update({ position: update.position })
          .eq('id', categoryId);
          
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Error updating positions:', error);
      toast.error("Failed to update category positions");
      throw error;
    }
  },

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error("Failed to delete category");
      throw error;
    }
  }
};