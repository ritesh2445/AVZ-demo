import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Zap, Compass } from 'lucide-react';
import { playSound } from '../utils/audio';
import { ASSET_MANIFEST } from '../data/brandData';

export default function ImageTunnel({ isOpen, onClose }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isAccelerating, setIsAccelerating] = useState(false);

  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const zOffsetRef = useRef(0);
  const tiltRef = useRef({ x: 0, y: 0 });
  const worldRef = useRef(null);
  const sliceRefs = useRef([]);

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const isAcceleratingRef = useRef(isAccelerating);
  isAcceleratingRef.current = isAccelerating;

  // Images for the tunnel surfaces
  const tunnelImages = [
    ASSET_MANIFEST.products.divaTop,
    ASSET_MANIFEST.products.spikeBra,
    ASSET_MANIFEST.editorialHero,
    ASSET_MANIFEST.products.beadedBralette,
    ASSET_MANIFEST.products.reworkedJacket,
    ASSET_MANIFEST.products.coordSet,
    ASSET_MANIFEST.products.spikeTop,
    ASSET_MANIFEST.editorialLookbook,
    ASSET_MANIFEST.products.archiveBralette
  ];

  // Mouse tilt interaction without triggering React re-renders
  const handlePointerMove = (e) => {
    const rx = (e.clientX / window.innerWidth - 0.5) * 15;
    const ry = (e.clientY / window.innerHeight - 0.5) * 15;
    tiltRef.current = { x: rx, y: ry };
  };

  useEffect(() => {
    if (!isOpen) return;

    let currentTiltX = 0;
    let currentTiltY = 0;

    const loop = (currentTime) => {
      const delta = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      if (!isPausedRef.current) {
        const currentSpeed = isAcceleratingRef.current ? 4.5 : 1.2;
        zOffsetRef.current = (zOffsetRef.current + delta * 280 * currentSpeed) % 1800;

        // Direct DOM update on slices for maximum 60fps/120fps smoothness
        for (let i = 0; i < 6; i++) {
          const el = sliceRefs.current[i];
          if (el) {
            const baseZ = i * 450 - 300;
            const currentZ = (baseZ + zOffsetRef.current) % 1800 - 900;
            el.style.transform = `translate3d(0, 0, ${currentZ}px)`;
          }
        }
      }

      // Smooth camera tilt interpolation
      currentTiltX += (tiltRef.current.x - currentTiltX) * 0.1;
      currentTiltY += (tiltRef.current.y - currentTiltY) * 0.1;
      if (worldRef.current) {
        worldRef.current.style.transform = `rotateY(${currentTiltX.toFixed(2)}deg) rotateX(${(-currentTiltY).toFixed(2)}deg)`;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const slices = [0, 1, 2, 3, 4, 5];

  return (
    <div
      onMouseMove={handlePointerMove}
      onClick={() => {
        setIsPaused((p) => !p);
        playSound('pip');
      }}
      className="fixed inset-0 z-[99990] bg-black select-none overflow-hidden flex flex-col justify-between"
    >
      {/* Wireframe Grid Background & CSS 3D Stage */}
      <div className="absolute inset-0 tunnel-stage">
        <div
          ref={worldRef}
          className="tunnel-world w-full h-full will-change-transform transform-gpu"
        >
          {slices.map((sliceIdx) => {
            const leftImg = tunnelImages[(sliceIdx * 4) % tunnelImages.length];
            const rightImg = tunnelImages[(sliceIdx * 4 + 1) % tunnelImages.length];
            const topImg = tunnelImages[(sliceIdx * 4 + 2) % tunnelImages.length];
            const bottomImg = tunnelImages[(sliceIdx * 4 + 3) % tunnelImages.length];

            return (
              <div
                key={sliceIdx}
                ref={(el) => (sliceRefs.current[sliceIdx] = el)}
                className="absolute inset-0 flex items-center justify-center transform-style-3d pointer-events-none will-change-transform"
                style={{
                  transform: `translate3d(0, 0, ${(sliceIdx * 450 - 300) % 1800 - 900}px)`
                }}
              >
                {/* Wireframe Ring Portal */}
                <div className="w-[85vw] h-[85vh] border-2 border-pink/30 rounded-3xl absolute shadow-[0_0_30px_rgba(244,194,194,0.15)]" />

                {/* Left Wall Panel */}
                <div
                  className="absolute w-[450px] h-[75vh] border border-lavender/30 bg-black/60 overflow-hidden rounded-2xl"
                  style={{
                    transform: 'translateX(-42.5vw) rotateY(90deg)'
                  }}
                >
                  <img
                    src={leftImg}
                    alt="Left tunnel surface"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-80 contrast-125"
                  />
                  <div className="absolute inset-0 bg-dark-purple/30 mix-blend-color" />
                </div>

                {/* Right Wall Panel */}
                <div
                  className="absolute w-[450px] h-[75vh] border border-pink/30 bg-black/60 overflow-hidden rounded-2xl"
                  style={{
                    transform: 'translateX(42.5vw) rotateY(-90deg)'
                  }}
                >
                  <img
                    src={rightImg}
                    alt="Right tunnel surface"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-80 contrast-125"
                  />
                  <div className="absolute inset-0 bg-pink/20 mix-blend-color" />
                </div>

                {/* Ceiling Panel */}
                <div
                  className="absolute w-[75vw] h-[450px] border border-silver/30 bg-black/70 overflow-hidden rounded-2xl"
                  style={{
                    transform: 'translateY(-42.5vh) rotateX(-90deg)'
                  }}
                >
                  <img
                    src={topImg}
                    alt="Ceiling tunnel surface"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-70"
                  />
                </div>

                {/* Floor Panel */}
                <div
                  className="absolute w-[75vw] h-[450px] border border-lavender/30 bg-black/70 overflow-hidden rounded-2xl"
                  style={{
                    transform: 'translateY(42.5vh) rotateX(90deg)'
                  }}
                >
                  <img
                    src={bottomImg}
                    alt="Floor tunnel surface"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-70"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Controls Overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 p-6 sm:px-10 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/90 to-transparent"
      >
        <div className="flex items-center gap-3">
          <Compass className="w-4 h-4 text-zinc-400 animate-spin" />
          <span className="font-mono text-xs tracking-[0.2em] text-white uppercase">
            AVZ ARCHIVAL 3D TUNNEL
          </span>
          <span className="text-[10px] font-mono text-zinc-400">
            {isPaused ? '[PAUSED]' : isAccelerating ? '[WARP ACCELERATION]' : '[CRUISE VELOCITY]'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound('pip');
            onClose();
          }}
          className="btn-glass px-4 py-2 rounded-full text-white hover:text-white transition-all font-mono text-[11px] tracking-widest flex items-center gap-2 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>EXIT TUNNEL</span>
        </button>
      </div>

      {/* Bottom Floating Interactive Dashboard */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 p-6 sm:px-10 flex flex-wrap items-center justify-between gap-4 pointer-events-auto bg-gradient-to-t from-black/90 to-transparent"
      >
        <div className="text-[11px] font-mono text-zinc-400">
          Click viewport to {isPaused ? 'RESUME' : 'PAUSE'} · Tilt cursor to steer corridor
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsPaused((p) => !p);
              playSound('pip');
            }}
            className="btn-glass px-5 py-2 rounded-full text-white font-mono text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'RESUME WARP' : 'PAUSE MOTION'}</span>
          </button>

          <button
            onMouseDown={() => {
              setIsAccelerating(true);
              playSound('warp');
            }}
            onMouseUp={() => setIsAccelerating(false)}
            onMouseLeave={() => setIsAccelerating(false)}
            onTouchStart={() => {
              setIsAccelerating(true);
              playSound('warp');
            }}
            onTouchEnd={() => setIsAccelerating(false)}
            className={`px-5 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isAccelerating
                ? 'btn-glass-pink scale-105'
                : 'btn-glass text-zinc-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isAccelerating ? 'fill-current animate-bounce' : ''}`} />
            <span>HOLD TO BOOST SPEED</span>
          </button>
        </div>
      </div>
    </div>
  );
}
