import React, { useEffect } from 'react';
import { X, Heart, ShoppingBag, ArrowRight, Trash2, Share2, Sparkles } from 'lucide-react';
import { formatPrice } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function WishlistDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveFromWishlist,
  onAddToCart,
  currency = 'INR',
  onOpenSquadModal
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleShareWishlist = () => {
    playSound('snap');
    const msg = encodeURIComponent(
      `Explore my curated wearable art collection from AVZ Vaganza: https://avzvaganza.com`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99996] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl max-h-[88vh] flex flex-col justify-between overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-left"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-black/40 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <Heart className="w-4 h-4 text-white fill-white shrink-0" />
            <h2 className="text-xs sm:text-sm md:text-base font-mono font-medium uppercase text-white tracking-wider truncate">
              CURATED WISHLIST
            </h2>
            <span className="text-xs font-mono text-zinc-500 shrink-0">({items.length})</span>
          </div>

          <button
            onClick={() => {
              playSound('pip');
              onClose();
            }}
            aria-label="Close wishlist"
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-mono font-medium uppercase text-white tracking-wider">
                WISHLIST IS CURRENTLY EMPTY
              </h3>
              <p className="text-xs font-montserrat text-zinc-400 max-w-xs mx-auto">
                Save archival 1-of-1 pieces to your private wishlist for personal review.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-white/25 flex items-center gap-4 transition-all"
              >
                {/* Thumbnail */}
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">
                    {item.tag || 'ONE OF ONE'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-mono font-medium uppercase text-white truncate">
                    {item.name || item.title}
                  </h4>
                  <div className="text-xs font-mono text-white font-bold mt-1">
                    {item.price ? formatPrice(item.price, currency) : 'ARCHIVE SPECIMEN'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      playSound('click');
                      onAddToCart(item);
                      onRemoveFromWishlist(item.id);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white text-black hover:bg-zinc-200 text-[10px] font-mono font-semibold tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>ADD TO BAG</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound('trash');
                      onRemoveFromWishlist(item.id);
                    }}
                    className="text-zinc-500 hover:text-red-400 text-[10px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>REMOVE</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40">
            <button
              onClick={handleShareWishlist}
              className="w-full py-3 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>SHARE CURATED WISHLIST</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
