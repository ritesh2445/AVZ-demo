'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, ChevronRight, ChevronLeft, Film, ExternalLink, X } from 'lucide-react';
import DataRain from '@/components/ui/data-rain';
import { playSound } from '../utils/audio';

export function parseVimeoEmbed(url, muted = true) {
  if (!url) return null;
  const isMuted = muted ? '1' : '0';

  // Direct MP4 or video file
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.startsWith('/assets/')) {
    return { type: 'video', src: url };
  }

  // Preserve timestamp if present (#t=... or &t=...)
  let timeHash = '';
  if (url.includes('#t=')) {
    timeHash = '#t=' + url.split('#t=')[1];
  } else if (url.includes('&t=')) {
    timeHash = '#t=' + url.split('&t=')[1].split('&')[0];
  }

  // Already player.vimeo.com URL
  if (url.includes('player.vimeo.com/video/')) {
    const clean = url.split('?')[0].split('#')[0];
    return {
      type: 'vimeo',
      src: `${clean}?autoplay=1&loop=1&muted=${isMuted}&background=1&autopause=0&controls=0${timeHash}`
    };
  }

  // Standard vimeo.com/123456789 or channel/group URL
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
  if (match && match[3]) {
    return {
      type: 'vimeo',
      src: `https://player.vimeo.com/video/${match[3]}?autoplay=1&loop=1&muted=${isMuted}&background=1&autopause=0&controls=0${timeHash}`
    };
  }

  return { type: 'unknown', src: url };
}

// Curated authentic default reels (overridden instantly when edited in Admin Panel)
// All reels use 9:16 vertical video format with staggered loop timestamps
const DEFAULT_REELS = [
  {
    id: 'reel-01',
    title: 'The Motherboard Corset',
    subtitle: 'Cybernetic armor sculpted to body contours',
    vimeo_url: 'https://vimeo.com/1239586843#t=0s',
    fallback_video: 'https://player.vimeo.com/video/1239586843?autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0#t=0s',
    poster: '/assets/product_diva_top.jpg',
    tag: 'RUNWAY'
  },
  {
    id: 'reel-02',
    title: 'Solid Spikes Shrug',
    subtitle: 'Heavy hardware on reclaimed biker leather',
    vimeo_url: 'https://vimeo.com/1239586843#t=8s',
    fallback_video: 'https://player.vimeo.com/video/1239586843?autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0#t=8s',
    poster: '/assets/look_spike_bodice.jpg',
    tag: 'STUDIO'
  },
  {
    id: 'reel-03',
    title: 'Stainless Steel Chainmail',
    subtitle: 'Over 1,200 hand-linked rings in fluid motion',
    vimeo_url: 'https://vimeo.com/1239586843#t=16s',
    fallback_video: 'https://player.vimeo.com/video/1239586843?autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0#t=16s',
    poster: '/assets/look_chainmail_armor.jpg',
    tag: 'CLOSE UP'
  },
  {
    id: 'reel-04',
    title: 'Reworked Denim Armor',
    subtitle: 'Asymmetric panels with adjustable cables',
    vimeo_url: 'https://vimeo.com/1239586843#t=24s',
    fallback_video: 'https://player.vimeo.com/video/1239586843?autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0#t=24s',
    poster: '/assets/product_reworked_jacket.jpg',
    tag: 'DETAILS'
  }
];

