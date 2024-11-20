import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const genreService = {
  async getGenres() {
    const { data, error } = await supabase
      .from('genres')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch genres",
        variant: "destructive",
      });
      throw error;
    }
    
    return data;
  },

  async createGenre(genre: { name: string; description: string }) {
    const { data, error } = await supabase
      .from('genres')
      .insert(genre)
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to create genre",
        variant: "destructive",
      });
      throw error;
    }
    
    return data;
  },

  async updateGenre(id: number, updates: { name?: string; description?: string }) {
    const { data, error } = await supabase
      .from('genres')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update genre",
        variant: "destructive",
      });
      throw error;
    }
    
    return data;
  },

  async deleteGenre(id: number) {
    const { error } = await supabase
      .from('genres')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete genre",
        variant: "destructive",
      });
      throw error;
    }
  }
};