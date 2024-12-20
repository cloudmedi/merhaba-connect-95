import axios from 'axios';
import { io, Socket } from 'socket.io-client';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  public axios = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  private socket: Socket | null = null;

  constructor() {
    this.setupAxiosInterceptors();
    this.setupWebSocket();
  }

  private setupAxiosInterceptors() {
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private setupWebSocket() {
    this.socket = io(API_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }

  public channel(name: string) {
    if (!this.socket) {
      throw new Error('WebSocket not initialized');
    }
    return {
      subscribe: (callback: (data: any) => void) => {
        this.socket?.on(name, callback);
        return () => this.socket?.off(name, callback);
      },
      unsubscribe: () => {
        this.socket?.off(name);
      },
      emit: (event: string, data: any) => {
        this.socket?.emit(event, data);
      }
    };
  }

  public removeChannel(channel: string) {
    this.socket?.off(channel);
  }

  public from(table: string) {
    return {
      select: async <T>(columns = '*'): Promise<{ data: T; error: any }> => {
        const response = await this.axios.get(`/${table}`, { params: { select: columns } });
        return { data: response.data, error: null };
      },

      insert: async <T>(data: any): Promise<{ data: T; error: any }> => {
        const response = await this.axios.post(`/${table}`, data);
        return { data: response.data, error: null };
      },

      update: async <T>(data: any): Promise<{ data: T; error: any }> => {
        const response = await this.axios.put(`/${table}`, data);
        return { data: response.data, error: null };
      },

      delete: async <T>(): Promise<{ data: T; error: any }> => {
        const response = await this.axios.delete(`/${table}`);
        return { data: response.data, error: null };
      },

      eq: async <T>(column: string, value: any): Promise<{ data: T; error: any }> => {
        const response = await this.axios.get(`/${table}`, {
          params: { [column]: value }
        });
        return { data: response.data, error: null };
      },

      order: async <T>(column: string, options: { ascending?: boolean } = {}): Promise<{ data: T; error: any }> => {
        const response = await this.axios.get(`/${table}`, {
          params: { 
            order: column,
            direction: options.ascending ? 'asc' : 'desc'
          }
        });
        return { data: response.data, error: null };
      }
    };
  }

  public auth = {
    getUser: async () => {
      try {
        const response = await this.axios.get('/auth/user');
        return { data: { user: response.data }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },

    getSession: async () => {
      try {
        const response = await this.axios.get('/auth/session');
        return { data: response.data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  };
}

export const api = new ApiClient();