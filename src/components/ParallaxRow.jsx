import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Scissors,
  Layers,
  Flame,
  Radio,
  Eye,
  Zap,
  Compass
} from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ParallaxRow({ entries = [], onCommissionLook }) {
  const [activeLook, setActiveLook] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState('spatial'); // 'spatial' | 'rail'
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringStage, setIsHoveringStage] = useState(false);
  const scrollContainerRef = useRef(null);
  const stageRef = useRef(null);

  // Mouse tilt tracking for 3D Spatial Stage
  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHoveringStage(true);
  const handleMouseLeave = () => {
    setIsHoveringStage(false);
    setMousePos({ x: 0, y: 0 });
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

  // Rail smooth scrolling
  const scrollRail = (direction) => {
    playSound('whoosh');
    if (!scrollContainerRef.current) return;
    const cardWidth = 380;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
      } else if (viewMode === 'spatial') {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLook, currentSlide, viewMode]);

  return (
    <section id="lookbook" className="w-full py-24 sm:py-32 bg-transparent select-none relative overflow-hidden">
      {/* Dynamic 3D Volumetric Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#6b21a8]/20 via-[#be185d]/15 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[450px] h-[450px] bg-[#3b0764]/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#831843]/20 rounded-full blur-[170px] pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full px-6 sm:px-12 lg:px-20 mb-8 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-[#f472b6]/40 mb-3 text-pink-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(244,114,182,0.25)]">
            <Radio className="w-3.5 h-3.5 text-[#f472b6] animate-pulse" />
            <span>DIMENSION 02 // 3D SPATIAL CATWALK</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase tracking-tight text-white leading-none text-left">
            SPATIAL <span className="chrome-text">LOOKBOOK</span>
          </h2>
          <p className="text-silver/85 text-xs sm:text-sm max-w-xl font-montserrat mt-3 leading-relaxed text-left">
            Experience our 1-of-1 wearable art in interactive 3D spatial depth. Rotate, tilt, and inspect archive silhouettes crafted for ultimate main character energy.
          </p>
        </div>

        {/* View Mode Switcher & Navigation Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-end">
          {/* Spatial 3D vs Rail Toggle */}
          <div className="flex items-center p-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
            <button
              onClick={() => {
                playSound('snap');
                setViewMode('spatial');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                viewMode === 'spatial'
                  ? 'bg-gradient-to-r from-[#be185d] to-[#9333ea] text-white font-bold shadow-[0_0_15px_rgba(190,24,93,0.5)]'
                  : 'text-silver/70 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-pink-300" />
              <span>3D Catwalk</span>
            </button>
            <button
              onClick={() => {
                playSound('snap');
                setViewMode('rail');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                viewMode === 'rail'
                  ? 'bg-gradient-to-r from-[#be185d] to-[#9333ea] text-white font-bold shadow-[0_0_15px_rgba(190,24,93,0.5)]'
                  : 'text-silver/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-pink-300" />
              <span>Archive Rail</span>
            </button>
          </div>

          {/* Quick Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={viewMode === 'spatial' ? prevSlide : () => scrollRail('left')}
              aria-label="Previous look"
              className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] hover:bg-[#be185d]/20 transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={viewMode === 'spatial' ? nextSlide : () => scrollRail('right')}
              aria-label="Next look"
              className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] hover:bg-[#be185d]/20 transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          MODE 1: INTERACTIVE 3D SPATIAL CATWALK (HERO EXPERIENCE)
          ======================================================== */}
      {viewMode === 'spatial' ? (
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 flex flex-col items-center justify-center min-h-[640px] lg:min-h-[720px] select-none perspective-[1400px]"
          style={{ perspective: '1400px' }}
        >
          {/* Volumetric Spotlight from Top */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] sm:w-[500px] h-[650px] pointer-events-none transition-all duration-300"
            style={{
              background: `radial-gradient(ellipse at top, rgba(244, 114, 182, 0.28) 0%, rgba(147, 51, 234, 0.15) 40%, transparent 80%)`,
              transform: `translateX(${mousePos.x * 40}px)`
            }}
          />

          {/* Perspective 3D Runway Grid Floor */}
          <div
            className="absolute bottom-4 left-0 right-0 h-44 pointer-events-none opacity-40 overflow-hidden"
            style={{
              perspective: '600px',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, transparent 100%)'
            }}
          >
            <div
              className="w-full h-full transform-gpu rotate-x-65 scale-125"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(244, 114, 182, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(147, 51, 234, 0.15) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                transform: `rotateX(65deg) translateY(${mousePos.y * 10}px)`
              }}
            />
          </div>

          {/* 3D Spatial Carousel Stage */}
          <div
            className="relative w-full flex items-center justify-center transition-transform duration-500 ease-out z-20 py-6"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${mousePos.x * 6}deg) rotateX(${-mousePos.y * 5}deg)`
            }}
          >
            {entries.map((item, idx) => {
              // Calculate spatial distance from current slide
              const count = entries.length;
              let diff = (idx - currentSlide) % count;
              if (diff > count / 2) diff -= count;
              if (diff < -count / 2) diff += count;

              const isCenter = diff === 0;
              const isPrev = diff === -1;
              const isNext = diff === 1;
              const isVisible = Math.abs(diff) <= 2;

              if (!isVisible) return null;

              // Compute 3D transforms based on spatial position
              let translateX = diff * (typeof window !== 'undefined' && window.innerWidth < 640 ? 180 : 340);
              let translateZ = isCenter ? 120 : -90 * Math.abs(diff);
              let rotateY = diff * -25;
              let scale = isCenter ? 1.08 : 0.85;
              let opacity = isCenter ? 1 : Math.max(0.25, 1 - Math.abs(diff) * 0.45);
              let blur = isCenter ? 0 : Math.abs(diff) * 3;

              // Dynamic mouse tilt for active card
              const tiltX = isCenter ? -mousePos.y * 12 : 0;
              const tiltY = isCenter ? mousePos.x * 14 : 0;

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
                  className={`absolute w-[280px] sm:w-[350px] md:w-[400px] h-[480px] sm:h-[560px] rounded-3xl cursor-pointer transition-all duration-700 ease-out transform-gpu ${
                    isCenter ? 'z-30' : Math.abs(diff) === 1 ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY + tiltY}deg) rotateX(${tiltX}deg) scale(${scale})`,
                    opacity,
                    filter: `blur(${blur}px)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Outer Holographic Glow Shell */}
                  <div
                    className={`w-full h-full rounded-3xl p-[1.5px] transition-all duration-500 relative overflow-hidden ${
                      isCenter
                        ? 'bg-gradient-to-br from-[#f472b6] via-[#c084fc] to-[#a855f7] shadow-[0_25px_70px_rgba(192,132,252,0.45)]'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {/* Inner Card Container */}
                    <div className="w-full h-full bg-[#0d0212]/95 rounded-[22px] overflow-hidden relative flex flex-col justify-between">
                      {/* Image Layer */}
                      <img
                        src={item.image}
                        alt={item.title}
                        loading={isCenter ? 'eager' : 'lazy'}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          isCenter ? 'scale-105 brightness-105' : 'scale-100 brightness-90'
                        }`}
                      />

                      {/* Holographic Specular Sheen on Mouse Hover */}
                      {isCenter && isHoveringStage && (
                        <div
                          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-200"
                          style={{
                            background: `radial-gradient(circle 350px at ${((mousePos.x + 1) / 2) * 100}% ${((mousePos.y + 1) / 2) * 100}%, rgba(255,255,255,0.4) 0%, transparent 80%)`
                          }}
                        />
                      )}

                      {/* Scrim Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85" />

                      {/* Top Badges */}
                      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">
                        <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#f472b6]/50 text-pink-300 text-[10px] font-mono tracking-widest uppercase shadow-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6] animate-ping" />
                          <span>{item.code.split('//')[0] || `LOOK 00${idx + 1}`}</span>
                        </span>

                        <div className="w-9 h-9 rounded-full border border-white/20 bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] transition-all">
                          <Maximize2 className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Bottom Editorial Caption */}
                      <div className="absolute bottom-5 left-5 right-5 flex flex-col text-left z-20">
                        <span className="text-[10px] font-mono text-[#f472b6] font-bold tracking-widest uppercase mb-1 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#f472b6]" />
                          <span>{item.vibe || 'HAUTE WEARABLE ART'}</span>
                        </span>

                        <h3 className="text-2xl sm:text-3xl font-spartan font-black uppercase text-white leading-tight mb-2">
                          {item.title}
                        </h3>

                        <p className="text-xs text-silver/80 font-montserrat line-clamp-2 leading-relaxed mb-3">
                          {item.subtitle || item.story}
                        </p>

                        {/* Interactive Action Pill */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
                          <span className="text-pink-300 flex items-center gap-1 group-hover:text-white transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isCenter ? 'INSPECT SPECIMEN ↗' : 'FOCUS LOOK'}</span>
                          </span>
                          <span className="text-[10px] text-silver/60">
                            {idx + 1} / {entries.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Center Look Live Specimen Telemetry Card */}
          {currentEntry && (
            <div className="w-full max-w-3xl mt-8 sm:mt-12 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#190422]/90 via-[#270635]/85 to-[#16031f]/90 border border-[#f472b6]/40 backdrop-blur-xl shadow-2xl relative z-30 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#f472b6]/20 border border-[#f472b6]/60 text-pink-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    CURRENT STAGED SPECIMEN
                  </span>
                  <span className="text-silver/50 text-[11px] font-mono">
                    {currentEntry.code}
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-spartan font-black uppercase text-white mb-1">
                  {currentEntry.title}
                </h4>

                <p className="text-xs text-silver/80 font-montserrat leading-relaxed line-clamp-2">
                  {currentEntry.story}
                </p>

                {/* Baddie Atelier Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-[11px] font-mono">
                  <div>
                    <span className="text-silver/50 block text-[9px] uppercase">AURA / ENERGY</span>
                    <strong className="text-pink-300">100% UNHINGED</strong>
                  </div>
                  <div>
                    <span className="text-silver/50 block text-[9px] uppercase">GRAIL STATUS</span>
                    <strong className="text-purple-300">ARCHIVE 1-OF-1</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-silver/50 block text-[9px] uppercase">CRAFT LOCATION</span>
                    <strong className="text-white">GUWAHATI ATELIER</strong>
                  </div>
                </div>
              </div>

              {/* Commission Action */}
              <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => openLightbox(currentEntry, currentSlide)}
                  className="btn-glass-pink py-3 px-6 text-xs font-spartan font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(244,114,182,0.3)]"
                >
                  <Eye className="w-4 h-4" />
                  <span>INSPECT FULL LOOK ↗</span>
                </button>

                {onCommissionLook && (
                  <button
                    onClick={() => {
                      playSound('subdrop');
                      onCommissionLook(currentEntry.title);
                    }}
                    className="btn-glass py-2.5 px-6 text-[11px] font-spartan font-bold tracking-widest uppercase text-silver hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5 text-pink-400" />
                    <span>COMMISSION SILHOUETTE</span>
                  </button>
                )}
              </div>
            </div>
          )}

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
      ) : (
        /* ========================================================
           MODE 2: EDITORIAL HORIZONTAL RAIL WITH 3D DEPTH
           ======================================================== */
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto no-scrollbar flex items-center gap-8 px-6 sm:px-12 lg:px-20 py-12 scroll-smooth relative z-10 touch-pan-x"
          style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}
        >
          {entries.map((item, idx) => {
            const staggerConfigs = [
              { tilt: 'lg:-rotate-2', offsetY: 'lg:-translate-y-6', height: 'h-[490px]' },
              { tilt: 'lg:rotate-2', offsetY: 'lg:translate-y-7', height: 'h-[530px]' },
              { tilt: 'lg:-rotate-1', offsetY: 'lg:-translate-y-3', height: 'h-[470px]' },
              { tilt: 'lg:rotate-1.5', offsetY: 'lg:translate-y-5', height: 'h-[520px]' },
              { tilt: 'lg:-rotate-2.5', offsetY: 'lg:-translate-y-8', height: 'h-[500px]' },
              { tilt: 'lg:rotate-2', offsetY: 'lg:translate-y-4', height: 'h-[540px]' }
            ];
            const config = staggerConfigs[idx % staggerConfigs.length];

            return (
              <article
                key={item.id || idx}
                onClick={() => openLightbox(item, idx)}
                className={`group relative flex-shrink-0 w-[290px] sm:w-[350px] md:w-[390px] ${config.height} ${config.tilt} ${config.offsetY} rounded-3xl overflow-hidden cursor-pointer border border-[#be185d]/30 hover:border-[#f472b6] transition-all duration-500 bg-[#0e0210]/95 shadow-2xl hover:shadow-[0_25px_60px_rgba(190,24,93,0.5)] transform-gpu hover:rotate-0 hover:scale-105 hover:z-30 text-left`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-95 group-hover:brightness-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#be185d]/40 text-pink-300 text-[10px] font-mono tracking-widest uppercase">
                    {item.code.split('//')[0] || `LOOK 00${idx + 1}`}
                  </span>

                  <div className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white group-hover:text-pink-300 group-hover:border-[#be185d] group-hover:bg-[#be185d]/20 transition-all">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col text-left">
                  <span className="text-[10px] font-mono text-[#f472b6] tracking-widest uppercase mb-1">
                    {item.vibe || 'HAUTE WEARABLE ART'}
                  </span>
                  <h3 className="text-2xl font-spartan font-black uppercase text-white leading-tight group-hover:text-pink-300 transition-colors text-left">
                    {item.title}
                  </h3>
                  <p className="text-xs text-silver/80 font-montserrat mt-2 line-clamp-2 leading-relaxed text-left">
                    {item.subtitle || item.story}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-pink-300 group-hover:text-white transition-colors">
                    <span>INSPECT SPECIMEN</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ========================================================
          FULL-SCREEN INSPECT MODAL (LIGHTBOX)
          ======================================================== */}
      {activeLook && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        >
          {/* Top Controls */}
          <div className="absolute top-5 left-6 right-6 flex items-center justify-between text-silver z-50">
            <div className="text-xs font-mono tracking-widest text-pink-300 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f472b6] animate-pulse" />
              <span>{activeLook.code} // {currentSlide + 1} OF {entries.length}</span>
            </div>

            <button
              onClick={closeLightbox}
              aria-label="Close modal"
              className="w-10 h-10 rounded-full border border-white/20 bg-black/70 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] hover:bg-[#be185d]/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            aria-label="Previous look"
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/70 backdrop-blur-md items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] hover:bg-[#be185d]/20 transition-all z-50 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            aria-label="Next look"
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/70 backdrop-blur-md items-center justify-center text-white hover:text-pink-300 hover:border-[#f472b6] hover:bg-[#be185d]/20 transition-all z-50 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] bg-[#0d020f]/95 border border-[#f472b6]/40 rounded-3xl p-6 sm:p-10 shadow-[0_20px_70px_rgba(244,114,182,0.3)] flex flex-col md:flex-row gap-8 items-center overflow-y-auto"
          >
            {/* Main Visual Frame */}
            <div className="relative w-full md:w-1/2 max-h-[50vh] md:max-h-[70vh] flex items-center justify-center rounded-2xl overflow-hidden bg-black/60 border border-white/10">
              <img
                src={activeLook.image}
                alt={activeLook.title}
                className="max-h-[50vh] md:max-h-[70vh] w-full object-contain rounded-2xl"
              />
            </div>

            {/* Information & Action */}
            <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-mono tracking-widest text-[#f472b6] uppercase block mb-1 font-bold">
                  {activeLook.code}
                </span>
                <h3 className="text-3xl sm:text-4xl font-spartan font-black uppercase text-white mb-2 leading-tight text-left">
                  {activeLook.title}
                </h3>
                <div className="text-sm font-display text-lavender mb-4 italic text-left">
                  "{activeLook.subtitle}"
                </div>

                <p className="text-silver/85 text-xs sm:text-sm font-montserrat leading-relaxed mb-6 text-left">
                  {activeLook.story}
                </p>

                {/* Details Badges */}
                <div className="p-4 rounded-2xl bg-[#19041b]/70 border border-[#f472b6]/25 text-xs font-mono text-silver/90 mb-6 space-y-1.5 text-left shadow-inner">
                  <div><strong className="text-[#f472b6]">Materials:</strong> {activeLook.materials || 'Reclaimed electronics, spikes, upcycled denim, steel'}</div>
                  <div><strong className="text-[#f472b6]">Craftsmanship:</strong> 100% Handcrafted by Dhrisni in Guwahati</div>
                  <div><strong className="text-[#f472b6]">Vibe:</strong> {activeLook.vibe || 'Haute Wearable Art'}</div>
                  {activeLook.caption && (
                    <div className="text-silver/60 pt-1 text-[11px]">{activeLook.caption}</div>
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
                  className="btn-glass-pink py-3.5 px-6 text-xs font-spartan font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(244,114,182,0.3)]"
                >
                  <Scissors className="w-4 h-4" />
                  <span>COMMISSION IN THIS SILHOUETTE ↗</span>
                </button>

                <button
                  onClick={closeLightbox}
                  className="btn-glass py-3.5 px-5 text-xs font-spartan font-bold tracking-widest uppercase text-silver hover:text-white cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
