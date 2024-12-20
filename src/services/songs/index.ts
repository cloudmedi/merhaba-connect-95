import api from '@/lib/api';

export const songService = {
  uploadSong: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/admin/songs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log('Upload progress:', percentCompleted);
      }
    });

    return response.data;
  },

  deleteSong: async (id: string) => {
    const response = await api.delete(`/admin/songs/${id}`);
    return response.data;
  },

  updateSong: async (id: string, data: any) => {
    const response = await api.put(`/admin/songs/${id}`, data);
    return response.data;
  },

  getSongs: async () => {
    const response = await api.get('/admin/songs');
    return response.data;
  }
};