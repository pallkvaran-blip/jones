// Web Audio API chiptune engine — no audio files required

type SFXName = 'click' | 'move' | 'dayEnd' | 'weekEnd' | 'arrive'
  | 'eventGood' | 'eventBad' | 'levelUp' | 'demotion' | 'danger'
  | 'gameWin' | 'gameLose';

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
  private bgmGain: GainNode | null = null;   // BGM-only gain, ducked during SFX
  private sfxGain: GainNode | null = null;   // SFX-only gain
  private currentMood: 'normal' | 'danger' = 'normal';
  private normalTrackIndex = 0;
  private dangerTrackIndex = 0;

  // Note frequencies
  private readonly NOTES: Record<string, number> = {
    E2: 82.41,
    F2: 87.31,
    C3: 130.81,
    E3: 164.81,
    F3: 174.61,
    G3: 196.00,
    A3: 220.00,
    B3: 246.94,
    C4: 261.63,
    D4: 293.66,
    Eb4: 311.13,
    E4: 329.63,
    F4: 349.23,
    G4: 392.00,
    Ab4: 415.30,
    A4: 440.00,
    Bb4: 466.16,
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

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 1.0;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 1.0;
      this.sfxGain.connect(this.masterGain);
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
    gainValue = 0.15,
    target?: AudioNode,
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
    gain.connect(target ?? this.sfxGain ?? this.masterGain ?? ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  /** Temporarily lower BGM volume so SFX can be heard clearly, then restore. */
  private duckBGM(durationSecs: number): void {
    if (!this.bgmGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
    this.bgmGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    this.bgmGain.gain.setValueAtTime(0.08, now + Math.max(durationSecs - 0.15, 0.1));
    this.bgmGain.gain.linearRampToValueAtTime(1.0, now + durationSecs + 0.1);
  }

  private scheduleBGMLoop(startTime: number): void {
    const ctx = this.ensureContext();
    if (!this.bgmPlaying) return;

    const N = this.NOTES;

    type Track = { melody: NoteEvent[]; bass: NoteEvent[]; oscType: OscillatorType; gain: number };

    const normalTracks: Track[] = [
      // 0 — original bouncy C major arpeggio
      {
        oscType: 'square', gain: 0.12,
        melody: [
          { freq: N.C4, time: 0,    duration: 0.22 }, { freq: N.E4, time: 0.25, duration: 0.22 },
          { freq: N.G4, time: 0.50, duration: 0.22 }, { freq: N.E4, time: 0.75, duration: 0.22 },
          { freq: N.C4, time: 1.00, duration: 0.22 }, { freq: N.D4, time: 1.25, duration: 0.22 },
          { freq: N.F4, time: 1.50, duration: 0.22 }, { freq: N.A4, time: 1.75, duration: 0.22 },
          { freq: N.G4, time: 2.00, duration: 0.22 }, { freq: N.E4, time: 2.25, duration: 0.22 },
          { freq: N.C4, time: 2.50, duration: 0.22 }, { freq: N.G3, time: 2.75, duration: 0.22 },
          { freq: N.A3, time: 3.00, duration: 0.22 }, { freq: N.C4, time: 3.25, duration: 0.22 },
          { freq: N.E4, time: 3.50, duration: 0.22 }, { freq: N.G4, time: 3.75, duration: 0.44 },
        ],
        bass: [
          { freq: N.C4 / 2, time: 0,    duration: 0.48 }, { freq: N.G3,     time: 0.50, duration: 0.48 },
          { freq: N.A3,     time: 1.00, duration: 0.48 }, { freq: N.G3,     time: 1.50, duration: 0.48 },
          { freq: N.C4 / 2, time: 2.00, duration: 0.48 }, { freq: N.G3,     time: 2.50, duration: 0.48 },
          { freq: N.A3,     time: 3.00, duration: 0.48 }, { freq: N.G3,     time: 3.50, duration: 0.48 },
        ],
      },
      // 1 — G major stepwise, triangle wave (softer, lyrical)
      {
        oscType: 'triangle', gain: 0.14,
        melody: [
          { freq: N.G3, time: 0,    duration: 0.22 }, { freq: N.B3, time: 0.25, duration: 0.22 },
          { freq: N.D4, time: 0.50, duration: 0.22 }, { freq: N.G4, time: 0.75, duration: 0.22 },
          { freq: N.E4, time: 1.00, duration: 0.22 }, { freq: N.D4, time: 1.25, duration: 0.22 },
          { freq: N.B3, time: 1.50, duration: 0.22 }, { freq: N.G3, time: 1.75, duration: 0.22 },
          { freq: N.A3, time: 2.00, duration: 0.22 }, { freq: N.C4, time: 2.25, duration: 0.22 },
          { freq: N.E4, time: 2.50, duration: 0.22 }, { freq: N.A4, time: 2.75, duration: 0.22 },
          { freq: N.G4, time: 3.00, duration: 0.22 }, { freq: N.E4, time: 3.25, duration: 0.22 },
          { freq: N.D4, time: 3.50, duration: 0.22 }, { freq: N.B3, time: 3.75, duration: 0.44 },
        ],
        bass: [
          { freq: N.G3 / 2, time: 0,    duration: 0.48 }, { freq: N.D4,     time: 0.50, duration: 0.48 },
          { freq: N.G3 / 2, time: 1.00, duration: 0.48 }, { freq: N.D4,     time: 1.50, duration: 0.48 },
          { freq: N.A3 / 2, time: 2.00, duration: 0.48 }, { freq: N.E4,     time: 2.50, duration: 0.48 },
          { freq: N.A3 / 2, time: 3.00, duration: 0.48 }, { freq: N.D4,     time: 3.50, duration: 0.48 },
        ],
      },
      // 2 — C major ascending scale motif, square wave, building feel
      {
        oscType: 'square', gain: 0.11,
        melody: [
          { freq: N.E4, time: 0,    duration: 0.22 }, { freq: N.F4, time: 0.25, duration: 0.22 },
          { freq: N.G4, time: 0.50, duration: 0.22 }, { freq: N.A4, time: 0.75, duration: 0.22 },
          { freq: N.G4, time: 1.00, duration: 0.22 }, { freq: N.F4, time: 1.25, duration: 0.22 },
          { freq: N.E4, time: 1.50, duration: 0.22 }, { freq: N.D4, time: 1.75, duration: 0.22 },
          { freq: N.C4, time: 2.00, duration: 0.22 }, { freq: N.D4, time: 2.25, duration: 0.22 },
          { freq: N.E4, time: 2.50, duration: 0.22 }, { freq: N.F4, time: 2.75, duration: 0.22 },
          { freq: N.G4, time: 3.00, duration: 0.22 }, { freq: N.A4, time: 3.25, duration: 0.22 },
          { freq: N.B4, time: 3.50, duration: 0.22 }, { freq: N.C5, time: 3.75, duration: 0.44 },
        ],
        bass: [
          { freq: N.C4 / 2, time: 0,    duration: 0.48 }, { freq: N.G3,     time: 0.50, duration: 0.48 },
          { freq: N.F3,     time: 1.00, duration: 0.48 }, { freq: N.G3,     time: 1.50, duration: 0.48 },
          { freq: N.C4 / 2, time: 2.00, duration: 0.48 }, { freq: N.G3,     time: 2.50, duration: 0.48 },
          { freq: N.F3,     time: 3.00, duration: 0.48 }, { freq: N.G3,     time: 3.50, duration: 0.48 },
        ],
      },
      // 3 — F major arpeggio, sine wave (warmest, most mellow)
      {
        oscType: 'sine', gain: 0.16,
        melody: [
          { freq: N.F4,  time: 0,    duration: 0.22 }, { freq: N.A4,  time: 0.25, duration: 0.22 },
          { freq: N.C5,  time: 0.50, duration: 0.22 }, { freq: N.A4,  time: 0.75, duration: 0.22 },
          { freq: N.F4,  time: 1.00, duration: 0.22 }, { freq: N.G4,  time: 1.25, duration: 0.22 },
          { freq: N.Bb4, time: 1.50, duration: 0.22 }, { freq: N.D5,  time: 1.75, duration: 0.22 },
          { freq: N.C5,  time: 2.00, duration: 0.22 }, { freq: N.A4,  time: 2.25, duration: 0.22 },
          { freq: N.G4,  time: 2.50, duration: 0.22 }, { freq: N.E4,  time: 2.75, duration: 0.22 },
          { freq: N.F4,  time: 3.00, duration: 0.22 }, { freq: N.C4,  time: 3.25, duration: 0.22 },
          { freq: N.D4,  time: 3.50, duration: 0.22 }, { freq: N.F4,  time: 3.75, duration: 0.44 },
        ],
        bass: [
          { freq: N.F2,      time: 0,    duration: 0.48 }, { freq: N.C4,      time: 0.50, duration: 0.48 },
          { freq: N.F2,      time: 1.00, duration: 0.48 }, { freq: N.Bb4 / 2, time: 1.50, duration: 0.48 },
          { freq: N.F2,      time: 2.00, duration: 0.48 }, { freq: N.C4,      time: 2.50, duration: 0.48 },
          { freq: N.F2,      time: 3.00, duration: 0.48 }, { freq: N.C4,      time: 3.50, duration: 0.48 },
        ],
      },
    ];

    const dangerTracks: Track[] = [
      // 0 — original tense Cm arpeggio
      {
        oscType: 'square', gain: 0.12,
        melody: [
          { freq: N.C4,  time: 0,    duration: 0.22 }, { freq: N.Eb4, time: 0.25, duration: 0.22 },
          { freq: N.G4,  time: 0.50, duration: 0.22 }, { freq: N.Bb4, time: 0.75, duration: 0.22 },
          { freq: N.G4,  time: 1.00, duration: 0.22 }, { freq: N.Eb4, time: 1.25, duration: 0.22 },
          { freq: N.C4,  time: 1.50, duration: 0.22 }, { freq: N.Eb4, time: 1.75, duration: 0.22 },
          { freq: N.G4,  time: 2.00, duration: 0.22 }, { freq: N.Bb4, time: 2.25, duration: 0.22 },
          { freq: N.Ab4, time: 2.50, duration: 0.22 }, { freq: N.G4,  time: 2.75, duration: 0.22 },
          { freq: N.F4,  time: 3.00, duration: 0.22 }, { freq: N.Eb4, time: 3.25, duration: 0.22 },
          { freq: N.D4,  time: 3.50, duration: 0.22 }, { freq: N.C4,  time: 3.75, duration: 0.44 },
        ],
        bass: [
          { freq: N.C4 / 2, time: 0,    duration: 0.48 }, { freq: N.G3,     time: 0.50, duration: 0.48 },
          { freq: N.A3,     time: 1.00, duration: 0.48 }, { freq: N.G3,     time: 1.50, duration: 0.48 },
          { freq: N.C4 / 2, time: 2.00, duration: 0.48 }, { freq: N.G3,     time: 2.50, duration: 0.48 },
          { freq: N.A3,     time: 3.00, duration: 0.48 }, { freq: N.G3,     time: 3.50, duration: 0.48 },
        ],
      },
      // 1 — Am descend-then-surge, more frantic feel
      {
        oscType: 'square', gain: 0.12,
        melody: [
          { freq: N.A4,  time: 0,    duration: 0.22 }, { freq: N.G4,  time: 0.25, duration: 0.22 },
          { freq: N.F4,  time: 0.50, duration: 0.22 }, { freq: N.Eb4, time: 0.75, duration: 0.22 },
          { freq: N.D4,  time: 1.00, duration: 0.22 }, { freq: N.Eb4, time: 1.25, duration: 0.22 },
          { freq: N.F4,  time: 1.50, duration: 0.22 }, { freq: N.G4,  time: 1.75, duration: 0.22 },
          { freq: N.A4,  time: 2.00, duration: 0.22 }, { freq: N.Bb4, time: 2.25, duration: 0.22 },
          { freq: N.Ab4, time: 2.50, duration: 0.22 }, { freq: N.G4,  time: 2.75, duration: 0.22 },
          { freq: N.F4,  time: 3.00, duration: 0.22 }, { freq: N.Eb4, time: 3.25, duration: 0.22 },
          { freq: N.D4,  time: 3.50, duration: 0.22 }, { freq: N.A3,  time: 3.75, duration: 0.44 },
        ],
        bass: [
          { freq: N.A3 / 2, time: 0,    duration: 0.48 }, { freq: N.E4,      time: 0.50, duration: 0.48 },
          { freq: N.D4 / 2, time: 1.00, duration: 0.48 }, { freq: N.E4,      time: 1.50, duration: 0.48 },
          { freq: N.A3 / 2, time: 2.00, duration: 0.48 }, { freq: N.Bb4 / 2, time: 2.50, duration: 0.48 },
          { freq: N.A3 / 2, time: 3.00, duration: 0.48 }, { freq: N.E4,      time: 3.50, duration: 0.48 },
        ],
      },
    ];

    const isDanger = this.currentMood === 'danger';
    const tracks = isDanger ? dangerTracks : normalTracks;
    const track = tracks[isDanger ? this.dangerTrackIndex : this.normalTrackIndex];
    const loopDuration = 4.25;

    const bgm = this.bgmGain ?? this.masterGain ?? ctx.destination
    for (const note of track.melody) {
      this.playNote(ctx, note.freq, startTime + note.time, note.duration, track.oscType, track.gain, bgm);
    }
    for (const note of track.bass) {
      this.playNote(ctx, note.freq, startTime + note.time, note.duration, 'triangle', 0.08, bgm);
    }

    // Advance to next track after this loop completes
    const msUntilLoop = (startTime + loopDuration - ctx.currentTime) * 1000 - 50;
    this.bgmScheduleId = setTimeout(() => {
      if (this.bgmPlaying) {
        if (this.currentMood === 'normal') {
          this.normalTrackIndex = (this.normalTrackIndex + 1) % normalTracks.length;
        } else {
          this.dangerTrackIndex = (this.dangerTrackIndex + 1) % dangerTracks.length;
        }
        this.scheduleBGMLoop(startTime + loopDuration);
      }
    }, Math.max(0, msUntilLoop));
  }

  playBGM(mood: 'normal' | 'danger' = 'normal'): void {
    if (this.bgmPlaying && this.currentMood === mood) return;
    // Stop current BGM if playing with a different mood
    this.stopBGM();
    this.currentMood = mood;
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

  setDangerMode(danger: boolean): void {
    this.playBGM(danger ? 'danger' : 'normal');
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
        this.duckBGM(1.1);
        this.playNote(ctx, 523.25, now,        0.15, 'triangle', 0.2);
        this.playNote(ctx, 659.25, now + 0.16, 0.15, 'triangle', 0.2);
        this.playNote(ctx, 784.00, now + 0.32, 0.15, 'triangle', 0.2);
        this.playNote(ctx, 1046.5, now + 0.48, 0.3,  'triangle', 0.2);
        break;

      case 'eventGood':
        // Bright ascending 3-note chime: C5 → E5 → G5, sine wave
        this.duckBGM(0.55);
        this.playNote(ctx, this.NOTES.C5, now,        0.08, 'sine', 0.18);
        this.playNote(ctx, this.NOTES.E5, now + 0.09, 0.08, 'sine', 0.18);
        this.playNote(ctx, this.NOTES.G5, now + 0.18, 0.12, 'sine', 0.18);
        break;

      case 'eventBad':
        // Low descending thud: G3 → E3 → C3, triangle wave
        this.duckBGM(0.55);
        this.playNote(ctx, this.NOTES.G3, now,        0.06, 'triangle', 0.2);
        this.playNote(ctx, this.NOTES.E3, now + 0.07, 0.06, 'triangle', 0.2);
        this.playNote(ctx, this.NOTES.C3, now + 0.14, 0.12, 'triangle', 0.2);
        break;

      case 'levelUp':
        // Ascending arpeggio: C4→E4→G4→C5, small gap between notes
        this.duckBGM(0.7);
        this.playNote(ctx, this.NOTES.C4, now,        0.1, 'square', 0.15);
        this.playNote(ctx, this.NOTES.E4, now + 0.12, 0.1, 'square', 0.15);
        this.playNote(ctx, this.NOTES.G4, now + 0.24, 0.1, 'square', 0.15);
        this.playNote(ctx, this.NOTES.C5, now + 0.36, 0.1, 'square', 0.15);
        break;

      case 'demotion':
        // Descending sad tones: C4→A3→F3, triangle wave
        this.duckBGM(0.65);
        this.playNote(ctx, this.NOTES.C4, now,        0.12, 'triangle', 0.18);
        this.playNote(ctx, this.NOTES.A3, now + 0.13, 0.12, 'triangle', 0.18);
        this.playNote(ctx, this.NOTES.F3, now + 0.26, 0.12, 'triangle', 0.18);
        break;

      case 'danger':
        // Short tense pulse: rapid low notes E2→F2→E2, square wave
        this.playNote(ctx, this.NOTES.E2, now,        0.05, 'square', 0.12);
        this.playNote(ctx, this.NOTES.F2, now + 0.06, 0.05, 'square', 0.12);
        this.playNote(ctx, this.NOTES.E2, now + 0.12, 0.05, 'square', 0.12);
        break;

      case 'gameWin':
        // Triumphant 5-note fanfare: C4→E4→G4→C5→E5, square wave
        this.duckBGM(1.2);
        this.playNote(ctx, this.NOTES.C4, now,        0.15, 'square', 0.2);
        this.playNote(ctx, this.NOTES.E4, now + 0.16, 0.15, 'square', 0.2);
        this.playNote(ctx, this.NOTES.G4, now + 0.32, 0.15, 'square', 0.2);
        this.playNote(ctx, this.NOTES.C5, now + 0.48, 0.15, 'square', 0.2);
        this.playNote(ctx, this.NOTES.E5, now + 0.64, 0.15, 'square', 0.2);
        break;

      case 'gameLose': {
        // 4 slow descending notes with a slight delay/reverb effect
        this.duckBGM(1.8);
        const dest = this.masterGain ?? ctx.destination;

        // Create a tiny delay node for reverb effect
        const delayNode = ctx.createDelay(1.0);
        delayNode.delayTime.value = 0.08;

        const feedbackGain = ctx.createGain();
        feedbackGain.gain.value = 0.3;

        // Delay feedback loop
        delayNode.connect(feedbackGain);
        feedbackGain.connect(delayNode);
        delayNode.connect(dest);

        const playDelayedNote = (freq: number, startTime: number, duration: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
          gain.gain.linearRampToValueAtTime(0.18 * 0.7, startTime + duration * 0.5);
          gain.gain.linearRampToValueAtTime(0, startTime + duration);
          osc.connect(gain);
          gain.connect(dest);
          gain.connect(delayNode);
          osc.start(startTime);
          osc.stop(startTime + duration + 0.05);
        };

        playDelayedNote(this.NOTES.G4, now,        0.25);
        playDelayedNote(this.NOTES.E4, now + 0.27, 0.25);
        playDelayedNote(this.NOTES.C4, now + 0.54, 0.25);
        playDelayedNote(this.NOTES.A3, now + 0.81, 0.25);
        break;
      }

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
