import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film
} from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import CinemaReelModal from './CinemaReelModal';
import HeroDustHeadline from './HeroDustHeadline';
import { playSound } from '../utils/audio';

function HeroThreeDimension({ onExploreCatalogue, onScrollToSection, isReady, onOpenTunnel, cmsHero }) {
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(true);

  const [isMobileDevice, setIsMobileDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    return false;
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);

  // Responsive device listener for mobile video switching
  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobileDevice(isMob);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const posterSrc = isMobileDevice ? '/assets/mobile_poster.jpg' : '/assets/desktop_poster.jpg';
  const vimeoId = isMobileDevice ? '1239586843' : '1243094637';
  const vimeoHash = isMobileDevice ? '' : 'f23215a874';

  // Helper to send postMessage commands to Vimeo Player iframe
  // Notify global system that Vimeo hero stream has buffered and started playing
  const notifyHeroVideoReady = () => {
    if (typeof window !== 'undefined') {
      window.__avzHeroVideoReady = true;
      if (typeof window.__onHeroVideoReady === 'function') {
        window.__onHeroVideoReady();
      }
    }
  };

  const postVimeoMessage = (method, value) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        const payload = value !== undefined ? { method, value } : { method };
        iframeRef.current.contentWindow.postMessage(JSON.stringify(payload), '*');
        iframeRef.current.contentWindow.postMessage(payload, '*');
      }
    } catch (e) {
      console.warn('[VIMEO POSTMESSAGE]:', e);
    }
  };

  // Listen to Vimeo Player events to ensure playback begins immediately
  useEffect(() => {
    const handleVimeoMessage = (event) => {
      if (!event.origin.includes('vimeo.com')) return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.event === 'ready') {
          postVimeoMessage('play');
          postVimeoMessage('setVolume', isMuted ? 0 : 1);
          postVimeoMessage('setMuted', isMuted);
          postVimeoMessage('addEventListener', 'play');
          postVimeoMessage('addEventListener', 'timeupdate');
          setVideoLoaded(true);
        } else if (data.event === 'play' || data.event === 'timeupdate') {
          setVideoLoaded(true);
          notifyHeroVideoReady();
        }
      } catch (e) {
        // ignore parse error
      }
    };
    window.addEventListener('message', handleVimeoMessage);
    return () => window.removeEventListener('message', handleVimeoMessage);
  }, [isMuted]);

  // Sync play state with Vimeo Player
  useEffect(() => {
    postVimeoMessage(isPlaying ? 'play' : 'pause');
  }, [isPlaying]);

  // Ensure playback starts immediately when hero becomes visible
  useEffect(() => {
    if (isReady) {
      postVimeoMessage('play');
    }
  }, [isReady]);

  // Sync mute/volume state with Vimeo Player
  useEffect(() => {
    postVimeoMessage('setVolume', isMuted ? 0 : 1);
    postVimeoMessage('setMuted', isMuted);
  }, [isMuted]);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    playSound('pip');
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    postVimeoMessage(nextPlaying ? 'play' : 'pause');
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    playSound(newMuted ? 'toggle_off' : 'toggle_on');
    // Seamless in-place audio cutoff or un-mute without reloading iframe or restarting video
    postVimeoMessage('setVolume', newMuted ? 0 : 1);
    postVimeoMessage('setMuted', newMuted);
    if (!newMuted && !isPlaying) {
      setIsPlaying(true);
      postVimeoMessage('play');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-[100dvh] h-[100dvh] flex items-center justify-center overflow-hidden bg-black select-none cursor-default"
      style={{
        backgroundColor: '#000000',
        background: '#000000'
      }}
    >
      {/* 1. Vimeo Adaptive Bitrate Video Stream with Permanent Poster Canvas Backing */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Permanent first-frame poster canvas: visible instantly on load & during rapid scroll */}
        <img
          src={posterSrc}
          alt="AVZ Hero Master Visual"
          fetchPriority="high"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
          style={{ objectFit: 'cover' }}
        />

        {/* Vimeo Background Video Stream layered directly on top */}
        <iframe
          ref={iframeRef}
          key={`hero-vimeo-${vimeoId}`}
          loading="eager"
          src={`https://player.vimeo.com/video/${vimeoId}?${vimeoHash ? `h=${vimeoHash}&` : ''}autoplay=1&loop=1&muted=1&background=1&autopause=0&controls=0&playsinline=1&title=0&byline=0&portrait=0&api=1&dnt=1`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1] opacity-100"
          style={{
            border: 0,
            width: isMobileDevice ? '100vw' : '177.78vh',
            height: isMobileDevice ? '177.78vw' : '56.25vw',
            minWidth: isMobileDevice ? '56.25vh' : '100vw',
            minHeight: '100dvh'
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          title="AVZ Hero Runway Stream"
          onLoad={() => {
            setVideoLoaded(true);
            postVimeoMessage('addEventListener', 'play');
            postVimeoMessage('addEventListener', 'timeupdate');
            postVimeoMessage('play');
          }}
        />
      </div>

      {/* 1.5 Soft High-Fashion Contrast Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/35 pointer-events-none z-[2]" />

      {/* 2. Hero Editorial Typography & Actions */}
      <div className="relative z-[5] max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 pt-10 sm:pt-0 pointer-events-auto">
        <HeroDustHeadline
          brandTitle={cmsHero?.title || BRAND_INFO.name}
          cityLabel={BRAND_INFO.city}
          subtitle={cmsHero?.tagline || "Where Industrial Steel Encounters Haute Couture"}
        />

        {/* Minimalist Action Controls: EXPLORE THE ARCHIVE & CUSTOM ORDERS */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={onExploreCatalogue}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-black hover:bg-pink font-mono text-xs uppercase tracking-widest transition-all duration-300 font-bold active:scale-95 shadow-xl cursor-pointer"
          >
            {cmsHero?.cta_primary_label || "EXPLORE THE ARCHIVE"}
          </button>

          <button
            onClick={() => {
              playSound('snap');
              if (onOpenTunnel) onOpenTunnel();
              else if (onScrollToSection) onScrollToSection('custom');
            }}
            className="btn-hero-custom w-full sm:w-auto px-7 py-3 rounded-full border-2 border-pink/80 bg-black/75 hover:bg-pink text-white hover:text-black font-mono font-bold text-xs tracking-widest uppercase transition-all backdrop-blur-xl shadow-[0_0_25px_rgba(244,114,182,0.35)] hover:shadow-[0_0_35px_rgba(244,114,182,0.65)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            {cmsHero?.secondary_cta_text || 'CUSTOM ORDERS'}
          </button>
        </div>
      </div>

      {/* 3. Video & Audio Controls HUD (Bottom-Left - Crisp Pure White Icons, Sound Toggle & Full Cinema Reel) */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-[10] flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="hero-hud-btn shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/40 flex items-center justify-center transition-all backdrop-blur-md cursor-pointer shadow-lg active:scale-95 hover:scale-105"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: '#ffffff'
          }}
          title={isPlaying ? 'Pause Video' : 'Play Video'}
          aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white" style={{ color: '#ffffff', fill: '#ffffff' }} />
          )}
        </button>

        {/* Sound Toggle Button (Crystal Clear, Always Visible, High Contrast) */}
        <button
          onClick={handleToggleMute}
          className="hero-sound-toggle-btn shrink-0 px-3 sm:px-3.5 h-9 sm:h-10 rounded-full border border-white/40 flex items-center gap-2 text-white transition-all cursor-pointer shadow-lg active:scale-95 hover:scale-105"
          style={{
            backgroundColor: isMuted ? 'rgba(0, 0, 0, 0.85)' : 'rgba(244, 114, 182, 0.22)',
            borderColor: isMuted ? 'rgba(255, 255, 255, 0.5)' : '#f472b6',
            boxShadow: isMuted ? '0 4px 14px rgba(0,0,0,0.6)' : '0 0 20px rgba(244, 114, 182, 0.55)',
            color: '#ffffff'
          }}
          title={isMuted ? 'Unmute Audio Soundtrack' : 'Mute Audio Soundtrack'}
          aria-label={isMuted ? 'Sound Off - Tap to Unmute' : 'Sound On - Tap to Mute'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-300 shrink-0" style={{ color: '#ffffff', stroke: '#ffffff' }} />
              <span
                className="hero-sound-label text-[10px] sm:text-[11px] font-mono tracking-widest font-bold uppercase whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                SOUND OFF
              </span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-pink shrink-0 animate-pulse" style={{ color: '#f472b6', stroke: '#f472b6' }} />
              <span
                className="hero-sound-label text-[10px] sm:text-[11px] font-mono tracking-widest font-bold uppercase whitespace-nowrap"
                style={{ color: '#ffffff' }}
              >
                SOUND ON
              </span>
            </>
          )}
        </button>

        {/* Full Cinema Reel Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound('pip');
            setIsCinemaOpen(true);
          }}
          className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/40 inline-flex items-center gap-1.5 text-white transition-all cursor-pointer shadow-lg active:scale-95 hover:scale-105 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: '#ffffff'
          }}
          title="Open Cinema Master Reel Modal"
        >
          <Film className="w-3.5 h-3.5 text-pink shrink-0" style={{ color: '#f472b6', stroke: '#f472b6' }} />
          <span className="hidden sm:inline" style={{ color: '#ffffff' }}>FULL CINEMA REEL</span>
          <span className="sm:hidden" style={{ color: '#ffffff' }}>CINEMA</span>
        </button>
      </div>

      {/* 4. Minimalist Scroll Guide */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center pointer-events-none z-[10] opacity-60">
        <div className="w-[1px] h-9 bg-gradient-to-b from-transparent via-pink to-transparent animate-pulse" />
      </div>

      {/* 5. Fullscreen Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        isMobile={isMobileDevice}
      />
    </section>
  );
}

export default React.memo(HeroThreeDimension);
