import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/manager/login';
    }
    return Promise.reject(error);
  }
);

// Playlist servisleri
export const playlistService = {
  getHeroPlaylist: async () => {
    const response = await api.get('/manager/playlists/hero');
    return response.data;
  },

  getCategories: async (search?: string) => {
    const response = await api.get('/manager/categories', {
      params: { search }
    });
    return response.data;
  }
};

export default api;