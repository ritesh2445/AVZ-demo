import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';

export default function DhristroyerAnimatedHeading() {
  // Minimalist Staged Arrival:
  // Stage 0: Initial
  // Stage 1: "✦ MEET THE MOTHER" softly appears
  // Stage 2: "DHRISNI (DHRISTROYER)" fades in smoothly on a strictly single line
  const [stage, setStage] = useState(0);

  const triggerSequence = () => {
    setStage(0);
    // Minimal, calm, reduced-motion entrance
    const t1 = setTimeout(() => {
      setStage(1);
    }, 100);

    const t2 = setTimeout(() => {
      setStage(2);
      try {
        playSound('pip');
      } catch (e) {}
    }, 400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  useEffect(() => {
    const cleanup = triggerSequence();
    return cleanup;
  }, []);

  return (
    <div className="relative block my-3 select-none text-left bg-transparent max-w-full overflow-hidden">
      {/* 
        Modern Avant-Garde Typography (Syne):
        - Strictly ONE LINE (whitespace-nowrap, fluid responsive scale)
        - Blended directly into the site's dark background
        - Frameless, zero extra boxes or frames
        - Zero 3D movements, minimal smooth fade transition
      */}

      {/* =========================================================
          STAGE 1: "MEET THE MOTHER" (Minimal subtle fade)
          ========================================================= */}
      <div className="flex items-center gap-2.5 mb-1.5 whitespace-nowrap">
        <div
          className={`flex items-center gap-2.5 transition-opacity duration-300 ease-out ${
            stage >= 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="w-1.5 h-1.5 rotate-45 bg-[#f472b6] shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
          <span className="font-mono text-[11px] sm:text-xs md:text-sm tracking-[0.35em] uppercase text-pink-300/90 font-medium">
            MEET THE MOTHER
          </span>
          <span className="text-silver/40 font-mono text-[10px] tracking-widest hidden sm:inline-block">
            • STUDIO FOUNDER
          </span>
          <span className="w-8 h-[1px] bg-gradient-to-r from-[#be185d]/80 to-transparent" />
        </div>
      </div>

      {/* =========================================================
          STAGE 2: "DHRISNI (DHRISTROYER)" - STRICTLY ONE LINE
          ========================================================= */}
      <div
        className={`transition-opacity duration-400 ease-out ${
          stage >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Main Modern Typography - Strictly Single Line with Fluid Responsive Clamp */}
        <h2 className="font-syne font-extrabold uppercase leading-none whitespace-nowrap inline-flex items-baseline gap-x-2 sm:gap-x-3.5 my-1">
          {/* Primary Name: Crisp Titanium White */}
          <span className="text-white text-[clamp(1.5rem,4.2vw,5.5rem)] tracking-tight drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]">
            DHRISNI
          </span>

          {/* Alias: AVZ Haute Pink Gradient Accent */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f472b6] via-[#ec4899] to-[#be185d] font-bold text-[clamp(1.2rem,3.4vw,4.5rem)] tracking-normal drop-shadow-[0_0_20px_rgba(244,114,182,0.3)]">
            (DHRISTROYER)
          </span>
        </h2>

        {/* Minimalist Frameless Metadata Ribbon */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-2.5 pt-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-silver/60 uppercase">
          <div className="flex items-center gap-1.5 text-white/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6] shadow-[0_0_6px_#f472b6]" />
            <span>FOUNDER & CREATIVE DIRECTOR</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="text-[#f472b6]">
            <span>GUWAHATI STUDIO</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="text-silver/50 hidden sm:inline">
            <span>UPCYCLED HARDWARE • AVANT-GARDE DESIGNS</span>
          </div>

          {/* Replay Transition */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerSequence();
            }}
            title="Replay sequence"
            className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-silver/40 hover:text-pink-300 transition-colors cursor-pointer"
          >
            <span>↻</span>
            <span>REPLAY</span>
          </button>
        </div>
      </div>
    </div>
  );
}
