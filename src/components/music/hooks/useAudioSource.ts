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
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  const getBunnyUrl = (url: string): string => {
    if (!url) return '';
    
    // If it's already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      console.log('Using full URL:', url);
      return url;
    }
    
    // If it's a Bunny CDN path without the domain
    if (url.startsWith('cloud-media/')) {
      const fullUrl = url.replace('cloud-media/', 'https://cloud-media.b-cdn.net/');
      console.log('Converted cloud-media URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's just the file name/path, add the Bunny CDN domain
    const fullUrl = `https://cloud-media.b-cdn.net/${url}`;
    console.log('Added CDN domain to URL:', fullUrl);
    return fullUrl;
  };

  const createAndConnectNodes = (audioBuffer: AudioBuffer) => {
    if (!context) {
      console.error('AudioContext is not available');
      return null;
    }

    try {
      const source = context.createBufferSource();
      const gainNode = context.createGain();

      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(context.destination);

      source.onended = () => {
        console.log('Audio playback ended naturally');
        onEnded?.();
      };

      sourceRef.current = source;
      gainNodeRef.current = gainNode;
      audioBufferRef.current = audioBuffer;

      console.log('Audio nodes created and connected successfully');
      return source;
    } catch (error) {
      console.error('Error creating audio nodes:', error);
      toast.error("Error setting up audio playback");
      return null;
    }
  };

  useEffect(() => {
    let aborted = false;

    const initializeAudio = async () => {
      if (!context) {
        console.error('AudioContext is not available');
        return;
      }

      try {
        // Resume AudioContext if suspended
        if (context.state === 'suspended') {
          console.log('Resuming suspended AudioContext...');
          await context.resume();
          console.log('AudioContext resumed successfully');
        }

        const fullUrl = getBunnyUrl(url);
        console.log('Fetching audio from:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio file: ${response.statusText}`);
        }

        console.log('Audio file fetched, decoding...');
        const arrayBuffer = await response.arrayBuffer();
        
        if (aborted) {
          console.log('Audio initialization aborted');
          return;
        }

        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        console.log('Audio decoded successfully:', {
          duration: audioBuffer.duration,
          numberOfChannels: audioBuffer.numberOfChannels,
          sampleRate: audioBuffer.sampleRate
        });

        if (aborted) return;

        durationRef.current = audioBuffer.duration;
        createAndConnectNodes(audioBuffer);

      } catch (error) {
        console.error('Error initializing audio:', error);
        toast.error("Failed to load audio file");
      }
    };

    console.log('Starting audio initialization...');
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
    if (!context) {
      console.error('Cannot play: AudioContext not available');
      return;
    }

    if (context.state === 'suspended') {
      console.log('Attempting to resume suspended context before playing');
      context.resume().then(() => {
        console.log('Context resumed successfully');
      });
    }

    if (!audioBufferRef.current) {
      console.error('Cannot play: Audio buffer not loaded');
      return;
    }

    try {
      // Create new nodes for each playback
      const newSource = createAndConnectNodes(audioBufferRef.current);
      if (!newSource) {
        throw new Error('Failed to create audio nodes');
      }

      console.log('Starting playback:', { 
        offset: offsetRef.current,
        contextTime: context.currentTime,
        duration: durationRef.current
      });

      newSource.start(0, offsetRef.current);
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
      console.log('Playback paused:', { 
        offset: offsetRef.current,
        contextTime: context.currentTime
      });
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