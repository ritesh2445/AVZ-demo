// ========================================================
// AUTHENTIC ACOUSTIC GUITAR PHYSICAL SYNTHESIS ENGINE
// Physical nylon & steel string acoustics, dreadnought body cavity,
// dedicated per-frame guitar tones, and fast-paced arpeggio queue.
// ========================================================

let guitarCtx = null;
let isMelodyPlaying = false;
let loopTimer = null;
let activeGains = [];

export function getGuitarContext() {
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
 * a sharp 3.5ms pick attack, and dreadnought wooden body cavity resonance (235 Hz).
 */
export function pluckString(freq, startTime = null, duration = 2.0, volume = 0.08) {
  const ctx = getGuitarContext();
  if (!ctx) return;

  try {
    const t = startTime !== null ? startTime : ctx.currentTime;

    // 1. Master string gain envelope
    const stringGain = ctx.createGain();
    stringGain.gain.setValueAtTime(0.0001, t);
    // Instant nylon/steel pick attack impulse (3.5ms)
    stringGain.gain.linearRampToValueAtTime(volume, t + 0.0035);
    // Natural acoustic guitar string decay
    stringGain.gain.exponentialRampToValueAtTime(volume * 0.42, t + 0.28);
    stringGain.gain.exponentialRampToValueAtTime(0.00001, t + duration);

    // 2. Dreadnought wooden acoustic soundboard & body resonator (235 Hz bandpass cavity)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.setValueAtTime(235, t);
    bodyFilter.Q.setValueAtTime(1.85, t);

    // 3. String harmonic damping filter (treble overtones fade faster than fundamental)
    const dampingFilter = ctx.createBiquadFilter();
    dampingFilter.type = 'lowpass';
    dampingFilter.frequency.setValueAtTime(Math.min(4800, freq * 7.5), t);
    dampingFilter.frequency.exponentialRampToValueAtTime(Math.max(140, freq * 1.35), t + duration);

    // 4. Multi-harmonic string oscillators (fundamental + steel string overtones)
    const harmonics = [
      { mult: 1.0, type: 'triangle', gain: 0.72 },
      { mult: 2.0, type: 'sine',     gain: 0.38 },
      { mult: 3.0, type: 'sine',     gain: 0.20 },
      { mult: 4.0, type: 'sine',     gain: 0.10 }
    ];

    harmonics.forEach(({ mult, type, gain: hGain }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = type;
      // Micro-detuning creates realistic acoustic air & wood warmth
      const detuneCents = (Math.random() - 0.5) * 3.8;
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
    // Ignore audio context errors
  }
}

/**
 * 21 Distinct Harmonic Acoustic Guitar Notes across the Fretboard
 * Every museum frame gets its own distinct, resonant acoustic guitar pitch!
 */
export const FRAME_GUITAR_NOTES = [
  { note: 'E2',  freq: 82.41,  dur: 2.5, vol: 0.12 }, // Deep acoustic 6th string
  { note: 'G2',  freq: 98.00,  dur: 2.4, vol: 0.11 },
  { note: 'A2',  freq: 110.00, dur: 2.3, vol: 0.11 }, // Open 5th string
  { note: 'B2',  freq: 123.47, dur: 2.2, vol: 0.10 },
  { note: 'C3',  freq: 130.81, dur: 2.2, vol: 0.10 },
  { note: 'D3',  freq: 146.83, dur: 2.1, vol: 0.10 }, // Open 4th string
  { note: 'E3',  freq: 164.81, dur: 2.1, vol: 0.09 },
  { note: 'G3',  freq: 196.00, dur: 2.0, vol: 0.09 }, // Open 3rd string
  { note: 'A3',  freq: 220.00, dur: 2.0, vol: 0.09 },
  { note: 'B3',  freq: 246.94, dur: 1.9, vol: 0.09 }, // Open 2nd string
  { note: 'C4',  freq: 261.63, dur: 1.9, vol: 0.09 },
  { note: 'D4',  freq: 293.66, dur: 1.8, vol: 0.08 },
  { note: 'E4',  freq: 329.63, dur: 1.8, vol: 0.08 }, // Open 1st string
  { note: 'F#4', freq: 369.99, dur: 1.7, vol: 0.08 },
  { note: 'G4',  freq: 392.00, dur: 1.7, vol: 0.08 },
  { note: 'A4',  freq: 440.00, dur: 1.6, vol: 0.08 },
  { note: 'B4',  freq: 493.88, dur: 1.6, vol: 0.07 },
  { note: 'C5',  freq: 523.25, dur: 1.5, vol: 0.07 },
  { note: 'D5',  freq: 587.33, dur: 1.5, vol: 0.07 },
  { note: 'E5',  freq: 659.25, dur: 1.4, vol: 0.07 }, // High resonant chime
  { note: 'G5',  freq: 783.99, dur: 1.4, vol: 0.06 }  // Sparkling harmonic bell
];

// Arpeggio & Melodic cascade queue timeline
let nextQueueTime = 0;
let arpeggioIndex = 0;

/**
 * Tapping on any random frame plays that specific frame's distinct guitar string sound!
 * Each frame index maps to a unique harmonic guitar tone across the fretboard.
 */
export function playFrameGuitarString(frameIndex = 0, velocity = 1, soundEnabled = true) {
  if (soundEnabled === false || typeof window === 'undefined') return;

  const ctx = getGuitarContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const safeIdx = Math.abs(frameIndex) % FRAME_GUITAR_NOTES.length;
  const noteObj = FRAME_GUITAR_NOTES[safeIdx];

  const dynamicVolume = Math.min(0.14, Math.max(0.06, (noteObj.vol || 0.08) * Math.abs(velocity)));

  // Pluck this frame's dedicated string immediately
  pluckString(noteObj.freq, now, noteObj.dur, dynamicVolume);

  // Synchronize subsequent scroll arpeggios to begin from this frame's pitch!
  arpeggioIndex = safeIdx;
  nextQueueTime = Math.max(now + 0.075, nextQueueTime);
}

/**
 * When user scrolls horizontally:
 * Queues multiple acoustic guitar strings in rapid succession to create a fast-paced melody!
 * - Direction +1 (scrolling right): Ascending melodic run
 * - Direction -1 (scrolling left): Descending melodic run
 * - Velocity controls tempo (48ms–75ms spacing) and finger-strum dynamics.
 */
export function queueGuitarScrollMelody(velocity = 1, direction = 1, soundEnabled = true) {
  if (soundEnabled === false || typeof window === 'undefined') return;

  const ctx = getGuitarContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Reset queue if it has fallen behind real-time
  if (nextQueueTime < now) {
    nextQueueTime = now;
  }

  // Cap lookahead to ~320ms so audio never lags behind the user's hand
  if (nextQueueTime - now > 0.32) {
    return;
  }

  // Dynamic note intervals: higher velocity = tighter, faster-paced melody (48ms down to 75ms)
  const clampedVel = Math.max(0.6, Math.min(3.8, Math.abs(velocity)));
  const noteSpacing = Math.max(0.048, 0.082 - clampedVel * 0.012);
  const dynamicVolume = Math.min(0.12, 0.045 + clampedVel * 0.018);

  // Determine number of strings to enqueue per scroll tick (1 to 3 strings)
  const notesToQueue = clampedVel > 2.2 ? 3 : clampedVel > 1.1 ? 2 : 1;

  for (let k = 0; k < notesToQueue; k++) {
    if (nextQueueTime - now > 0.35) break;

    // Advance along the fretboard in the scroll direction
    if (direction >= 0) {
      arpeggioIndex = (arpeggioIndex + 1) % FRAME_GUITAR_NOTES.length;
    } else {
      arpeggioIndex = (arpeggioIndex - 1 + FRAME_GUITAR_NOTES.length) % FRAME_GUITAR_NOTES.length;
    }

    const noteObj = FRAME_GUITAR_NOTES[arpeggioIndex];
    pluckString(noteObj.freq, nextQueueTime, noteObj.dur, dynamicVolume * (noteObj.vol / 0.08));

    nextQueueTime += noteSpacing;
  }
}

/**
 * Backward compatibility helper for general interactions.
 */
export function playInteractiveGuitarString(velocity = 1, soundEnabled = true) {
  queueGuitarScrollMelody(velocity, 1, soundEnabled);
}

/**
 * 6-Tone Soulful Acoustic Guitar Melody (Fingerpicked E-minor motif)
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
