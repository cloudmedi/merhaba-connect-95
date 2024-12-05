export class AudioController {
  private audio: HTMLAudioElement;
  private onTimeUpdateCallback: ((progress: number) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.audio.addEventListener('timeupdate', () => {
      if (this.onTimeUpdateCallback && this.audio.duration) {
        this.onTimeUpdateCallback((this.audio.currentTime / this.audio.duration) * 100);
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.onEndedCallback) {
        this.onEndedCallback();
      }
    });
  }

  public setSource(url: string) {
    this.audio.src = url;
    this.audio.load();
  }

  public async play() {
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      console.error('Error playing audio:', error);
      return false;
    }
  }

  public pause() {
    this.audio.pause();
  }

  public setVolume(volume: number) {
    this.audio.volume = volume / 100;
  }

  public seek(progress: number) {
    if (this.audio.duration) {
      this.audio.currentTime = (progress / 100) * this.audio.duration;
    }
  }

  public onTimeUpdate(callback: (progress: number) => void) {
    this.onTimeUpdateCallback = callback;
  }

  public onEnded(callback: () => void) {
    this.onEndedCallback = callback;
  }

  public cleanup() {
    this.audio.pause();
    this.audio.src = '';
    this.onTimeUpdateCallback = null;
    this.onEndedCallback = null;
  }
}