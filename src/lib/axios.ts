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
    console.log('Axios interceptor - Token:', token ? 'Token exists' : 'No token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // URL'deki tekrarlanan api/ kısmını temizle
    if (config.url?.startsWith('api/')) {
      config.url = config.url.substring(4);
    }
    
    console.log('Axios interceptor - Final URL:', config.url);
    console.log('Axios interceptor - Final headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Axios interceptor - Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - clearing token');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;