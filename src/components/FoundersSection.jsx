import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Scissors,
  Cpu,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Instagram,
  HeartHandshake,
  Layers,
  Flame,
  ArrowRight
} from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

import DhristroyerAnimatedHeading from './DhristroyerAnimatedHeading';

const SCATTERED_PICTURES = [
  {
    id: 'pic-chainmail',
    title: 'Chainmail Armor Bodice',
    subtitle: 'Stainless steel jump rings woven in Guwahati',
    image: ASSET_MANIFEST.products.chainmailArmor,
    tag: 'GRAIL 01 // CHAINMAIL ARMOR',
    provenance: 'Hand-woven over 36 hours by our Guwahati women artisans. Stainless jump rings fluidly hug your curves with pure main character energy. Slay certified.'
  },
  {
    id: 'pic-motherboard',
    title: 'Silicon Circuit Ear Cuff',
    subtitle: 'Decommissioned motherboards & copper traces',
    image: ASSET_MANIFEST.products.motherboardCuff,
    tag: 'ARTIFACT // RECLAIMED SILICON',
    provenance: 'Salvaged printed circuit boards cut into geometric wearable tech. No two silicon trace patterns are ever identical. Period.'
  },
  {
    id: 'pic-spike-bodice',
    title: 'Cone Spike Armor Bodice',
    subtitle: 'Industrial hardware, cone spikes & harness',
    image: ASSET_MANIFEST.products.spikeBodice,
    tag: 'ARMOR // SPIKE ARCHITECTURE',
    provenance: 'Protective avant-garde armor designed for midnight raves. Sharp attitude, immaculate fit, zero apologies for looking this hot.'
  },
  {
    id: 'pic-hero-editorial',
    title: 'Dhristroyer Atelier Shoot',
    subtitle: 'Dhrisni directing wearable art construction',
    image: ASSET_MANIFEST.editorialHero,
    tag: 'ATELIER // GUWAHATI PROVENANCE',
    provenance: 'Dhrisni in the Guwahati atelier. Hand-trimming raw hardware and ensuring every single stitch serves absolute baddie excellence.'
  },
  {
    id: 'pic-diva-top',
    title: 'Diva Distressed Denim Corset',
    subtitle: 'Deconstructed zero-waste denim & eyelets',
    image: ASSET_MANIFEST.products.divaTop,
    tag: 'UPCYCLE // DECONSTRUCTED DENIM',
    provenance: 'Old jeans rescued from landfill, bleached, distressed, and reconstructed into an iconic waist-cinching corset that ate and left no crumbs.'
  }
];

const ATELIER_PILLARS = [
  {
    num: '01',
    tag: 'RECLAIMED CIRCUITS',
    title: 'Computer Motherboards',
    desc: 'Decommissioned PCBs sliced into geometric breastplates and cuffs. Silicon traces catch rave strobe lights like cyberpunk precious gems, no cap.',
    icon: Cpu
  },
  {
    num: '02',
    tag: 'STAINLESS METALS',
    title: 'Spikes & Chainmail',
    desc: 'Industrial cone spikes, washers, and hand-linked jump rings assembled into fluid, protective armor built for certified baddies who command the room.',
    icon: Scissors
  },
  {
    num: '03',
    tag: 'ETHICAL PRODUCTION',
    title: 'Guwahati Women Artisans',
    desc: 'AVZ exclusively hires and trains local women under Dhrisni’s personal direction, paying dignified ethical living wages and preserving authentic human craft.',
    icon: HeartHandshake
  },
  {
    num: '04',
    tag: 'UPCYCLED TEXTILES',
    title: 'Zero-Waste Denim',
    desc: 'Discarded vintage denim deconstructed, bleached, distressed, and transformed into waist-cinching statement grails that refuse boring fast-fashion boxes.',
    icon: Layers
  }
];

