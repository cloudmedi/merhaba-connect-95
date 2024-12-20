import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  status: 'read' | 'unread';
  created_at: string;
  type: string;
  metadata?: {
    playlist_id?: string;
    artwork_url?: string;
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => n.status === 'unread').length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // WebSocket bağlantısı
    const ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:5000');
    
    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      if (newNotification.type === 'notification') {
        setNotifications(prev => [newNotification.data, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        toast(newNotification.data.title, {
          description: newNotification.data.message,
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, status: 'read' } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}