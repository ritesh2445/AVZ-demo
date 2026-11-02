import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowUpRight, Scissors, ShieldCheck, Users, Cpu, Flame, MapPin } from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';
import DhrisniGarden from './DhrisniGarden';

const POLAROID_CARDS = [
  {
    id: 'vision',
    tag: 'STUDIO 01',
    headline: 'SCISSORS & INSTINCT',
    body: 'No corporate patterns. Slicing raw denim and shaping armor by instinct.',
    stamp: 'ORIGINAL STUDIO',
    rotation: '-rotate-2'
  },
  {
    id: 'alias',
    tag: 'IDENTITY 02',
    headline: '@DHRISTROYER',
    body: 'Actor. Sculptor. Founder. Slicing through fashion monotony since day one.',
    stamp: 'GUWAHATI ARCHIVE',
    rotation: 'rotate-2'
  },
  {
    id: 'medium',
    tag: 'MEDIUM 03',
    headline: 'SALVAGED ARMOR',
    body: 'Motherboards, spikes, and vintage hardware transformed into wearable art.',
    stamp: '1-OF-1 PIECE',
    rotation: '-rotate-1'
  },
  {
    id: 'guild',
    tag: 'COMMUNITY 04',
    headline: 'WOMEN ARTISANS',
    body: 'Handmade by women artisans in our Guwahati studio. True human soul over assembly lines.',
    stamp: 'ASSAM • 26°N 91°E',
    rotation: 'rotate-2'
  }
];

const MANIFESTO_PILLARS = [
  {
    id: '01',
    title: 'RAW REBELLION & PERSONAL FREEDOM',
    subtitle: 'From Shillong scissors to avant-garde runways',
    icon: Scissors,
    summary:
      'Growing up in a household with strict rules on clothing, Dhrisni found her voice by picking up a pair of scissors and rebuilding garments with her own hands. What began as DIY teenage tailoring grew into a defiant refusal of mass-market conformity.',
    highlight: 'Clothes with weight, texture, and attitude—pieces you will never find on a commercial retail rack.'
  },
  {
    id: '02',
    title: 'HUMAN HANDS OVER MACHINE SAMENESS',
    subtitle: 'The craft of real human sweat and intention',
    icon: Flame,
    summary:
      'In a world increasingly flooded with disposable fast fashion and AI-generated blandness, things shaped by real human fingers are the ultimate modern luxury. Every stitch, spike, and solder connection carries human pulse and intention.',
    highlight: 'Zero mass manufacturing. Every piece is an original 1-of-1 wearable artwork.'
  },
  {
    id: '03',
    title: 'SALVAGED TECHNOLOGY & RECLAIMED TEXTILES',
    subtitle: 'Giving discarded computer hardware a bold second life',
    icon: Cpu,
    summary:
      'We do not treat sustainability as a hollow corporate slogan. We gather obsolete computer motherboards, mechanical keyboard keys, discarded denim, and industrial hardware, fusing cyber-grunge technology into haute wearable armor.',
    highlight: 'Transforming landfill electronic waste into high-fashion archival statement pieces.'
  },
  {
    id: '04',
    title: 'WOMEN ARTISANS OF OUR GUWAHATI STUDIO',
    subtitle: 'Mentorship, independence, and North-East craftsmanship',
    icon: Users,
    summary:
      'Our studio is rooted in Guwahati, Assam. Dhrisni personally trains and mentors local women artisans in wiring, structural corsetry, and heavy hardware sculpting, creating skilled economic independence through avant-garde fashion.',
    highlight: 'Deeply empowering North-Eastern women craftsmanship on a global fashion stage.'
  }
];

