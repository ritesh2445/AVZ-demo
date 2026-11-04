// ========================================================
// AUTHENTIC ACOUSTIC GUITAR PHYSICAL SYNTHESIS ENGINE
// Realistic acoustic guitar strings, interactive strumming,
// and 6-tone fingerpicked melody.
// ========================================================

let guitarCtx = null;
let isMelodyPlaying = false;
let loopTimer = null;
let activeGains = [];

function getGuitarContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!guitarCtx) {
    guitarCtx = new AudioContextClass();
  }
  if (guitarCtx.state === 'suspended') {
    guitarCtx.resume().catch(() => {});
  }
  return guitarCtx;
}

/**
 * Synthesizes an authentic acoustic guitar string pluck:
 * Combines fundamental string frequency, steel/nylon harmonics,
 * a sharp pick impulse, and dreadnought wooden body cavity resonance.
 */
export function pluckString(freq, startTime = null, duration = 2.0, volume = 0.08) {
  const ctx = getGuitarContext();
  if (!ctx) return;

  try {
    const t = startTime !== null ? startTime : ctx.currentTime;

    // 1. Master string gain envelope
    const stringGain = ctx.createGain();
    stringGain.gain.setValueAtTime(0.0001, t);
    // Instant pick attack (3.5ms)
    stringGain.gain.linearRampToValueAtTime(volume, t + 0.0035);
    // Natural acoustic guitar string decay
    stringGain.gain.exponentialRampToValueAtTime(volume * 0.38, t + 0.3);
    stringGain.gain.exponentialRampToValueAtTime(0.00001, t + duration);

    // 2. Dreadnought wooden acoustic soundboard & body resonator
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.setValueAtTime(235, t);
    bodyFilter.Q.setValueAtTime(1.9, t);

    // 3. String harmonic damping filter (treble overtones fade faster than fundamental)
    const dampingFilter = ctx.createBiquadFilter();
    dampingFilter.type = 'lowpass';
    dampingFilter.frequency.setValueAtTime(Math.min(4200, freq * 7), t);
    dampingFilter.frequency.exponentialRampToValueAtTime(Math.max(130, freq * 1.3), t + duration);

    // 4. Multi-harmonic string oscillators (fundamental + steel string overtones)
    const harmonics = [
      { mult: 1.0, type: 'triangle', gain: 0.72 },
      { mult: 2.0, type: 'sine',     gain: 0.38 },
      { mult: 3.0, type: 'sine',     gain: 0.19 },
      { mult: 4.0, type: 'sine',     gain: 0.09 }
    ];

    harmonics.forEach(({ mult, type, gain: hGain }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = type;
      // Micro-detuning gives realistic acoustic wood air
      const detuneCents = (Math.random() - 0.5) * 3.5;
      osc.frequency.setValueAtTime(freq * mult, t);
      osc.detune.setValueAtTime(detuneCents, t);

      oscGain.gain.setValueAtTime(hGain, t);

      osc.connect(oscGain);
      oscGain.connect(dampingFilter);

      osc.start(t);
      osc.stop(t + duration + 0.05);
    });

    dampingFilter.connect(bodyFilter);
    bodyFilter.connect(stringGain);
    stringGain.connect(ctx.destination);

    activeGains.push(stringGain);

    setTimeout(() => {
      activeGains = activeGains.filter((g) => g !== stringGain);
    }, (duration + 0.2) * 1000);
  } catch (err) {
    // Ignore audio errors
  }
}

