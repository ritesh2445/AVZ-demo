'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Maximize2, Sparkles, ChevronRight, ChevronLeft, Film, ExternalLink } from 'lucide-react';
import DataRain from '@/components/ui/data-rain';

export function parseVimeoEmbed(url, muted = true) {
  if (!url) return null;
  const isMuted = muted ? '1' : '0';

  // Direct MP4 or video file
  if (url.endsWith('.mp4') || url.endsWith('.webm') || url.startsWith('/assets/')) {
    return { type: 'video', src: url };
  }

  // Already player.vimeo.com URL
  if (url.includes('player.vimeo.com/video/')) {
    const clean = url.split('?')[0];
    return {
      type: 'vimeo',
      src: `${clean}?autoplay=1&loop=1&muted=${isMuted}&background=1&autopause=0&transparent=1`
    };
  }

  // Standard vimeo.com/123456789 or channel/group URL
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
  if (match && match[3]) {
    return {
      type: 'vimeo',
      src: `https://player.vimeo.com/video/${match[3]}?autoplay=1&loop=1&muted=${isMuted}&background=1&autopause=0&transparent=1`
    };
  }

  return { type: 'unknown', src: url };
}

// Default editorial runway & studio reels
const DEFAULT_REELS = [
  {
    id: 'reel-01',
    title: 'The Motherboard Corset in Motion',
    subtitle: 'Cybernetic armor sculpted to body contours',
    vimeo_url: 'https://vimeo.com/824804225',
    fallback_video: '/assets/Desktop view.MP4',
    poster: '/assets/editorial_hero_portrait.jpg',
    tag: 'Motherboard Top',
    productLink: '#shop'
  },
  {
    id: 'reel-02',
    title: '72 Solid Spikes Motorcycle Shrug',
    subtitle: 'High-contrast heavy hardware on reclaimed biker leather',
    vimeo_url: 'https://vimeo.com/76979871',
    fallback_video: '/assets/mobile view.mp4',
    poster: '/assets/archive_bralette.jpg',
    tag: 'Spiked Moto',
    productLink: '#shop'
  },
  {
    id: 'reel-03',
    title: 'Tactile "CTRL+Z" Keycap Choker',
    subtitle: 'Mechanical keys that click with every movement',
    vimeo_url: 'https://vimeo.com/1084537',
    fallback_video: '/assets/Desktop view.MP4',
    poster: '/assets/beaded_bralette.jpg',
    tag: 'Keycap Choker',
    productLink: '#shop'
  },
  {
    id: 'reel-04',
    title: 'Guwahati Studio Craft & Linkwork',
    subtitle: 'Pure human artistry — over 1,200 hand-threaded stainless rings',
    vimeo_url: 'https://vimeo.com/824804225',
    fallback_video: '/assets/mobile view.mp4',
    poster: '/assets/chainmail_armor.jpg',
    tag: 'Studio Behind The Scenes',
    productLink: '#custom'
  }
];

