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
          setVideoLoaded(true);
        } else if (data.event === 'play' || data.event === 'timeupdate') {
          setVideoLoaded(true);
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

        {/* Minimalist Action Controls */}
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
              setIsCinemaOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-widest border border-white/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <Film className="w-3.5 h-3.5 text-pink" />
            <span>{cmsHero?.cta_secondary_label || "CINEMA THEATRE"}</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Playback & Audio Controls */}
      <div className="absolute bottom-6 left-6 z-[6] flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause Runway Stream' : 'Play Runway Stream'}
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-md active:scale-90"
        >
          {isPlaying ? <Pause className="w-4 h-4 text-pink" /> : <Play className="w-4 h-4 text-pink fill-pink ml-0.5" />}
        </button>

        <button
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute Runway Audio' : 'Mute Runway Audio'}
          className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-md active:scale-90"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-silver/80" /> : <Volume2 className="w-4 h-4 text-pink" />}
        </button>
      </div>

      {/* 4. Fullscreen Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        isMobile={isMobileDevice}
      />
    </section>
  );
}

export default React.memo(HeroThreeDimension);
