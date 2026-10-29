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
import { playSound } from '../utils/audio';

export default function HeroThreeDimension({ onExploreCatalogue }) {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);

  // Responsive device listener for mobile video switching
  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth < 768;
      setIsMobileDevice(isMob);
      if (isMob) setIsMuted(true); // Muted by default on mobile for autoplay policy
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      className="relative w-full min-h-[100dvh] h-[100dvh] flex items-center justify-center overflow-hidden bg-black select-none cursor-default"
    >
      {/* 0. Synchronized Master Audio Soundtrack */}
      <audio
        ref={audioRef}
        key={audioSource}
        src={audioSource}
        loop
        preload="auto"
      />

      {/* 1. Vimeo Master Cloud Video Stream (Single Full-Bleed Video) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <iframe
          src={vimeoBackgroundUrl}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: isMobileDevice ? '100vw' : '177.78vh',
            height: isMobileDevice ? '177.78vw' : '100vh',
            minWidth: '100%',
            minHeight: '100%',
            border: 'none'
          }}
          allow="autoplay; fullscreen; picture-in-picture"
          title="AVZ Vimeo Hero Video"
        />
      </div>

      {/* 2. Video & Audio Controls HUD (Bottom-Left) */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-[10] flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-md"
          title={isPlaying ? 'Pause Audio' : 'Play Audio'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        <button
          onClick={handleToggleMute}
          className={`p-2 sm:p-2.5 rounded-full border transition-all backdrop-blur-md cursor-pointer shadow-md flex items-center gap-1.5 ${
            isMuted
              ? 'bg-black/60 border-white/15 hover:border-white/30 text-zinc-400 hover:text-white'
              : 'bg-white/10 border-white/40 text-white'
          }`}
          title={isMuted ? 'Unmute Audio Soundtrack' : 'Mute Audio Soundtrack'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px] font-mono tracking-wider text-white hidden sm:inline">SOUND ON</span>
            </>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            playSound('pip');
            setIsCinemaOpen(true);
          }}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white text-[10px] sm:text-xs font-mono transition-all backdrop-blur-md cursor-pointer shadow-md"
          title="Open Cinema Master Reel Modal"
        >
          <Film className="w-3.5 h-3.5 text-zinc-400" />
          <span className="hidden sm:inline">FULL CINEMA REEL</span>
          <span className="sm:hidden">CINEMA</span>
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
