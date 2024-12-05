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
      if (!context) return;

      try {
        const fullUrl = getBunnyUrl(url);
        console.log('Loading audio from:', fullUrl);
        
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to load audio file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);

        if (aborted) return;

        durationRef.current = audioBuffer.duration;

        // Create and connect nodes
        const source = context.createBufferSource();
        const gainNode = context.createGain();

        source.buffer = audioBuffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);

        source.onended = () => {
          if (onEnded) onEnded();
        };

        sourceRef.current = source;
        gainNodeRef.current = gainNode;

        console.log('Audio source initialized:', { url: fullUrl, duration: audioBuffer.duration });
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
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, [url, context, onEnded]);

  const play = () => {
    if (!sourceRef.current || !context) return;

    try {
      sourceRef.current.start(0, offsetRef.current);
      startTimeRef.current = context.currentTime - offsetRef.current;
      console.log('Playing audio:', { offset: offsetRef.current });
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error("Error playing audio");
    }
  };

  const pause = () => {
    if (!sourceRef.current || !context) return;

    try {
      sourceRef.current.stop();
      offsetRef.current = context.currentTime - startTimeRef.current;
      console.log('Pausing audio:', { offset: offsetRef.current });
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const setVolume = (value: number) => {
    if (!gainNodeRef.current) return;
    gainNodeRef.current.gain.value = value;
  };

  return {
    play,
    pause,
    setVolume,
    duration: durationRef.current
  };
}