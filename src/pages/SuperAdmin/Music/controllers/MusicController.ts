import { toast } from "sonner";
import axios from '@/lib/axios';

export class MusicController {
  static async uploadMusic(files: FileList) {
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/admin/songs/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success(`${file.name} başarıyla yüklendi`);
        return response.data;

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
      await axios.delete(`/admin/songs/${songId}`);
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
      await axios.patch(`/admin/songs/${songId}`, updates);
      toast.success('Şarkı başarıyla güncellendi');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(`Şarkı güncellenirken hata oluştu: ${error.message}`);
      throw error;
    }
  }

  static async updateGenres(songId: string, genres: string[]) {
    try {
      await axios.patch(`/admin/songs/${songId}`, { genre: genres });
      toast.success('Türler başarıyla güncellendi');
    } catch (error: any) {
      console.error('Update genres error:', error);
      toast.error(`Türler güncellenirken hata oluştu: ${error.message}`);
      throw error;
    }
  }
}