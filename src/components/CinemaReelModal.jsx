import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function CinemaReelModal({ isOpen, onClose, isMobile = false }) {
  const vimeoId = isMobile ? '1239586843' : '1243094637';
  const vimeoHash = isMobile ? '' : 'f23215a874';
  const activeVimeoUrl = isMobile
    ? (ASSET_MANIFEST.videos?.vimeoMobile || `https://vimeo.com/${vimeoId}`)
    : (ASSET_MANIFEST.videos?.vimeoDesktop || `https://vimeo.com/${vimeoId}`);

  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoId}?${vimeoHash ? `h=${vimeoHash}&` : ''}autoplay=1&loop=1&title=0&byline=0&portrait=0`;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 p-2 sm:p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-[#301934]/30 via-black to-black pointer-events-none" />

      {/* Main Cinema Container */}
      <div
        role="dialog"
        aria-modal="true"
        data-surface="dark"
        className="modal-card relative w-full max-w-5xl h-[85vh] max-h-[850px] bg-black border border-pink/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(244,194,194,0.25)] flex flex-col justify-between"
      >
        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between gap-3 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-pink/15 border border-pink/40 text-[9px] sm:text-[10px] font-mono tracking-widest text-pink uppercase shrink-0">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink animate-ping inline-block" />
              <span>EDITORIAL CINEMA</span>
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
          <iframe
            key={vimeoId}
            src={vimeoEmbedUrl}
            className="w-full h-full border-none"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="AVZ Cinema Vimeo Master"
          />
        </div>

        {/* Bottom Bar */}
        <div className="relative z-20 px-6 py-3 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>STREAMING VIA VIMEO CLOUD</span>
          <span className="text-pink">4K UHD MASTER STREAM</span>
        </div>
      </div>
    </div>
  );
}
