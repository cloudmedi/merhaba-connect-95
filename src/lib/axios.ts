import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request URL:', config.url);
    console.log('Full URL:', API_URL + config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // URL'deki tekrarlanan api/ kısmını temizle
    if (config.url?.startsWith('/api/')) {
      config.url = config.url.substring(4); // Remove leading /api
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    console.error('Error config:', error.config);
    console.error('Error response:', error.response);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;