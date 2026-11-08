import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Sparkles,
  ArrowUpRight,
  Search,
  Eye,
  LayoutGrid,
  Layers,
  Shirt,
  Gem,
  Link,
  CircleDot,
  ShoppingBag,
  Heart,
  Flame,
  Scissors,
  Sliders,
  Footprints,
  Crown,
  Link2,
  Shield,
  Boxes,
  Wand2,
  Users,
  Truck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, MATERIALS, formatPrice } from '../data/brandData';
import { playSound } from '../utils/audio';

const CATEGORY_ICONS = {
  'All': LayoutGrid,
  'Jackets': Layers,
  'Tops': Shirt,
  'Earrings': Gem,
  'Neckpieces': Link,
  'Arm cuffs': CircleDot,
  'Bags': ShoppingBag,
  'Corsets': Heart,
  'Bralettes': Flame,
  'Pants': Scissors,
  'Skirts': Sliders,
  'Leg warmers': Footprints,
  'Headgear': Crown,
  'Belts': Link2,
  'Body chainmail': Shield,
  'Co-ord sets': Boxes,
  'Custom-order pieces': Wand2,
};

/**
 * KeyArchiveCarousel:
 * Normal, cool, smooth horizontal product carousel for Key Archive Pieces.
 * Tactile arrow controls, touch swipe, upright cards, and progress bar.
 */
