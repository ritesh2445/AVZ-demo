import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Scissors,
  Cpu,
  ArrowUpRight,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Instagram,
  HeartHandshake,
  Layers,
  Flame,
  ArrowRight,
  Lock,
  Heart,
  Users
} from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

// Authentic scattered pictures catalog modeled after later.com/made-you-look
const SCATTERED_PICTURES = [
  {
    id: 'pic-chainmail',
    title: 'Chainmail Armor Bodice',
    subtitle: 'Stainless steel jump rings woven in Guwahati',
    aspect: 'aspect-[3/4]',
    image: ASSET_MANIFEST.products.chainmailArmor,
    tag: 'GRAIL 01 // CHAINMAIL ARMOR',
    rotation: '-rotate-2',
    offsetY: 'translate-y-0 lg:-translate-y-4',
    provenance: 'Hand-woven over 36 hours by our Guwahati women artisans. Stainless jump rings fluidly hug your curves with pure main character energy.'
  },
  {
    id: 'pic-motherboard',
    title: 'Silicon Circuit Ear Cuff',
    subtitle: 'Decommissioned motherboards & copper traces',
    aspect: 'aspect-square',
    image: ASSET_MANIFEST.products.motherboardCuff,
    tag: 'ARTIFACT // RECLAIMED SILICON',
    rotation: 'rotate-2',
    offsetY: 'translate-y-0 lg:translate-y-8',
    provenance: 'Salvaged printed circuit boards cut into geometric wearable tech. No two silicon trace patterns are ever identical.'
  },
  {
    id: 'pic-spike-bodice',
    title: 'Cone Spike Armor Bodice',
    subtitle: 'Industrial hardware, cone spikes & harness',
    aspect: 'aspect-[4/5]',
    image: ASSET_MANIFEST.products.spikeBodice,
    tag: 'ARMOR // SPIKE ARCHITECTURE',
    rotation: '-rotate-1',
    offsetY: 'translate-y-0 lg:-translate-y-2',
    provenance: 'Protective avant-garde armor designed for midnight raves. Sharp attitude, immaculate fit, zero apologies.'
  },
  {
    id: 'pic-hero-editorial',
    title: 'Dhristroyer Atelier Shoot',
    subtitle: 'Dhrisni directing wearable art construction',
    aspect: 'aspect-[16/10]',
    image: ASSET_MANIFEST.editorialHero,
    tag: 'ATELIER // GUWAHATI PROVENANCE',
    rotation: 'rotate-1',
    offsetY: 'translate-y-0 lg:translate-y-6',
    provenance: 'Dhrisni in the Guwahati atelier. Hand-trimming raw hardware and ensuring every single stitch serves cunt.'
  },
  {
    id: 'pic-diva-top',
    title: 'Diva Distressed Denim Corset',
    subtitle: 'Deconstructed zero-waste denim & eyelets',
    aspect: 'aspect-[3/4]',
    image: ASSET_MANIFEST.products.divaTop,
    tag: 'UPCYCLE // DECONSTRUCTED DENIM',
    rotation: '-rotate-2',
    offsetY: 'translate-y-0 lg:-translate-y-6',
    provenance: 'Old jeans rescued from landfill, bleached, distressed, and reconstructed into an iconic waist-cinching corset.'
  },
  {
    id: 'pic-beaded-bralette',
    title: 'Archive Beaded Wire Bralette',
    subtitle: 'Industrial washers, metal beads & wireframe',
    aspect: 'aspect-[4/5]',
    image: ASSET_MANIFEST.products.beadedBralette,
    tag: 'BESPOKE // METALLIC SCULPTURE',
    rotation: 'rotate-2',
    offsetY: 'translate-y-0 lg:translate-y-4',
    provenance: 'Hand-shaped wire skeleton embellished with stainless hardware beads. Built to turn every head in the room.'
  }
];

