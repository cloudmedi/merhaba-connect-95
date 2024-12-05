import { useEffect, useRef } from 'react';
import { toast } from "sonner";

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      // Check if AudioContext is available in the window object
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      
      if (!AudioContextClass) {
        console.error('AudioContext is not supported in this browser');
        toast.error("Audio playback is not supported in this browser");
        return;
      }

      // Create AudioContext on mount
      console.log('Creating new AudioContext');
      audioContextRef.current = new AudioContextClass();

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
    } catch (error) {
      console.error('Error initializing AudioContext:', error);
      toast.error("Failed to initialize audio system");
    }
  }, []);

  return audioContextRef.current;
}