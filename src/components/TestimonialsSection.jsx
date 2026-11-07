'use client';

import React, { useState, useEffect } from 'react';
import { useModalScrollLock } from '../utils/modalScrollLock';
import { Star, MessageSquarePlus, ShieldCheck, User, Sparkles, X, CheckCircle, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

// Default initial testimonials
const DEFAULT_TESTIMONIALS = [
  {
    id: 'test-001',
    user_name: 'Aanya Sharma',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role_title: 'Fashion Editor • Mumbai',
    product_name: 'Original Motherboard Top',
    rating: 5,
    content: 'The craftsmanship on the motherboard top is otherworldly. The solder pathways and curved industrial edges rest comfortably against the collarbones without pinching. Everywhere I wore it during Lakme Fashion Week, people stopped me to ask who made it. Truly 1-of-1 wearable art.'
  },
  {
    id: 'test-002',
    user_name: 'Devansh Kulkarni',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role_title: 'Music Producer & DJ • Bangalore',
    product_name: 'Spike Bodice Armour',
    rating: 5,
    content: 'Purchased for a stage performance in Berlin. The weight of the solid chrome rivets and the hand-finished steel spikes feel heavy, grounded, and indestructible. Dhrisni tailored the waist tension cables to my exact chest dimensions. You feel like a cyberpunk deity the second you zip it on.'
  },
  {
    id: 'test-003',
    user_name: 'Priyanka Das',
    user_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role_title: 'Visual Artist • Guwahati',
    product_name: 'Guwahati Stainless Chainmail',
    rating: 5,
    content: 'Knowing this was hand-woven ring-by-ring by local women artisans in Guwahati makes it so special. The fluid drape of the stainless steel links moves like liquid metal under sunlight. Packaging arrived in a gorgeous matte black box with custom handwritten notes.'
  }
];

function TestimonialsSection({ currentUser, onOpenAuthModal }) {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
  const [modalOpen, setModalOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  useModalScrollLock(Boolean(modalOpen || authPromptOpen));

  // Review Form States
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [productName, setProductName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch real reviews from DB
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
        }
      } catch (err) {
        console.warn('Using default testimonials fallback');
      }
    }
    fetchTestimonials();
  }, []);

  const handleOpenReviewModal = () => {
    playSound('pip');
    if (!currentUser) {
      setAuthPromptOpen(true);
      return;
    }
    setErrorMessage('');
    setSubmitSuccess(false);
    setModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('Please write your review before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          content: content.trim(),
          product_name: productName.trim() || null,
          productName: productName.trim() || null,
          role_title: roleTitle.trim() || null,
          roleTitle: roleTitle.trim() || null,
          user: currentUser
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to submit review.');
        playSound('toggle_off');
      } else {
        playSound('snap');
        setSubmitSuccess(true);
        if (data.testimonial) {
          setTestimonials((prev) => [data.testimonial, ...prev]);
        }
        setTimeout(() => {
          setModalOpen(false);
          setContent('');
          setProductName('');
          setRoleTitle('');
          setRating(5);
        }, 1500);
      }
    } catch (err) {
      setErrorMessage('Network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="relative w-full bg-[#050508] py-20 sm:py-28 px-4 sm:px-8 lg:px-12 overflow-hidden border-t border-white/10 select-none">
      {/* Background Subtle Spatial Glow (Matching the rest of the site) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(244,114,182,0.06),transparent_70%)] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[250px] bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 w-full">
        {/* Section Header (Consistent with brand design system) */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span>CUSTOMER EXPERIENCES</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-mono font-medium tracking-[0.16em] text-white uppercase leading-tight">
            WHAT PEOPLE <span className="text-zinc-500 font-light">SAY</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 font-mono tracking-wider mt-3 leading-relaxed max-w-xl mx-auto">
            Direct feedback from verified patrons and custom order collectors who wear AVZ Vaganza in real life.
          </p>

          {/* Action: Add Review Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleOpenReviewModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-zinc-200 border border-white font-mono font-bold text-xs tracking-widest uppercase shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-black" />
              <span>Write a Review</span>
            </button>

            {currentUser && (
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Patron: {currentUser.name || currentUser.email}
              </span>
            )}
          </div>
        </div>

        {/* Testimonials Cards Grid (High-fashion luxury glass cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative rounded-2xl sm:rounded-3xl bg-[#09090d] border border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-pink/50 hover:shadow-[0_12px_40px_rgba(244,114,182,0.15)] hover:-translate-y-1.5"
            >
              {/* Card Ambient Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10">
                {/* Avatar with Circular Frame */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-neutral-900 border-2 border-white/20 mb-5 shadow-md flex-shrink-0">
                  {t.user_avatar ? (
                    <img
                      src={t.user_avatar}
                      alt={t.user_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.user_name)}&backgroundColor=14141c&textColor=ffffff`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#14141c] text-white">
                      <User className="w-6 h-6 text-pink" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-tight">
                  {t.user_name}
                </h3>

                {/* Role / Location */}
                <p className="text-xs text-zinc-400 font-mono mt-0.5 mb-5 font-normal">
                  {t.role_title || 'Verified Patron'}
                </p>

                {/* Review Paragraph */}
                <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed line-clamp-6">
                  "{t.content}"
                </p>
              </div>

              {/* Card Footer: Stars & Product Badge */}
              <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (t.rating || 5)
                          ? 'fill-[#f472b6] text-[#f472b6]'
                          : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>

                {t.product_name && (
                  <span className="text-[10px] font-mono text-[#f472b6] uppercase tracking-wider font-semibold">
                    {t.product_name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: ADD REVIEW FORM (ONLY FOR REGISTERED USERS) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-card relative w-full max-w-lg bg-[#09090d] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-white uppercase flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-pink" />
                  Write a Review
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Share your experience with the AVZ community.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-mono font-bold text-white uppercase">Thank You!</h4>
                <p className="text-xs font-mono text-zinc-300">
                  Your verified review has been published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Rating Stars Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-[#f472b6] text-[#f472b6]'
                              : 'text-neutral-700'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-zinc-400 ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Text Area */}
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell us about the craftsmanship, fit, hardware weight, or how it felt wearing it..."
                    className="w-full bg-[#121218] border border-white/15 rounded-xl p-3 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-pink placeholder:text-neutral-600 resize-none"
                    required
                  />
                </div>

                {/* Product Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1.5">
                      Piece / Look Purchased
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Motherboard Top"
                      className="w-full bg-[#121218] border border-white/15 rounded-xl p-2.5 text-white text-xs font-mono focus:outline-none focus:border-pink"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase mb-1.5">
                      Role or City
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Stylist • Mumbai"
                      className="w-full bg-[#121218] border border-white/15 rounded-xl p-2.5 text-white text-xs font-mono focus:outline-none focus:border-pink"
                    />
                  </div>
                </div>

                {/* User info preview */}
                <div className="pt-2 text-[11px] text-zinc-400 font-mono flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Posting as verified patron: <strong className="text-white">{currentUser?.name || currentUser?.email}</strong></span>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-neutral-300 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono font-bold text-xs uppercase tracking-wide cursor-pointer disabled:opacity-50 transition-all shadow-md"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: AUTH PROMPT (IF NON-REGISTERED USER CLICKS "WRITE A REVIEW") */}
      {authPromptOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          onClick={() => setAuthPromptOpen(false)}
        >
          <div
            className="modal-card relative w-full max-w-md bg-[#09090d] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 text-pink mx-auto flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-mono font-bold text-white uppercase tracking-tight">
                Registered Patrons Only
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-2 leading-relaxed">
                To guarantee authenticity and avoid fake reviews, only verified registered users can post a customer review.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setAuthPromptOpen(false);
                  onOpenAuthModal?.();
                }}
                className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                Sign In / Register
              </button>
              <button
                onClick={() => setAuthPromptOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


export default React.memo(TestimonialsSection);
