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
  Users
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

  return (
    <section id="shop" className="w-full py-24 px-6 sm:px-12 lg:px-20 bg-transparent select-none border-t border-white/10 relative">
      {/* Background True Dark Purple Velvet Bloom */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#32082b]/35 rounded-full blur-[170px] pointer-events-none" />

      {/* Top Squad Buy Announcement Banner */}
      <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#200424] via-[#35073c]/60 to-[#1b0320] border border-[#f472b6]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-full bg-pink/20 border border-pink flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-pink" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-pink-300 font-bold uppercase tracking-wider block">
              ✦ BADDIE SQUAD BUY ACTIVE // SPLIT & SAVE
            </span>
            <p className="text-xs sm:text-sm text-white font-spartan font-bold uppercase">
              Cop 1-of-1 grails together with besties & unlock 10% to 20% OFF!
            </p>
          </div>
        </div>

        {onOpenSquadModal && (
          <button
            onClick={() => {
              playSound('snap');
              onOpenSquadModal();
            }}
            className="btn-glass-pink py-2.5 px-5 text-xs font-spartan font-black tracking-widest uppercase shrink-0 cursor-pointer"
          >
            START SQUAD ORDER ↗
          </button>
        )}
      </div>

      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-white/10 relative z-10">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full btn-glass mb-3 text-pink text-[11px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink" />
            <span>DROP 01 // CERTIFIED BADDIE GRAILS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase tracking-tight text-white leading-none">
            WEARABLE ART <span className="chrome-text">CATALOGUE</span>
          </h2>
          <p className="text-silver/80 text-sm max-w-xl font-montserrat mt-4 leading-relaxed text-left">
            1-of-1 sculptural corsets, motherboard breastplates, and spiked outerwear hand-forged in our Guwahati atelier. Slay on your own terms.
          </p>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <span className="text-xs font-mono text-silver/60 uppercase">
            SHOWING: <strong className="text-pink">{filteredProducts.length}</strong> GRAILS
          </span>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="mb-10 space-y-6 relative z-10">
        {/* Horizontal Category Scroller with Icons */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 touch-pan-x">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || LayoutGrid;
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();

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
              </button>
            );
          })}
        </div>

        {/* Material & Sorting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          {/* Material Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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

          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-silver/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search spikes, keycaps, motherboard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/80 border border-white/15 pl-10 pr-4 py-2 rounded-full text-xs text-white placeholder:text-silver/40 font-mono outline-none focus:border-pink transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-pink" />
            <span className="text-[11px] font-mono text-silver/60 uppercase">SORT:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                playSound('snap');
                setSortBy(e.target.value);
              }}
              className="bg-black/80 border border-white/15 text-silver text-xs font-mono px-3.5 py-1.5 rounded-full outline-none focus:border-pink cursor-pointer"
            >
              <option value="featured">Featured grails</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Product Showcase Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center rounded-3xl border border-dashed border-white/15 p-8 bg-[#200520]/20 relative z-10">
          <p className="text-silver/60 font-mono text-sm mb-4">
            No grails found matching your current filter criteria bestie.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedMaterial('All Materials');
              setSearchQuery('');
            }}
            className="btn-glass text-xs"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 relative z-10 text-left">
          {filteredProducts.map((product) => {
            const isWish = wishlistIds.includes(product.id);

            return (
              <article
                key={product.id}
                onClick={() => {
                  playSound('metal');
                  onSelectProduct(product);
                }}
                className="group relative flex flex-col justify-between bg-gradient-to-b from-[#19041e]/90 via-[#0e0212]/95 to-black border border-white/10 hover:border-pink-600/70 rounded-3xl transition-all duration-500 overflow-hidden cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(190,24,93,0.4)] transform-gpu"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/90">
                  <img
                    src={product.images ? product.images[0] : product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-105"
                  />

                  {/* Seductive Dark Vignette Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-65 group-hover:opacity-40 transition-opacity" />

                  {/* Provenance Tag Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                    <span className="px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#be185d]/40 text-pink-300 text-[10px] font-spartan font-black tracking-widest uppercase shadow-md">
                      {product.tag}
                    </span>
                    {product.stock === 1 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#2a052c]/90 border border-[#be185d]/60 text-pink-200 text-[9px] font-mono tracking-wider shadow-sm flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-pink-400" />
                        1 OF 1 GRAIL
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
                      className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 hover:border-pink-400 flex items-center justify-center text-white hover:text-pink-300 transition-all cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWish ? 'text-pink-400 fill-pink-400' : ''}`} />
                    </button>
                  )}

                  {/* Quick Peek Action Pill on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <span className="btn-glass-pink shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      <span>INSPECT GRAIL</span>
                    </span>
                  </div>
                </div>

                {/* Product Card Details */}
                <div className="p-5 flex flex-col justify-between flex-1 border-t border-white/10 bg-[#0d020f]/95 text-left">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-silver/60 uppercase mb-1.5">
                      <span>{product.category}</span>
                      <span className="text-[#f472b6] font-medium">{product.subCategory}</span>
                    </div>

                    <h3 className="font-spartan font-black text-lg sm:text-xl text-white group-hover:text-pink-300 transition-colors uppercase leading-tight line-clamp-1 mb-2 text-left">
                      {product.name}
                    </h3>

                    {/* Materials Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {product.materials.slice(0, 2).map((mat) => (
                        <span
                          key={mat}
                          className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-[#be185d]/20 text-silver/80"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Button Row */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-mono text-silver/50 uppercase tracking-widest text-left">
                        ATELIER GRAIL
                      </span>
                      <span className="text-base font-spartan font-black text-white group-hover:text-pink-300 transition-colors text-left">
                        {formatPrice(product.price, currency)}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-silver/80 group-hover:text-pink-300 group-hover:border-[#be185d] group-hover:bg-[#be185d]/20 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
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
