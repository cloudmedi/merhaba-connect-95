import { useCallback } from 'react';
import { toast } from "sonner";
import { useAudioBuffer } from './useAudioBuffer';
import { useAudioNodes } from './useAudioNodes';

interface AudioSourceProps {
  url: string;
  context: AudioContext | null;
  onEnded?: () => void;
}

export function useAudioSource({ url, context, onEnded }: AudioSourceProps) {
  const { audioBuffer, isLoading, error } = useAudioBuffer(url, context);
  const { createNodes, cleanup, nodesRef, startTimeRef, offsetRef } = useAudioNodes(context);

  const play = useCallback(() => {
    if (!context) {
      console.error('Cannot play: AudioContext not available');
      return;
    }

    if (context.state === 'suspended') {
      console.log('Resuming suspended context before playing');
      context.resume().then(() => {
        console.log('Context resumed successfully');
      });
    }

    if (!audioBuffer) {
      console.error('Cannot play: Audio buffer not loaded');
      return;
    }

    try {
      // Create new nodes for each playback
      const nodes = createNodes(audioBuffer);
      if (!nodes) {
        throw new Error('Failed to create audio nodes');
      }

      const { source } = nodes;

      source.onended = () => {
        console.log('Audio playback ended naturally');
        onEnded?.();
      };

      console.log('Starting playback:', { 
        offset: offsetRef.current,
        contextTime: context.currentTime,
        duration: audioBuffer.duration
      });

      source.start(0, offsetRef.current);
      startTimeRef.current = context.currentTime - offsetRef.current;
      console.log('Playback started successfully');
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error("Error playing audio");
    }
  }, [context, audioBuffer, createNodes, onEnded]);

  const pause = useCallback(() => {
    if (!context || !nodesRef.current.source) {
      console.error('Cannot pause: Audio source or context not initialized');
      return;
    }

    try {
      nodesRef.current.source.stop();
      offsetRef.current = context.currentTime - startTimeRef.current;
      console.log('Playback paused:', { 
        offset: offsetRef.current,
        contextTime: context.currentTime
      });
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }, [context]);

  const setVolume = useCallback((value: number) => {
    if (!nodesRef.current.gainNode) {
      console.error('Cannot set volume: Gain node not initialized');
      return;
    }
    console.log('Setting volume:', value);
    nodesRef.current.gainNode.gain.value = value;
  }, []);

  return {
    play,
    pause,
    setVolume,
    isLoading,
    error,
    duration: audioBuffer?.duration || 0
  };
}