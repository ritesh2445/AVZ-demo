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

export default function HeroThreeDimension({ onExploreCatalogue, onScrollToSection, isReady, onOpenTunnel, cmsHero }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

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

  const videoSource = `/api/video/hero?device=${isMobileDevice ? 'mobile' : 'desktop'}`;
  const posterSrc = isMobileDevice ? '/assets/mobile_poster.jpg' : '/assets/desktop_poster.jpg';

  // Synchronized Master Video & Native Audio Playback Controls
  // The video element natively carries the master 48kHz audio track, avoiding dual-audio drift
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

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

    const video = videoRef.current;
    if (video) {
      video.muted = newMuted;
      if (!newMuted) {
        video.play().catch(() => { });
      }
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
      {/* 1. Master Native Video Stream (Instant 206 Byte-Range Streaming, 100% Uncompressed Master Quality) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Instant first-frame high-resolution poster while first video frames stream */}
        <img
          src={posterSrc}
          alt="AVZ Hero Master Visual"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${videoLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          style={{ objectFit: 'cover' }}
        />

        <video
          ref={videoRef}
          key={videoSource}
          src={videoSource}
          poster={posterSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onCanPlay={() => setVideoLoaded(true)}
          onPlaying={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 pointer-events-none ${videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          style={{ objectFit: 'cover' }}
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
          <button
            type="button"
            onClick={() => {
              playSound('snap');
              if (onExploreCatalogue) {
                onExploreCatalogue();
              } else if (onScrollToSection) {
                onScrollToSection('shop');
              } else {
                const el = document.getElementById('shop');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-pink via-purple-300 to-pink hover:opacity-90 text-black font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(244,114,182,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            {cmsHero?.primary_cta_text || 'EXPLORE VAULT'}
          </button>
          <button
            type="button"
            onClick={() => {
              playSound('snap');
              if (onScrollToSection) {
                onScrollToSection('custom');
              } else {
                const el = document.getElementById('custom');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-hero-custom px-7 py-3 rounded-full border-2 border-pink/80 bg-black/75 hover:bg-pink text-white hover:text-black font-mono font-bold text-xs tracking-widest uppercase transition-all backdrop-blur-xl shadow-[0_0_25px_rgba(244,114,182,0.35)] hover:shadow-[0_0_35px_rgba(244,114,182,0.65)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            {cmsHero?.secondary_cta_text || 'CUSTOM ORDERS'}
          </button>
        </div>
      </div>

      {/* 3. Video & Audio Controls HUD (Bottom-Left - Crisp Pure White Icons & Typography) */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-[10] flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="hero-hud-btn p-2 sm:p-2.5 rounded-full border border-white/40 flex items-center justify-center transition-all backdrop-blur-md cursor-pointer shadow-lg active:scale-95 hover:scale-105"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            color: '#ffffff'
          }}
          title={isPlaying ? 'Pause Audio' : 'Play Audio'}
          aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" style={{ color: '#ffffff', stroke: '#ffffff' }} />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white" style={{ color: '#ffffff', fill: '#ffffff' }} />
          )}
        </button>

        {/* Sound Toggle Button (Crystal Clear, Always Visible, High Contrast in all states & themes) */}
        <button
          onClick={handleToggleMute}
          className="hero-sound-toggle-btn px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/40 flex items-center gap-2 text-white transition-all cursor-pointer shadow-lg active:scale-95 hover:scale-105"
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

      {/* 3. Minimalist Scroll Guide (Bottom-Center, hidden on small screens to avoid HUD overlap) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center pointer-events-none z-[10] opacity-60">
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
