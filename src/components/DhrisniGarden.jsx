'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gardenItems from '../data/dhrisniGardenData.json';

// Curated high-fashion dark-canvas palettes (including user's requested Red & Blue)
export const GARDEN_PALETTES = [
  {
    id: 'rose-noir',
    name: 'Rose Noir',
    sub: 'Crimson Red & Royal Blue',
    petal: '#FF1400',       // Vivid Crimson Red
    petalAccent: '#FFB4A8', // Soft Rose Pink highlight
    vine: '#2563EB',        // Electric Royal Blue
    leaf: '#3B82F6',        // Cobalt Blue
    vein: '#1D4ED8',        // Deep Indigo Blue
    text: '#FFFFFF',
    glow: 'rgba(255, 20, 0, 0.45)',
    ambientGrad1: 'rgba(255, 20, 0, 0.14)',
    ambientGrad2: 'rgba(37, 99, 235, 0.12)',
    swatch: ['#FF1400', '#2563EB']
  },
  {
    id: 'electric-sapphire',
    name: 'Sapphire & Scarlet',
    sub: 'Electric Blue & Scarlet Red',
    petal: '#3B82F6',       // Vibrant Blue Roses
    petalAccent: '#93C5FD', // Soft Sky Blue
    vine: '#EF4444',        // Scarlet Red Vines
    leaf: '#F43F5E',        // Rose Red Leaves
    vein: '#9F1239',        // Deep Crimson
    text: '#FFFFFF',
    glow: 'rgba(59, 130, 246, 0.45)',
    ambientGrad1: 'rgba(59, 130, 246, 0.14)',
    ambientGrad2: 'rgba(239, 68, 68, 0.12)',
    swatch: ['#3B82F6', '#EF4444']
  },
  {
    id: 'orchid-atelier',
    name: 'Orchid Atelier',
    sub: 'Cyber Magenta & Emerald Teal',
    petal: '#E63CFF',       // Neon Orchid Magenta
    petalAccent: '#F9D1FF', // Lavender Pink
    vine: '#2FB8A6',        // Emerald Teal
    leaf: '#2FB8A6',        // Emerald
    vein: '#0a3d34',        // Deep Forest
    text: '#FFFFFF',
    glow: 'rgba(230, 60, 255, 0.45)',
    ambientGrad1: 'rgba(230, 60, 255, 0.12)',
    ambientGrad2: 'rgba(47, 184, 166, 0.10)',
    swatch: ['#E63CFF', '#2FB8A6']
  },
  {
    id: 'midnight-azure',
    name: 'Midnight Azure',
    sub: 'Coral Flame & Neon Ice',
    petal: '#FF5A4E',       // Electric Coral Red
    petalAccent: '#FFD6CF', // Pale Coral
    vine: '#60A5FA',        // Electric Ice Blue
    leaf: '#38BDF8',        // Cyan Blue
    vein: '#0284C7',        // Ocean Blue
    text: '#FFFFFF',
    glow: 'rgba(56, 189, 248, 0.45)',
    ambientGrad1: 'rgba(255, 90, 78, 0.12)',
    ambientGrad2: 'rgba(96, 165, 250, 0.12)',
    swatch: ['#FF5A4E', '#60A5FA']
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    sub: 'Electric Cyan & Acid Pink',
    petal: '#00F0FF',       // Radiant Cyan
    petalAccent: '#E0F7FA', // Icy White Cyan
    vine: '#FF007F',        // Neon Hot Pink
    leaf: '#EC4899',        // Hot Pink Leaves
    vein: '#831843',        // Dark Plum
    text: '#FFFFFF',
    glow: 'rgba(0, 240, 255, 0.45)',
    ambientGrad1: 'rgba(0, 240, 255, 0.12)',
    ambientGrad2: 'rgba(255, 0, 127, 0.12)',
    swatch: ['#00F0FF', '#FF007F']
  },
  {
    id: 'citrus-aurora',
    name: 'Citrus Aurora',
    sub: 'Amber Flame & Electric Jade',
    petal: '#FF8A00',       // Tangerine Flame
    petalAccent: '#FFE2B8', // Warm Honey
    vine: '#10B981',        // Electric Jade Green
    leaf: '#059669',        // Emerald
    vein: '#064E3B',        // Deep Forest
    text: '#FFF6E8',
    glow: 'rgba(255, 138, 0, 0.45)',
    ambientGrad1: 'rgba(255, 138, 0, 0.12)',
    ambientGrad2: 'rgba(16, 185, 129, 0.10)',
    swatch: ['#FF8A00', '#10B981']
  },
  {
    id: 'amethyst-gold',
    name: 'Amethyst & Gold',
    sub: 'Ultraviolet & Cyberpunk Gold',
    petal: '#A855F7',       // Electric Purple
    petalAccent: '#E9D5FF', // Lilac
    vine: '#EAB308',        // Cyberpunk Gold
    leaf: '#CA8A04',        // Rich Gold
    vein: '#713F12',        // Bronze
    text: '#FFFFFF',
    glow: 'rgba(168, 85, 247, 0.45)',
    ambientGrad1: 'rgba(168, 85, 247, 0.12)',
    ambientGrad2: 'rgba(234, 179, 8, 0.10)',
    swatch: ['#A855F7', '#EAB308']
  }
];

