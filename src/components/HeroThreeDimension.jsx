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
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);

  // Distinct Video Reel for Mobile vs Desktop
  const videoSource = isMobileDevice
    ? ASSET_MANIFEST.heroRunwayVideoVertical
    : ASSET_MANIFEST.heroRunwayVideo;

  const audioSource = ASSET_MANIFEST.heroRunwayAudio;

  // Responsive device listener for mobile video switching
  useEffect(() => {
    const checkMobile = () => {
      const isMob = window.innerWidth < 768;
      setIsMobileDevice(isMob);
      if (isMob) setIsMuted(true); // Muted by default on mobile for autoplay
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Autoplay handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markLoaded = () => setVideoLoaded(true);
    video.addEventListener('loadeddata', markLoaded);
    video.addEventListener('canplay', markLoaded);
    video.addEventListener('playing', markLoaded);

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => markLoaded())
        .catch(() => {
          video.muted = true;
          video.play().then(markLoaded).catch(() => {});
        });
    }

    return () => {
      video.removeEventListener('loadeddata', markLoaded);
      video.removeEventListener('canplay', markLoaded);
      video.removeEventListener('playing', markLoaded);
    };
  }, [videoSource]);

  // Synchronized Master Video & Audio Controls
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        const p1 = video.play();
        if (p1 && p1.catch) {
          p1.catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      } else {
        video.pause();
      }
    }

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

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio || isMuted) return;

    if (Math.abs(video.currentTime - audio.currentTime) > 0.18) {
      audio.currentTime = video.currentTime;
    }
  };

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
    const video = videoRef.current;
    if (!audio) return;

    if (!newMuted) {
      if (video) audio.currentTime = video.currentTime;
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

      {/* 1. Native Master Video Reel: Full-bleed, unobstructed, high-fashion cinema */}
      <video
        ref={videoRef}
        key={videoSource}
        src={videoSource}
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="auto"
        poster={ASSET_MANIFEST.editorialHero}
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        onTimeUpdate={handleVideoTimeUpdate}
        onLoadedData={() => setVideoLoaded(true)}
        onCanPlay={() => setVideoLoaded(true)}
        onPlay={() => setVideoLoaded(true)}
        onPlaying={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-100 transition-opacity duration-300 ease-out"
        style={{
          filter: 'contrast(105%) brightness(102%) saturate(104%)',
          objectPosition: 'center center',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          imageRendering: '-webkit-optimize-contrast'
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* 2. Video & Audio Controls HUD (Bottom-Left) */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-[10] flex items-center gap-2">
        <button
          onClick={handleTogglePlay}
          className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-white/10 border border-white/15 hover:border-white/30 text-zinc-300 hover:text-white transition-all backdrop-blur-md cursor-pointer shadow-md"
          title={isPlaying ? 'Pause Background Reel' : 'Play Background Reel'}
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
        videoSource={videoSource}
      />
    </section>
  );
}
