import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

// EXACT UNCHANGED SOURCE COPY
const COPY = {
  aboutMother: {
    heading: 'ABOUT MOTHER'
  },
  professionalRoots: {
    heading: 'PROFESSIONAL ROOTS',
    paragraphs: [
      'growing up between shillong and guwahati, she was already building her digital footprint on youtube by sixteen before dominating instagram as a creator.',
      'at eighteen she packed up and moved to mumbai, stepping straight into modeling and working with massive brands while landing roles in commercials, reality tv, and a feature film.',
      'she has always been entirely about her vision, fiercely protective of her art, and unapologetically ahead of the curve when it comes to fashion, culture, and beauty.'
    ]
  },
  howBorn: {
    heading: 'HOW VAGANZA WAS BORN',
    paragraphs: [
      'it all started because she looked at the boring predictable fashion industry and decided to completely burn the rulebook. avz vaganza was born out of sheer necessity to create something real and uncompromised where dark alternative aesthetics and cyber grunge met actual technical mastery. she wanted a world where garments are heavily constructed with industrial hardware and raw attitude rather than mass produced corporate trends. she poured her entire soul into engineering this universe from scratch making sure every single piece feels alive and dangerous and completely yours'
    ]
  },
  sustainability: {
    heading: 'SUSTAINABILITY CORE',
    paragraphs: [
      'we do not just talk about sustainability like some corporate buzzword to look good on a tag because for us it is the absolute core of how we survive and create. instead of feeding into the endless cycle of fast fashion waste we take things apart and flip them completely breathing raw new life into dead materials and industrial castoffs. every single piece of hardware or discarded textile is rescued and transformed into something aggressively original. we thrive on taking what society throws away and turning it into high end rebellion proving that true luxury does not come from new factory lines but from the art of ruthless upcycling and giving trash a god tier second chance'
    ]
  },
  aesthetic: {
    heading: 'AESTHETIC INSPIRATION',
    paragraphs: [
      'avz also known as aveezah is an entire alternative dimension that you do not need a passport or a visa to enter because the aesthetic itself is the destination. it is a dark cyber grunge fantasy where you are already part of the inner circle the moment you tap into the frequency. you do not need permission to exist in this world of high fashion rebellion and unapologetic art. the doors are wide open for anyone who lives for the underground and dresses like they own the night'
    ]
  }
};

const CARDS = [
  { id: 'card-about-mother', label: 'ABOUT MOTHER', tag: '01' },
  { id: 'card-professional-roots', label: 'PROFESSIONAL ROOTS', tag: '02' },
  { id: 'card-how-born', label: 'HOW VAGANZA WAS BORN', tag: '03' },
  { id: 'card-sustainability', label: 'SUSTAINABILITY CORE', tag: '04' },
  { id: 'card-aesthetic', label: 'AESTHETIC INSPIRATION', tag: '05' }
];

const GLYPHS = ['⚡', 'Ξ', 'Ø', 'Δ', 'X', '§', '0', '1', '•', '+', '#', 'F', '9', '⚡'];

/**
 * ElectricTypewriterBlock: Cyberpunk decoding glitch + neon electric spark typing effect.
 * Each character dynamically resolves through electric glitch glyphs before snapping into place.
 * Guaranteed sequential paragraph progression with zero skipped points.
 */
