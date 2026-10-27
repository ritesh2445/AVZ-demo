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
      <div className="max-w-3xl mx-auto text-center mb-14 pb-8 border-b border-[#be185d]/20 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 mb-4 text-pink-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(190,24,93,0.2)]">
          <HelpCircle className="w-3.5 h-3.5 text-[#f472b6]" />
          <span>AUTHENTIC CLIENT Q&A // SOURCE OF TRUTH</span>
        </div>
        <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase text-white leading-none text-center">
          FREQUENTLY ASKED <span className="chrome-text">QUESTIONS</span>
        </h2>
        <p className="text-silver/85 text-sm max-w-xl font-montserrat mt-4 text-center leading-relaxed">
          Everything you need to know about AVZ Vaganza, Dhrisni (Dhristroyer), custom orders, and our upcycled atelier.
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
    <section id="contact" className="w-full py-16 sm:py-28 px-4 sm:px-12 lg:px-20 bg-pitch-black select-none border-t border-white/5 text-left">
      <div className="mb-14 pb-8 border-b border-white/10 text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 backdrop-blur-md mb-3 text-pink-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(190,24,93,0.2)]">
          <Mail className="w-3.5 h-3.5 text-[#f472b6]" />
          <span>GET IN TOUCH // GUWAHATI ATELIER</span>
        </div>
        <h2 className="text-3xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase text-white leading-none text-left">
          CONTACT & <span className="chrome-text">COMMISSIONS</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
        {/* Contact Info Card */}
        <div className="p-8 md:p-10 rounded-3xl bg-[#0d020f]/80 backdrop-blur-2xl border border-white/10 flex flex-col gap-8 text-left">
          <div>
            <span className="text-[11px] font-mono uppercase text-silver/60 block mb-2 tracking-widest">REGISTERED ATELIER ADDRESS</span>
            <div className="flex items-start gap-3 text-white font-montserrat text-sm sm:text-base text-left">
              <MapPin className="w-5 h-5 text-[#f472b6] mt-0.5 flex-shrink-0" />
              <span>{BRAND_INFO.registeredAddress}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-silver/60 block mb-2 tracking-widest">ELECTRONIC MAIL</span>
            <div className="flex flex-col gap-2 text-sm font-mono text-left">
              <a href={`mailto:${BRAND_INFO.businessEmail}`} className="text-pink-300 hover:text-white hover:underline transition-colors">
                Business: {BRAND_INFO.businessEmail}
              </a>
              <a href={`mailto:${BRAND_INFO.founderEmail}`} className="text-lavender hover:text-white hover:underline transition-colors">
                Founder: {BRAND_INFO.founderEmail}
              </a>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-silver/60 block mb-3 tracking-widest">WHATSAPP CONCIERGE</span>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={BRAND_INFO.whatsappLinkPrimary}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('laser')}
                className="btn-glass-pink flex-1 flex items-center justify-between text-xs py-3.5 px-5"
              >
                <span>Primary: {BRAND_INFO.whatsappPrimary}</span>
                <span className="font-bold">Chat ↗</span>
              </a>
              <a
                href={BRAND_INFO.whatsappLinkSecondary}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('laser')}
                className="btn-glass flex-1 flex items-center justify-between text-xs py-3.5 px-5 hover:border-[#be185d] hover:text-white"
              >
                <span>Secondary: {BRAND_INFO.whatsappSecondary}</span>
                <span className="text-pink-300 font-bold">Chat ↗</span>
              </a>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase text-silver/60 block mb-2 tracking-widest">OFFICIAL INSTAGRAM</span>
            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('snap')}
              className="inline-flex items-center gap-2 text-sm font-mono text-pink-300 hover:text-white hover:underline transition-colors"
            >
              <Instagram className="w-4 h-4 text-[#f472b6]" />
              <span>{BRAND_INFO.instagram}</span>
            </a>
          </div>
        </div>

        {/* Studio Hours & Note */}
        <div className="p-8 md:p-10 rounded-3xl bg-[#1a0520]/75 backdrop-blur-2xl border border-[#be185d]/30 flex flex-col justify-between text-left shadow-[0_15px_40px_rgba(30,3,32,0.6)]">
          <div>
            <h3 className="text-2xl font-spartan font-bold uppercase text-white mb-4 text-left">
              THE WEARABLE ART ATELIER
            </h3>
            <p className="text-sm text-silver/85 font-montserrat leading-relaxed mb-6 text-left">
              We respond to custom inquiries, fitting questions, and styling requests Monday through Saturday. Because every creation is custom built, messages are reviewed directly by Dhrisni or her design team.
            </p>
            <div className="p-6 rounded-2xl bg-black/60 border-l-4 border-l-[#be185d] text-sm font-mono text-silver leading-relaxed text-left">
              "We aren't a high-volume call center. You are talking to real artists who cut the fabric and weld the wire."
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs font-mono text-silver/60 text-left">
            <Sparkles className="w-4 h-4 text-[#f472b6]" />
            <span>DOMAIN: {BRAND_INFO.domain}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShippingPackagingReturns() {
  return (
    <section id="specs" className="w-full py-16 sm:py-28 px-4 sm:px-12 lg:px-20 bg-pitch-black select-none border-t border-white/5">
      <div className="mb-10 sm:mb-14 pb-6 sm:pb-8 border-b border-white/10">
        <h2 className="text-2xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase text-white mb-4 leading-none">
          SHIPPING, PACKAGING & <span className="chrome-text">RETURNS</span>
        </h2>
        <p className="text-sm text-silver/70 font-montserrat max-w-xl">
          Direct operational policies from the official AVZ client questionnaire.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between">
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
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between">
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
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between">
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
