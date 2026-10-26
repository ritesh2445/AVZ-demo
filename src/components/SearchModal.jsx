import React, { useState, useMemo } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { PRODUCTS, MUSEUM_ITEMS, formatPrice } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function SearchModal({ isOpen, onClose, onSelectProduct, currency = 'INR' }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const productMatches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.materials && p.materials.some((m) => m.toLowerCase().includes(q)))
    ).map((p) => ({ ...p, type: 'Product' }));

    const museumMatches = MUSEUM_ITEMS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.materials.toLowerCase().includes(q) ||
        m.story.toLowerCase().includes(q)
    ).map((m) => ({ ...m, type: 'Archive Piece' }));

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
        className="w-full max-w-3xl bg-[#0d020f]/95 backdrop-blur-2xl border border-[#be185d]/35 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-white/15 pb-4 flex items-center gap-3">
          <Search className="w-6 h-6 text-[#f472b6] shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search 'motherboard', 'spikes', 'corset', 'denim'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xl sm:text-2xl text-white font-spartan font-bold outline-none placeholder:text-silver/40 text-left"
          />
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/20 bg-black/60 flex items-center justify-center text-silver hover:text-white hover:border-[#be185d] hover:bg-[#be185d]/20 cursor-pointer shrink-0 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="mt-6 overflow-y-auto max-h-[55vh] flex flex-col gap-3 pr-1 text-left">
          {query.trim() === '' ? (
            <div className="text-center py-12 text-silver/50 font-mono text-xs">
              Type keywords to scan the AVZ catalog and museum vault...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-silver/50 font-mono text-xs">
              No matching wearable art found for "{query}".
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
                className="flex items-center justify-between p-3.5 bg-white/[0.03] hover:bg-[#1a0520]/80 border border-white/10 hover:border-[#be185d]/50 rounded-2xl transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-4 text-left">
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-xl border border-white/10"
                  />
                  <div className="text-left">
                    <span className="text-[10px] font-mono text-[#f472b6] uppercase block text-left">
                      {item.type} // {item.category || item.commissionTier}
                    </span>
                    <h4 className="text-sm font-spartan font-bold text-white group-hover:text-pink-300 transition-colors uppercase text-left">
                      {item.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-pink-200">
                    {item.price ? formatPrice(item.price, currency) : item.year}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-silver/80 group-hover:text-pink-300 group-hover:border-[#be185d] group-hover:bg-[#be185d]/20 transition-all">
                    <ArrowUpRight className="w-4 h-4 text-silver/80 group-hover:text-pink-300 transition-colors" />
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
