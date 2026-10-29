import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Scissors } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/brandData';
import { playSound } from '../utils/audio';

// Curated high-fashion editorial metadata (clean, luxury, zero redundancy)
const EXHIBITS = [
  {
    id: "mus-001",
    num: "01",
    title: "Motherboard Bralette",
    year: "2023",
    materials: "Salvaged 1998 Circuitry, Copper Wire & Velvet",
    story: "The prototype that sparked the AVZ movement. Obsolete Intel Pentium circuitry hand-cut on Dhrisni's studio floor, juxtaposing cold silicon with soft velvet ties.",
    image: MUSEUM_ITEMS[0]?.image
  },
  {
    id: "mus-002",
    num: "02",
    title: "'CTRL+Z' Choker Harness",
    year: "2024",
    materials: "IBM Model M Mechanical Keycaps & Stainless Chainmail",
    story: "Sculpted with tactile mechanical key switches and hand-linked chainmail. Designed for underground warehouse rave velocity, tactile keys click with movement.",
    image: MUSEUM_ITEMS[1]?.image
  },
  {
    id: "mus-003",
    num: "03",
    title: "Spiked Moto Shrug",
    year: "2024",
    materials: "Reclaimed Biker Leather & 72 Solid Steel Spikes",
    story: "Deconstructed from a vintage 1980s motorcycle jacket in Guwahati. Cropped high above the bust line with chrome cone shoulders evoking dystopian armor.",
    image: MUSEUM_ITEMS[2]?.image
  },
  {
    id: "mus-004",
    num: "04",
    title: "Cyber-Chitin Bodice",
    year: "2024",
    materials: "Iridescent Tech Scrap & Wire Sculpture",
    story: "A synthesis of biological curves and reclaimed hardware. Hand-sculpted wire weaving reflecting soft lavender and pink iridescence under directional lighting.",
    image: MUSEUM_ITEMS[3]?.image
  }
];

export default function AvzMuseum({ onRequestCustomCommission, theme = 'dark' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const activeExhibit = EXHIBITS[activeIndex] || EXHIBITS[0];

  const selectExhibit = (idx) => {
    playSound('pip');
    setActiveIndex(idx);
  };

  const nextExhibit = () => {
    playSound('pip');
    setActiveIndex((prev) => (prev + 1) % EXHIBITS.length);
  };

  const prevExhibit = () => {
    playSound('pip');
    setActiveIndex((prev) => (prev - 1 + EXHIBITS.length) % EXHIBITS.length);
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        nextExhibit();
      } else {
        prevExhibit();
      }
    }
  };

  const handleCommissionClick = () => {
    playSound('snap');
    if (onRequestCustomCommission) {
      onRequestCustomCommission(`Archival Recreation: ${activeExhibit.title}`);
    }
    const el = document.getElementById('custom');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="museum"
      className="w-full py-8 sm:py-14 px-4 sm:px-8 lg:px-14 bg-transparent select-none border-t border-white/10 text-left relative overflow-hidden"
    >
      {/* Background Subtle Ambient Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2a042a]/20 rounded-full blur-[180px] pointer-events-none" />

      {/* Clean Minimalist Header */}
      <div className="max-w-6xl mx-auto flex items-end justify-between mb-8 sm:mb-12 border-b border-white/10 pb-4 relative z-10 text-left">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-pink uppercase block mb-1.5 font-semibold">
            ARCHIVE EXHIBITION
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono font-medium uppercase tracking-[0.16em] text-white leading-tight">
            THE MUSEUM <span className="text-zinc-500 font-light">PIECES</span>
          </h2>
        </div>

        {/* Minimalist Slide Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-zinc-400 tracking-wider hidden sm:inline">
            [ 0{activeIndex + 1} / 0{EXHIBITS.length} ]
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevExhibit}
              aria-label="Previous Piece"
              className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextExhibit}
              aria-label="Next Piece"
              className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          EDITORIAL ART-BOOK SPREAD (Single Cohesive Exhibition Unit)
          ========================================================================= */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10"
      >
        {/* Left: Dramatic High-Fashion Specimen Frame (7 Cols) */}
        <div className="md:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[460px] md:max-w-none h-[420px] sm:h-[500px] lg:h-[580px] rounded-3xl overflow-hidden border border-white/15 bg-black/90 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex items-center justify-center p-4 sm:p-6 group">
            {/* Specimen Photograph */}
            <img
              key={activeExhibit.id}
              src={activeExhibit.image}
              alt={activeExhibit.title}
              loading="eager"
              className="w-full h-full object-contain filter brightness-100 contrast-105 transition-all duration-700 ease-out group-hover:scale-105 animate-fade-in"
            />

            {/* Subtle Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Subtle Year Watermark */}
            <div className="absolute top-4 right-5 font-mono text-[11px] text-zinc-400 tracking-widest uppercase pointer-events-none">
              EST. {activeExhibit.year}
            </div>

            {/* Subtle Specimen Number */}
            <div className="absolute bottom-4 left-5 font-mono text-xs text-pink/80 tracking-widest uppercase font-semibold pointer-events-none">
              PIECE // {activeExhibit.num}
            </div>
          </div>
        </div>

        {/* Right: Curatorial Editorial Plaque (5 Cols) */}
        <div className="md:col-span-5 flex flex-col justify-between text-left h-full py-2">
          <div>
            {/* Exhibit Number */}
            <span className="text-xs font-mono tracking-[0.25em] text-pink uppercase font-bold block mb-2">
              EXHIBIT {activeExhibit.num}
            </span>

            {/* Piece Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium uppercase text-white mb-3 leading-tight">
              {activeExhibit.title}
            </h3>

            {/* Materials Breakdown */}
            <div className="mb-5 pb-4 border-b border-white/10">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                MATERIALS
              </span>
              <p className="text-xs sm:text-sm font-mono text-zinc-300">
                {activeExhibit.materials}
              </p>
            </div>

            {/* Curatorial Story Quote */}
            <p className="text-xs sm:text-sm font-montserrat text-zinc-300 italic leading-relaxed mb-8">
              "{activeExhibit.story}"
            </p>
          </div>

          {/* Action: Bespoke Archival Commission */}
          <div>
            <button
              onClick={handleCommissionClick}
              className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-[0.18em] uppercase transition-all shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>COMMISSION RECREATION</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
            <p className="text-[10px] font-mono text-zinc-400 text-center mt-2.5 uppercase tracking-wider">
              Handcrafted in our Guwahati studio • 2 to 3 weeks
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MINIMALIST ACCESSION SELECTOR TABS
          ========================================================================= */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {EXHIBITS.map((item, idx) => {
            const isCurrent = activeIndex === idx;

            return (
              <button
                key={item.id}
                onClick={() => selectExhibit(idx)}
                className={`py-3 px-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-white/10 border-pink shadow-md text-white'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-pink' : 'text-zinc-500'}`}>
                  {item.num}
                </span>
                <span className="text-xs font-mono truncate uppercase">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