function ElectricTypewriterBlock({ paragraphs, isVisible }) {
  const [revealedLengths, setRevealedLengths] = useState(() => paragraphs.map(() => 0));
  const [activeParaIdx, setActiveParaIdx] = useState(0);
  const [glitchChar, setGlitchChar] = useState('');

  // Reset if paragraphs change
  useEffect(() => {
    setRevealedLengths(paragraphs.map(() => 0));
    setActiveParaIdx(0);
    setGlitchChar('');
  }, [paragraphs]);

  useEffect(() => {
    if (!isVisible) return;
    if (activeParaIdx >= paragraphs.length) {
      setGlitchChar('');
      return;
    }

    const currentText = paragraphs[activeParaIdx];
    let charPos = revealedLengths[activeParaIdx] || 0;

    // If already fully revealed for some reason, advance immediately
    if (charPos >= currentText.length) {
      setActiveParaIdx((prev) => prev + 1);
      return;
    }

    const interval = setInterval(() => {
      // Advance by 2 characters per tick for fluid, crisp electric cadence
      charPos += 2;
      const randomGlyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      setGlitchChar(randomGlyph);

      if (charPos >= currentText.length) {
        clearInterval(interval);
        setRevealedLengths((prev) => {
          const updated = [...prev];
          updated[activeParaIdx] = currentText.length;
          return updated;
        });
        // Pause briefly between paragraphs before decoding the next paragraph
        setTimeout(() => {
          setActiveParaIdx((prev) => prev + 1);
        }, 120);
      } else {
        setRevealedLengths((prev) => {
          const updated = [...prev];
          updated[activeParaIdx] = charPos;
          return updated;
        });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [isVisible, activeParaIdx, paragraphs]);

  // Click card to instantly reveal all text
  const handleRevealAll = () => {
    setRevealedLengths(paragraphs.map((p) => p.length));
    setActiveParaIdx(paragraphs.length);
    setGlitchChar('');
  };

  return (
    <div onClick={handleRevealAll} className="space-y-6 cursor-pointer select-text">
      {paragraphs.map((para, i) => {
        const count = revealedLengths[i] || 0;
        const isCurrent = i === activeParaIdx && count < para.length && isVisible;

        return (
          <div key={i} className="relative">
            {paragraphs.length > 1 && (
              <span className="font-mono text-[11px] text-pink/80 tracking-widest block mb-1.5 font-medium">
                {(i + 1).toString().padStart(2, '0')} //
              </span>
            )}
            <p className="font-montserrat text-sm sm:text-base leading-[1.85] text-zinc-300 font-normal tracking-wide normal-case">
              {para.slice(0, count)}
              {isCurrent && (
                <>
                  <span className="electric-char ml-0.5">{glitchChar}</span>
                  <span className="electric-cursor" />
                </>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function FoundersSection({ onScrollToSection, onOpenSquadModal }) {
  const scrollContainerRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState({
    'card-about-mother': true,
    'card-professional-roots': false,
    'card-how-born': false,
    'card-sustainability': false,
    'card-aesthetic': false
  });

  // Observe horizontal intersection of each card to trigger typing & update index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));

            const idx = CARDS.findIndex((c) => c.id === entry.target.id);
            if (idx !== -1) {
              setActiveCardIndex(idx);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.35
      }
    );

    CARDS.forEach((card) => {
      const el = document.getElementById(card.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  const scrollToCard = (index) => {
    playSound('cyber_hover');
    setActiveCardIndex(index);
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardEl = document.getElementById(CARDS[index].id);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  const scrollPrev = () => {
    const prev = Math.max(0, activeCardIndex - 1);
    scrollToCard(prev);
  };

  const scrollNext = () => {
    const next = Math.min(CARDS.length - 1, activeCardIndex + 1);
    scrollToCard(next);
  };

  return (
    <section
      id="about"
      className="relative w-full bg-pitch-black text-silver overflow-hidden border-t border-[#be185d]/30 selection:bg-pink selection:text-black py-12 sm:py-16"
    >
      {/* Background Architectural Mesh & Subtle Ambient Violet Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(190,24,93,0.14),transparent_70%)]" />

      {/* TOP HEADER & HORIZONTAL NAVIGATION HUD */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-pink uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
            <span>FOUNDER MANIFESTO // HORIZONTAL ARCHIVE</span>
          </div>
          <h2 className="font-mono text-xl sm:text-2xl font-medium tracking-[0.2em] text-white uppercase">
            ABOUT MOTHER & THE AVZ DIMENSION
          </h2>
        </div>

        {/* Controls & Quick Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 mr-2">
            <span>[ 0{activeCardIndex + 1} / 0{CARDS.length} ]</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollPrev}
              disabled={activeCardIndex === 0}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                activeCardIndex === 0
                  ? 'border-white/5 text-zinc-600 cursor-not-allowed'
                  : 'border-white/15 bg-black/80 hover:border-pink text-white hover:text-pink'
              }`}
              title="Previous Card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollNext}
              disabled={activeCardIndex === CARDS.length - 1}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                activeCardIndex === CARDS.length - 1
                  ? 'border-white/5 text-zinc-600 cursor-not-allowed'
                  : 'border-white/15 bg-black/80 hover:border-pink text-white hover:text-pink'
              }`}
              title="Next Card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* QUICK CARD SELECTOR TABS */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CARDS.map((card, idx) => {
            const isActive = activeCardIndex === idx;
            return (
              <button
                key={card.id}
                onClick={() => scrollToCard(idx)}
                className={`px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-pink text-black font-semibold border-pink shadow-[0_0_12px_rgba(244,194,194,0.3)]'
                    : 'bg-black/60 text-zinc-400 border-white/10 hover:border-pink/40 hover:text-white'
                }`}
              >
                {card.tag} // {card.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          HORIZONTAL SCROLL CONTAINER
          Card 1 has her image. All other cards are pure text info cards with typewriter.
          ========================================================================= */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full overflow-x-auto overflow-y-hidden px-4 sm:px-8 lg:px-16 py-4 flex items-stretch gap-6 sm:gap-8 scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'x mandatory', touchAction: 'pan-y', overscrollBehaviorX: 'contain' }}
      >
        {/* =====================================================================
            CARD 1: ABOUT MOTHER (With just ONE image of her)
            ===================================================================== */}
        <div
          id="card-about-mother"
          className="snap-start shrink-0 w-[86vw] sm:w-[480px] lg:w-[500px] h-[540px] sm:h-[580px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#140217]/95 via-black to-[#0a020d]/95 p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          {/* Subtle Corner Markers */}
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">
              <span className="text-pink/80 font-semibold">01 // VISUAL INTRODUCTION</span>
              <span>ATELIER PROVENANCE</span>
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-medium tracking-[0.2em] uppercase text-zinc-100">
              {COPY.aboutMother.heading}
            </h3>
          </div>

          {/* Founder's Single Authentic Photograph */}
          <div className="relative my-4 flex-1 w-full rounded-2xl overflow-hidden border border-white/10 bg-black group-hover:border-pink/40 transition-colors duration-500">
            <img
              src={ASSET_MANIFEST.editorialHero}
              alt="Dhrisni - Founder visual introduction"
              className="w-full h-full object-cover object-center filter brightness-95 contrast-105 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-300">
              <span className="tracking-widest">DHRISNI (DHRISTROYER)</span>
              <span className="text-pink/70">GUWAHATI</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>FOUNDER & CREATIVE DIRECTOR</span>
            <span className="text-pink/80">AVZ VAGANZA</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 2: PROFESSIONAL ROOTS (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-professional-roots"
          className="snap-start shrink-0 w-[88vw] sm:w-[540px] lg:w-[580px] h-[540px] sm:h-[580px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">
              <span className="text-pink/80 font-semibold">02 // INFO CARD</span>
              <span>CHRONOLOGY</span>
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-medium tracking-[0.2em] uppercase text-zinc-100 mb-6">
              {COPY.professionalRoots.heading}
            </h3>

            <div className="overflow-y-auto max-h-[380px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.professionalRoots.paragraphs}
                isVisible={visibleCards['card-professional-roots']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>SHILLONG → GUWAHATI → MUMBAI</span>
            <span className="text-pink/60 hover:text-pink text-[10px] font-mono tracking-wider transition-colors">[ ⚡ TAP TO REVEAL ]</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 3: HOW VAGANZA WAS BORN (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-how-born"
          className="snap-start shrink-0 w-[88vw] sm:w-[540px] lg:w-[580px] h-[540px] sm:h-[580px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">
              <span className="text-pink/80 font-semibold">03 // INFO CARD</span>
              <span>GENESIS</span>
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-medium tracking-[0.2em] uppercase text-zinc-100 mb-6">
              {COPY.howBorn.heading}
            </h3>

            <div className="overflow-y-auto max-h-[380px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.howBorn.paragraphs}
                isVisible={visibleCards['card-how-born']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>DARK ALTERNATIVE // INDUSTRIAL ATTITUDE</span>
            <span className="text-pink/60 hover:text-pink text-[10px] font-mono tracking-wider transition-colors">[ ⚡ TAP TO REVEAL ]</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 4: SUSTAINABILITY CORE (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-sustainability"
          className="snap-start shrink-0 w-[88vw] sm:w-[540px] lg:w-[580px] h-[540px] sm:h-[580px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">
              <span className="text-pink/80 font-semibold">04 // INFO CARD</span>
              <span>RUTHLESS UPCYCLING</span>
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-medium tracking-[0.2em] uppercase text-zinc-100 mb-6">
              {COPY.sustainability.heading}
            </h3>

            <div className="overflow-y-auto max-h-[380px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.sustainability.paragraphs}
                isVisible={visibleCards['card-sustainability']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>DISCARDED HARDWARE // RAW TRANSFORMATION</span>
            <span className="text-pink/60 hover:text-pink text-[10px] font-mono tracking-wider transition-colors">[ ⚡ TAP TO REVEAL ]</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 5: AESTHETIC INSPIRATION (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-aesthetic"
          className="snap-start shrink-0 w-[88vw] sm:w-[540px] lg:w-[580px] h-[540px] sm:h-[580px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3">
              <span className="text-pink/80 font-semibold">05 // INFO CARD</span>
              <span>THE DESTINATION</span>
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-medium tracking-[0.2em] uppercase text-zinc-100 mb-6">
              {COPY.aesthetic.heading}
            </h3>

            <div className="overflow-y-auto max-h-[380px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.aesthetic.paragraphs}
                isVisible={visibleCards['card-aesthetic']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>THE FREQUENCY // UNDERGROUND HIGH FASHION</span>
            <span className="text-pink/60 hover:text-pink text-[10px] font-mono tracking-wider transition-colors">[ ⚡ TAP TO REVEAL ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
