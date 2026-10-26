import React, { useState, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, Clock, Tag, ShieldCheck, Phone, ArrowUpRight } from 'lucide-react';
import { BRAND_INFO } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function CustomOrders({ initialReference = '', onInquirySubmitted }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    referencePiece: initialReference || '',
    category: 'Custom Top / Bodice',
    measurements: '',
    designNotes: '',
    budgetTier: 'Core Statement Piece (₹1,000 – ₹3,000)'
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
    if (!formData.name.trim()) newErrors.name = 'Please provide your name or alias.';
    if (!formData.contact.trim()) newErrors.contact = 'WhatsApp number or email is required.';
    if (!formData.measurements.trim()) newErrors.measurements = 'Please enter your general size or bust/waist dimensions.';
    if (!formData.designNotes.trim()) newErrors.designNotes = 'Tell Dhristroyer about your vision or desired materials.';
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
      onInquirySubmitted(formData);
    }, 700);
  };

  return (
    <section id="custom" className="w-full py-28 px-6 sm:px-12 lg:px-20 bg-pitch-black select-none border-t border-white/5 text-left">
      {/* Header */}
      <div className="mb-14 pb-8 border-b border-white/10 text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 backdrop-blur-md mb-3 text-pink-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(190,24,93,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
          <span>BESPOKE WEARABLE ART // DIRECT ATELIER COMMISSION</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase tracking-tight text-white mb-6 leading-none text-left">
          COMMISSION A <span className="chrome-text">CUSTOM SPECIMEN</span>
        </h2>

        <p className="text-silver/85 text-sm md:text-base leading-relaxed font-montserrat max-w-3xl text-left">
          Everything at AVZ Vaganza is constructed by hand by Dhrisni and her Guwahati team. Have an idea for a motherboard harness, a chainmail corset, or a spiked denim relic? Fill out the brief below or contact our atelier directly via WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
        {/* Left: Pricing Tiers & Direct Contact Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          {/* Timeline & Craft Note */}
          <div className="p-8 rounded-3xl bg-[#0d020f]/80 backdrop-blur-xl border border-white/10 text-left">
            <div className="flex items-center gap-3 text-[#f472b6] font-spartan font-bold text-sm uppercase mb-3 text-left">
              <Clock className="w-4 h-4" />
              <span>THE TIMELINE: 2 TO 3 WEEKS</span>
            </div>
            <p className="text-silver/80 text-xs sm:text-sm font-montserrat leading-relaxed text-left">
              Every custom piece is hand-built from scratch using upcycled hardware, reclaimed textiles, and raw elements. Give us 2 to 3 weeks to forge your wearable sculpture.
            </p>
          </div>

          {/* Pricing Tiers Accordion Card */}
          <div className="p-8 rounded-3xl bg-[#0d020f]/80 backdrop-blur-xl border border-white/10 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-[#f472b6] uppercase mb-4 text-left">
              <Tag className="w-4 h-4 text-[#f472b6]" />
              <span>OFFICIAL CLIENT PRICING TIERS</span>
            </div>
            <div className="flex flex-col gap-4 text-left">
              {BRAND_INFO.pricingTiers.map((tier, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-black/60 border border-white/10 text-left">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-spartan font-bold text-white text-sm uppercase">
                      {tier.tier}
                    </span>
                    <span className="font-mono text-pink-300 text-xs font-bold px-3 py-1 rounded-full bg-[#be185d]/20 border border-[#be185d]/40 shadow-sm">
                      {tier.range}
                    </span>
                  </div>
                  <p className="text-silver/75 text-xs font-montserrat leading-relaxed text-left">
                    {tier.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct WhatsApp Contact CTA */}
          <div className="p-8 rounded-3xl bg-[#1c041f]/75 backdrop-blur-xl border border-[#be185d]/40 text-left shadow-[0_15px_40px_rgba(20,2,24,0.6)]">
            <div className="flex items-center gap-2 text-[#f472b6] font-spartan font-bold text-sm uppercase mb-2 text-left">
              <MessageCircle className="w-4 h-4" />
              <span>PREFER DIRECT WHATSAPP CONVERSATION?</span>
            </div>
            <p className="text-silver/85 text-xs sm:text-sm font-montserrat leading-relaxed mb-6 text-left">
              Chat directly with Dhrisni or our atelier dispatch. Send references, fit sketches, or ask sizing questions.
            </p>
            <a
              href={BRAND_INFO.whatsappLinkPrimary}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('laser')}
              className="btn-glass-pink w-full flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>WHATSAPP ATELIER (+91 73042 64901)</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right: Interactive Commission Brief Builder (7 cols) */}
        <div className="lg:col-span-7 p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/15">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-pink uppercase block mb-1">
                FORM 04 // COMMISSION SPECIFICATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-spartan font-black uppercase text-white">
                YOUR COMMISSION BRIEF
              </h3>
            </div>
            <ShieldCheck className="w-6 h-6 text-pink" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                  Name / Alias *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maya or @username"
                  className={`w-full bg-black/80 border ${
                    errors.name ? 'border-red-500' : 'border-white/15'
                  } px-5 py-3 rounded-full text-xs text-silver font-mono outline-none focus:border-pink transition-colors`}
                />
                {errors.name && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                  WhatsApp Number or Email *
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full bg-black/80 border ${
                    errors.contact ? 'border-red-500' : 'border-white/15'
                  } px-5 py-3 rounded-full text-xs text-silver font-mono outline-none focus:border-pink transition-colors`}
                />
                {errors.contact && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.contact}</span>}
              </div>
            </div>

            {/* Reference Piece */}
            <div>
              <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                Reference Museum Item / Inspiration (Optional)
              </label>
              <input
                type="text"
                name="referencePiece"
                value={formData.referencePiece}
                onChange={handleChange}
                placeholder="e.g. Motherboard Bralette Prototype 01 or your custom concept"
                className="w-full bg-black/80 border border-white/15 px-5 py-3 rounded-full text-xs text-silver font-mono outline-none focus:border-pink transition-colors"
              />
            </div>

            {/* Category & Budget Tier in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                  Garment / Accessory Type
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-black/80 border border-white/15 px-5 py-3 rounded-full text-xs text-silver font-mono outline-none focus:border-pink transition-colors cursor-pointer"
                >
                  <option value="Custom Top / Bodice">Custom Top / Bodice</option>
                  <option value="Spiked Corset / Bralette">Spiked Corset / Bralette</option>
                  <option value="Deconstructed Reworked Jacket">Deconstructed Reworked Jacket</option>
                  <option value="Chainmail Body Harness">Chainmail Body Harness</option>
                  <option value="Keycap / Motherboard Jewelry">Keycap / Motherboard Jewelry</option>
                  <option value="Arm Cuffs / Leg Warmers">Arm Cuffs / Leg Warmers</option>
                  <option value="Full Editorial Co-ord Ensemble">Full Editorial Co-ord Ensemble</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                  Target Price Tier
                </label>
                <select
                  name="budgetTier"
                  value={formData.budgetTier}
                  onChange={handleChange}
                  className="w-full bg-black/80 border border-white/15 px-5 py-3 rounded-full text-xs text-silver font-mono outline-none focus:border-pink transition-colors cursor-pointer"
                >
                  <option value="Tiny Details & Extras (< ₹1,000)">Tiny Details & Extras (Under ₹1,000)</option>
                  <option value="Core Statement Piece (₹1,000 – ₹3,000)">Core Statement Piece (₹1,000 – ₹3,000)</option>
                  <option value="Heavy Art & Full Build (₹3,000+)">Heavy Art & Full Build (₹3,000+)</option>
                </select>
              </div>
            </div>

            {/* Measurements */}
            <div>
              <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                Drop Your Measurements (Bust / Waist / Hips) *
              </label>
              <input
                type="text"
                name="measurements"
                value={formData.measurements}
                onChange={handleChange}
                placeholder="e.g. Bust 34B, Waist 26, Hips 36 (or Size S) — custom cinched fit bestie"
                className={`w-full bg-black/80 border ${
                  errors.measurements ? 'border-red-500' : 'border-white/15'
                } px-5 py-3 rounded-full text-xs text-silver font-mono outline-none focus:border-pink transition-colors`}
              />
              {errors.measurements && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.measurements}</span>}
            </div>

            {/* Design Notes */}
            <div>
              <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                Your Vision, Hardware & Aesthetic Vibe *
              </label>
              <textarea
                name="designNotes"
                rows={4}
                value={formData.designNotes}
                onChange={handleChange}
                placeholder="Tell Dhrisni your vision: unhinged cyber spikes, green circuit board panels, iridescent wire, safety pins, or rave-ready main character armor."
                className={`w-full bg-black/80 border ${
                  errors.designNotes ? 'border-red-500' : 'border-white/15'
                } p-5 rounded-2xl text-xs text-silver font-mono outline-none focus:border-pink resize-none transition-colors`}
              />
              {errors.designNotes && <span className="text-[10px] text-red-400 font-mono mt-1 block">{errors.designNotes}</span>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-glass-pink mt-3 py-4 text-xs font-spartan font-black tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'TRANSMITTING BRIEF TO DHRISNI...' : 'COMMISSION THIS GRAIL (SERVE DRIP) 💅'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
