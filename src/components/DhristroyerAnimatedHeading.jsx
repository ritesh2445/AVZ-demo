import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';

export default function DhristroyerAnimatedHeading() {
  // Minimalist Staged Arrival:
  // Stage 0: Initial
  // Stage 1: "MEET THE MOTHER" softly appears (minimal transition)
  // Stage 2: "DHRISNI (DHRISTROYER)" softly fades in with zero 3D movement
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
    }, 450);

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
    <div className="relative block my-3 select-none text-left max-w-4xl">
      {/* 
        Whiter Background Editorial Card:
        Clean, crisp, high-fashion white canvas with stark black typography,
        haute dark-pink accents, zero 3D rotation, and minimal smooth transition.
      */}
      <div className="bg-white text-black rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_15px_40px_rgba(255,255,255,0.12)] border border-white/80 transition-all duration-300">
        
        {/* =========================================================
            STAGE 1: "MEET THE MOTHER" (Minimal fade transition)
            ========================================================= */}
        <div className="flex flex-col items-start gap-1 mb-2">
          <div
            className={`flex items-center gap-2.5 transition-opacity duration-300 ease-out ${
              stage >= 1 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="w-2 h-2 rotate-45 bg-[#be185d]" />
            <span className="font-cinzel text-xs sm:text-[13px] tracking-[0.32em] uppercase text-[#be185d] font-bold">
              MEET THE MOTHER
            </span>
            <span className="text-zinc-400 font-mono text-[10px] tracking-widest hidden sm:inline-block">
              // MASTER ARCHITECT
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-r from-[#be185d] to-transparent" />
          </div>

          {/* Minimalist divider line */}
          <div
            className={`h-[1px] w-full max-w-[220px] bg-gradient-to-r from-[#be185d] via-[#f472b6] to-transparent transition-opacity duration-300 ${
              stage >= 1 ? 'opacity-70' : 'opacity-0'
            }`}
          />
        </div>

        {/* =========================================================
            STAGE 2: "DHRISNI (DHRISTROYER)" (Minimal fade, zero 3D movement)
            ========================================================= */}
        <div
          className={`transition-all duration-400 ease-out ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
        >
          {/* Main Typography - Crisp, Flat, High-Fashion Editorial */}
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight font-spartan leading-none uppercase flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 my-1">
            {/* Primary Name in Stark Deep Black */}
            <span className="text-black font-black">
              DHRISNI
            </span>

            {/* Alias in Haute Dark Pink */}
            <span className="text-[#be185d] font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
              (DHRISTROYER)
            </span>
          </h2>

          {/* Minimalist Editorial Metadata Ribbon */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 pt-2.5 border-t border-black/10 text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-600 uppercase">
            <div className="flex items-center gap-1.5 text-zinc-900 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#be185d]" />
              <span>FOUNDER & CREATIVE DIRECTOR</span>
            </div>
            <span className="text-zinc-300">•</span>
            <div className="text-[#be185d] font-semibold">
              <span>GUWAHATI ATELIER</span>
            </div>
            <span className="text-zinc-300 hidden sm:inline">•</span>
            <div className="text-zinc-500 hidden sm:inline">
              <span>UPCYCLED HARDWARE // AVANT-GARDE ARMOR</span>
            </div>

            {/* Replay Transition Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerSequence();
              }}
              title="Replay Minimal Transition"
              className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-600 hover:text-black hover:bg-black/5 border border-black/15 transition-all cursor-pointer"
            >
              <span>↻</span>
              <span>REPLAY</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
