import api from '@/lib/api';

// Node.js API client
const client = {
  auth: {
    getUser: async () => {
      try {
        const response = await api.get('/auth/user');
        return { data: { user: response.data }, error: null };
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

    in: async (column: string, values: any[]) => {
      try {
        const valuesStr = values.join(',');
        const response = await api.get(`/${table}?${column}=in.(${valuesStr})`);
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

  // Websocket işlemleri için boş implementasyonlar
  channel: (name: string) => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {}
  })
};

export { client as supabase };