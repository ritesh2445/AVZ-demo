import React, { useState, useEffect } from 'react';
import { useModalScrollLock } from '../utils/modalScrollLock';
import { X, Heart, ShoppingBag, ArrowRight, Trash2, Share2, Sparkles, Check, MessageCircle } from 'lucide-react';
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
  useModalScrollLock(Boolean(isOpen));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Normalize incoming wishlist items and ensure resilient structure
  const normalizedItems = (items || []).filter(Boolean).map((item) => {
    if (typeof item === 'string') {
      return {
        id: item,
        name: 'Archival Vault Piece',
        title: 'Archival Vault Piece',
        price: null,
        images: ['/assets/editorial_hero_portrait.jpg'],
        image: '/assets/editorial_hero_portrait.jpg',
        tag: 'ARCHIVE 1-OF-1'
      };
    }
    return item;
  });

  const getShareableData = () => {
    const origin = typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://aveezahvaganza.com';
    const itemIds = normalizedItems.map((it) => it.id || it.slug).filter(Boolean);
    const shareUrl = `${origin}/?wishlist=${encodeURIComponent(itemIds.join(','))}`;
    const titles = normalizedItems.slice(0, 3).map((it) => `• ${it.title || it.name}`).join('\n');
    const extra = normalizedItems.length > 3 ? `\n...and ${normalizedItems.length - 3} more pieces` : '';
    const shareText = `Explore my curated wearable art collection from AVZ Vaganza (${normalizedItems.length} piece${normalizedItems.length > 1 ? 's' : ''}):\n\n${titles}${extra}\n\nUnlock my curated vault:\n${shareUrl}`;
    return { shareUrl, shareText };
  };

  const handleCopyLink = async () => {
    playSound('snap');
    const { shareUrl } = getShareableData();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      playSound('pip');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback prompt if clipboard fails
      window.prompt('Copy your curated wishlist link:', shareUrl);
    }
  };

  const handleShareWishlist = async () => {
    playSound('snap');
    const { shareUrl } = getShareableData();

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Curated Wearable Art Collection — AVZ Vaganza',
          text: `Check out my curated wearable art collection from AVZ Vaganza:`,
          url: shareUrl
        });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }

    await handleCopyLink();
  };

  const handleShareWhatsApp = () => {
    playSound('snap');
    const { shareText } = getShareableData();
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99996] bg-black/92 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overscroll-contain animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" data-surface="dark" className="wishlist-drawer modal-card w-full max-w-xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl max-h-[88vh] flex flex-col justify-between overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-left"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-black/40 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <Heart className="w-4 h-4 text-white fill-white shrink-0" />
            <h2 className="text-xs sm:text-sm md:text-base font-mono font-medium uppercase text-white tracking-wider truncate">
              CURATED WISHLIST
            </h2>
            <span className="text-xs font-mono text-zinc-500 shrink-0">({normalizedItems.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {normalizedItems.length > 0 && (
              <button
                onClick={() => {
                  playSound('trash');
                  normalizedItems.forEach((it) => onRemoveFromWishlist?.(it.id || it));
                }}
                className="text-[10px] font-mono text-zinc-400 hover:text-red-400 px-2 py-1 rounded border border-white/10 hover:border-red-500/40 transition-colors cursor-pointer"
              >
                CLEAR ALL
              </button>
            )}

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
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {normalizedItems.length === 0 ? (
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
            normalizedItems.map((item) => (
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
                    {item.price ? formatPrice(item.price, currency) : 'ARCHIVE PIECE'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => {
                      playSound('click');
                      onAddToCart?.({
                        ...item,
                        selectedSize: item.selectedSize || (item.sizes ? item.sizes[0] : 'Standard')
                      });
                      onRemoveFromWishlist?.(item.id || item);
                    }}
                    title="Move to Bag"
                    aria-label="Move to Bag"
                    className="p-1.5 flex items-center justify-center text-white/80 hover:text-pink transition-all cursor-pointer active:scale-125"
                  >
                    <ShoppingBag className="w-4 h-4 text-white hover:text-pink transition-colors stroke-[2]" />
                  </button>

                  <button
                    onClick={() => {
                      playSound('trash');
                      onRemoveFromWishlist?.(item.id || item);
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

        {/* Bottom Bar: Multi-Channel Curated Wishlist Share */}
        {normalizedItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 space-y-2.5 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={handleShareWishlist}
                className="flex-1 py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">LINK COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-pink" />
                    <span>SHARE WISHLIST</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareWhatsApp}
                title="Share Curated Wishlist on WhatsApp"
                aria-label="Share Curated Wishlist on WhatsApp"
                className="py-3 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-mono tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WHATSAPP</span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-zinc-500 text-center">
              Companions opening your link unlock this exact curated vault in 1 click.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
