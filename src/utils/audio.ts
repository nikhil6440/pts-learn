/**
 * Web Audio API synthesizer for Playtown Learn
 * Provides gentle, child-friendly chimes and feedback sounds without external audio assets.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTapSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // Ignore audio errors
  }
}

export function playCorrectSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Two uplifting chime notes: G5 (784Hz) then C6 (1046Hz)
    [
      { freq: 784, time: now, dur: 0.15 },
      { freq: 1046, time: now + 0.12, dur: 0.25 },
    ].forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, note.time);

      gain.gain.setValueAtTime(0.2, note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(note.time);
      osc.stop(note.time + note.dur);
    });
  } catch {
    // Ignore audio errors
  }
}

export function playIncorrectSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Gentle low bonk note
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } catch {
    // Ignore audio errors
  }
}

export function playFanfareSound(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 4 celebratory ascending notes
    const notes = [
      { freq: 523.25, time: now }, // C5
      { freq: 659.25, time: now + 0.1 }, // E5
      { freq: 783.99, time: now + 0.2 }, // G5
      { freq: 1046.5, time: now + 0.3 }, // C6
    ];

    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, n.time);

      gain.gain.setValueAtTime(0.25, n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, n.time + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(n.time);
      osc.stop(n.time + 0.35);
    });
  } catch {
    // Ignore audio errors
  }
}