const ATELIER_PILLARS = [
  {
    num: '01',
    tag: 'RECLAIMED CIRCUITS',
    title: 'Computer Motherboards',
    desc: 'Decommissioned PCBs sliced into geometric breastplates and ear cuffs. The silicon traces catch rave lights like high-tech precious metals, no cap.',
    icon: Cpu
  },
  {
    num: '02',
    tag: 'TACTILE CLICK',
    title: 'Mechanical Keycaps',
    desc: 'Vintage keyboard stems restrung on wire harnesses. Chokers that let you physically click "ESC" or "CTRL" while serving looks on the dance floor.',
    interactiveKey: true,
    icon: Flame
  },
  {
    num: '03',
    tag: 'STAINLESS METALS',
    title: 'Spikes & Chainmail',
    desc: 'Cone spikes, industrial washers, safety pins, and hand-woven chainmail mesh that form fluid, protective armor for certified baddies.',
    icon: Scissors
  },
  {
    num: '04',
    tag: 'ETHICAL PRODUCTION',
    title: 'Guwahati Women Artisans',
    desc: 'AVZ exclusively hires and trains local women directly under Dhrisni’s supervision, paying ethical living wages and keeping human craft alive.',
    icon: HeartHandshake
  },
  {
    num: '05',
    tag: 'UP-CYCLED TEXTILES',
    title: 'Zero-Waste Denim',
    desc: 'Old jeans and discarded garments rescued from landfills, deconstructed, bleached, distressed, and reworked into one-of-a-kind statement grails.',
    icon: Layers
  },
  {
    num: '06',
    tag: 'SUBCULTURES',
    title: 'Cyber-Grunge & Y2K',
    desc: 'A collision of rave aesthetics, industrial punk, mermaidcore iridescence, and avant-garde streetwear for baddies who refuse boring boxes.',
    icon: Sparkles
  }
];

