import { useModalScrollLock } from '../utils/modalScrollLock';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, ChevronRight, ChevronLeft, Film, ExternalLink, X } from 'lucide-react';
import DataRain from '@/components/ui/data-rain';
import { playSound } from '../utils/audio';

export function parseVimeoEmbed(url) {
  if (!url) return null;

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

  // Extract unlisted privacy hash (?h=... or &h=... or vimeo.com/12345/abcdef)
  let hashParam = '';
  const hashQueryMatch = url.match(/[?&]h=([a-z0-9]+)/i);
  const slashHashMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)\/([a-z0-9]{8,14})/i);
  if (hashQueryMatch) {
    hashParam = `&h=${hashQueryMatch[1]}`;
  } else if (slashHashMatch) {
    hashParam = `&h=${slashHashMatch[2]}`;
  }

  // Already player.vimeo.com URL - always fixed muted=1&api=1 to prevent reloads on mute toggle
  if (url.includes('player.vimeo.com/video/')) {
    const idMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/);
    if (idMatch) {
      return {
        type: 'vimeo',
        src: `https://player.vimeo.com/video/${idMatch[1]}?autoplay=1&loop=1&muted=1&background=1&autopause=0&controls=0&api=1${hashParam}${timeHash}`
      };
    }
  }

  // Standard vimeo.com/123456789 or channel/group/video URL
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/);
  if (match && match[3]) {
    return {
      type: 'vimeo',
      src: `https://player.vimeo.com/video/${match[3]}?autoplay=1&loop=1&muted=1&background=1&autopause=0&controls=0&api=1${hashParam}${timeHash}`
    };
  }

  return { type: 'unknown', src: url };
}

// Curated authentic default reels (overridden instantly when edited in Admin Panel)
// All reels use 9:16 vertical video format with dedicated Vimeo adaptive streams
const DEFAULT_REELS = [
  {
    id: 'reel-01',
    title: 'Chainmail Top & Leg Warmers',
    subtitle: 'Fluid handcrafted stainless steel chainmail in motion',
    vimeo_url: 'https://vimeo.com/1243097495/3c90e1325e',
    fallback_video: 'https://player.vimeo.com/video/1243097495?h=3c90e1325e&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
    poster: '/assets/look_chainmail_armor.jpg',
    tag: 'RUNWAY'
  },
  {
    id: 'reel-02',
    title: 'Sculptural Metal Bodice',
    subtitle: 'Heavy hardware and contoured metal plates',
    vimeo_url: 'https://vimeo.com/1243095627/80fef24f4b',
    fallback_video: 'https://player.vimeo.com/video/1243095627?h=80fef24f4b&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
    poster: '/assets/look_spike_bodice.jpg',
    tag: 'STUDIO'
  },
  {
    id: 'reel-03',
    title: 'Cybernetic Armor Runway',
    subtitle: 'Intricate circuit tracing and tactile hardware detail',
    vimeo_url: 'https://vimeo.com/1243095629/47f3f9c6c6',
    fallback_video: 'https://player.vimeo.com/video/1243095629?h=47f3f9c6c6&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
    poster: '/assets/product_diva_top.jpg',
    tag: 'ATELIER'
  },
  {
    id: 'reel-04',
    title: 'Avant-Garde Studio Fitting',
    subtitle: 'Experimental silhouettes sculpted to the body',
    vimeo_url: 'https://vimeo.com/1243095630/e6e88578e0',
    fallback_video: 'https://player.vimeo.com/video/1243095630?h=e6e88578e0&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
    poster: '/assets/product_reworked_jacket.jpg',
    tag: 'FITTING'
  },
  {
    id: 'reel-05',
    title: 'Wearable Art Showcase',
    subtitle: '1-of-1 handmade creations from our Guwahati studio',
    vimeo_url: 'https://vimeo.com/1243095628/95ae4f7ecd',
    fallback_video: 'https://player.vimeo.com/video/1243095628?h=95ae4f7ecd&autoplay=1&loop=1&autopause=0&title=0&byline=0&portrait=0',
    poster: '/assets/editorial_hero_portrait.jpg',
    tag: '1-OF-1 ARCHIVE'
  }
];

