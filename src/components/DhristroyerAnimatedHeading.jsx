import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';

export default function DhristroyerAnimatedHeading() {
  const [isInteractivePushed, setIsInteractivePushed] = useState(false);
  const [activeReaction, setActiveReaction] = useState(null);

  const handleCreatureClick = (creature) => {
    playSound('sparkle');
    setActiveReaction(creature);
    setIsInteractivePushed(true);
    setTimeout(() => {
      setIsInteractivePushed(false);
      setActiveReaction(null);
    }, 1200);
  };

  return (
    <div className="relative inline-block my-2 py-4 select-none">
      <style>{`
        /* 1. Continuous Color Shifting & Shimmer Inside Text */
        @keyframes colorCycleFill {
          0% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 12px rgba(244, 114, 182, 0.75))
                    drop-shadow(0 0 28px rgba(192, 132, 252, 0.5));
          }
          25% {
            background-position: 50% 100%;
            filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.8))
                    drop-shadow(0 0 32px rgba(236, 72, 153, 0.55));
          }
          50% {
            background-position: 100% 50%;
            filter: drop-shadow(0 0 18px rgba(168, 85, 247, 0.85))
                    drop-shadow(0 0 35px rgba(244, 63, 94, 0.6));
          }
          75% {
            background-position: 50% 0%;
            filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.75))
                    drop-shadow(0 0 30px rgba(217, 70, 239, 0.55));
          }
          100% {
            background-position: 0% 50%;
            filter: drop-shadow(0 0 12px rgba(244, 114, 182, 0.75))
                    drop-shadow(0 0 28px rgba(192, 132, 252, 0.5));
          }
        }

        /* 2. Liquid Light Sweep Running Inside Letters */
        @keyframes interiorLightSweep {
          0% {
            transform: translateX(-150%) skewX(-25deg);
          }
          40%, 100% {
            transform: translateX(250%) skewX(-25deg);
          }
        }

        /* 3. Text Elastic Bending (Driven by Creature Pushes) */
        @keyframes textBendingCycle {
          0%, 6% {
            transform: perspective(700px) skewX(0deg) rotate(0deg) translate3d(0, 0, 0);
          }
          /* Left creature pushes hard: Text bends to the right */
          12% {
            transform: perspective(700px) skewX(-4.8deg) rotate(1.2deg) translate3d(7px, 0, 0) scaleX(0.99);
          }
          15% {
            transform: perspective(700px) skewX(-5.5deg) rotate(1.4deg) translate3d(8px, 0, 0) scaleX(0.985);
          }
          /* Spring rebound back */
          20% {
            transform: perspective(700px) skewX(1.8deg) rotate(-0.4deg) translate3d(-2px, 0, 0);
          }
          24% {
            transform: perspective(700px) skewX(-0.8deg) rotate(0.2deg) translate3d(1px, 0, 0);
          }
          28%, 46% {
            transform: perspective(700px) skewX(0deg) rotate(0deg) translate3d(0, 0, 0);
          }
          /* Right creature pushes hard: Text bends to the left */
          52% {
            transform: perspective(700px) skewX(4.8deg) rotate(-1.2deg) translate3d(-7px, 0, 0) scaleX(0.99);
          }
          55% {
            transform: perspective(700px) skewX(5.5deg) rotate(-1.4deg) translate3d(-8px, 0, 0) scaleX(0.985);
          }
          /* Spring rebound back */
          60% {
            transform: perspective(700px) skewX(-1.8deg) rotate(0.4deg) translate3d(2px, 0, 0);
          }
          64% {
            transform: perspective(700px) skewX(0.8deg) rotate(-0.2deg) translate3d(-1px, 0, 0);
          }
          68%, 100% {
            transform: perspective(700px) skewX(0deg) rotate(0deg) translate3d(0, 0, 0);
          }
        }

        /* 4. Left Creature (Onyx Imp) Push Dynamics */
        @keyframes leftCreaturePush {
          0%, 6% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          /* Prepares and leans back */
          9% {
            transform: translate3d(-4px, 1px, 0) rotate(-6deg) scale(0.96);
          }
          /* HEAVY PUSH FORWARD AGAINST TEXT */
          12%, 15% {
            transform: translate3d(8px, -2px, 0) rotate(14deg) scale(1.08, 0.92);
          }
          /* Panting recovery bounce */
          20% {
            transform: translate3d(-2px, 2px, 0) rotate(-3deg) scale(0.98);
          }
          24% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          28%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        /* 5. Right Creature (Void Gargoyle) Push Dynamics */
        @keyframes rightCreaturePush {
          0%, 46% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          /* Prepares and leans back */
          49% {
            transform: translate3d(4px, 1px, 0) rotate(6deg) scale(0.96);
          }
          /* HEAVY PUSH FORWARD AGAINST TEXT */
          52%, 55% {
            transform: translate3d(-8px, -2px, 0) rotate(-14deg) scale(1.08, 0.92);
          }
          /* Panting recovery bounce */
          60% {
            transform: translate3d(2px, 2px, 0) rotate(3deg) scale(0.98);
          }
          64% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
          68%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
          }
        }

        /* 6. Effort Sparks / Strain Beads */
        @keyframes strainPopLeft {
          0%, 9% {
            opacity: 0;
            transform: scale(0) translate3d(0, 0, 0);
          }
          12%, 16% {
            opacity: 1;
            transform: scale(1.2) translate3d(-6px, -12px, 0);
          }
          20%, 100% {
            opacity: 0;
            transform: scale(0.5) translate3d(-10px, -20px, 0);
          }
        }

        @keyframes strainPopRight {
          0%, 49% {
            opacity: 0;
            transform: scale(0) translate3d(0, 0, 0);
          }
          52%, 56% {
            opacity: 1;
            transform: scale(1.2) translate3d(6px, -12px, 0);
          }
          60%, 100% {
            opacity: 0;
            transform: scale(0.5) translate3d(10px, -20px, 0);
          }
        }

        /* 7. Floating Dark Jewellery & Micro Diamonds */
        @keyframes jewelGlintFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
          }
          50% {
            transform: translate3d(0, -6px, 0) rotate(15deg);
            filter: drop-shadow(0 0 10px rgba(244, 114, 182, 0.9))
                    drop-shadow(0 0 15px rgba(168, 85, 247, 0.6));
          }
        }

        @keyframes jewelTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.25) rotate(45deg); }
        }

        .animated-text-container {
          animation: textBendingCycle 6.5s cubic-bezier(0.25, 1, 0.35, 1) infinite;
          transform-origin: center bottom;
          will-change: transform;
        }

        .push-left-creature {
          animation: leftCreaturePush 6.5s cubic-bezier(0.25, 1, 0.35, 1) infinite;
          will-change: transform;
        }

        .push-right-creature {
          animation: rightCreaturePush 6.5s cubic-bezier(0.25, 1, 0.35, 1) infinite;
          will-change: transform;
        }

        .strain-spark-left {
          animation: strainPopLeft 6.5s ease-out infinite;
        }

        .strain-spark-right {
          animation: strainPopRight 6.5s ease-out infinite;
        }

        .chromatic-glow-text {
          background: linear-gradient(
            115deg,
            #ffffff 0%,
            #ffd6e8 12%,
            #f472b6 24%,
            #c084fc 38%,
            #38bdf8 52%,
            #f43f5e 66%,
            #e879f9 78%,
            #ffd6a5 90%,
            #ffffff 100%
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: colorCycleFill 7s ease infinite;
          will-change: background-position, filter;
        }

        .interactive-pushed-now {
          animation: none !important;
          transform: perspective(700px) scale(1.05) rotate(0deg) !important;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Main Flex Wrapper with Creature Bookends */}
      <div className="relative flex items-center justify-center gap-1 sm:gap-2 px-6 sm:px-10">

        {/* ============================================================== */}
        {/* LEFT CREATURE: ONYX SPIKE IMP (Pushes Text from Left to Right) */}
        {/* ============================================================== */}
        <div
          onClick={() => handleCreatureClick('left')}
          title="Onyx Spike Imp: Tap to make him push hard!"
          className={`push-left-creature relative cursor-pointer z-20 -mr-2 sm:-mr-3 group select-none ${
            isInteractivePushed && activeReaction === 'left' ? 'scale-125 -rotate-12' : ''
          }`}
        >
          {/* Cute strain sparkle effect */}
          <div className="strain-spark-left pointer-events-none absolute -top-4 -left-2 text-[10px] font-mono text-pink font-bold flex items-center gap-0.5">
            <span className="animate-ping text-xs">💦</span>
            <span className="text-[9px] bg-black/80 px-1 py-0.5 rounded border border-pink/40 text-pink">
              OOF!
            </span>
          </div>

          {/* Handcrafted Obsidian / Black Jewelry Imp SVG */}
          <svg
            className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-200"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark Drop Shadow */}
            <ellipse cx="32" cy="59" rx="16" ry="4" fill="#000000" opacity="0.7" />

            {/* Imp Horns with Chrome Rings */}
            <path d="M22 20C18 10 12 11 10 16C12 24 20 25 22 25Z" fill="url(#darkJewelGrad)" stroke="#c084fc" strokeWidth="1" />
            <path d="M42 20C46 10 52 11 54 16C52 24 44 25 42 25Z" fill="url(#darkJewelGrad)" stroke="#c084fc" strokeWidth="1" />
            {/* Chrome Horn Spikes */}
            <circle cx="11" cy="15" r="1.5" fill="#ffffff" />
            <circle cx="53" cy="15" r="1.5" fill="#ffffff" />

            {/* Tiny Devilish Tail */}
            <path
              d="M16 46C10 48 6 42 4 48C2 54 8 55 12 52"
              stroke="#1a0422"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path d="M4 48L1 45L4 43L7 46Z" fill="#f472b6" />

            {/* Main Obsidian Body (Faceted Chibi Sphere) */}
            <circle cx="32" cy="38" r="18" fill="url(#onyxBodyGrad)" stroke="#381040" strokeWidth="1.5" />

            {/* Inner Jewelry Facet Gleam */}
            <path
              d="M20 28C24 24 38 23 44 28C40 25 24 25 20 28Z"
              fill="white"
              fillOpacity="0.25"
            />

            {/* Big Expressive Anime Glowing Eyes */}
            {/* Eyeballs */}
            <ellipse cx="25" cy="36" rx="4.5" ry="5.5" fill="#140217" stroke="#f472b6" strokeWidth="1.2" />
            <ellipse cx="39" cy="36" rx="4.5" ry="5.5" fill="#140217" stroke="#f472b6" strokeWidth="1.2" />

            {/* Vibrant Neon Pink Irises */}
            <circle cx="26" cy="36" r="3.2" fill="#f472b6" />
            <circle cx="40" cy="36" r="3.2" fill="#f472b6" />

            {/* White Glint Highlights */}
            <circle cx="27.5" cy="34" r="1.4" fill="#ffffff" />
            <circle cx="25" cy="38" r="0.7" fill="#ffffff" />
            <circle cx="41.5" cy="34" r="1.4" fill="#ffffff" />
            <circle cx="39" cy="38" r="0.7" fill="#ffffff" />

            {/* Cute Effort Blush */}
            <ellipse cx="20" cy="42" rx="2.5" ry="1.2" fill="#ec4899" fillOpacity="0.6" />
            <ellipse cx="44" cy="42" rx="2.5" ry="1.2" fill="#ec4899" fillOpacity="0.6" />

            {/* Determined Effort Mouth */}
            <path d="M30 42C32 44 34 44 36 42" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />

            {/* Spiked Hardware Necklace with Black Heart Pendant */}
            <path d="M22 47C28 51 36 51 42 47" stroke="#c0c0c0" strokeWidth="1.5" />
            {/* Spikes */}
            <polygon points="26,49 27,53 28,49" fill="#e0e0e0" />
            <polygon points="36,49 37,53 38,49" fill="#e0e0e0" />
            {/* Center Dark Obsidian Heart Jewel */}
            <path
              d="M32 50C31 49 29 49 29 51C29 53 32 55 32 55C32 55 35 53 35 51C35 49 33 49 32 50Z"
              fill="#0d0112"
              stroke="#f472b6"
              strokeWidth="0.8"
            />

            {/* Hands / Paws Pushing Hard Against Text (Rightward reach) */}
            {/* Left Foot Braced */}
            <ellipse cx="23" cy="55" rx="5" ry="3" fill="#140217" stroke="#c084fc" strokeWidth="1" />
            {/* Right Foot Braced */}
            <ellipse cx="40" cy="55" rx="5" ry="3" fill="#140217" stroke="#c084fc" strokeWidth="1" />

            {/* Pushing Paws Pressed Firmly Right */}
            <ellipse cx="47" cy="41" rx="4" ry="3.5" fill="#200426" stroke="#f472b6" strokeWidth="1.2" />
            <ellipse cx="45" cy="47" rx="3.5" ry="3" fill="#200426" stroke="#f472b6" strokeWidth="1.2" />
            {/* Claws */}
            <circle cx="50" cy="40" r="0.9" fill="#ffffff" />
            <circle cx="51" cy="42" r="0.9" fill="#ffffff" />
            <circle cx="48" cy="46" r="0.9" fill="#ffffff" />

            {/* SVG Gradients for Obsidian & Jewels */}
            <defs>
              <radialGradient id="onyxBodyGrad" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#2c0836" />
                <stop offset="45%" stopColor="#15031c" />
                <stop offset="85%" stopColor="#08010a" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
              <linearGradient id="darkJewelGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3b0764" />
                <stop offset="50%" stopColor="#14021a" />
                <stop offset="100%" stopColor="#0a000d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ============================================================== */}
        {/* CENTER: BENDING TEXT WITH ALWAYS GLOWING & COLOR-CHANGING ART  */}
        {/* ============================================================== */}
        <div
          className={`animated-text-container relative flex flex-col items-center justify-center ${
            isInteractivePushed ? 'interactive-pushed-now' : ''
          }`}
        >
          {/* Tiny Floating Jewelry Diamonds / Black Tourmalines Around Text */}
          {/* Jewel 1: Faceted Black Diamond above D */}
          <div
            className="absolute -top-3 left-4 pointer-events-none hidden sm:block"
            style={{ animation: 'jewelGlintFloat 4s ease-in-out infinite' }}
          >
            <div className="w-3.5 h-3.5 bg-gradient-to-br from-[#2a0438] via-[#0b0110] to-black border border-pink/60 rotate-45 shadow-[0_0_8px_rgba(244,114,182,0.8)] relative flex items-center justify-center">
              <span className="w-1 h-1 bg-white rounded-full absolute -top-0.5 -right-0.5 animate-ping" />
            </div>
          </div>

          {/* Jewel 2: Chrome Spiked Drop hanging from "(" */}
          <div
            className="absolute -bottom-2.5 left-1/2 pointer-events-none"
            style={{ animation: 'jewelGlintFloat 3.2s ease-in-out infinite 0.5s' }}
          >
            <div className="w-2.5 h-2.5 bg-gradient-to-b from-[#e0e0e0] to-[#120216] border border-white/80 rotate-45 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
          </div>

          {/* Jewel 3: Tiny Black Onyx Teardrop above R */}
          <div
            className="absolute -top-3 right-12 pointer-events-none hidden sm:block"
            style={{ animation: 'jewelGlintFloat 4.6s ease-in-out infinite 1s' }}
          >
            <div className="w-3 h-3 bg-gradient-to-tr from-black via-[#1f0528] to-[#9333ea] border border-purple-400/80 rotate-45 shadow-[0_0_10px_rgba(168,85,247,0.7)]" />
          </div>

          {/* Tiny Cute Jewelry Percher Cat on top of "I" */}
          <div
            onClick={() => handleCreatureClick('cat')}
            title="Jewel Kitty: Tap for purrs and sparkles!"
            className="absolute -top-5 left-[34%] z-30 cursor-pointer hover:scale-125 transition-transform group hidden sm:block"
          >
            <div className="relative">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-pink bg-black/90 px-1 rounded whitespace-nowrap border border-pink/30">
                MEOW ✨
              </span>
              <svg className="w-7 h-7 drop-shadow-[0_2px_8px_rgba(244,114,182,0.6)]" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="18" r="8" fill="#14021a" stroke="#f472b6" strokeWidth="0.8" />
                {/* Cat ears */}
                <polygon points="10,14 12,8 15,13" fill="#1a0422" stroke="#c084fc" strokeWidth="0.8" />
                <polygon points="22,14 20,8 17,13" fill="#1a0422" stroke="#c084fc" strokeWidth="0.8" />
                {/* Eyes */}
                <circle cx="13" cy="17" r="1.5" fill="#f472b6" />
                <circle cx="19" cy="17" r="1.5" fill="#f472b6" />
                <circle cx="13.5" cy="16.5" r="0.6" fill="#ffffff" />
                <circle cx="19.5" cy="16.5" r="0.6" fill="#ffffff" />
                {/* Nose & whiskers */}
                <circle cx="16" cy="20" r="0.8" fill="#ffffff" />
                <line x1="8" y1="19" x2="11" y2="19" stroke="#f472b6" strokeWidth="0.6" />
                <line x1="21" y1="19" x2="24" y2="19" stroke="#f472b6" strokeWidth="0.6" />
                {/* Tiny Black Jewel in paws */}
                <polygon points="16,23 18,25 16,27 14,25" fill="#000000" stroke="#ffffff" strokeWidth="0.6" />
              </svg>
            </div>
          </div>

          {/* ============================================================== */}
          {/* THE HEADING TEXT ITSELF (Dual-layer chromatic with border glow) */}
          {/* ============================================================== */}
          <h2 className="relative text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-spartan uppercase tracking-tight leading-none text-center whitespace-nowrap overflow-visible px-1 py-1">
            {/* Layer 1: Ambient Stroke Border & Neon Shadow Behind */}
            <span
              aria-hidden="true"
              className="absolute inset-0 z-0 font-black font-spartan uppercase tracking-tight pointer-events-none select-none"
              style={{
                WebkitTextStroke: '2px rgba(244, 114, 182, 0.45)',
                color: 'transparent',
                filter: 'drop-shadow(0 0 15px rgba(244, 114, 182, 0.6)) drop-shadow(0 0 35px rgba(168, 85, 247, 0.45))'
              }}
            >
              DHRISNI <span className="italic tracking-wider font-spartan font-black">(DHRISTROYER)</span>
            </span>

            {/* Layer 2: Moving Chromatic Color Fill (Always glowing & shifting) */}
            <span className="relative z-10 chromatic-glow-text">
              DHRISNI{' '}
              <span className="italic tracking-wider font-spartan font-black">
                (DHRISTROYER)
              </span>
            </span>

            {/* Layer 3: Moving Interior Liquid Light Sheen */}
            <span
              aria-hidden="true"
              className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-90 overflow-hidden"
            >
              <span
                className="block w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent"
                style={{
                  animation: 'interiorLightSweep 4.5s ease-in-out infinite'
                }}
              />
            </span>
          </h2>

          {/* Subtext Accent: Tiny Haute Baddie Status */}
          <div className="flex items-center justify-center gap-2 mt-1 opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-silver/70">
              KINETIC ATELIER ARTIFACT // TAP CREATURES TO INTERACT
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT CREATURE: VOID GARGOYLE (Pushes Text from Right to Left) */}
        {/* ============================================================== */}
        <div
          onClick={() => handleCreatureClick('right')}
          title="Void Gargoyle: Tap to make her push hard!"
          className={`push-right-creature relative cursor-pointer z-20 -ml-2 sm:-ml-3 group select-none ${
            isInteractivePushed && activeReaction === 'right' ? 'scale-125 rotate-12' : ''
          }`}
        >
          {/* Cute strain sparkle effect */}
          <div className="strain-spark-right pointer-events-none absolute -top-4 -right-2 text-[10px] font-mono text-purple-300 font-bold flex items-center gap-0.5">
            <span className="text-[9px] bg-black/80 px-1 py-0.5 rounded border border-purple-400/40 text-purple-300">
              HYAH!
            </span>
            <span className="animate-ping text-xs">⚡</span>
          </div>

          {/* Handcrafted Winged Obsidian Gargoyle / Void Bunny SVG */}
          <svg
            className="w-10 h-10 sm:w-14 sm:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform duration-200"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark Drop Shadow */}
            <ellipse cx="32" cy="59" rx="16" ry="4" fill="#000000" opacity="0.7" />

            {/* Winged Back Flaps (Gargoyle / Bat Wings) */}
            <path
              d="M44 26C54 18 62 22 60 32C56 32 50 30 46 34"
              fill="url(#darkGargoyleGrad)"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <path
              d="M20 26C10 18 2 22 4 32C8 32 14 30 18 34"
              fill="url(#darkGargoyleGrad)"
              stroke="#38bdf8"
              strokeWidth="1"
            />

            {/* Spiked Gothic Bunny / Gargoyle Tall Ears */}
            <path d="M25 22C21 8 16 9 17 19C18 24 23 25 25 25Z" fill="url(#darkGargoyleGrad)" stroke="#c084fc" strokeWidth="1" />
            <path d="M39 22C43 8 48 9 47 19C46 24 41 25 39 25Z" fill="url(#darkGargoyleGrad)" stroke="#c084fc" strokeWidth="1" />
            {/* Ear Piercings (Dark Jewellery Barbells) */}
            <circle cx="17" cy="13" r="1.3" fill="#ffffff" />
            <circle cx="47" cy="13" r="1.3" fill="#ffffff" />

            {/* Main Obsidian Body */}
            <circle cx="32" cy="38" r="18" fill="url(#voidBodyGrad)" stroke="#1a2035" strokeWidth="1.5" />

            {/* Glowing Big Anime Cyan/Neon Violet Eyes */}
            <ellipse cx="25" cy="36" rx="4.5" ry="5.5" fill="#060914" stroke="#38bdf8" strokeWidth="1.2" />
            <ellipse cx="39" cy="36" rx="4.5" ry="5.5" fill="#060914" stroke="#38bdf8" strokeWidth="1.2" />

            {/* Cyan/Violet Glowing Pupils */}
            <circle cx="24" cy="36" r="3.2" fill="#38bdf8" />
            <circle cx="38" cy="36" r="3.2" fill="#38bdf8" />

            {/* Sparkle Highlights in Eyes */}
            <circle cx="23" cy="34" r="1.4" fill="#ffffff" />
            <circle cx="25" cy="38" r="0.7" fill="#ffffff" />
            <circle cx="37" cy="34" r="1.4" fill="#ffffff" />
            <circle cx="39" cy="38" r="0.7" fill="#ffffff" />

            {/* Effort Blush (Purple/Cyan glow) */}
            <ellipse cx="20" cy="42" rx="2.5" ry="1.2" fill="#a855f7" fillOpacity="0.7" />
            <ellipse cx="44" cy="42" rx="2.5" ry="1.2" fill="#a855f7" fillOpacity="0.7" />

            {/* Cute Push Effort Gritting Teeth / Mouth */}
            <rect x="29" y="42" width="6" height="2" rx="1" fill="#ffffff" />

            {/* Spiked Chrome Bracelet on Pushing Wrists */}
            <ellipse cx="18" cy="42" rx="2.5" ry="4" fill="#20293a" stroke="#e0e0e0" strokeWidth="1" />
            <polygon points="15,40 13,42 15,44" fill="#ffffff" />

            {/* Paws Firmly Pushing Left Against the Closing Parenthesis ")" */}
            {/* Left Paw */}
            <ellipse cx="17" cy="41" rx="4" ry="3.5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
            {/* Claws */}
            <circle cx="14" cy="40" r="0.9" fill="#ffffff" />
            <circle cx="13" cy="42" r="0.9" fill="#ffffff" />
            <circle cx="16" cy="46" r="0.9" fill="#ffffff" />

            {/* Feet Braced on Right Ground */}
            <ellipse cx="24" cy="55" rx="5" ry="3" fill="#0b101b" stroke="#38bdf8" strokeWidth="1" />
            <ellipse cx="41" cy="55" rx="5" ry="3" fill="#0b101b" stroke="#38bdf8" strokeWidth="1" />

            {/* Dark Jewellery Belly Gem (Black Sapphire / Tourmaline) */}
            <polygon points="32,47 35,51 32,55 29,51" fill="#030712" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="32" cy="51" r="1" fill="#ffffff" />

            {/* SVG Gradients */}
            <defs>
              <radialGradient id="voidBodyGrad" cx="40%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="45%" stopColor="#0f172a" />
                <stop offset="85%" stopColor="#030712" />
                <stop offset="100%" stopColor="#000000" />
              </radialGradient>
              <linearGradient id="darkGargoyleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      </div>
    </div>
  );
}
