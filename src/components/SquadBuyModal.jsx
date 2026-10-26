import React, { useState, useEffect } from 'react';
import {
  Users,
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  Gift,
  Flame,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Clock
} from 'lucide-react';
import { playSound } from '../utils/audio';

export default function SquadBuyModal({
  isOpen,
  onClose,
  onApplySquadDiscount,
  activeProduct = null
}) {
  const [squadCode, setSquadCode] = useState('BADDIE-SLAY-77');
  const [copied, setCopied] = useState(false);
  const [memberCount, setMemberCount] = useState(2);
  const [inputCode, setInputCode] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playSound('pip');
      // Generate a chic squad code
      const rand = Math.floor(1000 + Math.random() * 9000);
      setSquadCode(`BADDIE-${rand}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const squadLink = `https://aveezahvaganza.com/squad/${squadCode}`;

  const handleCopyLink = () => {
    playSound('click');
    navigator.clipboard?.writeText(squadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    playSound('snap');
    const msg = encodeURIComponent(
      `Hey bestie! 💕 Join my AVZ Vaganza squad order so we both get 15-20% off our 1-of-1 wearable art grails! Join my squad here: ${squadLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleApplyDiscount = () => {
    playSound('chord');
    // Calculate discount rate based on squad size (minimum 15% for squad)
    const discountPercent = memberCount >= 4 ? 20 : memberCount >= 3 ? 15 : 10;
    onApplySquadDiscount({
      squadCode,
      discountPercent,
      memberCount
    });
    onClose();
  };

  const handleJoinCode = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    playSound('warp');
    setJoinSuccess(true);
    setMemberCount(3);
    setTimeout(() => {
      onApplySquadDiscount({
        squadCode: inputCode.toUpperCase(),
        discountPercent: 15,
        memberCount: 3
      });
      onClose();
    }, 1200);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99998] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-gradient-to-b from-[#1c041f] via-black to-[#120216] border border-[#be185d]/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(45,3,45,0.9)] text-left relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-52 h-52 bg-[#be185d]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a0530] border border-[#be185d]/40 text-pink-300 text-[10px] font-mono tracking-widest uppercase mb-2">
            <Users className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>BADDIE SQUAD BUY // GROUP ORDER DISCOUNTS</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white leading-tight">
            SLAY TOGETHER, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-pink to-purple-400">SAVE UP TO 20%</span>
          </h3>

          <p className="text-xs sm:text-sm text-silver/80 font-montserrat mt-1.5 leading-relaxed">
            Invite your besties to pool orders. Unlock tiered squad discounts, free hardware gifts, and free express shipping across India, no cap.
          </p>
        </div>

        {/* Tier Progression Progress Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/70 border border-white/10 mb-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-pink-300 font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#f472b6]" />
              CURRENT SQUAD TIER: {memberCount >= 4 ? '20% OFF' : memberCount >= 3 ? '15% OFF' : '10% OFF'}
            </span>
            <span className="text-silver/60 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              LOCKED FOR 24H
            </span>
          </div>

          {/* Stepped Progress Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono my-3">
            <div className={`p-2 rounded-xl border ${memberCount >= 2 ? 'bg-[#be185d]/25 border-pink-400 text-white font-bold' : 'bg-white/5 border-white/10 text-silver/60'}`}>
              <div className="text-[11px] text-pink-300">2 BADDIES</div>
              <div>10% OFF</div>
            </div>
            <div className={`p-2 rounded-xl border ${memberCount >= 3 ? 'bg-[#be185d]/25 border-pink-400 text-white font-bold' : 'bg-white/5 border-white/10 text-silver/60'}`}>
              <div className="text-[11px] text-pink-300">3 BADDIES</div>
              <div>15% OFF + CHOKER</div>
            </div>
            <div className={`p-2 rounded-xl border ${memberCount >= 4 ? 'bg-[#be185d]/25 border-pink-400 text-white font-bold' : 'bg-white/5 border-white/10 text-silver/60'}`}>
              <div className="text-[11px] text-pink-300">4+ BADDIES</div>
              <div>20% OFF + VIP DROP</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-silver/70 pt-1">
            <span>{memberCount} Baddies in Squad Room</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                -
              </button>
              <button
                onClick={() => setMemberCount(Math.min(6, memberCount + 1))}
                className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Shareable Squad Invite Link */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-mono text-pink-300 uppercase tracking-wider">
            SHARE YOUR SQUAD INVITE LINK:
          </label>

          <div className="flex items-center gap-2 p-2 rounded-2xl bg-black/80 border border-white/15">
            <input
              type="text"
              readOnly
              value={squadLink}
              className="bg-transparent flex-1 text-xs font-mono text-white px-3 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-pink-400/20 hover:bg-pink-400/30 border border-pink-400/40 text-pink-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>INVITE ON WHATSAPP</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-pink-300" />
              <span>SHARE LINK</span>
            </button>
          </div>
        </div>

        {/* Join an Existing Squad Code */}
        <form onSubmit={handleJoinCode} className="pt-4 border-t border-white/10 mb-6">
          <label className="block text-[11px] font-mono text-silver/70 mb-2 uppercase">
            HAVE A BESTIE'S SQUAD CODE?
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. BADDIE-9481 or SQUAD"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="flex-1 bg-white/5 border border-white/15 focus:border-[#be185d] rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-silver/40 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#be185d] border border-white/20 text-xs font-mono font-bold text-white transition-all cursor-pointer"
            >
              JOIN SQUAD
            </button>
          </div>
          {joinSuccess && (
            <p className="text-xs font-mono text-green-400 mt-2 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Joined Squad! 15% discount unlocked.
            </p>
          )}
        </form>

        {/* Action Button: Apply and Proceed to Cart */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleApplyDiscount}
            className="btn-glass-pink py-3.5 px-6 text-xs font-spartan font-black tracking-widest uppercase text-center cursor-pointer flex items-center justify-center gap-2"
          >
            <span>LOCK IN SQUAD DISCOUNT & GO TO BAG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] font-mono text-silver/50 text-center">
            Discount applies instantly at checkout. Each bestie orders independently to their own address.
          </p>
        </div>
      </div>
    </div>
  );
}
