import { useEffect, useRef } from 'react';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Create AudioContext on mount
    audioContextRef.current = new AudioContext();

    return () => {
      // Cleanup on unmount
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return audioContextRef.current;
}