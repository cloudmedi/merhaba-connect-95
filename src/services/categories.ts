import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const categoryService = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position');
    
    if (error) {
      console.error('Error fetching categories:', error);
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

    console.log('Creating category with position:', nextPosition);

    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, position: nextPosition }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      toast.error("Failed to create category");
      throw error;
    }
    
    return data;
  },

  async updateCategory(id: string, updates: { name?: string; description?: string }) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      toast.error("Failed to update category");
      throw error;
    }
    
    return data;
  },

  async updatePositions(updates: { id: string; position: number }[]) {
    console.log('Updating positions:', updates);
    
    // Sort updates by new position to ensure consistent ordering
    const sortedUpdates = [...updates].sort((a, b) => a.position - b.position);
    
    // Use a temporary position offset to avoid conflicts
    const OFFSET = 10000;
    
    try {
      // First, move all positions to temporary positions
      for (const update of sortedUpdates) {
        const { error } = await supabase
          .from('categories')
          .update({ position: update.position + OFFSET })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      // Then, set the final positions
      for (const update of sortedUpdates) {
        const { error } = await supabase
          .from('categories')
          .update({ position: update.position })
          .eq('id', update.id);
          
        if (error) throw error;
      }

      console.log('Position updates completed successfully');
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
      console.error('Error deleting category:', error);
      toast.error("Failed to delete category");
      throw error;
    }
  }
};