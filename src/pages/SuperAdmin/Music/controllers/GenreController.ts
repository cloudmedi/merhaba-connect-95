import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class GenreController {
  static async getAllGenres() {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Get genres error:', error);
      toast.error(`Türler alınırken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async createGenre(name: string, description?: string) {
    try {
      const { data, error } = await supabase
        .from('genres')
        .insert({
          name,
          description,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Tür oluşturuldu');
      return data;
    } catch (error: any) {
      console.error('Create genre error:', error);
      toast.error(`Tür oluşturulurken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async updateGenre(genreId: string, name: string, description?: string) {
    try {
      const { error } = await supabase
        .from('genres')
        .update({ name, description })
        .eq('id', genreId);

      if (error) throw error;

      toast.success('Tür güncellendi');
    } catch (error: any) {
      console.error('Update genre error:', error);
      toast.error(`Tür güncellenirken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async deleteGenre(genreId: string) {
    try {
      const { error } = await supabase
        .from('genres')
        .delete()
        .eq('id', genreId);

      if (error) throw error;

      toast.success('Tür silindi');
    } catch (error: any) {
      console.error('Delete genre error:', error);
      toast.error(`Tür silinirken hata oluştu: ${error.message}`);
      throw error;
    }
  }
}