export default function AutoplayingReels({ cmsReels, onSelectProduct, onRequestCustom }) {
  const containerRef = useRef(null);
  const [reels, setReels] = useState(DEFAULT_REELS);
  const [headline, setHeadline] = useState('SEE THEM MOVE');
  const [subheadline, setSubheadline] = useState('Real videos of our handmade pieces. Tap any video to watch.');
  const [mutedStates, setMutedStates] = useState({});
  const [activeReelModal, setActiveReelModal] = useState(null);

  // Sync CMS Data if available from Admin Panel
  useEffect(() => {
    if (cmsReels?.data) {
      try {
        const parsed = typeof cmsReels.data === 'string' ? JSON.parse(cmsReels.data) : cmsReels.data;
        if (parsed.headline) setHeadline(parsed.headline);
        if (parsed.subheadline) setSubheadline(parsed.subheadline);
        if (Array.isArray(parsed.reels) && parsed.reels.length > 0) {
          setReels(parsed.reels);
        }
      } catch (e) {
        console.error('Error parsing cmsReels:', e);
      }
    }
  }, [cmsReels]);

  const toggleMute = (reelId, e) => {
    e.stopPropagation();
    playSound('snap');
    setMutedStates((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  const scrollRail = (direction) => {
    if (!containerRef.current) return;
    playSound('snap');
    const scrollAmount = direction === 'left' ? -340 : 340;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="reels" className="relative w-full bg-[#050508] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-t border-white/10 overflow-hidden select-none">
      {/* Background Cyber Rain Ambient Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
        <DataRain
          fullscreen={false}
          count={1200}
          flowSpeed={0.8}
          palette={{
            calm: '#22e6ff',
            mid: '#8a5cff',
            hot: '#ff3d9a'
          }}
        />
      </div>

      {/* Header with Simple, Clear Language */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/10 border border-pink/30 text-pink text-[11px] font-mono uppercase tracking-widest mb-3 shadow-sm">
            <Film className="w-3.5 h-3.5 text-pink animate-pulse" />
            <span>VIDEOS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase leading-tight">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-mono mt-2 max-w-xl leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* Floating Scroll Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollRail('left')}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/70 backdrop-blur-md text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollRail('right')}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/70 backdrop-blur-md text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floating Frameless Reels Carousel Rail */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          ref={containerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reels.map((reel, idx) => {
            const isMuted = mutedStates[reel.id] ?? true;
            const parsed = parseVimeoEmbed(reel.vimeo_url || reel.fallback_video, isMuted);

            return (
              <div
                key={reel.id || idx}
                onClick={() => {
                  playSound('pip');
                  setActiveReelModal(reel);
                }}
                className="group relative flex-none w-[260px] sm:w-[290px] md:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden ring-1 ring-white/10 group-hover:ring-pink/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_25px_60px_rgba(244,194,194,0.25)] snap-start cursor-pointer transition-all duration-300 hover:-translate-y-2.5 bg-black"
              >
                {/* Poster Fallback */}
                {reel.poster && !parsed && (
                  <img
                    src={reel.poster}
                    alt={reel.title}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                )}

                {/* Frameless Floating Video Player / Vimeo Embed */}
                <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
                  {parsed?.type === 'vimeo' ? (
                    <iframe
                      src={parsed.src}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none border-0 scale-[1.05]"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={reel.title}
                    />
                  ) : (
                    <video
                      src={reel.fallback_video || parsed?.src}
                      poster={reel.poster}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Glassmorphic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/30 pointer-events-none transition-opacity group-hover:opacity-85" />

                {/* Floating Top Tag & Sound Pill */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-pink tracking-wider uppercase font-bold">
                    {reel.tag || 'VIDEO'}
                  </span>
                  <button
                    onClick={(e) => toggleMute(reel.id, e)}
                    className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer shadow-md"
                    title={isMuted ? 'Sound on' : 'Sound off'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-pink" />}
                  </button>
                </div>

                {/* Center Hover Tap Indicator */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom Floating Info with Simple Language */}
                <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none text-left">
                  <h3 className="text-base sm:text-lg font-mono font-bold text-white uppercase leading-snug drop-shadow-md">
                    {reel.title}
                  </h3>
                  {reel.subtitle && (
                    <p className="text-[11px] sm:text-xs text-neutral-300 font-mono mt-1 line-clamp-2 leading-relaxed">
                      {reel.subtitle}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono text-pink uppercase tracking-widest font-semibold">
                    <span>TAP TO WATCH</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Frameless Floating Reel Modal */}
      {activeReelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveReelModal(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[88vh] bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Video Player */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {parseVimeoEmbed(activeReelModal.vimeo_url || activeReelModal.fallback_video, false)?.type === 'vimeo' ? (
                <iframe
                  src={parseVimeoEmbed(activeReelModal.vimeo_url || activeReelModal.fallback_video, false)?.src}
                  className="absolute inset-0 w-full h-full object-cover border-0 scale-[1.05]"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={activeReelModal.title}
                />
              ) : (
                <video
                  src={activeReelModal.fallback_video || activeReelModal.vimeo_url}
                  autoPlay
                  loop
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Modal Header */}
            <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <span className="px-3 py-1 rounded-full bg-pink/20 border border-pink/40 text-pink text-[10px] font-mono uppercase tracking-wider font-bold">
                {activeReelModal.tag || 'VIDEO'}
              </span>
              <button
                onClick={() => setActiveReelModal(null)}
                className="w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer shadow-lg"
                aria-label="Close video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Bottom Actions */}
            <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/85 to-transparent text-left">
              <h3 className="text-lg sm:text-xl font-mono font-bold uppercase text-white mb-1">
                {activeReelModal.title}
              </h3>
              {activeReelModal.subtitle && (
                <p className="text-xs text-neutral-300 font-mono mb-4">
                  {activeReelModal.subtitle}
                </p>
              )}
              <div className="flex gap-2">
                <a
                  href="#shop"
                  onClick={() => setActiveReelModal(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-wider text-center hover:bg-neutral-200 transition-all shadow-lg cursor-pointer"
                >
                  SHOP NOW ↗
                </a>
                <a
                  href="#custom"
                  onClick={() => setActiveReelModal(null)}
                  className="py-3 px-4 rounded-xl bg-black/60 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider text-center hover:border-pink transition-all cursor-pointer"
                >
                  CUSTOM ORDER
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
