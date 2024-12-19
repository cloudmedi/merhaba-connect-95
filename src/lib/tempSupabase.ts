import api from './api';

// Temporary compatibility layer while we migrate from Supabase to Node.js backend
export const supabase = {
  auth: {
    getUser: async () => {
      try {
        const response = await api.get('/auth/verify');
        return { data: { user: response.data.user }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    }
  },
  from: (table: string) => ({
    select: async (columns = '*') => {
      try {
        const response = await api.get(`/${table}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    insert: async (data: any) => {
      try {
        const response = await api.post(`/${table}`, data);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    update: async (data: any) => {
      try {
        const response = await api.put(`/${table}`, data);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    delete: async () => {
      try {
        const response = await api.delete(`/${table}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    eq: async (column: string, value: any) => {
      try {
        const response = await api.get(`/${table}?${column}=${value}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    order: async (column: string, { ascending = true } = {}) => {
      try {
        const direction = ascending ? 'asc' : 'desc';
        const response = await api.get(`/${table}?orderBy=${column}&direction=${direction}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  }),
  channel: (name: string) => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {}
  })
};