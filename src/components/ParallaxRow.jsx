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

function ParallaxRow({ entries = [], onCommissionLook }) {
  const [activeLook, setActiveLook] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollTrackRef = useRef(null);

  const currentEntry = entries[currentSlide] || entries[0];

  const goToSlide = (index) => {
    playSound('whoosh');
    const safeIdx = (index + entries.length) % entries.length;
    setCurrentSlide(safeIdx);

    const el = scrollTrackRef.current;
    if (el) {
      const card = el.querySelector('article');
      const cardWidth = card ? card.clientWidth + 20 : 320;
      el.scrollTo({ left: safeIdx * cardWidth, behavior: 'smooth' });
    }
  };

  const nextSlide = (e) => {
    e?.stopPropagation();
    goToSlide(currentSlide + 1);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    goToSlide(currentSlide - 1);
  };

  const handleScroll = () => {
    const el = scrollTrackRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const cardWidth = card ? card.clientWidth + 20 : 320;
    const idx = Math.min(Math.round(el.scrollLeft / cardWidth), entries.length - 1);
    if (idx >= 0 && idx !== currentSlide) {
      setCurrentSlide(idx);
    }
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

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeLook) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLook, currentSlide]);

  return (
    <section id="lookbook" className="w-full py-10 sm:py-14 px-4 sm:px-8 lg:px-12 bg-transparent select-none relative overflow-hidden border-t border-white/10">
      {/* Header Bar (Unified for Desktop and Mobile) */}
      <div className="w-full mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 relative z-10 text-left border-b border-white/10 pb-6">
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

      {/* Main Container — Identical on Desktop and Mobile */}
      <div className="w-full">
        {/* Quick Look Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-4 scroll-smooth">
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

        {/* Fluid Horizontal Editorial Rail */}
        <div
          ref={scrollTrackRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-1 scroll-smooth touch-scroll-x"
        >
          {entries.map((item, idx) => (
            <article
              key={item.id || idx}
              onClick={() => openLightbox(item, idx)}
              className="snap-center shrink-0 w-[86vw] sm:w-[340px] md:w-[360px] lg:w-[380px] h-[500px] sm:h-[540px] rounded-3xl overflow-hidden relative flex flex-col justify-between p-5 sm:p-6 bg-[#0d0212] border border-white/15 shadow-2xl cursor-pointer select-none transition-all duration-300 hover:border-pink/60 hover:shadow-[0_20px_50px_rgba(244,194,194,0.2)] hover:-translate-y-2 group"
            >
              {/* Image Frame */}
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

              {/* Top Badge Bar */}
              <div className="relative z-10 flex items-center justify-between text-left">
                <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono tracking-widest uppercase font-bold">
                  {item.code?.split('•')[0]?.trim() || `LOOK 00${idx + 1}`}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(item, idx);
                  }}
                  aria-label="Inspect Full Look"
                  className="p-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-pink transition-all cursor-pointer shadow-md"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Editorial Content */}
              <div className="relative z-10 flex flex-col text-left">
                <span className="text-[10px] font-mono text-pink font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-pink" />
                  <span>{item.vibe || 'HAUTE WEARABLE ART'}</span>
                </span>

                <h3 className="text-xl sm:text-2xl font-mono font-bold uppercase text-white leading-tight mb-1.5">
                  {item.title}
                </h3>

                <p className="text-xs text-zinc-300 font-mono line-clamp-2 leading-relaxed mb-3">
                  {item.subtitle || item.story}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs font-mono">
                  <span className="py-1 px-3 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 bg-white/15 border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    <span>SEE FULL LOOK ↗</span>
                  </span>

                  <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                    0{idx + 1} / 0{entries.length}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress Dot Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {entries.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              aria-label={`Go to look ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === currentSlide
                  ? 'w-8 h-2 bg-pink shadow-[0_0_10px_rgba(244,114,182,0.8)]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLook && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in"
        >
          {/* Modal Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="lookbook-modal-card modal-card relative w-full max-w-5xl max-h-[92vh] rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center overflow-y-auto z-10 shadow-2xl bg-[#0d0212] border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Lookbook High-Res Image */}
            <div className="w-full md:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden relative shadow-2xl bg-black border border-white/10">
              <img
                src={activeLook.image}
                alt={activeLook.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-pink tracking-widest uppercase font-bold">
                {activeLook.code || 'RUNWAY EDITORIAL'}
              </div>
            </div>

            {/* Right: Look Details & Custom Commission */}
            <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink font-semibold block mb-1">
                  EDITORIAL ARCHIVE SPECIMEN
                </span>
                <h3 className="text-2xl sm:text-3xl font-mono font-bold uppercase text-white mb-2 leading-tight">
                  {activeLook.title}
                </h3>

                <p className="text-xs sm:text-sm font-mono text-zinc-300 mb-4 leading-relaxed">
                  {activeLook.story || activeLook.subtitle}
                </p>

                {activeLook.materials && (
                  <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 mb-4">
                    <span className="text-zinc-500 block uppercase text-[9px] font-mono tracking-[0.2em] mb-1 font-semibold">
                      MATERIALS & CONSTRUCTION
                    </span>
                    <span className="text-white text-xs font-mono">
                      {activeLook.materials}
                    </span>
                  </div>
                )}
              </div>

              {/* Commission Order Action */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    playSound('metal');
                    closeLightbox();
                    if (onCommissionLook) {
                      onCommissionLook(activeLook.title);
                    } else {
                      document.getElementById('custom')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scissors className="w-4 h-4" />
                  <span>COMMISSION SIMILAR LOOK ↗</span>
                </button>
                <p className="text-[10px] font-mono text-zinc-500 text-center mt-2 uppercase tracking-wider">
                  Handcrafted made-to-measure by Dhrisni • 2 to 3 weeks
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


export default React.memo(ParallaxRow);
