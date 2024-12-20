import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token handling
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

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Database operations
export const db = {
  from: (table: string) => ({
    select: async (columns = '*') => {
      const response = await api.get(`/${table}`);
      return { data: response.data, error: null };
    },
    insert: async (data: any) => {
      const response = await api.post(`/${table}`, data);
      return { data: response.data, error: null };
    },
    update: async (data: any) => {
      const response = await api.put(`/${table}`, data);
      return { data: response.data, error: null };
    },
    delete: async () => {
      const response = await api.delete(`/${table}`);
      return { data: response.data, error: null };
    },
    eq: async (column: string, value: any) => {
      const response = await api.get(`/${table}?${column}=${value}`);
      return { data: response.data, error: null };
    },
    order: async (column: string, options: { ascending?: boolean } = {}) => {
      const direction = options.ascending ? 'asc' : 'desc';
      const response = await api.get(`/${table}?order=${column}&direction=${direction}`);
      return { data: response.data, error: null };
    },
    in: async (column: string, values: any[]) => {
      const valuesStr = values.join(',');
      const response = await api.get(`/${table}?${column}=in:${valuesStr}`);
      return { data: response.data, error: null };
    },
    or: async (conditions: Record<string, any>) => {
      const params = new URLSearchParams();
      Object.entries(conditions).forEach(([key, value]) => {
        params.append(`or[${key}]`, value);
      });
      const response = await api.get(`/${table}?${params.toString()}`);
      return { data: response.data, error: null };
    },
    ilike: async (column: string, pattern: string) => {
      const response = await api.get(`/${table}?${column}=ilike:${pattern}`);
      return { data: response.data, error: null };
    }
  }),
  auth: {
    getUser: async () => {
      try {
        const response = await api.get('/auth/user');
        return { data: { user: response.data }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },
    getSession: async () => {
      try {
        const response = await api.get('/auth/session');
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  }
};

export default api;