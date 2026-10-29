import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

// HUMAN, GROUNDED EDITORIAL COPY
const COPY = {
  aboutMother: {
    heading: 'DHRISNI (DHRISTROYER)',
    subheading: 'FOUNDER & CREATIVE DIRECTOR • THE MOTHER OF AVZ'
  },
  professionalRoots: {
    heading: 'ORIGINS & ROOTS',
    paragraphs: [
      'Growing up between Shillong and Guwahati, Dhrisni started sharing her style online at sixteen, building an authentic following through raw, unfiltered fashion experiments.',
      'At eighteen, she moved to Mumbai, working as a model and actor across television, reality shows, and films, while continuously honing her hands-on design craft.',
      'Through all of it, she refused to follow mass-market trends. Her focus stayed true: building tangible, wearable art with real texture and human feeling.'
    ]
  },
  howBorn: {
    heading: 'HOW VAGANZA WAS BORN',
    paragraphs: [
      'AVZ Vaganza started out of pure personal freedom. Growing up in a household with strict rules on clothing, Dhrisni found her voice by taking scissors to her own clothes and rebuilding them.',
      'What began as DIY tailoring quickly turned into a movement. She wanted clothes with weight, texture, and attitude—pieces you cannot find on a standard clothing rack.',
      'Today, every piece is sculpted by hand in our Guwahati studio. We cut, wire, and assemble each garment individually from salvaged electronics, raw hardware, and reclaimed fabrics.'
    ]
  },
  sustainability: {
    heading: 'TRUE SUSTAINABILITY',
    paragraphs: [
      'We do not treat sustainability as a marketing catchphrase. It is simply the way we work every single day.',
      'Instead of consuming new factory textiles, we gather obsolete computer motherboards, mechanical keyboard keys, deadstock denim, and industrial hardware, giving them a bold second life.',
      'To us, modern luxury is not an automated assembly line. It is the time, intention, and human hands behind every stitch and welded ring.'
    ]
  },
  aesthetic: {
    heading: 'THE AESTHETIC',
    paragraphs: [
      'AVZ Vaganza is rooted in cyber-grunge, Y2K energy, industrial punk, and avant-garde streetwear.',
      'We reject cookie-cutter minimalism. We love tactile hardware, fluid chainmail, sharp spikes, and silhouettes that make you feel instantly confident and protected.',
      'Our studio is for anyone who values original craftsmanship, real human effort, and the thrill of wearing something one-of-a-kind.'
    ]
  }
};

