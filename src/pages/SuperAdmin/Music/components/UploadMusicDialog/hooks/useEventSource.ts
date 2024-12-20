import { useEffect, useCallback } from 'react';

interface EventSourceHookProps {
  token: string | null;
  onProgress: (fileName: string, progress: number) => void;
  onError: (fileName: string, error: string) => void;
  onComplete: (fileName: string) => void;
}

export const useEventSource = ({ token, onProgress, onError, onComplete }: EventSourceHookProps) => {
  const handleEventSourceMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('EventSource message received:', data);

      if (data.type === 'progress' && data.fileName) {
        onProgress(data.fileName, data.progress);
      }

      if (data.type === 'error' && data.fileName) {
        onError(data.fileName, data.error);
      }

      if (data.type === 'complete' && data.fileName) {
        onComplete(data.fileName);
      }
    } catch (error) {
      console.error('Error parsing event data:', error);
    }
  }, [onProgress, onError, onComplete]);

  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/admin/songs/upload?token=${token}`
    );

    console.log('EventSource connection opened');

    eventSource.onmessage = handleEventSourceMessage;
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
    };

    return () => {
      console.log('EventSource connection closed');
      eventSource.close();
    };
  }, [token, handleEventSourceMessage]);
};