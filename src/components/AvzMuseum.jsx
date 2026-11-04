'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  Compass,
  PlusCircle
} from 'lucide-react';
import AntiquePaintingFrame from './museum/AntiquePaintingFrame';
import MuseumArtworkModal from './museum/MuseumArtworkModal';
import QuickFrameEditorModal from './museum/QuickFrameEditorModal';
import {
  startGuitarMelody,
  stopGuitarMelody,
  playInteractiveGuitarString,
  pluckString,
  queueGuitarScrollMelody,
  playFrameGuitarString
} from '../utils/guitarAudio';
import { playSound } from '../utils/audio';

// Initial fallback archive pieces ensuring zero empty screen
const FALLBACK_ARTWORKS = [
  {
    id: 'art-005',
    title: 'Telecom PCB Cuff',
    artist: 'Dhrisni & Guwahati Guild',
    image_url: '/assets/prod_motherboard_cuff.jpg',
    thumbnail_url: '/assets/prod_motherboard_cuff.jpg',
    description: 'Salvaged from broken office telecommunication boards. We cut the PCB traces to show off the raw copper pathways and golden solder joints, then lined it with thick leather so it sits smooth against your skin.',
    year: '2024',
    category: 'Wearable Hardware',
    frame_style: 'classical_cavetto',
    aspect_ratio: '4:3',
    width_px: 290,
    height_px: 218,
    display_order: 1,
    is_published: 1,
    metadata: {
      medium: 'Reclaimed telecom PCBs, raw copper circuitry, genuine leather lining',
      dimensions_cm: 'Custom Wrist Fit',
      provenance: 'Guwahati Studio Archive',
      hanging_bracket: 'wire',
      wall_position: 'upper',
      sconce_light: false
    }
  },
  {
    id: 'art-004',
    title: 'Deconstructed Trucker Relic',
    artist: 'Dhrisni',
    image_url: '/assets/product_reworked_jacket.jpg',
    thumbnail_url: '/assets/product_reworked_jacket.jpg',
    description: 'Cut up from an oversized vintage trucker jacket into 18 raw denim panels at 3 AM. Laced back together with industrial aircraft cables and silver eyelets. Pure chaotic structure.',
    year: '2024',
    category: 'Upcycled Denim',
    frame_style: 'antique_fillet',
    aspect_ratio: '1:1',
    width_px: 280,
    height_px: 280,
    display_order: 2,
    is_published: 1,
    metadata: {
      medium: '14oz vintage deconstructed denim, aircraft steel cables, chrome eyelets',
      dimensions_cm: 'Chest 38-42" / Adjustable Fit',
      provenance: 'Studio Relic 004',
      hanging_bracket: 'hidden',
      wall_position: 'lower',
      sconce_light: false
    }
  },
  {
    id: 'art-001',
    title: 'Cyber Motherboard Bustier',
    artist: 'Dhrisni',
    image_url: '/assets/editorial_hero_portrait.jpg',
    thumbnail_url: '/assets/editorial_hero_portrait.jpg',
    description: 'Our signature piece. Hand-shaped from decommissioned computer motherboards and high-gauge wire over structured denim. Fits like futuristic armor. No two boards are ever cut the same.',
    year: '2023',
    category: 'Wearable Tech',
    frame_style: 'ornate_baroque',
    aspect_ratio: '3:4',
    width_px: 380,
    height_px: 510,
    display_order: 3,
    is_published: 1,
    metadata: {
      medium: 'Decommissioned motherboard chips, copper tracing, structured denim, silver grommets',
      dimensions_cm: 'Bust 32-35" / Lace-Up Back',
      provenance: 'AVZ Permanent Archive',
      hanging_bracket: 'brass_chains',
      wall_position: 'center',
      sconce_light: true
    }
  },
  {
    id: 'art-002',
    title: 'Subcultural Bodice Spikes',
    artist: 'Dhrisni',
    image_url: '/assets/look_spike_bodice.jpg',
    thumbnail_url: '/assets/look_spike_bodice.jpg',
    description: '64 solid lathe-turned steel spikes individually bolted through heavy black denim. Defensive fashion built for people who refuse to be touched without permission.',
    year: '2023',
    category: 'Hardware Intimates',
    frame_style: 'gilded_rococo',
    aspect_ratio: '4:5',
    width_px: 290,
    height_px: 362,
    display_order: 4,
    is_published: 1,
    metadata: {
      medium: 'Solid lathe-turned steel spikes, heavy-duty black denim, industrial rivets',
      dimensions_cm: 'Bust 32-36" / Adjustable',
      provenance: 'Private Archive',
      hanging_bracket: 'wire',
      wall_position: 'upper',
      sconce_light: false
    }
  },
  {
    id: 'art-007',
    title: 'Hematite & Steel Shard Top',
    artist: 'Dhrisni & Guwahati Guild',
    image_url: '/assets/product_beaded_bralette.jpg',
    thumbnail_url: '/assets/product_beaded_bralette.jpg',
    description: 'Faceted hematite micro-stones hand-strung between polished scrap metal offcuts. Shimmers with real mechanical weight under club lighting.',
    year: '2024',
    category: 'Hand-Strung Metal',
    frame_style: 'ornate_baroque',
    aspect_ratio: '4:5',
    width_px: 280,
    height_px: 350,
    display_order: 5,
    is_published: 1,
    metadata: {
      medium: 'Faceted hematite stones, polished scrap metal offcuts, high-tensile silk cord',
      dimensions_cm: 'Adjustable Tie-Back',
      provenance: 'Guild Showcase Piece',
      hanging_bracket: 'wire',
      wall_position: 'lower',
      sconce_light: false
    }
  },
  {
    id: 'art-003',
    title: 'Liquid Steel Chainmail',
    artist: 'AVZ Women Guild',
    image_url: '/assets/look_chainmail_armor.jpg',
    thumbnail_url: '/assets/look_chainmail_armor.jpg',
    description: 'Over 1,200 surgical stainless steel rings linked by hand ring-by-ring in our Guwahati studio. Cold to the touch, heavy in your hands, and flexes with your body like liquid metal.',
    year: '2024',
    category: 'Fluid Chainmail',
    frame_style: 'florentine_gold',
    aspect_ratio: '3:4',
    width_px: 420,
    height_px: 560,
    display_order: 6,
    is_published: 1,
    metadata: {
      medium: '16-gauge 316L stainless steel jump rings, heavy carabiner closures',
      dimensions_cm: 'Torso Wrap / Fluid Drape',
      provenance: 'AVZ Guwahati Studio',
      hanging_bracket: 'brass_chains',
      wall_position: 'center',
      sconce_light: true
    }
  },
  {
    id: 'art-006',
    title: 'Cold-Forged Spike Bra',
    artist: 'Dhrisni',
    image_url: '/assets/product_spike_bra.jpg',
    thumbnail_url: '/assets/product_spike_bra.jpg',
    description: 'Heavy cone spikes bolted directly onto structured denim with adjustable lobster-clasp chain straps. Built to be worn loud with zero apologies.',
    year: '2023',
    category: 'Hardware Intimates',
    frame_style: 'tarnished_brass',
    aspect_ratio: '3:4',
    width_px: 350,
    height_px: 466,
    display_order: 7,
    is_published: 1,
    metadata: {
      medium: 'Bolted steel cone spikes, reinforced denim foundation, cushioned inner lining',
      dimensions_cm: 'Bust 32A-34B',
      provenance: 'Studio Relic 006',
      hanging_bracket: 'brass_chains',
      wall_position: 'center',
      sconce_light: false
    }
  },
  {
    id: 'art-008',
    title: 'The Dhristroyer Runway Armor',
    artist: 'Dhrisni',
    image_url: '/assets/product_diva_top.jpg',
    thumbnail_url: '/assets/product_diva_top.jpg',
    description: "Dhrisni's personal runway set. A boned corset framework meeting raw industrial steel closures and reclaimed cybernetic hardware. Loud, heavy, and unapologetically maximalist.",
    year: '2024',
    category: 'Maximalist High Fashion',
    frame_style: 'gilded_rococo',
    aspect_ratio: '3:4',
    width_px: 400,
    height_px: 533,
    display_order: 8,
    is_published: 1,
    metadata: {
      medium: 'Boned corset foundation, salvaged alloy embellishments, raw steel closures',
      dimensions_cm: 'Runway Custom Fit',
      provenance: 'Dhristroyer Personal Vault',
      hanging_bracket: 'brass_chains',
      wall_position: 'center',
      sconce_light: true
    }
  }
];

