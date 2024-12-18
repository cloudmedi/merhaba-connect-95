import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - token yönetimi
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token hatası durumunda verify endpoint'ine istek at
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await fetch(`${API_URL}/admin/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            localStorage.setItem('token', data.token);
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return axios(originalRequest);
          }
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }

    const message = error.response?.data?.message || 'Bir hata oluştu';
    
    if (error.response?.status === 403) {
      toast.error('Bu işlem için yetkiniz yok.');
    } else if (error.response?.status === 404) {
      toast.error('İstenen kaynak bulunamadı.');
    } else if (error.response?.status >= 500) {
      toast.error('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;