const CARDS = [
  { id: 'card-about-mother', label: 'DHRISNI (DHRISTROYER)', tag: '01' },
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
              <span className="font-mono text-xs text-pink tracking-[0.2em] block mb-2 font-bold uppercase">
                PART {(i + 1).toString().padStart(2, '0')}
              </span>
            )}
            <p className="font-montserrat text-[15px] sm:text-[17px] leading-[1.8] text-zinc-100 font-semibold tracking-normal normal-case">
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
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        scrollNext();
      } else {
        scrollPrev();
      }
    }
  };

  return (
    <section
      id="about"
      className="relative w-full bg-pitch-black text-silver overflow-hidden border-t border-[#be185d]/30 selection:bg-pink selection:text-black py-8 sm:py-12"
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-pink uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
            <span>✦ FOUNDER ARCHIVE • GUWAHATI ATELIER</span>
          </div>
          <h2 className="font-mono font-bold text-xl sm:text-2xl lg:text-3xl tracking-[0.14em] text-white uppercase">
            DHRISNI (DHRISTROYER)
          </h2>
          <p className="font-mono text-xs text-zinc-400 tracking-wider uppercase mt-1">
            FOUNDER & COUTURE SCULPTOR • THE AVZ DIMENSION
          </p>
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CARDS.map((card, idx) => {
            const isActive = activeCardIndex === idx;
            return (
              <button
                key={card.id}
                onClick={() => scrollToCard(idx)}
                className={`px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? 'bg-pink text-black font-bold border-pink shadow-[0_0_14px_rgba(244,194,194,0.35)]'
                    : 'bg-black/60 text-zinc-400 border-white/10 hover:border-pink/40 hover:text-white'
                }`}
              >
                {card.tag} • {card.label}
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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative z-10 w-full overflow-x-auto overflow-y-hidden px-[6vw] sm:px-[calc(50%-270px)] lg:px-[calc(50%-280px)] py-4 flex items-stretch gap-6 sm:gap-8 scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'x mandatory', touchAction: 'pan-x pan-y', WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'auto' }}
      >
        {/* =====================================================================
            CARD 1: ABOUT MOTHER (With just ONE image of her)
            ===================================================================== */}
        <div
          id="card-about-mother"
          className="snap-center shrink-0 w-[88vw] max-w-[540px] h-[580px] sm:h-[620px] rounded-3xl border border-white/20 bg-gradient-to-b from-[#18041d]/95 via-[#0d0111]/95 to-black p-7 sm:p-9 flex flex-col justify-between shadow-[0_24px_60px_rgba(24,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          {/* Subtle Corner Markers */}
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-2.5">
              <span className="text-pink font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
                1. THE FOUNDER
              </span>
              <span className="font-mono text-zinc-400">GUWAHATI • MUMBAI</span>
            </div>

            <h3 className="font-spartan font-black text-2xl sm:text-3xl tracking-[0.1em] uppercase text-white leading-tight">
              DHRISNI
            </h3>
            <p className="font-mono text-xs sm:text-[13px] text-pink tracking-[0.18em] uppercase font-bold mt-1">
              (DHRISTROYER) • MOTHER OF AVZ
            </p>
          </div>

          {/* Founder's Single Authentic Photograph */}
          <div className="relative my-4 flex-1 w-full rounded-2xl overflow-hidden border border-white/15 bg-black/80 group-hover:border-pink/50 transition-colors duration-500 shadow-inner">
            <img
              src={ASSET_MANIFEST.editorialHero}
              alt="Dhrisni (Dhristroyer) - Founder of AVZ Vaganza"
              className="w-full h-full object-cover object-center filter brightness-100 contrast-105 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 pointer-events-none" />

            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-pink/30 text-[10px] font-mono text-pink font-semibold image-overlay-text">
              COUTURE SCULPTOR
            </div>

            <div className="absolute bottom-3 left-4 right-4 image-overlay-text">
              <p className="font-serif italic text-xs sm:text-sm text-pink-100/90 leading-relaxed drop-shadow-sm mb-1.5">
                "Wearable art is armor for the autonomous spirit."
              </p>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300 font-medium">
                <span className="tracking-widest font-bold text-white">DHRISNI (DHRISTROYER)</span>
                <span className="text-pink font-semibold tracking-wider">FOUNDER & VISIONARY</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink animate-pulse" />
              <span className="font-bold text-white tracking-wider">FOUNDER & MASTER ARTISAN</span>
            </div>
            <span className="text-pink font-bold tracking-widest">AVZ VAGANZA</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 2: PROFESSIONAL ROOTS (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-professional-roots"
          className="snap-center shrink-0 w-[88vw] max-w-[540px] h-[580px] sm:h-[620px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
              <span className="text-pink font-bold">2. BACKGROUND & ROOTS</span>
              <span>CHRONOLOGY</span>
            </div>

            <h3 className="font-mono text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-white mb-6">
              {COPY.professionalRoots.heading}
            </h3>

            <div className="overflow-y-auto max-h-[420px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.professionalRoots.paragraphs}
                isVisible={visibleCards['card-professional-roots']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400 font-medium">
            <span>SHILLONG → GUWAHATI → MUMBAI</span>
            <span className="text-pink hover:text-pink-300 tracking-wider transition-colors font-bold">[ ⚡ CLICK TO EXPAND ]</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 3: HOW VAGANZA WAS BORN (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-how-born"
          className="snap-center shrink-0 w-[88vw] max-w-[540px] h-[580px] sm:h-[620px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
              <span className="text-pink font-bold">3. HOW VAGANZA WAS BORN</span>
              <span>ORIGIN STORY</span>
            </div>

            <h3 className="font-mono text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-white mb-6">
              {COPY.howBorn.heading}
            </h3>

            <div className="overflow-y-auto max-h-[420px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.howBorn.paragraphs}
                isVisible={visibleCards['card-how-born']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400 font-medium">
            <span>DARK ALTERNATIVE • INDUSTRIAL ATTITUDE</span>
            <span className="text-pink hover:text-pink-300 tracking-wider transition-colors font-bold">[ ⚡ CLICK TO EXPAND ]</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 4: SUSTAINABILITY CORE (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-sustainability"
          className="snap-center shrink-0 w-[88vw] max-w-[540px] h-[580px] sm:h-[620px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
              <span className="text-pink font-bold">4. SUSTAINABLE CRAFT</span>
              <span>RUTHLESS UPCYCLING</span>
            </div>

            <h3 className="font-mono text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-white mb-6">
              {COPY.sustainability.heading}
            </h3>

            <div className="overflow-y-auto max-h-[420px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.sustainability.paragraphs}
                isVisible={visibleCards['card-sustainability']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400 font-medium">
            <span>DISCARDED HARDWARE • RAW TRANSFORMATION</span>
            <span className="text-pink hover:text-pink-300 tracking-wider transition-colors font-bold">[ ⚡ CLICK TO EXPAND ]</span>
          </div>
        </div>

        {/* =====================================================================
            CARD 5: AESTHETIC INSPIRATION (Info Card With Electric Typewriter)
            ===================================================================== */}
        <div
          id="card-aesthetic"
          className="snap-center shrink-0 w-[88vw] max-w-[540px] h-[580px] sm:h-[620px] rounded-3xl border border-white/15 bg-gradient-to-b from-[#120317]/95 via-black to-[#09020d]/95 p-6 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_rgba(25,2,25,0.7)] group relative overflow-hidden mobile-grunge-card"
        >
          <span className="absolute top-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute top-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 left-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>
          <span className="absolute bottom-3 right-3 text-pink/40 font-mono text-xs pointer-events-none">+</span>

          <div>
            <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-400 uppercase mb-3">
              <span className="text-pink font-bold">5. DESIGN VISION</span>
              <span>THE DESTINATION</span>
            </div>

            <h3 className="font-mono text-xl sm:text-2xl font-bold tracking-[0.16em] uppercase text-white mb-6">
              {COPY.aesthetic.heading}
            </h3>

            <div className="overflow-y-auto max-h-[420px] pr-2 no-scrollbar">
              <ElectricTypewriterBlock
                paragraphs={COPY.aesthetic.paragraphs}
                isVisible={visibleCards['card-aesthetic']}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400 font-medium">
            <span>BOLD STYLE • UNDERGROUND FASHION</span>
            <span className="text-pink hover:text-pink-300 tracking-wider transition-colors font-bold">[ ⚡ CLICK TO EXPAND ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
