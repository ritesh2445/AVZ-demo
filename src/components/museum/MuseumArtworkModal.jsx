'use client';

import React, { useEffect } from 'react';
import { X, Scissors, Award, Clock, Sparkles, MapPin, Feather, Compass } from 'lucide-react';
import { playSound } from '../../utils/audio';

export default function MuseumArtworkModal({
  artwork,
  onClose,
  onRequestCustomCommission
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!artwork) return null;

  const meta = artwork.metadata || {};

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/92 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 md:p-10 animate-fade-in select-none"
    >
      {/* Background Museum Salon Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-[#2e0912]/40 via-black to-black pointer-events-none" />

      {/* Main Classical Dossier Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#1a050b] border-2 border-[#d4af37]/60 shadow-[0_0_80px_rgba(212,175,55,0.25)] flex flex-col md:flex-row items-center overflow-y-auto z-10 p-5 sm:p-8 md:p-10 gap-6 md:gap-10 rounded-none"
      >
        {/* Ornate Gold Outer Fillet Liner */}
        <div className="absolute inset-2 pointer-events-none border border-[#fae596]/30" />

        {/* Close Button — Antique Brass Medallion */}
        <button
          onClick={() => {
            playSound('pip');
            onClose();
          }}
          aria-label="Close Dossier"
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/80 border border-[#d4af37] text-[#fae596] hover:bg-[#d4af37] hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left: Artwork in Presentation Gold Frame */}
        <div className="relative w-full md:w-1/2 max-h-[50vh] md:max-h-[72vh] flex items-center justify-center shrink-0 z-10">
          <div className="relative w-full p-2 bg-[#260810] border-4 border-[#997325] shadow-2xl">
            <div className="relative overflow-hidden border border-[#fae596]/50 bg-black max-h-[46vh] md:max-h-[66vh] flex items-center justify-center">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="max-h-[46vh] md:max-h-[66vh] w-full object-contain"
              />
              {/* Canvas Texture Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
            </div>

            {/* Brass Nameplate on Bottom of Frame */}
            <div className="mt-2 py-1 px-3 bg-gradient-to-r from-[#997325] via-[#fae596] to-[#997325] text-center border border-[#fae596]/70">
              <span className="text-[10px] font-serif font-bold text-[#1f1404] tracking-[0.14em] uppercase block">
                {artwork.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Museum Catalog Raisonné Dossier Information */}
        <div className="w-full md:w-1/2 flex flex-col justify-between text-left z-10 md:pr-4">
          <div>
            {/* Museum Header Seal */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2e0912] border border-[#d4af37]/40 text-[#fae596] text-[10px] font-mono tracking-[0.2em] uppercase mb-3">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>CATALOG RAISONNÉ • NO. 00{artwork.display_order || '01'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#fff3cc] uppercase tracking-wide leading-tight mb-2">
              {artwork.title}
            </h3>

            <div className="text-xs sm:text-sm font-serif italic text-[#d4af37] mb-4">
              {artwork.artist} • Anno {artwork.year || '2024'}
            </div>

            <p className="text-xs sm:text-sm font-serif text-[#e0cfbb] leading-relaxed mb-6 border-l-2 border-[#d4af37]/50 pl-4 py-1 italic">
              "{artwork.description}"
            </p>

            {/* Curatorial Specification Box */}
            <div className="p-4 bg-[#120307] border border-[#d4af37]/30 text-xs font-serif text-[#c5b099] mb-6 space-y-2">
              <div className="flex items-start gap-2">
                <Feather className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#fae596] font-mono text-[10px] tracking-wider uppercase block">
                    Medium & Construction:
                  </strong>
                  <span>{meta.medium || 'Salvaged industrial microcircuits, stainless steel spikes, upcycled textile'}</span>
                </div>
              </div>

              {meta.dimensions_cm && (
                <div className="flex items-start gap-2 pt-1 border-t border-[#d4af37]/15">
                  <Compass className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#fae596] font-mono text-[10px] tracking-wider uppercase block">
                      Canvas Dimensions:
                    </strong>
                    <span>{meta.dimensions_cm}</span>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 pt-1 border-t border-[#d4af37]/15">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#fae596] font-mono text-[10px] tracking-wider uppercase block">
                    Provenance & Archival Custody:
                  </strong>
                  <span>{meta.provenance || 'Permanent Collection, Guwahati Atelier'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                playSound('subdrop');
                onClose();
                onRequestCustomCommission?.(artwork.title);
              }}
              className="py-3 px-6 bg-gradient-to-r from-[#b3892c] via-[#fae596] to-[#b3892c] text-black font-serif font-bold text-xs tracking-[0.16em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:brightness-110 active:scale-98 transition-all border border-[#fae596]"
            >
              <Scissors className="w-4 h-4 text-black" />
              <span>COMMISSION THIS SILHOUETTE ↗</span>
            </button>

            <button
              onClick={() => {
                playSound('pip');
                onClose();
              }}
              className="py-3 px-6 bg-transparent border border-[#d4af37]/60 text-[#fae596] hover:bg-[#d4af37]/20 font-serif text-xs tracking-widest uppercase cursor-pointer transition-all active:scale-98"
            >
              RETURN TO SALON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
