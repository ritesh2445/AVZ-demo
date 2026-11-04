// ========================================================
// AUTHENTIC ACOUSTIC GUITAR PHYSICAL SYNTHESIS ENGINE
// Warm, organic 6-tone fingerpicked acoustic guitar melody
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
 * Combines fundamental frequency, 2nd, 3rd, and 4th harmonics with
 * a sharp finger-pick transient and warm wooden acoustic body resonance.
 */
function pluckString(freq, startTime, duration = 2.2, volume = 0.08) {
  const ctx = getGuitarContext();
  if (!ctx) return;

  try {
    // 1. Master string gain node
    const stringGain = ctx.createGain();
    stringGain.gain.setValueAtTime(0.0001, startTime);
    // Instant pick attack (3ms)
    stringGain.gain.linearRampToValueAtTime(volume, startTime + 0.004);
    // Natural acoustic guitar string decay
    stringGain.gain.exponentialRampToValueAtTime(volume * 0.35, startTime + 0.35);
    stringGain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    // 2. Wooden guitar body cavity resonator (simulates dreadnought soundboard)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.setValueAtTime(240, startTime);
    bodyFilter.Q.setValueAtTime(1.8, startTime);

    // 3. High-frequency string damping filter (higher frequencies decay faster)
    const dampingFilter = ctx.createBiquadFilter();
    dampingFilter.type = 'lowpass';
    dampingFilter.frequency.setValueAtTime(Math.min(3800, freq * 7), startTime);
    dampingFilter.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 1.2), startTime + duration);

    // 4. Multi-harmonic string oscillators (fundamental + steel string harmonics)
    const harmonics = [
      { mult: 1.0, type: 'triangle', gain: 0.75 },
      { mult: 2.0, type: 'sine',     gain: 0.35 },
      { mult: 3.0, type: 'sine',     gain: 0.18 },
      { mult: 4.0, type: 'sine',     gain: 0.08 }
    ];

    harmonics.forEach(({ mult, type, gain: hGain }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc.type = type;
      // Micro-detune for acoustic warmth
      const detuneCents = (Math.random() - 0.5) * 3;
      osc.frequency.setValueAtTime(freq * mult, startTime);
      osc.detune.setValueAtTime(detuneCents, startTime);

      oscGain.gain.setValueAtTime(hGain, startTime);

      osc.connect(oscGain);
      oscGain.connect(dampingFilter);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });

    // 5. Connect filter chain to destination
    dampingFilter.connect(bodyFilter);
    bodyFilter.connect(stringGain);
    stringGain.connect(ctx.destination);

    activeGains.push(stringGain);

    // Clean up gain reference after note finishes
    setTimeout(() => {
      activeGains = activeGains.filter((g) => g !== stringGain);
    }, (duration + 0.2) * 1000);
  } catch (err) {
    // Graceful fallback
  }
}

/**
 * 6-Tone Soulful Acoustic Guitar Melody (Fingerpicked E-minor / G-major motif):
 * Tone 1: E3 (164.81 Hz) - Deep bass string root
 * Tone 2: B3 (246.94 Hz) - 5th harmonic lift
 * Tone 3: E4 (329.63 Hz) - Mid string chime
 * Tone 4: G4 (392.00 Hz) - Minor 3rd soul note
 * Tone 5: D5 (587.33 Hz) - High shimmering bell tone
 * Tone 6: B4 (493.88 Hz) - Warm resolving descent
 */
const GUITAR_MELODY_NOTES = [
  { freq: 164.81, delay: 0.00, dur: 2.4, vol: 0.09 }, // E3
  { freq: 246.94, delay: 0.38, dur: 2.2, vol: 0.07 }, // B3
  { freq: 329.63, delay: 0.76, dur: 2.2, vol: 0.08 }, // E4
  { freq: 392.00, delay: 1.16, dur: 2.3, vol: 0.08 }, // G4
  { freq: 587.33, delay: 1.62, dur: 2.5, vol: 0.09 }, // D5
  { freq: 493.88, delay: 2.15, dur: 2.8, vol: 0.08 }, // B4
];

const PHRASE_DURATION_MS = 4800; // Complete phrase with natural reverb ring-out

/**
 * Plays the 6-tone acoustic guitar melody once or in a gentle continuous loop.
 */
function playPhrase() {
  if (!isMelodyPlaying) return;
  const ctx = getGuitarContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  GUITAR_MELODY_NOTES.forEach(({ freq, delay, dur, vol }) => {
    pluckString(freq, now + delay, dur, vol);
  });

  // Schedule next phrase if melody is still active
  loopTimer = setTimeout(() => {
    if (isMelodyPlaying) {
      playPhrase();
    }
  }, PHRASE_DURATION_MS);
}

/**
 * Starts playing the acoustic guitar melody
 */
export function startGuitarMelody() {
  if (isMelodyPlaying) return;
  isMelodyPlaying = true;
  const ctx = getGuitarContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  playPhrase();
}

/**
 * Stops the acoustic guitar melody smoothly with a soft fadeout
 */
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
        gainNode.gain.linearRampToValueAtTime(0.00001, now + 0.35);
      } catch (e) {}
    });
  }
  activeGains = [];
}

/**
 * Toggles the acoustic guitar melody on / off
 */
export function toggleGuitarMelody() {
  if (isMelodyPlaying) {
    stopGuitarMelody();
    return false;
  } else {
    startGuitarMelody();
    return true;
  }
}

export function isGuitarMelodyPlaying() {
  return isMelodyPlaying;
}
