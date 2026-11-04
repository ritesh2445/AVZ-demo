'use client';

import React, { useState } from 'react';
import { Edit3, Eye } from 'lucide-react';
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

/**
 * Authentic Ornate Baroque & Rococo Carved Gold Corner Cartouche
 * Features acanthus scrolls, corner relief boss, and gilded burnishing
 */
function OrnateCornerFiligree() {
  return (
    <svg
      viewBox="0 0 44 44"
      className="w-full h-full drop-shadow-[1px_2px_4px_rgba(0,0,0,0.92)] pointer-events-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldCornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8db" />
          <stop offset="25%" stopColor="#e5bb49" />
          <stop offset="55%" stopColor="#8c6418" />
          <stop offset="85%" stopColor="#e0ba4a" />
          <stop offset="100%" stopColor="#3d2806" />
        </linearGradient>
        <radialGradient id="goldGemGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff9e6" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#4a350c" />
        </radialGradient>
      </defs>
      {/* Outer Baroque Acanthus Scroll Flourish */}
      <path
        d="M3 3 C12 3, 20 6, 26 13 C29 17, 28 23, 22 26 C16 29, 10 25, 11 18 C12 12, 19 12, 22 16"
        stroke="url(#goldCornerGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M3 3 C3 12, 6 20, 13 26 C17 29, 23 28, 26 22 C29 16, 25 10, 18 11 C12 12, 12 19, 16 22"
        stroke="url(#goldCornerGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Solid Carved Cartouche Base */}
      <path
        d="M2 2 L23 2 C19 6, 14 10, 8 10 C10 14, 6 19, 2 23 Z"
        fill="url(#goldCornerGrad)"
      />
      {/* Central Gilded Rosette Boss */}
      <circle cx="10.5" cy="10.5" r="4.5" fill="url(#goldGemGrad)" stroke="#ffd700" strokeWidth="0.8" />
      <circle cx="10.5" cy="10.5" r="2" fill="#2d1c04" />
    </svg>
  );
}

export default function AntiquePaintingFrame({
  artwork,
  index = 0,
  isStacked = false,
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
  const hasSconce = !isStacked && (meta.sconce_light || index % 2 === 0);
  const hasHangingHardware = !isStacked && (meta.hanging_bracket === 'brass_chains' || meta.hanging_bracket === 'wire');

  // Width calculation: Stacked items are slightly more compact (matching photo columns)
  const getFrameWidth = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return isStacked ? 220 : Math.min(artwork.width_px || 320, 280);
    }
    return isStacked ? Math.min(artwork.width_px || 280, 290) : (artwork.width_px || 360);
  };

  const handleFrameClick = (e) => {
    // If admin clicked the edit button, don't open viewer
    if (e.target.closest('.admin-frame-edit-btn')) return;
    onInspect?.(artwork);
  };

  return (
    <div
      className={`relative shrink-0 flex flex-col items-center group cursor-pointer transition-transform duration-500 ease-out select-none ${
        isStacked ? (wallPosition === 'upper' ? 'mb-2' : 'mt-2') : 'my-auto'
      }`}
      style={{
        width: getFrameWidth(),
        zIndex: isHovered ? 35 : 15
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleFrameClick}
    >
      {/* 1. Hanging Hardware & Rail Hook (For grand single pieces) */}
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
          title="Edit Vault Piece"
          aria-label="Edit Vault Piece"
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
        {/* Carved Ornate Gold Corner Cartouches (protruding outside frame corners) */}
        <div className="ornate-corner ornate-corner-tl">
          <OrnateCornerFiligree />
        </div>
        <div className="ornate-corner ornate-corner-tr">
          <OrnateCornerFiligree />
        </div>
        <div className="ornate-corner ornate-corner-bl">
          <OrnateCornerFiligree />
        </div>
        <div className="ornate-corner ornate-corner-br">
          <OrnateCornerFiligree />
        </div>

        {/* On-Frame Engraved Brass Label Plaque (Mounted directly on bottom frame rail) */}
        <div className="frame-mounted-brass-plate">
          <span title={`${artwork.title} (${artwork.artist}, ${artwork.year || '2024'})`}>
            {artwork.title}
          </span>
        </div>

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
                VAULT PIECE {artwork.display_order || index + 1}
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

          {/* Quick Hover View Action */}
          <div
            className={`absolute bottom-3 right-3 z-20 transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <span className="px-2 py-0.5 rounded-none bg-black/85 border border-[#d4af37]/60 text-[#fae596] text-[9px] font-mono tracking-widest uppercase flex items-center gap-1 shadow-lg backdrop-blur-sm">
              <Eye className="w-2.5 h-2.5 text-[#d4af37]" />
              <span>VIEW PIECE</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
