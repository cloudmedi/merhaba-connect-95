import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class MusicController {
  static async uploadMusic(files: FileList) {
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // Convert file to base64
        const reader = new FileReader();
        const fileBase64Promise = new Promise((resolve) => {
          reader.onload = () => {
            const base64 = reader.result?.toString().split(',')[1];
            resolve(base64);
          };
        });
        reader.readAsDataURL(file);
        const fileBase64 = await fileBase64Promise;

        // Call the upload-music edge function
        const { data, error } = await supabase.functions.invoke('upload-music', {
          body: {
            fileData: fileBase64,
            fileName: file.name,
            contentType: file.type
          }
        });

        if (error) throw error;

        toast.success(`${file.name} başarıyla yüklendi`);
        return data;

      } catch (error: any) {
        console.error('Upload error:', error);
        toast.error(`${file.name} yüklenirken hata oluştu: ${error.message}`);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  }

  static async deleteMusic(songId: string) {
    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      toast.success('Şarkı başarıyla silindi');
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(`Şarkı silinirken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async updateSong(songId: string, updates: {
    title?: string;
    artist?: string;
    album?: string;
    genre?: string[];
  }) {
    try {
      const { error } = await supabase
        .from('songs')
        .update(updates)
        .eq('id', songId);

      if (error) throw error;

      toast.success('Şarkı başarıyla güncellendi');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(`Şarkı güncellenirken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async addToPlaylist(songIds: string[], playlistId: string) {
    try {
      const { data: existingSongs } = await supabase
        .from('playlist_songs')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1);

      const startPosition = existingSongs?.[0]?.position || 0;

      const playlistSongs = songIds.map((songId, index) => ({
        playlist_id: playlistId,
        song_id: songId,
        position: startPosition + index + 1
      }));

      const { error } = await supabase
        .from('playlist_songs')
        .insert(playlistSongs);

      if (error) throw error;

      toast.success('Şarkılar çalma listesine eklendi');
    } catch (error: any) {
      console.error('Add to playlist error:', error);
      toast.error(`Şarkılar çalma listesine eklenirken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async updateGenres(songId: string, genres: string[]) {
    try {
      const { error } = await supabase
        .from('songs')
        .update({ genre: genres })
        .eq('id', songId);

      if (error) throw error;

      toast.success('Türler başarıyla güncellendi');
    } catch (error: any) {
      console.error('Update genres error:', error);
      toast.error(`Türler güncellenirken hata oluştu: ${error.message}`);
      throw error;
    }
  }
}