export default function FoundersSection({ onScrollToSection, onOpenSquadModal }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1000);
  const [activePhotoModal, setActivePhotoModal] = useState(null);
  const [keycapClickCount, setKeycapClickCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Measure track dimensions
  const updateDimensions = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const trackWidth = trackRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    const max = Math.max(0, trackWidth - viewportWidth + 80);
    setMaxScroll(max);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // ROCK-SOLID WHEEL INTERCEPTOR:
  // When scrolling down inside this section:
  // - If horizontal track has not reached the end: prevent default vertical scroll, scroll horizontally!
  // - If horizontal track reaches the end: let vertical scroll continue down!
  // When scrolling up inside this section:
  // - If horizontal track has not reached 0: prevent default vertical scroll, scroll horizontally back!
  // - If horizontal track reaches 0: let vertical scroll continue up!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let currentX = 0;

    const handleWheel = (e) => {
      // Only horizontal scroll on desktop screens
      if (window.innerWidth < 1024) return;

      const track = trackRef.current;
      if (!track) return;

      const trackWidth = track.scrollWidth;
      const max = Math.max(0, trackWidth - window.innerWidth + 80);

      const delta = e.deltaY || e.deltaX;
      if (Math.abs(delta) < 2) return;

      // Scrolling Down / Forward
      if (delta > 0) {
        if (currentX < max - 5) {
          // INTERCEPT: Scroll horizontally instead of letting site scroll past!
          e.preventDefault();
          currentX = Math.min(max, currentX + delta * 1.15);
          track.style.transform = `translate3d(-${currentX.toFixed(1)}px, 0, 0)`;
          setScrollX(currentX);
        }
        // When currentX >= max - 5, do NOT preventDefault -> page naturally scrolls down!
      }
      // Scrolling Up / Backward
      else if (delta < 0) {
        if (currentX > 5) {
          // INTERCEPT: Scroll horizontally back!
          e.preventDefault();
          currentX = Math.max(0, currentX + delta * 1.15);
          track.style.transform = `translate3d(-${currentX.toFixed(1)}px, 0, 0)`;
          setScrollX(currentX);
        }
        // When currentX <= 5, do NOT preventDefault -> page naturally scrolls up!
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Programmatic smooth step left or right
  const stepHorizontal = (direction) => {
    playSound('whoosh');
    if (!trackRef.current) return;
    const stepSize = window.innerWidth * 0.55;
    const newX = direction === 'next'
      ? Math.min(maxScroll, scrollX + stepSize)
      : Math.max(0, scrollX - stepSize);

    setScrollX(newX);
    trackRef.current.style.transform = `translate3d(-${newX.toFixed(1)}px, 0, 0)`;
  };

  // Jump to specific milestone (0.0 to 1.0)
  const jumpMilestone = (ratio) => {
    playSound('whoosh');
    if (!trackRef.current) return;
    const targetX = ratio * maxScroll;
    setScrollX(targetX);
    trackRef.current.style.transform = `translate3d(-${targetX.toFixed(1)}px, 0, 0)`;
  };

  const handleKeycapClick = () => {
    playSound('pip');
    setKeycapClickCount((c) => c + 1);
  };

  const progressPercent = maxScroll > 0 ? Math.min(100, Math.round((scrollX / maxScroll) * 100)) : 0;

  return (
    <section
      id="about"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative w-full bg-pitch-black select-none text-left border-t border-[#be185d]/30 overflow-hidden"
    >
      {/* 1. TOP MARQUEE BANNER (Later.com Baddie Ticker) */}
      <div className="w-full bg-[#1b0320] border-b border-[#be185d]/30 py-2.5 overflow-hidden whitespace-nowrap relative z-20">
        <div className="animate-marquee flex items-center gap-8 text-[11px] sm:text-xs font-mono tracking-[0.25em] text-pink-300 uppercase">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
                AVZ VAGANZA
              </span>
              <span>✦</span>
              <span className="text-white font-bold">BEYOND THE ALGORITHM</span>
              <span>✦</span>
              <span>HAUTE WEARABLE ART</span>
              <span>✦</span>
              <span className="text-[#f472b6]">HANDMADE IN GUWAHATI</span>
              <span>✦</span>
              <span>REBELLION AGAINST FAST FASHION</span>
              <span>✦</span>
              <span className="text-white">BY BADDIES FOR BADDIES</span>
              <span>✦</span>
              <span className="text-pink-300">DHRISTROYER ATELIER</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN HORIZONTAL CANVAS CONTAINER (Fits comfortably on screen) */}
      <div className="relative w-full py-8 lg:py-10 px-6 sm:px-12 lg:px-20 min-h-[750px] lg:h-[88vh] flex flex-col justify-between overflow-hidden">
        {/* Ambient Chromatic Blooming Backgrounds */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bloom-purple rounded-full blur-[160px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bloom-pink rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* 3. POLISHED EDITORIAL HEADER (Fixed UI Discrepancy from Screenshot) */}
        <div className="w-full shrink-0 z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 text-pink-300 text-[10px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(190,24,93,0.25)] mb-2">
              <Scissors className="w-3 h-3 text-[#f472b6]" />
              <span>THE CREATOR'S UNIVERSE // ATELIER GUWAHATI</span>
            </div>

            {/* Haute Couture Title with Styled Gradient Accent */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-spartan uppercase tracking-tight text-white leading-tight">
              DHRISNI{' '}
              <span className="font-spartan font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-[#f472b6] to-purple-400 drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]">
                (DHRISTROYER)
              </span>
            </h2>
          </div>

          {/* Social Handle & Origin Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/20 hover:border-[#be185d] text-white hover:text-pink-300 text-xs font-mono transition-all group cursor-pointer"
            >
              <Instagram className="w-3.5 h-3.5 text-[#f472b6] group-hover:scale-110 transition-transform" />
              <span>@avz.vaganza</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16021c]/80 border border-[#be185d]/30 text-silver/80 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              <span>GUWAHATI ATELIER // 781006</span>
            </div>
          </div>
        </div>

        {/* 4. THE HORIZONTAL TRACK (Transforms smoothly on wheel or controls) */}
        <div className="relative w-full flex-1 overflow-hidden my-4">
          <div
            ref={trackRef}
            className="flex items-center h-full w-max transition-transform duration-300 ease-out will-change-transform gap-8 lg:gap-12"
            style={{ transform: `translate3d(-${scrollX.toFixed(1)}px, 0, 0)` }}
          >
            {/* ========================================================
                PANEL 1: THE MANIFESTO & THE MONIKER CARD
               ======================================================== */}
            <div className="w-[88vw] sm:w-[580px] lg:w-[620px] shrink-0 flex flex-col justify-center text-left">
              <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1b0320]/95 via-black to-[#140217]/95 border border-[#be185d]/35 backdrop-blur-2xl shadow-[0_20px_60px_rgba(30,2,30,0.8)] relative overflow-hidden">
                <div className="text-[#f472b6] text-[11px] font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#f472b6] animate-pulse" />
                  FOUNDER, CREATIVE DIRECTOR & MASTER ARTISAN
                </div>

                <h3 className="text-xl sm:text-3xl font-black font-spartan uppercase text-white mb-4 leading-snug">
                  "In a world drowning in fast fashion & AI slop, human hands making things is the ultimate rebellion."
                </h3>

                <div className="space-y-3 text-silver/85 text-xs sm:text-sm font-montserrat leading-relaxed">
                  <p>
                    AVZ Vaganza started the way all iconic things do: staring at a stuffed closet, completely sick of seeing the exact same cookie-cutter fast-fashion clones on everyone.
                  </p>
                  <p>
                    Tired of landfills and factory sameness, Dhrisni grabbed scissors and started cutting up her own fits to craft something entirely different. Zero mass production. Zero corporate BS. Just raw craftsmanship made by baddies for baddies.
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink-300">
                    #Maximalism
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink-300">
                    #WearableArt
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink-300">
                    #1of1Grail
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink-300">
                    #CyberGrunge
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================
                PANEL 2: THE SCISSORS REBELLION (SPOTLIGHT PORTRAIT)
               ======================================================== */}
            <div className="w-[85vw] sm:w-[480px] lg:w-[500px] shrink-0 flex flex-col justify-center text-left">
              <div className="relative aspect-[4/5] max-h-[460px] w-full rounded-3xl overflow-hidden border border-[#be185d]/40 bg-black group shadow-[0_20px_50px_rgba(40,5,40,0.6)]">
                <img
                  src={ASSET_MANIFEST.products.divaTop}
                  alt="Dhrisni Atelier Work"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 group-hover:brightness-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                {/* Top Tag */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/90 backdrop-blur-md border border-[#be185d]/50 text-pink-300 text-[10px] font-mono tracking-widest uppercase">
                  SCISSORS & REBELLION ✂️
                </div>

                {/* Bottom Story Excerpt */}
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="text-[10px] font-mono text-[#f472b6] tracking-widest uppercase mb-1 block">
                    THE LORE // RESTRICTION INTO DRIP
                  </span>
                  <h4 className="text-lg sm:text-xl font-spartan font-black uppercase text-white mb-1.5 leading-tight">
                    Forbidden Fits Turned Into Haute Armor
                  </h4>
                  <p className="text-xs text-silver/90 font-montserrat leading-relaxed">
                    Growing up in a household where strict rules forbade revealing clothes or sleeveless tops, Dhrisni turned restriction into art. She took scissors, hacked clothes for Instagram, and built an unhinged cult aesthetic.
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================
                PANEL 3: THE ASYMMETRIC PICTURES ARRANGEMENT (LATER.COM STYLE)
               ======================================================== */}
            <div className="w-auto shrink-0 flex flex-col justify-center">
              <div className="mb-3 text-left">
                <span className="text-[10px] font-mono text-pink-300 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
                  EDITORIAL VAULT // ASYMMETRIC PICTURES ARRANGEMENT
                </span>
                <h4 className="text-xl sm:text-2xl font-spartan font-black uppercase text-white">
                  SCATTERED ATELIER GRAILS
                </h4>
              </div>

              {/* Scattered picture rail with varying aspect ratios, coordinates, and tilts */}
              <div className="flex items-center gap-5 sm:gap-7">
                {SCATTERED_PICTURES.map((pic) => (
                  <div
                    key={pic.id}
                    onClick={() => {
                      playSound('metal');
                      setActivePhotoModal(pic);
                    }}
                    className={`group relative w-[240px] sm:w-[280px] lg:w-[310px] rounded-3xl overflow-hidden border border-[#be185d]/30 hover:border-[#f472b6] transition-all duration-500 bg-[#0e0210] shadow-2xl hover:shadow-[0_20px_50px_rgba(75,8,68,0.7)] cursor-pointer transform-gpu ${pic.rotation} ${pic.offsetY} hover:scale-105 hover:rotate-0 hover:z-30`}
                  >
                    <div className={`w-full ${pic.aspect} relative overflow-hidden bg-black`}>
                      <img
                        src={pic.image}
                        alt={pic.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-95"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

                      {/* Top Tag & Zoom Icon */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-[#be185d]/40 text-pink-300 text-[9px] font-mono tracking-widest uppercase">
                          {pic.tag}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white group-hover:text-pink-300 group-hover:border-[#be185d] transition-all">
                          <Maximize2 className="w-3 h-3" />
                        </div>
                      </div>

                      {/* Bottom Metadata */}
                      <div className="absolute bottom-3 left-3 right-3 text-left">
                        <h5 className="text-sm sm:text-base font-spartan font-bold uppercase text-white leading-tight group-hover:text-pink-300 transition-colors">
                          {pic.title}
                        </h5>
                        <p className="text-[10px] text-silver/80 font-montserrat mt-0.5 line-clamp-1">
                          {pic.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ========================================================
                PANEL 4: THE OVERSIZED TYPOGRAPHIC QUOTE (LATER.COM STYLE)
               ======================================================== */}
            <div className="w-[85vw] sm:w-[580px] lg:w-[620px] shrink-0 flex flex-col justify-center text-left">
              <div className="p-7 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1f0425]/90 via-[#0d010f]/95 to-black border border-[#be185d]/40 backdrop-blur-2xl shadow-[0_25px_65px_rgba(45,3,45,0.75)] relative overflow-hidden">
                <div className="quote-mark text-7xl sm:text-8xl text-[#f472b6]/25 font-serif absolute -top-4 -left-2 pointer-events-none">
                  “
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 text-[10px] font-mono text-pink-300 uppercase tracking-widest">
                    <HeartHandshake className="w-3 h-3 text-[#f472b6]" />
                    <span>DHRISTROYER PHILOSOPHY</span>
                  </div>

                  <blockquote className="text-lg sm:text-2xl font-spartan font-bold italic text-white leading-snug tracking-tight">
                    "Her two hands are literally her favorite things about her body because they are the tools that turn junk, hardware, and scraps into something breathing and alive. Building with her own two hands is the ultimate rebellion."
                  </blockquote>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="block font-spartan font-black text-sm uppercase text-white tracking-widest">
                        DHRISNI
                      </span>
                      <span className="text-xs font-mono text-[#f472b6]">
                        FOUNDER & MASTER ARTISAN
                      </span>
                    </div>

                    <button
                      onClick={() => jumpMilestone(0.85)}
                      className="px-4 py-1.5 rounded-full border border-pink-400/30 hover:border-pink-400 bg-pink-400/10 text-pink-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                    >
                      ATELIER PILLARS →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                PANEL 5: THE 6 REBELLION PILLARS (ATELIER ANATOMY)
               ======================================================== */}
            <div className="w-[90vw] sm:w-[750px] lg:w-[850px] shrink-0 flex flex-col justify-center text-left">
              <div className="mb-4 text-left">
                <span className="text-[10px] font-mono text-pink-300 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#f472b6]" />
                  ATELIER DNA // 6 STRUCTURAL PILLARS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white">
                  RAW HARDWARE & HUMAN RESISTANCE
                </h3>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ATELIER_PILLARS.map((pillar) => {
                  const IconComponent = pillar.icon;
                  return (
                    <div
                      key={pillar.num}
                      className="p-4 sm:p-5 rounded-2xl bg-[#120216]/80 hover:bg-[#1a0320] border border-white/10 hover:border-[#be185d]/60 backdrop-blur-xl transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#f472b6] text-[10px] font-mono font-bold">
                          {pillar.num} // {pillar.tag}
                        </span>
                        <IconComponent className="w-3.5 h-3.5 text-silver/60 group-hover:text-[#f472b6] transition-colors" />
                      </div>

                      <h4 className="text-sm sm:text-base font-spartan font-bold uppercase text-white mb-1 leading-tight">
                        {pillar.title}
                      </h4>

                      <p className="text-[11px] text-silver/80 font-montserrat leading-relaxed line-clamp-3">
                        {pillar.desc}
                      </p>

                      {pillar.interactiveKey && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                          <button
                            onClick={handleKeycapClick}
                            className="px-2.5 py-0.5 rounded bg-[#2b082e] hover:bg-[#be185d] border border-pink-400/40 text-pink-200 hover:text-white text-[9px] font-mono uppercase tracking-widest active:translate-y-0.5 transition-all cursor-pointer"
                          >
                            CLICK KEYCAP [ESC]
                          </button>
                          <span className="text-[9px] font-mono text-silver/60">
                            {keycapClickCount} clicks
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================
                PANEL 6: CALL TO COMMISSION & SQUAD BUY
               ======================================================== */}
            <div className="w-[85vw] sm:w-[500px] lg:w-[540px] shrink-0 flex flex-col justify-center text-left">
              <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-br from-[#240528] via-[#120216] to-black border border-[#be185d]/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(30,2,30,0.8)] text-left flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c041f] border border-[#be185d]/40 text-pink-300 text-[10px] font-mono tracking-widest uppercase mb-3">
                    <Sparkles className="w-3 h-3 text-[#f472b6]" />
                    <span>BESPOKE GUWAHATI COMMISSION</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white mb-3 leading-tight">
                    READY TO SERVE CERTIFIED UNHINGED LOOKS?
                  </h3>

                  <p className="text-silver/85 text-xs sm:text-sm font-montserrat leading-relaxed mb-6">
                    Dhrisni personally designs and hand-builds custom motherboard tops, chainmail armor, and spiked outerwear tailored to your specific measurements in 2 to 3 weeks.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      playSound('subdrop');
                      if (onScrollToSection) onScrollToSection('custom');
                    }}
                    className="btn-glass-pink py-3.5 px-5 text-xs font-spartan font-black tracking-widest uppercase text-center cursor-pointer"
                  >
                    COMMISSION A 1-OF-1 PIECE ↗
                  </button>

                  {onOpenSquadModal && (
                    <button
                      onClick={() => {
                        playSound('pip');
                        onOpenSquadModal();
                      }}
                      className="px-5 py-3 rounded-full bg-[#2a0530] border border-[#f472b6]/40 hover:border-[#f472b6] text-pink-300 hover:text-white text-xs font-spartan font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-[#f472b6]" />
                      <span>START A SQUAD BUY (SAVE UP TO 20%)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. INTERACTIVE BOTTOM SCRUBBER & NAVIGATION CONTROLS */}
        <div className="w-full shrink-0 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
          {/* Milestone Jump Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => jumpMilestone(0.0)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                progressPercent < 20
                  ? 'bg-[#be185d] text-white shadow-[0_0_12px_rgba(190,24,93,0.5)]'
                  : 'bg-white/5 text-silver/70 hover:text-white hover:bg-white/10'
              }`}
            >
              01 THE LORE
            </button>
            <button
              onClick={() => jumpMilestone(0.28)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                progressPercent >= 20 && progressPercent < 48
                  ? 'bg-[#be185d] text-white shadow-[0_0_12px_rgba(190,24,93,0.5)]'
                  : 'bg-white/5 text-silver/70 hover:text-white hover:bg-white/10'
              }`}
            >
              02 SCISSORS REBELLION
            </button>
            <button
              onClick={() => jumpMilestone(0.55)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                progressPercent >= 48 && progressPercent < 75
                  ? 'bg-[#be185d] text-white shadow-[0_0_12px_rgba(190,24,93,0.5)]'
                  : 'bg-white/5 text-silver/70 hover:text-white hover:bg-white/10'
              }`}
            >
              03 SCATTERED GRAILS
            </button>
            <button
              onClick={() => jumpMilestone(0.85)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                progressPercent >= 75
                  ? 'bg-[#be185d] text-white shadow-[0_0_12px_rgba(190,24,93,0.5)]'
                  : 'bg-white/5 text-silver/70 hover:text-white hover:bg-white/10'
              }`}
            >
              04 ATELIER ANATOMY
            </button>
          </div>

          {/* Progress Bar & Visual Scrubber */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="text-[10px] font-mono text-silver/60 shrink-0">
              {progressPercent}%
            </span>
            <div className="flex-1 sm:w-44 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-[#be185d] transition-all duration-150 ease-out rounded-full shadow-[0_0_10px_rgba(244,114,182,0.8)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stepper Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => stepHorizontal('prev')}
                aria-label="Scroll backward"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#be185d]/40 border border-white/20 hover:border-[#be185d] flex items-center justify-center text-white cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => stepHorizontal('next')}
                aria-label="Scroll forward"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#be185d]/40 border border-white/20 hover:border-[#be185d] flex items-center justify-center text-white cursor-pointer transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM MARQUEE TAPE (Reverse Direction) */}
      <div className="w-full bg-[#120216] border-b border-white/10 py-2.5 overflow-hidden whitespace-nowrap relative z-20">
        <div className="animate-marquee-reverse flex items-center gap-8 text-[11px] sm:text-xs font-mono tracking-[0.25em] text-silver/70 uppercase">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="text-pink-300">ONE OF ONE WEARABLE ART</span>
              <span>✦</span>
              <span>COMPUTER MOTHERBOARDS</span>
              <span>✦</span>
              <span className="text-white font-bold">ETHICAL GUWAHATI WOMEN ARTISANS</span>
              <span>✦</span>
              <span>MECHANICAL KEYCAP CHOKERS</span>
              <span>✦</span>
              <span className="text-[#f472b6]">CONE SPIKE ARMOR</span>
              <span>✦</span>
              <span>HAND-WOVEN CHAINMAIL</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. HIGH-RESOLUTION ZOOM LIGHTBOX MODAL */}
      {activePhotoModal && (
        <div
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActivePhotoModal(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#120216] border border-[#be185d]/50 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(40,5,40,0.9)] flex flex-col lg:flex-row text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhotoModal(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="lg:w-3/5 bg-black relative aspect-[4/5] lg:aspect-auto">
              <img
                src={activePhotoModal.image}
                alt={activePhotoModal.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between text-left">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-[#1c041f] border border-[#be185d]/40 text-pink-300 text-[10px] font-mono tracking-widest uppercase inline-block mb-3">
                  {activePhotoModal.tag}
                </span>

                <h3 className="text-xl sm:text-2xl font-black font-spartan uppercase text-white mb-2 leading-tight">
                  {activePhotoModal.title}
                </h3>

                <p className="text-xs font-mono text-[#f472b6] mb-4">
                  {activePhotoModal.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-silver/85 font-montserrat leading-relaxed mb-6">
                  {activePhotoModal.provenance}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActivePhotoModal(null);
                    if (onScrollToSection) onScrollToSection('custom');
                  }}
                  className="btn-glass-pink py-3 px-4 text-xs font-spartan font-black tracking-widest uppercase text-center cursor-pointer"
                >
                  COMMISSION A SIMILAR PIECE ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
