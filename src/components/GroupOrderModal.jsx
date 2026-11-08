import { useModalScrollLock } from '../utils/modalScrollLock';
'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Copy,
  Check,
  Share2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  MessageCircle,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { formatPrice } from '../data/brandData';

export default function GroupOrderModal({
  isOpen,
  onClose,
  groupCart,
  cartItems = [],
  currentUser,
  onOpenAuthModal,
  onGroupCartCreated,
  onBrowseCatalog,
  currency = 'INR'
}) {
  useModalScrollLock(isOpen);

  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeGroup, setActiveGroup] = useState(groupCart);
  const [creatorInputName, setCreatorInputName] = useState(currentUser?.name || '');
  const [creatorInputEmail, setCreatorInputEmail] = useState(currentUser?.email || '');

  // Checkout flow state inside group buy modal
  const [isCheckoutStep, setIsCheckoutStep] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [statusError, setStatusError] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / Instant QR Code (GPay, PhonePe)');
  const [squadOffers, setSquadOffers] = useState([]);
  const [shippingData, setShippingData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    state: 'Assam',
    pincode: ''
  });

  useEffect(() => {
    setActiveGroup(groupCart);
  }, [groupCart]);

  // Load admin-configured squad offers
  useEffect(() => {
    fetch('/api/storefront/group-offers')
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.offers)) {
          setSquadOffers(data.offers);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (!creatorInputName) setCreatorInputName(currentUser.name || '');
      if (!creatorInputEmail) setCreatorInputEmail(currentUser.email || '');
      setShippingData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.name || '',
        email: prev.email || currentUser.email || '',
        address: prev.address || currentUser.address || '',
        city: prev.city || currentUser.city || '',
        state: prev.state || currentUser.state || 'Assam',
        pincode: prev.pincode || currentUser.pincode || ''
      }));

      if (currentUser.phone) {
        const raw = String(currentUser.phone);
        const digits = raw.replace(/\D/g, '');
        const clean = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
        setPhoneDigits(clean.slice(0, 10));
      }

      if (currentUser.email) {
        fetch(`/api/storefront/user-profile?email=${encodeURIComponent(currentUser.email)}`)
          .then((r) => r.json())
          .then((data) => {
            if (data?.success && data.profile) {
              const p = data.profile;
              setShippingData((prev) => ({
                ...prev,
                fullName: prev.fullName || p.name || '',
                address: prev.address || p.address || '',
                city: prev.city || p.city || '',
                state: prev.state || p.state || 'Assam',
                pincode: prev.pincode || p.pincode || ''
              }));
              if (p.phone) {
                const digits = p.phone.replace(/\D/g, '');
                const clean = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
                setPhoneDigits(clean.slice(0, 10));
              }
            }
          })
          .catch(() => {});
      }
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' && activeGroup?.id
    ? `${window.location.origin}/?groupCart=${activeGroup.id}`
    : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    playSound('snap');
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!shareUrl) return;
    playSound('snap');
    const text = encodeURIComponent(
      `Hey! I've started a shared Group Order for AVZ Vaganza Wearable Art. Tap this link to add your favorite pieces to our combined order:\n\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCreateGroupSession = async (e) => {
    e.preventDefault();
    if (!creatorInputName || !creatorInputEmail) return;
    setIsCreating(true);
    playSound('chord');

    try {
      const res = await fetch('/api/storefront/group-cart/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorName: creatorInputName,
          creatorEmail: creatorInputEmail,
          creatorUserId: currentUser?.id || null,
          items: cartItems
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        // Fetch full group cart details
        const fetchRes = await fetch(`/api/storefront/group-cart/${data.groupCartId}`);
        const fetchData = await fetchRes.json().catch(() => ({}));
        if (fetchData.groupCart) {
          setActiveGroup(fetchData.groupCart);
          if (onGroupCartCreated) onGroupCartCreated(fetchData.groupCart);
        }
      } else {
        setStatusError(data.error || 'Failed to initialize group buy session.');
        playSound('glitch');
      }
    } catch (err) {
      setStatusError('Unable to initialize group cart. Please check your connection.');
      playSound('glitch');
    } finally {
      setIsCreating(false);
    }
  };

  // Check if current user is the creator/organizer of this squad cart
  const isCreator = Boolean(
    activeGroup && (
      (currentUser && (
        (currentUser.id && currentUser.id === activeGroup.creatorUserId) ||
        (currentUser.email && currentUser.email.toLowerCase() === activeGroup.creatorEmail?.toLowerCase()) ||
        (currentUser.name && currentUser.name.toLowerCase() === activeGroup.creatorName?.toLowerCase())
      )) ||
      (!currentUser && creatorInputEmail && creatorInputEmail.toLowerCase() === activeGroup.creatorEmail?.toLowerCase())
    )
  );

  // Compute all items count & total
  const members = activeGroup?.membersData || [];
  let totalItemsCount = 0;
  let totalAmount = 0;
  members.forEach((m) => {
    (m.items || []).forEach((item) => {
      const qty = Number(item.quantity || 1);
      totalItemsCount += qty;
      totalAmount += Number(item.price || 0) * qty;
    });
  });

  // Find qualifying admin squad offer or default to 10%
  let activeSquadOffer = null;
  let highestDiscount = 0;
  for (const offer of squadOffers) {
    const minMembers = Number(offer.min_members || 2);
    const minCart = Number(offer.min_cart_amount || 0);
    if (members.length >= minMembers && totalAmount >= minCart) {
      if (Number(offer.discount_percent) > highestDiscount) {
        highestDiscount = Number(offer.discount_percent);
        activeSquadOffer = offer;
      }
    }
  }

  const effectiveDiscountPercent = activeSquadOffer ? highestDiscount : (members.length >= 2 ? 10 : 0);
  const squadDiscountAmount = Math.round(totalAmount * (effectiveDiscountPercent / 100));
  const payableAmount = totalAmount - squadDiscountAmount;

  const handlePlaceGroupOrder = async (e) => {
    e.preventDefault();
    setStatusError('');

    if (!shippingData.fullName || !shippingData.email || !shippingData.address || !shippingData.pincode) {
      setStatusError('Please fill all required delivery address fields (Name, Email, Address, Pincode).');
      playSound('glitch');
      return;
    }

    if (phoneDigits.length !== 10) {
      setStatusError('Phone number must be strictly 10 digits.');
      playSound('glitch');
      return;
    }

    setIsPlacingOrder(true);
    playSound('warp');

    const fullPhone = `${countryCode} ${phoneDigits}`;
    const isOnline = paymentMethod.includes('UPI') || paymentMethod.includes('Razorpay') || paymentMethod.includes('Cards');

    // Online Razorpay Payment Flow
    if (isOnline) {
      try {
        const orderRes = await fetch('/api/payments/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: members.flatMap(m => (m.items || []).map(i => ({
              id: i.id,
              title: i.name,
              price: i.price,
              quantity: i.quantity || 1,
              size: i.selectedSize || 'Standard'
            }))),
            customer: {
              name: shippingData.fullName,
              email: shippingData.email,
              phone: fullPhone,
              address: {
                address_line1: shippingData.address,
                city: shippingData.city,
                state: shippingData.state,
                pincode: shippingData.pincode
              }
            },
            paymentMethod,
            discountAmount: squadDiscountAmount
          })
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.razorpayOrderId) {
          setStatusError(orderData.error || 'Failed to initialize payment gateway.');
          setIsPlacingOrder(false);
          return;
        }

        if (typeof window !== 'undefined' && window.Razorpay) {
          const rzp = new window.Razorpay({
            key: orderData.keyId,
            amount: orderData.amount,
            currency: 'INR',
            name: 'AVZ VAGANZA',
            description: `Squad Order ${orderData.orderNumber}`,
            order_id: orderData.razorpayOrderId,
            prefill: {
              name: shippingData.fullName,
              email: shippingData.email,
              contact: fullPhone
            },
            theme: { color: '#120D1A' },
            handler: async function (response) {
              try {
                // Verify payment signature
                const verifyRes = await fetch('/api/payments/razorpay/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderNumber: orderData.orderNumber,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });

                const verifyData = await verifyRes.json();
                if (verifyRes.ok && verifyData.success) {
                  // Finalize squad checkout in database
                  const chkRes = await fetch(`/api/storefront/group-cart/${activeGroup.id}/checkout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      buyerName: shippingData.fullName,
                      buyerEmail: shippingData.email,
                      buyerPhone: fullPhone,
                      shippingAddress: {
                        address_line1: shippingData.address,
                        city: shippingData.city,
                        state: shippingData.state,
                        pincode: shippingData.pincode
                      },
                      paymentMethod,
                      razorpayOrderId: response.razorpay_order_id,
                      razorpayPaymentId: response.razorpay_payment_id
                    })
                  });

                  const chkData = await chkRes.json();
                  playSound('chord');
                  setOrderConfirmed(chkData);
                } else {
                  setStatusError('Payment verification failed.');
                }
              } catch {
                setStatusError('Error recording verified payment.');
              } finally {
                setIsPlacingOrder(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsPlacingOrder(false);
              }
            }
          });
          rzp.open();
        } else {
          setStatusError('Payment gateway script not loaded. Please check your connection.');
          setIsPlacingOrder(false);
        }
      } catch {
        setStatusError('Error connecting to payment provider.');
        setIsPlacingOrder(false);
      }
      return;
    }

    // Cash on Delivery Flow
    try {
      const res = await fetch(`/api/storefront/group-cart/${activeGroup.id}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName: shippingData.fullName,
          buyerEmail: shippingData.email,
          buyerPhone: fullPhone,
          shippingAddress: {
            address_line1: shippingData.address,
            city: shippingData.city || 'Guwahati',
            state: shippingData.state || 'Assam',
            pincode: shippingData.pincode
          },
          paymentMethod: 'Cash on Delivery (COD Verified)'
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        playSound('chord');
        setOrderConfirmed(data);
      } else {
        setStatusError(data.error || 'Failed to complete squad order.');
        playSound('glitch');
      }
    } catch {
      setStatusError('Connection error during order placement. Please check your internet connection.');
      playSound('glitch');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="avz-storefront-root italic fixed inset-0 z-[99998] bg-black/92 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="modal-card w-full max-w-2xl bg-[#0c0c10] border border-white/15 rounded-3xl p-5 sm:p-8 flex flex-col max-h-[92vh] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close group buy modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer z-30 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-10 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink/10 border border-pink/30 text-pink text-[10px] font-mono uppercase tracking-widest mb-2 font-bold shadow-sm">
            <Users className="w-3.5 h-3.5 text-pink" />
            <span>COLLECTIVE GROUP BUY • ORDER TOGETHER</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-mono font-medium uppercase text-white leading-tight">
            {orderConfirmed ? (
              <span className="text-green-400 font-bold">SQUAD ORDER CONFIRMED!</span>
            ) : isCheckoutStep ? (
              <span>SQUAD <strong className="text-pink font-bold">DELIVERY CHECKOUT</strong></span>
            ) : activeGroup ? (
              <span>GROUP CART: <strong className="text-pink font-bold">{activeGroup.creatorName}&apos;S SQUAD</strong></span>
            ) : (
              <span>CREATE A <strong className="text-pink font-bold">GROUP ORDER</strong></span>
            )}
          </h3>

          <p className="text-xs text-zinc-400 font-montserrat mt-1 leading-relaxed">
            {orderConfirmed
              ? 'Your combined order is confirmed! All squad participants can view this order in their account profiles.'
              : isCheckoutStep
              ? 'Complete shipping details for the collective order. All members will be linked to this order.'
              : 'Invite friends to add their desired pieces into one combined cart. Everyone sees who added which piece, and all participants receive live order updates!'}
          </p>

          {statusError && (
            <div className="mt-3 p-3 bg-red-950/80 border border-red-500/70 rounded-xl text-red-100 text-xs font-mono flex items-center gap-2 animate-fade-in text-left">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{statusError}</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto no-scrollbar space-y-5 flex-1 pr-1">
          {/* Confirmed Order View */}
          {orderConfirmed ? (
            <div className="py-6 space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-zinc-400">ORDER NUMBER</span>
                <h4 className="text-2xl font-mono font-bold text-white mt-1">{orderConfirmed.orderNumber}</h4>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Pieces:</span>
                  <span className="text-white font-bold">{totalItemsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Collective Total:</span>
                  <span className="text-pink font-bold">{formatPrice(orderConfirmed.grandTotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Linked Accounts:</span>
                  <span className="text-green-400">{orderConfirmed.participantEmails?.length || 1} squad members</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                RETURN TO ATELIER
              </button>
            </div>
          ) : isCheckoutStep ? (
            /* Checkout Shipping Form for Group Buy */
            <form onSubmit={handlePlaceGroupOrder} className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block font-semibold">
                  DELIVERY DESTINATION (COMBINED SQUAD SHIPMENT)
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Recipient Name *</label>
                    <input
                      required
                      type="text"
                      value={shippingData.fullName}
                      onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
                      placeholder="e.g. Maya Baruah"
                      className="w-full bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Recipient Email *</label>
                      <input
                        required
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        placeholder="e.g. maya@gmail.com"
                        className="w-full bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">WhatsApp / Phone *</label>
                      <div className="flex gap-2">
                        <div className="shrink-0 bg-black/80 border border-white/20 rounded-xl px-2.5 py-2 text-xs text-pink font-mono font-bold flex items-center gap-1">
                          <span>🇮🇳</span>
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="bg-transparent text-pink outline-none cursor-pointer text-xs"
                          >
                            <option value="+91" className="bg-[#12091c] text-white">+91 (IN)</option>
                            <option value="+1" className="bg-[#12091c] text-white">+1 (US)</option>
                            <option value="+44" className="bg-[#12091c] text-white">+44 (UK)</option>
                            <option value="+971" className="bg-[#12091c] text-white">+971 (AE)</option>
                            <option value="+65" className="bg-[#12091c] text-white">+65 (SG)</option>
                          </select>
                        </div>
                        <input
                          required
                          type="tel"
                          value={phoneDigits}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setPhoneDigits(digits);
                          }}
                          placeholder="10-digit number"
                          maxLength={10}
                          className="flex-1 bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 block mt-1">
                        Strictly 10 digits required ({phoneDigits.length}/10)
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Street Address *</label>
                    <input
                      required
                      type="text"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      placeholder="House/Apartment, Street name, Locality"
                      className="w-full bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">City *</label>
                      <input
                        required
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        placeholder="e.g. Guwahati"
                        className="w-full bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Pincode *</label>
                      <input
                        required
                        type="text"
                        value={shippingData.pincode}
                        onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                        placeholder="e.g. 781006"
                        className="w-full bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-[10px] font-mono uppercase text-silver/70 mb-2">Select Payment Method</label>
                    <div className="flex flex-col gap-2">
                      {['UPI / Instant QR Code (GPay, PhonePe)', 'Credit / Debit Cards (Razorpay)', 'Cash on Delivery (COD Verified)'].map((m) => (
                        <label
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            paymentMethod === m
                              ? 'bg-pink/20 border-[#f472b6] shadow-[0_0_15px_rgba(244,114,182,0.3)]'
                              : 'bg-black/60 border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === m ? 'border-[#f472b6] bg-pink/20' : 'border-white/30'
                          }`}>
                            {paymentMethod === m && <div className="w-2 h-2 rounded-full bg-[#f472b6]" />}
                          </div>
                          <span className={`text-xs font-mono font-medium ${paymentMethod === m ? 'text-white font-bold' : 'text-zinc-300'}`}>
                            {m}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutStep(false)}
                  className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase cursor-pointer"
                >
                  ← BACK
                </button>
                <button
                  type="submit"
                  disabled={isPlacingOrder}
                  className="flex-1 py-3.5 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isPlacingOrder ? 'CONFIRMING ORDER...' : `CONFIRM SQUAD ORDER • ${formatPrice(payableAmount, currency)}`}</span>
                </button>
              </div>
            </form>
          ) : !activeGroup ? (
            /* If No Active Group Cart Yet: Initialization Form */
            <form onSubmit={handleCreateGroupSession} className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider block font-semibold">
                  1. YOUR DETAILS (ORGANIZER / CREATOR)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Your Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Maya Baruah"
                      value={creatorInputName}
                      onChange={(e) => setCreatorInputName(e.target.value)}
                      className="w-full bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-silver/70 mb-1">Your Email (For Updates) *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. maya@gmail.com"
                      value={creatorInputEmail}
                      onChange={(e) => setCreatorInputEmail(e.target.value)}
                      className="w-full bg-black/80 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono outline-none focus:border-pink"
                    />
                  </div>
                </div>
              </div>

              {/* Current Cart Preservation Note (Point a) */}
              <div className="p-3.5 rounded-2xl bg-pink-950/30 border border-pink-500/30 text-xs font-mono text-pink-200 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-pink shrink-0" />
                <span>
                  Your current bag ({cartItems.length} items) will not reset! It will automatically become Section 1 under your name.
                </span>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3.5 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isCreating ? 'CREATING SQUAD LINK...' : 'GENERATE SHARABLE GROUP LINK →'}</span>
              </button>
            </form>
          ) : (
            /* Active Group Order Session View */
            <div className="space-y-4">
              {/* Sharable Link Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-pink" />
                    <span>SHAREABLE SQUAD LINK</span>
                  </span>
                  <span className="text-[10px] font-mono text-pink bg-pink/10 border border-pink/30 px-2.5 py-0.5 rounded-full uppercase font-bold">
                    CODE: {activeGroup.shareCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    type="text"
                    value={shareUrl}
                    className="flex-1 bg-black/90 border border-white/20 px-3.5 py-2 rounded-xl text-xs text-white font-mono select-all outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'COPIED!' : 'COPY'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleShareWhatsApp}
                    className="flex-1 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>SHARE VIA WHATSAPP</span>
                  </button>
                </div>
              </div>

              {/* Members and Their Respective Pieces */}
              <div className="space-y-4">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                  SQUAD PARTICIPANTS ({members.length})
                </span>

                {members.map((member, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-4 rounded-2xl bg-black/70 border border-white/15 space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-pink/20 border border-pink/40 text-pink text-[10px] font-mono font-bold flex items-center justify-center">
                          {mIdx + 1}
                        </span>
                        <h4 className="font-mono text-sm font-bold uppercase text-white">
                          {member.userName} {member.isCreator && <span className="text-pink text-[10px] ml-1 font-normal font-mono">(ORGANIZER)</span>}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {(member.items || []).length} Piece{((member.items || []).length !== 1) ? 's' : ''}
                      </span>
                    </div>

                    {/* Member's items */}
                    <div className="space-y-2">
                      {(member.items && member.items.length > 0) ? (
                        member.items.map((it, itIdx) => (
                          <div
                            key={itIdx}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs font-mono"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={it.images ? it.images[0] : it.image}
                                alt={it.name}
                                className="w-10 h-12 object-cover rounded-md border border-white/10 shrink-0"
                              />
                              <div className="truncate">
                                <span className="text-white block font-medium truncate">{it.name}</span>
                                <span className="text-zinc-400 text-[10px]">
                                  SIZE: {it.selectedSize || 'Free Size'} • QTY: {it.quantity || 1}
                                </span>
                              </div>
                            </div>
                            <span className="text-pink font-bold shrink-0">
                              {formatPrice(it.price * (it.quantity || 1), currency)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-zinc-500 font-mono py-1">
                          No pieces added yet by {member.userName}.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add My Piece CTA: Strictly for visiting friends who are NOT logged in yet (never shown to creator, never shown if logged in) */}
              {!isCreator && !currentUser && (
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-xs font-mono font-bold text-white block">
                      WANT TO ADD YOUR PIECE TO THIS ORDER?
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      Browse the runway vault and click Add to Cart to contribute.
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenAuthModal?.()}
                    className="px-4 py-2 rounded-full bg-pink/20 hover:bg-pink/30 border border-pink/40 text-pink text-xs font-mono font-bold uppercase transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    SIGN IN TO ADD
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer / Checkout Action */}
        {activeGroup && !orderConfirmed && !isCheckoutStep && (
          <div className="pt-4 border-t border-white/10 mt-auto shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400 uppercase">COLLECTIVE SUB-TOTAL:</span>
              <span className="text-white font-bold text-sm sm:text-base">
                {formatPrice(totalAmount, currency)} ({totalItemsCount} items)
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-green-400">
              <span>SQUAD BENEFIT (10% COLLECTIVE DISCOUNT):</span>
              <span>-{formatPrice(squadDiscountAmount, currency)}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playSound('snap');
                  onClose();
                  if (onBrowseCatalog) onBrowseCatalog();
                }}
                className="flex-1 py-3 px-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-pink" />
                <span>+ ADD PIECES (BROWSE CATALOG)</span>
              </button>

              <button
                onClick={() => setIsCheckoutStep(true)}
                disabled={totalItemsCount === 0}
                className="flex-1 py-3 px-4 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Lock className="w-4 h-4" />
                <span>PROCEED TO CHECKOUT • {formatPrice(payableAmount, currency)}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
