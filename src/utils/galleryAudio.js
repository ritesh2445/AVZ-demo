// Web Audio synthesizer for subtle vintage museum wooden glide & mechanical friction sound
let galleryAudioCtx = null;
let activeSource = null;
let activeGain = null;
let stopTimer = null;

function getGalleryAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!galleryAudioCtx) {
    galleryAudioCtx = new AudioContextClass();
  }
  if (galleryAudioCtx.state === 'suspended') {
    galleryAudioCtx.resume().catch(() => {});
  }
  return galleryAudioCtx;
}

/**
 * Triggers a subtle vintage wooden gallery wall movement friction sound
 * Only plays if soundEnabled is true. Stops immediately when movement halts.
 */
export function playGalleryMoveSound(soundEnabled = false, velocity = 1) {
  if (!soundEnabled || typeof window === 'undefined') return;

  const ctx = getGalleryAudioContext();
  if (!ctx) return;

  // Clear existing stop timer so sound continues smoothly while dragging
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }

  // If already playing, ramp gain slightly based on movement velocity and schedule stop
  if (activeGain && activeSource) {
    try {
      const now = ctx.currentTime;
      const targetGain = Math.min(0.045, Math.max(0.012, 0.02 * Math.abs(velocity)));
      activeGain.gain.cancelScheduledValues(now);
      activeGain.gain.linearRampToValueAtTime(targetGain, now + 0.05);

      // Stop automatically 120ms after scrolling stops
      stopTimer = setTimeout(() => {
        stopGalleryMoveSound();
      }, 140);
      return;
    } catch (e) {}
  }

  try {
    const now = ctx.currentTime;

    // Create dual-tone warm wooden resonance oscillator + lowpass filter
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Warm low-frequency wooden friction resonance (80Hz to 160Hz)
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(125, now + 0.1);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(140, now);
    filter.Q.value = 3.0;

    // Subtle gain: 0.025 max so it's atmospheric and never intrusive
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.025, now + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);

    activeSource = osc;
    activeGain = gain;

    stopTimer = setTimeout(() => {
      stopGalleryMoveSound();
    }, 150);
  } catch (err) {
    // Ignore audio permission warnings
  }
}

/**
 * Immediately stops the gallery movement sound with a 50ms fadeout to prevent audio clicking
 */
export function stopGalleryMoveSound() {
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }

  if (!activeGain || !activeSource || !galleryAudioCtx) return;

  try {
    const now = galleryAudioCtx.currentTime;
    activeGain.gain.cancelScheduledValues(now);
    activeGain.gain.linearRampToValueAtTime(0.00001, now + 0.05);

    const sourceToStop = activeSource;
    setTimeout(() => {
      try {
        sourceToStop.stop();
        sourceToStop.disconnect();
      } catch (e) {}
    }, 60);

    activeSource = null;
    activeGain = null;
  } catch (e) {
    activeSource = null;
    activeGain = null;
  }
}
