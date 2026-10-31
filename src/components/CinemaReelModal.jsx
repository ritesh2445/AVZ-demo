import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, ExternalLink, Sparkles, Film } from 'lucide-react';
import { ASSET_MANIFEST, BRAND_INFO } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function CinemaReelModal({ isOpen, onClose, isMobile = false }) {
  const videoRef = useRef(null);
  const [viewMode, setViewMode] = useState('vimeo'); // 'vimeo' or 'native'
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const activeVideoSrc = isMobile
    ? (ASSET_MANIFEST.videos?.heroMobile || ASSET_MANIFEST.heroRunwayVideoVertical || '/assets/hero_reel_mobile.mp4')
    : (ASSET_MANIFEST.videos?.heroDesktop || ASSET_MANIFEST.heroRunwayVideo || '/assets/hero_reel_desktop.mp4');

  const vimeoId = isMobile ? '1239586843' : '1239586933';
  const activeVimeoUrl = isMobile
    ? (ASSET_MANIFEST.videos?.vimeoMobile || `https://vimeo.com/${vimeoId}`)
    : (ASSET_MANIFEST.videos?.vimeoDesktop || `https://vimeo.com/${vimeoId}`);

  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&title=0&byline=0&portrait=0`;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.code === 'Space' && viewMode === 'native') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, viewMode]);

  useEffect(() => {
    if (isOpen && viewMode === 'native' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isOpen, viewMode]);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 p-2 sm:p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-[#301934]/30 via-black to-black pointer-events-none" />

      {/* Main Cinema Container */}
      <div role="dialog" aria-modal="true" data-surface="dark" className="modal-card relative w-full max-w-5xl h-[85vh] max-h-[850px] bg-black border border-pink/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(244,194,194,0.25)] flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between gap-3 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-pink/15 border border-pink/40 text-[9px] sm:text-[10px] font-mono tracking-widest text-pink uppercase shrink-0">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink animate-ping inline-block" />
              <span>EDITORIAL CINEMA</span>
            </div>
            
            {/* View Mode Switcher */}
            <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-full">
              <button
                onClick={() => {
                  playSound('pip');
                  setViewMode('vimeo');
                }}
                className={`px-3 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                  viewMode === 'vimeo'
                    ? 'bg-pink text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                VIMEO CLOUD
              </button>
              <button
                onClick={() => {
                  playSound('pip');
                  setViewMode('native');
                }}
                className={`px-3 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                  viewMode === 'native'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                NATIVE REEL
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={activeVimeoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-silver font-mono hover:text-pink transition-all"
              title="Open directly on Vimeo"
            >
              <span className="hidden sm:inline">Open on Vimeo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                playSound('modal_close');
                onClose();
              }}
              className="p-2 text-zinc-400 hover:text-white hover:rotate-90 flex items-center justify-center transition-all cursor-pointer shrink-0 active:scale-95"
              aria-label="Close Cinema Mode"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Layer */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden bg-black">
          {viewMode === 'vimeo' ? (
            <iframe
              key={vimeoId}
              src={vimeoEmbedUrl}
              className="w-full h-full border-none"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="AVZ Cinema Vimeo Master"
            />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Bottom Cinema Controls (Shown for Native mode) */}
        {viewMode === 'native' ? (
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
                UNCOMPRESSED NATIVE MASTER
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-20 px-6 py-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>STREAMING VIA VIMEO CLOUD</span>
            <span className="text-pink">1080P MASTER STREAM</span>
          </div>
        )}
      </div>
    </div>
  );
}
