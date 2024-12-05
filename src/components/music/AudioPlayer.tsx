import { useState, useEffect, useRef } from 'react';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import { toast } from "sonner";

interface AudioPlayerProps {
  audioUrl: string;
  onNext?: () => void;
  onPrevious?: () => void;
  volume?: number;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({
  audioUrl,
  onNext,
  onPrevious,
  volume = 1,
  autoPlay = false,
  onPlayStateChange
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const initAudioContext = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          console.error('AudioContext is not supported');
          toast.error('Audio playback is not supported in this browser');
          return false;
        }
        
        audioContextRef.current = new AudioContextClass();
        return true;
      } catch (error) {
        console.error('Failed to initialize AudioContext:', error);
        toast.error('Failed to initialize audio system');
        return false;
      }
    };

    const setupAudioNodes = () => {
      if (!audioRef.current || !audioContextRef.current) return;

      try {
        // Create and connect nodes
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        gainNodeRef.current = audioContextRef.current.createGain();
        sourceNodeRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioContextRef.current.destination);
        
        // Set initial volume
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = volume;
        }
      } catch (error) {
        console.error('Error setting up audio nodes:', error);
        toast.error('Error setting up audio system');
      }
    };

    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (!audioContextRef.current && initAudioContext()) {
        setupAudioNodes();
      }
      
      if (autoPlay) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
          onPlayStateChange?.(false);
          toast.error('Please interact with the page before playing audio');
        });
        setIsPlaying(true);
        onPlayStateChange?.(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      setProgress(0);
      onNext?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Set source and load audio
    audio.src = audioUrl;
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      
      // Cleanup audio context and nodes
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      sourceNodeRef.current = null;
      gainNodeRef.current = null;
      
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };
  }, [audioUrl, autoPlay, onNext, volume, onPlayStateChange]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
        setupAudioNodes();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        await audioRef.current.play();
      }
      
      setIsPlaying(!isPlaying);
      onPlayStateChange?.(!isPlaying);
    } catch (error) {
      console.error('Error toggling playback:', error);
      toast.error('Error playing audio');
    }
  };

  const setupAudioNodes = () => {
    if (!audioRef.current || !audioContextRef.current) return;

    sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
    gainNodeRef.current = audioContextRef.current.createGain();
    sourceNodeRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);
    
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  };

  const handleSeek = (values: number[]) => {
    if (!audioRef.current || !duration) return;
    
    const [value] = values;
    const time = (value / 100) * duration;
    audioRef.current.currentTime = time;
    setProgress(value);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onNext={onNext}
        onPrevious={onPrevious}
      />
      <ProgressBar progress={progress} onProgressChange={handleSeek} />
    </div>
  );
}