import React, { useState } from 'react';
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

  const handleAdd = () => {
    if (product.stock === 1 && isAlreadyInCart) {
      playSound('glitch');
      setErrorNotice("1-OF-1 RESTRICTION: This handcrafted grail is already in your bag bestie! Only 1 exists in this dimension.");
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
      setRecommendedSize('XS / S (Perfect Cinched Fit)');
    } else if (bust <= 36 && waist <= 30) {
      setRecommendedSize('M (Main Character Fit)');
    } else {
      setRecommendedSize('L / Custom Bespoke Atelier Fit');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99995] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-gradient-to-b from-[#140217] via-black to-[#0d020f] border border-[#be185d]/40 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(40,2,40,0.95)] my-auto max-h-[92vh] sm:max-h-none flex flex-col md:flex-row overflow-y-auto md:overflow-hidden text-left"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('pip');
            onClose();
          }}
          aria-label="Close product modal"
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-black/80 flex items-center justify-center text-silver hover:text-pink-300 hover:border-[#be185d] hover:bg-[#be185d]/20 transition-all cursor-pointer shadow-lg"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left: Product Gallery Showcase Panel */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-between bg-[#18031d]/90 border-b md:border-b-0 md:border-r border-[#be185d]/25">
          {/* Main Selected Image */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black border border-[#be185d]/30 mb-4 shadow-2xl">
            <img
              src={product.images ? product.images[activeImageIndex] : product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 rounded-2xl"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#be185d]/50 text-pink-300 text-[10px] font-mono tracking-widest uppercase shadow-[0_0_12px_rgba(190,24,93,0.3)]">
                {product.tag || 'ONE OF ONE'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1c041f]/90 border border-amber-400/50 text-amber-300 text-[9px] font-mono tracking-widest uppercase flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 text-amber-400" />
                <span>IN 3 BADDIES' BAGS</span>
              </span>
            </div>

            {/* Wishlist Heart Toggle */}
            {onToggleWishlist && (
              <button
                onClick={() => {
                  playSound('snap');
                  onToggleWishlist(product);
                }}
                aria-label="Save to Vault Stash"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:border-pink-400 flex items-center justify-center text-white hover:text-pink-300 transition-all cursor-pointer"
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
                      ? 'border-[#f472b6] scale-105 shadow-[0_0_15px_rgba(190,24,93,0.6)] ring-1 ring-[#f472b6]'
                      : 'border-white/15 opacity-60 hover:opacity-100 hover:border-[#be185d]/50'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}

          {/* Social Proof Fit Check Quote */}
          <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left">
            <div className="flex items-center gap-1 text-amber-300 text-xs mb-1">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span className="text-[10px] font-mono text-pink-300 ml-1">5.0 // VERIFIED BADDIE</span>
            </div>
            <p className="text-[11px] font-montserrat text-silver/85 italic leading-relaxed">
              "Wore this to a techno warehouse rave in Mumbai and literally 15 people stopped me to ask where I got it. It ate and left no crumbs no cap."
            </p>
            <span className="text-[10px] font-mono text-[#f472b6] mt-1 block">— @tara.subculture (Instagram)</span>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 md:p-10 flex flex-col justify-between bg-black/75 text-left">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-silver/60 uppercase mb-2">
              <span className="text-[#f472b6] font-semibold tracking-wider">{product.category}</span>
              <span className="tracking-widest">GUWAHATI ATELIER DROP</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-spartan font-black uppercase text-white mb-2 leading-tight">
              {product.name}
            </h2>

            <div className="text-2xl sm:text-3xl font-spartan font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-pink-300 to-[#f472b6] mb-3">
              {formatPrice(product.price, currency)}
            </div>

            <p className="text-silver/85 text-xs sm:text-sm font-montserrat leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Materials Badge */}
            <div className="p-3.5 rounded-2xl bg-[#19041b]/80 border border-[#be185d]/30 text-xs font-mono text-silver mb-5 shadow-inner">
              <span className="text-[#f472b6] uppercase font-bold tracking-wider block mb-0.5">RAW HARDWARE & CRAFT:</span>
              <span className="text-white leading-relaxed">{Array.isArray(product.materials) ? product.materials.join(' • ') : product.materials}</span>
            </div>

            {/* Sizing Selection & Baddie Fit Calculator */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-silver/80 tracking-wider">CHOOSE YOUR FIT:</span>
                <button
                  onClick={() => setShowSizeEstimator(!showSizeEstimator)}
                  className="text-[11px] font-mono text-[#f472b6] hover:text-white hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{showSizeEstimator ? 'Hide Fit Calculator' : 'Baddie Size Calculator'}</span>
                </button>
              </div>

              {/* Interactive Fit Calculator Form */}
              {showSizeEstimator && (
                <div className="p-4 rounded-2xl bg-[#1a0520] border border-pink-400/40 mb-3 text-xs space-y-3 animate-fade-in">
                  <div className="text-pink-300 font-mono font-bold text-[11px] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>DROP YOUR MEASUREMENTS FOR BESPOKE FIT:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-silver/70 mb-1">BUST (INCHES):</label>
                      <input
                        type="number"
                        placeholder="e.g. 34"
                        value={bustInches}
                        onChange={(e) => setBustInches(e.target.value)}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-silver/70 mb-1">WAIST (INCHES):</label>
                      <input
                        type="number"
                        placeholder="e.g. 26"
                        value={waistInches}
                        onChange={(e) => setWaistInches(e.target.value)}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-pink-400"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCalculateFit}
                    className="w-full py-2 rounded-xl bg-pink-400/20 hover:bg-pink-400/30 border border-pink-400 text-pink-200 text-xs font-mono font-bold cursor-pointer"
                  >
                    CALCULATE MY FIT
                  </button>
                  {recommendedSize && (
                    <div className="p-2.5 rounded-xl bg-black/80 border border-pink-400/50 text-pink-300 font-mono text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
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
                          ? 'bg-gradient-to-r from-[#9D174D] to-[#700B36] text-white border-[#f472b6] shadow-[0_0_18px_rgba(190,24,93,0.5)] font-bold scale-105'
                          : 'bg-white/5 text-silver border-white/15 hover:border-[#be185d] hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))
                ) : (
                  <span className="text-xs font-mono text-silver/60">One Size / Adjustable Hardware</span>
                )}
              </div>
            </div>

            {/* Error Notice */}
            {errorNotice && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-xs text-rose-200 font-mono flex items-center gap-2 mb-4 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorNotice}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Add to Bag + Group Squad Buy */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            <button
              onClick={handleAdd}
              disabled={product.stock === 1 && isAlreadyInCart}
              className={`w-full btn-glass-pink py-3.5 text-xs font-spartan font-black tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 ${
                product.stock === 1 && isAlreadyInCart
                  ? 'opacity-50 cursor-not-allowed bg-silver/20 text-silver border-silver/30'
                  : ''
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {product.stock === 1 && isAlreadyInCart
                  ? 'ALREADY IN YOUR BAG (1 OF 1)'
                  : 'SECURE THIS GRAIL 💅'}
              </span>
            </button>

            {/* Squad Group Buying CTA */}
            {onOpenSquadModal && (
              <button
                onClick={() => {
                  playSound('snap');
                  onOpenSquadModal(product);
                }}
                className="w-full py-3 px-4 rounded-full bg-[#200526] hover:bg-[#2e0736] border border-[#f472b6]/40 hover:border-[#f472b6] text-pink-300 hover:text-white text-xs font-spartan font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#f472b6]" />
                <span>SQUAD BUY WITH BESTIES (SAVE UP TO 20%)</span>
              </button>
            )}

            <div className="flex items-center justify-between text-[11px] font-mono text-silver/60 pt-1">
              <button
                onClick={() => {
                  playSound('pip');
                  onClose();
                  onRequestCustom(product.name);
                }}
                className="hover:text-pink-300 underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-[#f472b6]" />
                <span>Commission Bespoke Evolution</span>
              </button>

              <span className="flex items-center gap-1 text-silver/50">
                <ShieldCheck className="w-3 h-3 text-pink-400" />
                Guwahati Atelier Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
