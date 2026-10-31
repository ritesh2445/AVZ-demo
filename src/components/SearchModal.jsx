import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowUpRight, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { PRODUCTS, MUSEUM_ITEMS, formatPrice } from '../data/brandData';
import { playSound } from '../utils/audio';

const CATEGORIES = [
  { id: 'all', label: 'All Pieces' },
  { id: 'corset', label: 'Corsetry' },
  { id: 'armor', label: 'Hardware Armor' },
  { id: 'denim', label: 'Upcycled Denim' },
  { id: 'jewelry', label: 'Keycaps & Jewelry' },
  { id: 'archive', label: 'Archive Vault' }
];

const TRENDING_SEARCHES = [
  'Motherboard Corset',
  'Hardware Armor',
  'Cyberpunk Bralette',
  'Spike Cuff',
  'Keycap Necklace',
  'Upcycled Denim'
];

export default function SearchModal({ isOpen, onClose, onSelectProduct, currency = 'INR' }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Curated items for empty state
  const curatedPicks = useMemo(() => {
    return [
      PRODUCTS[0], // Motherboard Diva Top
      PRODUCTS[1], // Silicon Cyber Corset
      PRODUCTS[2]  // Industrial Spike Cuff
    ].filter(Boolean);
  }, []);

  // Filtered results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Map shop products
    let shopItems = PRODUCTS.map((p) => ({
      ...p,
      type: 'Shop Piece',
      badge: 'In Stock'
    }));

    // Map museum items
    let archiveItems = MUSEUM_ITEMS.map((m) => ({
      ...m,
      type: 'Archive Piece',
      badge: '1-of-1 Museum'
    }));

    let combined = [...shopItems, ...archiveItems];

    // Filter by category pill if not 'all'
    if (selectedCategory !== 'all') {
      combined = combined.filter((item) => {
        const catStr = (item.category || item.commissionTier || item.type || '').toLowerCase();
        const nameStr = (item.name || '').toLowerCase();
        const matStr = Array.isArray(item.materials)
          ? item.materials.join(' ').toLowerCase()
          : (item.materials || '').toLowerCase();

        if (selectedCategory === 'corset') {
          return catStr.includes('corset') || nameStr.includes('corset') || nameStr.includes('top') || nameStr.includes('bralette');
        }
        if (selectedCategory === 'armor') {
          return catStr.includes('armor') || nameStr.includes('armor') || matStr.includes('spikes') || matStr.includes('wire');
        }
        if (selectedCategory === 'denim') {
          return catStr.includes('denim') || catStr.includes('jacket') || matStr.includes('denim') || nameStr.includes('denim');
        }
        if (selectedCategory === 'jewelry') {
          return catStr.includes('jewelry') || catStr.includes('accessory') || nameStr.includes('keycap') || nameStr.includes('cuff') || nameStr.includes('earring');
        }
        if (selectedCategory === 'archive') {
          return item.type === 'Archive Piece';
        }
        return true;
      });
    }

    // Filter by query string
    if (!q) return combined;

    return combined.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = (item.category || '').toLowerCase().includes(q);
      const matchDesc = (item.description || item.story || '').toLowerCase().includes(q);
      const matchMat = Array.isArray(item.materials)
        ? item.materials.some((m) => m.toLowerCase().includes(q))
        : (item.materials || '').toLowerCase().includes(q);

      return matchName || matchCat || matchDesc || matchMat;
    });
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99998] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-start p-4 sm:p-6 pt-12 sm:pt-20 animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" data-surface="dark" className="search-modal-palette modal-card w-full max-w-2xl bg-[#0b0410]/95 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-left"
      >
        {/* Minimalist Command Search Input */}
        <div className="relative px-5 sm:px-6 pt-5 pb-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-pink/15 border border-pink/30 flex items-center justify-center text-pink shrink-0">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search wearable art, corsets, armor, runway pieces..."
            className="w-full bg-transparent text-sm sm:text-base text-white font-montserrat placeholder:text-zinc-500 outline-none text-left"
          />

          {query && (
            <button
              onClick={() => {
                playSound('pip');
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear query"
              className="p-1.5 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 shrink-0">
            <span>ESC</span>
          </div>

          <button
            onClick={() => {
              playSound('pip');
              onClose?.();
            }}
            aria-label="Close search"
            className="p-1.5 flex items-center justify-center text-zinc-400 hover:text-white hover:rotate-90 cursor-pointer shrink-0 transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimalist Horizontal Filter Pills */}
        <div className="px-5 sm:px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mr-1 shrink-0 hidden sm:inline">
            FILTER:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSound('pip');
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase transition-all shrink-0 cursor-pointer ${isActive
                    ? 'bg-pink text-black font-bold shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/8'
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[58vh] flex flex-col gap-4 text-left">
          {/* EMPTY QUERY STATE: TRENDING & CURATED PICKS */}
          {!query.trim() && selectedCategory === 'all' ? (
            <div className="space-y-6">
              {/* Trending Searches */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold block mb-2.5">
                  TRENDING SEARCHES
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        playSound('pip');
                        setQuery(item);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink/40 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-pink" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Pieces Showcase */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    CURATED SIGNATURE PIECES
                  </span>
                  <span className="text-[10px] font-mono text-pink tracking-wider uppercase">
                    1-of-1 Wearable Art
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {curatedPicks.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        playSound('metal');
                        onClose?.();
                        onSelectProduct(p);
                      }}
                      className="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink/40 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-black">
                        <img
                          src={p.images ? p.images[0] : p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-mono uppercase bg-black/70 backdrop-blur-md text-white border border-white/15">
                          {p.category}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-mono text-xs font-bold uppercase text-white truncate group-hover:text-pink transition-colors">
                          {p.name}
                        </h4>
                        <span className="font-mono text-xs text-zinc-300 block mt-1">
                          {formatPrice(p.price, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            /* NO RESULTS STATE */
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-mono text-sm font-bold text-white uppercase">
                  No Matching Pieces Found
                </h4>
                <p className="font-montserrat text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  No pieces matched "{query}". Dhrisni crafts bespoke 1-of-1 silhouettes on demand.
                </p>
              </div>
              <button
                onClick={() => {
                  playSound('snap');
                  onClose?.();
                  const customSec = document.getElementById('custom');
                  customSec?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-2 px-4 py-2 rounded-full bg-pink/15 border border-pink/35 text-pink hover:bg-pink/25 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
              >
                Request Bespoke Commission
              </button>
            </div>
          ) : (
            /* RESULTS LIST */
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  {results.length} {results.length === 1 ? 'PIECE FOUND' : 'PIECES FOUND'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  Click to view details
                </span>
              </div>

              {results.map((item) => {
                const img = item.images ? item.images[0] : item.image;
                const priceDisplay = item.price ? formatPrice(item.price, currency) : '1-of-1 Archive';
                const matPreview = Array.isArray(item.materials)
                  ? item.materials.slice(0, 2).join(' • ')
                  : (item.materials || '').slice(0, 45);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      playSound('metal');
                      onClose?.();
                      onSelectProduct(item);
                    }}
                    className="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink/40 transition-all cursor-pointer flex items-center justify-between gap-3.5"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-16 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                        <img
                          src={img}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-pink border border-pink/20">
                            {item.type}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400 uppercase truncate">
                            {item.category || item.commissionTier || 'Wearable Art'}
                          </span>
                        </div>
                        <h4 className="font-mono text-xs sm:text-sm font-bold text-white uppercase group-hover:text-pink transition-colors truncate">
                          {item.name}
                        </h4>
                        {matPreview && (
                          <p className="text-[10px] font-montserrat text-zinc-400 truncate mt-0.5">
                            {matPreview}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold text-white">
                        {priceDisplay}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 group-hover:bg-pink group-hover:text-black group-hover:border-pink flex items-center justify-center text-zinc-400 transition-all">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
