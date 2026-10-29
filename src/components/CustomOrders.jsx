import React, { useState, useEffect } from 'react';
import {
  Send,
  Sparkles,
  MessageCircle,
  Clock,
  Tag,
  ShieldCheck,
  Phone,
  ArrowUpRight,
  Layers,
  Cpu,
  Scissors,
  CheckCircle2,
  Calendar,
  Lock
} from 'lucide-react';
import { BRAND_INFO } from '../data/brandData';
import { playSound } from '../utils/audio';

const COMMISSION_PHASES = [
  {
    step: "01",
    title: "CONSULTATION",
    subtitle: "Brief & Silhouette",
    desc: "Review of aesthetic reference, silhouette specs, and body measurements."
  },
  {
    step: "02",
    title: "SOURCING",
    subtitle: "Hardware Allocation",
    desc: "Harvesting decommissioned motherboards, cones, rings, and deadstock denim."
  },
  {
    step: "03",
    title: "FABRICATION",
    subtitle: "Atelier Handcraft",
    desc: "Precision hand-sculpted by Dhrisni & women artisans in Guwahati."
  },
  {
    step: "04",
    title: "DELIVERY",
    subtitle: "Authentication & Dispatch",
    desc: "Final structural calibration, video sign-off, and insured express delivery."
  }
];

