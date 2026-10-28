import React, { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
import { formatPrice } from '../data/brandData';

export default function ExpandedCards({ items, onSelectProduct, currency = 'INR' }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const handleCardInteraction = (idx) => {
    if (expandedIndex !== idx) {
      playSound('whoosh');
      setExpandedIndex(idx);
    }
  };

  return (
    <section id="vault" className="w-full py-10 sm:py-14 px-4 sm:px-8 lg:px-12 bg-transparent select-none relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 sm:gap-6 relative z-10 text-left">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 mb-3 text-zinc-400 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>ARCHIVE COLLECTION // EXPANDED RAIL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-mono tracking-[0.2em] text-white uppercase leading-tight text-left">
            EXPLORE THE <span className="text-zinc-400 font-light">VAULT PIECES</span>
          </h2>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md font-montserrat text-left md:text-right leading-relaxed">
          Select any specimen to view dimensional construction, raw reclaimed materials, and individual atelier provenance.
        </p>
      </div>

      {/* The Full Width Expanded Cards Rail (Horizontal on all screens including mobile) */}
      <div className="flex flex-row gap-2 sm:gap-4 h-[440px] sm:h-[480px] md:h-[500px] w-full relative z-10">
        {items.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={item.id || idx}
              onMouseEnter={() => handleCardInteraction(idx)}
              onClick={() => handleCardInteraction(idx)}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none transform-gpu touch-pan-y ${
                isExpanded
                  ? 'flex-[5] min-w-0 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mobile-grunge-card'
                  : 'flex-[1] min-w-[34px] sm:min-w-[48px] md:flex-[1.2] border-white/10 hover:border-white/20 filter grayscale hover:grayscale-0'
              }`}
            >
              {/* Background Image */}
              <img
                src={item.images ? item.images[0] : item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out transform scale-105"
                style={{
                  transform: isExpanded ? 'scale(1.02)' : 'scale(1.15)',
                  filter: isExpanded ? 'brightness(0.95)' : 'brightness(0.5)'
                }}
              />

              {/* Dark Purple Plum Gradient Scrim */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-[#2d052d]/30 transition-opacity duration-500 ${
                  isExpanded ? 'opacity-90' : 'opacity-70'
                }`}
              />

              {/* Collapsed State Title (Vertical text in sliver) */}
              <div
                className={`absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-300 pointer-events-none ${
                  isExpanded ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="font-spartan font-bold text-[9px] sm:text-xs uppercase tracking-widest text-white/90 [writing-mode:vertical-rl] rotate-180">
                  {item.name}
                </span>
              </div>

              {/* Expanded Content */}
              <div
                className={`absolute inset-0 p-4 sm:p-6 md:p-10 flex flex-col justify-between transition-opacity duration-500 ${
                  isExpanded ? 'opacity-100 pointer-events-auto delay-150' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-white font-mono text-[9px] tracking-widest uppercase">
                    {item.tag || "ONE OF ONE"}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs text-zinc-300 font-semibold px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/15">
                    {item.price ? formatPrice(item.price, currency) : item.year}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="w-full max-w-lg text-left">
                  <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-1 text-left truncate">
                    {item.category || item.commissionTier || "UPCYCLED WEARABLE ART"}
                  </div>
                  <h3 className="text-base sm:text-xl md:text-2xl font-mono font-medium uppercase text-white mb-1 sm:mb-2 leading-tight text-left line-clamp-1 sm:line-clamp-none">
                    {item.name}
                  </h3>
                  <p className="text-zinc-300 text-[11px] sm:text-xs font-montserrat line-clamp-2 mb-3 sm:mb-4 leading-relaxed text-left">
                    {item.description || item.story}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('metal');
                      onSelectProduct(item);
                    }}
                    className="px-4 py-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5"
                  >
                    <span>{item.price ? 'VIEW DETAILS' : 'INSPECT ARCHIVE'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
