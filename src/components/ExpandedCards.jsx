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
    <section id="vault" className="w-full py-24 px-6 sm:px-12 lg:px-20 bg-transparent select-none relative">
      {/* Ambient Dark Purple Background Glow (Zero Blue Tone) */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#2d052d]/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#be185d]/12 rounded-full blur-[140px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10 text-left">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 mb-3 text-pink-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(190,24,93,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#f472b6] animate-pulse" />
            <span>SIGNATURE INTERACTION 01 // EXPANDED RAIL</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase tracking-tight text-white leading-none text-left">
            EXPLORE THE <span className="chrome-text">VAULT PIECES</span>
          </h2>
        </div>
        <p className="text-silver/85 text-sm max-w-md font-montserrat text-left md:text-right leading-relaxed">
          Hover or tap any vertical slice to unfold its dimensional construction, reclaimed materials, and one-of-one provenance.
        </p>
      </div>

      {/* The Full Width Expanded Cards Rail */}
      <div className="flex flex-col md:flex-row gap-4 h-[560px] md:h-[500px] w-full relative z-10">
        {items.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={item.id || idx}
              onMouseEnter={() => handleCardInteraction(idx)}
              onClick={() => handleCardInteraction(idx)}
              className={`relative overflow-hidden rounded-3xl border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none transform-gpu touch-pan-y ${
                isExpanded
                  ? 'flex-[5] border-[#be185d]/80 shadow-[0_20px_60px_rgba(190,24,93,0.35),0_0_40px_rgba(45,5,45,0.7)]'
                  : 'flex-[1] md:flex-[1.2] border-[#be185d]/25 hover:border-[#f472b6]/50 filter grayscale hover:grayscale-0'
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
                className={`absolute bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-6 md:bottom-8 whitespace-nowrap transition-opacity duration-300 pointer-events-none ${
                  isExpanded ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="hidden md:block font-spartan font-bold text-xs uppercase tracking-widest text-white/90 [writing-mode:vertical-rl] rotate-180">
                  {item.name}
                </span>
                <span className="md:hidden font-spartan font-bold text-xs uppercase tracking-widest text-white/90">
                  {item.name.substring(0, 15)}...
                </span>
              </div>

              {/* Expanded Content */}
              <div
                className={`absolute inset-0 p-6 md:p-10 flex flex-col justify-between transition-opacity duration-500 ${
                  isExpanded ? 'opacity-100 pointer-events-auto delay-150' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Top Badges (Rounded Glassmorphism) */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#be185d]/40 text-pink-300 font-spartan font-black text-[10px] tracking-widest uppercase">
                    {item.tag || "ONE OF ONE"}
                  </span>
                  <span className="font-mono text-xs text-white font-semibold px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20">
                    {item.price ? formatPrice(item.price, currency) : item.year}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="w-full max-w-lg text-left">
                  <div className="text-[11px] font-mono tracking-widest text-[#f472b6] uppercase mb-1 text-left">
                    {item.category || item.commissionTier || "UPCYCLED WEARABLE ART"}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-spartan font-black uppercase text-white mb-2 leading-tight text-left">
                    {item.name}
                  </h3>
                  <p className="text-silver/90 text-xs md:text-sm font-montserrat line-clamp-2 mb-6 leading-relaxed text-left">
                    {item.description || item.story}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('metal');
                      onSelectProduct(item);
                    }}
                    className="btn-glass-pink"
                  >
                    <span>{item.price ? 'VIEW DETAILS' : 'INSPECT ARCHIVE'}</span>
                    <ArrowUpRight className="w-4 h-4" />
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
