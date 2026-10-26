import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST, BRAND_INFO } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function CinemaReelModal({ isOpen, onClose, isMobile = false }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay with audio was blocked by browser policy, fallback to muted
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    playSound('click');
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    playSound('click');
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((curr / dur) * 100);

    const format = (t) => {
      const mins = Math.floor(t / 60);
      const secs = Math.floor(t % 60);
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    setCurrentTime(format(curr));
    if (!isNaN(videoRef.current.duration)) {
      setDuration(format(videoRef.current.duration));
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * (videoRef.current.duration || 1);
  };

  const activeVideoSrc = isMobile ? ASSET_MANIFEST.videos.heroMobile : ASSET_MANIFEST.videos.heroDesktop;
  const activeVimeoUrl = isMobile ? ASSET_MANIFEST.videos.vimeoMobile : ASSET_MANIFEST.videos.vimeoDesktop;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 p-2 sm:p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-[#301934]/30 via-black to-black pointer-events-none" />

      {/* Main Cinema Container */}
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[850px] bg-black border border-pink/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(244,194,194,0.25)] flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink/15 border border-pink/40 text-[10px] font-mono tracking-widest text-pink uppercase">
              <span className="w-2 h-2 rounded-full bg-pink animate-ping inline-block" />
              <span>AVZ EDITORIAL CINEMA</span>
            </div>
            <span className="text-silver/80 text-xs hidden sm:inline font-montserrat">
              {isMobile ? 'Mobile Vertical Edit' : 'Desktop 16:9 Master Reel'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activeVimeoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-silver font-mono hover:text-pink transition-all"
              title="Open on Vimeo"
            >
              <span>Vimeo Master</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => {
                playSound('modal_close');
                onClose();
              }}
              className="p-2 rounded-full bg-black/60 hover:bg-pink/20 border border-white/20 hover:border-pink text-white transition-all cursor-pointer"
              aria-label="Close Cinema Mode"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Layer */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={activeVideoSrc}
            playsInline
            autoPlay
            loop
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Central Play/Pause Watermark on Pause */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-pink/20 border border-pink/60 flex items-center justify-center text-pink shadow-[0_0_30px_rgba(244,194,194,0.5)] transform hover:scale-110 transition-transform">
                <Play className="w-8 h-8 fill-pink translate-x-0.5" />
              </div>
            </button>
          )}
        </div>

        {/* Bottom Cinema Controls */}
        <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-3">
          {/* Timeline Bar */}
          <div
            onClick={handleSeek}
            className="w-full h-1.5 bg-white/15 hover:h-2.5 rounded-full cursor-pointer relative overflow-hidden transition-all group"
          >
            <div
              className="h-full bg-gradient-to-r from-pink via-lavender to-pink rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-silver">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="hover:text-pink transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={toggleMute}
                className="hover:text-pink transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-pink" />}
                <span className="hidden sm:inline">{isMuted ? 'UNMUTE' : 'MUTE'}</span>
              </button>

              <span className="text-[11px] text-silver/60">
                {currentTime} / {duration}
              </span>
            </div>

            <div className="text-[11px] text-pink tracking-widest uppercase">
              100% UNCOMPRESSED NATIVE MASTER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
