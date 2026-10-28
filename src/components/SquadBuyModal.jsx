import React, { useState, useEffect } from 'react';
import {
  Users,
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
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
  const [squadCode, setSquadCode] = useState('AVZ-GROUP-24');
  const [copied, setCopied] = useState(false);
  const [memberCount, setMemberCount] = useState(2);
  const [inputCode, setInputCode] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playSound('pip');
      const rand = Math.floor(1000 + Math.random() * 9000);
      setSquadCode(`AVZ-${rand}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const squadLink = `https://aveezahvaganza.com/group/${squadCode}`;

  const handleCopyLink = () => {
    playSound('click');
    navigator.clipboard?.writeText(squadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    playSound('snap');
    const msg = encodeURIComponent(
      `Join my AVZ Vaganza collective order to unlock tiered atelier privileges on 1-of-1 archival pieces: ${squadLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const handleApplyDiscount = () => {
    playSound('chord');
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
        className="w-full max-w-xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-left relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 text-zinc-400 text-[10px] font-mono tracking-widest uppercase mb-2">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>COLLECTIVE ORDERS // ATELIER GROUP PRIVILEGE</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-mono font-medium uppercase text-white leading-tight">
            GROUP ACQUISITION, <span className="text-zinc-400 font-light">TIERED PRIVILEGES</span>
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 font-montserrat mt-1.5 leading-relaxed">
            Collaborative orders unlock tiered atelier discounts, complimentary archival gifts, and priority express shipping across India.
          </p>
        </div>

        {/* Tier Progression Progress Bar */}
        <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-white/10 mb-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-white font-medium flex items-center gap-1.5">
              CURRENT TIER: {memberCount >= 4 ? '20% OFF' : memberCount >= 3 ? '15% OFF' : '10% OFF'}
            </span>
            <span className="text-zinc-500 flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3" />
              LOCKED FOR 24H
            </span>
          </div>

          {/* Stepped Progress Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono my-3">
            <div className={`p-2 rounded-lg border ${memberCount >= 2 ? 'bg-white/15 border-white/40 text-white font-bold' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
              <div className="text-[11px] text-zinc-300">2 CLIENTS</div>
              <div>10% PRIVILEGE</div>
            </div>
            <div className={`p-2 rounded-lg border ${memberCount >= 3 ? 'bg-white/15 border-white/40 text-white font-bold' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
              <div className="text-[11px] text-zinc-300">3 CLIENTS</div>
              <div>15% PRIVILEGE + GIFT</div>
            </div>
            <div className={`p-2 rounded-lg border ${memberCount >= 4 ? 'bg-white/15 border-white/40 text-white font-bold' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
              <div className="text-[11px] text-zinc-300">4+ CLIENTS</div>
              <div>20% PRIVILEGE + ARCHIVE</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
            <span>{memberCount} Clients in Group Session</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              >
                -
              </button>
              <button
                onClick={() => setMemberCount(Math.min(6, memberCount + 1))}
                className="w-5 h-5 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Shareable Group Invite Link */}
        <div className="space-y-3 mb-6">
          <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
            SHARE GROUP PRIVILEGE LINK:
          </label>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-black border border-white/15">
            <input
              type="text"
              readOnly
              value={squadLink}
              className="bg-transparent flex-1 text-xs font-mono text-white px-2 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>COPIED</span>
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
              className="flex-1 py-2 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-zinc-400" />
              <span>SHARE VIA WHATSAPP</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-zinc-400" />
              <span>COPY LINK</span>
            </button>
          </div>
        </div>

        {/* Join an Existing Group Code */}
        <form onSubmit={handleJoinCode} className="pt-4 border-t border-white/10 mb-6">
          <label className="block text-[11px] font-mono text-zinc-400 mb-2 uppercase">
            HAVE A GROUP CODE?
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. AVZ-9481 or SQUAD"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              className="flex-1 bg-black border border-white/15 focus:border-white/40 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-white transition-all cursor-pointer"
            >
              APPLY
            </button>
          </div>
          {joinSuccess && (
            <p className="text-xs font-mono text-green-400 mt-2 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              Group code accepted. 15% privilege applied.
            </p>
          )}
        </form>

        {/* Action Button: Apply and Proceed to Cart */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleApplyDiscount}
            className="w-full py-3.5 px-6 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-mono font-semibold tracking-widest uppercase cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>APPLY GROUP PRIVILEGE & GO TO BAG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] font-mono text-zinc-500 text-center">
            Privilege applies immediately at checkout. Each client orders independently with private delivery address.
          </p>
        </div>
      </div>
    </div>
  );
}