export default function CustomOrders({ initialReference = '', onInquirySubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    referencePiece: initialReference || '',
    category: 'Custom Top / Bodice',
    budgetTier: 'Core Statement Piece (₹1,000 – ₹3,000)',
    measurements: '',
    designNotes: '',
    preferredTimeline: 'Standard (2 to 3 weeks)'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialReference) {
      setFormData((prev) => ({ ...prev, referencePiece: initialReference }));
    }
  }, [initialReference]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Client name or alias is required.';
    if (!formData.contact.trim()) newErrors.contact = 'Valid WhatsApp or phone contact is required.';
    if (!formData.measurements.trim()) newErrors.measurements = 'Anatomical dimensions (bust, waist, or size profile) are required.';
    if (!formData.designNotes.trim()) newErrors.designNotes = 'Please describe your concept, hardware preference, or styling brief.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      playSound('glitch');
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    playSound('snap');

    setTimeout(() => {
      setSubmitting(false);
      playSound('chord');
      onInquirySubmitted({
        ...formData,
        submittedAt: new Date().toISOString()
      });
    }, 750);
  };

  return (
    <section id="custom" className="w-full py-12 sm:py-20 px-4 sm:px-8 lg:px-14 bg-transparent select-none border-t border-white/10 text-left">
      {/* Editorial Header */}
      <div className="max-w-6xl mx-auto mb-10 pb-6 border-b border-white/10 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 mb-3 text-pink text-[11px] font-mono tracking-[0.25em] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
          <span>BESPOKE WEARABLE ART // DIRECT ATELIER COMMISSION</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-[0.16em] text-white uppercase mb-3 leading-tight text-left">
          ATELIER <span className="text-zinc-400 font-light">COMMISSIONS</span>
        </h2>

        <p className="text-zinc-300 text-xs sm:text-sm lg:text-base leading-relaxed font-montserrat max-w-4xl text-left">
          Every custom AVZ creation is individually engineered and built by hand by Dhrisni and her Guwahati atelier team. We do not mass-reproduce: each commission is an original evolution tailored to your measurements, hardware preferences, and creative sovereignty.
        </p>

        {/* 4-Phase Commission Protocol */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-white/10">
          {COMMISSION_PHASES.map((p) => (
            <div key={p.step} className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-pink tracking-widest">{p.step} //</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">{p.title}</span>
              </div>
              <h4 className="font-mono text-xs sm:text-sm font-bold uppercase text-white mb-1">
                {p.subtitle}
              </h4>
              <p className="text-[11px] font-montserrat text-zinc-400 leading-normal line-clamp-2">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 text-left items-start">
        {/* Left Column: Official Pricing Tiers & Concierge Dispatch (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          {/* Atelier Production Timeline */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0c12] border border-white/12 text-left mobile-grunge-card shadow-lg">
            <div className="flex items-center gap-2.5 text-pink font-mono text-xs uppercase tracking-widest mb-2.5 font-bold">
              <Clock className="w-4 h-4 text-pink" />
              <span>TIMELINE: 2 TO 3 WEEKS PER BUILD</span>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm font-montserrat leading-relaxed text-left">
              Because raw motherboards must be hand-cut, edged, and reinforced, and chain links individually woven, bespoke pieces require 14 to 21 working days for assembly, curing, and structural verification.
            </p>
          </div>

          {/* Pricing Tiers Matrix */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c12] border border-white/12 text-left mobile-grunge-card shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono tracking-widest text-pink uppercase mb-4 font-bold">
              <span className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-pink" />
                <span>OFFICIAL ATELIER PRICING TIERS</span>
              </span>
              <span className="text-[10px] text-zinc-500">2026 RATES</span>
            </div>

            <div className="flex flex-col gap-3.5 text-left">
              {BRAND_INFO.pricingTiers.map((tier, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left transition-all hover:border-pink/40">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                      {tier.tier}
                    </span>
                    <span className="font-mono text-pink text-xs font-bold px-3 py-0.5 rounded-full bg-pink/15 border border-pink/35 shrink-0">
                      {tier.range}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-xs font-montserrat leading-relaxed text-left">
                    {tier.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct VIP WhatsApp Atelier Hotline */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18041d] to-[#0c0c12] border border-pink/30 text-left shadow-xl mobile-grunge-card">
            <div className="flex items-center gap-2 text-pink font-mono text-xs uppercase tracking-widest mb-2 font-bold">
              <MessageCircle className="w-4 h-4 text-pink" />
              <span>DIRECT ATELIER CONCIERGE HOTLINE</span>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm font-montserrat leading-relaxed mb-5 text-left">
              Prefer an immediate voice or WhatsApp consultation? Send photos, sketches, or event dates directly to Dhrisni's dispatch desk.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={BRAND_INFO.whatsappLinkPrimary}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('snap')}
                className="btn-glass-pink flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-mono font-bold tracking-wider uppercase shadow-md active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>PRIMARY: +91 73042 64901</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={BRAND_INFO.whatsappLinkSecondary}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('snap')}
                className="py-3 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider uppercase transition-all active:scale-95"
              >
                <span>ALT: +91 82910 13848</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: High-Precision Bespoke Commission Brief Builder (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 rounded-3xl bg-[#0c0c12] border border-white/15 mobile-grunge-card shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-pink uppercase block mb-1 font-bold">
                COMMISSION DISPATCH // FORM 04
              </span>
              <h3 className="text-xl sm:text-2xl font-mono font-bold uppercase tracking-[0.14em] text-white">
                BESPOKE SPECIFICATION BRIEF
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-zinc-400 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-pink" />
              <span>ATELIER VERIFIED</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            {/* Section 1: Client Contact Profile */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                01 // CLIENT IDENTIFICATION & CONTACT
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    Client Name / Alias *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maya Baruah or @handle"
                    className={`w-full bg-black/80 border ${
                      errors.name ? 'border-red-500' : 'border-white/15'
                    } px-4 py-2.5 rounded-xl text-xs text-white font-mono outline-none focus:border-pink transition-colors`}
                  />
                  {errors.name && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full bg-black/80 border ${
                      errors.contact ? 'border-red-500' : 'border-white/15'
                    } px-4 py-2.5 rounded-xl text-xs text-white font-mono outline-none focus:border-pink transition-colors`}
                  />
                  {errors.contact && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.contact}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Piece Architecture & Tier */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                02 // PIECE ARCHITECTURE & INVESTMENT TIER
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    Garment / Specimen Type
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-black/80 border border-white/15 px-4 py-2.5 rounded-xl text-xs text-white font-mono outline-none focus:border-pink transition-colors cursor-pointer"
                  >
                    <option value="Custom Top / Bodice">Custom Top / Bodice</option>
                    <option value="Spiked Corset / Bralette">Spiked Corset / Bralette</option>
                    <option value="Motherboard Silicon Diva Top">Motherboard Silicon Diva Top</option>
                    <option value="Deconstructed Moto Jacket">Deconstructed Moto Jacket</option>
                    <option value="Chainmail Body Armor Harness">Chainmail Body Armor Harness</option>
                    <option value="Keyboard Keycap Jewelry / Harness">Keyboard Keycap Jewelry / Harness</option>
                    <option value="Arm Cuffs / Leg Warmers">Arm Cuffs / Leg Warmers</option>
                    <option value="Full Editorial Co-ord Ensemble">Full Editorial Co-ord Ensemble</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                    Investment Tier
                  </label>
                  <select
                    name="budgetTier"
                    value={formData.budgetTier}
                    onChange={handleChange}
                    className="w-full bg-black/80 border border-white/15 px-4 py-2.5 rounded-xl text-xs text-white font-mono outline-none focus:border-pink transition-colors cursor-pointer"
                  >
                    <option value="Tiny Details & Extras (< ₹1,000)">Tiny Details & Extras (Under ₹1,000)</option>
                    <option value="Core Statement Piece (₹1,000 – ₹3,000)">Core Statement Piece (₹1,000 – ₹3,000)</option>
                    <option value="Heavy Art & Full Build (₹3,000+)">Heavy Art & Full Build (₹3,000+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                  Archival Reference or Inspiration Piece (Optional)
                </label>
                <input
                  type="text"
                  name="referencePiece"
                  value={formData.referencePiece}
                  onChange={handleChange}
                  placeholder="e.g. Archival Motherboard Bralette Prototype 01 or Look 005 Chainmail"
                  className="w-full bg-black/80 border border-white/15 px-4 py-2.5 rounded-xl text-xs text-white font-mono outline-none focus:border-pink transition-colors"
                />
              </div>
            </div>

            {/* Section 3: Anatomical Fit Profile */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                03 // ANATOMICAL FIT PROFILE
              </span>
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                  Body Dimensions (Bust / Underbust / Waist / Hips) *
                </label>
                <input
                  type="text"
                  name="measurements"
                  value={formData.measurements}
                  onChange={handleChange}
                  placeholder="e.g. Bust 34B, Underbust 30, Waist 26, Hips 36 (or Standard Size S)"
                  className={`w-full bg-black/80 border ${
                    errors.measurements ? 'border-red-500' : 'border-white/15'
                  } px-4 py-2.5 rounded-xl text-xs text-white font-mono outline-none focus:border-pink transition-colors`}
                />
                {errors.measurements && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.measurements}</span>}
              </div>
            </div>

            {/* Section 4: Creative Direction & Material Brief */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                04 // CREATIVE BRIEF & RAW MATERIALITY
              </span>
              <div>
                <label className="block text-[11px] font-mono uppercase text-zinc-300 font-semibold mb-1.5">
                  Creative Vision, Preferred Hardware & Event Context *
                </label>
                <textarea
                  name="designNotes"
                  rows={4}
                  value={formData.designNotes}
                  onChange={handleChange}
                  placeholder="Detail your bespoke concept: circuit board colors (green/black), cone spike density, chainmail fluid drape, festival vs editorial context, or deadline dates."
                  className={`w-full bg-black/80 border ${
                    errors.designNotes ? 'border-red-500' : 'border-white/15'
                  } p-4 rounded-xl text-xs text-white font-mono outline-none focus:border-pink resize-none transition-colors`}
                />
                {errors.designNotes && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.designNotes}</span>}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-glass-pink w-full py-4 rounded-full text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'TRANSMITTING BRIEF TO ATELIER DISPATCH...' : 'TRANSMIT BESPOKE COMMISSION BRIEF ↗'}</span>
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mt-3 px-1">
                <span>⚡ 24-HOUR ATELIER RESPONSE GUARANTEED</span>
                <span>HAND-BUILT IN GUWAHATI</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
