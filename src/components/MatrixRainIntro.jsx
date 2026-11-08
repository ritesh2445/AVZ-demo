import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Brand pillars to cycle through ────────────────────────────────────────
const BRAND_PILLARS = [
  'UPCYCLED',
  'AVANT-GARDE',
  'RAVE WEAR',
  'ONE OF A KIND',
  'SUSTAINABLE',
];

// Katakana + ASCII for the digital rain
const MATRIX_CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

// Purple/violet palette matching AVZ Vaganza site theme
const RAIN_COLORS = [
  '#9333ea', // purple-600
  '#a855f7', // purple-500
  '#7c3aed', // violet-600
  '#8b5cf6', // violet-500
  '#6d28d9', // violet-700
  '#c084fc', // purple-400
];

// ─── Timing constants (ms) ──────────────────────────────────────────────────
const INITIAL_RAIN_SETTLE = 700;  // rain establishes before first word
const FADE_IN_DURATION   = 550;   // text fade-in
const HOLD_DURATION      = 1250;  // word stays at full opacity
const FADE_OUT_DURATION  = 480;   // text fade-out
const BETWEEN_PILLARS    = 180;   // pause between words
const OUTRO_DELAY        = 650;   // rain-only moment before calling onComplete

export default function MatrixRainIntro({ onComplete }) {
  const canvasRef      = useRef(null);
  const dropsRef       = useRef([]);
  const animIdRef      = useRef(null);
  const finishedRef    = useRef(false);
  const timersRef      = useRef([]);
  const onCompleteRef  = useRef(onComplete);

  // Keep onComplete ref in sync
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // ── UI state for the cycling pillar text ───────────────────────────────
  const [pillarIdx, setPillarIdx] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [glowOpacity, setGlowOpacity] = useState(0);

  // ── Cleanup helper ─────────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // ── Matrix rain canvas ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const fontSize = window.innerWidth < 480 ? 11 : window.innerWidth < 768 ? 13 : 15;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / fontSize);
      // Stagger starting positions so rain doesn't all appear at once
      dropsRef.current = Array.from({ length: cols }, () => Math.random() * -60);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      // Slight translucent overlay → creates the trailing glow trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Courier New", monospace`;

      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        if (y < 0) { drops[i]++; continue; }

        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];

        // Leading character gets bright lavender; rest cycle through the palette
        if (Math.random() > 0.93) {
          ctx.fillStyle = '#e9d5ff'; // bright lavender leader
        } else {
          ctx.fillStyle = RAIN_COLORS[Math.floor(Math.random() * RAIN_COLORS.length)];
        }

        ctx.fillText(char, i * fontSize, y);

        // Reset column to top once it's past the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animIdRef.current = requestAnimationFrame(draw);
    };

    animIdRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ── Brand pillar sequencer ─────────────────────────────────────────────
  useEffect(() => {
    if (finishedRef.current) return;

    const schedule = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
      return id;
    };

    // Animate a single pillar then recurse to the next
    const showPillar = (idx) => {
      if (finishedRef.current) return;
      setPillarIdx(idx);

      // Fade in
      schedule(() => {
        setTextOpacity(1);
        setGlowOpacity(1);
      }, 30); // next tick after setState for idx

      // Fade out after hold
      schedule(() => {
        setTextOpacity(0);
        setGlowOpacity(0);

        // After fade-out completes, advance or finish
        schedule(() => {
          if (idx + 1 < BRAND_PILLARS.length) {
            showPillar(idx + 1);
          } else {
            // All pillars done → outro rain → call onComplete
            schedule(() => {
              if (!finishedRef.current) {
                finishedRef.current = true;
                onCompleteRef.current?.();
              }
            }, OUTRO_DELAY);
          }
        }, FADE_OUT_DURATION + BETWEEN_PILLARS);
      }, FADE_IN_DURATION + HOLD_DURATION);
    };

    // Let the rain settle visually before first word
    schedule(() => showPillar(0), INITIAL_RAIN_SETTLE);

    return () => clearAllTimers();
  }, [clearAllTimers]);

  // ── Intentionally intercept all interaction events (non-skippable) ─────
  useEffect(() => {
    const block = (e) => {
      e.stopPropagation();
      // Allow browser defaults (tab focus etc.) but swallow custom skip attempts
    };
    window.addEventListener('keydown', block, { capture: true });
    return () => window.removeEventListener('keydown', block, { capture: true });
  }, []);

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black overflow-hidden"
      style={{ pointerEvents: 'all', userSelect: 'none', cursor: 'default' }}
      // Intentionally NOT wiring onClick — this experience is non-skippable
    >
      {/* ── Digital Rain Canvas ───────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.72 }}
      />

      {/* ── Violet radial glow behind the text ───────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          style={{
            opacity: glowOpacity,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            width: '520px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.35) 0%, rgba(109,40,217,0.18) 45%, transparent 75%)',
            filter: 'blur(24px)',
            willChange: 'opacity',
          }}
        />
      </div>

      {/* ── Centre brand pillar text ──────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Decorative bracket — top */}
        <div
          style={{
            opacity: textOpacity * 0.5,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            color: '#c084fc',
            letterSpacing: '0.6em',
            fontSize: '11px',
            fontFamily: '"Courier New", monospace',
          }}
          className="mb-5 uppercase tracking-widest font-mono"
        >
          [ AVZ VAGANZA ]
        </div>

        {/* Main pillar word */}
        <div
          style={{
            opacity: textOpacity,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            textShadow:
              '0 0 18px #9333ea, 0 0 36px #a855f7, 0 0 72px #7c3aed, 0 0 120px rgba(139,92,246,0.5)',
            willChange: 'opacity',
            lineHeight: 1,
          }}
          className="text-center font-mono font-black uppercase text-white"
        >
          <span
            style={{
              fontSize: 'clamp(2.4rem, 7vw, 6rem)',
              letterSpacing: '0.22em',
            }}
          >
            {BRAND_PILLARS[pillarIdx]}
          </span>
        </div>

        {/* Decorative bracket — bottom */}
        <div
          style={{
            opacity: textOpacity * 0.5,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            color: '#c084fc',
            letterSpacing: '0.6em',
            fontSize: '11px',
            fontFamily: '"Courier New", monospace',
          }}
          className="mt-5 uppercase tracking-widest font-mono"
        >
          [ GUWAHATI ATELIER ]
        </div>
      </div>

      {/* ── Corner watermarks ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute top-5 left-5 text-[10px] font-mono tracking-widest uppercase pointer-events-none"
        style={{ color: 'rgba(192,132,252,0.45)' }}
      >
        AVZ VAGANZA • DHRISTROYER
      </div>
      <div
        aria-hidden
        className="absolute bottom-5 right-5 text-[10px] font-mono tracking-widest uppercase pointer-events-none"
        style={{ color: 'rgba(192,132,252,0.3)' }}
      >
        WEARABLE ART ARCHIVE
      </div>

      {/* Dot indicator showing which pillar is active */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none">
        {BRAND_PILLARS.map((_, i) => (
          <div
            key={i}
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: i === pillarIdx ? '#a855f7' : 'rgba(168,85,247,0.25)',
              boxShadow: i === pillarIdx ? '0 0 6px #a855f7' : 'none',
              transition: 'background 300ms, box-shadow 300ms',
            }}
          />
        ))}
      </div>
    </div>
  );
}
