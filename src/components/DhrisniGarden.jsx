'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

/**
 * High-Haute Botanical Dhrisni Garden
 * Every click on the DHRISNI text or stage blooms a completely different
 * chromatic set of flowers, leaves, vines, stars, and typography.
 */
export const GARDEN_COLOR_THEMES = [
  {
    id: 'cosmic-lavender',
    name: 'Cosmic Lavender & Orchid',
    wordGradient:
      'linear-gradient(110deg, #ffffff 0%, #ffffff 32%, #f5d5ff 48%, #d99af4 65%, #b96cdb 85%, #ffffff 100%)',
    wordShadow:
      '0 0 25px rgba(255, 255, 255, 0.35), 0 0 45px rgba(189, 76, 232, 0.45)',
    vine: [
      { offset: '0%', color: '#39a77b' },
      { offset: '48%', color: '#d17d91' },
      { offset: '100%', color: '#d4d98b' },
    ],
    stemGlow: 'rgba(183, 122, 255, 0.55)',
    leafA: [
      { offset: '0%', color: '#426de9' },
      { offset: '42%', color: '#70a9f4' },
      { offset: '72%', color: '#f18b54' },
      { offset: '100%', color: '#f04435' },
    ],
    leafAVein1: '#9bd9b4',
    leafAVein2: '#b9c9ff',
    leafB: [
      { offset: '0%', color: '#f47c35' },
      { offset: '48%', color: '#ec5a56' },
      { offset: '100%', color: '#5b8ef0' },
    ],
    leafBVein: '#ffd1a5',
    star: [
      { offset: '0%', color: '#d99af4' },
      { offset: '55%', color: '#b96cdb' },
      { offset: '100%', color: '#9650c6' },
    ],
    starStroke: '#8d43b7',
    starInnerStroke: '#e6b5ff',
    starGlow: 'drop-shadow(0 0 9px #c77affdd) drop-shadow(0 0 24px #9b4bdcaa)',
    flightFill: '#d9a1ff',
    flightStroke: '#a65be0',
    flightHighlight: '#f4dcff',
    jumpStarFill: '#f0caff',
    jumpStarGlow: '#d99aff',
    stardustColors: ['#f5d5ff', '#d99af4', '#ffffff'],
    flightTrailGlow: 'drop-shadow(0 0 11px #ffffff) drop-shadow(0 0 24px #c476ff)',
  },
  {
    id: 'solar-gold',
    name: 'Solar Gold & Crimson Rose',
    wordGradient:
      'linear-gradient(110deg, #ffffff 0%, #ffffff 32%, #fef08a 48%, #fbbf24 65%, #f59e0b 85%, #ffffff 100%)',
    wordShadow:
      '0 0 25px rgba(255, 255, 255, 0.35), 0 0 45px rgba(245, 158, 11, 0.5)',
    vine: [
      { offset: '0%', color: '#eab308' },
      { offset: '48%', color: '#f43f5e' },
      { offset: '100%', color: '#fb923c' },
    ],
    stemGlow: 'rgba(251, 191, 36, 0.55)',
    leafA: [
      { offset: '0%', color: '#fbbf24' },
      { offset: '42%', color: '#f97316' },
      { offset: '72%', color: '#ef4444' },
      { offset: '100%', color: '#b91c1c' },
    ],
    leafAVein1: '#fde68a',
    leafAVein2: '#fed7aa',
    leafB: [
      { offset: '0%', color: '#facc15' },
      { offset: '48%', color: '#f87171' },
      { offset: '100%', color: '#991b1b' },
    ],
    leafBVein: '#fef08a',
    star: [
      { offset: '0%', color: '#fde047' },
      { offset: '55%', color: '#f59e0b' },
      { offset: '100%', color: '#dc2626' },
    ],
    starStroke: '#b45309',
    starInnerStroke: '#fef08a',
    starGlow: 'drop-shadow(0 0 9px #fbbf24dd) drop-shadow(0 0 24px #ea580caa)',
    flightFill: '#fde047',
    flightStroke: '#d97706',
    flightHighlight: '#fef9c3',
    jumpStarFill: '#fef08a',
    jumpStarGlow: '#f59e0b',
    stardustColors: ['#fef08a', '#fbbf24', '#ffffff'],
    flightTrailGlow: 'drop-shadow(0 0 11px #ffffff) drop-shadow(0 0 24px #f59e0b)',
  },
  {
    id: 'sakura-blossom',
    name: 'Sakura Blossom & Rose Quartz',
    wordGradient:
      'linear-gradient(110deg, #ffffff 0%, #ffffff 32%, #fce7f3 48%, #f472b6 65%, #ec4899 85%, #ffffff 100%)',
    wordShadow:
      '0 0 25px rgba(255, 255, 255, 0.35), 0 0 45px rgba(244, 114, 182, 0.5)',
    vine: [
      { offset: '0%', color: '#f472b6' },
      { offset: '48%', color: '#c084fc' },
      { offset: '100%', color: '#fda4af' },
    ],
    stemGlow: 'rgba(244, 114, 182, 0.55)',
    leafA: [
      { offset: '0%', color: '#f472b6' },
      { offset: '42%', color: '#fb7185' },
      { offset: '72%', color: '#e11d48' },
      { offset: '100%', color: '#9d174d' },
    ],
    leafAVein1: '#fbcfe8',
    leafAVein2: '#fecdd3',
    leafB: [
      { offset: '0%', color: '#fb7185' },
      { offset: '48%', color: '#e879f9' },
      { offset: '100%', color: '#fda4af' },
    ],
    leafBVein: '#fdf2f8',
    star: [
      { offset: '0%', color: '#fbcfe8' },
      { offset: '55%', color: '#f472b6' },
      { offset: '100%', color: '#be185d' },
    ],
    starStroke: '#9d174d',
    starInnerStroke: '#fdf2f8',
    starGlow: 'drop-shadow(0 0 9px #f472b6dd) drop-shadow(0 0 24px #db2777aa)',
    flightFill: '#fbcfe8',
    flightStroke: '#ec4899',
    flightHighlight: '#ffffff',
    jumpStarFill: '#fce7f3',
    jumpStarGlow: '#f472b6',
    stardustColors: ['#fce7f3', '#f472b6', '#ffffff'],
    flightTrailGlow: 'drop-shadow(0 0 11px #ffffff) drop-shadow(0 0 24px #ec4899)',
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Emerald & Electric Cyan',
    wordGradient:
      'linear-gradient(110deg, #ffffff 0%, #ffffff 32%, #a7f3d0 48%, #34d399 65%, #06b6d4 85%, #ffffff 100%)',
    wordShadow:
      '0 0 25px rgba(255, 255, 255, 0.35), 0 0 45px rgba(52, 211, 153, 0.5)',
    vine: [
      { offset: '0%', color: '#10b981' },
      { offset: '48%', color: '#06b6d4' },
      { offset: '100%', color: '#a3e635' },
    ],
    stemGlow: 'rgba(52, 211, 153, 0.55)',
    leafA: [
      { offset: '0%', color: '#06b6d4' },
      { offset: '42%', color: '#2dd4bf' },
      { offset: '72%', color: '#10b981' },
      { offset: '100%', color: '#047857' },
    ],
    leafAVein1: '#a7f3d0',
    leafAVein2: '#cffafe',
    leafB: [
      { offset: '0%', color: '#84cc16' },
      { offset: '48%', color: '#14b8a6' },
      { offset: '100%', color: '#0284c7' },
    ],
    leafBVein: '#d9f99d',
    star: [
      { offset: '0%', color: '#67e8f9' },
      { offset: '55%', color: '#2dd4bf' },
      { offset: '100%', color: '#059669' },
    ],
    starStroke: '#065f46',
    starInnerStroke: '#cffafe',
    starGlow: 'drop-shadow(0 0 9px #2dd4bfdd) drop-shadow(0 0 24px #059669aa)',
    flightFill: '#67e8f9',
    flightStroke: '#0891b2',
    flightHighlight: '#ecfeff',
    jumpStarFill: '#a7f3d0',
    jumpStarGlow: '#10b981',
    stardustColors: ['#a7f3d0', '#2dd4bf', '#ffffff'],
    flightTrailGlow: 'drop-shadow(0 0 11px #ffffff) drop-shadow(0 0 24px #2dd4bf)',
  },
  {
    id: 'oceanic-indigo',
    name: 'Oceanic Sapphire & Celestial Violet',
    wordGradient:
      'linear-gradient(110deg, #ffffff 0%, #ffffff 32%, #dbeafe 48%, #60a5fa 65%, #818cf8 85%, #ffffff 100%)',
    wordShadow:
      '0 0 25px rgba(255, 255, 255, 0.35), 0 0 45px rgba(96, 165, 250, 0.5)',
    vine: [
      { offset: '0%', color: '#3b82f6' },
      { offset: '48%', color: '#8b5cf6' },
      { offset: '100%', color: '#38bdf8' },
    ],
    stemGlow: 'rgba(96, 165, 250, 0.55)',
    leafA: [
      { offset: '0%', color: '#38bdf8' },
      { offset: '42%', color: '#3b82f6' },
      { offset: '72%', color: '#6366f1' },
      { offset: '100%', color: '#312e81' },
    ],
    leafAVein1: '#bfdbfe',
    leafAVein2: '#c7d2fe',
    leafB: [
      { offset: '0%', color: '#2563eb' },
      { offset: '48%', color: '#7c3aed' },
      { offset: '100%', color: '#06b6d4' },
    ],
    leafBVein: '#dbeafe',
    star: [
      { offset: '0%', color: '#93c5fd' },
      { offset: '55%', color: '#6366f1' },
      { offset: '100%', color: '#4338ca' },
    ],
    starStroke: '#1e1b4b',
    starInnerStroke: '#e0e7ff',
    starGlow: 'drop-shadow(0 0 9px #60a5fadd) drop-shadow(0 0 24px #4338caaa)',
    flightFill: '#93c5fd',
    flightStroke: '#2563eb',
    flightHighlight: '#eff6ff',
    jumpStarFill: '#dbeafe',
    jumpStarGlow: '#3b82f6',
    stardustColors: ['#dbeafe', '#60a5fa', '#ffffff'],
    flightTrailGlow: 'drop-shadow(0 0 11px #ffffff) drop-shadow(0 0 24px #3b82f6)',
  },
];