export default function AutoplayingReels({ cmsReels, onSelectProduct, onRequestCustom }) {
  const containerRef = useRef(null);
  const [reels, setReels] = useState(DEFAULT_REELS);
  const [headline, setHeadline] = useState('IN MOTION // RUNWAY & REELS');
  const [subheadline, setSubheadline] = useState('Watch each piece move in real life. Behind-the-scenes, runway motion, and handmade detailing.');
  const [mutedStates, setMutedStates] = useState({});
  const [activeReelModal, setActiveReelModal] = useState(null);

  // Sync CMS Data if available
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
    setMutedStates((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  const scrollRail = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="reels" className="relative w-full bg-[#050508] py-20 sm:py-28 px-4 sm:px-8 lg:px-12 border-t border-white/10 overflow-hidden">
      {/* Background Cyber Rain Ambient Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <DataRain
          fullscreen={false}
          count={1400}
          flowSpeed={0.85}
          palette={{
            calm: '#22e6ff',
            mid: '#8a5cff',
            hot: '#ff3d9a'
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/10 border border-pink/30 text-pink text-[11px] font-mono uppercase tracking-widest mb-3">
            <Film className="w-3.5 h-3.5 text-pink animate-pulse" />
            <span>Live Video Gallery</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-cinzel font-black tracking-tight text-white uppercase">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-montserrat mt-2 max-w-2xl leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollRail('left')}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollRail('right')}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reels Carousel Rail */}
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
                onClick={() => setActiveReelModal(reel)}
                className="group relative flex-none w-[270px] sm:w-[310px] md:w-[330px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl snap-start cursor-pointer transition-all duration-300 hover:border-pink/60 hover:shadow-[0_0_30px_rgba(244,194,194,0.2)] hover:-translate-y-1"
              >
                {/* Video Player / Vimeo Embed */}
                <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-none">
                  {parsed?.type === 'vimeo' ? (
                    <iframe
                      src={parsed.src}
                      className="w-[140%] h-[140%] -ml-[20%] -mt-[20%] object-cover pointer-events-none border-0"
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none transition-opacity group-hover:opacity-80" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-pink tracking-wider uppercase">
                    {reel.tag || 'Runway'}
                  </span>
                  <button
                    onClick={(e) => toggleMute(reel.id, e)}
                    className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer"
                    title={isMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-pink" />}
                  </button>
                </div>

                {/* Center Expand Icon Hover */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-pink/90 text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom Information */}
                <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                  <h3 className="text-base sm:text-lg font-cinzel font-bold text-white leading-snug drop-shadow-md">
                    {reel.title}
                  </h3>
                  {reel.subtitle && (
                    <p className="text-[11px] sm:text-xs text-neutral-300 font-montserrat mt-1 line-clamp-2 leading-relaxed">
                      {reel.subtitle}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-pink uppercase tracking-widest">
                    <span>Tap to expand full screen</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Reel Cinema Modal */}
      {activeReelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-6"
          onClick={() => setActiveReelModal(null)}
        >
          <div
            className="relative w-full max-w-md aspect-[9/16] max-h-[90vh] bg-black rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Video Player */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              {parseVimeoEmbed(activeReelModal.vimeo_url || activeReelModal.fallback_video, false)?.type === 'vimeo' ? (
                <iframe
                  src={parseVimeoEmbed(activeReelModal.vimeo_url || activeReelModal.fallback_video, false)?.src}
                  className="w-[140%] h-[140%] -ml-[20%] -mt-[20%] object-cover border-0"
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
            <div className="relative z-10 p-5 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <span className="px-3 py-1 rounded-full bg-pink/20 border border-pink/40 text-pink text-[11px] font-mono uppercase tracking-wider">
                {activeReelModal.tag || 'AVZ Reel'}
              </span>
              <button
                onClick={() => setActiveReelModal(null)}
                className="w-9 h-9 rounded-full bg-black/70 border border-white/20 text-white hover:text-pink hover:border-pink flex items-center justify-center transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Bottom Details */}
            <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
              <h3 className="text-xl font-cinzel font-bold text-white mb-1">
                {activeReelModal.title}
              </h3>
              <p className="text-xs text-neutral-300 font-montserrat mb-4">
                {activeReelModal.subtitle}
              </p>
              <div className="flex gap-2">
                <a
                  href="#shop"
                  onClick={() => setActiveReelModal(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-pink text-black font-spartan font-black text-xs uppercase tracking-wider text-center hover:bg-white transition-all shadow-lg"
                >
                  Explore in Store ↗
                </a>
                <a
                  href="#custom"
                  onClick={() => setActiveReelModal(null)}
                  className="py-3 px-4 rounded-xl bg-black/60 border border-white/20 text-white font-spartan font-bold text-xs uppercase tracking-wider text-center hover:border-pink transition-all"
                >
                  Custom Order
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
