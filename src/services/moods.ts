import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const moodService = {
  async getMoods() {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch moods",
        variant: "destructive",
      });
      throw error;
    }
    
    return data;
  },

  async createMood(mood: { name: string; description: string; icon: string }) {
    const { data, error } = await supabase
      .from('moods')
      .insert(mood)
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create mood",
        variant: "destructive",
      });
      throw error;
    }
    
    return data;
  },

  async updateMood(id: string, updates: { name?: string; description?: string; icon?: string }) {
    const { data, error } = await supabase
      .from('moods')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update mood",
        variant: "destructive",
      });
      throw error;
    }
    
    return data;
  },

  async deleteMood(id: string) {
    const { error } = await supabase
      .from('moods')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete mood",
        variant: "destructive",
      });
      throw error;
    }
  }
};