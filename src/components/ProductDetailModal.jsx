import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Ruler,
  AlertCircle,
  Info,
  RefreshCw,
  Heart,
  Users,
  Flame,
  Star,
  CheckCircle2,
  MessageCircle
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
  onToggleWishlist
}) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'One Size');
  const [showSizeEstimator, setShowSizeEstimator] = useState(false);
  const [bustInches, setBustInches] = useState('');
  const [waistInches, setWaistInches] = useState('');
  const [recommendedSize, setRecommendedSize] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  // Check if this 1-of-1 product is already in the bag
  const isAlreadyInCart = cartItems.some((item) => item.id === product.id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAdd = () => {
    if (product.stock === 1 && isAlreadyInCart) {
      playSound('glitch');
      setErrorNotice("Notice: This unique 1-of-1 piece is already reserved in your shopping bag.");
      return;
    }

    playSound('chord');
    onAddToCart({
      ...product,
      selectedSize
    });
    setErrorNotice('');
  };

  const handleCalculateFit = (e) => {
    e.preventDefault();
    const bust = parseFloat(bustInches);
    const waist = parseFloat(waistInches);
    if (!bust || !waist) return;

    playSound('snap');
    if (bust <= 33 && waist <= 26) {
      setRecommendedSize('XS / S (Tailored Fit)');
    } else if (bust <= 36 && waist <= 30) {
      setRecommendedSize('M (Standard Fit)');
    } else {
      setRecommendedSize('L / Custom Studio Order');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99995] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] my-auto max-h-[92vh] sm:max-h-none flex flex-col md:flex-row overflow-y-auto md:overflow-hidden text-left"
      >
        {/* Close Button — Elevated, Independent Clearance */}
        <button
          onClick={() => {
            playSound('pip');
            onClose();
          }}
          aria-label="Close product modal"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/90 backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/40 transition-all cursor-pointer shadow-xl active:scale-95"
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
              className="w-full h-full object-cover transition-all duration-500 rounded-2xl"
            />

            {/* Provenance Badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono tracking-widest uppercase shadow-md">
                {product.tag || 'ONE OF ONE'}
              </span>
            </div>

            {/* Wishlist Heart Toggle — Moved to Bottom-Right of Image to Never Collide with Modal Close X */}
            {onToggleWishlist && (
              <button
                onClick={() => {
                  playSound('snap');
                  onToggleWishlist(product);
                }}
                aria-label="Save to Curated Wishlist"
                className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/85 backdrop-blur-md border border-white/20 hover:border-white/50 flex items-center justify-center text-white hover:text-pink-300 transition-all cursor-pointer shadow-lg z-20 active:scale-95"
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
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-xl" />
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
              Every garment is individually crafted by hand at our Guwahati studio, combining deadstock textiles with reclaimed industrial hardware.
            </p>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 md:p-10 flex flex-col justify-between bg-[#0c0c10] text-left">
          <div className="pr-12 md:pr-14">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 uppercase mb-2">
              <span className="text-white font-medium tracking-wider">{product.category}</span>
              <span className="tracking-widest text-zinc-500 hidden sm:inline">GUWAHATI STUDIO</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-mono font-medium uppercase text-white mb-2 leading-tight">
              {product.name}
            </h2>

            <div className="text-xl sm:text-2xl font-mono font-bold text-white mb-3">
              {formatPrice(product.price, currency)}
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm font-montserrat leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Materials Badge */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-300 mb-5">
              <span className="text-zinc-400 uppercase font-medium tracking-wider block mb-0.5">RAW HARDWARE & CRAFT:</span>
              <span className="text-white leading-relaxed">{Array.isArray(product.materials) ? product.materials.join(' • ') : product.materials}</span>
            </div>

            {/* Sizing Selection & Fit Guide */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">SELECT SIZE:</span>
                <button
                  onClick={() => setShowSizeEstimator(!showSizeEstimator)}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{showSizeEstimator ? 'Hide Size Guide' : 'Size & Fit Guide'}</span>
                </button>
              </div>

              {/* Interactive Fit Calculator Form */}
              {showSizeEstimator && (
                <div className="p-4 rounded-xl bg-black/80 border border-white/15 mb-3 text-xs space-y-3 animate-fade-in">
                  <div className="text-white font-mono font-medium text-[11px] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>BESPOKE SIZING ESTIMATOR:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">BUST (INCHES):</label>
                      <input
                        type="number"
                        placeholder="e.g. 34"
                        value={bustInches}
                        onChange={(e) => setBustInches(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-400 mb-1">WAIST (INCHES):</label>
                      <input
                        type="number"
                        placeholder="e.g. 26"
                        value={waistInches}
                        onChange={(e) => setWaistInches(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCalculateFit}
                    className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-medium cursor-pointer transition-all"
                  >
                    CALCULATE ESTIMATED FIT
                  </button>
                  {recommendedSize && (
                    <div className="p-2.5 rounded-lg bg-black border border-white/20 text-zinc-300 font-mono text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>RECOMMENDED: <strong>{recommendedSize}</strong></span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes ? (
                  product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        playSound('pip');
                        setSelectedSize(sz);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-mono cursor-pointer transition-all border ${
                        selectedSize === sz
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-white/5 text-zinc-400 border-white/15 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))
                ) : (
                  <span className="text-xs font-mono text-zinc-500">One Size / Adjustable Hardware</span>
                )}
              </div>
            </div>

            {/* Error Notice */}
            {errorNotice && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-zinc-200 font-mono flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-zinc-400" />
                <span>{errorNotice}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Add to Bag */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={handleAdd}
              disabled={product.stock === 1 && isAlreadyInCart}
              className={`w-full py-3.5 px-6 rounded-full text-xs font-mono font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all ${
                product.stock === 1 && isAlreadyInCart
                  ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500 border border-zinc-700'
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.99]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {product.stock === 1 && isAlreadyInCart
                  ? 'ALREADY RESERVED IN BAG (1 OF 1)'
                  : 'ACQUIRE PIECE ↗'}
              </span>
            </button>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2">
              <button
                onClick={() => {
                  playSound('pip');
                  onClose();
                  onRequestCustom(product.name);
                }}
                className="hover:text-white underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-zinc-400" />
                <span>Request Custom Variant</span>
              </button>

              <span className="flex items-center gap-1 text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                Guwahati Studio Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
