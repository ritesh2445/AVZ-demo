import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Scissors, Sparkles, Layers, Disc3, Film } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function AvzMuseum({ onRequestCustomCommission, theme = 'dark' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState('album'); // 'album' or 'grid'
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const activeItem = MUSEUM_ITEMS[activeIndex] || MUSEUM_ITEMS[0];

  const nextArtifact = () => {
    playSound('cyber_hover');
    setActiveIndex((prev) => (prev + 1) % MUSEUM_ITEMS.length);
  };

  const prevArtifact = () => {
    playSound('cyber_hover');
    setActiveIndex((prev) => (prev - 1 + MUSEUM_ITEMS.length) % MUSEUM_ITEMS.length);
  };

  const shuffleArtifacts = () => {
    playSound('warp');
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * MUSEUM_ITEMS.length);
    } while (randomIndex === activeIndex && MUSEUM_ITEMS.length > 1);
    setActiveIndex(randomIndex);
  };

  // Touch Swipe Gesture Handlers (Fluid 3D tilt, ZERO vertical scroll disruption)
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    // If scrolling mostly vertically, do NOT block page scroll
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    if (dragOffset < -40) {
      nextArtifact();
    } else if (dragOffset > 40) {
      prevArtifact();
    }
    setDragOffset(0);
  };

  const handleCommissionClick = (item) => {
    playSound('click');
    if (onRequestCustomCommission) {
      onRequestCustomCommission(`Archival Recreation: ${item.name}`);
    }
    const el = document.getElementById('custom');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="museum"
      className={`w-full py-10 sm:py-16 px-4 sm:px-8 lg:px-12 select-none border-t text-left transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-white border-purple-200/50 text-zinc-900'
          : 'bg-[#060608] border-white/8 text-silver'
      }`}
    >
      {/* Museum Editorial Header */}
      <div className="mb-6 sm:mb-8 pb-4 border-b border-white/8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="section-badge-pill inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2 text-zinc-400 text-[10px] font-mono tracking-[0.25em] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
            <span>PERMANENT ARCHIVE • ONE-OF-A-KIND PIECES</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-mono uppercase tracking-[0.2em] text-white leading-tight">
            ARCHIVE <span className="text-zinc-500 font-normal">MUSEUM</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 font-mono tracking-wider max-w-xl leading-relaxed">
            Our permanent archive of one-of-a-kind wearable art prototypes. Handcrafted pieces available for custom bespoke recreation.
          </p>
        </div>

        {/* View Mode Switcher (Visible on both Desktop and Mobile) */}
        <div className="flex items-center gap-1.5 bg-[#101014] p-1 sm:p-1.5 rounded-full border border-white/10 shrink-0 self-start md:self-auto">
          <button
            onClick={() => {
              playSound('glitch_click');
              setViewMode('album');
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase transition-all cursor-pointer ${
              viewMode === 'album'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>3D Album Reel</span>
          </button>
          <button
            onClick={() => {
              playSound('glitch_click');
              setViewMode('grid');
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Archive Index</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: 3D MOVIE ALBUM SHUFFLE CAROUSEL (DESKTOP & MOBILE OPTIMIZED)
          ========================================================================= */}
      {viewMode === 'album' ? (
        <div className="w-full flex flex-col items-center">
          {/* Top Shuffle HUD Bar */}
          <div className="w-full flex items-center justify-between mb-4 sm:mb-6 px-1 text-xs font-mono">
            <span className="text-[10px] sm:text-[11px] tracking-widest text-pink uppercase font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink animate-ping inline-block" />
              <span>SPECIMEN [ 0{activeIndex + 1} / 0{MUSEUM_ITEMS.length} ]</span>
            </span>

            <button
              onClick={shuffleArtifacts}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-pink/40 text-pink text-[10px] sm:text-[11px] font-mono tracking-widest uppercase transition-all cursor-pointer active:scale-95"
            >
              <Shuffle className="w-3 h-3" />
              <span>SHUFFLE REEL</span>
            </button>
          </div>

          {/* 3D Perspective Stage Container */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="movie-album-stage relative w-full h-[540px] sm:h-[600px] md:h-[630px] flex items-center justify-center select-none overflow-visible touch-manipulation my-2"
            style={{
              perspective: '1200px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {MUSEUM_ITEMS.map((item, idx) => {
              const total = MUSEUM_ITEMS.length;
              let diff = (idx - activeIndex) % total;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              // Only render visible surrounding cards in 3D deck
              const isVisible = Math.abs(diff) <= 2;
              if (!isVisible) return null;

              const isCenter = diff === 0;

              // Calculate 3D transforms for movie album sleeve positioning
              // Responsive for mobile screens (< 640px) and desktops
              let translateX = 0;
              let translateZ = 0;
              let rotateY = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 30;

              if (isCenter) {
                translateX = dragOffset;
                translateZ = 100;
                rotateY = dragOffset * 0.05;
                scale = 1;
                opacity = 1;
                zIndex = 40;
              } else if (diff === 1) {
                // First Card to the Right
                translateX = typeof window !== 'undefined' && window.innerWidth < 640 ? 175 : 290;
                translateZ = -90;
                rotateY = -28;
                scale = 0.85;
                opacity = 0.75;
                zIndex = 30;
              } else if (diff === -1) {
                // First Card to the Left
                translateX = typeof window !== 'undefined' && window.innerWidth < 640 ? -175 : -290;
                translateZ = -90;
                rotateY = 28;
                scale = 0.85;
                opacity = 0.75;
                zIndex = 30;
              } else if (diff === 2) {
                // Far Right Wing
                translateX = typeof window !== 'undefined' && window.innerWidth < 640 ? 290 : 510;
                translateZ = -190;
                rotateY = -42;
                scale = 0.72;
                opacity = 0.35;
                zIndex = 20;
              } else if (diff === -2) {
                // Far Left Wing
                translateX = typeof window !== 'undefined' && window.innerWidth < 640 ? -290 : -510;
                translateZ = -190;
                rotateY = 42;
                scale = 0.72;
                opacity = 0.35;
                zIndex = 20;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!isCenter) {
                      playSound('cyber_hover');
                      setActiveIndex(idx);
                    }
                  }}
                  style={{
                    transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: isSwiping && isCenter ? 'none' : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
                    transformStyle: 'preserve-3d'
                  }}
                  className={`movie-album-card absolute top-0 w-[84vw] max-w-[340px] sm:max-w-[390px] md:max-w-[420px] h-[520px] sm:h-[570px] md:h-[600px] rounded-3xl border transition-shadow duration-500 flex flex-col justify-between p-4 sm:p-5 select-none overflow-hidden cursor-pointer mobile-grunge-card ${
                    isCenter
                      ? 'border-pink/50 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(244,194,194,0.22)] bg-gradient-to-b from-[#18031d]/95 via-[#0e0212]/95 to-[#060609]'
                      : 'border-white/10 hover:border-white/30 bg-[#0e0212]/90 shadow-2xl backdrop-blur-md'
                  }`}
                >
                  {/* Vinyl / Film Disc Rim Accent (Peeks from behind top edge in 3D) */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-pink/30 bg-gradient-to-tr from-zinc-900 via-purple-950 to-black/80 pointer-events-none opacity-40 shadow-inner" />

                  {/* Top Badge Bar */}
                  <div className="flex items-center justify-between shrink-0 mb-2 relative z-10">
                    <span className="px-2.5 sm:px-3 py-1 rounded-full bg-pink/15 border border-pink/40 text-[9px] sm:text-[10px] font-mono tracking-widest text-pink uppercase font-semibold">
                      {item.tag}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-wider">
                      EST. {item.year}
                    </span>
                  </div>

                  {/* Main Specimen Image Frame */}
                  <div className="relative w-full h-[250px] sm:h-[285px] md:h-[305px] rounded-2xl overflow-hidden border border-white/10 bg-black/95 shrink-0 flex items-center justify-center p-2 group shadow-inner">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain filter brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                    {/* Specimen Owner Overlay Badge */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white">
                      <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20 uppercase tracking-widest text-[9px] truncate max-w-[65%]">
                        {item.originalOwner}
                      </span>
                      <span className="text-pink text-[9px] font-bold shrink-0">1-OF-1 ARCHIVE</span>
                    </div>
                  </div>

                  {/* Lower Album Sleeve Curatorial Info */}
                  <div className="flex flex-col justify-between flex-1 pt-2.5 pb-1 text-left relative z-10">
                    <div>
                      <h3 className="font-spartan font-bold text-sm sm:text-base uppercase text-white leading-tight line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs font-montserrat text-zinc-300 italic line-clamp-2 leading-relaxed mb-2">
                        "{item.story}"
                      </p>
                    </div>

                    {/* Reclaimed Material Specifications */}
                    <div className="py-1 px-2.5 rounded-lg bg-black/60 border border-white/10 text-[9px] sm:text-[10px] font-mono text-zinc-300 line-clamp-1 mb-2.5">
                      <span className="text-pink font-semibold">CRAFT: </span>
                      {item.materials}
                    </div>

                    {/* Custom Recreation Order CTA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommissionClick(item);
                      }}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-[0.16em] uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5 text-black" />
                      <span>REQUEST CUSTOM ORDER ↗</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3D Shuffle Controls Strip */}
          <div className="w-full max-w-xl flex flex-col items-center gap-3 mt-4 px-2">
            {/* Arrow & Shuffle Action Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={prevArtifact}
                aria-label="Previous Specimen"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={shuffleArtifacts}
                className="px-5 py-2.5 rounded-full bg-pink/20 hover:bg-pink/30 border border-pink/40 text-pink hover:text-white font-mono text-xs font-bold tracking-widest uppercase transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>SHUFFLE ALBUM</span>
              </button>

              <button
                onClick={nextArtifact}
                aria-label="Next Specimen"
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Specimen Track Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
              {MUSEUM_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    playSound('pip');
                    setActiveIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
                    activeIndex === idx
                      ? 'bg-pink text-black font-bold border-pink shadow-md'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW MODE 2: ARCHIVE INDEX (EDITORIAL CATALOGUE GRID)
            ========================================================================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {MUSEUM_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/12 bg-[#0c0c10] p-4 flex flex-col justify-between shadow-xl text-left mobile-grunge-card group hover:border-pink/40 transition-colors"
            >
              <div>
                <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-black mb-3 relative flex items-center justify-center p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain filter brightness-95 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-pink/20 border border-pink/40 text-[9px] font-mono text-pink uppercase font-semibold">
                    {item.tag}
                  </div>
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-zinc-400">
                    EST. {item.year}
                  </div>
                </div>

                <h4 className="font-spartan font-bold text-sm text-white uppercase mb-1 line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[11px] font-montserrat text-zinc-400 italic line-clamp-2 mb-2 leading-relaxed">
                  "{item.story}"
                </p>
                <div className="text-[10px] font-mono text-zinc-400 mb-3 line-clamp-1">
                  <span className="text-pink">Materials: </span>
                  {item.materials}
                </div>
              </div>

              <button
                onClick={() => handleCommissionClick(item)}
                className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black font-mono text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>REQUEST COMMISSION ↗</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
