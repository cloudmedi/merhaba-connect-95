import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

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

type SupabaseNotification = Tables<'notifications'>;

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      const formattedNotifications: Notification[] = (data as SupabaseNotification[]).map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        status: n.status as 'read' | 'unread',
        created_at: n.created_at || '',
        type: n.type,
        metadata: n.metadata as { playlist_id?: string; artwork_url?: string; } || {}
      }));

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => n.status === 'unread').length);
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as SupabaseNotification;
          const formattedNotification: Notification = {
            id: newNotification.id,
            title: newNotification.title,
            message: newNotification.message,
            status: newNotification.status as 'read' | 'unread',
            created_at: newNotification.created_at || '',
            type: newNotification.type,
            metadata: newNotification.metadata as { playlist_id?: string; artwork_url?: string; } || {}
          };
          
          setNotifications(prev => [formattedNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          toast(formattedNotification.title, {
            description: formattedNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, status: 'read' } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('recipient_id', user?.id)
      .eq('status', 'unread');

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return;
    }

    setNotifications(prev =>
      prev.map(n => ({ ...n, status: 'read' }))
    );
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}