import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Lock,
  Tag,
  Users,
  MessageCircle,
  Truck,
  Gift
} from 'lucide-react';
import { BRAND_INFO, formatPrice, CURRENCIES } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currency = 'INR',
  onCheckoutComplete,
  squadDiscount = null, // { squadCode, discountPercent, memberCount }
  onOpenSquadModal
}) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, percent, offInr }
  const [promoError, setPromoError] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState('');

  const [checkoutData, setCheckoutData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'UPI / Instant QR Code'
  });
  const [orderComplete, setOrderComplete] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Subtotal in INR
  const subtotalInr = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Discount calculation (Squad discount OR Promo code)
  let discountInr = 0;
  let activeDiscountLabel = '';

  if (squadDiscount && squadDiscount.discountPercent) {
    discountInr = Math.round((subtotalInr * squadDiscount.discountPercent) / 100);
    activeDiscountLabel = `SQUAD BUY (${squadDiscount.discountPercent}% OFF // ${squadDiscount.squadCode})`;
  } else if (appliedPromo) {
    discountInr = appliedPromo.offInr || Math.round((subtotalInr * appliedPromo.percent) / 100);
    activeDiscountLabel = `PROMO [${appliedPromo.code}]`;
  }

  const discountedSubtotal = Math.max(0, subtotalInr - discountInr);
  const freeShippingThreshold = BRAND_INFO.shipping.freeThreshold;
  const isFreeShipping = discountedSubtotal >= freeShippingThreshold || discountedSubtotal === 0 || appliedPromo?.code === 'FREESHIP';
  const shippingCostInr = isFreeShipping ? 0 : 250;
  const totalInr = discountedSubtotal + shippingCostInr;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    playSound('snap');
    if (code === 'AVZ10' || code === 'BADDIE10') {
      setAppliedPromo({ code, percent: 10 });
      setPromoError('');
    } else if ((code === 'ARCHIVE15' || code === 'SLAY') && subtotalInr >= 3000) {
      setAppliedPromo({ code, percent: 15 });
      setPromoError('');
    } else if ((code === 'ARCHIVE15' || code === 'SLAY') && subtotalInr < 3000) {
      setPromoError('ARCHIVE15 code requires a minimum order value of ₹3,000.');
    } else if (code === 'SQUAD') {
      setAppliedPromo({ code, percent: 15 });
      setPromoError('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code, percent: 0, offInr: 0 });
      setPromoError('');
    } else {
      playSound('glitch');
      setPromoError('Invalid promotional code. Please check and try again.');
    }
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length !== 6) return;
    playSound('pip');
    if (pincode.startsWith('78') || pincode.startsWith('79')) {
      setDeliveryEstimate('⚡ Assam & Northeast: 24–48 hours via Blue Dart Express');
    } else if (pincode.startsWith('11') || pincode.startsWith('40') || pincode.startsWith('56')) {
      setDeliveryEstimate('🚀 Delhi/Mumbai/Bengaluru Metro: 2–3 business days via Air Express');
    } else {
      setDeliveryEstimate('📦 Rest of India: 3–5 business days with live tracking');
    }
  };

  const handleWhatsAppCheckout = () => {
    playSound('warp');
    const itemsList = items.map((i) => `• ${i.name} (${i.selectedSize}) - ₹${i.price}`).join('%0A');
    const msg = `Hello AVZ Atelier, I would like to reserve the following order:%0A%0A${itemsList}%0A%0A*Total:* ₹${totalInr}%0A*Delivery City:* ${checkoutData.city || 'India'}%0A%0APlease share UPI / payment details to confirm reservation.`;
    window.open(`https://wa.me/917304264901?text=${msg}`, '_blank');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    playSound('warp');

    setTimeout(() => {
      playSound('chord');
      setOrderComplete(true);
      onCheckoutComplete({
        orderId: `AVZ-${Math.floor(100000 + Math.random() * 900000)}`,
        items,
        totalInr,
        customer: checkoutData,
        squadDiscount
      });
    }, 1000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99997] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl max-h-[92vh] sm:max-h-[90vh] flex flex-col justify-between overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative text-left"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-black/40 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <ShoppingBag className="w-4 h-4 text-white shrink-0" />
            <h2 className="text-xs sm:text-sm md:text-base font-mono font-medium uppercase text-white tracking-wider truncate">
              {isCheckingOut ? 'ATELIER CHECKOUT' : 'SHOPPING BAG'}
            </h2>
            <span className="text-xs font-mono text-zinc-500 shrink-0">({items.length})</span>
          </div>

          <button
            onClick={() => {
              playSound('pip');
              onClose();
            }}
            aria-label="Close bag"
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Squad Discount Active Banner */}
        {squadDiscount && !orderComplete && (
          <div className="px-5 py-2.5 bg-white/5 border-b border-white/10 text-xs font-mono text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              GROUP PRIVILEGE: {squadDiscount.discountPercent}% OFF
            </span>
            <span className="text-zinc-500 text-[10px] font-mono">[{squadDiscount.squadCode}]</span>
          </div>
        )}

        {/* Free Shipping Progress Meter */}
        {!isCheckingOut && !orderComplete && items.length > 0 && (
          <div className="px-5 py-2.5 bg-black/60 border-b border-white/10 text-xs font-mono">
            {isFreeShipping ? (
              <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                Complimentary Express Courier Unlocked across India.
              </span>
            ) : (
              <div>
                <span className="text-zinc-400">
                  Add {formatPrice(freeShippingThreshold - discountedSubtotal, currency)} more for complimentary Express Courier.
                </span>
                <div className="w-full h-1 bg-white/10 mt-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-500"
                    style={{ width: `${Math.min(100, (discountedSubtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Body Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
          {orderComplete ? (
            /* Order Success View */
            <div className="py-10 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-mono font-medium uppercase text-white tracking-wider">
                ORDER RESERVED // ATELIER NOTIFIED
              </h3>
              <p className="text-xs text-zinc-400 font-montserrat max-w-sm leading-relaxed">
                Your order is confirmed. Dhrisni and our Guwahati studio artisans are preparing your custom matte-black presentation box and certificate.
              </p>
              <div className="p-4 rounded-xl bg-black/80 border border-white/15 text-xs font-mono text-zinc-300 w-full text-center">
                <span className="text-white block font-medium mb-1">
                  ORDER IDENTIFIER: {`AVZ-${Math.floor(100000 + Math.random() * 900000)}`}
                </span>
                PRODUCTION TIMELINE: 1–2 WEEKS (HANDCRAFTED)
              </div>
              <button
                onClick={() => {
                  onClearCart();
                  onClose();
                  setOrderComplete(false);
                  setIsCheckingOut(false);
                }}
                className="px-6 py-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-mono text-white tracking-widest uppercase transition-all"
              >
                RETURN TO RUNWAY
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-3.5 text-left">
              <div className="flex items-center gap-2 text-xs font-mono text-pink uppercase">
                <Lock className="w-3.5 h-3.5" />
                <span>DIRECT ATELIER CHECKOUT // 100% SECURE</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Full Name *</label>
                <input
                  required
                  type="text"
                  value={checkoutData.fullName}
                  onChange={(e) => setCheckoutData({ ...checkoutData, fullName: e.target.value })}
                  placeholder="e.g. Maya Baruah"
                  className="w-full bg-black/80 border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={checkoutData.email}
                    onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                    placeholder="you@email.com"
                    className="w-full bg-black/80 border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">WhatsApp / Phone *</label>
                  <input
                    required
                    type="tel"
                    value={checkoutData.phone}
                    onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-black/80 border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Delivery Address *</label>
                <input
                  required
                  type="text"
                  value={checkoutData.address}
                  onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                  placeholder="House / Flat / Street Name"
                  className="w-full bg-black/80 border border-white/15 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">City</label>
                  <input
                    required
                    type="text"
                    value={checkoutData.city}
                    onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
                    placeholder="e.g. Mumbai"
                    className="w-full bg-black/80 border border-white/15 px-3 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">State</label>
                  <input
                    required
                    type="text"
                    value={checkoutData.state}
                    onChange={(e) => setCheckoutData({ ...checkoutData, state: e.target.value })}
                    placeholder="e.g. Maharashtra"
                    className="w-full bg-black/80 border border-white/15 px-3 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Pincode</label>
                  <input
                    required
                    type="text"
                    value={checkoutData.pincode}
                    onChange={(e) => setCheckoutData({ ...checkoutData, pincode: e.target.value })}
                    placeholder="6 digits"
                    className="w-full bg-black/80 border border-white/15 px-3 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-[10px] font-mono uppercase text-silver/70 mb-2">Select Payment Method</label>
                <div className="flex flex-col gap-2">
                  {['UPI / Instant QR Code (GPay, PhonePe)', 'Credit / Debit Cards (Razorpay)', 'Cash on Delivery (COD Verified)'].map((m) => (
                    <label key={m} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:border-pink">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={checkoutData.paymentMethod === m}
                        onChange={() => setCheckoutData({ ...checkoutData, paymentMethod: m })}
                        className="accent-pink"
                      />
                      <span className="text-xs font-mono text-white">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Unboxing Video Disclaimer */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-silver/70 leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-pink inline mr-1" />
                <span>Return & Damage Policy: An uncut continuous unboxing video sent to our WhatsApp within 48h is required for damage replacement claims.</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="btn-glass flex-1 text-xs py-2.5"
                >
                  BACK TO BAG
                </button>
                <button
                  type="submit"
                  className="btn-glass-pink flex-1 text-xs py-2.5 font-bold"
                >
                  CONFIRM & PAY ({formatPrice(totalInr, currency)})
                </button>
              </div>

              {/* Quick WhatsApp Checkout Alternative */}
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>OR BUY VIA WHATSAPP DM WITH DHRISNI</span>
              </button>
            </form>
          ) : items.length === 0 ? (
            /* Empty Cart */
            <div className="py-14 flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-mono font-medium uppercase text-white tracking-wider">
                SHOPPING BAG IS EMPTY
              </h3>
              <p className="text-xs text-zinc-400 font-montserrat max-w-xs">
                No wearable art pieces have been selected yet.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-mono text-white tracking-widest uppercase transition-all mt-2"
              >
                EXPLORE CATALOGUE
              </button>
            </div>
          ) : (
            /* Item List */
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex gap-3.5 items-center"
                  >
                    <img
                      src={item.images ? item.images[0] : item.image}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-lg border border-white/10 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-mono font-medium uppercase text-white truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                        SIZE: {item.selectedSize} {item.stock === 1 && '• 1 OF 1 ARCHIVE'}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-spartan font-black text-pink text-sm">
                          {formatPrice(item.price, currency)}
                        </span>

                        {item.stock === 1 ? (
                          <span className="text-[9px] font-mono text-lavender/70 rounded-full border border-white/10 px-2 py-0.5 bg-black/40">
                            1 of 1 Limit
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 rounded-full border border-white/15 px-2 py-0.5 bg-black/40">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                              className="text-silver hover:text-white text-xs font-mono"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                              className="text-silver hover:text-white text-xs font-mono"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-silver/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo Code (AVZ10 / ARCHIVE15 / FREESHIP)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="w-full bg-black/80 border border-white/15 pl-9 pr-3 py-2 rounded-xl text-xs text-white font-mono uppercase outline-none focus:border-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#be185d] border border-white/20 text-xs font-mono font-bold text-white transition-all cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
                {promoError && (
                  <p className="text-[10px] font-mono text-rose-400 mt-1">{promoError}</p>
                )}
                {appliedPromo && (
                  <p className="text-[10px] font-mono text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Applied code {appliedPromo.code}!
                  </p>
                )}
              </form>

              {/* Pincode Estimator */}
              <form onSubmit={handleCheckPincode} className="pt-1">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Truck className="w-3.5 h-3.5 text-silver/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Check Pincode Delivery (e.g. 781006)"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-black/80 border border-white/15 pl-9 pr-3 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-[11px] font-mono text-silver hover:text-white transition-all cursor-pointer"
                  >
                    ESTIMATE
                  </button>
                </div>
                {deliveryEstimate && (
                  <p className="text-[10px] font-mono text-pink-300 mt-1.5">{deliveryEstimate}</p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Footer Summary & Action */}
        {!orderComplete && items.length > 0 && !isCheckingOut && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex flex-col gap-2.5">
            {/* Breakdown */}
            <div className="flex items-center justify-between text-xs font-mono text-silver/80">
              <span>Bag Subtotal:</span>
              <span className="text-white font-bold">{formatPrice(subtotalInr, currency)}</span>
            </div>

            {discountInr > 0 && (
              <div className="flex items-center justify-between text-xs font-mono text-green-400">
                <span>{activeDiscountLabel}:</span>
                <span>-{formatPrice(discountInr, currency)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Express Courier:</span>
              <span className="text-white">
                {shippingCostInr === 0 ? 'COMPLIMENTARY' : formatPrice(shippingCostInr, currency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm sm:text-base font-mono font-bold text-white pt-2 border-t border-white/10">
              <span>ESTIMATED TOTAL:</span>
              <span className="text-white">
                {formatPrice(totalInr, currency)}
              </span>
            </div>

            <button
              onClick={() => {
                playSound('snap');
                setIsCheckingOut(true);
              }}
              className="w-full py-3.5 px-6 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-mono font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 mt-1 transition-all active:scale-[0.99]"
            >
              <span>PROCEED TO CHECKOUT ↗</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
