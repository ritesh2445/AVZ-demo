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
  wishlistIds = []
}) {
  const trackRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);

  const total = items.length;
  const scrollRafRef = useRef(null);
  if (total === 0) return null;

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
    const idx = Math.min(Math.round(current / (cardWidth + 20)), total - 1);
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
                : 'bg-black/30 border-white/5 text-zinc-600 cursor-not-allowed'
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
                : 'bg-black/30 border-white/5 text-zinc-600 cursor-not-allowed'
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
                  loading="lazy"
                  draggable={false} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity pointer-events-none" />

                

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
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.materials?.slice(0, 2).map((m) => (
                      <span key={m} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      PIECE
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold text-white">
                      {formatPrice(item.price, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onAddToCart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound('snap');
                          onAddToCart({
                            ...item,
                            selectedSize: item.sizes ? item.sizes[0] : 'Free Size'
                          });
                        }}
                        title="Add to Bag"
                        aria-label="Add to Bag"
                        className="p-1.5 flex items-center justify-center text-white/80 hover:text-pink transition-all cursor-pointer active:scale-125 group/bag"
                      >
                        <ShoppingBag className="w-4 h-4 text-white group-hover/bag:text-pink transition-colors stroke-[2]" />
                      </button>
                    )}

                    <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white flex items-center gap-0.5">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
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
 * Eliminates gigantic bulky cards, offering fast, delightful browsing.
 */
function MobileCompactProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  currency = 'INR',
  onToggleWishlist,
  isWishlisted = false
}) {
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
          src={product.images ? product.images[0] : product.image}
          alt={product.name}
          loading="lazy"
          draggable={false} className="w-full h-full object-cover filter brightness-95 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

        

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

          {onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound('snap');
                onAddToCart({
                  ...product,
                  selectedSize: product.sizes ? product.sizes[0] : 'Free Size'
                });
              }}
              title="Quick Add"
              className="px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[9px] font-mono font-semibold uppercase flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <span>+</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ShopCatalogue({
  products: initialProducts,
  onSelectProduct,
  onAddToCart,
  currency = 'INR',
  initialCategory = 'All',
  onToggleWishlist,
  wishlistIds = [],
  onOpenSquadModal
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
    const list = [
      {
        id: 'avz-001',
        rank: 'EDITION 01',
        badge: 'ARCHIVE ICON',
        provenance: 'Sculptural Hardware Corsetry',
        socialTag: 'METALLIC ARCHITECTURE'
      },
      {
        id: 'avz-002',
        rank: 'EDITION 02',
        badge: 'STUDIO PROTOTYPE',
        provenance: 'Cold-Forged Raw Alloy',
        socialTag: 'RECLAIMED ALLOY'
      },
      {
        id: 'avz-003',
        rank: 'EDITION 03',
        badge: 'EDITORIAL VAULT',
        provenance: 'Zero-Waste Breastplate',
        socialTag: 'UPCYCLED CIRCUITRY'
      },
      {
        id: 'avz-004',
        rank: 'EDITION 04',
        badge: 'BESPOKE RUNWAY',
        provenance: 'Hand-Distressed Outerwear',
        socialTag: '18 HRS HANDMADE FINISH'
      },
      {
        id: 'avz-005',
        rank: 'EDITION 05',
        badge: 'MODULAR RUNWAY',
        provenance: 'Detachable Cargo Silhouette',
        socialTag: 'DECONSTRUCTED DENIM'
      },
      {
        id: 'avz-007',
        rank: 'EDITION 06',
        badge: 'TACTILE ARTIFACT',
        provenance: 'Mechanical Keycap Hardware',
        socialTag: 'CYBER MERMAIDCORE'
      }
    ];

    return list.map((item) => {
      const prod = activeProducts.find((p) => p.id === item.id || p.sku === item.id) || PRODUCTS.find((p) => p.id === item.id);
      return prod ? { ...prod, ...item } : null;
    }).filter(Boolean);
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
            1-of-1 sculptural corsets, motherboard breastplates, and tailored outerwear handcrafted in our Guwahati studio.
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

      {/* Atelier Craft & Service Ribbon */}
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
          <span>Bespoke Sizing Guarantee</span>
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
            const count = cat === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;

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
              ALL AVAILABLE DESIGNS ({PRODUCTS.length})
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              {PRODUCTS.length} TOTAL
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
                <article
                  key={product.id}
                  onClick={() => {
                    playSound('metal');
                    onSelectProduct(product);
                  }}
                  className="group relative flex flex-col justify-between bg-[#0d0d12] border border-white/10 hover:border-pink/40 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl mobile-grunge-card"
                >
                  {/* Product Image Frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/95">
                    <img
                      src={product.images ? product.images[0] : product.image}
                      alt={product.name}
                      loading="lazy"
                      draggable={false} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105 pointer-events-none"
                    />

                    {/* Dark Vignette Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-75 group-hover:opacity-40 transition-opacity pointer-events-none" />

                    

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
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px] image-overlay-text">
                      <span className="px-4 py-2 rounded-full bg-black/85 border border-white/25 text-white text-xs font-mono tracking-widest uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
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

                      {/* Materials Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {product.materials.slice(0, 2).map((mat) => (
                          <span
                            key={mat}
                            className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Button Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-left">
                          PIECE
                        </span>
                        <span className="text-sm sm:text-base font-mono font-bold text-white group-hover:text-pink-200 transition-colors text-left">
                          {formatPrice(product.price, currency)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onAddToCart && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSound('snap');
                              onAddToCart({
                                ...product,
                                selectedSize: product.sizes ? product.sizes[0] : 'Free Size'
                              });
                            }}
                            title="Add to Bag"
                            aria-label="Add to Bag"
                            className="p-1.5 flex items-center justify-center text-white/80 hover:text-pink transition-all cursor-pointer active:scale-125 group/bag"
                          >
                            <ShoppingBag className="w-4 h-4 text-white group-hover/bag:text-pink transition-colors stroke-[2]" />
                          </button>
                        )}

                        <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white flex items-center gap-0.5">
                          <span>VIEW</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