function KeyArchiveCarousel({
  items = [],
  onSelectProduct,
  onAddToCart,
  currency = 'INR',
  onToggleWishlist,
  wishlistIds = [],
  currentUser,
  onOpenAuthModal,
  onRequestCustom
}) {
  const trackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const total = items.length;
  const scrollRafRef = useRef(null);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;
    setCanScrollLeft(current > 10);
    setCanScrollRight(current < maxScroll - 10);

    const progress = maxScroll > 0 ? (current / maxScroll) * 100 : 0;
    setScrollProgress(progress);

    // Approximate active item index
    const cardWidth = el.querySelector('article')?.clientWidth || 320;
    const idx = Math.min(Math.round(current / (cardWidth + 20)), Math.max(0, total - 1));
    setActiveIdx(idx);
  };

  const handleTrackScroll = () => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      updateScrollState();
    });
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [items]);

  if (total === 0) return null;

  const scrollLeft = () => {
    playSound('pip');
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.querySelector('article')?.clientWidth || 320;
    trackRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
  };

  const scrollRight = () => {
    playSound('pip');
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.querySelector('article')?.clientWidth || 320;
    trackRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full mb-12 sm:mb-16 select-none text-left">
      {/* Carousel Header HUD */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/15 border border-pink/30 text-pink text-[10px] font-mono tracking-widest uppercase mb-2 font-semibold">
            <Crown className="w-3.5 h-3.5 text-pink" />
            <span>CURATED ARCHIVE • KEY PIECES</span>
          </div>
          <h3 className="text-lg sm:text-xl font-mono font-medium uppercase text-white tracking-[0.15em] leading-tight">
            KEY <span className="text-zinc-500 font-light">PIECES</span>
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm font-montserrat mt-1 max-w-xl">
            Distinguished wearable art pieces defined by unique design and handmade craftsmanship.
          </p>
        </div>

        {/* Carousel Arrow Controls & Counter */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
          <span className="text-xs font-mono text-zinc-400 tracking-wider">
            [ 0{activeIdx + 1} / 0{total} ]
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              aria-label="Previous Key Piece"
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-md ${canScrollLeft
                ? 'bg-black/80 hover:bg-white/15 border-white/20 text-white hover:border-pink active:scale-95'
                : 'bg-black/40 border-white/10 text-zinc-500 opacity-40 cursor-not-allowed'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              aria-label="Next Key Piece"
              className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-md ${canScrollRight
                ? 'bg-black/80 hover:bg-white/15 border-white/20 text-white hover:border-pink active:scale-95'
                : 'bg-black/40 border-white/10 text-zinc-500 opacity-40 cursor-not-allowed'
                }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Smooth Horizontal Carousel Track */}
      <div
        ref={trackRef}
        onScroll={handleTrackScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory touch-scroll-x py-4 px-4 sm:px-6 lg:px-8 justify-start items-stretch"
      >
        {items.map((item) => {
          const isWish = wishlistIds.includes(item.id);

          return (
            <article
              key={item.id}
              onClick={() => {
                playSound('metal');
                onSelectProduct(item);
              }}
              className="snap-start shrink-0 w-[260px] sm:w-[290px] lg:w-[310px] rounded-3xl border border-white/10 hover:border-pink/40 bg-[#0d0d12] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between group mobile-grunge-card text-left"
            >
              {/* Product Visual */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/95">
                <img
                  src={item.images ? item.images[0] : item.image}
                  alt={item.name}
                  decoding="async"
                  draggable={false} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity pointer-events-none" />

                {/* KeyArchive SOLD OUT Tag */}
                {item.stock === 0 ? (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 rounded-full bg-red-950/90 border border-red-500/70 text-red-200 text-[9px] font-mono tracking-widest uppercase font-bold shadow-lg backdrop-blur-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      SOLD OUT
                    </span>
                  </div>
                ) : item.stock === 1 ? (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-200 text-[9px] font-mono tracking-wider uppercase font-semibold backdrop-blur-md">
                      1 OF 1
                    </span>
                  </div>
                ) : item.stock <= 3 ? (
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-200 text-[9px] font-mono tracking-wider uppercase font-semibold backdrop-blur-md flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-amber-400" />
                      FEW REMAINING
                    </span>
                  </div>
                ) : null}

                

                {/* Wishlist Button */}
                {onToggleWishlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('snap');
                      onToggleWishlist(item);
                    }}
                    aria-label="Wishlist"
                    className="absolute top-3 right-3 z-20 p-2 flex items-center justify-center text-white/80 hover:text-pink-400 transition-all cursor-pointer active:scale-125 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                  >
                    <Heart className={`w-4 h-4 transition-all duration-200 ${isWish ? 'text-pink-400 fill-pink-400 scale-110' : 'text-white/90 hover:scale-110'}`} />
                  </button>
                )}



                {/* Quick View Hover Tag */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] pointer-events-none">
                  <span className="px-4 py-2 rounded-full bg-black/85 border border-white/25 text-white text-xs font-mono tracking-widest uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    VIEW DETAILS ↗
                  </span>
                </div>
              </div>

              {/* Product Info Block */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 border-t border-white/10 bg-[#0d0d12] text-left">
                <div>
                  <span className="text-[10px] font-mono text-pink tracking-widest uppercase block mb-1 font-semibold">
                    {item.socialTag || item.category}
                  </span>
                  <h4 className="font-mono text-sm sm:text-base font-semibold text-white group-hover:text-pink-200 transition-colors uppercase leading-snug line-clamp-1 mb-2">
                    {item.name}
                  </h4>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-sm sm:text-base font-mono font-bold text-white">
                      {formatPrice(item.price, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white flex items-center gap-0.5">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Shopify / Flipkart Style Full Action Button */}
                {item.stock === 0 ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('snap');
                      onRequestCustom?.(item.name);
                    }}
                    className="w-full mt-2.5 py-2 px-3 rounded-full bg-red-950/70 hover:bg-red-900 border border-red-500/60 text-red-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-red-300" />
                    <span>REQUEST PIECE</span>
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('snap');
                      onAddToCart?.({
                        ...item,
                        selectedSize: item.sizes ? item.sizes[0] : 'Free Size'
                      });
                    }}
                    className="w-full mt-2.5 py-2 px-3 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>ADD TO CART</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Progress Track Bar */}
      <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-pink via-purple-400 to-pink rounded-full transition-all duration-150"
          style={{ width: `${Math.max(15, scrollProgress)}%` }}
        />
      </div>
    </div>
  );
}

/**
 * MobileCompactProductCard:
 * Compact, smaller product frame specifically tailored for mobile view.
 * Displays multi-shot options directly on the card frame.
 */
function MobileCompactProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  currency = 'INR',
  onToggleWishlist,
  isWishlisted = false,
  currentUser,
  onOpenAuthModal,
  onRequestCustom
}) {
  const shots = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product.images, product.image]);

  const [activeShot, setActiveShot] = useState(0);
  const currentImg = shots[activeShot] || product.image;

  return (
    <article
      onClick={() => {
        playSound('metal');
        onSelectProduct(product);
      }}
      className="group shrink-0 w-[165px] sm:w-[185px] flex flex-col justify-between bg-[#0d0d12] border border-white/10 hover:border-pink/40 rounded-2xl overflow-hidden cursor-pointer shadow-md select-none text-left mobile-grunge-card"
    >
      {/* Compact Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/95">
        <img
          key={currentImg}
          src={currentImg}
          alt={product.name}
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover filter brightness-95 pointer-events-none transition-all duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 pointer-events-none" />

        {/* MobileCompact SOLD OUT Tag */}
        {product.stock === 0 ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-red-950/90 border border-red-500/70 text-red-200 text-[8px] font-mono tracking-wider uppercase font-bold backdrop-blur-md">
              SOLD OUT
            </span>
          </div>
        ) : product.stock === 1 ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-200 text-[8px] font-mono tracking-wider uppercase backdrop-blur-md">
              1 OF 1
            </span>
          </div>
        ) : product.stock <= 3 ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="px-1.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-200 text-[8px] font-mono tracking-wider uppercase backdrop-blur-md">
              FEW REMAINING
            </span>
          </div>
        ) : null}

        {/* Multi-shot indicator & dot switchers */}
        {shots.length > 1 && (
          <>
            <div className="absolute top-2 right-9 z-10 pointer-events-none">
              <span className="px-1.5 py-0.5 rounded-full bg-black/80 border border-white/20 text-white/95 text-[8px] font-mono tracking-tight backdrop-blur-md">
                {activeShot + 1}/{shots.length}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-1 px-2 pointer-events-auto">
              {shots.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound('snap');
                    setActiveShot(idx);
                  }}
                  aria-label={`View shot ${idx + 1}`}
                  className={`h-1 rounded-full transition-all ${
                    activeShot === idx ? 'w-3.5 bg-pink shadow-[0_0_6px_rgba(244,63,94,0.8)]' : 'w-1 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Wishlist Button */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound('snap');
              onToggleWishlist(product);
            }}
            aria-label="Wishlist"
            className="absolute top-2 right-2 z-10 p-1 flex items-center justify-center text-white/80 hover:text-pink-400 transition-all cursor-pointer active:scale-125 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          >
            <Heart className={`w-3.5 h-3.5 transition-all duration-200 ${isWishlisted ? 'text-pink-400 fill-pink-400 scale-110' : 'text-white/90 hover:scale-110'}`} />
          </button>
        )}
      </div>

      {/* Compact Info Details */}
      <div className="p-2.5 flex flex-col justify-between flex-1 border-t border-white/10 bg-[#0d0d12] text-left">
        <div>
          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block truncate mb-0.5">
            {product.category}
          </span>
          <h4 className="font-mono text-xs font-semibold text-white uppercase leading-snug line-clamp-1 mb-1">
            {product.name}
          </h4>
        </div>

        {/* Price & Mini Bag Action */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/10 mt-1">
          <span className="text-xs font-mono font-bold text-white">
            {formatPrice(product.price, currency)}
          </span>

          {product.stock === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound('snap');
                onRequestCustom?.(product.name);
              }}
              className="px-2 py-1 rounded-full bg-red-950/70 border border-red-500/60 text-red-200 text-[9px] font-mono font-bold uppercase"
            >
              REQUEST
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound('snap');
                onAddToCart?.({
                  ...product,
                  selectedSize: product.sizes ? product.sizes[0] : 'Free Size'
                });
              }}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-[9px] uppercase flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-2.5 h-2.5 stroke-[2.5]" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * DesktopCatalogueCard:
 * Full featured product card with multi-shot switcher in frame,
 * dots navigation, and seamless link to product details modal.
 */
function DesktopCatalogueCard({
  product,
  onSelectProduct,
  onAddToCart,
  currency = 'INR',
  onToggleWishlist,
  isWish = false,
  onRequestCustom
}) {
  const shots = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.image ? [product.image] : [];
  }, [product.images, product.image]);

  const [activeShot, setActiveShot] = useState(0);

  const handlePrevShot = (e) => {
    e.stopPropagation();
    playSound('snap');
    setActiveShot((prev) => (prev > 0 ? prev - 1 : shots.length - 1));
  };

  const handleNextShot = (e) => {
    e.stopPropagation();
    playSound('snap');
    setActiveShot((prev) => (prev < shots.length - 1 ? prev + 1 : 0));
  };

  const currentImg = shots[activeShot] || product.image;

  return (
    <article
      onClick={() => {
        playSound('metal');
        onSelectProduct(product);
      }}
      className="group relative flex flex-col justify-between bg-[#0d0d12] border border-white/10 hover:border-pink/40 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl mobile-grunge-card"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/95">
        <img
          key={currentImg}
          src={currentImg}
          alt={`${product.name} shot ${activeShot + 1}`}
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105 pointer-events-none"
        />

        {/* Dark Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-75 group-hover:opacity-40 transition-opacity pointer-events-none" />

        {/* Desktop Grid SOLD OUT Tag */}
        {product.stock === 0 ? (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-red-950/90 border border-red-500/70 text-red-200 text-[10px] font-mono tracking-widest uppercase font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              SOLD OUT
            </span>
          </div>
        ) : product.stock === 1 ? (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-200 text-[9px] font-mono tracking-wider uppercase font-semibold backdrop-blur-md">
              1 OF 1
            </span>
          </div>
        ) : product.stock <= 3 ? (
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-200 text-[9px] font-mono tracking-wider uppercase font-semibold backdrop-blur-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              FEW REMAINING
            </span>
          </div>
        ) : null}

        {/* Multi-shot switcher buttons & badge */}
        {shots.length > 1 && (
          <>
            <div className="absolute top-3 right-12 z-20 pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-white/95 text-[9px] font-mono tracking-wider backdrop-blur-md shadow-md">
                {activeShot + 1} / {shots.length} SHOTS
              </span>
            </div>

            {/* In-Frame Switchers */}
            <button
              onClick={handlePrevShot}
              aria-label="Previous shot"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-pink text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-lg active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextShot}
              aria-label="Next shot"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 hover:border-pink text-white/80 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md shadow-lg active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Dots */}
            <div className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5 px-3 pointer-events-auto">
              {shots.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound('snap');
                    setActiveShot(idx);
                  }}
                  aria-label={`View shot ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeShot === idx
                      ? 'w-5 bg-pink shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                      : 'w-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Wishlist Heart Toggle */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound('snap');
              onToggleWishlist(product);
            }}
            aria-label="Wishlist"
            className="absolute top-3 right-3 z-20 p-2 flex items-center justify-center text-white/80 hover:text-pink-400 transition-all cursor-pointer active:scale-125 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            <Heart className={`w-4 h-4 transition-all duration-200 ${isWish ? 'text-pink-400 fill-pink-400 scale-110' : 'text-white/90 hover:scale-110'}`} />
          </button>
        )}

        {/* Quick View Hover State */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px] pointer-events-none">
          <span className="px-4 py-1.5 rounded-full bg-black/85 border border-white/25 text-white text-[11px] font-mono tracking-widest uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
            VIEW DETAILS ↗
          </span>
        </div>
      </div>

      {/* Product Card Details */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 border-t border-white/10 bg-[#0d0d12] text-left">
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase mb-1.5 tracking-wider">
            <span className="truncate">{product.category}</span>
            <span className="text-zinc-400 font-medium ml-1 shrink-0">{product.subCategory}</span>
          </div>

          <h3 className="font-mono text-sm sm:text-base font-medium text-white group-hover:text-pink-200 transition-colors uppercase leading-snug line-clamp-1 mb-2 text-left">
            {product.name}
          </h3>
        </div>

        {/* Price & Action Button Row */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
          <div className="flex flex-col text-left">
            <span className="text-sm sm:text-base font-mono font-bold text-white group-hover:text-pink-200 transition-colors text-left">
              {formatPrice(product.price, currency)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white flex items-center gap-0.5">
              <span>DETAILS</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Shopify / Flipkart Style Full Action Button */}
        {product.stock === 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound('snap');
              onRequestCustom?.(product.name);
            }}
            className="w-full mt-3 py-2.5 px-3 rounded-full bg-red-950/70 hover:bg-red-900 border border-red-500/60 text-red-200 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-red-300" />
            <span>REQUEST PIECE</span>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              playSound('snap');
              onAddToCart?.({
                ...product,
                selectedSize: product.sizes ? product.sizes[0] : 'Free Size'
              });
            }}
            className="w-full mt-3 py-2.5 px-3 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ADD TO CART</span>
          </button>
        )}
      </div>
    </article>
  );
}

