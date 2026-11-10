import React, { useState, useEffect } from 'react';
import { useModalScrollLock } from '../utils/modalScrollLock';
import {
  X,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Heart
} from 'lucide-react';
import { formatPrice } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  cartItems = [],
  currency = 'INR',
  onRequestCustom,
  onOpenSquadModal,
  isWishlisted = false,
  onToggleWishlist,
  currentUser,
  onOpenAuthModal,
  onOpenCart
}) {
  useModalScrollLock(Boolean(product));

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setErrorNotice('');
    }
  }, [product?.id]);

  if (!product) return null;

  // Check if this 1-of-1 product is already in the bag
  const isAlreadyInCart = cartItems.some((item) => item.id === product.id);
  const isSoldOut = product?.stock === 0 || product?.inventory_quantity === 0;

  const handleAdd = () => {
    if (isSoldOut) {
      playSound('glitch');
      setErrorNotice("Notice: This archive piece is currently sold out. You can request a custom commission below.");
      return;
    }
    if (product.stock === 1 && isAlreadyInCart) {
      playSound('glitch');
      setErrorNotice("Notice: This unique 1-of-1 piece is already reserved in your shopping bag.");
      return;
    }

    playSound('chord');
    onAddToCart({
      ...product,
      selectedSize: 'Free Size'
    });
    setErrorNotice('');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99995] bg-black/92 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto overscroll-contain animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" data-surface="dark" className="product-modal-surface modal-card relative w-full max-w-5xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] sm:max-h-none flex flex-col md:flex-row overflow-y-auto md:overflow-hidden text-left"
      >
        {/* Close Button — Elevated, Independent Clearance */}
        <button
          onClick={() => {
            playSound('pip');
            onClose();
          }}
          aria-label="Close product modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 flex items-center justify-center text-zinc-400 hover:text-white hover:rotate-90 transition-all cursor-pointer active:scale-95 drop-shadow-md"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left: Product Gallery Showcase Panel */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-between bg-[#0e0e14] border-b md:border-b-0 md:border-r border-white/10">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black border border-white/10 mb-4 shadow-2xl">
            <img
              src={product.images ? product.images[activeImageIndex] : product.image}
              alt={product.name}
              draggable={false} className={`w-full h-full object-cover transition-all duration-500 rounded-2xl pointer-events-none ${isSoldOut ? "filter grayscale-[30%] brightness-85" : ""}`}
            />

            {/* Sold Out Tag on Modal Image */}
            {isSoldOut && (
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1.5 rounded-full bg-red-950/90 border border-red-500/80 text-red-200 text-xs font-mono uppercase tracking-widest font-bold shadow-2xl backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  SOLD OUT
                </span>
              </div>
            )}

            

            {/* Wishlist Heart Toggle — Moved to Bottom-Right of Image to Never Collide with Modal Close X */}
            {onToggleWishlist && (
              <button
                onClick={() => {
                  playSound('snap');
                  onToggleWishlist(product);
                }}
                aria-label="Save to Curated Wishlist"
                className="absolute bottom-4 right-4 p-2 flex items-center justify-center text-white/80 hover:text-pink-400 transition-all cursor-pointer z-20 active:scale-125 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'text-pink-400 fill-pink-400' : ''}`} />
              </button>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playSound('snap');
                    setActiveImageIndex(idx);
                  }}
                  className={`relative w-16 h-20 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                    activeImageIndex === idx
                      ? 'border-white ring-1 ring-white shadow-lg'
                      : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} draggable={false} className="w-full h-full object-cover rounded-xl pointer-events-none" />
                </button>
              ))}
            </div>
          )}

          {/* Studio Craftsmanship Note */}
          <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/10 text-left">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
              ORIGIN & CRAFTSMANSHIP
            </div>
            <p className="text-[11px] font-montserrat text-zinc-300 leading-relaxed">
              Every garment is individually crafted by hand at our Studio, combining deadstock textiles with reclaimed industrial hardware.
            </p>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 md:p-10 flex flex-col justify-between bg-[#0c0c10] text-left">
          <div className="pr-12 md:pr-14">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase mb-2">
              <span className="text-white font-medium tracking-wider">{product.category}</span>
              <span className="tracking-widest text-zinc-500 hidden sm:inline">STUDIO ARCHIVE</span>
            </div>

            <div className="mb-3">
              {isSoldOut ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/60 text-red-200 text-[11px] font-mono uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  SOLD OUT · ARCHIVED PIECE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-mono uppercase tracking-wider">
                  {product.stock === 1 ? '1 OF 1 UNIQUE PIECE' : 'LIMITED STUDIO RUN'}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-mono font-medium uppercase text-white mb-2 leading-tight">
              {product.name}
            </h2>

            <div className="text-xl sm:text-2xl font-mono font-bold text-white mb-3">
              {formatPrice(product.price, currency)}
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm font-montserrat leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Materials Badge */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-300 mb-4">
              <span className="text-zinc-400 uppercase font-medium tracking-wider block mb-0.5">RAW HARDWARE & CRAFT:</span>
              <span className="text-white leading-relaxed">{Array.isArray(product.materials) ? product.materials.join(' • ') : product.materials}</span>
            </div>

            {/* Sizing: Free Size / Adjustable for All Pieces */}
            <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 uppercase tracking-wider">FIT & SILHOUETTE:</span>
              <span className="text-pink font-semibold uppercase tracking-wider">FREE SIZE • ADJUSTABLE</span>
            </div>

            {/* Error Notice */}
            {errorNotice && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-zinc-400" />
                <span>{errorNotice}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Shopify / Flipkart Style Add to Cart & Buy Now */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {isSoldOut ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('snap');
                  onClose();
                  onRequestCustom?.(product);
                }}
                className="w-full py-3.5 px-6 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-500/70 text-red-100 text-xs font-mono font-bold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-red-300" />
                <span>REQUEST ARCHIVAL PIECE (MADE TO ORDER) ↗</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={handleAdd}
                  disabled={product.stock === 1 && isAlreadyInCart}
                  className="flex-1 py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-xs tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.stock === 1 && isAlreadyInCart ? 'IN BAG (1 OF 1)' : 'ADD TO CART'}</span>
                </button>
                <button
                  onClick={() => {
                    handleAdd();
                    onClose();
                    onOpenCart?.();
                  }}
                  disabled={product.stock === 1 && isAlreadyInCart}
                  className="flex-1 py-3.5 px-6 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-40"
                >
                  <span>BUY NOW ↗</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2">
              <button
                onClick={() => {
                  playSound('pip');
                  onClose();
                  onRequestCustom?.(product);
                }}
                className="hover:text-white underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-zinc-400" />
                <span>Request Custom Variant</span>
              </button>

              <span className="flex items-center gap-1 text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                Studio Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