function AutoplayingReels({ cmsReels, onSelectProduct, onRequestCustom, onScrollToSection }) {
  const containerRef = useRef(null);
  const iframeRefs = useRef({});
  const videoRefs = useRef({});
  const [reels, setReels] = useState(DEFAULT_REELS);
  const [headline, setHeadline] = useState('SEE THEM MOVE');
  const [subheadline, setSubheadline] = useState('Real videos of our handmade pieces. Tap any video to watch.');
  // Single active audio reel ensures ONLY ONE reel ever plays sound at a time
  const [activeAudioReelId, setActiveAudioReelId] = useState(null);
  const [loadedReels, setLoadedReels] = useState({});
  const [activeReelModal, setActiveReelModal] = useState(null);
  useModalScrollLock(Boolean(activeReelModal));
  const sectionRef = useRef(null);

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

  // Seamless in-place audio toggle with strict mutual audio exclusion (only 1 audio at a time)
  const toggleMute = (reelId, e) => {
    e.stopPropagation();
    playSound('snap');

    const isCurrentlyActive = activeAudioReelId === reelId;

    if (isCurrentlyActive) {
      // Mute active reel
      const ifr = iframeRefs.current[reelId];
      if (ifr?.contentWindow) {
        try {
          ifr.contentWindow.postMessage(JSON.stringify({ method: 'setVolume', value: 0 }), '*');
          ifr.contentWindow.postMessage(JSON.stringify({ method: 'setMuted', value: true }), '*');
        } catch (err) {}
      }
      const vid = videoRefs.current[reelId];
      if (vid) vid.muted = true;

      setActiveAudioReelId(null);
    } else {
      // 1. Mute any previously active reel first
      if (activeAudioReelId) {
        const prevIfr = iframeRefs.current[activeAudioReelId];
        if (prevIfr?.contentWindow) {
          try {
            prevIfr.contentWindow.postMessage(JSON.stringify({ method: 'setVolume', value: 0 }), '*');
            prevIfr.contentWindow.postMessage(JSON.stringify({ method: 'setMuted', value: true }), '*');
          } catch (err) {}
        }
        const prevVid = videoRefs.current[activeAudioReelId];
        if (prevVid) prevVid.muted = true;
      }

      // 2. Unmute newly selected reel
      const targetIfr = iframeRefs.current[reelId];
      if (targetIfr?.contentWindow) {
        try {
          targetIfr.contentWindow.postMessage(JSON.stringify({ method: 'setVolume', value: 1 }), '*');
          targetIfr.contentWindow.postMessage(JSON.stringify({ method: 'setMuted', value: false }), '*');
        } catch (err) {}
      }
      const targetVid = videoRefs.current[reelId];
      if (targetVid) targetVid.muted = false;

      setActiveAudioReelId(reelId);
    }
  };

  const scrollRail = (direction) => {
    if (!containerRef.current) return;
    playSound('snap');
    const scrollAmount = direction === 'left' ? -340 : 340;
    containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="reels" className="relative w-full bg-[#050508] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-t border-white/10 overflow-hidden select-none">
      {/* Background Cyber Rain Sparkles Layer with enhanced atmospheric intensity */}
      <div className="absolute inset-0 pointer-events-none opacity-70 z-0">
        <DataRain
          fullscreen={false}
          count={240}
          flowSpeed={0.8}
          palette={{
            calm: '#22e6ff',
            mid: '#8a5cff',
            hot: '#ff3d9a'
          }}
        />
      </div>

      {/* Header with Simple, Clear Language */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
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
      <div className="relative z-10 w-full">
        <div
          ref={containerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reels.map((reel, idx) => {
            const hasAudioActive = activeAudioReelId === reel.id;
            const parsed = parseVimeoEmbed(reel.vimeo_url || reel.fallback_video);
            const isLoaded = loadedReels[reel.id];

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
                  {/* Poster smoothly fades away once video is loaded - NEVER flashes during mute toggle */}
                  {reel.poster && (
                    <img
                      src={reel.poster}
                      alt={reel.title}
                      decoding="async"
                      className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${
                        isLoaded ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  )}
                  {parsed?.type === 'vimeo' ? (
                    <iframe
                      ref={(el) => {
                        iframeRefs.current[reel.id] = el;
                      }}
                      src={parsed.src}
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none border-0 scale-[1.05]"
                      allow="autoplay; fullscreen; picture-in-picture"
                      title={reel.title}
                      onLoad={() => {
                        setTimeout(() => {
                          setLoadedReels((prev) => ({ ...prev, [reel.id]: true }));
                        }, 300);
                      }}
                    />
                  ) : (
                    <video
                      ref={(el) => {
                        videoRefs.current[reel.id] = el;
                      }}
                      src={reel.fallback_video || parsed?.src}
                      poster={reel.poster}
                      autoPlay
                      loop
                      muted={!hasAudioActive}
                      playsInline
                      className="w-full h-full object-cover"
                      onLoadedData={() => {
                        setLoadedReels((prev) => ({ ...prev, [reel.id]: true }));
                      }}
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
                    className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      hasAudioActive
                        ? 'bg-pink border-pink text-black ring-2 ring-pink/50 scale-105'
                        : 'bg-black/70 border-white/20 text-white hover:text-pink hover:border-pink'
                    }`}
                    title={hasAudioActive ? 'Sound off' : 'Sound on'}
                  >
                    {hasAudioActive ? <Volume2 className="w-3.5 h-3.5 text-black" /> : <VolumeX className="w-3.5 h-3.5" />}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 animate-fade-in overscroll-contain"
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
                <button
                  type="button"
                  onClick={() => {
                    playSound('snap');
                    setActiveReelModal(null);
                    if (onScrollToSection) {
                      onScrollToSection('shop');
                    } else {
                      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-wider text-center hover:bg-neutral-200 transition-all shadow-lg cursor-pointer"
                >
                  SHOP NOW ↗
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playSound('snap');
                    setActiveReelModal(null);
                    if (onRequestCustom) {
                      onRequestCustom(activeReelModal.title);
                    } else if (onScrollToSection) {
                      onScrollToSection('custom');
                    } else {
                      document.getElementById('custom')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-black/60 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider text-center hover:border-pink transition-all cursor-pointer"
                >
                  CUSTOM ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


export default React.memo(AutoplayingReels);
