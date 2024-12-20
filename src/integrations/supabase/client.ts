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
    },
    getSession: async () => {
      try {
        const response = await api.get('/auth/session');
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
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
    },

    ilike: async (column: string, pattern: string) => {
      try {
        const response = await api.get(`/${table}?${column}=ilike.${pattern}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    or: async (conditions: string) => {
      try {
        const response = await api.get(`/${table}?or=${conditions}`);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  }),

  channel: (name: string) => ({
    on: (event: string, filter: any, callback: Function) => ({
      subscribe: (status?: Function) => {
        // WebSocket bağlantısı için gerekli implementasyon
        if (status) status('SUBSCRIBED');
      }
    }),
    subscribe: (status?: Function) => {
      if (status) status('SUBSCRIBED');
    },
    send: async (message: any) => {
      try {
        await api.post('/ws/send', message);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    unsubscribe: () => {},
    removeChannel: () => {}
  }),

  functions: {
    invoke: async (functionName: string, payload?: any) => {
      try {
        const response = await api.post(`/functions/${functionName}`, payload);
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  }
};

export { client as supabase };