import { useState, useEffect } from 'react';
import { toast } from "sonner";

export const useAudioBuffer = (url: string, context: AudioContext | null) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getBunnyUrl = (url: string): string => {
    if (!url) return '';
    
    console.log('Processing URL:', url);
    
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

  useEffect(() => {
    if (!context || !url) return;

    const loadAudioBuffer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fullUrl = getBunnyUrl(url);
        console.log('Fetching audio from:', fullUrl);

        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        console.log('Audio file fetched, decoding...');

        const buffer = await context.decodeAudioData(arrayBuffer);
        console.log('Audio decoded successfully:', {
          duration: buffer.duration,
          numberOfChannels: buffer.numberOfChannels,
          sampleRate: buffer.sampleRate
        });

        setAudioBuffer(buffer);
      } catch (error) {
        console.error('Error loading audio:', error);
        setError(error as Error);
        toast.error("Failed to load audio file");
      } finally {
        setIsLoading(false);
      }
    };

    loadAudioBuffer();
  }, [url, context]);

  return { audioBuffer, isLoading, error };
};