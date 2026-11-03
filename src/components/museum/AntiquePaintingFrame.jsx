'use client';

import React, { useState } from 'react';
import { Edit3, Eye, Sparkles } from 'lucide-react';
import { playSound } from '../../utils/audio';

const FRAME_CLASSES = {
  ornate_baroque: 'frame-ornate-baroque',
  gilded_rococo: 'frame-gilded-rococo',
  florentine_gold: 'frame-florentine-gold',
  antique_fillet: 'frame-antique-fillet',
  classical_cavetto: 'frame-classical-cavetto',
  tarnished_brass: 'frame-tarnished-brass'
};

const ASPECT_RATIO_STYLES = {
  '3:4': 'aspect-[3/4]',
  '4:5': 'aspect-[4/5]',
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-[16/9]',
  '2:3': 'aspect-[2/3]'
};

export default function AntiquePaintingFrame({
  artwork,
  index,
  onInspect,
  onAdminEdit,
  isAdmin = false
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const frameClass = FRAME_CLASSES[artwork.frame_style] || FRAME_CLASSES.ornate_baroque;
  const aspectClass = ASPECT_RATIO_STYLES[artwork.aspect_ratio] || 'aspect-[3/4]';
  const meta = artwork.metadata || {};

  const wallPosition = meta.wall_position || (index % 3 === 0 ? 'center' : index % 3 === 1 ? 'upper' : 'lower');
  const hasSconce = meta.sconce_light || index % 3 === 0;
  const hasHangingHardware = meta.hanging_bracket === 'brass_chains' || meta.hanging_bracket === 'wire';

  // Calculate vertical alignment for authentic salon wall hang
  const getVerticalMargin = () => {
    switch (wallPosition) {
      case 'upper':
        return 'self-start mt-2 sm:mt-4 mb-auto';
      case 'lower':
        return 'self-end mb-8 sm:mb-12 mt-auto';
      case 'center':
      default:
        return 'self-center my-auto';
    }
  };

  const handleFrameClick = (e) => {
    // If admin clicked the edit button, don't open viewer
    if (e.target.closest('.admin-frame-edit-btn')) return;
    playSound('pip');
    onInspect?.(artwork);
  };

  return (
    <div
      className={`relative shrink-0 flex flex-col items-center group cursor-pointer transition-transform duration-500 ease-out select-none ${getVerticalMargin()}`}
      style={{
        width: typeof window !== 'undefined' && window.innerWidth < 640 ? Math.min(artwork.width_px || 340, 290) : (artwork.width_px || 360),
        zIndex: isHovered ? 30 : 10
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleFrameClick}
    >
      {/* 1. Hanging Hardware & Rail Hook (Optional classical detail) */}
      {hasHangingHardware && (
        <>
          <div className="hanging-wire-left" />
          <div className="hanging-wire-right" />
          <div className="hanging-hook-top" />
        </>
      )}

      {/* 2. Antique Brass Picture Sconce Light */}
      {hasSconce && (
        <div className="brass-picture-light">
          <div className="spotlight-cone" />
        </div>
      )}

      {/* 3. Admin Direct Edit Badge (Visible ONLY to verified logged-in administrators) */}
      {isAdmin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playSound('snap');
            onAdminEdit?.(artwork);
          }}
          className="admin-frame-edit-btn"
          title="Curator Mode: Edit painting image, dimensions, or antique frame"
          aria-label="Edit Painting Frame"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* 4. The Authentic Antique Gold Frame Structure */}
      <div
        className={`w-full ${aspectClass} relative transition-all duration-500 rounded-none museum-frame-shadow ${frameClass} ${
          isHovered ? '-translate-y-1.5' : 'translate-y-0'
        }`}
      >
        {/* Subtle hover spotlight highlight */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255, 235, 180, 0.18) 0%, transparent 70%)'
          }}
        />

        {/* 5. Painting Canvas with Vintage Oil Weave Texture & Inner Cast Shadow */}
        <div className="w-full h-full relative painting-canvas bg-[#160408]">
          {/* Fallback placeholder while image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-[#24080e] animate-pulse flex items-center justify-center">
              <span className="text-[10px] font-mono text-[#c5a059]/40 tracking-widest uppercase">
                EXHIBIT {artwork.id}
              </span>
            </div>
          )}

          <img
            src={artwork.image_url}
            alt={artwork.title}
            loading={index < 4 ? 'eager' : 'lazy'}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-102 contrast-105' : 'scale-100 contrast-100'}`}
            style={{
              objectPosition: meta.object_position || 'center 20%'
            }}
          />

          {/* Quick Hover Inspect Action */}
          <div
            className={`absolute bottom-3 right-3 z-20 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <span className="px-2.5 py-1 rounded-none bg-black/85 border border-[#d4af37]/60 text-[#fae596] text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
              <Eye className="w-3 h-3 text-[#d4af37]" />
              <span>INSPECT</span>
            </span>
          </div>
        </div>
      </div>

      {/* 6. Engraved Brass Museum Wall Plaque */}
      <div className="mt-4 w-[88%] max-w-[320px] px-3.5 py-2 brass-museum-plaque text-center flex flex-col items-center justify-center transition-all duration-300">
        <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-[0.22em] text-[#362407] uppercase block leading-none mb-1">
          AVZ ARCHIVE • NO. 00{artwork.display_order || index + 1}
        </span>
        <h4 className="text-[11px] sm:text-[12px] font-serif font-bold text-[#140b02] uppercase tracking-[0.06em] leading-tight line-clamp-1">
          {artwork.title}
        </h4>
        <span className="text-[9px] sm:text-[10px] font-serif italic text-[#38260a] tracking-wide block mt-0.5">
          {artwork.artist} • {artwork.year || '2024'}
        </span>
      </div>
    </div>
  );
}
