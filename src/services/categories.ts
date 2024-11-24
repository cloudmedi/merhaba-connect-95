import { supabase } from "@/integrations/supabase/client";
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
      .insert({ ...category, position: nextPosition })
      .select()
      .single();
    
    if (error) {
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
      toast.error("Failed to update category");
      throw error;
    }
    
    return data;
  },

  async updatePositions(updates: { id: string; position: number }[]) {
    try {
      const { error } = await supabase.rpc('update_category_positions', {
        category_positions: updates
      });
      
      if (error) {
        console.error('Error updating positions:', error);
        throw error;
      }
    } catch (error: any) {
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