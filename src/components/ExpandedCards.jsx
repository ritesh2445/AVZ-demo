import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { playSound } from '../utils/audio';
import { formatPrice } from '../data/brandData';

export default function ExpandedCards({ items = [], onSelectProduct, currency = 'INR' }) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileTrackRef = useRef(null);

  const total = items.length;

  const handleCardInteraction = (idx) => {
    if (expandedIndex !== idx) {
      playSound('whoosh');
      setExpandedIndex(idx);
    }
  };

  const handleMobileScroll = () => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const cardWidth = card ? card.clientWidth + 16 : 300;
    const idx = Math.min(Math.round(el.scrollLeft / cardWidth), total - 1);
    if (idx >= 0 && idx !== activeMobileIndex) {
      setActiveMobileIndex(idx);
    }
  };

  const scrollToCard = (idx) => {
    const targetIdx = Math.max(0, Math.min(idx, total - 1));
    playSound('whoosh');
    setExpandedIndex(targetIdx);
    setActiveMobileIndex(targetIdx);

    const el = mobileTrackRef.current;
    if (el) {
      const card = el.querySelector('article');
      const cardWidth = card ? card.clientWidth + 16 : 300;
      el.scrollTo({ left: targetIdx * cardWidth, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    scrollToCard(activeMobileIndex - 1);
  };

  const scrollNext = () => {
    scrollToCard(activeMobileIndex + 1);
  };

  return (
    <section id="vault" className="w-full py-8 sm:py-12 px-4 sm:px-8 lg:px-14 bg-transparent select-none relative">
      {/* Refined Minimalist Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4 relative z-10 text-left border-b border-white/10 pb-4">
        <div>
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-2.5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span>VAULT ARCHIVE</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono font-medium tracking-[0.16em] text-white uppercase leading-tight text-left">
            THE VAULT <span className="text-zinc-500 font-light">PIECES</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono tracking-wider text-left mt-1 max-w-sm">
            Archival specimens handcrafted in our Guwahati studio.
          </p>
        </div>

        {/* Carousel HUD Controls & Quick Jump Specimen Pills */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
          <span className="text-xs font-mono text-zinc-400 tracking-wider">
            [ 0{activeMobileIndex + 1} / 0{total} ]
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollPrev}
              disabled={activeMobileIndex === 0}
              aria-label="Previous specimen"
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-md ${
                activeMobileIndex === 0
                  ? 'bg-black/30 border-white/5 text-zinc-600 cursor-not-allowed'
                  : 'bg-black/80 hover:bg-white/15 border-white/20 text-white hover:border-pink active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              disabled={activeMobileIndex === total - 1}
              aria-label="Next specimen"
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-md ${
                activeMobileIndex === total - 1
                  ? 'bg-black/30 border-white/5 text-zinc-600 cursor-not-allowed'
                  : 'bg-black/80 hover:bg-white/15 border-white/20 text-white hover:border-pink active:scale-95'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Specimen Jump Selector (Visible on both Mobile and Desktop) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-4">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToCard(idx)}
            className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
              activeMobileIndex === idx
                ? 'bg-pink text-black font-bold border-pink shadow-md'
                : 'bg-white/5 text-zinc-400 border-white/10 hover:border-pink hover:text-white'
            }`}
          >
            0{idx + 1}
          </button>
        ))}
      </div>

      {/* =========================================================================
          DESKTOP (MD+): SPACIOUS, WIDE MINIMALIST EXPANDABLE RAIL
          ========================================================================= */}
      <div className="hidden md:flex flex-row gap-3 lg:gap-4 h-[560px] lg:h-[620px] w-full relative z-10">
        {items.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={item.id || idx}
              onMouseEnter={() => handleCardInteraction(idx)}
              onClick={() => handleCardInteraction(idx)}
              className={`relative overflow-hidden rounded-3xl border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none transform-gpu ${
                isExpanded
                  ? 'flex-[5] min-w-0 border-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] mobile-grunge-card'
                  : 'flex-[1] min-w-[90px] lg:min-w-[110px] border-white/10 hover:border-white/25 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Image Frame */}
              <img
                src={item.images ? item.images[0] : item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out pointer-events-none"
                style={{
                  transform: isExpanded ? 'scale(1.02)' : 'scale(1.12)',
                  filter: isExpanded ? 'brightness(0.95)' : 'brightness(0.55)'
                }}
              />

              {/* Minimal Vignette Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity duration-500 pointer-events-none ${
                  isExpanded ? 'opacity-90' : 'opacity-70'
                }`}
              />

              {/* Collapsed State: Vertical Text Title */}
              <div
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 pointer-events-none ${
                  isExpanded ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/80 [writing-mode:vertical-rl] rotate-180">
                  {item.name}
                </span>
              </div>

              {/* Expanded State: Clean Minimalist Details */}
              <div
                className={`absolute inset-0 p-6 lg:p-8 flex flex-col justify-between transition-opacity duration-500 image-overlay-text ${
                  isExpanded ? 'opacity-100 pointer-events-auto delay-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Top: Understated Specimen Index & Price */}
                <div className="flex items-center justify-between text-left">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-pink font-semibold uppercase">
                    ARCHIVE 0{idx + 1}
                  </span>
                  <span className="text-xs lg:text-sm font-mono font-bold text-white tracking-wider px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
                    {item.price ? formatPrice(item.price, currency) : item.year || 'BESPOKE'}
                  </span>
                </div>

                {/* Bottom: Title & Clean Action Button */}
                <div className="w-full max-w-md text-left">
                  <h3 className="text-lg lg:text-2xl font-mono font-bold uppercase text-white mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-zinc-300 text-xs font-montserrat line-clamp-2 mb-4 leading-relaxed">
                    {item.description || item.story}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('metal');
                      onSelectProduct(item);
                    }}
                    className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                  >
                    <span>VIEW ARCHIVE PIECE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          MOBILE (< MD): FLUID HORIZONTAL SWIPEABLE VAULT RAIL
          Guaranteed natural touch swiping, centered cards, zero scroll lock
          ========================================================================= */}
      <div
        ref={mobileTrackRef}
        onScroll={handleMobileScroll}
        className="flex md:hidden gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1 scroll-smooth touch-pan-x"
      >
        {items.map((item, idx) => (
          <article
            key={item.id || idx}
            onClick={() => {
              playSound('metal');
              onSelectProduct(item);
            }}
            className="snap-center shrink-0 w-[85vw] max-w-[340px] h-[480px] rounded-3xl border border-white/15 overflow-hidden relative cursor-pointer shadow-xl select-none flex flex-col justify-between p-5 bg-[#0d0d12] mobile-grunge-card"
          >
            {/* Image Frame with pointer-events-none to prevent drag locking */}
            <img
              src={item.images ? item.images[0] : item.image}
              alt={item.name}
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover filter brightness-95 pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />

            {/* Top Bar */}
            <div className="relative z-10 flex items-center justify-between text-left">
              <span className="text-[10px] font-mono tracking-[0.2em] text-pink font-semibold uppercase">
                ARCHIVE 0{idx + 1}
              </span>
              <span className="text-xs font-mono font-bold text-white tracking-wider px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15">
                {item.price ? formatPrice(item.price, currency) : item.year || 'BESPOKE'}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 text-left image-overlay-text">
              <h3 className="text-base font-mono font-bold uppercase text-white mb-1.5 leading-snug line-clamp-1">
                {item.name}
              </h3>
              <p className="text-zinc-300 text-xs font-montserrat line-clamp-2 mb-3 leading-relaxed">
                {item.description || item.story}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('metal');
                  onSelectProduct(item);
                }}
                className="w-full py-2.5 px-4 rounded-full border border-white/20 bg-white/15 hover:bg-white text-white hover:text-black text-[11px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <span>VIEW ARCHIVE PIECE</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