function FoundersSection({ onScrollToSection, onOpenSquadModal, cmsFounders }) {
  const [activePillar, setActivePillar] = useState(0);
  const [isCinematicRevealed, setIsCinematicRevealed] = useState(true);
  const portraitRef = useRef(null);
  const chapter2Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCinematicRevealed(true);
        }
      },
      { threshold: 0.15 }
    );
    if (chapter2Ref.current) {
      observer.observe(chapter2Ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const founderName = cmsFounders?.founder_name || 'Dhrisni';
  const alias = cmsFounders?.alias || 'Dhristroyer';
  const quote = cmsFounders?.quote || 'Building wearable art with my own two hands is the ultimate rebellion.';
  const portraitImg = cmsFounders?.portrait_image || ASSET_MANIFEST.editorialHero || '/assets/editorial_hero_portrait.jpg';

  return (
    <section id="about" className="relative w-full overflow-hidden">
      {/* =========================================================================
          CHAPTER 1: THE MONOLITH EXHIBITION (THE BOTANICAL STUDIO GALLERY)
          Deep dark studio canvas matching the rest of the site. Interactive
          blooming and growing botanical animation of the DHRISNI wordmark.
          ========================================================================= */}
      <div
        className="atelier-dark-canvas studio-dark-canvas w-full bg-[#070609] text-white py-20 sm:py-28 md:py-36 px-4 sm:px-8 relative overflow-hidden flex flex-col items-center justify-center border-b border-white/10"
        style={{ backgroundColor: '#070609', color: '#ffffff' }}
      >
        {/* Subtle Ambient Spatial Glows (Magenta & Emerald) */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(230,60,255,0.08),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_50%_80%,rgba(47,184,166,0.06),transparent_70%)]" />

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Subtle Curated Gallery Pill in Dark Haute Glass */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-mono tracking-[0.28em] uppercase mb-8 sm:mb-12 font-bold shadow-lg"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E63CFF] shadow-[0_0_8px_#E63CFF] animate-pulse" />
            <span>FOUNDER &amp; CREATIVE DIRECTOR</span>
          </div>

          {/* THE BLOOMING & GROWING DHRISNI BOTANICAL ANIMATION */}
          <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl flex items-center justify-center py-2 sm:py-6">
            <DhrisniGarden />
          </div>

          {/* Minimalist Gallery Provenance Subtitle (White / Silver, Clean & Calm Below Artwork) */}
          <div className="flex flex-col items-center gap-2 mt-8 sm:mt-12 text-center">
            <span
              className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase font-bold"
              style={{ color: '#ffffff', textShadow: '0 2px 10px rgba(255,255,255,0.2)' }}
            >
              DHRISNI • DHRISTROYER
            </span>
            <span
              className="text-[11px] sm:text-xs font-montserrat uppercase tracking-[0.22em] font-semibold"
              style={{ color: 'rgba(244, 212, 216, 0.75)' }}
            >
              THE ARCHITECT OF WEARABLE ART • GUWAHATI, ASSAM
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 2: CINEMATIC STUDIO DIMENSION — THE ARTISAN & THE MANIFESTO
          Deep obsidian atmosphere with editorial split-screen, archival portrait,
          and oversized haute-couture quote.
          ========================================================================= */}
      <div
        className="atelier-dark-canvas studio-dark-canvas relative w-full bg-[#0a0a0f] text-white py-20 sm:py-28 md:py-36 px-4 sm:px-8 lg:px-12 border-t border-white/10 selection:bg-pink selection:text-black" data-surface="dark"
        style={{ backgroundColor: '#0a0a0f', color: '#ffffff' }}
      >
        {/* Subtle Ambient Spatial Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_20%_30%,rgba(230,60,255,0.07),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_80%_70%,rgba(47,184,166,0.05),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Breadcrumb & Coordinates Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-12 sm:mb-16 border-b border-white/10 gap-3">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-pink uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" style={{ backgroundColor: '#f472b6' }} />
              <span style={{ color: '#f472b6' }}>✦ OUR STORY</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase font-semibold" style={{ color: '#d4d4d8' }}>
              <MapPin className="w-3.5 h-3.5 text-pink shrink-0" style={{ color: '#f472b6', stroke: '#f472b6' }} />
              <span style={{ color: '#d4d4d8' }}>26.1445° N, 91.7362° E • GUWAHATI, ASSAM</span>
            </div>
          </div>

          {/* =========================================================================
              PART A: DHRISNI'S PORTRAIT & ARTISAN PHILOSOPHY (SIDE-BY-SIDE)
              Eliminates the empty space: Photo on left, Philosophy & Story on right
              ========================================================================= */}
          <div ref={chapter2Ref} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left 5 Cols: Cinematic Dhrisni Archival Portrait with 3D Tilt */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Outer Spatial 3D Perspective Wrapper */}
              <div
                className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto py-2 flex flex-col items-center"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Central Portrait Container with Cinematic Pop-Up Effect */}
                <div
                  className={`relative aspect-[3/4] w-full rounded-3xl overflow-visible transition-all duration-1000 ease-out transform ${
                    isCinematicRevealed
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-90 translate-y-10'
                  }`}
                  style={{
                    transform: isCinematicRevealed
                      ? `perspective(1000px) rotateY(${mousePos.x * 0.35}deg) rotateX(${mousePos.y * 0.35}deg)`
                      : 'scale(0.9) translateY(40px)'
                  }}
                >
                  {/* High-Fashion Museum Archival Frame (Uncompressed Raw Portrait) */}
                  <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/25 bg-black/95 shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
                    <img
                      src={portraitImg}
                      alt={founderName}
                      className="w-full h-full object-cover object-top filter brightness-100 transition-transform duration-700 ease-out hover:scale-105"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent pointer-events-none" />

                    {/* Corner Coordinates & Archival Tag */}
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className="px-3 py-1 rounded-full border text-[9px] font-mono tracking-widest uppercase font-bold shadow-md"
                        style={{
                          color: '#ffffff',
                          backgroundColor: 'rgba(0, 0, 0, 0.85)',
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        BEHIND THE SCENES
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between pointer-events-none">
                      <div className="text-left">
                        <span className="text-[10px] font-mono tracking-widest block font-bold uppercase" style={{ color: '#f472b6' }}>
                          MASTER ARTISAN
                        </span>
                        <h3 className="text-base sm:text-lg font-mono font-bold uppercase" style={{ color: '#ffffff' }}>
                          {founderName} ({alias})
                        </h3>
                      </div>
                      <span
                        className="text-[9px] font-mono border rounded-full px-2.5 py-0.5 font-semibold"
                        style={{
                          color: '#e4e4e7',
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          borderColor: 'rgba(255, 255, 255, 0.3)'
                        }}
                      >
                        GUWAHATI
                      </span>
                    </div>
                  </div>

                  {/* Dramatic Ambient Aura Glow */}
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-pink/30 via-transparent to-purple-500/20 blur-2xl -z-10 opacity-75 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Right 7 Cols: The Artisan Philosophy Quote, Story Paragraphs & CTAs — Directly beside photo */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase font-bold block mb-3" style={{ color: '#f472b6' }}>
                  ARTISAN PHILOSOPHY
                </span>
                <blockquote
                  className="text-2xl sm:text-3xl lg:text-[34px] font-cinzel font-bold leading-tight tracking-wide drop-shadow-md"
                  style={{ color: '#ffffff' }}
                >
                  "{quote}"
                </blockquote>
              </div>

              <div className="space-y-4 font-montserrat text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: '#e4e4e7' }}>
                <p style={{ color: '#e4e4e7' }}>
                  Known to the world as <strong className="font-mono font-bold" style={{ color: '#ffffff' }}>Dhrisni</strong> or{' '}
                  <strong className="font-mono font-bold" style={{ color: '#f472b6' }}>@Dhristroyer</strong>, she wears many titles—actor, model, creator,
                  and designer. But strip all that away, and at her absolute core, she is an artisan who refuses cookie-cutter minimalism.
                </p>
                <p style={{ color: '#e4e4e7' }}>
                  Growing up in Assam with strict boundaries on clothing, her creativity had to break out. She picked up a pair
                  of heavy scissors and began slicing up garments to sculpt raw wearable armor. Today, every single relic from
                  AVZ Vaganza is born directly under her hands in our Guwahati workshop.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={BRAND_INFO.whatsappLinkPrimary}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('snap')}
                  className="btn-founder-cta bg-white text-black inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95 cursor-pointer group hover:bg-zinc-200"
                  style={{ backgroundColor: '#ffffff', color: '#000000' }}
                >
                  <span style={{ color: '#000000' }} className="text-black font-bold">COMMISSION WITH DHRISNI</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: '#000000' }} />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    playSound('snap');
                    if (onScrollToSection) {
                      onScrollToSection('shop');
                    } else {
                      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border font-mono text-xs tracking-widest uppercase transition-all cursor-pointer hover:border-pink/80"
                  style={{
                    color: '#ffffff',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span style={{ color: '#ffffff' }}>EXPLORE 1-OF-1 DESIGNS</span>
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================================
              PART B: MEET THE MOTHER & 4 3D BOXES (POLAROID GALLERY)
              Arranged across the full width, eliminating all empty space!
              ========================================================================= */}
          <div className="mt-16 sm:mt-24 pt-12 border-t border-white/10 flex flex-col items-center">
            {/* Big Headline */}
            <div
              className={`text-center transition-all duration-1000 ease-out transform ${
                isCinematicRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <span className="text-[10px] font-mono tracking-[0.35em] text-[#f472b6] font-bold uppercase block mb-1">
                ✦ FOUNDER & VISIONARY
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-black tracking-wider text-white uppercase drop-shadow-[0_4px_28px_rgba(244,114,182,0.5)]">
                MEET THE MOTHER
              </h2>
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#f472b6]" />
                <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
                  ARCHITECT OF THE OTHER DIMENSION
                </span>
                <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#f472b6]" />
              </div>
            </div>

            {/* 4 3D Popping Polaroid Cards - Full width 4 columns on desktop, 2 on tablet, 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10 w-full max-w-6xl mx-auto pointer-events-auto">
              {POLAROID_CARDS.map((card, idx) => (
                <div
                  key={card.id}
                  className={`transition-all duration-700 ease-out transform ${
                    isCinematicRevealed ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${400 + idx * 100}ms` }}
                >
                  <div
                    className={`polaroid-card p-2.5 sm:p-3 pb-4 sm:pb-5 rounded-md bg-white border border-white/90 shadow-[0_14px_35px_rgba(0,0,0,0.85)] cursor-pointer transition-all duration-500 ease-out ${card.rotation} hover:rotate-0 hover:scale-105 hover:shadow-[0_20px_45px_rgba(244,114,182,0.45)] h-full flex flex-col justify-between`}
                    style={{ backgroundColor: '#ffffff' }}
                    onMouseEnter={() => playSound('cyber_hover')}
                  >
                    {/* Pure Black Photo Aperture Inside */}
                    <div className="bg-[#09090d] p-3 rounded-sm flex flex-col justify-between text-left min-h-[105px] border border-black/40 flex-1">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="text-[8px] font-mono tracking-widest text-[#f472b6] font-bold uppercase">
                            {card.tag}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6] animate-pulse" />
                        </div>
                        <h4 className="text-[11px] sm:text-xs font-mono font-bold text-white tracking-wide uppercase mb-1">
                          "{card.headline}"
                        </h4>
                      </div>
                      <p className="text-[9px] sm:text-[9.5px] font-mono text-zinc-300 leading-snug mt-2">
                        {card.body}
                      </p>
                    </div>

                    {/* Authentic Polaroid White Margin Chin with Archival Stamp */}
                    <div className="mt-2 px-1 flex items-center justify-between text-[8px] sm:text-[8.5px] font-mono font-bold tracking-widest text-zinc-800 uppercase">
                      <span>{card.stamp}</span>
                      <span className="text-[7.5px] text-zinc-500">✦ AVZ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =========================================================================
              CHAPTER 3: THE FOUR PILLARS OF DHRISTROYER (INTERACTIVE DOSSIER)
              ========================================================================= */}
          <div className="mt-24 sm:mt-32 pt-16 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 text-left">
              <div>
                <span className="text-[10px] font-mono tracking-[0.28em] uppercase font-bold block mb-1" style={{ color: '#f472b6' }}>
                  STUDIO PHILOSOPHY
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-mono font-bold uppercase tracking-wider text-white studio-pillars-heading" style={{ color: '#ffffff' }}>
                  FOUR PILLARS OF AVZ STUDIO
                </h3>
              </div>
              <p className="text-xs font-mono tracking-wider font-semibold" style={{ color: '#d4d4d8' }}>
                TAP A PILLAR TO LEARN MORE
              </p>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              {MANIFESTO_PILLARS.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                const isSelected = activePillar === idx;

                return (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      playSound('cyber_hover');
                      setActivePillar(idx);
                    }}
                    data-surface="dark" className="pillar-tab-btn p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 shadow-md hover:scale-[1.02] active:scale-95"
                    style={{
                      backgroundColor: isSelected ? '#25062c' : '#14141e',
                      borderColor: isSelected ? '#f472b6' : 'rgba(255, 255, 255, 0.18)',
                      boxShadow: isSelected ? '0 0 20px rgba(244, 114, 182, 0.35)' : 'none',
                      color: '#ffffff'
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: isSelected ? '#f472b6' : '#a1a1aa' }}
                      >
                        {pillar.id}
                      </span>
                      <IconComponent
                        className="w-4 h-4"
                        style={{ color: isSelected ? '#f472b6' : '#a1a1aa' }}
                      />
                    </div>
                    <span
                      className="pillar-tab-title text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wider line-clamp-2 leading-snug text-white"
                      style={{ color: '#ffffff' }}
                    >
                      {pillar.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Showcase Card */}
            <div
              className="p-6 sm:p-10 rounded-3xl border text-left shadow-2xl relative overflow-hidden"
              style={{
                backgroundColor: '#120417',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff'
              }}
            >
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="font-mono text-xs font-bold tracking-widest uppercase"
                    style={{ color: '#f472b6' }}
                  >
                    PILLAR {MANIFESTO_PILLARS[activePillar].id} • PHILOSOPHY
                  </span>
                </div>
                <h4
                  className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-wider mb-2"
                  style={{ color: '#ffffff' }}
                >
                  {MANIFESTO_PILLARS[activePillar].title}
                </h4>
                <p
                  className="text-xs sm:text-sm font-mono tracking-wider uppercase mb-5 font-semibold"
                  style={{ color: '#d4d4d8' }}
                >
                  {MANIFESTO_PILLARS[activePillar].subtitle}
                </p>
                <p
                  className="text-sm sm:text-base font-montserrat leading-relaxed mb-6"
                  style={{ color: '#f4f4f5' }}
                >
                  {MANIFESTO_PILLARS[activePillar].summary}
                </p>
                <div
                  className="p-4 rounded-xl border text-xs sm:text-sm font-mono tracking-wide font-semibold"
                  style={{
                    color: '#f472b6',
                    backgroundColor: 'rgba(244, 114, 182, 0.12)',
                    borderColor: 'rgba(244, 114, 182, 0.4)'
                  }}
                >
                  ✦ {MANIFESTO_PILLARS[activePillar].highlight}
                </div>
              </div>

              {/* Ambient Watermark Icon */}
              <div className="absolute right-6 -bottom-6 opacity-5 pointer-events-none hidden md:block">
                {React.createElement(MANIFESTO_PILLARS[activePillar].icon, { className: 'w-64 h-64 text-white' })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


export default React.memo(FoundersSection);