function ShopCatalogue({
  products: initialProducts,
  onSelectProduct,
  onAddToCart,
  currency = 'INR',
  initialCategory = 'All',
  onToggleWishlist,
  wishlistIds = [],
  onOpenSquadModal,
  currentUser,
  onOpenAuthModal,
  onRequestCustom
}) {
  const activeProducts = Array.isArray(initialProducts) && initialProducts.length > 0 ? initialProducts : PRODUCTS;
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState('All Materials');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesMaterial =
        selectedMaterial === 'All Materials' ||
        (item.materials && item.materials.includes(selectedMaterial));

      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesMaterial && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });
  }, [activeProducts, selectedCategory, selectedMaterial, sortBy, searchQuery]);

  // Curated Best-sellers for Key Archive Pieces Carousel
  const bestsellers = useMemo(() => {
    // Curated or featured active products directly from live database
    const featured = activeProducts.filter((p) => p.featured || p.is_featured);
    const pool = featured.length >= 4 ? featured : activeProducts;
    return pool.slice(0, 8).map((prod, idx) => ({
      ...prod,
      rank: `EDITION ${String(idx + 1).padStart(2, '0')}`,
      badge: prod.stock === 0 ? 'SOLD OUT' : prod.stock === 1 ? '1 OF 1 ARCHIVE' : 'STUDIO PIECE',
      socialTag: (prod.category || 'AVZ ATELIER').toUpperCase()
    }));
  }, [activeProducts]);

  // Sections for Mobile View Carousels
  const mobileSections = useMemo(() => {
    return [
      {
        id: 'corsets-tops',
        title: 'CORSETRY & SCULPTURAL BODICES',
        badge: '01 • SIGNATURE',
        items: activeProducts.filter((p) => ['corsets', 'bralettes', 'tops'].includes(p.category.toLowerCase()))
      },
      {
        id: 'outerwear-jackets',
        title: 'ARMOR & REWORKED JACKETS',
        badge: '02 • HEAVY ART',
        items: activeProducts.filter((p) => ['jackets'].includes(p.category.toLowerCase()))
      },
      {
        id: 'jewelry-hardware',
        title: 'HARDWARE JEWELRY & RECLAIMED ACCENTS',
        badge: '03 • ARTIFACTS',
        items: activeProducts.filter((p) => ['earrings', 'neckpieces', 'arm cuffs', 'belts', 'body chainmail'].includes(p.category.toLowerCase()))
      },
      {
        id: 'lower-sets',
        title: 'RUNWAY SILHOUETTES & CO-ORD SETS',
        badge: '04 • STRUCTURE',
        items: activeProducts.filter((p) => ['pants', 'skirts', 'co-ord sets', 'bags'].includes(p.category.toLowerCase()))
      }
    ].filter((sec) => sec.items.length > 0);
  }, [activeProducts]);

  return (
    <section id="shop" className="w-full py-10 sm:py-14 px-4 sm:px-8 lg:px-12 bg-transparent select-none border-t border-white/10 relative text-left">
      {/* Background Subtle Violet Ambient Bloom */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#32082b]/20 rounded-full blur-[170px] pointer-events-none" />

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 pb-5 border-b border-white/10 relative z-10 text-left">
        <div className="text-left">
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span>COLLECTION 01 • ARCHIVAL SILHOUETTES</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono font-medium tracking-[0.16em] text-white uppercase leading-tight">
            COLLECTION <span className="text-zinc-500 font-light">ARCHIVE</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-montserrat mt-1.5 sm:mt-2 leading-relaxed text-left">
            1-of-1 sculptural corsets, chainmail breastplates, and tailored outerwear handcrafted in our Guwahati studio.
          </p>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            SHOWING: <strong className="text-white font-mono">{filteredProducts.length}</strong> PIECES
          </span>
        </div>
      </div>

      {/* =========================================================================
          KEY ARCHIVE PIECES (NORMAL COOL HORIZONTAL SLIDING CAROUSEL)
          ========================================================================= */}
      <KeyArchiveCarousel
        items={bestsellers}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        currency={currency}
        onToggleWishlist={onToggleWishlist}
        wishlistIds={wishlistIds}
      />

      {/* Studio Craft & Service Ribbon */}
      <div className="mb-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-zinc-300 relative z-10 text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-pink shrink-0" />
          <span>Handcrafted Wearable Art</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-pink shrink-0" />
          <span>Express Courier Above ₹5k</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-pink shrink-0" />
          <span>Custom Fit Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-pink shrink-0" />
          <span>Direct Studio Support</span>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="mb-10 space-y-6 relative z-10">
        {/* Horizontal Category Scroller with Icons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 ">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || LayoutGrid;
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const count = cat === 'All' ? activeProducts.length : activeProducts.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  playSound('snap');
                  setSelectedCategory(cat);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${isSelected
                  ? 'bg-[#be185d]/30 text-white border-[#f472b6] shadow-[0_0_15px_rgba(190,24,93,0.4)] font-bold'
                  : 'bg-white/5 text-silver/70 border-white/10 hover:border-white/25 hover:text-white'
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#f472b6]' : 'text-silver/50'}`} />
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-pink-500/40 text-white' : 'bg-white/10 text-silver/50'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Material & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          {/* Material Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-pink shrink-0" />
            <span className="text-[11px] font-mono text-silver/60 uppercase shrink-0">MATERIAL:</span>
            {MATERIALS.map((mat) => (
              <button
                key={mat}
                onClick={() => {
                  playSound('snap');
                  setSelectedMaterial(mat);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer border ${selectedMaterial === mat
                  ? 'bg-[#f472b6]/20 text-pink-300 border-[#f472b6] font-bold'
                  : 'bg-transparent text-silver/60 border-white/10 hover:border-white/20 hover:text-silver'
                  }`}
              >
                {mat}
              </button>
            ))}
          </div>

          {/* Search Box + Sort */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:min-w-[220px] sm:max-w-sm">
              <Search className="w-3.5 h-3.5 text-silver/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/80 border border-white/15 pl-10 pr-4 py-2 rounded-full text-xs text-white placeholder:text-silver/40 font-mono outline-none focus:border-pink transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-pink hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => {
                  playSound('snap');
                  setSortBy(e.target.value);
                }}
                className="bg-black/80 border border-white/15 text-silver text-xs font-mono px-2.5 sm:px-3.5 py-1.5 rounded-full outline-none focus:border-pink cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE VIEW: SECTION CAROUSELS WITH SMALLER PRODUCT FRAMES
          (When browsing all, each section has its own horizontal swipable carousel)
          ========================================================================= */}
      <div className="block md:hidden w-full space-y-10 mb-8">
        {selectedCategory === 'All' && searchQuery.trim() === '' && selectedMaterial === 'All Materials' ? (
          /* Render Section Carousels on Mobile for All */
          mobileSections.map((section) => (
            <div key={section.id} className="w-full text-left">
              <div className="flex items-center justify-between mb-3 px-1 border-b border-white/10 pb-2">
                <div>
                  <span className="text-[9px] font-mono text-pink tracking-widest uppercase block font-semibold">
                    {section.badge}
                  </span>
                  <h4 className="font-mono text-xs uppercase text-white font-medium tracking-wider">
                    {section.title}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  {section.items.length} {section.items.length === 1 ? 'PIECE' : 'PIECES'}
                </span>
              </div>

              {/* Swipable Section Carousel with Smaller Frames */}
              <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 touch-scroll-x">
                {section.items.map((prod) => (
                  <MobileCompactProductCard
                    key={prod.id}
                    product={prod}
                    onSelectProduct={onSelectProduct}
                    onAddToCart={onAddToCart}
                    currency={currency}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistIds.includes(prod.id)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Filtered Category Carousel or Grid on Mobile */
          <div>
            <div className="flex items-center justify-between mb-3 px-1 pb-2 border-b border-white/10">
              <span className="text-xs font-mono text-pink uppercase font-semibold">
                {selectedCategory} ARCHIVE ({filteredProducts.length})
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                SWIPABLE CAROUSEL
              </span>
            </div>
            <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 touch-scroll-x">
              {filteredProducts.map((prod) => (
                <MobileCompactProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  currency={currency}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistIds.includes(prod.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Products Complete View Section for Mobile */}
        <div className="pt-6 border-t border-white/15">
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-mono tracking-widest text-white uppercase font-bold">
              ALL AVAILABLE DESIGNS ({activeProducts.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {activeProducts.length} TOTAL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredProducts.map((product) => (
              <MobileCompactProductCard
                key={`all-${product.id}`}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                currency={currency}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP VIEW: FULL MULTI-COLUMN EDITORIAL SHOWCASE GRID (MD+ SCREENS)
          ========================================================================= */}
      <div className="hidden md:block w-full">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-white/15 p-8 bg-black/40 relative z-10">
            <p className="text-zinc-400 font-mono text-sm mb-4">
              No pieces found matching your current filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedMaterial('All Materials');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono text-white transition-all cursor-pointer"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 relative z-10 text-left">
            {filteredProducts.map((product) => {
              const isWish = wishlistIds.includes(product.id);

              return (
                <DesktopCatalogueCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  currency={currency}
                  onToggleWishlist={onToggleWishlist}
                  isWish={isWish}
                  onRequestCustom={onRequestCustom}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


export default React.memo(ShopCatalogue);
