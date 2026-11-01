'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gardenItems from '../data/dhrisniGardenData.json';

import { playSound } from '../utils/audio';

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
    id: 'orchid-bloom',
    name: 'Orchid Bloom',
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

export default function DhrisniGarden({ className = '', onPaletteChange }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const cachedPathsRef = useRef([]);

  const [paletteIdx, setPaletteIdx] = useState(0); // Starts on Rose Noir (Red & Blue)
  const currentPalette = GARDEN_PALETTES[paletteIdx];

  // Cache interactive flower nodes once on mount (0 re-queries)
  useEffect(() => {
    if (!svgRef.current) return;
    const nodes = [];
    const elements = svgRef.current.querySelectorAll('.dhrisni-interactive-node');
    elements.forEach((el) => {
      const cx = parseFloat(el.getAttribute('data-cx') || '0');
      const cy = parseFloat(el.getAttribute('data-cy') || '0');
      nodes.push({ el, cx, cy, hasMoved: false });
    });
    cachedPathsRef.current = nodes;
  }, []);

  // Instantaneous 0ms hover reach directly via translate3d (zero re-render lag)
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 1085 + 215;
    const my = ((e.clientY - rect.top) / rect.height) * 405 + 155;

    const nodes = cachedPathsRef.current;
    const len = nodes.length;

    for (let i = 0; i < len; i++) {
      const node = nodes[i];
      const dx = mx - node.cx;
      const dy = my - node.cy;

      if (Math.abs(dx) > 220 || Math.abs(dy) > 220) {
        if (node.hasMoved) {
          node.el.style.transform = '';
          node.hasMoved = false;
        }
        continue;
      }

      const dist = Math.hypot(dx, dy);
      if (dist < 220 && dist > 1) {
        const f = (1 - dist / 220) * 12;
        const rx = (dx / dist) * f;
        const ry = (dy / dist) * f;
        node.el.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        node.hasMoved = true;
      } else if (node.hasMoved) {
        node.el.style.transform = '';
        node.hasMoved = false;
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const nodes = cachedPathsRef.current;
    const len = nodes.length;
    for (let i = 0; i < len; i++) {
      const node = nodes[i];
      if (node.hasMoved) {
        node.el.style.transform = '';
        node.hasMoved = false;
      }
    }
  }, []);

  // Instant silky smooth palette morphing on click (zero lag)
  const handleGardenClick = useCallback(() => {
    playSound?.('sparkle');
    setPaletteIdx((prev) => {
      const next = (prev + 1) % GARDEN_PALETTES.length;
      if (onPaletteChange) onPaletteChange(GARDEN_PALETTES[next]);
      return next;
    });
  }, [onPaletteChange]);

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Dynamic Ambient Glow Behind Artwork */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${currentPalette.ambientGrad1}, transparent 70%), radial-gradient(ellipse 55% 45% at 50% 75%, ${currentPalette.ambientGrad2}, transparent 70%)`
        }}
      />

      {/* SVG Living Artwork Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleGardenClick}
        className="relative w-full cursor-pointer group"
      >
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="215 155 1085 405"
          className="w-full h-auto max-h-[190px] sm:max-h-[270px] md:max-h-[340px] object-contain transition-transform duration-150 ease-out group-hover:scale-[1.01]"
          style={{
            filter: `drop-shadow(0 12px 40px ${currentPalette.glow})`
          }}
        >
          <defs>
            <style>{`
              .dhrisni-char {
                font-family: var(--font-cinzel), 'Cinzel', Georgia, serif;
                font-weight: 700;
                letter-spacing: 0.04em;
              }
            `}</style>

            {/* Glowing filter for flower petals */}
            <filter id="bloomGlowDynamic" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {gardenItems.map((item, i) => {
            if (item.type === 'text') {
              return (
                <text
                  key={`txt-${item.id}-${i}`}
                  id={item.id}
                  x={item.x}
                  y={parseFloat(item.y)}
                  textAnchor="middle"
                  fontSize={item.fontSize}
                  className="dhrisni-char"
                  fill={currentPalette.text}
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

            const isInteractive = isPetal || isLeaf || isAccent || isVein;

            return (
              <path
                key={`path-${i}`}
                d={item.d}
                fill={fill}
                stroke={stroke}
                strokeWidth={item.strokeWidth || undefined}
                strokeLinecap={item.strokeLinecap || undefined}
                strokeLinejoin={item.strokeLinejoin || undefined}
                data-cx={item.cx}
                data-cy={item.cy}
                className={isInteractive ? 'dhrisni-interactive-node' : undefined}
                style={{
                  transformBox: isInteractive ? 'fill-box' : undefined,
                  transformOrigin: isInteractive ? 'center' : undefined,
                  filter: isPetal ? 'url(#bloomGlowDynamic)' : undefined
                }}
              />
            );
          })}
        </svg>

        {/* Ambient floating pollen matching palette */}
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
