'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, ShieldCheck, CheckCircle, X, Sparkles, User, AlertCircle } from 'lucide-react';

export default function TestimonialsSection({ currentUser, onOpenAuthModal }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  // New review form state
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [productName, setProductName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch testimonials on load
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.testimonials) && data.testimonials.length > 0) {
            setTestimonials(data.testimonials);
          }
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      setAuthPromptOpen(true);
      return;
    }
    setModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 8) {
      setErrorMessage('Please provide a review of at least 8 characters.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content.trim(),
          rating,
          productName: productName.trim() || 'Custom Look',
          roleTitle: roleTitle.trim() || 'Verified Customer',
          user: currentUser
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to submit your review.');
        setSubmitting(false);
        return;
      }

      if (data.testimonial) {
        setTestimonials((prev) => [data.testimonial, ...prev]);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
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
    <section id="testimonials" className="relative w-full bg-[#04081c] py-24 sm:py-32 px-4 sm:px-8 lg:px-12 overflow-hidden border-t border-blue-900/40">
      {/* Background Ambient Lighting & Cyber Tile Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle geometric digital grid background */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(66, 133, 244, 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(66, 133, 244, 0.18) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Central Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#1a3a8f]/30 via-[#0d2259]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-[11px] font-mono uppercase tracking-widest mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span>Customer Experiences</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-montserrat font-bold text-white tracking-tight leading-tight">
            What people say
          </h2>

          <p className="text-xs sm:text-base text-neutral-300 font-montserrat mt-4 leading-relaxed max-w-xl mx-auto">
            Discover what our satisfied customers have to say about their experiences with our products and services.
          </p>

          {/* Action: Add Review Button */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={handleOpenReviewModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600/80 hover:bg-blue-500 border border-blue-400/40 text-white font-montserrat font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <MessageSquarePlus className="w-4 h-4 text-blue-200" />
              <span>Write a Review</span>
            </button>

            {currentUser && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Member: {currentUser.name || currentUser.email}
              </span>
            )}
          </div>
        </div>

        {/* Testimonials Cards Grid (Matches Design Philosophy in Photo) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0f1d47]/75 via-[#0b1638]/70 to-[#070e24]/80 border border-blue-400/20 p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-[0_12px_40px_rgba(20,50,140,0.3)] hover:-translate-y-1.5"
            >
              {/* Card Ambient Glow on Hover */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-400/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10">
                {/* Avatar with Circular Frame */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-neutral-800 border-2 border-white/20 mb-5 shadow-md flex-shrink-0">
                  {t.user_avatar ? (
                    <img
                      src={t.user_avatar}
                      alt={t.user_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.user_name)}&backgroundColor=0c1638&textColor=ffffff`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-950 text-white">
                      <User className="w-6 h-6 text-blue-300" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-base sm:text-lg font-montserrat font-bold text-white tracking-tight">
                  {t.user_name}
                </h3>

                {/* Role / Location */}
                <p className="text-xs text-neutral-400 font-montserrat mt-0.5 mb-5 font-normal">
                  {t.role_title || 'Verified Customer'}
                </p>

                {/* Review Paragraph */}
                <p className="text-xs sm:text-sm text-neutral-300 font-montserrat leading-relaxed line-clamp-6">
                  {t.content}
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
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-600'
                      }`}
                    />
                  ))}
                </div>

                {t.product_name && (
                  <span className="text-[10px] font-mono text-blue-300/80 uppercase tracking-wider">
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
            className="relative w-full max-w-lg bg-[#0c1638] border border-blue-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-montserrat font-bold text-white flex items-center gap-2">
                  <MessageSquarePlus className="w-5 h-5 text-blue-300" />
                  Write a Review
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
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
                <h4 className="text-lg font-bold text-white">Thank You!</h4>
                <p className="text-xs text-neutral-300">
                  Your verified review has been published.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Rating Stars Selector */}
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
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
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-neutral-400 ml-2">
                      {rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Review Text Area */}
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell us about the craftsmanship, fit, hardware weight, or how it felt wearing it..."
                    className="w-full bg-[#070e24] border border-blue-400/20 rounded-xl p-3 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-400 placeholder:text-neutral-600 resize-none"
                    required
                  />
                </div>

                {/* Product Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                      Piece / Look Purchased
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. Motherboard Top"
                      className="w-full bg-[#070e24] border border-blue-400/20 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1.5">
                      Role or City
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder="e.g. Stylist • Mumbai"
                      className="w-full bg-[#070e24] border border-blue-400/20 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* User info preview */}
                <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Posting as verified member: <strong className="text-white">{currentUser?.name || currentUser?.email}</strong></span>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-neutral-300 hover:text-white text-xs font-montserrat cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-montserrat font-bold text-xs uppercase tracking-wide cursor-pointer disabled:opacity-50 transition-all shadow-md"
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
            className="relative w-full max-w-md bg-[#0c1638] border border-blue-400/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-300 mx-auto flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-montserrat font-bold text-white tracking-tight">
                Registered Members Only
              </h3>
              <p className="text-xs text-neutral-300 font-montserrat mt-2 leading-relaxed">
                To guarantee authenticity and avoid fake reviews, only verified registered users can post a customer review.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setAuthPromptOpen(false);
                  onOpenAuthModal?.();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-montserrat font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
              >
                Sign In / Register
              </button>
              <button
                onClick={() => setAuthPromptOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-montserrat text-xs cursor-pointer"
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
