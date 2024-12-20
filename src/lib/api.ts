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

// Database operations with TypeScript types
interface QueryOptions {
  select?: string[];
  where?: Record<string, any>;
  order?: { column: string; direction: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

interface ApiResponse<T> {
  data: T;
  error: any;
}

export const db = {
  from: (table: string) => ({
    select: async <T>(columns = '*'): Promise<ApiResponse<T>> => {
      try {
        const response = await api.get(`/${table}`, {
          params: { select: columns }
        });
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    insert: async <T>(data: any): Promise<ApiResponse<T>> => {
      try {
        const response = await api.post(`/${table}`, data);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    update: async <T>(data: any): Promise<ApiResponse<T>> => {
      try {
        const response = await api.put(`/${table}`, data);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    delete: async <T>(): Promise<ApiResponse<T>> => {
      try {
        const response = await api.delete(`/${table}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    eq: async <T>(column: string, value: any): Promise<ApiResponse<T>> => {
      try {
        const response = await api.get(`/${table}`, {
          params: { [column]: value }
        });
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    order: async <T>(column: string, options: { ascending?: boolean } = {}): Promise<ApiResponse<T>> => {
      try {
        const response = await api.get(`/${table}`, {
          params: { 
            order: column,
            direction: options.ascending ? 'asc' : 'desc'
          }
        });
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    in: async <T>(column: string, values: any[]): Promise<ApiResponse<T>> => {
      try {
        const response = await api.get(`/${table}`, {
          params: { [column]: `in:${values.join(',')}` }
        });
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    or: async <T>(conditions: Record<string, any>): Promise<ApiResponse<T>> => {
      try {
        const params = new URLSearchParams();
        Object.entries(conditions).forEach(([key, value]) => {
          params.append(`or[${key}]`, value);
        });
        const response = await api.get(`/${table}?${params.toString()}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
    },

    ilike: async <T>(column: string, pattern: string): Promise<ApiResponse<T>> => {
      try {
        const response = await api.get(`/${table}`, {
          params: { [column]: `ilike:${pattern}` }
        });
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null as any, error };
      }
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