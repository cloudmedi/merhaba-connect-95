import { useRef, useCallback } from 'react';

const FADE_DURATION = 3000; // 3 seconds fade duration

export function useFadeEffect() {
  const fadeInterval = useRef<NodeJS.Timeout | null>(null);

  const clearFade = useCallback(() => {
    if (fadeInterval.current) {
      clearInterval(fadeInterval.current);
      fadeInterval.current = null;
    }
  }, []);

  const startFade = useCallback((
    currentAudio: HTMLAudioElement | null,
    nextAudio: HTMLAudioElement,
    currentVolume: number,
    onFadeComplete: () => void
  ) => {
    clearFade();

    // Prepare next audio
    nextAudio.volume = 0;
    const playPromise = nextAudio.play();
    if (playPromise) {
      playPromise.catch(console.error);
    }

    let progress = 0;
    const step = 20; // Update every 20ms
    const volumeStep = step / FADE_DURATION;

    fadeInterval.current = setInterval(() => {
      progress += step;
      
      // Fade out current audio if it exists
      if (currentAudio) {
        currentAudio.volume = Math.max(0, 1 - (progress / FADE_DURATION));
      }
      
      // Fade in next audio
      nextAudio.volume = Math.min(1, progress / FADE_DURATION) * (currentVolume / 100);

      if (progress >= FADE_DURATION) {
        clearFade();
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.src = '';
        }
        onFadeComplete();
      }
    }, step);
  }, []);

  return {
    startFade,
    clearFade,
    FADE_DURATION
  };
}