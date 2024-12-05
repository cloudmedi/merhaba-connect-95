import { useRef, useCallback } from 'react';

interface AudioNodes {
  source: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
}

export const useAudioNodes = (context: AudioContext | null) => {
  const nodesRef = useRef<AudioNodes>({ source: null, gainNode: null });
  const startTimeRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  const createNodes = useCallback((buffer: AudioBuffer) => {
    if (!context) return null;

    try {
      // Clean up existing nodes
      if (nodesRef.current.source) {
        nodesRef.current.source.stop();
        nodesRef.current.source.disconnect();
      }
      if (nodesRef.current.gainNode) {
        nodesRef.current.gainNode.disconnect();
      }

      // Create new nodes
      const source = context.createBufferSource();
      const gainNode = context.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(context.destination);

      nodesRef.current = { source, gainNode };
      console.log('Audio nodes created and connected successfully');
      
      return { source, gainNode };
    } catch (error) {
      console.error('Error creating audio nodes:', error);
      toast.error("Error setting up audio playback");
      return null;
    }
  }, [context]);

  const cleanup = useCallback(() => {
    if (nodesRef.current.source) {
      try {
        nodesRef.current.source.stop();
        nodesRef.current.source.disconnect();
      } catch (e) {
        // Ignore errors when stopping
      }
    }
    if (nodesRef.current.gainNode) {
      nodesRef.current.gainNode.disconnect();
    }
    nodesRef.current = { source: null, gainNode: null };
  }, []);

  return {
    createNodes,
    cleanup,
    nodesRef,
    startTimeRef,
    offsetRef
  };
};