import { useRef, useCallback } from 'react';

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

    // Pre-load next audio and start playing before fade
    nextAudio.volume = 0;
    
    // Start playing next track immediately
    const playPromise = nextAudio.play();
    if (playPromise) {
      playPromise.catch(console.error);
    }

    // Quick crossfade (300ms) for seamless transition
    const FADE_DURATION = 300;
    const startTime = Date.now();
    
    fadeInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / FADE_DURATION);

      // Fade out current audio quickly
      if (currentAudio) {
        currentAudio.volume = Math.max(0, (1 - progress) * (currentVolume / 100));
      }

      // Fade in next audio
      nextAudio.volume = progress * (currentVolume / 100);

      // Complete fade
      if (progress >= 1) {
        clearFade();
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        onFadeComplete();
      }
    }, 20); // Update every 20ms for smoother transition
  }, []);

  return {
    startFade,
    clearFade
  };
}