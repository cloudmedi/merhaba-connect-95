import { useEffect, useRef } from 'react';

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Create AudioContext on mount
    console.log('Creating new AudioContext');
    audioContextRef.current = new AudioContext();

    // Resume the context if it's suspended (needed for some browsers)
    if (audioContextRef.current.state === 'suspended') {
      console.log('Resuming suspended AudioContext');
      audioContextRef.current.resume().then(() => {
        console.log('AudioContext resumed successfully');
      });
    }

    return () => {
      // Cleanup on unmount
      if (audioContextRef.current) {
        console.log('Closing AudioContext');
        audioContextRef.current.close();
      }
    };
  }, []);

  return audioContextRef.current;
}