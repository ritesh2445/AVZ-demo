'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ChevronRight, X } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function DPDPConsentBanner({ onOpenPrivacyModal }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('avz_dpdp_consent');
      if (!consent) {
        // Show banner after brief delay for smooth entrance
        const t = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(t);
      }
    } catch (e) {}
  }, []);

  const handleAccept = () => {
    playSound('snap');
    try {
      localStorage.setItem('avz_dpdp_consent', 'accepted');
    } catch (e) {}
    setShowBanner(false);
  };

  const handleDismiss = () => {
    playSound('pip');
    try {
      localStorage.setItem('avz_dpdp_consent', 'essential_only');
    } catch (e) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Data Privacy and Cookie Notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-[99990] bg-[#0c0c12]/95 border border-pink/30 rounded-2xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-xl text-left animate-slide-up select-none"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-pink">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold text-white">
            DPDP ACT 2023 NOTICE
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-zinc-500 hover:text-white p-1 transition-colors cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] sm:text-xs text-zinc-300 font-montserrat leading-relaxed mb-3.5">
        We value your privacy. In accordance with India’s Digital Personal Data Protection Act, we only collect necessary data (shipping, measurements, orders) to handcraft and deliver your wearable art. We never sell your data.
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-pink via-purple-300 to-pink text-black font-mono font-bold text-[10px] sm:text-[11px] tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md text-center"
        >
          ACCEPT & CONTINUE
        </button>
        <button
          onClick={() => {
            playSound('snap');
            onOpenPrivacyModal?.('privacy');
          }}
          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-[10px] sm:text-[11px] tracking-wider uppercase transition-all cursor-pointer text-center"
        >
          PRIVACY NOTICE
        </button>
      </div>
    </div>
  );
}