// Interactive acoustic guitar strings cycling sequence
// Realistic open strings & lyrical fretted tones
const INTERACTIVE_GUITAR_STRINGS = [
  { freq: 110.00, dur: 2.2 }, // Low A2 string
  { freq: 146.83, dur: 2.0 }, // D3 string
  { freq: 196.00, dur: 2.0 }, // G3 string
  { freq: 246.94, dur: 1.9 }, // B3 string
  { freq: 329.63, dur: 1.9 }, // High E4 string
  { freq: 392.00, dur: 2.2 }, // G4 chime
  { freq: 493.88, dur: 2.4 }, // B4 overtone
  { freq: 587.33, dur: 2.5 }, // D5 bell
  { freq: 493.88, dur: 2.0 }, // B4
  { freq: 392.00, dur: 1.9 }, // G4
  { freq: 329.63, dur: 2.2 }, // E4
  { freq: 246.94, dur: 2.4 }, // B3
  { freq: 196.00, dur: 2.2 }, // G3
  { freq: 146.83, dur: 2.4 }  // D3
];

let interactiveStringIndex = 0;
let lastInteractivePluckTime = 0;

/**
 * Plays a realistic guitar string pluck on interaction (scroll, drag, move).
 * With every scroll/movement tick, cycles to the next guitar string in the progression!
 * The faster the interaction, the more dynamic the acoustic strums.
 */
export function playInteractiveGuitarString(velocity = 1, soundEnabled = true) {
  if (!soundEnabled || typeof window === 'undefined') return;

  const ctx = getGuitarContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Anti-spam debouncing (75ms): prevents digital clipping while allowing rapid fingerstyle strumming
  if (now - lastInteractivePluckTime < 0.075) {
    return;
  }
  lastInteractivePluckTime = now;

  const stringObj = INTERACTIVE_GUITAR_STRINGS[interactiveStringIndex];
  interactiveStringIndex = (interactiveStringIndex + 1) % INTERACTIVE_GUITAR_STRINGS.length;

  const dynamicVolume = Math.min(0.12, Math.max(0.045, 0.05 * Math.abs(velocity)));
  pluckString(stringObj.freq, now, stringObj.dur, dynamicVolume);
}

/**
 * 6-Tone Soulful Acoustic Guitar Melody (Fingerpicked E-minor motif):
 * Tone 1: E3 (164.81 Hz)
 * Tone 2: B3 (246.94 Hz)
 * Tone 3: E4 (329.63 Hz)
 * Tone 4: G4 (392.00 Hz)
 * Tone 5: D5 (587.33 Hz)
 * Tone 6: B4 (493.88 Hz)
 */
const GUITAR_MELODY_NOTES = [
  { freq: 164.81, delay: 0.00, dur: 2.4, vol: 0.09 }, // E3
  { freq: 246.94, delay: 0.38, dur: 2.2, vol: 0.07 }, // B3
  { freq: 329.63, delay: 0.76, dur: 2.2, vol: 0.08 }, // E4
  { freq: 392.00, delay: 1.16, dur: 2.3, vol: 0.08 }, // G4
  { freq: 587.33, delay: 1.62, dur: 2.5, vol: 0.09 }, // D5
  { freq: 493.88, delay: 2.15, dur: 2.8, vol: 0.08 }, // B4
];

const PHRASE_DURATION_MS = 4800;

function playPhrase() {
  if (!isMelodyPlaying) return;
  const ctx = getGuitarContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  GUITAR_MELODY_NOTES.forEach(({ freq, delay, dur, vol }) => {
    pluckString(freq, now + delay, dur, vol);
  });

  loopTimer = setTimeout(() => {
    if (isMelodyPlaying) {
      playPhrase();
    }
  }, PHRASE_DURATION_MS);
}

export function startGuitarMelody() {
  if (isMelodyPlaying) return;
  isMelodyPlaying = true;
  const ctx = getGuitarContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  playPhrase();
}

export function stopGuitarMelody() {
  isMelodyPlaying = false;
  if (loopTimer) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }
  const ctx = getGuitarContext();
  if (ctx && activeGains.length > 0) {
    const now = ctx.currentTime;
    activeGains.forEach((gainNode) => {
      try {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.linearRampToValueAtTime(0.00001, now + 0.3);
      } catch (e) {}
    });
  }
  activeGains = [];
}

export function isGuitarMelodyPlaying() {
  return isMelodyPlaying;
}
