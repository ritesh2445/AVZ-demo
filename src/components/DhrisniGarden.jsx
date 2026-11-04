'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

const GARDEN_COLOR_PALETTES = [
  {
    name: 'lavender-star',
    gradient: 'linear-gradient(110deg, #ffffff 0%, #f5d5ff 22%, #d99af4 45%, #b96cdb 65%, #9650c6 85%, #ffffff 100%)',
    shadow: '0 0 25px rgba(255, 255, 255, 0.25), 0 0 45px rgba(189, 76, 232, 0.45)',
    filter: 'drop-shadow(0 0 16px rgba(189, 76, 232, 0.35))',
  },
  {
    name: 'leaf-azure-coral',
    gradient: 'linear-gradient(110deg, #ffffff 0%, #70a9f4 20%, #426de9 45%, #f18b54 70%, #f04435 90%, #ffffff 100%)',
    shadow: '0 0 25px rgba(255, 255, 255, 0.25), 0 0 45px rgba(66, 109, 233, 0.45)',
    filter: 'drop-shadow(0 0 16px rgba(241, 139, 84, 0.35))',
  },
  {
    name: 'sunset-alt-flora',
    gradient: 'linear-gradient(110deg, #ffffff 0%, #ffd1a5 20%, #f47c35 45%, #ec5a56 70%, #5b8ef0 90%, #ffffff 100%)',
    shadow: '0 0 25px rgba(255, 255, 255, 0.25), 0 0 45px rgba(244, 124, 53, 0.45)',
    filter: 'drop-shadow(0 0 16px rgba(236, 90, 86, 0.35))',
  },
  {
    name: 'botanical-emerald-vine',
    gradient: 'linear-gradient(110deg, #ffffff 0%, #d1fae5 20%, #39a77b 45%, #d17d91 70%, #d4d98b 90%, #ffffff 100%)',
    shadow: '0 0 25px rgba(255, 255, 255, 0.25), 0 0 45px rgba(57, 167, 123, 0.45)',
    filter: 'drop-shadow(0 0 16px rgba(209, 125, 145, 0.35))',
  },
  {
    name: 'prismatic-garden',
    gradient: 'linear-gradient(110deg, #ffffff 0%, #39a77b 18%, #426de9 36%, #d99af4 54%, #ec5a56 72%, #f47c35 90%, #ffffff 100%)',
    shadow: '0 0 25px rgba(255, 255, 255, 0.25), 0 0 50px rgba(217, 154, 244, 0.55)',
    filter: 'drop-shadow(0 0 18px rgba(183, 122, 255, 0.45))',
  },
];

