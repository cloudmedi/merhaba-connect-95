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
      console.log('Raw event received:', event.data);
      const data = JSON.parse(event.data);
      console.log('Parsed event data:', data);

      if (data.type === 'progress' && data.fileName) {
        console.log('Progress update:', { fileName: data.fileName, progress: data.progress });
        onProgress(data.fileName, data.progress);
      }

      if (data.type === 'error' && data.fileName) {
        console.log('Error event:', { fileName: data.fileName, error: data.error });
        onError(data.fileName, data.error);
      }

      if (data.type === 'complete' && data.fileName) {
        console.log('Complete event:', { fileName: data.fileName });
        onComplete(data.fileName);
      }
    } catch (error) {
      console.error('Error parsing event data:', error);
    }
  }, [onProgress, onError, onComplete]);

  useEffect(() => {
    if (!token) {
      console.log('No token available, skipping EventSource connection');
      return;
    }

    console.log('Creating EventSource connection...');
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/admin/songs/upload?token=${token}`
    );

    console.log('EventSource connection opened');
    
    eventSource.onopen = () => {
      console.log('EventSource connected successfully');
    };

    eventSource.onmessage = handleEventSourceMessage;
    
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
    };

    return () => {
      console.log('Closing EventSource connection');
      eventSource.close();
    };
  }, [token, handleEventSourceMessage]);
};