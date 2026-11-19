'use client';
// Gentle, ASMR-style sound effects synthesized with the Web Audio API.
// No audio files are downloaded, so sound adds no data cost. Nothing plays until the
// visitor turns sound on (browsers also block audio before a user gesture).

export type Sfx = 'shutter' | 'tap' | 'plop' | 'whoosh' | 'stamp' | 'ding' | 'tick' | 'tok' | 'chime';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function enableSound(): boolean {
  if (typeof window === 'undefined') return false;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return false;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55; // soft overall level
    // A gentle low-pass keeps everything warm, never harsh.
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500;
    master.connect(lp).connect(ctx.destination);
  }
  void ctx.resume();
  return true;
}

export function disableSound() { void ctx?.suspend(); }

function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function tone(freq: number, { at = 0, type = 'sine' as OscillatorType, peak = 0.2, attack = 0.005, decay = 0.25, slideTo }: { at?: number; type?: OscillatorType; peak?: number; attack?: number; decay?: number; slideTo?: number } = {}) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + attack + decay);
  env(g, t, peak, attack, decay);
  o.connect(g).connect(master); o.start(t); o.stop(t + attack + decay + 0.05);
}

function noise({ at = 0, peak = 0.15, attack = 0.002, decay = 0.08, filter = 'bandpass' as BiquadFilterType, freq = 2000, q = 1, sweepTo }: { at?: number; peak?: number; attack?: number; decay?: number; filter?: BiquadFilterType; freq?: number; q?: number; sweepTo?: number } = {}) {
  if (!ctx || !master) return;
  const t = ctx.currentTime + at;
  const len = Math.ceil((attack + decay + 0.05) * ctx.sampleRate);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = filter; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + attack + decay);
  const g = ctx.createGain(); env(g, t, peak, attack, decay);
  src.connect(f).connect(g).connect(master); src.start(t);
}

export function play(s: Sfx) {
  if (!ctx || ctx.state !== 'running') return;
  switch (s) {
    case 'shutter': // two soft mechanical clicks
      noise({ freq: 3200, q: 2, peak: 0.22, decay: 0.035 });
      noise({ at: 0.07, freq: 2400, q: 2, peak: 0.16, decay: 0.05 });
      break;
    case 'tap': // a light fingertip on glass
      tone(880, { peak: 0.12, decay: 0.06, slideTo: 640 });
      break;
    case 'plop': // a pin landing on the map
      tone(520, { peak: 0.2, decay: 0.16, slideTo: 140 });
      noise({ at: 0.01, filter: 'lowpass', freq: 600, peak: 0.06, decay: 0.08 });
      break;
    case 'whoosh': // the report flying off
      noise({ filter: 'bandpass', freq: 400, sweepTo: 2600, q: 0.8, peak: 0.12, attack: 0.12, decay: 0.32 });
      break;
    case 'stamp': // a rubber stamp pressed onto paper
      tone(110, { peak: 0.32, decay: 0.18, slideTo: 60 });
      noise({ filter: 'lowpass', freq: 900, peak: 0.18, decay: 0.12 });
      break;
    case 'ding': // a soft bell: routed to the right office
      tone(1318.5, { peak: 0.1, attack: 0.004, decay: 0.9 });
      tone(1975.5, { peak: 0.04, attack: 0.004, decay: 0.6 });
      break;
    case 'tick': // a pen ticking a checkbox
      noise({ freq: 4200, q: 4, peak: 0.12, decay: 0.025 });
      break;
    case 'tok': // a gentle wooden mallet tap
      tone(330, { type: 'triangle', peak: 0.16, decay: 0.09, slideTo: 260 });
      noise({ filter: 'bandpass', freq: 1200, q: 3, peak: 0.05, decay: 0.03 });
      break;
    case 'chime': // fixed: a warm rising arpeggio
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, { at: i * 0.11, peak: 0.1, attack: 0.006, decay: 1.1 }));
      break;
  }
}
