import React from 'react';
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
  if (!isOpen) return null;

  const handleShareWishlist = () => {
    playSound('snap');
    const msg = encodeURIComponent(
      `Check out my gatekept wearable art wishlist from AVZ Vaganza! Obsessing over these 1-of-1 pieces 💕 https://aveezahvaganza.com`
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
        className="w-full max-w-xl bg-gradient-to-b from-[#18031d] via-black to-[#0e0210] border border-[#be185d]/40 rounded-3xl max-h-[88vh] flex flex-col justify-between overflow-hidden shadow-[0_25px_80px_rgba(40,2,40,0.9)] text-left"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-pink fill-pink" />
            <h2 className="text-lg font-spartan font-black uppercase text-white tracking-wider">
              YOUR VAULT STASH
            </h2>
            <span className="text-xs font-mono text-pink-300">({items.length} GRAILS)</span>
          </div>

          <button
            onClick={() => {
              playSound('pip');
              onClose();
            }}
            aria-label="Close wishlist"
            className="btn-glass p-2 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-silver/40">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-spartan font-bold uppercase text-white">
                YOUR STASH IS GIVING EMPTY
              </h3>
              <p className="text-xs font-montserrat text-silver/70 max-w-xs mx-auto">
                Tap the heart on any 1-of-1 piece to gatekeep it in your vault stash before another baddie snatches it.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#be185d]/50 flex items-center gap-4 transition-all"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                  <img
                    src={item.images ? item.images[0] : item.image}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-pink-300 uppercase tracking-widest block mb-1">
                    {item.tag || 'ONE OF ONE'}
                  </span>
                  <h4 className="text-sm font-spartan font-bold uppercase text-white truncate">
                    {item.name || item.title}
                  </h4>
                  <div className="text-xs font-mono text-[#f472b6] font-bold mt-1">
                    {item.price ? formatPrice(item.price, currency) : 'ARCHIVE PIECE'}
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
                    className="btn-glass-pink py-2 px-3 text-[10px] font-spartan font-black tracking-widest uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>BAG IT</span>
                  </button>

                  <button
                    onClick={() => {
                      playSound('trash');
                      onRemoveFromWishlist(item.id);
                    }}
                    className="text-silver/50 hover:text-red-400 text-[10px] font-mono flex items-center justify-center gap-1 transition-colors cursor-pointer"
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
          <div className="p-6 border-t border-white/10 bg-white/5 space-y-3">
            <button
              onClick={handleShareWishlist}
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE STASH WITH YOUR BESTIES</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
