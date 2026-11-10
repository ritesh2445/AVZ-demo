'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Phone, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audio';
import { useModalScrollLock } from '../utils/modalScrollLock';
import { formatPrice } from '../data/brandData';

export default function RequestPieceModal({
  isOpen,
  onClose,
  piece,
  currentUser,
  currency = 'INR'
}) {
  useModalScrollLock(isOpen);

  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-prefill if user is logged in
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMessage('');
      if (currentUser && !currentUser.isGuest) {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        if (currentUser.phone) {
          const raw = String(currentUser.phone);
          if (raw.startsWith('+91')) {
            setCountryCode('+91');
            setPhoneDigits(raw.replace('+91', '').replace(/\D/g, '').slice(0, 10));
          } else {
            const digits = raw.replace(/\D/g, '');
            setPhoneDigits(digits.slice(0, 10));
          }
        }
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !piece) return null;

  const pieceTitle = piece.name || piece.title || 'Exclusive Archive Piece';
  
  // Safely extract the primary image URL across all formats (array, string, JSON-stringified, or imgUrl)
  const pieceImage = (() => {
    if (Array.isArray(piece.images) && piece.images.length > 0 && typeof piece.images[0] === 'string') {
      return piece.images[0];
    }
    if (typeof piece.image === 'string' && piece.image.length > 1) {
      return piece.image;
    }
    if (typeof piece.imgUrl === 'string' && piece.imgUrl.length > 1) {
      return piece.imgUrl;
    }
    if (typeof piece.image_url === 'string' && piece.image_url.length > 1) {
      return piece.image_url;
    }
    if (typeof piece.images === 'string' && piece.images.startsWith('[')) {
      try {
        const parsed = JSON.parse(piece.images);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed[0];
        }
      } catch {}
    }
    return '/assets/editorial_hero_portrait.jpg';
  })();

  const piecePrice = Number(piece.price) || 0;

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneDigits(digits);
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      playSound('glitch');
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      playSound('glitch');
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (phoneDigits.length !== 10) {
      playSound('glitch');
      setErrorMessage('Phone number must be strictly 10 digits.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    playSound('warp');

    try {
      const fullPhone = `${countryCode} ${phoneDigits}`;
      const res = await fetch('/api/storefront/piece-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pieceId: piece.id || piece.sku,
          pieceTitle,
          pieceImage,
          piecePrice,
          customerName: name.trim(),
          customerPhone: fullPhone,
          customerEmail: email.trim(),
          notes: notes.trim() || null
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        playSound('sparkle');
        setSubmitted(true);
      } else {
        playSound('glitch');
        setErrorMessage(data.error || 'Failed to submit request. Please try again.');
      }
    } catch (err) {
      playSound('glitch');
      setErrorMessage('Network error while submitting request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg bg-[#0e0914] border border-white/20 rounded-3xl p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative text-left"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer z-20 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-mono uppercase font-bold text-white tracking-wide">
              PIECE REQUEST RECEIVED
            </h3>
            <p className="text-xs text-zinc-300 font-montserrat leading-relaxed max-w-md mx-auto">
              Thank you, <strong className="text-pink">{name}</strong>. Founder Dhrisni and our Studio team have received your request for <strong className="text-white">{pieceTitle}</strong> and will connect directly via WhatsApp/email with production timeline details.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                RETURN TO VAULT
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-4 pr-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink/15 border border-pink/30 text-pink text-[10px] font-mono uppercase tracking-widest mb-2 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARCHIVE / CUSTOM PIECE REQUEST</span>
              </div>
              <h3 className="text-lg sm:text-xl font-mono uppercase font-bold text-white leading-tight">
                REQUEST THIS PIECE
              </h3>
              <p className="text-xs text-zinc-400 font-montserrat mt-1">
                Enter your details below. Dhrisni personally reviews custom requests and coordinates crafting from our studio.
              </p>
            </div>

            {/* Pre-filled Piece Summary Card */}
            <div className="mb-5 p-3 rounded-2xl bg-white/5 border border-white/15 flex items-center gap-3.5">
              <img
                src={pieceImage}
                alt={pieceTitle}
                className="w-14 h-16 object-cover rounded-xl border border-white/15 shrink-0 bg-black/60"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-pink font-semibold block">
                  REQUESTED PIECE
                </span>
                <h4 className="font-mono text-sm font-bold text-white uppercase truncate">
                  {pieceTitle}
                </h4>
                {piecePrice > 0 && (
                  <span className="font-mono text-xs text-zinc-300 font-bold block mt-0.5">
                    {formatPrice(piecePrice, currency)}
                  </span>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-red-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Request Form: ONLY Name, Phone (+91, 10 digits), Email */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Full Name *
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Baruah"
                    className="w-full bg-black/60 border border-white/15 focus:border-pink/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  WhatsApp / Phone Number *
                </label>
                <div className="flex rounded-xl border border-white/15 focus-within:border-pink/70 bg-black/60 transition-colors overflow-hidden">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-black text-pink text-xs font-mono font-bold px-3 py-2.5 outline-none cursor-pointer border-r border-white/10 shrink-0"
                  >
                    <option value="+91" className="bg-[#0e0914] text-white">+91</option>
                    <option value="+1" className="bg-[#0e0914] text-white">+1 (US)</option>
                    <option value="+44" className="bg-[#0e0914] text-white">+44 (UK)</option>
                    <option value="+971" className="bg-[#0e0914] text-white">+971 (UAE)</option>
                    <option value="+65" className="bg-[#0e0914] text-white">+65 (SG)</option>
                  </select>
                  <div className="relative flex-1 min-w-0 flex items-center">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phoneDigits}
                      onChange={handlePhoneChange}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="w-full bg-transparent pl-10 pr-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 block mt-1">
                  Strictly 10 digits required ({phoneDigits.length}/10 entered)
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@domain.com"
                    className="w-full bg-black/60 border border-white/15 focus:border-pink/70 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'TRANSMITTING REQUEST...' : 'SUBMIT PIECE REQUEST'}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
