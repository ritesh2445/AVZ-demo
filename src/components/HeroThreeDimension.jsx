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

export default function HeroThreeDimension({ onExploreCatalogue, isReady, onOpenTunnel, cmsHero }) {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);

  const [isMobileDevice, setIsMobileDevice] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    return false;
  });
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);

  // Responsive device listener for mobile video switching
  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobileDevice(isMob);
      if (isMob) setIsMuted(true); // Muted by default on mobile for strict autoplay policies
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  const audioSource = isMobileDevice
    ? (ASSET_MANIFEST.audio?.heroMobile || ASSET_MANIFEST.heroRunwayAudio || '/assets/hero_audio_mobile.mp4')
    : (ASSET_MANIFEST.audio?.heroDesktop || ASSET_MANIFEST.heroRunwayAudio || '/assets/hero_audio_desktop.mp4');

  // Single active Vimeo video ID: 1239586843 (Mobile vertical) or 1239586933 (Desktop 16:9)
  const vimeoId = isMobileDevice ? '1239586843' : '1239586933';
  const vimeoBackgroundUrl = `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&playsinline=1`;

  // Synchronized Master Audio Controls
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying && !isMuted) {
        const p2 = audio.play();
        if (p2 && p2.catch) p2.catch(() => {});
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, isMuted, isMobileDevice]);

  const handleTogglePlay = (e) => {
    e.stopPropagation();
    playSound('pip');
    setIsPlaying((prev) => !prev);
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    playSound(newMuted ? 'toggle_off' : 'toggle_on');

    const audio = audioRef.current;
    if (!audio) return;

    if (!newMuted) {
      audio.muted = false;
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.muted = true;
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
      {/* 0. Synchronized Master Audio Soundtrack */}
      <audio
        ref={audioRef}
        key={audioSource}
        src={audioSource}
        loop
        preload="auto"
      />

      {/* 1. Vimeo Master Video Stream (Cover Viewport Completely, Zero White Bars) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
        style={{ backgroundColor: '#000000' }}
      >
        <iframe
          key={vimeoId}
          src={vimeoBackgroundUrl}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-105"
          style={{
            width: isMobileDevice ? 'max(100vw, 56.25vh)' : 'max(100vw, 177.78vh)',
            height: isMobileDevice ? 'max(100vh, 177.78vw)' : 'max(100vh, 56.25vw)',
            minWidth: '100vw',
            minHeight: '100vh',
            border: 'none'
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          title="AVZ Vimeo Hero Video"
        />
      </div>

      {/* 1.5 Soft High-Fashion Contrast Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/35 pointer-events-none z-[2]" />

      {/* 2. Hero Editorial Typography & Actions */}
      <div className="relative z-[5] max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center space-y-4 sm:space-y-6 pt-10 sm:pt-0 pointer-events-auto">
        <HeroDustHeadline
          headline1={cmsHero?.headline_line1 || 'WEARABLE ART.'}
          headline2={cmsHero?.headline_line2 || 'NOT MADE TO REPEAT.'}
        />

        {cmsHero?.subheadline && (
          <p className="max-w-xl text-xs sm:text-sm md:text-base font-montserrat font-bold text-white leading-relaxed drop-shadow-[0_2px_20px_rgba(0,0,0,0.95)]" style={{ color: "#ffffff", fontWeight: 700 }}>
            {cmsHero.subheadline}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={cmsHero?.primary_cta_link || '#shop'}
            onClick={() => onExploreCatalogue?.()}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-pink via-purple-300 to-pink hover:opacity-90 text-black font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(244,114,182,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            {cmsHero?.primary_cta_text || 'EXPLORE VAULT'}
          </a>
          <a
            href={cmsHero?.secondary_cta_link || '#custom'}
            className="btn-hero-custom px-7 py-3 rounded-full border-2 border-pink/80 bg-black/75 hover:bg-pink text-white hover:text-black font-mono font-bold text-xs tracking-widest uppercase transition-all backdrop-blur-xl shadow-[0_0_25px_rgba(244,114,182,0.35)] hover:shadow-[0_0_35px_rgba(244,114,182,0.65)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            {cmsHero?.secondary_cta_text || 'CUSTOM ORDERS'}
          </a>
        </div>
      </div>

      {/* 3. Video & Audio Controls HUD (Bottom-Left - Crisp Pure White Icons & Typography) */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-[10] flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="hero-hud-btn p-2 sm:p-2.5 rounded-full border transition-all backdrop-blur-md cursor-pointer shadow-md"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            color: '#ffffff'
          }}
          title={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white" style={{ color: '#ffffff', fill: '#ffffff' }} />
          )}
        </button>

        {/* Sound Toggle Button (Crisp Pure White in all states and themes) */}
        <button
          onClick={handleToggleMute}
          className="p-2 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer drop-shadow-md hover:scale-110 active:scale-95"
          style={{
            backgroundColor: isMuted ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.18)',
            borderColor: isMuted ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
            boxShadow: isMuted ? 'none' : '0 0 16px rgba(255, 255, 255, 0.5)',
            color: '#ffffff'
          }}
          title={isMuted ? 'Unmute Audio Soundtrack' : 'Mute Audio Soundtrack'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" style={{ color: '#ffffff', stroke: '#ffffff' }} />
              <span
                className="text-[10px] font-mono tracking-wider font-bold hidden sm:inline"
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
          className="p-2 inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-all cursor-pointer drop-shadow-md hover:scale-105 active:scale-95 text-[10px] sm:text-xs font-mono tracking-wider uppercase"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            color: '#ffffff'
          }}
          title="Open Cinema Master Reel Modal"
        >
          <Film className="w-3.5 h-3.5" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          <span className="hidden sm:inline" style={{ color: '#ffffff' }}>FULL CINEMA REEL</span>
          <span className="sm:hidden" style={{ color: '#ffffff' }}>CINEMA</span>
        </button>
      </div>

      {/* 3. Minimalist Scroll Guide (Bottom-Center) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-[10] opacity-60">
        <div className="w-[1px] h-9 bg-gradient-to-b from-transparent via-pink to-transparent animate-pulse" />
      </div>

      {/* 4. Dedicated Cinema Reel Modal */}
      <CinemaReelModal
        isOpen={isCinemaOpen}
        onClose={() => setIsCinemaOpen(false)}
        isMobile={isMobileDevice}
      />
    </section>
  );
}
