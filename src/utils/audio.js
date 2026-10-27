// AVZ VAGANZA REFINED LUXURY CYBER SOUND ENGINE
// Space, cyber, and tech styled sound effects: smooth, atmospheric, edgy, and velvety on the ears.

let audioCtx = null;
let soundEnabled = true;

export function initAudio() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function playSound(type = 'pip') {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'blast') {
      // Epic cyber implosion blast: Deep sub-drop + shimmering space frequency dispersion
      const oscSub = audioCtx.createOscillator();
      const gainSub = audioCtx.createGain();
      const filterSub = audioCtx.createBiquadFilter();

      filterSub.type = 'lowpass';
      filterSub.frequency.setValueAtTime(320, now);
      filterSub.frequency.exponentialRampToValueAtTime(45, now + 1.2);

      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(140, now);
      oscSub.frequency.exponentialRampToValueAtTime(28, now + 1.2);

      gainSub.gain.setValueAtTime(0.001, now);
      gainSub.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gainSub.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      oscSub.connect(filterSub);
      filterSub.connect(gainSub);
      gainSub.connect(audioCtx.destination);

      oscSub.start(now);
      oscSub.stop(now + 1.5);

      // Crystalline particle shatter trail
      [520, 880, 1320, 1760].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + idx * 0.03 + 0.4);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.03);
        gain.gain.linearRampToValueAtTime(0.025, now + idx * 0.03 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + idx * 0.03 + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.55);
      });

    } else if (type === 'charge') {
      // Tech energy charge-up oscillation: Rising pitch with gentle pulse
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      filter.Q.value = 2.5;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.35);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.4);

    } else if (type === 'cyber_hover' || type === 'space_hover') {
      // Velvety space frequency harmonic swell
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(320, now);
      osc2.frequency.setValueAtTime(480, now);
      osc1.frequency.exponentialRampToValueAtTime(440, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(660, now + 0.12);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.14);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.15);
      osc2.stop(now + 0.15);

    } else if (type === 'museum_rotate' || type === 'pedestal_switch') {
      // Deep ethereal cosmic pedestal whoosh
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(680, now + 0.14);
      filter.frequency.exponentialRampToValueAtTime(340, now + 0.3);
      filter.Q.value = 2.0;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(240, now + 0.15);
      osc.frequency.linearRampToValueAtTime(140, now + 0.32);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.38);

    } else if (type === 'glitch_click' || type === 'pip' || type === 'click') {
      // High-precision cyber tactile pulse
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.02);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.038);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.042);

    } else if (type === 'baddie_alert' || type === 'sparkle' || type === 'metal') {
      // Sparkling baddie glamour chime: 3 harmonious metallic bells
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.025);

        const delay = idx * 0.025;
        gain.gain.setValueAtTime(0.0001, now + delay);
        gain.gain.linearRampToValueAtTime(0.025, now + delay + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + delay + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.38);
      });

    } else if (type === 'subdrop' || type === 'warp') {
      // Atmospheric void subdrop
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.38);

    } else if (type === 'lightspeed_warp') {
      // Cosmic satellite lightspeed Doppler sweep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.95);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.55);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.95);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    } else {
      // Fallback: warm micro click
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 0.035);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (e) {
    // Graceful silent fallback
  }
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}
