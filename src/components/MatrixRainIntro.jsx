import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Brand pillars to cycle through ────────────────────────────────────────
const BRAND_PILLARS = [
  'UPCYCLED',
  'AVANT-GARDE',
  'RAVE WEAR',
  'ONE OF A KIND',
  'SUSTAINABLE',
];

// Binary characters matching the user's reference (pure 0s and 1s)
const BINARY_CHARS = ['0', '1'];

// ─── Timing constants (ms) ──────────────────────────────────────────────────
const INITIAL_RAIN_SETTLE = 400;  // stream establishes before first word
const FADE_IN_DURATION   = 350;   // text fade-in
const HOLD_DURATION      = 850;   // word stays at full opacity
const FADE_OUT_DURATION  = 300;   // text fade-out
const BETWEEN_PILLARS    = 120;   // pause between words
const OUTRO_DELAY        = 400;   // binary-only moment before calling onComplete

export default function MatrixRainIntro({ onComplete }) {
  const canvasRef      = useRef(null);
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
  const [isFadingOut, setIsFadingOut] = useState(false);

  // ── Cleanup helper ─────────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // ── Layered Binary Digital Rain Canvas ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let bgCols = [];
    let midCols = [];
    let fgCols = [];

    const bgFontSize = 11;
    const midFontSize = 16;
    const midStep = 18;
    const fgFontSize = 44;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      // 1. Background layer: dense, small 0/1 digits
      const bgCount = Math.floor(canvas.width / bgFontSize);
      bgCols = Array.from({ length: bgCount }, () => Math.random() * -120);

      // 2. Midground layer: sharp neon violet streams with laser beams (Photo 2)
      const midCount = Math.floor(canvas.width / midStep);
      midCols = Array.from({ length: midCount }, () => ({
        y: Math.random() * -100,
        speed: 0.85 + Math.random() * 1.05,
        isBeam: Math.random() > 0.8,
        beamLength: 60 + Math.random() * 120,
      }));

      // 3. Foreground layer: large, soft out-of-focus 0/1 digits (Photo 1)
      const fgCount = Math.floor(canvas.width / 130);
      fgCols = Array.from({ length: fgCount }, (_, i) => ({
        x: i * 130 + Math.random() * 40,
        y: Math.random() * -60,
        speed: 0.4 + Math.random() * 0.4,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      // Dark translucent fade creates silky trailing streaks
      ctx.fillStyle = 'rgba(2, 0, 6, 0.11)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ─── 1. Background Dense Binary (Deep Dark Violet) ───
      ctx.font = `bold ${bgFontSize}px "Courier New", monospace`;
      for (let i = 0; i < bgCols.length; i++) {
        const y = bgCols[i] * bgFontSize;
        if (y >= 0) {
          const char = BINARY_CHARS[Math.floor(Math.random() * 2)];
          ctx.fillStyle = Math.random() > 0.96 ? '#a855f7' : 'rgba(91, 33, 182, 0.42)';
          ctx.fillText(char, i * bgFontSize, y);
        }
        if (y > canvas.height && Math.random() > 0.975) {
          bgCols[i] = 0;
        }
        bgCols[i] += 0.55;
      }

      // ─── 2. Midground Binary Streams with Laser Light Streaks (Photo 2) ───
      ctx.font = `bold ${midFontSize}px "Consolas", "Courier New", monospace`;
      for (let i = 0; i < midCols.length; i++) {
        const col = midCols[i];
        const x = i * midStep;
        const y = col.y * midFontSize;

        if (y >= 0) {
          // Vertical light streak beam behind the leading character
          if (col.isBeam) {
            const grad = ctx.createLinearGradient(x, y - col.beamLength, x, y);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.6, 'rgba(147, 51, 234, 0.25)');
            grad.addColorStop(0.9, 'rgba(192, 132, 252, 0.6)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
            ctx.fillStyle = grad;
            ctx.fillRect(x + 3, y - col.beamLength, 2, col.beamLength);
          }

          const char = BINARY_CHARS[Math.floor(Math.random() * 2)];

          // Leading digit: radiant white/lavender
          if (Math.random() > 0.86) {
            ctx.shadowColor = '#d8b4fe';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#ffffff';
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = Math.random() > 0.4 ? '#c084fc' : '#a855f7';
          }

          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;
        }

        if (y > canvas.height + 80 && Math.random() > 0.975) {
          col.y = 0;
          col.isBeam = Math.random() > 0.78;
          col.beamLength = 60 + Math.random() * 120;
        }
        col.y += col.speed;
      }

      // ─── 3. Foreground Large Out-of-Focus Binary (Photo 1) ───
      ctx.font = `bold ${fgFontSize}px "Consolas", "Courier New", monospace`;
      for (let i = 0; i < fgCols.length; i++) {
        const fg = fgCols[i];
        const y = fg.y * fgFontSize;

        if (y >= 0) {
          const char = BINARY_CHARS[Math.floor(Math.random() * 2)];
          ctx.shadowColor = 'rgba(168, 85, 247, 0.9)';
          ctx.shadowBlur = 20;
          ctx.fillStyle = 'rgba(216, 180, 254, 0.7)';
          ctx.fillText(char, fg.x, y);
          ctx.shadowBlur = 0;
        }

        if (y > canvas.height + 120 && Math.random() > 0.985) {
          fg.y = 0;
          fg.x = i * 130 + Math.random() * 40;
        }
        fg.y += fg.speed;
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
            // All pillars done → smooth fade out of binary rain into the site
            schedule(() => {
              setIsFadingOut(true);
              schedule(() => {
                if (!finishedRef.current) {
                  finishedRef.current = true;
                  onCompleteRef.current?.();
                }
              }, 450);
            }, OUTRO_DELAY);
          }
        }, FADE_OUT_DURATION + BETWEEN_PILLARS);
      }, FADE_IN_DURATION + HOLD_DURATION);
    };

    // Let the stream settle visually before first word
    schedule(() => showPillar(0), INITIAL_RAIN_SETTLE);

    return () => clearAllTimers();
  }, [clearAllTimers]);

  // ── Intentionally intercept all interaction events (non-skippable) ─────
  useEffect(() => {
    const block = (e) => {
      e.stopPropagation();
    };
    window.addEventListener('keydown', block, { capture: true });
    return () => window.removeEventListener('keydown', block, { capture: true });
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black overflow-hidden select-none cursor-default transition-opacity duration-[450ms] ease-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ pointerEvents: 'all' }}
    >
      {/* ── Layered Binary Digital Rain Canvas ────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* ── Floor Light Reflection (Matching Reference Photo 2) ─────── */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(124, 58, 237, 0.22), rgba(88, 28, 135, 0.08), transparent)',
          borderTop: '1px solid rgba(168, 85, 247, 0.25)',
        }}
      />

      {/* ── CRT Scanlines & Subtle Glitch Texture (Matching Photo 1) ─── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(rgba(18, 16, 26, 0) 50%, rgba(0, 0, 0, 0.42) 50%), linear-gradient(90deg, rgba(168, 85, 247, 0.02), rgba(0, 0, 0, 0.01), rgba(168, 85, 247, 0.02))',
          backgroundSize: '100% 3px, 6px 100%',
          opacity: 0.85,
        }}
      />

      {/* ── Vignette around borders ─────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, 0.88) 100%)',
        }}
      />

      {/* ── Violet radial glow behind the center text ───────────────── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          style={{
            opacity: glowOpacity,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            width: '560px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(147,51,234,0.4) 0%, rgba(109,40,217,0.2) 45%, transparent 75%)',
            filter: 'blur(28px)',
            willChange: 'opacity',
          }}
        />
      </div>

      {/* ── Centre brand pillar text ──────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
        {/* Top studio tag */}
        <div
          style={{
            opacity: textOpacity * 0.7,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            color: '#c084fc',
            letterSpacing: '0.45em',
            fontSize: '11px',
            fontFamily: '"Courier New", monospace',
            textShadow: '0 0 10px rgba(192, 132, 252, 0.5)',
          }}
          className="mb-4 uppercase font-mono text-center"
        >
          AVZ VAGANZA • THE STUDIO
        </div>

        {/* Main pillar word (Neon glowing like PRNKS title) */}
        <div
          style={{
            opacity: textOpacity,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            textShadow:
              '0 0 20px #a855f7, 0 0 40px #9333ea, 0 0 70px #7c3aed, 0 0 110px rgba(168,85,247,0.85)',
            willChange: 'opacity',
            lineHeight: 1.1,
          }}
          className="text-center font-mono font-black uppercase text-white tracking-[0.18em]"
        >
          <span
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6.5rem)',
            }}
          >
            {BRAND_PILLARS[pillarIdx]}
          </span>
        </div>

        {/* Glowing sub-box styled exactly like PRNKS [ CLICK TO ENTER ] frame */}
        <div
          style={{
            opacity: textOpacity,
            transition: `opacity ${FADE_IN_DURATION}ms ease-in-out`,
            border: '1.5px solid #a855f7',
            boxShadow: '0 0 18px rgba(168,85,247,0.5), inset 0 0 12px rgba(147,51,234,0.25)',
            backgroundColor: 'rgba(10, 6, 18, 0.75)',
            backdropFilter: 'blur(10px)',
          }}
          className="mt-6 px-6 py-2 rounded-sm text-xs font-mono uppercase tracking-[0.3em] text-[#f3e8ff]"
        >
          [ 1-OF-1 WEARABLE ART ARCHIVE ]
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
