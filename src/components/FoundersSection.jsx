import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Scissors, ShieldCheck, Users, Cpu, Flame, MapPin } from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

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
    highlight: 'Zero mass manufacturing. Every piece is an archival 1-of-1 sculptural relic.'
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
    title: 'WOMEN ARTISANS OF THE GUWAHATI ATELIER',
    subtitle: 'Mentorship, independence, and North-East craftsmanship',
    icon: Users,
    summary:
      'Our studio is rooted in Guwahati, Assam. Dhrisni personally trains and mentors local women artisans in wiring, structural corsetry, and heavy hardware sculpting, creating skilled economic independence through avant-garde fashion.',
    highlight: 'Deeply empowering North-Eastern women craftsmanship on a global fashion stage.'
  }
];

export default function FoundersSection({ onScrollToSection, onOpenSquadModal, cmsFounders }) {
  const [activePillar, setActivePillar] = useState(0);

  const founderName = cmsFounders?.founder_name || 'Dhrisni';
  const alias = cmsFounders?.alias || 'Dhristroyer';
  const quote = cmsFounders?.quote || 'Building wearable art with my own two hands is the ultimate rebellion.';
  const portraitImg = cmsFounders?.portrait_image || ASSET_MANIFEST.editorialHero || '/assets/editorial_hero_portrait.jpg';

  return (
    <section id="about" className="relative w-full overflow-hidden">
      {/* =========================================================================
          CHAPTER 1: THE MONOLITH EXHIBITION (THE WHITE GALLERY)
          Clean, calm white background. DHRISNI SVG logotype fitted perfectly in the
          exact center of the site. Zero overlapping elements. Pristine museum space.
          ========================================================================= */}
      <div className="w-full bg-[#ffffff] text-black py-20 sm:py-28 md:py-36 px-4 sm:px-8 relative overflow-hidden flex flex-col items-center justify-center border-b border-zinc-200">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Subtle Curated Gallery Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-black/15 bg-black/5 text-[10px] font-mono tracking-[0.28em] text-zinc-600 uppercase mb-8 sm:mb-12">
            <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
            <span>FOUNDER & CREATIVE DIRECTOR</span>
          </div>

          {/* THE SVG LOGOTYPE — FITTED PERFECTLY IN THE CENTER WITH ZERO OVERLAP */}
          <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl flex items-center justify-center py-2 sm:py-6">
            <img
              src="/assets/dhrisni_name.svg"
              alt="DHRISNI"
              className="w-full h-auto max-h-[160px] sm:max-h-[240px] md:max-h-[300px] object-contain select-none transition-transform duration-700 ease-out hover:scale-[1.02]"
              draggable={false}
            />
          </div>

          {/* Minimalist Gallery Provenance Subtitle (Clean, Calm, Below the Artwork) */}
          <div className="flex flex-col items-center gap-2 mt-8 sm:mt-12 text-center">
            <span className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase font-bold" style={{ color: "#09090b" }}>
              DHRISNI • DHRISTROYER
            </span>
            <span className="text-[11px] sm:text-xs font-montserrat uppercase tracking-[0.2em] font-medium" style={{ color: "#52525b" }}>
              THE ARCHITECT OF WEARABLE ART • GUWAHATI, ASSAM
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHAPTER 2: CINEMATIC ATELIER DIMENSION — THE ARTISAN & THE MANIFESTO
          Deep obsidian atmosphere with editorial split-screen, archival portrait,
          and oversized haute-couture quote.
          ========================================================================= */}
      <div className="atelier-dark-canvas relative w-full bg-[#0a0a0f] text-white py-20 sm:py-28 md:py-36 px-4 sm:px-8 lg:px-12 border-t border-white/10 selection:bg-pink selection:text-black">
        {/* Subtle Ambient Spatial Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_20%_30%,rgba(230,60,255,0.07),transparent_70%)]" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_40%_at_80%_70%,rgba(47,184,166,0.05),transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Breadcrumb & Coordinates Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-12 sm:mb-16 border-b border-white/10 gap-3">
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-pink uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
              <span style={{ color: "#f472b6" }}>✦ ATELIER MANIFESTO // 001</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-pink" />
              <span>26.1445° N, 91.7362° E • GUWAHATI, ASSAM</span>
            </div>
          </div>

          {/* Asymmetric Split Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left 5 Cols: Editorial Archival Portrait with Museum Frame */}
            <div className="lg:col-span-5 relative group">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl overflow-hidden border border-white/20 bg-black/90 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
                <img
                  src={portraitImg}
                  alt={founderName}
                  className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

                {/* Corner Coordinates & Archival Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[9px] font-mono tracking-widest text-white uppercase font-bold">
                    ARCHIVE REEL // DH-01
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-mono tracking-widest text-pink block font-bold uppercase">
                      MASTER ARTISAN
                    </span>
                    <h3 className="text-lg font-mono font-bold text-white uppercase">
                      {founderName} ({alias})
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 border border-white/20 rounded-full px-2.5 py-0.5 bg-black/60">
                    GUWAHATI
                  </span>
                </div>
              </div>

              {/* Decorative Subtle Background Frame Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-pink/20 via-transparent to-purple-500/10 blur-xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Right 7 Cols: The Quote & The Story */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 sm:space-y-8">
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-pink uppercase font-bold block mb-3">
                  ARTISAN PHILOSOPHY
                </span>
                <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-cinzel font-bold leading-tight tracking-wide drop-shadow-md" style={{ color: "#ffffff" }}>
                  "{quote}"
                </blockquote>
              </div>

              <div className="space-y-4 font-montserrat text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: "#d4d4d8" }}>
                <p>
                  Known to the world as <strong className="font-mono font-bold" style={{ color: "#ffffff" }}>Dhrisni</strong> or{' '}
                  <strong className="font-mono font-bold" style={{ color: "#f472b6" }}>@Dhristroyer</strong>, she wears many titles—actor, model, creator,
                  and designer. But strip all that away, and at her absolute core, she is an artisan who refuses cookie-cutter minimalism.
                </p>
                <p>
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg active:scale-95 cursor-pointer group"
                >
                  <span>COMMISSION WITH DHRISNI</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href="#shop"
                  onClick={() => {
                    playSound('snap');
                    onScrollToSection?.('shop');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-pink/80 bg-black/60 hover:bg-white/5 text-white font-mono text-xs tracking-widest uppercase transition-all cursor-pointer"
                >
                  <span>EXPLORE 1-OF-1 RELICS</span>
                </a>
              </div>
            </div>
          </div>

          {/* =========================================================================
              CHAPTER 3: THE FOUR PILLARS OF DHRISTROYER (INTERACTIVE DOSSIER)
              ========================================================================= */}
          <div className="mt-24 sm:mt-32 pt-16 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 text-left">
              <div>
                <span className="text-[10px] font-mono tracking-[0.28em] text-pink uppercase font-bold block mb-1">
                  THE ARCHIVAL DOSSIER
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-mono font-bold uppercase tracking-wider" style={{ color: "#ffffff" }}>
                  FOUR PILLARS OF AVZ ATELIER
                </h3>
              </div>
              <p className="text-xs font-mono text-zinc-400 tracking-wider">
                SELECT A PILLAR TO INSPECT PHILOSOPHY
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
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#2a0833] to-[#120317] border-pink shadow-[0_0_20px_rgba(244,114,182,0.3)]'
                        : 'bg-[#0f0f15] border-white/10 hover:border-white/30 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-pink' : 'text-zinc-500'}`}>
                        {pillar.id}
                      </span>
                      <IconComponent className={`w-4 h-4 ${isSelected ? 'text-pink' : 'text-zinc-500'}`} />
                    </div>
                    <span className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wider line-clamp-2 leading-snug">
                      {pillar.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Showcase Card */}
            <div className="p-6 sm:p-10 rounded-3xl border border-white/15 bg-gradient-to-br from-[#120318]/90 via-[#0a0a0f]/95 to-black text-left shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-pink font-mono text-xs font-bold tracking-widest uppercase">
                    PILLAR {MANIFESTO_PILLARS[activePillar].id} • SPECIFICATION
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-wider mb-2" style={{ color: "#ffffff" }}>
                  {MANIFESTO_PILLARS[activePillar].title}
                </h4>
                <p className="text-xs sm:text-sm font-mono tracking-wider uppercase mb-5" style={{ color: "#a1a1aa" }}>
                  {MANIFESTO_PILLARS[activePillar].subtitle}
                </p>
                <p className="text-sm sm:text-base font-montserrat leading-relaxed mb-6" style={{ color: "#e4e4e7" }}>
                  {MANIFESTO_PILLARS[activePillar].summary}
                </p>
                <div className="p-4 rounded-xl border border-pink/30 bg-pink/5 text-xs sm:text-sm font-mono text-pink tracking-wide">
                  ✦ {MANIFESTO_PILLARS[activePillar].highlight}
                </div>
              </div>

              {/* Ambient Watermark Icon */}
              <div className="absolute right-6 -bottom-6 opacity-5 pointer-events-none hidden md:block">
                {React.createElement(MANIFESTO_PILLARS[activePillar].icon, { className: 'w-64 h-64 text-white' })}
              </div>
            </div>

            {/* =========================================================================
                CHAPTER 4: PROVENANCE METRICS COUNTER
                ========================================================================= */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-16 pt-12 border-t border-white/10 text-center">
              <div>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-mono font-bold mb-1" style={{ color: "#ffffff" }}>
                  200+
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-[0.2em] uppercase">
                  1-OF-1 BUILDS SCULPTED
                </span>
              </div>

              <div>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-mono font-bold mb-1" style={{ color: "#f472b6" }}>
                  1,500+
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-[0.2em] uppercase">
                  CIRCUIT BOARDS RECLAIMED
                </span>
              </div>

              <div>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-white mb-1">
                  GUWAHATI
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-[0.2em] uppercase">
                  ASSAM ATELIER BASE
                </span>
              </div>

              <div>
                <span className="block text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-pink mb-1">
                  100%
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-[0.2em] uppercase">
                  HAND-SCULPTED BY DHRISNI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
