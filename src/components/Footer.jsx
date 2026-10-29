import React from 'react';
import { Instagram, Mail, Phone, MapPin, Sparkles, ArrowUp } from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function Footer({ onScrollToSection }) {
  const scrollToTop = () => {
    playSound('pip');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (id) => {
    playSound('pip');
    onScrollToSection(id);
  };

  return (
    <footer className="w-full bg-black border-t border-white/10 pt-12 sm:pt-20 pb-10 sm:pb-14 select-none text-silver">
      <div className="w-full px-4 sm:px-12 lg:px-20">
        {/* Top Brand & Manifesto */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pb-12 sm:pb-16 border-b border-white/10">
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <div
              onClick={() => handleNav('hero')}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
              <img
                src={ASSET_MANIFEST.logo}
                alt="AVZ Emblem"
                className="w-10 h-10 object-contain group-hover:rotate-12 transition-transform"
              />
              <span className="font-mono font-medium text-lg text-white tracking-[0.2em] uppercase group-hover:text-pink transition-colors">
                AVZ VAGANZA
              </span>
            </div>

            <p className="text-zinc-400 font-mono text-xs tracking-wider uppercase text-left">
              "{BRAND_INFO.tagline}"
            </p>

            <p className="text-sm text-silver/75 font-montserrat leading-relaxed max-w-md text-left">
              An experimental, psychedelic, three-dimensional fashion universe. Handcrafted wearable art by Dhrisni (Dhristroyer) utilizing reclaimed motherboards, computer hardware, spikes, and upcycled denim.
            </p>

            <div className="text-xs font-mono text-silver/50 text-left">
              Registered Studio: {BRAND_INFO.registeredAddress}
            </div>
          </div>

          {/* Navigation Links Columns - Side by side on mobile */}
          <div className="md:col-span-2 flex flex-col gap-2 sm:gap-3 text-left">
            <span className="text-xs font-mono uppercase text-[#f472b6] font-bold tracking-widest mb-2">EXPLORE</span>
            <button onClick={() => handleNav('shop')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Shop Catalogue
            </button>
            <button onClick={() => handleNav('vault')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Vault Piece Rail
            </button>
            <button onClick={() => handleNav('lookbook')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Spatial Lookbook
            </button>
            <button onClick={() => handleNav('museum')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              AVZ Museum & Vault
            </button>
            <button onClick={() => handleNav('custom')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Custom Orders
            </button>
            <button onClick={() => handleNav('about')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              About & Dhristroyer
            </button>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 text-left">
            <span className="text-xs font-mono uppercase text-[#f472b6] font-bold tracking-widest mb-2">OPERATIONS</span>
            <button onClick={() => handleNav('specs')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Shipping & Delivery
            </button>
            <button onClick={() => handleNav('specs')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Unboxing Packaging
            </button>
            <button onClick={() => handleNav('specs')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Returns & Exchanges
            </button>
            <button onClick={() => handleNav('faq')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Official FAQs
            </button>
            <button onClick={() => handleNav('contact')} className="text-left text-xs font-montserrat hover:text-pink-300 transition-colors bg-transparent border-none p-0 cursor-pointer text-silver">
              Contact & Concierge
            </button>
          </div>

          {/* Social & WhatsApp */}
          <div className="md:col-span-3 flex flex-col gap-3.5 text-left">
            <span className="text-xs font-mono uppercase text-[#f472b6] font-bold tracking-widest mb-1">CONNECT</span>
            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('snap')}
              className="flex items-center gap-2 text-xs font-mono text-silver hover:text-pink-300 transition-colors text-left"
            >
              <Instagram className="w-4 h-4 text-[#f472b6]" />
              <span>Instagram: {BRAND_INFO.instagram}</span>
            </a>
            <a
              href={BRAND_INFO.whatsappLinkPrimary}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound('laser')}
              className="flex items-center gap-2 text-xs font-mono text-silver hover:text-pink-300 transition-colors text-left"
            >
              <Phone className="w-4 h-4 text-[#f472b6]" />
              <span>WhatsApp: {BRAND_INFO.whatsappPrimary}</span>
            </a>
            <a
              href={`mailto:${BRAND_INFO.businessEmail}`}
              className="flex items-center gap-2 text-xs font-mono text-silver hover:text-pink-300 transition-colors text-left"
            >
              <Mail className="w-4 h-4 text-[#f472b6]" />
              <span>{BRAND_INFO.businessEmail}</span>
            </a>

            <button
              onClick={scrollToTop}
              className="btn-glass mt-4 text-[11px] font-mono tracking-widest py-2.5 px-5 w-fit hover:border-white/30 hover:text-white"
            >
              <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar & SEO Footnote */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-silver/50 gap-4">
          <div>
            © {new Date().getFullYear()} AVZ VAGANZA. ALL RIGHTS RESERVED. HAUTE COUTURE ARCHIVE.
          </div>
          <div className="flex items-center gap-3">
            <span>DOMAIN: {BRAND_INFO.domain}</span>
            <span>·</span>
            <span>POWERED BY DHRISTROYER</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
