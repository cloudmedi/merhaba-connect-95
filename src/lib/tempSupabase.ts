import api from './api';

// This is a temporary compatibility layer while we migrate from Supabase
export const supabase = {
  auth: {
    getUser: async () => {
      const token = localStorage.getItem('token');
      if (!token) return { data: { user: null }, error: null };
      try {
        const response = await api.get('/auth/verify');
        return { data: { user: response.data.user }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    }
  },
  from: (table: string) => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null })
  }),
  channel: (name: string) => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {}
  })
};