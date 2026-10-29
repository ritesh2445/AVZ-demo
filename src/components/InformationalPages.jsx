import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone, MapPin, Instagram, Package, Truck, RefreshCw, Sparkles, ShieldAlert } from 'lucide-react';
import { BRAND_INFO, FAQS } from '../data/brandData';
import { playSound } from '../utils/audio';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (idx) => {
    playSound('snap');
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full py-16 sm:py-28 px-4 sm:px-12 lg:px-20 bg-transparent select-none border-t border-[#be185d]/20 relative">
      {/* Background Centered Ambient True Dark Purple Plum Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2d052d]/30 rounded-full blur-[160px] pointer-events-none" />

      {/* Centered Editorial Header */}
      <div className="max-w-3xl mx-auto text-center mb-14 pb-8 border-b border-white/10 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 mb-3 text-zinc-400 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          <span>HELP & ANSWERS • CUSTOMER CARE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-mono tracking-[0.2em] text-white uppercase leading-tight text-center">
          FREQUENTLY ASKED <span className="text-zinc-400 font-light">QUESTIONS</span>
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl font-montserrat mt-2 sm:mt-3 text-center leading-relaxed">
          Helpful information on custom orders, sizing, shipping, and garment care.
        </p>
      </div>

      {/* Centered Accordion Cards List */}
      <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full relative z-10 text-left">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-3xl transition-all duration-300 border ${
                isOpen
                  ? 'bg-[#0d020f]/95 backdrop-blur-2xl border-[#be185d]/70 shadow-[0_12px_40px_rgba(190,24,93,0.25),0_0_30px_rgba(45,5,45,0.7)]'
                  : 'bg-[#0d020f]/60 backdrop-blur-xl border-[#be185d]/20 hover:border-[#be185d]/50'
              }`}
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className={`font-spartan font-bold text-base sm:text-lg uppercase transition-colors text-left ${
                  isOpen ? 'text-white' : 'text-silver/90 hover:text-white'
                }`}>
                  {faq.q}
                </span>
                <span className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all flex-shrink-0 ${
                  isOpen
                    ? 'bg-gradient-to-r from-[#9D174D] to-[#BE185D] text-white border-[#f472b6]/50 shadow-[0_0_15px_rgba(190,24,93,0.5)] font-bold'
                    : 'border-white/20 bg-white/5 text-pink-300 hover:border-[#be185d] hover:bg-[#be185d]/10'
                }`}>
                  {isOpen ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-sm text-silver/85 font-montserrat leading-relaxed border-t border-[#be185d]/15 whitespace-pre-line animate-fade-in text-left">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-14 bg-transparent select-none border-t border-white/10 text-left">
      <div className="max-w-6xl mx-auto mb-12 pb-6 border-b border-white/10 text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 mb-3 text-pink text-[11px] font-mono tracking-[0.25em] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse" />
          <span>CUSTOMER CARE • DIRECT STUDIO CONCIERGE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-[0.16em] text-white uppercase leading-tight text-left">
          STUDIO <span className="text-zinc-400 font-light">CONTACT & SUPPORT</span>
        </h2>
        <p className="text-zinc-300 text-xs sm:text-sm lg:text-base font-montserrat mt-2 max-w-3xl leading-relaxed">
          Direct communication channels to our Guwahati studio, founder creative direction desk, and customer styling team.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left">
        {/* Card 1: Registered Studio & Operations */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0c0c12] border border-white/12 flex flex-col justify-between text-left mobile-grunge-card shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink font-bold">
                1. STUDIO LOCATION
              </span>
              <MapPin className="w-4 h-4 text-pink" />
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-bold uppercase text-white mb-3">
              STUDIO HEADQUARTERS
            </h3>

            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 mb-4">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">REGISTERED STUDIO ADDRESS</span>
              <p className="text-xs sm:text-sm text-white font-montserrat leading-relaxed">
                {BRAND_INFO.registeredAddress}
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono text-zinc-300">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400 uppercase text-[10px]">STUDIO HOURS:</span>
                <span className="text-white font-medium">MON – SAT • 10:00 AM – 7:00 PM IST</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-zinc-400 uppercase text-[10px]">LEAD DESIGNER:</span>
                <span className="text-pink font-semibold">DHRISNI (DHRISTROYER)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400 uppercase text-[10px]">ORIGIN REGION:</span>
                <span className="text-white">GUWAHATI, ASSAM, INDIA</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-white/10 text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
            <span>OFFICIAL LABEL EST. 2024</span>
            <span className="text-pink">1-OF-1 ORIGINAL</span>
          </div>
        </div>

        {/* Card 2: Dedicated Email Communications Desks */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0c0c12] border border-white/12 flex flex-col justify-between text-left mobile-grunge-card shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink font-bold">
                2. OFFICIAL EMAIL DESKS
              </span>
              <Mail className="w-4 h-4 text-pink" />
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-bold uppercase text-white mb-3">
              OFFICIAL DESKS
            </h3>

            <div className="space-y-3.5 mb-5">
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 transition-colors hover:border-pink/40">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">CUSTOMER ORDERS & CUSTOM INQUIRIES</span>
                <a
                  href={`mailto:${BRAND_INFO.businessEmail}`}
                  className="text-xs sm:text-sm font-mono text-white hover:text-pink transition-colors font-semibold break-all flex items-center justify-between"
                >
                  <span>{BRAND_INFO.businessEmail}</span>
                  <span className="text-pink text-[10px]">MAIL ↗</span>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 transition-colors hover:border-pink/40">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">CREATIVE DIRECTOR & PRESS DESK</span>
                <a
                  href={`mailto:${BRAND_INFO.founderEmail}`}
                  className="text-xs sm:text-sm font-mono text-white hover:text-pink transition-colors font-semibold break-all flex items-center justify-between"
                >
                  <span>{BRAND_INFO.founderEmail}</span>
                  <span className="text-pink text-[10px]">MAIL ↗</span>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 transition-colors hover:border-pink/40">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">OFFICIAL INSTAGRAM</span>
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playSound('snap')}
                  className="text-xs sm:text-sm font-mono text-white hover:text-pink transition-colors font-semibold flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-3.5 h-3.5 text-pink" />
                    <span>{BRAND_INFO.instagram}</span>
                  </span>
                  <span className="text-pink text-[10px]">FOLLOW ↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span>RESPONSE TIME:</span>
            <span className="text-white font-medium">WITHIN 24 HOURS</span>
          </div>
        </div>

        {/* Card 3: Direct VIP Client Concierge WhatsApp */}
        <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-[#18041d] to-[#0c0c12] border border-pink/30 flex flex-col justify-between text-left mobile-grunge-card shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink font-bold">
                3. DIRECT WHATSAPP HOTLINE
              </span>
              <Phone className="w-4 h-4 text-pink" />
            </div>

            <h3 className="font-mono text-lg sm:text-xl font-bold uppercase text-white mb-2">
              DIRECT WHATSAPP HOTLINE
            </h3>

            <p className="text-zinc-300 text-xs sm:text-sm font-montserrat leading-relaxed mb-5">
              Direct connection to Dhrisni and our studio team. Ideal for event deadlines, measurement help, or quick order questions.
            </p>

            <div className="flex flex-col gap-3 mb-4">
              <a
                href={BRAND_INFO.whatsappLinkPrimary}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('laser')}
                className="contact-action-btn-primary w-full p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg active:scale-98 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[9px] font-mono tracking-widest text-pink-200 uppercase font-semibold">
                      DIRECT WHATSAPP CONCIERGE
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wider whitespace-nowrap">
                      {BRAND_INFO.whatsappPrimary}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white/20 border border-white/30 text-white text-[10px] font-mono font-bold tracking-widest uppercase shrink-0 flex items-center gap-1 group-hover:bg-white/30 transition-all">
                  <span>CHAT</span>
                  <span className="text-xs">↗</span>
                </div>
              </a>

              <a
                href={BRAND_INFO.whatsappLinkSecondary}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('laser')}
                className="contact-action-btn-secondary w-full p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md active:scale-98 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-pink/15 border border-pink/30 flex items-center justify-center text-pink shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase font-semibold">
                      STUDIO CARE & SUPPORT
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white tracking-wider whitespace-nowrap">
                      {BRAND_INFO.whatsappSecondary}
                    </span>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-pink text-[10px] font-mono font-bold tracking-widest uppercase shrink-0 flex items-center gap-1 group-hover:border-pink/40 transition-all">
                  <span>CHAT</span>
                  <span className="text-xs">↗</span>
                </div>
              </a>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] font-montserrat text-zinc-300 leading-relaxed">
              <strong className="text-pink font-mono block mb-0.5 text-[10px] uppercase">DAMAGE VERIFICATION CLAIMS:</strong>
              Send an unboxing video within 48 hours to WhatsApp for prompt assistance.
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>SUPPORT STATUS:</span>
            <span className="text-pink font-semibold">DIRECT VERIFIED SUPPORT</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShippingPackagingReturns() {
  return (
    <section id="specs" className="w-full py-16 sm:py-28 px-4 sm:px-12 lg:px-20 bg-pitch-black select-none border-t border-white/5">
      <div className="mb-10 sm:mb-14 pb-6 sm:pb-8 border-b border-white/10 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 mb-3 text-zinc-400 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          <span>SHIPPING & PACKAGING • GLOBAL COURIER</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-mono tracking-[0.2em] text-white uppercase mb-3 leading-tight">
          SHIPPING, PACKAGING & <span className="text-zinc-400 font-light">RETURNS</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-montserrat max-w-xl">
          Reliable shipping, custom luxury packaging, and clear return policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between mobile-grunge-card">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-black/60 border border-white/10 mb-4">
              <Truck className="w-6 h-6 text-pink" />
            </div>
            <h3 className="text-xl font-spartan font-bold uppercase text-white mb-3">SHIPPING & DELIVERY</h3>
            <ul className="text-xs sm:text-sm font-montserrat text-silver/80 space-y-3 leading-relaxed">
              <li>• Flat-rate shipping across India.</li>
              <li>• <strong className="text-pink">FREE SHIPPING</strong> on all orders above ₹5,000.</li>
              <li>• Estimated delivery time: 1–2 weeks.</li>
              <li>• Worldwide international courier delivery available (rates calculated at checkout).</li>
            </ul>
          </div>
        </div>

        {/* Packaging */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between mobile-grunge-card">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-black/60 border border-white/10 mb-4">
              <Package className="w-6 h-6 text-pink" />
            </div>
            <h3 className="text-xl font-spartan font-bold uppercase text-white mb-3">UNBOXING EXPERIENCE</h3>
            <ul className="text-xs sm:text-sm font-montserrat text-silver/80 space-y-3 leading-relaxed">
              <li>• Signature matte-black boxes with the embossed AVZ logo.</li>
              <li>• Freebies & stickers on eligible drops.</li>
              <li>• Handwritten thank-you notes from Dhrisni.</li>
              <li>• Gourmet artisanal chocolates included with every parcel.</li>
            </ul>
          </div>
        </div>

        {/* Returns */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between mobile-grunge-card">
          <div>
            <div className="p-3 w-fit rounded-2xl bg-black/60 border border-white/10 mb-4">
              <RefreshCw className="w-6 h-6 text-pink" />
            </div>
            <h3 className="text-xl font-spartan font-bold uppercase text-white mb-3">RETURNS & EXCHANGES</h3>
            <ul className="text-xs sm:text-sm font-montserrat text-silver/80 space-y-3 leading-relaxed">
              <li>• Returns accepted for visible product damage.</li>
              <li>• Free size replacement available for sizing issues.</li>
              <li>• <strong className="text-pink">IMPORTANT:</strong> For damage claims, an uncut unboxing video must be sent to our WhatsApp within 48 hours.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Product Care Guide */}
      <div className="mt-10 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-spartan font-bold uppercase text-white mb-4">
          HOW TO CARE FOR YOUR WEARABLE ART
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs sm:text-sm font-montserrat text-silver/80">
          <div>
            <strong className="text-pink block mb-1">Motherboard & Tech Pieces:</strong>
            Do not soak in water. Clean with a dry microfiber lens cloth. Treat as architectural jewelry.
          </div>
          <div>
            <strong className="text-pink block mb-1">Spikes & Stainless Chains:</strong>
            Wipe with jewelry cloth after wearing. Store flat in your AVZ dust bag to avoid scratching delicate silks.
          </div>
          <div>
            <strong className="text-pink block mb-1">Deconstructed Denim & Corsets:</strong>
            Spot clean or hand wash in cold water with gentle liquid soap. Never tumble dry or machine spin.
          </div>
        </div>
      </div>

      {/* Legal Status Notice */}
      <div className="mt-8 p-6 rounded-2xl bg-black/60 border border-white/10 flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-lavender flex-shrink-0 mt-0.5" />
        <div className="text-xs font-mono text-silver/70 leading-relaxed">
          <span className="text-white font-bold block mb-1">LEGAL STATUS NOTICE:</span>
          As noted in the client questionnaire, the complete formal Privacy Policy and Terms & Conditions are currently being drafted for final sign-off. These guidelines represent the authentic operational terms of AVZ Vaganza.
        </div>
      </div>
    </section>
  );
}
