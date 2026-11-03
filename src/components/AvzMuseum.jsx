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
import { playGalleryMoveSound, stopGalleryMoveSound } from '../utils/galleryAudio';
import { playSound } from '../utils/audio';

// Initial fallback archive pieces ensuring zero empty screen
const FALLBACK_ARTWORKS = [
  {
    id: 'art-005',
    title: 'Still Life with Telecom Motherboard & Copper Relics',
    artist: 'Dhrisni & The AVZ Atelier',
    image_url: '/assets/prod_motherboard_cuff.jpg',
    thumbnail_url: '/assets/prod_motherboard_cuff.jpg',
    description: 'Exposed golden solder joints, copper circuit paths, and salvaged telecommunication capacitors sculpted into an ergonomic wrist relic.',
    year: '2024',
    category: 'Wearable Hardware',
    frame_style: 'classical_cavetto',
    aspect_ratio: '4:3',
    width_px: 290,
    height_px: 218,
    display_order: 1,
    is_published: 1,
    metadata: {
      medium: 'Reclaimed telecommunication PCB boards, copper traces, Italian leather backing',
      dimensions_cm: '75 × 56 cm',
      provenance: 'Assam Industrial Heritage Vault',
      hanging_bracket: 'wire',
      wall_position: 'upper',
      sconce_light: false
    }
  },
  {
    id: 'art-004',
    title: 'Allegory of the Reworked Denim Relic',
    artist: 'Dhrisni',
    image_url: '/assets/product_reworked_jacket.jpg',
    thumbnail_url: '/assets/product_reworked_jacket.jpg',
    description: 'Eighteen deconstructed panels from an oversized vintage trucker jacket, rebuilt with tensile steel cable lacing and distressed distressing.',
    year: '2024',
    category: 'Tailored Relic',
    frame_style: 'antique_fillet',
    aspect_ratio: '1:1',
    width_px: 280,
    height_px: 280,
    display_order: 2,
    is_published: 1,
    metadata: {
      medium: 'Upcycled vintage denim, silver eyelets, aircraft tension cables',
      dimensions_cm: '70 × 70 cm',
      provenance: 'Private Collection, Mumbai',
      hanging_bracket: 'hidden',
      wall_position: 'lower',
      sconce_light: false
    }
  },
  {
    id: 'art-001',
    title: 'Portrait of the Cyber Empress in Gilded Armor',
    artist: 'Dhrisni & The AVZ Atelier',
    image_url: '/assets/editorial_hero_portrait.jpg',
    thumbnail_url: '/assets/editorial_hero_portrait.jpg',
    description: 'An archival masterwork featuring reclaimed computer motherboard breastplates, hand-beaded glass crystals, and heavy-gauge industrial brass wire over hand-tailored velvet.',
    year: '2023',
    category: 'Sculptural Breastplate',
    frame_style: 'ornate_baroque',
    aspect_ratio: '3:4',
    width_px: 380,
    height_px: 510,
    display_order: 3,
    is_published: 1,
    metadata: {
      medium: 'Salvaged microcircuits, patinated brass, hand-beaded crystal on tailored velvet',
      dimensions_cm: '78 × 104 cm',
      provenance: 'Guwahati Permanent Salon Collection',
      hanging_bracket: 'brass_chains',
      wall_position: 'center',
      sconce_light: true
    }
  },
  {
    id: 'art-002',
    title: 'Study in Raw Chrome Spikes & Distressed Denim',
    artist: 'Dhrisni',
    image_url: '/assets/look_spike_bodice.jpg',
    thumbnail_url: '/assets/look_spike_bodice.jpg',
    description: 'Sixty-four solid steel lathe-turned spikes hand-riveted onto reconstructed vintage Japanese denim, framed within an antique Italian rococo profile.',
    year: '2023',
    category: 'Armored Bodice',
    frame_style: 'gilded_rococo',
    aspect_ratio: '4:5',
    width_px: 290,
    height_px: 362,
    display_order: 4,
    is_published: 1,
    metadata: {
      medium: 'Steel spikes, upcycled 14oz indigo denim, polished brass grommets',
      dimensions_cm: '65 × 82 cm',
      provenance: 'Private Collection, Bangalore (Archival Loan)',
      hanging_bracket: 'wire',
      wall_position: 'upper',
      sconce_light: false
    }
  },
  {
    id: 'art-007',
    title: 'Composition with Hand-Strung Beadwork & Metal Shards',
    artist: 'Dhrisni & Guwahati Guild',
    image_url: '/assets/product_beaded_bralette.jpg',
    thumbnail_url: '/assets/product_beaded_bralette.jpg',
    description: 'Intricate micro-beadwork suspended between faceted hematite stones and polished scrap metal offcuts, creating fluid shimmering weight.',
    year: '2024',
    category: 'Haute Bijouterie',
    frame_style: 'ornate_baroque',
    aspect_ratio: '4:5',
    width_px: 280,
    height_px: 350,
    display_order: 5,
    is_published: 1,
    metadata: {
      medium: 'Hematite micro-beads, silver alloy offcuts, silk threading',
      dimensions_cm: '60 × 75 cm',
      provenance: 'Permanent Archive Showcase',
      hanging_bracket: 'wire',
      wall_position: 'lower',
      sconce_light: false
    }
  },
  {
    id: 'art-003',
    title: 'The Guwahati River Chainmail Nocturne',
    artist: 'AVZ Women Artisan Guild',
    image_url: '/assets/look_chainmail_armor.jpg',
    thumbnail_url: '/assets/look_chainmail_armor.jpg',
    description: 'Over 1,200 hand-threaded stainless steel rings woven by indigenous craftswomen in Guwahati over 45 uninterrupted atelier hours.',
    year: '2024',
    category: 'Fluid Chainmail',
    frame_style: 'florentine_gold',
    aspect_ratio: '3:4',
    width_px: 420,
    height_px: 560,
    display_order: 6,
    is_published: 1,
    metadata: {
      medium: 'Hand-linked 316L surgical stainless steel rings, industrial carabiners',
      dimensions_cm: '90 × 120 cm',
      provenance: 'Permanent Exhibition Pavilion',
      hanging_bracket: 'brass_chains',
      wall_position: 'center',
      sconce_light: true
    }
  },
  {
    id: 'art-006',
    title: 'The Altar of the Spiked Brassiere',
    artist: 'Dhrisni',
    image_url: '/assets/product_spike_bra.jpg',
    thumbnail_url: '/assets/product_spike_bra.jpg',
    description: 'A radical synthesis of classical Parisian lingerie silhouette with subcultural industrial hardware. Solid steel conical spikes anchored with reinforced rivets.',
    year: '2023',
    category: 'Subcultural Armor',
    frame_style: 'tarnished_brass',
    aspect_ratio: '3:4',
    width_px: 350,
    height_px: 466,
    display_order: 7,
    is_published: 1,
    metadata: {
      medium: 'Hand-pressed steel cones, black lambskin lining, adjustable nickel hardware',
      dimensions_cm: '68 × 90 cm',
      provenance: 'Atelier Archive No. 008',
      hanging_bracket: 'brass_chains',
      wall_position: 'center',
      sconce_light: false
    }
  },
  {
    id: 'art-008',
    title: 'The Cybernetic Diva in Full Regalia',
    artist: 'Dhrisni',
    image_url: '/assets/product_diva_top.jpg',
    thumbnail_url: '/assets/product_diva_top.jpg',
    description: 'Monumental one-of-one silhouette uniting high-contrast cybernetic motifs with traditional couture boning and hand-finished edges.',
    year: '2024',
    category: 'Monumental Couture',
    frame_style: 'gilded_rococo',
    aspect_ratio: '3:4',
    width_px: 400,
    height_px: 533,
    display_order: 8,
    is_published: 1,
    metadata: {
      medium: 'Boned silk corset, reclaimed alloy embellishments, raw steel closures',
      dimensions_cm: '85 × 114 cm',
      provenance: 'Guwahati Master Collection',
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

  // 3. Horizontal Wheel Navigation (Translates vertical mouse wheel to horizontal glide)
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

      const velocity = Math.abs(e.deltaY) / 100;
      playGalleryMoveSound(soundEnabled, velocity);
    } else if (Math.abs(e.deltaX) > 0) {
      playGalleryMoveSound(soundEnabled, Math.abs(e.deltaX) / 100);
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

    // Calculate velocity for realistic sound
    const now = Date.now();
    const dt = Math.max(1, now - lastMoveTimeRef.current);
    const dx = Math.abs(e.pageX - lastPosRef.current);
    const velocity = (dx / dt) * 10;

    playGalleryMoveSound(soundEnabled, velocity);

    lastPosRef.current = e.pageX;
    lastMoveTimeRef.current = now;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      stopGalleryMoveSound();
    }
  };

  // 5. Arrow Key and Button Navigation
  const scrollByAmount = (offset) => {
    const el = wallScrollRef.current;
    if (!el) return;
    playSound('whoosh');
    playGalleryMoveSound(soundEnabled, 1.5);
    el.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(() => stopGalleryMoveSound(), 500);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    playSound(next ? 'toggle_on' : 'toggle_off');
    if (next) {
      playGalleryMoveSound(true, 1.2);
      setTimeout(() => stopGalleryMoveSound(), 300);
    } else {
      stopGalleryMoveSound();
    }
  };

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
      {/* Authentic Stippled Plaster Damask Texture */}
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
            <span>L'ATELIER D'ART VAGANZA • PERMANENT SALON COLLECTION</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-[0.08em] text-[#fff2cc] uppercase leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            THE ARCHIVAL <span className="text-[#d4af37] font-normal italic">GALLERY WALL</span>
          </h2>

          <p className="text-[#c5b099] text-xs sm:text-sm max-w-2xl font-serif italic mt-2.5 leading-relaxed">
            {cmsMuseum?.description ||
              'A classical European salon hang of 1-of-1 wearable art relics, oil portraits, and archival silhouettes handcrafted in our Guwahati studio.'}
          </p>
        </div>

        {/* Gallery Controls (Sound Toggle, Navigation, Admin Indicator) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-end">
          {/* Admin Curator Mode Pill (When logged in) */}
          {isAdmin && (
            <div className="px-3 py-1.5 bg-[#d4af37]/15 border border-[#d4af37] text-[#fae596] text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>CURATOR MODE ACTIVE</span>
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
            title={soundEnabled ? 'Mute Gallery Movement Audio' : 'Enable Vintage Museum Movement Sound'}
            aria-label={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-black" />
                <span>SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>SOUND OFF</span>
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
              L'ATELIER SUR-MESURE
            </h3>
            <p className="text-xs font-serif italic text-[#c5b099] leading-relaxed">
              Every specimen in our permanent archive is a handcrafted one-of-one relic. Recreations and custom silhouettes can be commissioned directly with Master Artisan Dhrisni.
            </p>
            <button
              onClick={() => {
                playSound('subdrop');
                if (onRequestCustomCommission) {
                  onRequestCustomCommission('Atelier Custom Piece');
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
          <span>DRAG HORIZONTALLY TO EXPLORE GALLERY WALL</span>
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
