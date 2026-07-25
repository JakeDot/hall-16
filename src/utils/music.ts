// Looping background soundtrack, separate from the one-shot SFX in audio.ts

const TRACK_SRC = '/audio/hall16-menu-theme.mp3';
const DEFAULT_VOLUME = 0.35;

class BackgroundMusic {
  private audio: HTMLAudioElement | null = null;
  private started = false;
  private muted = false;

  private ensure(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio(TRACK_SRC);
      this.audio.loop = true;
      this.audio.volume = DEFAULT_VOLUME;
      this.audio.muted = this.muted;
    }
    return this.audio;
  }

  // Browsers block audio with sound until a user gesture occurs, so call this
  // from the first click/pointerdown on the page rather than on mount.
  start() {
    if (this.started) return;
    this.started = true;
    this.ensure().play().catch(() => {
      // Autoplay was blocked; it'll retry on the next start() call.
      this.started = false;
    });
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    this.ensure().muted = this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const music = new BackgroundMusic();
