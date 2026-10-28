import React, { useState, useMemo } from 'react';
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
  MessageCircle
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

export default function ShopCatalogue({
  onSelectProduct,
  onAddToCart,
  currency = 'INR',
  initialCategory = 'All',
  onToggleWishlist,
  wishlistIds = [],
  onOpenSquadModal
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState('All Materials');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Material filter
      const matchesMaterial =
        selectedMaterial === 'All Materials' ||
        (item.materials && item.materials.includes(selectedMaterial));

      // Search query
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
  }, [selectedCategory, selectedMaterial, sortBy, searchQuery]);

  // Curated Atelier Selections
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
        badge: 'ATELIER PROTOTYPE',
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
        socialTag: '18 HRS ATELIER FINISH'
      }
    ];

    return list.map((item) => {
      const prod = PRODUCTS.find((p) => p.id === item.id);
      return prod ? { ...prod, ...item } : null;
    }).filter(Boolean);
  }, []);

  return (
    <section id="shop" className="w-full py-16 sm:py-24 px-4 sm:px-12 lg:px-20 bg-transparent select-none border-t border-white/10 relative">
      {/* Background Subtle Violet Ambient Bloom */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#32082b]/20 rounded-full blur-[170px] pointer-events-none" />

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-10 sm:mb-14 pb-6 sm:pb-8 border-b border-white/10 relative z-10 text-left">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 mb-3 text-silver/80 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
            <span>COLLECTION 01 // ARCHIVAL SILHOUETTES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-mono tracking-[0.2em] text-white uppercase leading-tight">
            WEARABLE ART <span className="text-zinc-400 font-light">CATALOGUE</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-montserrat mt-2 sm:mt-3 leading-relaxed text-left">
            1-of-1 sculptural corsets, motherboard breastplates, and tailored outerwear handcrafted in our Guwahati atelier.
          </p>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            SHOWING: <strong className="text-white font-mono">{filteredProducts.length}</strong> PIECES
          </span>
        </div>
      </div>

      {/* ========================================================
          CURATED ATELIER SELECTIONS (SOLID REFINED FRAMING)
          ======================================================== */}
      <div className="mb-16 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-white/15 text-zinc-300 text-[10px] font-mono tracking-widest uppercase mb-2">
              <Crown className="w-3 h-3 text-zinc-300" />
              <span>CURATED ATELIER SELECTIONS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-mono font-medium uppercase text-white tracking-[0.15em] leading-tight">
              KEY <span className="text-zinc-400">ARCHIVE PIECES</span>
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-montserrat mt-1 max-w-xl">
              Distinguished wearable art specimens defined by unique provenance and hand-forged materiality.
            </p>
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 tracking-wider uppercase shrink-0 flex items-center gap-1.5">
            <span>PERMANENT ATELIER ARCHIVE</span>
          </span>
        </div>

        {/* 4 Refined Selection Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {bestsellers.map((item) => {
            const isWish = wishlistIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => {
                  playSound('metal');
                  onSelectProduct(item);
                }}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 hover:border-white/30 bg-[#0d0d12] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl overflow-hidden mobile-grunge-card"
              >
                <div className="w-full h-full flex flex-col justify-between">
                  {/* Image Frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/95">
                    <img
                      src={item.images ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                    />

                    {/* Dark Vignette Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                    {/* Rank Pill */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                      <span className="px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[9px] font-mono tracking-widest uppercase shadow-md">
                        {item.rank}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-zinc-300 text-[8px] font-mono tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    {/* Provenance Tag */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-zinc-300 text-[9px] font-mono tracking-wide">
                        {item.provenance}
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    {onToggleWishlist && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playSound('snap');
                          onToggleWishlist(item);
                        }}
                        aria-label="Wishlist"
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 flex items-center justify-center text-white hover:text-pink-300 transition-all cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isWish ? 'text-pink-400 fill-pink-400' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-4 flex flex-col justify-between flex-1 text-left border-t border-white/10 bg-[#0d0d12]">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                        {item.socialTag}
                      </span>
                      <h4 className="font-mono text-sm sm:text-base font-medium text-white group-hover:text-pink-200 transition-colors uppercase leading-snug line-clamp-1 mb-2">
                        {item.name}
                      </h4>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
                      <div className="flex flex-col text-left">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                          PIECE
                        </span>
                        <span className="text-sm font-mono font-bold text-white">
                          {formatPrice(item.price, currency)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
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
                            title="Quick Add to Bag"
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-mono tracking-wider uppercase flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>BAG +</span>
                          </button>
                        )}

                        <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white flex items-center gap-0.5">
                          <span>VIEW</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Atelier Craft & Service Bar */}
      <div className="mb-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-zinc-300 relative z-10 text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Handcrafted Wearable Art</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Express Courier Above ₹5k</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Bespoke Sizing Verification</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Direct Atelier Concierge</span>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="mb-10 space-y-6 relative z-10">
        {/* Horizontal Category Scroller with Icons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 touch-pan-x">
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
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
                className={`px-3 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer border ${
                  selectedMaterial === mat
                    ? 'bg-[#f472b6]/20 text-pink-300 border-[#f472b6] font-bold'
                    : 'bg-transparent text-silver/60 border-white/10 hover:border-white/20 hover:text-silver'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>

          {/* Search Box + Sort - row on mobile */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 sm:flex-none sm:min-w-[220px] sm:max-w-sm">
              <Search className="w-3.5 h-3.5 text-silver/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/80 border border-white/15 pl-10 pr-4 py-2 rounded-full text-xs text-white placeholder:text-silver/40 font-mono outline-none focus:border-pink transition-colors"
              />
            </div>

            {/* Sort Selector */}
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

      {/* Enhanced Product Showcase Grid */}
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 relative z-10 text-left">
          {filteredProducts.map((product) => {
            const isWish = wishlistIds.includes(product.id);

            return (
              <article
                key={product.id}
                onClick={() => {
                  playSound('metal');
                  onSelectProduct(product);
                }}
                className="group relative flex flex-col justify-between bg-[#0d0d12] border border-white/10 hover:border-white/30 rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl mobile-grunge-card"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/95">
                  <img
                    src={product.images ? product.images[0] : product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                  />

                  {/* Dark Vignette Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-75 group-hover:opacity-40 transition-opacity" />

                  {/* Provenance Tag Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/15 text-white text-[9px] font-mono tracking-widest uppercase shadow-md">
                      {product.tag}
                    </span>
                    {product.stock === 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-zinc-300 text-[8px] font-mono tracking-wider shadow-sm flex items-center gap-1">
                        1 OF 1 ARCHIVE
                      </span>
                    )}
                  </div>

                  {/* Wishlist Heart Toggle */}
                  {onToggleWishlist && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('snap');
                        onToggleWishlist(product);
                      }}
                      aria-label="Wishlist"
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 flex items-center justify-center text-white hover:text-pink-300 transition-all cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWish ? 'text-pink-400 fill-pink-400' : ''}`} />
                    </button>
                  )}

                  {/* Clean Quick Action on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-black/85 border border-white/25 text-white text-xs font-mono tracking-widest uppercase shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      VIEW SPECIMEN ↗
                    </span>
                  </div>
                </div>

                {/* Product Card Details */}
                <div className="p-3 sm:p-5 flex flex-col justify-between flex-1 border-t border-white/10 bg-[#0d0d12] text-left">
                  <div>
                    <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase mb-1 sm:mb-1.5 tracking-wider">
                      <span className="truncate">{product.category}</span>
                      <span className="text-zinc-400 font-medium ml-1 shrink-0">{product.subCategory}</span>
                    </div>

                    <h3 className="font-mono text-sm sm:text-base font-medium text-white group-hover:text-pink-200 transition-colors uppercase leading-snug line-clamp-1 mb-1 sm:mb-2 text-left">
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
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/10 mt-auto">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest text-left">
                        PIECE
                      </span>
                      <span className="text-sm sm:text-base font-mono font-bold text-white group-hover:text-pink-200 transition-colors text-left">
                        {formatPrice(product.price, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
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
                          title="Quick Add to Bag"
                          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-mono tracking-wider uppercase flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>BAG +</span>
                        </button>
                      )}

                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/40 transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