/**
 * The 5 signature colors from each of the 5 garden botanical themes:
 * 1. Lavender Orchid (#d99af4)
 * 2. Solar Gold (#fbbf24)
 * 3. Sakura Rose Pink (#f472b6)
 * 4. Cyber Emerald (#10b981)
 * 5. Oceanic Sapphire (#3b82f6)
 */
export const FIVE_THEME_STARDUST_COLORS = [
  '#d99af4', // Cosmic Lavender
  '#fbbf24', // Solar Gold
  '#f472b6', // Sakura Pink
  '#10b981', // Cyber Emerald
  '#3b82f6', // Oceanic Sapphire
];

function DhrisniGarden({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);

  const currentTheme = GARDEN_COLOR_THEMES[themeIndex];

  // Trigger entrance when scrolled into view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Cycle to next chromatic bloom set and replay the entrance sequence
  const handleReplay = useCallback(() => {
    setThemeIndex((prev) => (prev + 1) % GARDEN_COLOR_THEMES.length);
    setAnimationKey((prev) => prev + 1);
  }, []);

  // Dynamically sync canvas internal resolution with its DOM layout size
  const syncCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
  }, []);

  useEffect(() => {
    syncCanvasDimensions();
    window.addEventListener('resize', syncCanvasDimensions);
    return () => window.removeEventListener('resize', syncCanvasDimensions);
  }, [syncCanvasDimensions]);

  // Ultra-Smooth 120 FPS Stardust Loop
  const runStardustLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const render = () => {
      const particles = particlesRef.current;
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.03; // cosmic upward drift
        p.life -= p.decay;
        p.rotation += p.rotSpeed;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const cx = p.x * dpr;
        const cy = p.y * dpr;
        const size = p.size * dpr * p.life;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.life);

        // Subtle, refined glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 3 * dpr;

        // Delicate micro 4-pointed diamond star
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.5);
        ctx.quadraticCurveTo(size * 0.2, 0, size * 1.5, 0);
        ctx.quadraticCurveTo(size * 0.2, 0, 0, size * 1.5);
        ctx.quadraticCurveTo(-size * 0.2, 0, -size * 1.5, 0);
        ctx.quadraticCurveTo(-size * 0.2, 0, 0, -size * 1.5);
        ctx.fill();

        // Micro pinpoint center
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(render);
    }
  }, []);

  // Cursor stardust spawner: Uses matching colors for each design, airy and lightweight
  const handleMouseMove = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      syncCanvasDimensions();

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const colors = currentTheme.stardustColors;
      // Spawn 1 delicate particle (occasionally 2) for a light, non-bulky trail
      const count = Math.random() > 0.65 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particlesRef.current.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.35,
          size: Math.random() * 1.4 + 1.2, // Delicate micro-stardust (1.2px - 2.6px)
          color: randomColor,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          life: 1.0,
          decay: Math.random() * 0.035 + 0.025, // Snappy ~0.5s graceful fade
        });
      }

      // Keep max 24 particles active to eliminate any clumping or bulkiness
      if (particlesRef.current.length > 24) {
        particlesRef.current.splice(0, particlesRef.current.length - 24);
      }

      runStardustLoop();
    },
    [currentTheme, syncCanvasDimensions, runStardustLoop]
  );

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[940px] mx-auto select-none overflow-visible group ${className}`}
      onMouseMove={handleMouseMove}
      onClick={handleReplay}
      style={{
        cursor: 'pointer',
        '--stem-glow': currentTheme.stemGlow,
        '--star-glow': currentTheme.starGlow,
        '--jump-glow': currentTheme.jumpStarGlow,
        '--flight-trail-glow': currentTheme.flightTrailGlow,
      }}
      title="Click on DHRISNI to bloom in a new color theme"
    >
      <style jsx>{`
        .dhrisni-stage {
          position: relative;
          width: 100%;
          min-height: 260px;
          display: grid;
          place-items: center;
          isolation: isolate;
        }

        /* Hero wordmark typography */
        .word {
          position: relative;
          z-index: 2;
          display: inline-block;
          margin: 0;
          white-space: nowrap;
          padding: 0 0.6em 0 0.15em;
          overflow: visible;
          font-family: 'Bodoni 72', 'Didot', 'Cinzel', 'Playfair Display', 'Baskerville', 'Times New Roman', serif;
          font-size: clamp(3.2rem, 9.5vw, 7.8rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          line-height: 1;
          color: #f7f3ef;
          opacity: 0;
          transform: translateY(14px) scale(0.92);
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          cursor: pointer;
          transition: transform 0.25s ease, filter 0.3s ease;
          user-select: none;
        }

        .word:hover {
          transform: translateY(12px) scale(0.94);
        }

        .in-view .word {
          animation: wordReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s forwards,
            wordShimmer 6s ease-in-out 1.8s infinite;
        }

        @keyframes wordReveal {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wordShimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .botanical {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          z-index: 3;
          pointer-events: none;
          display: block;
        }

        /* Stems */
        .stem {
          fill: none;
          stroke: url(#vineGradient);
          stroke-width: 3.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          filter: drop-shadow(0 0 5px var(--stem-glow, rgba(183, 122, 255, 0.55)));
        }

        .in-view .stem {
          animation: drawStem 2.4s cubic-bezier(0.3, 0.1, 0.2, 1) var(--t, 1.1s) forwards;
        }

        .stem.thin {
          stroke-width: 1.8;
          opacity: 0.88;
        }

        @keyframes drawStem {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Leaves */
        .leaf {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 50% 90%;
          filter: drop-shadow(0 0 7px rgba(143, 91, 255, 0.45));
        }

        .in-view .leaf {
          animation: leafOpen 0.65s cubic-bezier(0.2, 1.45, 0.35, 1) var(--t) forwards;
        }

        @keyframes leafOpen {
          0% {
            opacity: 0;
            transform: scale(0.08) rotate(-25deg);
          }
          75% {
            opacity: 1;
            transform: scale(1.12) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        /* Bloom Stars */
        .bloom-star {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          filter: var(--star-glow);
        }

        .in-view .bloom-star {
          animation: starBloom 0.9s cubic-bezier(0.18, 1.2, 0.3, 1) var(--t) forwards,
            starGlow 3.2s ease-in-out calc(var(--t) + 0.9s) infinite;
        }

        @keyframes starBloom {
          0% {
            opacity: 0;
            transform: scale(0.12) rotate(-18deg);
          }
          65% {
            opacity: 1;
            transform: scale(1.1) rotate(4deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes starGlow {
          0%, 100% {
            filter: var(--star-glow);
            opacity: 0.85;
          }
          50% {
            filter: var(--star-glow);
            opacity: 1;
            transform: scale(1.05);
          }
        }

        /* Jump Stars */
        .jump-star {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0 0 4px var(--jump-glow)) drop-shadow(0 0 10px var(--jump-glow));
        }

        .in-view .jump-star {
          animation: jumpIn 0.95s cubic-bezier(0.2, 1.65, 0.35, 1) var(--t) both,
            jumpGlow 2.8s ease-in-out calc(var(--t) + 0.95s) infinite;
        }

        @keyframes jumpIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.12) rotate(-22deg);
          }
          58% {
            opacity: 1;
            transform: translateY(-9px) scale(1.18) rotate(8deg);
          }
          78% {
            transform: translateY(3px) scale(0.92) rotate(-3deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0);
          }
        }

        @keyframes jumpGlow {
          0%, 100% {
            opacity: 0.78;
          }
          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }

        /* Flying Orbiting Stars */
        .flyers {
          pointer-events: none;
          overflow: visible;
        }

        .flyer-node {
          opacity: 0.95;
          transform-box: fill-box;
          transform-origin: center;
        }

        .flyer-1 {
          offset-path: path('M105 205 C170 110 240 65 330 105 S470 255 570 195 S730 70 810 155 S730 285 615 260 S365 280 250 220 S140 125 105 205');
          offset-rotate: auto;
          animation: orbitMotion 6.8s linear infinite, flightPulse 2.4s ease-in-out infinite;
          animation-delay: 1.2s, 0s;
        }

        .flyer-2 {
          offset-path: path('M780 95 C690 45 585 55 520 115 S405 245 305 225 S160 155 115 185 S250 295 385 270 S670 190 780 95');
          offset-rotate: auto;
          animation: orbitMotion 8.2s linear infinite, flightPulse 2.4s ease-in-out infinite;
          animation-delay: 1.8s, 0s;
          opacity: 0.85;
        }
        .flyer-2 use {
          transform: scale(0.72);
        }

        .flyer-3 {
          offset-path: path('M190 265 C250 205 270 115 360 90 S530 105 590 155 S700 255 770 220');
          offset-rotate: auto;
          animation: orbitMotion 5.7s linear infinite, flightPulse 2.4s ease-in-out infinite;
          animation-delay: 2.2s, 0s;
          opacity: 0.75;
        }
        .flyer-3 use {
          transform: scale(0.48);
        }

        .flyer-4 {
          offset-path: path('M730 275 C650 300 560 280 500 225 S390 95 300 105 S175 180 150 245');
          offset-rotate: auto;
          animation: orbitMotion 7.4s linear infinite, flightPulse 2.4s ease-in-out infinite;
          animation-delay: 2.6s, 0s;
          opacity: 0.85;
        }
        .flyer-4 use {
          transform: scale(0.72);
        }

        @keyframes orbitMotion {
          0% {
            offset-distance: 0%;
          }
          100% {
            offset-distance: 100%;
          }
        }

        @keyframes flightPulse {
          0%, 100% {
            opacity: 0.65;
          }
          50% {
            opacity: 1;
            filter: var(--flight-trail-glow);
          }
        }

        /* Ambient Micro-Constellation Stars */
        .micro-twinkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: twinkleBlink var(--spd, 2.5s) ease-in-out var(--dly, 0s) infinite;
        }

        @keyframes twinkleBlink {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.65);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.25);
          }
        }
      `}</style>

      {/* Main Exhibition Stage */}
      <div
        key={animationKey}
        className={`dhrisni-stage ${inView ? 'in-view' : ''} relative w-full h-[clamp(210px,28vw,320px)] flex items-center justify-center`}
      >
        {/* Core Hero Wordmark */}
        <h1
          className="word"
          aria-label="Dhrisni"
          style={{
            backgroundImage: currentTheme.wordGradient,
            textShadow: currentTheme.wordShadow,
          }}
        >
          DHRISNI
        </h1>

        {/* High-Fidelity Botanical & Colored Flowers SVG Layer */}
        <svg
          className="botanical"
          viewBox="0 0 900 330"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Dynamic Vine Gradient */}
            <linearGradient id="vineGradient" x1="0" y1="0" x2="0.8" y2="1">
              {currentTheme.vine.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>

            {/* Dynamic Leaf A Gradient */}
            <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
              {currentTheme.leafA.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>

            {/* Dynamic Leaf B Gradient */}
            <linearGradient id="leafGradientAlt" x1="0" y1="1" x2="1" y2="0">
              {currentTheme.leafB.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>

            {/* Dynamic Flower Star Gradient */}
            <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
              {currentTheme.star.map((stop, i) => (
                <stop key={i} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>

            {/* Botanical Leaf A */}
            <g id="leafA">
              <path
                d="M0 0 C-12 -12 -42 -15 -43 -39 C-45 -61 -20 -65 -5 -48 C2 -66 29 -65 34 -46 C42 -20 16 -8 0 0Z"
                fill="url(#leafGradient)"
              />
              <path
                d="M0 0 Q-4 -25 -7 -51"
                stroke={currentTheme.leafAVein1}
                strokeWidth="1.4"
                fill="none"
                opacity="0.75"
              />
              <path
                d="M-7 -33 Q-20 -43 -30 -45"
                stroke={currentTheme.leafAVein2}
                strokeWidth="1"
                fill="none"
                opacity="0.65"
              />
            </g>

            {/* Botanical Leaf B */}
            <g id="leafB">
              <path
                d="M0 0 C-18 -8 -43 -1 -49 -21 C-57 -45 -31 -59 -12 -42 C-5 -64 22 -60 28 -40 C35 -19 15 -5 0 0Z"
                fill="url(#leafGradientAlt)"
              />
              <path
                d="M0 0 Q-8 -23 -16 -46"
                stroke={currentTheme.leafBVein}
                strokeWidth="1.4"
                fill="none"
                opacity="0.75"
              />
            </g>

            {/* Blooming Flower Star Symbol */}
            <g id="purpleStar">
              <path
                d="M0 -48 C5 -12 12 -5 48 0 C12 5 5 12 0 48 C-5 12 -12 5 -48 0 C-12 -5 -5 -12 0 -48Z"
                fill="url(#starGradient)"
                stroke={currentTheme.starStroke}
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M0 -48 C5 -12 12 -5 48 0 C12 5 5 12 0 48 C-5 12 -12 5 -48 0 C-12 -5 -5 -12 0 -48Z"
                fill="none"
                stroke={currentTheme.starInnerStroke}
                strokeWidth="1"
                opacity="0.32"
              />
              <path
                d="M-8 -23 Q-2 -34 4 -31"
                fill="none"
                stroke={currentTheme.starInnerStroke}
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.7"
              />
              <circle cx="-13" cy="-19" r="3.5" fill={currentTheme.jumpStarFill} opacity="0.55" />
            </g>

            {/* Flight Star Symbol */}
            <g id="flightStar">
              <path
                d="M0 -17 C2.2 -5.5 5.5 -2.2 17 0 C5.5 2.2 2.2 5.5 0 17 C-2.2 5.5 -5.5 2.2 -17 0 C-5.5 -2.2 -2.2 -5.5 0 -17Z"
                fill={currentTheme.flightFill}
                stroke={currentTheme.flightStroke}
                strokeWidth="1.5"
              />
              <path
                d="M0 -14 C2 -5 5 -2 14 0 C5 2 2 5 0 14 C-2 5 -5 2 -14 0 C-5 -2 -2 -5 0 -14Z"
                fill="none"
                stroke={currentTheme.flightHighlight}
                strokeWidth="1"
                opacity="0.8"
              />
              <circle cx="-4" cy="-5" r="2" fill="#ffffff" opacity="0.9" />
            </g>
          </defs>

          {/* Ambient Micro-Constellation Stars */}
          <g className="micro-constellation" opacity="0.65">
            <circle cx="110" cy="70" r="1.5" fill={currentTheme.jumpStarFill} className="micro-twinkle" style={{ '--spd': '2.1s', '--dly': '0.1s' }} />
            <circle cx="230" cy="50" r="1.2" fill={currentTheme.starInnerStroke} className="micro-twinkle" style={{ '--spd': '3.2s', '--dly': '0.7s' }} />
            <circle cx="410" cy="45" r="1.8" fill="#ffffff" className="micro-twinkle" style={{ '--spd': '1.8s', '--dly': '1.2s' }} />
            <circle cx="510" cy="55" r="1.4" fill={currentTheme.flightFill} className="micro-twinkle" style={{ '--spd': '2.7s', '--dly': '0.4s' }} />
            <circle cx="680" cy="45" r="1.6" fill={currentTheme.jumpStarFill} className="micro-twinkle" style={{ '--spd': '3.5s', '--dly': '1.5s' }} />
            <circle cx="820" cy="80" r="1.3" fill="#ffffff" className="micro-twinkle" style={{ '--spd': '2.3s', '--dly': '0.9s' }} />
            <circle cx="95" cy="285" r="1.5" fill={currentTheme.starInnerStroke} className="micro-twinkle" style={{ '--spd': '2.9s', '--dly': '1.1s' }} />
            <circle cx="210" cy="290" r="1.2" fill={currentTheme.jumpStarFill} className="micro-twinkle" style={{ '--spd': '1.9s', '--dly': '0.3s' }} />
            <circle cx="490" cy="285" r="1.6" fill="#ffffff" className="micro-twinkle" style={{ '--spd': '3.1s', '--dly': '1.7s' }} />
            <circle cx="790" cy="290" r="1.4" fill={currentTheme.flightFill} className="micro-twinkle" style={{ '--spd': '2.4s', '--dly': '0.6s' }} />
          </g>

          {/* Stems: Architectural Organic Lines */}
          <path className="stem" style={{ '--t': '1.1s' }} d="M145 245 C118 207 126 170 158 142 C181 122 180 96 163 78" />
          <path className="stem" style={{ '--t': '1.35s' }} d="M285 250 C260 211 273 176 299 148 C320 125 318 100 302 82" />
          <path className="stem" style={{ '--t': '1.6s' }} d="M615 250 C640 211 627 176 601 148 C580 125 582 100 598 82" />
          <path className="stem" style={{ '--t': '1.85s' }} d="M755 245 C782 207 774 170 742 142 C719 122 720 96 737 78" />

          {/* Stems: Thin Accent Curls */}
          <path className="stem thin" style={{ '--t': '2.0s' }} d="M170 177 C211 191 235 182 248 151 C260 124 246 111 232 119" />
          <path className="stem thin" style={{ '--t': '2.2s' }} d="M730 177 C689 191 665 182 652 151 C640 124 654 111 668 119" />

          {/* Colourful Unfurling Leaves */}
          <g transform="translate(158 142) rotate(-15) scale(.78)">
            <use href="#leafA" className="leaf" style={{ '--t': '2.2s' }} />
          </g>
          <g transform="translate(163 78) rotate(10) scale(.72)">
            <use href="#leafB" className="leaf" style={{ '--t': '2.5s' }} />
          </g>
          <g transform="translate(299 148) rotate(-18) scale(.86)">
            <use href="#leafB" className="leaf" style={{ '--t': '2.8s' }} />
          </g>
          <g transform="translate(598 82) rotate(-12) scale(.78)">
            <use href="#leafA" className="leaf" style={{ '--t': '3.1s' }} />
          </g>
          <g transform="translate(601 148) rotate(-30) scale(.85)">
            <use href="#leafB" className="leaf" style={{ '--t': '3.4s' }} />
          </g>
          <g transform="translate(742 142) rotate(15) scale(.78)">
            <use href="#leafA" className="leaf" style={{ '--t': '3.7s' }} />
          </g>

          {/* Jumping Glint Stars */}
          <g className="jump-star" style={{ '--t': '2.25s', fill: currentTheme.jumpStarFill }} transform="translate(225 205) scale(.42)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '2.55s', fill: currentTheme.jumpStarFill }} transform="translate(340 190) scale(.32)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '2.85s', fill: currentTheme.jumpStarFill }} transform="translate(470 218) scale(.38)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '3.15s', fill: currentTheme.jumpStarFill }} transform="translate(575 190) scale(.3)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '3.45s', fill: currentTheme.jumpStarFill }} transform="translate(690 207) scale(.4)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '3.75s', fill: currentTheme.jumpStarFill }} transform="translate(285 94) scale(.26)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '4.05s', fill: currentTheme.jumpStarFill }} transform="translate(640 96) scale(.28)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>

          {/* Blooming Flowers & Stars */}
          <g transform="translate(170 88) rotate(-8) scale(0.62)">
            <use href="#purpleStar" className="bloom-star" style={{ '--t': '2.4s' }} />
          </g>
          <g transform="translate(365 76) rotate(18) scale(0.48)">
            <use href="#purpleStar" className="bloom-star" style={{ '--t': '2.8s' }} />
          </g>
          <g transform="translate(540 78) rotate(-12) scale(0.58)">
            <use href="#purpleStar" className="bloom-star" style={{ '--t': '3.2s' }} />
          </g>
          <g transform="translate(730 90) rotate(10) scale(0.52)">
            <use href="#purpleStar" className="bloom-star" style={{ '--t': '3.6s' }} />
          </g>
          <g transform="translate(770 218) rotate(-7) scale(0.55)">
            <use href="#purpleStar" className="bloom-star" style={{ '--t': '4.0s' }} />
          </g>

          {/* Orbiting Flying Stars */}
          <g className="flyers" aria-hidden="true">
            <g className="flyer-node flyer-1">
              <use href="#flightStar" />
            </g>

            <g className="flyer-node flyer-2">
              <use href="#flightStar" />
            </g>

            <g className="flyer-node flyer-3">
              <use href="#flightStar" />
            </g>

            <g className="flyer-node flyer-4">
              <use href="#flightStar" />
            </g>
          </g>
        </svg>

      </div>

      {/* 120 FPS Persistent Canvas - outside key={animationKey} so it NEVER resets or loses buffer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}

export default memo(DhrisniGarden);
