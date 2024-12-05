import { useRef, useCallback } from 'react';

const FADE_DURATION = 1000; // 1 second fade duration

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

    // Set initial volumes
    if (currentAudio) {
      currentAudio.volume = currentVolume / 100;
    }
    nextAudio.volume = 0;

    // Start playing next audio
    nextAudio.play().catch(console.error);

    const startTime = Date.now();
    
    fadeInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / FADE_DURATION);

      // Fade out current audio
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
    }, 50); // Update every 50ms for smooth transition
  }, []);

  return {
    startFade,
    clearFade,
    FADE_DURATION
  };
}