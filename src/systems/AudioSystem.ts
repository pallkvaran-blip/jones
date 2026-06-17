// Web Audio API chiptune engine — no audio files required

type SFXName = 'click' | 'move' | 'dayEnd' | 'weekEnd' | 'arrive';

interface NoteEvent {
  freq: number;
  time: number;
  duration: number;
}

class AudioSystem {
  private ctx: AudioContext | null = null;
  private bgmNodes: AudioNode[] = [];
  private bgmScheduleId: ReturnType<typeof setTimeout> | null = null;
  private muted = false;
  private bgmPlaying = false;
  private masterGain: GainNode | null = null;

  // Note frequencies
  private readonly NOTES: Record<string, number> = {
    G3: 196.00,
    A3: 220.00,
    B3: 246.94,
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    G5: 784.00,
  };

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 0.3;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playNote(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'square',
    gainValue = 0.15
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainValue, startTime + 0.01);
    gain.gain.linearRampToValueAtTime(gainValue * 0.7, startTime + duration * 0.5);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    if (this.masterGain) {
      gain.connect(this.masterGain);
    } else {
      gain.connect(ctx.destination);
    }

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private scheduleBGMLoop(startTime: number): void {
    const ctx = this.ensureContext();
    if (!this.bgmPlaying) return;

    const N = this.NOTES;
    // Bouncy 16-note major melody at ~120bpm (each note = 0.25s)
    const melody: NoteEvent[] = [
      { freq: N.C4, time: 0,    duration: 0.22 },
      { freq: N.E4, time: 0.25, duration: 0.22 },
      { freq: N.G4, time: 0.50, duration: 0.22 },
      { freq: N.E4, time: 0.75, duration: 0.22 },
      { freq: N.C4, time: 1.00, duration: 0.22 },
      { freq: N.D4, time: 1.25, duration: 0.22 },
      { freq: N.F4, time: 1.50, duration: 0.22 },
      { freq: N.A4, time: 1.75, duration: 0.22 },
      { freq: N.G4, time: 2.00, duration: 0.22 },
      { freq: N.E4, time: 2.25, duration: 0.22 },
      { freq: N.C4, time: 2.50, duration: 0.22 },
      { freq: N.G3, time: 2.75, duration: 0.22 },
      { freq: N.A3, time: 3.00, duration: 0.22 },
      { freq: N.C4, time: 3.25, duration: 0.22 },
      { freq: N.E4, time: 3.50, duration: 0.22 },
      { freq: N.G4, time: 3.75, duration: 0.44 },
    ];

    // Bass line (lower octave, triangle wave)
    const bass: NoteEvent[] = [
      { freq: N.C4 / 2, time: 0,    duration: 0.48 },
      { freq: N.G3,     time: 0.50, duration: 0.48 },
      { freq: N.A3,     time: 1.00, duration: 0.48 },
      { freq: N.G3,     time: 1.50, duration: 0.48 },
      { freq: N.C4 / 2, time: 2.00, duration: 0.48 },
      { freq: N.G3,     time: 2.50, duration: 0.48 },
      { freq: N.A3,     time: 3.00, duration: 0.48 },
      { freq: N.G3,     time: 3.50, duration: 0.48 },
    ];

    const loopDuration = 4.25; // seconds

    for (const note of melody) {
      this.playNote(ctx, note.freq, startTime + note.time, note.duration, 'square', 0.12);
    }
    for (const note of bass) {
      this.playNote(ctx, note.freq, startTime + note.time, note.duration, 'triangle', 0.08);
    }

    // Schedule next loop
    const msUntilLoop = (startTime + loopDuration - ctx.currentTime) * 1000 - 50;
    this.bgmScheduleId = setTimeout(() => {
      if (this.bgmPlaying) {
        this.scheduleBGMLoop(startTime + loopDuration);
      }
    }, Math.max(0, msUntilLoop));
  }

  playBGM(): void {
    if (this.bgmPlaying) return;
    const ctx = this.ensureContext();
    this.bgmPlaying = true;
    this.scheduleBGMLoop(ctx.currentTime + 0.1);
  }

  stopBGM(): void {
    this.bgmPlaying = false;
    if (this.bgmScheduleId !== null) {
      clearTimeout(this.bgmScheduleId);
      this.bgmScheduleId = null;
    }
  }

  playSFX(name: SFXName): void {
    if (this.muted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    switch (name) {
      case 'click':
        this.playNote(ctx, 880, now, 0.05, 'square', 0.2);
        break;

      case 'move':
        this.playNote(ctx, 440, now,        0.08, 'square', 0.18);
        this.playNote(ctx, 660, now + 0.09, 0.08, 'square', 0.18);
        break;

      case 'arrive':
        this.playNote(ctx, 523.25, now,        0.1, 'square', 0.18);
        this.playNote(ctx, 659.25, now + 0.11, 0.1, 'square', 0.18);
        this.playNote(ctx, 784.00, now + 0.22, 0.15, 'square', 0.2);
        break;

      case 'dayEnd': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(220, now + 0.3);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);
        else gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'weekEnd':
        this.playNote(ctx, 523.25, now,        0.15, 'triangle', 0.2);
        this.playNote(ctx, 659.25, now + 0.16, 0.15, 'triangle', 0.2);
        this.playNote(ctx, 784.00, now + 0.32, 0.15, 'triangle', 0.2);
        this.playNote(ctx, 1046.5, now + 0.48, 0.3,  'triangle', 0.2);
        break;

      default:
        break;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.3;
    }
    if (!muted && !this.bgmPlaying) {
      // BGM will be started by the scene
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  isInitialized(): boolean {
    return this.ctx !== null;
  }
}

// Singleton
export const audioSystem = new AudioSystem();