export default function AvzMuseum({ onRequestCustomCommission, theme = 'dark', cmsMuseum }) {
  const [artworks, setArtworks] = useState(FALLBACK_ARTWORKS);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const wallScrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const lastPosRef = useRef(0);
  const lastScrollLeftRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  // 1. Fetch Dynamic Gallery Artworks from Backend
  const fetchArtworks = useCallback(async () => {
    try {
      const res = await fetch('/api/storefront/gallery');
      if (!res.ok) throw new Error('Failed to load gallery');
      const data = await res.json();
      if (data.artworks && data.artworks.length > 0) {
        setArtworks(data.artworks);
      }
    } catch (err) {
      console.warn('[VINTAGE GALLERY LOAD]: Using archival fallback', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Check Admin Authentication to Enable Curator Edit Controls on Frames
  const checkAdminStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setIsAdmin(true);
        }
      }
    } catch (e) {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
    checkAdminStatus();
  }, [fetchArtworks, checkAdminStatus]);

  // 3. Horizontal Wheel Navigation (Translates vertical mouse wheel to horizontal glide + fast acoustic melody queue)
  const handleWheel = (e) => {
    const el = wallScrollRef.current;
    if (!el) return;

    // Only intercept if horizontal movement is dominant or shift key is pressed or cursor is directly over gallery
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
      // Allow slight wheel translation smoothly without full scroll-jacking
      const maxScroll = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= maxScroll && e.deltaY > 0;

      // If at boundary, let normal vertical page scroll take over
      if (atStart || atEnd) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY * 1.25;

      const velocity = Math.abs(e.deltaY) / 60;
      const dir = e.deltaY > 0 ? 1 : -1;
      queueGuitarScrollMelody(velocity, dir, true);
    } else if (Math.abs(e.deltaX) > 0) {
      const velocity = Math.abs(e.deltaX) / 60;
      const dir = e.deltaX > 0 ? 1 : -1;
      queueGuitarScrollMelody(velocity, dir, true);
    }
  };

  // 4. Click-and-Drag / Pointer Movement Physics for Natural Inertia
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    const el = wallScrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    lastPosRef.current = e.pageX;
    lastMoveTimeRef.current = Date.now();
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const el = wallScrollRef.current;
    if (!el) return;

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;

    // Calculate velocity and direction for realistic guitar pluck queue
    const now = Date.now();
    const dt = Math.max(1, now - lastMoveTimeRef.current);
    const dx = e.pageX - lastPosRef.current;
    const velocity = (Math.abs(dx) / dt) * 12;
    const dir = dx < 0 ? 1 : -1;

    queueGuitarScrollMelody(velocity, dir, true);

    lastPosRef.current = e.pageX;
    lastMoveTimeRef.current = now;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
    }
  };

  // 5. Continuous Scroll Listener (For trackpads, touch gestures, and inertial gliding)
  const handleTrackScroll = useCallback(() => {
    const el = wallScrollRef.current;
    if (!el) return;

    const currentLeft = el.scrollLeft;
    const now = Date.now();
    const dt = Math.max(1, now - (lastScrollTimeRef.current || now));
    const delta = currentLeft - (lastScrollLeftRef.current || currentLeft);

    if (Math.abs(delta) > 2) {
      const velocity = (Math.abs(delta) / dt) * 4;
      const dir = delta > 0 ? 1 : -1;
      queueGuitarScrollMelody(velocity, dir, true);
    }

    lastScrollLeftRef.current = currentLeft;
    lastScrollTimeRef.current = now;
  }, []);

  // 6. Arrow Key and Button Navigation
  const scrollByAmount = (offset) => {
    const el = wallScrollRef.current;
    if (!el) return;
    playSound('whoosh');
    const dir = offset > 0 ? 1 : -1;
    queueGuitarScrollMelody(1.8, dir, true);
    el.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    playSound(next ? 'toggle_on' : 'toggle_off');
    if (next) {
      startGuitarMelody();
      // Realistic acoustic guitar welcome strum
      pluckString(164.81, null, 2.5, 0.1);
      setTimeout(() => pluckString(246.94, null, 2.2, 0.08), 80);
      setTimeout(() => pluckString(329.63, null, 2.2, 0.09), 160);
    } else {
      stopGuitarMelody();
    }
  };

  // Clean up audio if user leaves the page or unmounts
  useEffect(() => {
    return () => {
      stopGuitarMelody();
    };
  }, []);

  // Callback after an admin modifies or dismounts a frame in real time
  const handleArtworkSaved = (updatedArt) => {
    setArtworks((prev) =>
      prev.map((a) => (a.id === updatedArt.id ? updatedArt : a))
    );
  };

  const handleArtworkDeleted = (deletedId) => {
    setArtworks((prev) => prev.filter((a) => a.id !== deletedId));
  };

  return (
    <section
      id="museum"
      className="museum-salon-wall w-full py-14 sm:py-20 relative select-none overflow-hidden border-t border-[#3d0d18]"
    >
      {/* Authentic Crimson Lace Damask Wallpaper & Atmospheric Lighting */}
      <div className="museum-damask-wallpaper" />
      <div className="museum-wall-lighting" />
      <div className="museum-wall-texture" />

      {/* Atmospheric Gallery Salon Lighting Spots */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_rgba(255,230,170,0.1)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_top,_rgba(255,230,170,0.1)_0%,_transparent_70%)] pointer-events-none" />

      {/* ========================================================
          SALON HEADER & CURATORIAL CONTROLS
          ======================================================== */}
      <div className="w-full px-4 sm:px-8 lg:px-12 mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-20 text-left">
        <div>
          {/* Classical French Salon Crest */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#170307]/90 border border-[#d4af37]/40 shadow-md text-[#fae596] text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse shrink-0" />
            <span>AVZ VAULT 1-OF-1 ARCHIVE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-[0.08em] text-[#fff2cc] uppercase leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            THE ARCHIVE <span className="text-[#d4af37] font-normal italic">GALLERY</span>
          </h2>

          <p className="text-[#c5b099] text-xs sm:text-sm max-w-2xl font-serif italic mt-2.5 leading-relaxed">
            {cmsMuseum?.description ||
              'In a world drowning in fast fashion and AI generation, things made by real human hands are the ultimate luxury. 1-of-1 wearable art relics from our Guwahati studio.'}
          </p>
        </div>

        {/* Gallery Controls (Sound Toggle, Navigation, Admin Indicator) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-end">
          {/* Admin Curator Mode Pill (When logged in) */}
          {isAdmin && (
            <div className="px-3 py-1.5 bg-[#d4af37]/15 border border-[#d4af37] text-[#fae596] text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>STUDIO CURATOR ACTIVE</span>
            </div>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={handleToggleSound}
            className={`px-3.5 py-2 border transition-all text-xs font-mono tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-md ${
              soundEnabled
                ? 'bg-[#d4af37] text-black border-[#fae596] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'bg-[#150307]/80 text-[#d4af37] border-[#d4af37]/40 hover:border-[#d4af37]'
            }`}
            title={soundEnabled ? 'Mute Acoustic Guitar Melody' : 'Play Acoustic Guitar Melody'}
            aria-label={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-black" />
                <span>GUITAR MELODY ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>GUITAR MELODY OFF</span>
              </>
            )}
          </button>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByAmount(-450)}
              aria-label="Scroll Gallery Left"
              className="w-10 h-10 bg-[#150307]/80 border border-[#d4af37]/40 text-[#fae596] hover:bg-[#d4af37] hover:text-black hover:border-[#fae596] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByAmount(450)}
              aria-label="Scroll Gallery Right"
              className="w-10 h-10 bg-[#150307]/80 border border-[#d4af37]/40 text-[#fae596] hover:bg-[#d4af37] hover:text-black hover:border-[#fae596] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          CONTINUOUS HORIZONTAL SALON WALL CONTAINER
          ======================================================== */}
      <div
        ref={wallScrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onScroll={handleTrackScroll}
        className="w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none relative z-10 py-8 px-4 sm:px-12 scroll-smooth touch-pan-x"
        style={{
          minHeight: '620px'
        }}
      >
        {/* Salon Wall Composition: Paintings Staggered Asymmetrically across the Long Continuous Wall */}
        {/* Helper to build physical salon wall clusters */}
        <div className="inline-flex items-center gap-7 sm:gap-12 md:gap-14 min-h-[600px] pb-10">
          {(() => {
            // Group artworks into stacked 2-tier columns or single grand centerpieces
            const columns = [];
            let i = 0;
            let globalIdx = 0;

            while (i < artworks.length) {
              const current = artworks[i];
              const next = artworks[i + 1];

              const currentPos = current.metadata?.wall_position;
              const nextPos = next?.metadata?.wall_position;

              const isExplicitPair =
                (currentPos === 'upper' && nextPos === 'lower') ||
                (currentPos === 'lower' && nextPos === 'upper');

              if (next && isExplicitPair) {
                columns.push({
                  type: 'stack',
                  items: currentPos === 'lower' ? [next, current] : [current, next],
                  startIndex: globalIdx
                });
                i += 2;
                globalIdx += 2;
              } else {
                columns.push({
                  type: 'single',
                  items: [current],
                  startIndex: globalIdx
                });
                i += 1;
                globalIdx += 1;
              }
            }

            return columns.map((col, colIdx) => {
              if (col.type === 'stack') {
                return (
                  <div
                    key={`col-stack-${colIdx}`}
                    className="shrink-0 flex flex-col justify-between items-center gap-5 sm:gap-6 self-stretch min-h-[580px] py-1"
                  >
                    <AntiquePaintingFrame
                      artwork={col.items[0]}
                      index={col.startIndex}
                      isStacked={true}
                      onInspect={(artwork) => setSelectedArtwork(artwork)}
                      onAdminEdit={(artwork) => setEditingArtwork(artwork)}
                      isAdmin={isAdmin}
                    />
                    <AntiquePaintingFrame
                      artwork={col.items[1]}
                      index={col.startIndex + 1}
                      isStacked={true}
                      onInspect={(artwork) => setSelectedArtwork(artwork)}
                      onAdminEdit={(artwork) => setEditingArtwork(artwork)}
                      isAdmin={isAdmin}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={`col-single-${colIdx}`}
                  className="shrink-0 flex items-center justify-center self-stretch min-h-[580px] py-1"
                >
                  <AntiquePaintingFrame
                    artwork={col.items[0]}
                    index={col.startIndex}
                    isStacked={false}
                    onInspect={(artwork) => setSelectedArtwork(artwork)}
                    onAdminEdit={(artwork) => setEditingArtwork(artwork)}
                    isAdmin={isAdmin}
                  />
                </div>
              );
            });
          })()}

          {/* Terminal Salon Plaque / Invitation to Custom Orders */}
          <div className="self-center shrink-0 w-[300px] sm:w-[360px] p-8 bg-[#180409]/95 border-2 border-[#d4af37] shadow-2xl text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fae596] to-[#b3892c] flex items-center justify-center text-black font-serif text-lg font-bold shadow-md">
              ✦
            </div>
            <h3 className="text-lg font-serif font-bold text-[#fff2cc] uppercase tracking-wider">
              THE BESPOKE CUSTOM STUDIO
            </h3>
            <p className="text-xs font-serif italic text-[#c5b099] leading-relaxed">
              Every specimen in our permanent archive is a handcrafted one-of-one relic. Recreations and custom silhouettes can be commissioned directly with Master Artisan Dhrisni.
            </p>
            <button
              onClick={() => {
                playSound('subdrop');
                if (onRequestCustomCommission) {
                  onRequestCustomCommission('Bespoke Custom Piece');
                } else {
                  document.getElementById('custom')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="py-3 px-6 bg-gradient-to-r from-[#b3892c] via-[#fae596] to-[#b3892c] text-black font-serif font-bold text-xs tracking-[0.16em] uppercase cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-xl"
            >
              COMMISSION AN ARCHIVAL RELIC ↗
            </button>
          </div>
        </div>
      </div>

      {/* Visual Navigation Hint (Bottom Center) */}
      <div className="w-full flex items-center justify-center mt-2 relative z-20 pointer-events-none">
        <span className="text-[10px] font-mono text-[#d4af37]/70 tracking-[0.28em] uppercase flex items-center gap-2">
          <span>←</span>
          <span>DRAG HORIZONTALLY TO EXPLORE THE VAULT</span>
          <span>→</span>
        </span>
      </div>

      {/* Classical Wooden Floor Skirting & Antique Brass Guard Rail */}
      <div className="museum-brass-rail" />
      <div className="museum-floor-runner" />

      {/* ========================================================
          MODAL OVERLAYS (INSPECT DOSSIER & QUICK FRAME EDITOR)
          ======================================================== */}
      {selectedArtwork && (
        <MuseumArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onRequestCustomCommission={onRequestCustomCommission}
        />
      )}

      {editingArtwork && (
        <QuickFrameEditorModal
          artwork={editingArtwork}
          onClose={() => setEditingArtwork(null)}
          onSaveSuccess={handleArtworkSaved}
          onDeleteSuccess={handleArtworkDeleted}
        />
      )}
    </section>
  );
}
