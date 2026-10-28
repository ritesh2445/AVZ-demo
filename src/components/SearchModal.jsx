import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { PRODUCTS, MUSEUM_ITEMS, formatPrice } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function SearchModal({ isOpen, onClose, onSelectProduct, currency = 'INR' }) {
  const [query, setQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const productMatches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.materials && p.materials.some((m) => m.toLowerCase().includes(q)))
    ).map((p) => ({ ...p, type: 'Archive Specimen' }));

    const museumMatches = MUSEUM_ITEMS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.materials.toLowerCase().includes(q) ||
        m.story.toLowerCase().includes(q)
    ).map((m) => ({ ...m, type: 'Museum Piece' }));

    return [...productMatches, ...museumMatches];
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99998] bg-black/85 backdrop-blur-2xl flex flex-col items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-white/15 pb-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search archival pieces, corsetry, hardware..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white font-mono outline-none placeholder:text-zinc-500 text-left"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer shrink-0 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="mt-5 overflow-y-auto max-h-[50vh] flex flex-col gap-2.5 pr-1 text-left">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-zinc-500 font-mono text-xs">
              Type keywords to scan the AVZ catalog and museum archive...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 font-mono text-xs">
              No matching specimens found for "{query}".
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  playSound('metal');
                  onClose();
                  onSelectProduct(item);
                }}
                className="flex items-center justify-between p-3 bg-black/60 hover:bg-white/5 border border-white/10 hover:border-white/30 rounded-xl transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block text-left">
                      {item.type} // {item.category || item.commissionTier}
                    </span>
                    <h4 className="text-xs sm:text-sm font-mono font-medium text-white group-hover:text-zinc-200 transition-colors uppercase text-left">
                      {item.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white">
                    {item.price ? formatPrice(item.price, currency) : item.year}
                  </span>
                  <div className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
