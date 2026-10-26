import React, { useState, useRef, useEffect } from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Scissors
} from 'lucide-react';
import { playSound } from '../utils/audio';

export default function ParallaxRow({ entries = [], onCommissionLook }) {
  const [activeLook, setActiveLook] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Smooth scroll left or right by one card width
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
    setActiveIndex(index);
  };

  const closeLightbox = () => {
    playSound('pip');
    setActiveLook(null);
  };

  const nextLook = (e) => {
    e?.stopPropagation();
    playSound('whoosh');
    const nextIdx = (activeIndex + 1) % entries.length;
    setActiveIndex(nextIdx);
    setActiveLook(entries[nextIdx]);
  };

  const prevLook = (e) => {
    e?.stopPropagation();
    playSound('whoosh');
    const prevIdx = (activeIndex - 1 + entries.length) % entries.length;
    setActiveIndex(prevIdx);
    setActiveLook(entries[prevIdx]);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeLook) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLook();
      if (e.key === 'ArrowLeft') prevLook();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLook, activeIndex]);

  return (
    <section id="lookbook" className="w-full py-24 sm:py-32 bg-transparent select-none relative overflow-hidden">
      {/* Background Subtle Ambient Glow (True Deep Dark Purple Plum) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#2d052d]/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#be185d]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header Bar */}
      <div className="w-full px-6 sm:px-12 lg:px-20 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 mb-3 text-pink-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(190,24,93,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>EDITORIAL VISIONS // ARCHIVE 02</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase tracking-tight text-white leading-none text-left">
            SPATIAL <span className="chrome-text">LOOKBOOK</span>
          </h2>
          <p className="text-silver/85 text-xs sm:text-sm max-w-xl font-montserrat mt-3 leading-relaxed text-left">
            Curated photographic archive of one-of-a-kind wearable art. Swipe or scroll horizontally through the atelier collection. Tap any look for full details.
          </p>
        </div>

        {/* Clean Smooth Navigation Arrows */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollRail('left')}
            aria-label="Previous looks"
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] hover:bg-[#be185d]/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollRail('right')}
            aria-label="Next looks"
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] hover:bg-[#be185d]/20 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Smooth Horizontal Editorial Rail with Native Mobile Touch Momentum & Asymmetric Arrangement */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto no-scrollbar flex items-center gap-8 px-6 sm:px-12 lg:px-20 py-12 scroll-smooth relative z-10 touch-pan-x"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}
      >
        {entries.map((item, idx) => {
          // Asymmetric staggered arrangement pattern modeled on later.com/made-you-look
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
              className={`group relative flex-shrink-0 w-[290px] sm:w-[350px] md:w-[390px] ${config.height} ${config.tilt} ${config.offsetY} rounded-3xl overflow-hidden cursor-pointer border border-[#be185d]/30 hover:border-[#f472b6] transition-all duration-500 bg-[#0e0210]/95 shadow-2xl hover:shadow-[0_25px_60px_rgba(75,8,68,0.7)] transform-gpu hover:rotate-0 hover:scale-105 hover:z-30 text-left`}
            >
              {/* Image Frame with Smooth Gentle Hover Zoom */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-95 group-hover:brightness-105"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

              {/* Top Look Badge */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#be185d]/40 text-pink-300 text-[10px] font-mono tracking-widest uppercase">
                  {item.code.split('//')[0] || `LOOK 00${idx + 1}`}
                </span>

                <div className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white group-hover:text-pink-300 group-hover:border-[#be185d] group-hover:bg-[#be185d]/20 transition-all">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom Editorial Caption */}
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

                {/* Inspect Link Indicator */}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono text-pink-300 group-hover:text-white transition-colors">
                  <span>INSPECT SPECIMEN</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Clean, Elegant Full-Screen Modal */}
      {activeLook && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        >
          {/* Top Controls */}
          <div className="absolute top-5 left-6 right-6 flex items-center justify-between text-silver z-50">
            <div className="text-xs font-mono tracking-widest text-pink-300 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f472b6] animate-pulse" />
              <span>{activeLook.code} // {activeIndex + 1} OF {entries.length}</span>
            </div>

            <button
              onClick={closeLightbox}
              aria-label="Close modal"
              className="w-10 h-10 rounded-full border border-white/20 bg-black/70 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] hover:bg-[#be185d]/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevLook}
            aria-label="Previous look"
            className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/70 backdrop-blur-md items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] hover:bg-[#be185d]/20 transition-all z-50 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextLook}
            aria-label="Next look"
            className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/70 backdrop-blur-md items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] hover:bg-[#be185d]/20 transition-all z-50 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] bg-[#0d020f]/95 border border-[#be185d]/35 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row gap-8 items-center overflow-y-auto"
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
                <span className="text-xs font-mono tracking-widest text-[#f472b6] uppercase block mb-1">
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
                <div className="p-4 rounded-2xl bg-[#19041b]/70 border border-[#be185d]/25 text-xs font-mono text-silver/90 mb-6 space-y-1.5 text-left shadow-inner">
                  <div><strong className="text-[#f472b6]">Materials:</strong> {activeLook.materials || 'Reclaimed electronics, spikes, upcycled denim, steel'}</div>
                  <div><strong className="text-[#f472b6]">Craftsmanship:</strong> 100% Handcrafted in Guwahati atelier</div>
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
                  className="btn-glass-pink py-3.5 px-6 text-xs font-spartan font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer"
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
