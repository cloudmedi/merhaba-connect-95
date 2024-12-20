import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { api } from '@/lib/api';

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
        const response = await api.get('/notifications');
        const formattedNotifications = response.data.map((n: any) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          status: n.isRead ? 'read' : 'unread',
          created_at: n.createdAt,
          type: n.type,
          metadata: n.metadata || {}
        }));

        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => n.status === 'unread').length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Bildirimler alınamadı');
      }
    };

    fetchNotifications();

    // WebSocket bağlantısı için useWebSocketConnection hook'unu kullan
    const ws = new WebSocket('ws://localhost:5001');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        const newNotification = {
          id: data.id,
          title: data.title,
          message: data.message,
          status: 'unread',
          created_at: new Date().toISOString(),
          type: data.type,
          metadata: data.metadata || {}
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        toast(newNotification.title, {
          description: newNotification.message,
        });
      }
    };

    return () => {
      ws.close();
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, status: 'read' } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Bildirim güncellenemedi');
    }
  };

  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter(n => n.status === 'unread')
        .map(n => api.patch(`/notifications/${n.id}/read`));
      
      await Promise.all(promises);
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Bildirimler güncellenemedi');
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}