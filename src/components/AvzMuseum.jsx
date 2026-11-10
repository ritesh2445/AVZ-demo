'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
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
import { playSound } from '../utils/audio';
import { INITIAL_GALLERY_ARTWORKS } from '../data/initialGalleryArtworks';

// Initial fallback archive pieces ensuring zero empty screen
const FALLBACK_ARTWORKS = INITIAL_GALLERY_ARTWORKS;

export default function AvzMuseum({ onRequestCustomCommission, theme = 'dark', cmsMuseum }) {
  const [artworks, setArtworks] = useState(FALLBACK_ARTWORKS);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
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

  // Ref to track user interaction and auto-drift state
  const isUserInteractingRef = useRef(false);
  const userInteractionTimeoutRef = useRef(null);
  const driftDirectionRef = useRef(1); // 1 = slide right, -1 = slide left
  const autoDriftRafRef = useRef(null);
  const floatScrollPosRef = useRef(0);

  const notifyUserInteraction = useCallback(() => {
    isUserInteractingRef.current = true;
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    // Resume gentle auto-drift 1.5s after user ceases active interaction
    userInteractionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 1500);
  }, []);

  // Continuous slow horizontal auto-drift from one end to another
  useEffect(() => {
    let lastTime = performance.now();

    const driftLoop = (currentTime) => {
      const dt = Math.min(currentTime - lastTime, 80);
      lastTime = currentTime;

      const el = wallScrollRef.current;
      const isModalLocked = typeof document !== 'undefined' && document.body.classList.contains('modal-scroll-locked');
      if (el && !isUserInteractingRef.current && !isDraggingRef.current && !isModalLocked) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 15) {
          // Keep float position synced if DOM position drifted or user manually navigated
          if (Math.abs(el.scrollLeft - floatScrollPosRef.current) > 3) {
            floatScrollPosRef.current = el.scrollLeft;
          }

          // Slow, elegant gallery glide (~30 pixels per second)
          const step = (dt / 1000) * 40 * driftDirectionRef.current;
          floatScrollPosRef.current += step;

          // Gently reverse when reaching boundaries so it glides back and forth
          if (floatScrollPosRef.current >= maxScroll - 1) {
            floatScrollPosRef.current = maxScroll - 1;
            driftDirectionRef.current = -1;
          } else if (floatScrollPosRef.current <= 1) {
            floatScrollPosRef.current = 1;
            driftDirectionRef.current = 1;
          }

          el.scrollLeft = floatScrollPosRef.current;
        }
      }

      autoDriftRafRef.current = requestAnimationFrame(driftLoop);
    };

    autoDriftRafRef.current = requestAnimationFrame(driftLoop);

    return () => {
      if (autoDriftRafRef.current) cancelAnimationFrame(autoDriftRafRef.current);
      if (userInteractionTimeoutRef.current) clearTimeout(userInteractionTimeoutRef.current);
    };
  }, []);

  // 3. Trackpad & Wheel: never hijack vertical page scroll
  const handleWheel = (e) => {
    // Only detect intentional horizontal trackpad gestures
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      notifyUserInteraction();
    }
    // Vertical scrolling (deltaY) is NEVER hijacked so users can scroll past unimpeded
  };

  // 4. Click-and-Drag / Pointer Movement Physics for Natural Inertia
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    const el = wallScrollRef.current;
    if (!el) return;
    notifyUserInteraction();

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
    notifyUserInteraction();

    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
    const now = Date.now();

    lastPosRef.current = e.pageX;
    lastMoveTimeRef.current = now;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      notifyUserInteraction();
    }
  };

  // 5. Continuous Scroll Listener (Passive velocity tracking; does NOT trigger pause)
  const handleTrackScroll = useCallback(() => {
    const el = wallScrollRef.current;
    if (!el) return;

    const currentLeft = el.scrollLeft;
    const now = Date.now();
    lastScrollLeftRef.current = currentLeft;
    lastScrollTimeRef.current = now;
  }, []);

  // 6. Arrow Key and Button Navigation
  const scrollByAmount = (offset) => {
    const el = wallScrollRef.current;
    if (!el) return;
    notifyUserInteraction();
    playSound('whoosh');
    el.scrollBy({ left: offset, behavior: 'smooth' });
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

  // Ensure 100% unique artworks inside The Archive Gallery (no double entry of any piece)
  const uniqueArtworks = useMemo(() => {
    const seen = new Set();
    return (artworks || []).filter((a) => {
      const key = (a.title || a.id || a.primary_image || a.image_url || '').toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [artworks]);

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
              'In a world drowning in fast fashion and AI generation, things made by real human hands are the ultimate luxury. 1-of-1 wearable art relics from our Studio.'}
          </p>
        </div>

        {/* Gallery Controls (Sound Toggle, Navigation) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-end">
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
        onTouchStart={() => { isUserInteractingRef.current = true; }}
        onTouchEnd={() => { notifyUserInteraction(); }}
        onScroll={handleTrackScroll}
        className="w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none relative z-10 py-8 px-4 sm:px-12 touch-pan-x"
        style={{
          minHeight: '620px',
          scrollBehavior: 'auto'
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

            while (i < uniqueArtworks.length) {
              const current = uniqueArtworks[i];
              const next = uniqueArtworks[i + 1];

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
