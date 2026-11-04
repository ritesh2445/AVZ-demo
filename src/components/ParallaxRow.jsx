'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Eye,
  Scissors
} from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ParallaxRow({ entries = [], onCommissionLook }) {
  const [activeLook, setActiveLook] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1200);
  const stageRef = useRef(null);

  // Track window width reactively to eliminate card spacing collisions on all screen sizes
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Swipe & Drag Gesture Tracking
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const isDraggingRef = useRef(false);

  // GPU-composited CSS variable tilt tracking (0 React re-renders, 120fps smooth)
  const rafRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    if (rafRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));
      stageRef.current.style.setProperty('--mouse-x', x.toString());
      stageRef.current.style.setProperty('--mouse-y', y.toString());
    });
  };

  const handleMouseEnter = () => setIsHoveringStage(true);
  const handleMouseLeave = () => {
    setIsHoveringStage(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (stageRef.current) {
      stageRef.current.style.setProperty('--mouse-x', '0');
      stageRef.current.style.setProperty('--mouse-y', '0');
    }
  };

  const currentEntry = entries[currentSlide] || entries[0];

  const goToSlide = (index) => {
    playSound('whoosh');
    const safeIdx = (index + entries.length) % entries.length;
    setCurrentSlide(safeIdx);
  };

  const nextSlide = (e) => {
    e?.stopPropagation();
    goToSlide(currentSlide + 1);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    goToSlide(currentSlide - 1);
  };

  // Touch Swipe Handlers for mobile swipeability
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Trigger swipe if horizontal motion exceeds vertical and passes 40px threshold
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Pointer drag support for desktop swipeability
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    touchStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current || touchStartXRef.current === null) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    isDraggingRef.current = false;
    touchStartXRef.current = null;
  };

  const openLightbox = (look, index) => {
    playSound('metal');
    setActiveLook(look);
    setCurrentSlide(index);
  };

  const closeLightbox = () => {
    playSound('pip');
    setActiveLook(null);
  };

  // Keyboard navigation for modal & spatial stage
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeLook) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      } else {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLook, currentSlide]);

  return (
    <div className="w-full py-10 sm:py-14 bg-transparent select-none relative overflow-hidden border-t border-white/10">
      {/* Header Bar — Fullscreen Edge-to-Edge Matching Collection Archive */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 relative z-10 text-left border-b border-white/10 pb-6">
        <div>
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span>LOOKBOOK ARCHIVE • EDITORIAL CAMPAIGNS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium tracking-[0.16em] text-white uppercase leading-tight text-left">
            LOOKBOOK <span className="text-zinc-500 font-light">ARCHIVE</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-mono mt-2 leading-relaxed text-left">
            Editorial campaigns and handcrafted archival silhouettes, styled and directed by Dhrisni in our studio.
          </p>
        </div>

        {/* Navigation Controls & Counter */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
          <span className="text-xs font-mono text-zinc-400 tracking-wider">
            [ 0{currentSlide + 1} / 0{entries.length} ]
          </span>

          <button
            onClick={prevSlide}
            aria-label="Previous look"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next look"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Look Selector Pills */}
      <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-2 scroll-smooth">
        {entries.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
              currentSlide === i
                ? 'bg-pink text-black font-bold border-pink shadow-md scale-105'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:border-pink hover:text-white'
            }`}
          >
            LOOK 0{i + 1}
          </button>
        ))}
      </div>

      {/* ========================================================
          SWIPABLE 3D SPATIAL CATWALK STAGE (FULLSCREEN)
          ======================================================== */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-full px-4 sm:px-8 lg:px-12 pt-6 pb-12 flex flex-col items-center justify-center min-h-[580px] sm:min-h-[640px] select-none cursor-grab active:cursor-grabbing touch-pan-y overflow-visible"
        style={{ perspective: '1400px' }}
      >
        {/* Perspective 3D Runway Grid Floor */}
        <div
          className="absolute bottom-2 left-0 right-0 h-48 pointer-events-none opacity-40 overflow-hidden"
          style={{
            perspective: '600px',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)'
          }}
        >
          <div
            className="w-full h-full transform-gpu rotate-x-65 scale-125"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(244, 114, 182, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(147, 51, 234, 0.2) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              transform: `rotateX(65deg) translateY(calc(var(--mouse-y, 0) * 10px))`
            }}
          />
        </div>

        {/* 3D Spatial Carousel Stage */}
        <div
          className="relative w-full h-[510px] sm:h-[580px] flex items-center justify-center transition-transform duration-500 ease-out z-20"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(calc(var(--mouse-x, 0) * 6deg)) rotateX(calc(var(--mouse-y, 0) * -5deg))`
          }}
        >
          {entries.map((item, idx) => {
            const count = entries.length;
            let diff = (idx - currentSlide) % count;
            if (diff > count / 2) diff -= count;
            if (diff < -count / 2) diff += count;

            const isCenter = diff === 0;
            const isVisible = Math.abs(diff) <= 2;

            const isMobile = screenWidth < 640;
            const isTablet = screenWidth >= 640 && screenWidth < 1024;
            const spacing = isMobile ? 250 : isTablet ? 340 : 420;

            let translateX = diff * spacing;
            let translateZ = isCenter ? 120 : -100 * Math.abs(diff);
            let rotateY = diff * -22;
            let scale = isCenter ? (isMobile ? 1.02 : 1.06) : 0.82;
            let opacity = isCenter ? 1 : Math.max(0.35, 1 - Math.abs(diff) * 0.4);

            return (
              <div
                key={item.id || idx}
                onClick={() => {
                  if (isCenter) {
                    openLightbox(item, idx);
                  } else {
                    goToSlide(idx);
                  }
                }}
                className={`absolute top-1/2 left-1/2 w-[270px] sm:w-[340px] md:w-[380px] h-[470px] sm:h-[540px] rounded-3xl cursor-pointer transition-all duration-700 ease-out transform-gpu ${
                  isCenter ? 'z-30' : Math.abs(diff) === 1 ? 'z-20' : 'z-10'
                }`}
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(calc(${rotateY}deg + ${isCenter ? 'var(--mouse-x, 0) * 14deg' : '0deg'})) rotateX(${isCenter ? 'calc(var(--mouse-y, 0) * -12deg)' : '0deg'}) scale(${scale})`,
                  opacity,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Pure Editorial Noir Card */}
                <div
                  className={`tunnel-card w-full h-full rounded-3xl overflow-hidden relative flex flex-col justify-between transition-all duration-500 bg-[#0d0212] mobile-grunge-card ${
                    isCenter ? 'border border-pink/50 shadow-[0_20px_60px_rgba(244,114,182,0.25)]' : 'border border-white/10'
                  }`}
                >
                  {/* Image Layer */}
                  <img
                    src={item.image}
                    alt={item.title}
                    decoding="async"
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isCenter ? 'scale-105 brightness-100' : 'scale-100 brightness-85'
                    }`}
                  />

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85" />

                  {/* Top Badges */}
                  <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20 image-overlay-text">
                    <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono tracking-widest uppercase">
                      <span>{item.code?.split('•')[0]?.trim() || `LOOK 00${idx + 1}`}</span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(item, idx);
                      }}
                      aria-label="Inspect Full Look"
                      className="w-9 h-9 rounded-full border border-white/20 bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:border-pink hover:text-pink transition-all cursor-pointer shadow-md"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom Editorial Caption */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col text-left z-20 image-overlay-text">
                    <span className="text-[10px] font-mono text-zinc-300 font-bold tracking-widest uppercase mb-1 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-pink" />
                      <span>{item.vibe || 'HAUTE WEARABLE ART'}</span>
                    </span>

                    <h3 className={`font-mono font-bold uppercase text-white leading-tight mb-2 ${
                      isCenter ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl line-clamp-2'
                    }`}>
                      {item.title}
                    </h3>

                    <p className={`text-xs text-zinc-300 font-mono leading-relaxed mb-3 ${
                      isCenter ? 'line-clamp-2' : 'line-clamp-1 opacity-70'
                    }`}>
                      {item.subtitle || item.story}
                    </p>

                    {/* Small 'See Full Look' button on every card */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs font-mono">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(item, idx);
                        }}
                        className="py-1.5 px-3.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer bg-white/10 hover:bg-pink hover:text-black border border-white/20 text-white transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>SEE FULL LOOK ↗</span>
                      </button>

                      <span className="text-[11px] font-mono text-zinc-400">
                        {idx + 1} / {entries.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Runway Slide Progress Indicators */}
        <div className="flex items-center gap-2 mt-6 z-30">
          {entries.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to look ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === currentSlide
                  ? 'w-8 h-2 bg-gradient-to-r from-[#f472b6] to-[#c084fc] shadow-[0_0_10px_rgba(244,114,182,0.8)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================
          FULL-SCREEN INSPECT MODAL (LIGHTBOX)
          ======================================================== */}
      {activeLook && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in"
        >
          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous look"
            className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/80 backdrop-blur-md items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] hover:bg-[#be185d]/20 transition-all z-50 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next look"
            className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/80 backdrop-blur-md items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] hover:bg-[#be185d]/20 transition-all z-50 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Modal Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="lookbook-modal-card relative w-full max-w-5xl max-h-[92vh] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center overflow-y-auto z-10 shadow-2xl bg-[#0d0212] border border-white/20"
          >
            {/* Desktop Close Button */}
            <button
              onClick={closeLightbox}
              aria-label="Close modal"
              className="lookbook-close-x hidden md:flex absolute top-5 right-5 z-50 w-9 h-9 rounded-full items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-all bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Mobile Header Bar */}
            <div className="w-full flex md:hidden items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div className="lookbook-code text-xs font-mono tracking-widest uppercase flex items-center gap-2 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-pink animate-pulse" />
                <span>{activeLook.code || `LOOK 0${currentSlide + 1}`} • {currentSlide + 1} OF {entries.length}</span>
              </div>
              <button
                onClick={closeLightbox}
                aria-label="Close modal"
                className="lookbook-close-x w-8 h-8 rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-all bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Visual Frame */}
            <div className="relative w-full md:w-1/2 max-h-[48vh] md:max-h-[68vh] flex items-center justify-center rounded-2xl overflow-hidden bg-black/80 border border-white/10 shrink-0 z-10 shadow-inner">
              <img
                src={activeLook.image}
                alt={activeLook.title}
                className="max-h-[48vh] md:max-h-[68vh] w-full object-contain rounded-2xl"
              />
            </div>

            {/* Information & Action */}
            <div className="w-full md:w-1/2 flex flex-col justify-between text-left md:pr-10 z-10">
              <div>
                <div className="lookbook-code hidden md:flex items-center gap-2 mb-2 text-xs font-mono tracking-widest uppercase font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-pink animate-pulse" />
                  <span>{activeLook.code || `LOOK 0${currentSlide + 1}`} • {currentSlide + 1} OF {entries.length}</span>
                </div>
                <h3 className="lookbook-title text-2xl sm:text-3xl font-mono font-bold uppercase mb-2 leading-tight text-left text-white">
                  {activeLook.title}
                </h3>
                <div className="lookbook-subtitle text-sm font-display mb-4 italic text-left text-pink">
                  "{activeLook.subtitle}"
                </div>

                <p className="lookbook-story text-xs sm:text-sm font-montserrat leading-relaxed mb-6 text-left text-zinc-300">
                  {activeLook.story}
                </p>

                {/* Details Badges */}
                <div className="lookbook-specs p-4 rounded-2xl text-xs font-mono mb-6 space-y-1.5 text-left shadow-inner bg-white/5 border border-white/10 text-zinc-300">
                  <div><strong className="text-white">Materials:</strong> {activeLook.materials || 'Reclaimed electronics, spikes, upcycled denim, steel'}</div>
                  <div><strong className="text-white">Craftsmanship:</strong> 100% Handcrafted by Dhrisni in Guwahati</div>
                  <div><strong className="text-white">Vibe:</strong> {activeLook.vibe || 'Haute Wearable Art'}</div>
                  {activeLook.caption && (
                    <div className="lookbook-caption pt-1 text-[11px] text-zinc-400">{activeLook.caption}</div>
                  )}
                </div>
              </div>

              {/* Commission CTA button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    playSound('subdrop');
                    closeLightbox();
                    if (onCommissionLook) {
                      onCommissionLook(activeLook.title);
                    }
                  }}
                  className="btn-commission-cta py-3.5 px-6 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all bg-pink text-black hover:bg-pink/90 rounded-full"
                >
                  <Scissors className="w-4 h-4" />
                  <span>REQUEST THIS SILHOUETTE ↗</span>
                </button>

                <button
                  onClick={closeLightbox}
                  className="lookbook-close-btn py-3.5 px-6 text-xs font-mono font-bold tracking-widest uppercase cursor-pointer rounded-full active:scale-98 transition-all border border-white/20 text-white hover:bg-white/10"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
