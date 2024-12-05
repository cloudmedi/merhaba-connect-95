import { useEffect, useRef } from 'react';
import { toast } from "sonner";

interface AudioSourceProps {
  url: string;
  context: AudioContext | null;
  onEnded?: () => void;
}

export function useAudioSource({ url, context, onEnded }: AudioSourceProps) {
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const getBunnyUrl = (url: string): string => {
    if (!url) return '';
    
    // If it's already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a Bunny CDN path without the domain
    if (url.startsWith('cloud-media/')) {
      return url.replace('cloud-media/', 'https://cloud-media.b-cdn.net/');
    }
    
    // If it's just the file name/path, add the Bunny CDN domain
    return `https://cloud-media.b-cdn.net/${url}`;
  };

  useEffect(() => {
    let aborted = false;

    const initializeAudio = async () => {
      if (!context) {
        console.error('AudioContext is not available');
        return;
      }

      try {
        const fullUrl = getBunnyUrl(url);
        console.log('Loading audio from:', fullUrl);
        
        // Resume AudioContext if it's suspended
        if (context.state === 'suspended') {
          await context.resume();
          console.log('AudioContext resumed');
        }

        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to load audio file: ${response.statusText}`);
        }

        console.log('Audio file fetched, decoding...');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        console.log('Audio decoded successfully:', {
          duration: audioBuffer.duration,
          numberOfChannels: audioBuffer.numberOfChannels,
          sampleRate: audioBuffer.sampleRate
        });

        if (aborted) return;

        durationRef.current = audioBuffer.duration;

        // Create and connect nodes
        const source = context.createBufferSource();
        const gainNode = context.createGain();

        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);

        source.onended = () => {
          console.log('Audio playback ended');
          if (onEnded) onEnded();
        };

        sourceRef.current = source;
        gainNodeRef.current = gainNode;

        console.log('Audio source initialized successfully');
      } catch (error) {
        console.error('Error loading audio:', error);
        toast.error("Error loading audio file");
      }
    };

    initializeAudio();

    return () => {
      aborted = true;
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
          console.log('Audio source stopped and cleaned up');
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, [url, context, onEnded]);

  const play = () => {
    if (!sourceRef.current || !context) {
      console.error('Cannot play: Audio source or context not initialized');
      return;
    }

    try {
      console.log('Starting playback:', { offset: offsetRef.current });
      sourceRef.current.start(0, offsetRef.current);
      startTimeRef.current = context.currentTime - offsetRef.current;
      console.log('Playback started successfully');
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error("Error playing audio");
    }
  };

  const pause = () => {
    if (!sourceRef.current || !context) {
      console.error('Cannot pause: Audio source or context not initialized');
      return;
    }

    try {
      sourceRef.current.stop();
      offsetRef.current = context.currentTime - startTimeRef.current;
      console.log('Playback paused:', { offset: offsetRef.current });
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const setVolume = (value: number) => {
    if (!gainNodeRef.current) {
      console.error('Cannot set volume: Gain node not initialized');
      return;
    }
    console.log('Setting volume:', value);
    gainNodeRef.current.gain.value = value;
  };

  return {
    play,
    pause,
    setVolume,
    duration: durationRef.current
  };
}