function DhrisniGarden({ className = '' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [nextColorIdx, setNextColorIdx] = useState(null);
  const [isColorTransitioning, setIsColorTransitioning] = useState(false);

  // Auto-cycle through the vibrant garden color palettes every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveColorIdx((curr) => {
        const next = (curr + 1) % GARDEN_COLOR_PALETTES.length;
        setNextColorIdx(next);
        setIsColorTransitioning(true);

        setTimeout(() => {
          setActiveColorIdx(next);
          setNextColorIdx(null);
          setIsColorTransitioning(false);
        }, 1200);

        return curr;
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

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

  // Replay sequence silently without intrusive sounds
  const handleReplay = useCallback(() => {
    setAnimationKey((prev) => prev + 1);
    setActiveColorIdx((curr) => (curr + 1) % GARDEN_COLOR_PALETTES.length);
  }, []);

  // Initialize and size stardust canvas with high DPI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Ultra-Smooth 120 FPS Stardust Loop (Zero React state updates, 100% consistent)
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
        p.vy -= 0.02; // subtle cosmic upward drift
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

        // Core star glint (4-pointed diamond)
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.8);
        ctx.quadraticCurveTo(size * 0.2, 0, size * 1.8, 0);
        ctx.quadraticCurveTo(size * 0.2, 0, 0, size * 1.8);
        ctx.quadraticCurveTo(-size * 0.2, 0, -size * 1.8, 0);
        ctx.quadraticCurveTo(-size * 0.2, 0, 0, -size * 1.8);
        ctx.fill();

        // Soft starlight halo center
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
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

  // Smooth, continuous cursor stardust spawner
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spawns 2 graceful, consistent stardust particles per move
    for (let i = 0; i < 2; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.4,
        size: Math.random() * 3.5 + 2.5,
        color: Math.random() > 0.45 ? '#f5d5ff' : '#bd78dc',
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        life: 1.0,
        decay: Math.random() * 0.025 + 0.02
      });
    }

    // Keep memory clean: max 45 active stardust points
    if (particlesRef.current.length > 45) {
      particlesRef.current.splice(0, particlesRef.current.length - 45);
    }

    runStardustLoop();
  }, [runStardustLoop]);

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
      key={animationKey}
      className={`relative w-full max-w-[940px] mx-auto select-none overflow-visible group ${className}`}
      onMouseMove={handleMouseMove}
      onClick={handleReplay}
      style={{ cursor: 'pointer' }}
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
          margin: 0;
          white-space: nowrap;
          font-family: 'Bodoni 72', 'Didot', 'Cinzel', 'Playfair Display', 'Baskerville', 'Times New Roman', serif;
          font-size: clamp(3.2rem, 9.5vw, 7.8rem);
          font-weight: 600;
          letter-spacing: -0.045em;
          line-height: 1;
          opacity: 0;
          transform: translateY(14px) scale(0.92);
          display: inline-grid;
          place-items: center;
        }

        .in-view .word {
          animation: wordReveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s forwards;
        }

        .word-layer {
          grid-area: 1 / 1;
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: wordShimmer 6s ease-in-out infinite;
          transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), filter 1.2s ease;
          will-change: background-position, opacity;
          display: inline-block;
          user-select: none;
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
          filter: drop-shadow(0 0 5px rgba(183, 122, 255, 0.55));
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
          filter: drop-shadow(0 0 8px rgba(143, 91, 255, 0.65));
        }

        .in-view .leaf {
          animation: leafOpen 0.75s cubic-bezier(0.2, 1.45, 0.35, 1) var(--t) forwards;
        }

        @keyframes leafOpen {
          0% {
            opacity: 0;
            transform: scale(0.08) rotate(-25deg);
          }
          75% {
            opacity: 1;
            transform: scale(1.15) rotate(6deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        /* Jumping stars */
        .jump-star {
          fill: #f0caff;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0 0 5px #d99aff) drop-shadow(0 0 12px #a94ee8);
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
            transform: translateY(-9px) scale(1.22) rotate(8deg);
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
            filter: drop-shadow(0 0 5px #d99aff) drop-shadow(0 0 10px rgba(169, 78, 232, 0.7));
            opacity: 0.82;
          }
          50% {
            filter: drop-shadow(0 0 10px #f2d5ff) drop-shadow(0 0 22px #b65cff);
            opacity: 1;
          }
        }

        /* Blooming purple stars */
        .bloom-star {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0 0 11px rgba(199, 122, 255, 0.9)) drop-shadow(0 0 28px rgba(155, 75, 220, 0.7));
        }

        .in-view .bloom-star {
          animation: starBloom 0.9s cubic-bezier(0.18, 1.2, 0.3, 1) var(--t) forwards,
            starGlow 3.2s ease-in-out calc(var(--t) + 0.9s) infinite;
        }

        @keyframes starBloom {
          0% {
            opacity: 0;
            transform: scale(0.1) rotate(-20deg);
          }
          65% {
            opacity: 1;
            transform: scale(1.14) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes starGlow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(189, 120, 220, 0.75)) drop-shadow(0 0 18px rgba(155, 75, 220, 0.55));
            transform: scale(1) rotate(0deg);
          }
          50% {
            filter: drop-shadow(0 0 15px #e0b4ff) drop-shadow(0 0 32px rgba(169, 91, 236, 0.85));
            transform: scale(1.06) rotate(3deg);
          }
        }

        /* GPU-Composited Orbiting Flying Stars */
        .flyers {
          pointer-events: none;
          overflow: visible;
        }

        .flyer-node {
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0 0 7px #d9a1ff) drop-shadow(0 0 16px #a65be0);
          will-change: transform, offset-distance;
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
            filter: drop-shadow(0 0 11px #ffffff) drop-shadow(0 0 24px #c476ff);
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
      <div className={`dhrisni-stage ${inView ? 'in-view' : ''} relative w-full h-[clamp(210px,28vw,320px)] flex items-center justify-center`}>
        {/* Core Hero Wordmark with Garden Color Cycling */}
        <h1 className="word" aria-label="Dhrisni">
          <span
            className="word-layer"
            style={{
              backgroundImage: GARDEN_COLOR_PALETTES[activeColorIdx].gradient,
              textShadow: GARDEN_COLOR_PALETTES[activeColorIdx].shadow,
              filter: GARDEN_COLOR_PALETTES[activeColorIdx].filter,
              opacity: isColorTransitioning ? 0 : 1,
            }}
          >
            DHRISNI
          </span>
          {nextColorIdx !== null && (
            <span
              className="word-layer incoming"
              style={{
                backgroundImage: GARDEN_COLOR_PALETTES[nextColorIdx].gradient,
                textShadow: GARDEN_COLOR_PALETTES[nextColorIdx].shadow,
                filter: GARDEN_COLOR_PALETTES[nextColorIdx].filter,
                opacity: isColorTransitioning ? 1 : 0,
              }}
              aria-hidden="true"
            >
              DHRISNI
            </span>
          )}
        </h1>

        {/* High-Fidelity Botanical & Purple Flying Stars SVG Layer */}
        <svg
          className="botanical"
          viewBox="0 0 900 330"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="vineGradient" x1="0" y1="0" x2="0.8" y2="1">
              <stop stopColor="#39a77b" />
              <stop offset="0.48" stopColor="#d17d91" />
              <stop offset="1" stopColor="#d4d98b" />
            </linearGradient>

            <linearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#426de9" />
              <stop offset="0.42" stopColor="#70a9f4" />
              <stop offset="0.72" stopColor="#f18b54" />
              <stop offset="1" stopColor="#f04435" />
            </linearGradient>

            <linearGradient id="leafGradientAlt" x1="0" y1="1" x2="1" y2="0">
              <stop stopColor="#f47c35" />
              <stop offset="0.48" stopColor="#ec5a56" />
              <stop offset="1" stopColor="#5b8ef0" />
            </linearGradient>

            <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#d99af4" />
              <stop offset="0.55" stopColor="#b96cdb" />
              <stop offset="1" stopColor="#9650c6" />
            </linearGradient>

            {/* Botanical Leaf A */}
            <g id="leafA">
              <path
                d="M0 0 C-12 -12 -42 -15 -43 -39 C-45 -61 -20 -65 -5 -48 C2 -66 29 -65 34 -46 C42 -20 16 -8 0 0Z"
                fill="url(#leafGradient)"
              />
              <path d="M0 0 Q-4 -25 -7 -51" stroke="#9bd9b4" strokeWidth="1.4" fill="none" opacity="0.75" />
              <path d="M-7 -33 Q-20 -43 -30 -45" stroke="#b9c9ff" strokeWidth="1" fill="none" opacity="0.65" />
            </g>

            {/* Botanical Leaf B */}
            <g id="leafB">
              <path
                d="M0 0 C-18 -8 -43 -1 -49 -21 C-57 -45 -31 -59 -12 -42 C-5 -64 22 -60 28 -40 C35 -19 15 -5 0 0Z"
                fill="url(#leafGradientAlt)"
              />
              <path d="M0 0 Q-8 -23 -16 -46" stroke="#ffd1a5" strokeWidth="1.4" fill="none" opacity="0.75" />
            </g>

            {/* High-Haute Purple Blooming Star Symbol */}
            <g id="purpleStar">
              <path
                d="M0 -48 C5 -12 12 -5 48 0 C12 5 5 12 0 48 C-5 12 -12 5 -48 0 C-12 -5 -5 -12 0 -48Z"
                fill="url(#starGradient)"
                stroke="#8d43b7"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M0 -48 C5 -12 12 -5 48 0 C12 5 5 12 0 48 C-5 12 -12 5 -48 0 C-12 -5 -5 -12 0 -48Z"
                fill="none"
                stroke="#e6b5ff"
                strokeWidth="1"
                opacity="0.32"
              />
              <path
                d="M-8 -23 Q-2 -34 4 -31"
                fill="none"
                stroke="#e7baff"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.7"
              />
              <circle cx="-13" cy="-19" r="3.5" fill="#f0ceff" opacity="0.55" />
            </g>

            {/* Flight Star Symbol */}
            <g id="flightStar">
              <path
                d="M0 -17 C2.2 -5.5 5.5 -2.2 17 0 C5.5 2.2 2.2 5.5 0 17 C-2.2 5.5 -5.5 2.2 -17 0 C-5.5 -2.2 -2.2 -5.5 0 -17Z"
                fill="#d9a1ff"
                stroke="#a65be0"
                strokeWidth="1.5"
              />
              <path
                d="M0 -14 C2 -5 5 -2 14 0 C5 2 2 5 0 14 C-2 5 -5 2 -14 0 C-5 -2 -2 -5 0 -14Z"
                fill="none"
                stroke="#f4dcff"
                strokeWidth="1"
                opacity="0.8"
              />
              <circle cx="-4" cy="-5" r="2" fill="#fff0ff" opacity="0.9" />
            </g>
          </defs>

          {/* Ambient Micro-Constellation Stars (Background Depth) */}
          <g className="micro-constellation" opacity="0.65">
            <circle cx="110" cy="70" r="1.5" fill="#f0caff" className="micro-twinkle" style={{ '--spd': '2.1s', '--dly': '0.1s' }} />
            <circle cx="230" cy="50" r="1.2" fill="#e6b5ff" className="micro-twinkle" style={{ '--spd': '3.2s', '--dly': '0.7s' }} />
            <circle cx="410" cy="45" r="1.8" fill="#ffffff" className="micro-twinkle" style={{ '--spd': '1.8s', '--dly': '1.2s' }} />
            <circle cx="510" cy="55" r="1.4" fill="#d9a1ff" className="micro-twinkle" style={{ '--spd': '2.7s', '--dly': '0.4s' }} />
            <circle cx="680" cy="45" r="1.6" fill="#f4dcff" className="micro-twinkle" style={{ '--spd': '3.5s', '--dly': '1.5s' }} />
            <circle cx="820" cy="80" r="1.3" fill="#ffffff" className="micro-twinkle" style={{ '--spd': '2.3s', '--dly': '0.9s' }} />
            <circle cx="95" cy="285" r="1.5" fill="#e6b5ff" className="micro-twinkle" style={{ '--spd': '2.9s', '--dly': '1.1s' }} />
            <circle cx="210" cy="290" r="1.2" fill="#f0caff" className="micro-twinkle" style={{ '--spd': '1.9s', '--dly': '0.3s' }} />
            <circle cx="490" cy="285" r="1.6" fill="#ffffff" className="micro-twinkle" style={{ '--spd': '3.1s', '--dly': '1.7s' }} />
            <circle cx="790" cy="290" r="1.4" fill="#d9a1ff" className="micro-twinkle" style={{ '--spd': '2.4s', '--dly': '0.6s' }} />
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
          <g className="jump-star" style={{ '--t': '2.25s' }} transform="translate(225 205) scale(.42)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '2.55s' }} transform="translate(340 190) scale(.32)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '2.85s' }} transform="translate(470 218) scale(.38)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '3.15s' }} transform="translate(575 190) scale(.3)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '3.45s' }} transform="translate(690 207) scale(.4)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '3.75s' }} transform="translate(285 94) scale(.26)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>
          <g className="jump-star" style={{ '--t': '4.05s' }} transform="translate(640 96) scale(.28)">
            <path d="M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4Z" />
          </g>

          {/* Blooming Purple Stars */}
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

          {/* Orbiting Flying Lavender Stars */}
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

        {/* 120 FPS High-Performance Canvas Stardust Trail (Zero React State, Consistent & Smooth) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  );
}

export default memo(DhrisniGarden);
