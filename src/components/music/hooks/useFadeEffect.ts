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
    console.log('Starting fade effect');

    // Set initial volumes
    if (currentAudio) {
      currentAudio.volume = currentVolume / 100;
    }
    nextAudio.volume = 0;

    // Start playing next track
    const playPromise = nextAudio.play();
    if (playPromise) {
      playPromise
        .then(() => {
          console.log('Next audio started playing successfully');
        })
        .catch(error => {
          console.error('Error playing next audio:', error);
        });
    }

    // Crossfade duration (500ms for smoother transition)
    const FADE_DURATION = 500;
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
        console.log('Fade transition completed');
        onFadeComplete();
      }
    }, 16); // Update every 16ms (60fps) for smooth transition
  }, []);

  return {
    startFade,
    clearFade
  };
}