export default function FoundersSection({ onScrollToSection, onOpenSquadModal }) {
  const scrollContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  // Horizontal scroll only — vertical scrolling continues normally down the page
  const scrollLeft = () => {
    playSound('cyber_hover');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -460, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    playSound('cyber_hover');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 460, behavior: 'smooth' });
    }
  };

  const scrollToMilestone = (index) => {
    playSound('glitch_click');
    setActiveTab(index);
    if (!scrollContainerRef.current) return;
    const cards = scrollContainerRef.current.querySelectorAll('.milestone-card');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  return (
    <section
      id="about"
      className="relative w-full bg-pitch-black select-none text-left border-t border-[#be185d]/30 overflow-hidden"
    >
      {/* 1. TOP MARQUEE BANNER */}
      <div className="w-full bg-[#1b0320] border-b border-[#be185d]/30 py-2.5 overflow-hidden whitespace-nowrap relative z-20">
        <div className="animate-marquee flex items-center gap-8 text-[11px] sm:text-xs font-mono tracking-[0.25em] text-pink-300 uppercase">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-pink" />
                AVZ VAGANZA
              </span>
              <span>✦</span>
              <span className="text-white font-bold">BEYOND THE ALGORITHM</span>
              <span>✦</span>
              <span>HAUTE WEARABLE ART</span>
              <span>✦</span>
              <span className="text-pink">HANDMADE IN GUWAHATI</span>
              <span>✦</span>
              <span>REBELLION AGAINST FAST FASHION</span>
              <span>✦</span>
              <span className="text-white">BY BADDIES FOR BADDIES</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. EDITORIAL HEADER & NAVIGATION HUD */}
      <div className="pt-8 sm:pt-10 pb-4 sm:pb-6 px-4 sm:px-12 lg:px-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 text-pink text-[10px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(244,194,194,0.2)] mb-3">
            <Scissors className="w-3 h-3 text-pink" />
            <span>THE CREATOR'S MANIFESTO // GUWAHATI ATELIER</span>
          </div>

          <DhristroyerAnimatedHeading />
          <p className="text-silver/80 text-sm mt-2 font-montserrat max-w-2xl">
            Swipe or scroll horizontally through the story, craft pillars, and authentic atelier archives. Vertical scroll continues untouched.
          </p>
        </div>

        {/* Milestone Navigation Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-3 rounded-full bg-black/80 hover:bg-pink/20 border border-white/20 hover:border-pink text-white hover:text-pink transition-all cursor-pointer shadow-lg"
              title="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              className="p-3 rounded-full bg-black/80 hover:bg-pink/20 border border-white/20 hover:border-pink text-white hover:text-pink transition-all cursor-pointer shadow-lg"
              title="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/20 hover:border-pink text-white hover:text-pink text-xs font-mono transition-all group cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5 text-pink group-hover:scale-110 transition-transform" />
            <span>@avz.vaganza</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Milestone Tabs Quick Selector */}
      <div className="px-4 sm:px-12 lg:px-20 py-2.5 sm:py-3 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-black/40">
        {[
          '01 // MANIFESTO',
          '02 // THE SCISSORS LORE',
          '03 // CRAFT PILLARS',
          '04 // ATELIER ARCHIVE',
          '05 // WOMEN ARTISANS'
        ].map((tabName, idx) => (
          <button
            key={idx}
            onClick={() => scrollToMilestone(idx)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === idx
                ? 'bg-pink text-black font-bold border-pink shadow-[0_0_15px_rgba(244,194,194,0.3)]'
                : 'bg-black/60 text-silver/70 border-white/10 hover:border-pink/40 hover:text-white'
            }`}
          >
            {tabName}
          </button>
        ))}
      </div>

      {/* 3. DEDICATED HORIZONTAL SCROLL ONLY CONTAINER (Vertical scroll passes through smoothly) */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto overflow-y-hidden py-6 sm:py-10 px-4 sm:px-12 lg:px-20 flex items-stretch gap-6 sm:gap-8 lg:gap-10 scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'x proximity' }}
      >
        {/* ========================================================
            CARD 0: THE MANIFESTO
           ======================================================== */}
        <div className="milestone-card w-[88vw] sm:w-[540px] shrink-0 flex flex-col justify-between p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#1b0320]/95 via-black to-[#140217]/95 border border-pink/35 shadow-[0_20px_50px_rgba(30,2,30,0.8)] snap-start">
          <div>
            <div className="text-pink text-[11px] font-mono tracking-widest uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink animate-pulse" />
              FOUNDER, CREATIVE DIRECTOR & MASTER ARTISAN
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white mb-4 leading-snug">
              "In a world drowning in fast fashion & AI slop, making things with real human hands is the ultimate rebellion."
            </h3>

            <div className="space-y-3 text-silver/85 text-xs sm:text-sm font-montserrat leading-relaxed">
              <p>
                AVZ Vaganza started staring at a stuffed closet, sick of seeing the exact same cookie-cutter clones on everyone.
              </p>
              <p>
                Tired of landfills and fast-fashion waste, Dhrisni grabbed scissors and began cutting up her own fits to craft something unhinged. Zero mass production. Zero corporate filler. Wearable art sculpted for baddies who refuse to be boring.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink">
              #Maximalism
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink">
              #WearableArt
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink">
              #CertifiedBaddie
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-mono text-pink">
              #NoFastFashion
            </span>
          </div>
        </div>

        {/* ========================================================
            CARD 1: THE SCISSORS REBELLION (LORE)
           ======================================================== */}
        <div className="milestone-card w-[85vw] sm:w-[460px] shrink-0 flex flex-col justify-between rounded-3xl overflow-hidden border border-pink/35 bg-black group shadow-[0_20px_50px_rgba(40,5,40,0.6)] relative snap-start">
          <div className="relative h-[300px] w-full overflow-hidden">
            <img
              src={ASSET_MANIFEST.products.divaTop}
              alt="Dhrisni scissors craft"
              className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-pink/40 text-pink text-[10px] font-mono uppercase">
              SCISSORS & REBELLION ✂️
            </div>
          </div>

          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-pink tracking-widest uppercase mb-1 block">
                THE ORIGIN // RESTRICTION INTO DRIP
              </span>
              <h4 className="text-xl font-spartan font-black uppercase text-white mb-2 leading-tight">
                Forbidden Fits Turned Into Haute Armor
              </h4>
              <p className="text-xs text-silver/85 font-montserrat leading-relaxed">
                Growing up where revealing clothes were strictly off-limits, restriction became the blueprint. When pushed into a corner, Dhrisni turned scissors into paintbrushes and transformed humble cotton into wearable cyber-grunge armor. She ate and left no crumbs.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-silver/60">
              <span>GUWAHATI ATELIER</span>
              <span className="text-pink">100% HAND-SCULPTED</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            CARD 2: THE 4 CRAFT PILLARS
           ======================================================== */}
        <div className="milestone-card w-[90vw] sm:w-[600px] shrink-0 p-8 sm:p-10 rounded-3xl bg-[#120317]/95 border border-pink/35 shadow-[0_20px_50px_rgba(30,2,30,0.8)] flex flex-col justify-between snap-start">
          <div>
            <div className="text-pink text-[10px] font-mono tracking-widest uppercase mb-2">
              CORE ATELIER PILLARS // MATERIAL PURITY
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white mb-6">
              REJECTING CORPORATE MINIMALISM
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ATELIER_PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.num}
                    className="p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-pink/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-pink font-bold">PILLAR {pillar.num}</span>
                      <IconComponent className="w-4 h-4 text-pink" />
                    </div>
                    <h5 className="text-sm font-spartan font-bold text-white mb-1 uppercase">{pillar.title}</h5>
                    <p className="text-[11px] text-silver/80 font-montserrat leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] font-mono text-silver/60 pt-6 border-t border-white/10 uppercase tracking-widest mt-6">
            ✦ NO AI GENERATION ✦ ZERO MASS-PRODUCTION ✦ ALL HAND-CRAFTED
          </p>
        </div>

        {/* ========================================================
            CARD 3: ATELIER ARCHIVE SHOWCASE
           ======================================================== */}
        <div className="milestone-card w-[90vw] sm:w-[620px] shrink-0 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-black via-[#16021d] to-black border border-pink/35 shadow-[0_20px_50px_rgba(30,2,30,0.8)] flex flex-col justify-between snap-start">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-pink text-[10px] font-mono tracking-widest uppercase">
                AUTHENTIC ATELIER ARTIFACTS
              </span>
              <span className="text-xs font-mono text-silver/60">5 LOOKS SHOWN</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white mb-6">
              THE GRAILS IN DETAIL
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SCATTERED_PICTURES.slice(0, 3).map((pic) => (
                <div key={pic.id} className="rounded-2xl overflow-hidden border border-white/10 bg-black group relative">
                  <div className="aspect-[4/5] w-full overflow-hidden">
                    <img
                      src={pic.image}
                      alt={pic.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2.5 bg-black/90">
                    <span className="text-[9px] font-mono text-pink block truncate">{pic.tag}</span>
                    <span className="text-xs font-spartan font-bold text-white block truncate">{pic.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-montserrat text-silver/80">Commission your bespoke size anytime</span>
            <button
              onClick={() => {
                playSound('baddie_alert');
                const el = document.getElementById('custom');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-full bg-pink text-black font-spartan font-black text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              COMMISSION NOW ↗
            </button>
          </div>
        </div>

        {/* ========================================================
            CARD 4: GUWAHATI WOMEN ARTISANS EMPOWERMENT
           ======================================================== */}
        <div className="milestone-card w-[85vw] sm:w-[480px] shrink-0 p-8 sm:p-10 rounded-3xl bg-[#140217]/95 border border-pink/35 shadow-[0_20px_50px_rgba(30,2,30,0.8)] flex flex-col justify-between snap-start">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink/15 border border-pink/40 text-pink text-[10px] font-mono uppercase mb-4">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>ETHICAL EMPOWERMENT</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white mb-4">
              WOMEN OF GUWAHATI
            </h3>

            <p className="text-silver/85 text-xs sm:text-sm font-montserrat leading-relaxed mb-4">
              Fast fashion exploits labor for shareholder greed. AVZ rejects that entirely. We train local women in Guwahati, paying living wages and celebrating their craftsmanship as true couture artists.
            </p>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-pink space-y-1">
              <div>✦ Direct atelier oversight by Dhrisni</div>
              <div>✦ Ethical living wages & creative dignity</div>
              <div>✦ Hand-woven chainmail & soldered circuits</div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-silver/60">
            <span>RUKMINIGAON, GUWAHATI</span>
            <span className="text-pink">781006</span>
          </div>
        </div>
      </div>
    </section>
  );
}
