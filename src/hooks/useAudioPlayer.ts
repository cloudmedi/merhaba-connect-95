import { useRef, useState, useEffect } from 'react';
import { Howl } from 'howler';

export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<Howl | null>(null);
  
  const play = (url: string) => {
    if (playerRef.current) {
      playerRef.current.unload();
    }
    
    playerRef.current = new Howl({
      src: [url],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onload: () => {
        setDuration(playerRef.current?.duration() || 0);
      }
    });
    
    playerRef.current.play();
  };
  
  const pause = () => {
    playerRef.current?.pause();
  };
  
  const stop = () => {
    playerRef.current?.stop();
    setCurrentTime(0);
  };
  
  const seek = (time: number) => {
    playerRef.current?.seek(time);
    setCurrentTime(time);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.seek());
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    stop,
    seek
  };
}