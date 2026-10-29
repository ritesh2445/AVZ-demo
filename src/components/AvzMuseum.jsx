import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Scissors,
  Sparkles,
  Maximize2,
  Layers,
  Shield,
  ArrowUpRight
} from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function AvzMuseum({ onRequestCustomCommission, theme = 'dark' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const vitrineRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const activeItem = MUSEUM_ITEMS[activeIndex] || MUSEUM_ITEMS[0];

  // Smooth mouse tilt tracking for 3D holographic physical depth
  const handleMouseMove = (e) => {
    if (!vitrineRef.current) return;
    const rect = vitrineRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setTilt({
      x: Math.max(-1, Math.min(1, x)) * 7,
      y: Math.max(-1, Math.min(1, y)) * -7
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Touch Swipe Handlers for mobile gestures (allows natural vertical scroll)
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Trigger next/prev only if horizontal swipe is clearly intentional
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        nextArtifact();
      } else {
        prevArtifact();
      }
    }
  };

  const selectArtifact = (index) => {
    playSound('pip');
    setActiveIndex((index + MUSEUM_ITEMS.length) % MUSEUM_ITEMS.length);
  };

  const nextArtifact = () => {
    playSound('pip');
    setActiveIndex((prev) => (prev + 1) % MUSEUM_ITEMS.length);
  };

  const prevArtifact = () => {
    playSound('pip');
    setActiveIndex((prev) => (prev - 1 + MUSEUM_ITEMS.length) % MUSEUM_ITEMS.length);
  };

  const handleCommissionClick = (item) => {
    playSound('snap');
    if (onRequestCustomCommission) {
      onRequestCustomCommission(`Archival Recreation: ${item.name}`);
    }
    const el = document.getElementById('custom');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="museum"
      className="w-full py-8 sm:py-14 px-4 sm:px-8 lg:px-14 bg-transparent select-none border-t border-white/10 text-left relative overflow-hidden"
    >
      {/* Background Atmospheric Radial Bloom */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#3a083a]/20 rounded-full blur-[180px] pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3 border-b border-white/10 pb-4 relative z-10 text-left">
        <div>
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-2.5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span>PERMANENT ARCHIVE • ONE-OF-A-KIND PIECES</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono font-medium uppercase tracking-[0.16em] text-white leading-tight">
            ARCHIVE <span className="text-zinc-500 font-light">MUSEUM</span>
          </h2>
        </div>

        {/* Counter and Curator Status */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
          <span className="text-xs font-mono text-zinc-400 tracking-wider">
            EXHIBIT [ 0{activeIndex + 1} / 0{MUSEUM_ITEMS.length} ]
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevArtifact}
              aria-label="Previous Exhibit"
              className="p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextArtifact}
              aria-label="Next Exhibit"
              className="p-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white transition-all cursor-pointer active:scale-95 shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN EXHIBITION PAVILION (KINETIC 3D SPATIAL VITRINE + DOSSIER)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
        
        {/* Left: 3D Kinetic Specimen Vitrine Showcase (7 Cols) */}
        <div
          ref={vitrineRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ perspective: '1200px' }}
          className="lg:col-span-7 flex flex-col justify-between"
        >
          <div
            style={{
              transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.16,1,0.3,1)'
            }}
            className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317] via-[#09020e] to-black p-4 sm:p-6 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden group mobile-grunge-card"
          >
            {/* Subtle Metallic Corner Anchors */}
            <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none select-none">+</span>
            <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none select-none">+</span>
            <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none select-none">+</span>
            <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none select-none">+</span>

            {/* Vitrine Top Glass HUD */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-pink text-[10px] font-mono tracking-widest uppercase font-semibold">
                  {activeItem.tag}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider hidden sm:inline">
                  ACCESSION // {activeItem.id.toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white tracking-widest px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
                EST. {activeItem.year}
              </span>
            </div>

            {/* Central Masterpiece Specimen Display Frame */}
            <div className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 my-2 overflow-hidden rounded-2xl bg-black/40 border border-white/5">
              <img
                key={activeItem.id}
                src={activeItem.image}
                alt={activeItem.name}
                loading="eager"
                className="max-h-full max-w-full object-contain filter brightness-100 contrast-105 transition-transform duration-700 ease-out group-hover:scale-[1.04] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] animate-fade-in"
              />

              {/* Ambient Specimen Depth Glow */}
              <div className="absolute inset-0 bg-radial-gradient from-pink/10 via-transparent to-transparent pointer-events-none opacity-60" />
            </div>

            {/* Vitrine Bottom Floor Plinth & Provenance Bar */}
            <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-left">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  ORIGINAL PROVENANCE
                </span>
                <span className="text-xs font-mono font-semibold text-zinc-200">
                  {activeItem.originalOwner}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-mono text-pink uppercase tracking-widest block font-semibold">
                  ARCHIVAL STATUS
                </span>
                <span className="text-xs font-mono text-white font-bold tracking-wider">
                  1-OF-1 MUSEUM PIECE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Curatorial Plaque & Commission Dossier (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between text-left p-6 sm:p-8 rounded-3xl border border-white/15 bg-gradient-to-b from-[#110216]/90 via-[#0a020d]/90 to-black shadow-xl mobile-grunge-card">
          <div>
            {/* Museum Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <span className="text-[10px] font-mono text-pink tracking-[0.22em] uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
                EXHIBITION DOSSIER 0{activeIndex + 1}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
                GUWAHATI ATELIER
              </span>
            </div>

            {/* Exhibit Title */}
            <h3 className="text-lg sm:text-2xl font-mono font-bold uppercase text-white mb-2 leading-tight">
              {activeItem.name}
            </h3>

            {/* Pricing Tier Capsule */}
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 font-medium mb-4">
              {activeItem.commissionTier}
            </div>

            {/* Story / Historical Background */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 relative overflow-hidden mb-4">
              <div className="absolute top-0 left-0 w-1 h-full bg-pink" />
              <p className="text-xs sm:text-[13px] font-montserrat text-zinc-200 italic leading-relaxed pl-2">
                "{activeItem.story}"
              </p>
            </div>

            {/* Materiality & Physical Construction Breakdown */}
            <div className="space-y-3 mb-5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 block mb-1 font-semibold">
                  RAW MATERIALS & HARDWARE
                </span>
                <span className="text-white text-xs font-medium leading-relaxed block">
                  {activeItem.materials}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/8">
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-pink block mb-1 font-semibold">
                  CUSTOM COMMISSION SPECIFICATION
                </span>
                <p className="text-zinc-300 text-[11px] font-montserrat leading-relaxed">
                  {activeItem.recreationNote}
                </p>
              </div>
            </div>
          </div>

          {/* Action: Bespoke Order Recreation CTA */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => handleCommissionClick(activeItem)}
              className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Scissors className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span>REQUEST ARCHIVAL RECREATION ↗</span>
            </button>
            <p className="text-[10px] font-mono text-zinc-400 text-center mt-2.5 uppercase tracking-wider">
              Hand-sculpted by Dhrisni in Guwahati • 2 to 3 weeks
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM CURATORIAL INDEX STRIP (FAST ACCESSION SPECIMEN SELECTOR)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 relative z-10">
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <span className="text-zinc-400 uppercase tracking-widest text-[10px]">
            ARCHIVE EXHIBITION INDEX:
          </span>
          <span className="text-pink font-semibold text-[10px] uppercase tracking-wider">
            TAP TO ROTATE EXHIBIT
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {MUSEUM_ITEMS.map((item, idx) => {
            const isCurrent = activeIndex === idx;

            return (
              <button
                key={item.id}
                onClick={() => selectArtifact(idx)}
                className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-center gap-3 active:scale-98 ${
                  isCurrent
                    ? 'bg-white/10 border-pink shadow-[0_0_20px_rgba(244,114,182,0.25)]'
                    : 'bg-black/60 border-white/10 hover:border-white/30 hover:bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {/* Micro Specimen Thumbnail */}
                <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 p-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain filter brightness-95"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-mono tracking-widest text-pink font-bold uppercase">
                    0{idx + 1} // {item.year}
                  </span>
                  <span className="text-xs font-mono font-medium text-white truncate uppercase">
                    {item.shortName || item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
