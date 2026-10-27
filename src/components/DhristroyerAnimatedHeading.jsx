import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/audio';

export default function DhristroyerAnimatedHeading() {
  // Staged arrival sequence:
  // Stage 0: Silence / Void
  // Stage 1: "MEET THE MOTHER" establishes with glowing cinematic tracking
  // Stage 2: "DHRISNI (DHRISTROYER)" arrives with heavy 3D spatial velocity & flare
  // Stage 3: Fully resolved into continuous interactive 3D perspective
  const [stage, setStage] = useState(0);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const triggerSequence = () => {
    setStage(0);
    // 1. "Meet the mother" fades in
    const t1 = setTimeout(() => {
      setStage(1);
    }, 150);

    // 2. The 3D text arrives
    const t2 = setTimeout(() => {
      setStage(2);
      try {
        playSound('space_hover');
      } catch (e) {}
    }, 900);

    // 3. Settle into idle state
    const t3 = setTimeout(() => {
      setStage(3);
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  useEffect(() => {
    const cleanup = triggerSequence();
    return cleanup;
  }, []);

  // Interactive 3D Cursor Tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseTilt({
      rotateX: -y * 22, // tilt up/down
      rotateY: x * 26,  // tilt left/right
      depthZ: 25
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseTilt({ rotateX: 0, rotateY: 0, depthZ: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative block my-3 select-none cursor-default"
      style={{ perspective: '1200px' }}
    >
      <style>{`
        /* =========================================================
           1. "MEET THE MOTHER" CINEMATIC PRELUDE
           ========================================================= */
        @keyframes preludeFadeIn {
          0% {
            opacity: 0;
            letter-spacing: 0.15em;
            transform: translateY(6px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            letter-spacing: 0.42em;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes laserSweep {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          50% {
            transform: scaleX(1);
            opacity: 1;
          }
          100% {
            transform: scaleX(1);
            opacity: 0.5;
          }
        }

        /* =========================================================
           2. BADASS 3D TEXT ARRIVAL (Deep Spatial Velocity)
           ========================================================= */
        @keyframes badass3dArrival {
          0% {
            opacity: 0;
            transform: perspective(1200px) translate3d(0, 45px, -320px) rotateX(46deg) scale(0.8);
            filter: blur(12px);
          }
          62% {
            opacity: 1;
            transform: perspective(1200px) translate3d(0, -5px, 25px) rotateX(-5deg) scale(1.02);
            filter: blur(0px);
          }
          82% {
            transform: perspective(1200px) translate3d(0, 2px, -6px) rotateX(1.8deg) scale(0.99);
          }
          100% {
            opacity: 1;
            transform: perspective(1200px) translate3d(0, 0, 0) rotateX(0deg) scale(1);
            filter: blur(0px);
          }
        }

        /* =========================================================
           3. ORGANIC FLOATING 3D MATRIX (When Idle)
           ========================================================= */
        @keyframes organic3dFloat {
          0%, 100% {
            transform: perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0);
          }
          33% {
            transform: perspective(1200px) rotateX(2.8deg) rotateY(-3.2deg) translate3d(0, -3px, 10px);
          }
          66% {
            transform: perspective(1200px) rotateX(-2.2deg) rotateY(3.6deg) translate3d(0, 2px, 8px);
          }
        }

        /* =========================================================
           4. AUTHENTIC 3D EXTENSION SHADOWS (Zero Box / No Clipping)
           ========================================================= */
        .text-3d-metal-white {
          color: #FFFFFF;
          text-shadow:
            0 1px 0 #E2E8F0,
            0 2px 0 #F472B6,
            0 3px 0 #BE185D,
            0 4px 0 #9D174D,
            0 5px 0 #831843,
            0 6px 0 #701A75,
            0 7px 0 #4A044E,
            0 8px 0 #2E0836,
            0 10px 1px rgba(0, 0, 0, 0.85),
            0 15px 30px rgba(0, 0, 0, 0.95),
            0 0 32px rgba(244, 114, 182, 0.45);
        }

        .text-3d-metal-pink {
          color: #F472B6;
          text-shadow:
            0 1px 0 #EC4899,
            0 2px 0 #DB2777,
            0 3px 0 #BE185D,
            0 4px 0 #9D174D,
            0 5px 0 #831843,
            0 6px 0 #701A75,
            0 7px 0 #4A044E,
            0 8px 0 #1E0524,
            0 10px 1px rgba(0, 0, 0, 0.85),
            0 15px 30px rgba(0, 0, 0, 0.95),
            0 0 35px rgba(236, 72, 153, 0.55);
        }

        /* 5. Chrome Specular Glint Across Lettering */
        @keyframes specularGlint {
          0%, 65% {
            opacity: 0;
            transform: translateX(-100%) skewX(-25deg);
          }
          75% {
            opacity: 0.85;
          }
          90%, 100% {
            opacity: 0;
            transform: translateX(300%) skewX(-25deg);
          }
        }
      `}</style>

      {/* =========================================================================
          STAGE 1: "✦ MEET THE MOTHER ✦" PRELUDE
          ========================================================================= */}
      <div className="flex flex-col items-start gap-1 mb-2.5">
        <div
          className={`flex items-center gap-2.5 transition-all duration-700 ease-out ${
            stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{
            animation: stage >= 1 ? 'preludeFadeIn 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          }}
        >
          <span className="w-1.5 h-1.5 rotate-45 bg-[#f472b6] shadow-[0_0_8px_#f472b6] animate-pulse" />
          <span className="font-cinzel text-xs sm:text-[13px] tracking-[0.42em] uppercase text-[#e2e8f0] font-bold drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]">
            MEET THE MOTHER
          </span>
          <span className="text-[#be185d] font-mono text-[10px] tracking-widest hidden sm:inline-block">
            // MASTER ARCHITECT
          </span>
          <span className="w-8 h-[1px] bg-gradient-to-r from-[#be185d] to-transparent" />
        </div>

        {/* Razor-thin laser rule under prelude */}
        <div
          className={`h-[1px] w-full max-w-[260px] bg-gradient-to-r from-[#be185d] via-[#f472b6] to-transparent origin-left ${
            stage >= 1 ? 'scale-x-100 opacity-60' : 'scale-x-0 opacity-0'
          }`}
          style={{
            animation: stage >= 1 ? 'laserSweep 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          }}
        />
      </div>

      {/* =========================================================================
          STAGE 2: "DHRISNI (DHRISTROYER)" ARRIVES (Badass 3D Text Animation)
          ========================================================================= */}
      <div
        className="transform-gpu transition-transform duration-200 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform:
            stage < 2
              ? 'perspective(1200px) translate3d(0, 45px, -320px) rotateX(46deg) scale(0.8)'
              : isHovered
              ? `perspective(1200px) rotateX(${mouseTilt.rotateX}deg) rotateY(${mouseTilt.rotateY}deg) translateZ(${mouseTilt.depthZ}px)`
              : 'perspective(1200px) translate3d(0, 0, 0)',
          animation:
            stage === 2
              ? 'badass3dArrival 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              : stage >= 3 && !isHovered
              ? 'organic3dFloat 7.5s ease-in-out infinite'
              : 'none',
          opacity: stage >= 2 ? 1 : 0,
        }}
      >
        {/* Main 3D Kinetic Typographic Structure */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight font-spartan leading-none uppercase flex flex-wrap items-baseline gap-x-3 sm:gap-x-4">
          {/* DHRISNI - Chiseled Metallic White */}
          <span className="text-3d-metal-white inline-block">
            DHRISNI
          </span>

          {/* (DHRISTROYER) - Chiseled Haute Magenta / Dark Pink */}
          <span className="text-3d-metal-pink inline-block font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            (DHRISTROYER)
          </span>
        </h2>

        {/* Minimalist Avant-Garde Atelier Credentials Ribbon */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 pt-2 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#C0C0C0]/75 uppercase">
          <div className="flex items-center gap-1.5 text-white/90">
            <span className="w-1.5 h-1.5 rounded-full bg-[#be185d] shadow-[0_0_6px_#ec4899]" />
            <span>FOUNDER & CREATIVE DIRECTOR</span>
          </div>
          <span className="text-white/20">•</span>
          <div className="text-[#f472b6]">
            <span>GUWAHATI ATELIER</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <div className="text-silver/60 hidden sm:inline">
            <span>UPCYCLED HARDWARE // AVANT-GARDE ARMOR</span>
          </div>

          {/* Replay Cinematic Entrance Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerSequence();
            }}
            title="Replay 3D Cinematic Sequence"
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono text-silver/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-[#be185d]/60 transition-all cursor-pointer shadow-sm"
          >
            <span>↻</span>
            <span>REPLAY</span>
          </button>
        </div>
      </div>
    </div>
  );
}