const GROWTH_PATTERNS = [
  { id: 'center-outward', name: 'Center Ripple' },
  { id: 'left-to-right', name: 'Dawn Sweep' },
  { id: 'right-to-left', name: 'Evening Gust' },
  { id: 'organic-clusters', name: 'Constellation Burst' },
  { id: 'superbloom', name: 'Wild Superbloom' }
];

export default function DhrisniGarden({ className = '', onPaletteChange }) {
  const containerRef = useRef(null);
  const [paletteIdx, setPaletteIdx] = useState(0); // Starts on Rose Noir (Red & Blue)
  const [patternIdx, setPatternIdx] = useState(0);
  const [bloomProgress, setBloomProgress] = useState(0); // 0 to 1
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [swayTime, setSwayTime] = useState(0);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000));

  const currentPalette = GARDEN_PALETTES[paletteIdx];
  const currentPattern = GROWTH_PATTERNS[patternIdx];

  // Random parameters seeded per regrowth
  const seedParams = useMemo(() => {
    // Generate pseudorandom cluster delays and spring constants based on current seed
    const clusterOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.sin(seed + Math.random()) - 0.5);
    const clusterDelays = {};
    clusterOrder.forEach((cId, rank) => {
      clusterDelays[cId] = rank * 0.08;
    });

    const springK = 6 + (seed % 4); // 6 to 9 stiffness
    const springW = 14 + (seed % 6); // 14 to 19 frequency

    return {
      clusterDelays,
      springK,
      springW,
      swaySpeed: 1.8 + ((seed % 5) * 0.15),
      swayAmp: 1.4 + ((seed % 4) * 0.2)
    };
  }, [seed]);

  // Spring formula from Type Garden: 1 - exp(-t*k) * cos(t*w)
  const spr = useCallback((t, k = seedParams.springK, w = seedParams.springW) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.exp(-t * k) * Math.cos(t * w);
  }, [seedParams.springK, seedParams.springW]);

  // Ease out cubic
  const eo = (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return 1 - Math.pow(1 - t, 3);
  };

  // Trigger regrowth with optional new palette and new growth pattern
  const triggerRegrowth = useCallback((newPalIdx = null) => {
    setBloomProgress(0);
    const nextSeed = Math.floor(Math.random() * 10000);
    setSeed(nextSeed);

    // Pick new growth pattern
    setPatternIdx(prev => (prev + 1) % GROWTH_PATTERNS.length);

    // Shift palette if requested or cycle to next
    if (newPalIdx !== null) {
      setPaletteIdx(newPalIdx);
      if (onPaletteChange) onPaletteChange(GARDEN_PALETTES[newPalIdx]);
    } else {
      setPaletteIdx(prev => {
        const next = (prev + 1) % GARDEN_PALETTES.length;
        if (onPaletteChange) onPaletteChange(GARDEN_PALETTES[next]);
        return next;
      });
    }

    let start = performance.now();
    const duration = 2200; // 2.2s organic blossom

    function animate(now) {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / duration);
      setBloomProgress(p);
      if (p < 1) {
        requestAnimationFrame(animate);
      }
    }
    requestAnimationFrame(animate);
  }, [onPaletteChange]);

  // Initial auto-bloom on scroll into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let triggered = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered) {
          triggered = true;
          const initialPal = Math.floor(Math.random() * GARDEN_PALETTES.length);
          triggerRegrowth(initialPal);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerRegrowth]);

  // Continuous living organic sway (Type Garden Breathe mode)
  useEffect(() => {
    let animId;
    let t0 = performance.now();

    function loop(now) {
      setSwayTime((now - t0) * 0.001);
      animId = requestAnimationFrame(loop);
    }
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Mouse interactivity (Type Garden Reach mode)
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1085 + 215;
    const y = ((e.clientY - rect.top) / rect.height) * 405 + 155;
    setMousePos({ x, y, active: true });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, active: false }));
  };

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Dynamic Ambient Glow Behind Artwork */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${currentPalette.ambientGrad1}, transparent 70%), radial-gradient(ellipse 55% 45% at 50% 75%, ${currentPalette.ambientGrad2}, transparent 70%)`
        }}
      />

      {/* SVG Living Artwork Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => triggerRegrowth()}
        className="relative w-full cursor-pointer group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="215 155 1085 405"
          className="w-full h-auto max-h-[190px] sm:max-h-[270px] md:max-h-[340px] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          style={{
            filter: `drop-shadow(0 12px 40px ${currentPalette.glow})`
          }}
        >
          <defs>
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
              .dhrisni-char {
                font-family: 'Playfair Display', Georgia, serif;
                font-weight: 700;
                letter-spacing: 0.02em;
              }
            `}</style>

            {/* Glowing filter for blooming flower petals */}
            <filter id="bloomGlowDynamic" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {gardenItems.map((item, i) => {
            if (item.type === 'text') {
              // Letters fade in with crisp luminance during the first 35% of bloom
              const textDelay = 0.04 * (i - 135);
              const textT = Math.max(0, Math.min(1, (bloomProgress - textDelay) / 0.35));
              const textOpacity = eo(textT);
              const textYOffset = (1 - textOpacity) * 14;

              return (
                <text
                  key={`txt-${item.id}-${i}`}
                  id={item.id}
                  x={item.x}
                  y={parseFloat(item.y) + textYOffset}
                  textAnchor="middle"
                  fontSize={item.fontSize}
                  className="dhrisni-char"
                  fill={currentPalette.text}
                  opacity={textOpacity}
                  style={{
                    filter: 'drop-shadow(0 2px 14px rgba(255,255,255,0.28))'
                  }}
                >
                  {item.char}
                </text>
              );
            }

            // Path roles: vine, leaf, petal, accent, vein
            const isVine = item.role === 'vine';
            const isLeaf = item.role === 'leaf';
            const isPetal = item.role === 'petal';
            const isAccent = item.role === 'accent';
            const isVein = item.role === 'vein';

            // Normalized position coords
            const normX = Math.max(0, Math.min(1, (item.cx - 215) / 1085));
            const distFromCenter = Math.abs(item.cx - 750) / 540; // 0 (center) to 1 (edges)

            // DYNAMIC GROWTH PATTERNS CALCULATION:
            let sproutDelay = 0;
            switch (currentPattern.id) {
              case 'center-outward':
                sproutDelay = 0.05 + distFromCenter * 0.4;
                break;
              case 'right-to-left':
                sproutDelay = 0.05 + (1 - normX) * 0.4;
                break;
              case 'organic-clusters':
                // Seed-based cluster assignment
                const clusterKey = Math.floor(normX * 10);
                sproutDelay = 0.05 + (seedParams.clusterDelays[clusterKey] || 0.2);
                break;
              case 'superbloom':
                // Chaotic simultaneous burst
                sproutDelay = 0.05 + ((Math.sin(i * 1.7 + seed) * 0.5 + 0.5) * 0.25);
                break;
              case 'left-to-right':
              default:
                sproutDelay = 0.05 + normX * 0.4;
                break;
            }

            let scale = 1;
            let opacity = 1;
            let pathOffset = 0;

            if (isVine) {
              const vineT = Math.max(0, Math.min(1, (bloomProgress - sproutDelay) / 0.45));
              const growth = eo(vineT);
              opacity = growth > 0.01 ? 1 : 0;
              pathOffset = (1 - growth) * 110;
            } else if (isPetal || isAccent || isLeaf || isVein) {
              const petalDelay = sproutDelay + 0.15;
              const bloomT = Math.max(0, Math.min(1, (bloomProgress - petalDelay) / 0.4));
              scale = spr(bloomT);
              opacity = bloomT > 0.01 ? 1 : 0;
            }

            // Organic breathing sway
            const swayPhase = (item.cx * 0.018) + (item.cy * 0.012) + (seed * 0.1);
            const swayMultiplier = isPetal || isLeaf ? 1.3 : 0.7;
            const swayX = Math.sin(swayTime * seedParams.swaySpeed + swayPhase) * seedParams.swayAmp * swayMultiplier;
            const swayY = Math.cos(swayTime * (seedParams.swaySpeed * 0.8) + swayPhase) * (seedParams.swayAmp * 0.7) * swayMultiplier;

            // Interactive mouse reach
            let reachX = 0;
            let reachY = 0;
            if (mousePos.active) {
              const dx = mousePos.x - item.cx;
              const dy = mousePos.y - item.cy;
              const dist = Math.hypot(dx, dy);
              if (dist < 280 && dist > 1) {
                const f = (1 - dist / 280) * 7.5;
                reachX = (dx / dist) * f;
                reachY = (dy / dist) * f;
              }
            }

            const totalDx = swayX + reachX;
            const totalDy = swayY + reachY;

            // Dynamic Palette Colors:
            let fill = 'none';
            let stroke = 'none';
            if (isVine) {
              stroke = currentPalette.vine;
            } else if (isLeaf) {
              fill = currentPalette.leaf;
            } else if (isPetal) {
              fill = currentPalette.petal;
            } else if (isAccent) {
              stroke = currentPalette.petalAccent;
            } else if (isVein) {
              stroke = currentPalette.vein;
            }

            const transformStr = (isPetal || isLeaf || isAccent || isVein)
              ? `translate(${item.cx}, ${item.cy}) translate(${totalDx}, ${totalDy}) scale(${scale}) translate(-${item.cx}, -${item.cy})`
              : `translate(${totalDx * 0.4}, ${totalDy * 0.4})`;

            return (
              <path
                key={`path-${i}`}
                d={item.d}
                fill={fill}
                stroke={stroke}
                strokeWidth={item.strokeWidth || undefined}
                strokeLinecap={item.strokeLinecap || undefined}
                strokeLinejoin={item.strokeLinejoin || undefined}
                opacity={opacity}
                transform={transformStr}
                style={{
                  transformOrigin: `${item.cx}px ${item.cy}px`,
                  transition: 'fill 0.45s ease, stroke 0.45s ease, opacity 0.2s ease',
                  strokeDasharray: isVine ? '120 120' : undefined,
                  strokeDashoffset: isVine ? pathOffset : undefined,
                  filter: isPetal ? 'url(#bloomGlowDynamic)' : undefined
                }}
              />
            );
          })}
        </svg>

        {/* Ambient floating pollen / cyber-garden fireflies matching palette */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full blur-[1px] animate-pulse pointer-events-none transition-colors duration-700"
              style={{
                left: `${18 + i * 13}%`,
                top: `${25 + (i % 3) * 22}%`,
                backgroundColor: i % 2 === 0 ? currentPalette.petal : currentPalette.vine,
                animationDuration: `${2.8 + i * 0.6}s`,
                animationDelay: `${i * 0.4}s`,
                boxShadow: `0 0 14px ${i % 2 === 0 ? currentPalette.petal : currentPalette.vine}`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
