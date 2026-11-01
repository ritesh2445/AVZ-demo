'use client';

import React, { useMemo, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Flame, Eye, Sparkles } from 'lucide-react';
import SocialCards, { CardItem } from './ui/card-fan-carousel';
import { ASSET_MANIFEST, formatPrice } from '../data/brandData';
import { playSound } from '../utils/audio';

const DEFAULT_VAULT_CARDS = [
  {
    imgUrl: ASSET_MANIFEST?.products?.archiveBralette || "/assets/product_archive_bralette.jpg",
    alt: "The Original Dhristroyer Motherboard Bralette",
    title: "Motherboard Bralette (Prototype 01)",
    category: "ARCHIVE · 1-OF-1",
    price: 3800
  },
  {
    imgUrl: ASSET_MANIFEST?.products?.spikeBodice || "/assets/look_spike_bodice.jpg",
    alt: "Spike Bodice Armour",
    title: "Hand-Riveted Spike Bodice",
    category: "HANDMADE PIECE",
    price: 4500
  },
  {
    imgUrl: ASSET_MANIFEST?.products?.chainmailArmor || "/assets/look_chainmail_armor.jpg",
    alt: "Chainmail Cyber Armour",
    title: "Guwahati Chainmail Armour",
    category: "STATEMENT PIECE",
    price: 5200
  },
  {
    imgUrl: ASSET_MANIFEST?.products?.motherboardCuff || "/assets/prod_motherboard_cuff.jpg",
    alt: "Salvaged Motherboard Cuff",
    title: "Cyberpunk Circuitry Gauntlet",
    category: "UPCYCLED TECH",
    price: 1800
  },
  {
    imgUrl: ASSET_MANIFEST?.products?.reworkedJacket || "/assets/product_reworked_jacket.jpg",
    alt: "Reworked Denim Jacket",
    title: "Syllabic Denim Kinetic Relic",
    category: "REWORKED ARCHIVE",
    price: 3600
  },
  {
    imgUrl: ASSET_MANIFEST?.products?.beadedBralette || "/assets/product_beaded_bralette.jpg",
    alt: "Beaded Wire Bralette",
    title: "Crystalline Cyber Bralette",
    category: "SCULPTED WIRE",
    price: 2900
  },
  {
    imgUrl: ASSET_MANIFEST?.products?.divaTop || "/assets/product_diva_top.jpg",
    alt: "Diva Hardware Corset",
    title: "Hardware Diva Corset",
    category: "RUNWAY ICON",
    price: 3200
  }
];

export default function ExpandedCards({ items = [], onSelectProduct, currency = 'INR' }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mobileTrackRef = useRef(null);

  // Merge incoming catalog items with vault archive specimens
  const cards = useMemo(() => {
    if (items && items.length > 0) {
      const mappedCatalog = items.map((p, idx) => ({
        imgUrl: p.image || p.images?.[0] || DEFAULT_VAULT_CARDS[idx % DEFAULT_VAULT_CARDS.length].imgUrl,
        alt: p.name || `Vault Specimen ${idx + 1}`,
        title: p.name,
        category: p.category ? `${p.category.toUpperCase()} · ARCHIVE` : 'VAULT PIECE',
        price: p.price,
        data: p
      }));

      if (mappedCatalog.length < 7) {
        const remaining = DEFAULT_VAULT_CARDS.slice(mappedCatalog.length);
        return [...mappedCatalog, ...remaining];
      }
      return mappedCatalog;
    }
    return DEFAULT_VAULT_CARDS;
  }, [items]);

  const handleCardClick = (card, index) => {
    playSound('pip');
    if (card.data && onSelectProduct) {
      onSelectProduct(card.data);
    } else if (onSelectProduct && items[index % items.length]) {
      onSelectProduct(items[index % items.length]);
    }
  };

  const goToSlide = (index) => {
    playSound('whoosh');
    const safeIdx = (index + cards.length) % cards.length;
    setCurrentSlide(safeIdx);

    const el = mobileTrackRef.current;
    if (el) {
      const card = el.querySelector('article');
      const cardWidth = card ? card.clientWidth + 16 : 320;
      el.scrollTo({ left: safeIdx * cardWidth, behavior: 'smooth' });
    }
  };

  const nextSlide = (e) => {
    e?.stopPropagation();
    goToSlide(currentSlide + 1);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    goToSlide(currentSlide - 1);
  };

  const handleMobileScroll = () => {
    const el = mobileTrackRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const cardWidth = card ? card.clientWidth + 16 : 320;
    const idx = Math.min(Math.round(el.scrollLeft / cardWidth), cards.length - 1);
    if (idx >= 0 && idx !== currentSlide) {
      setCurrentSlide(idx);
    }
  };

  return (
    <section id="vault" className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-14 bg-transparent select-none relative overflow-hidden">
      {/* Refined Minimalist Editorial Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 relative z-10 text-left border-b border-white/10 pb-6">
        <div>
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span>VAULT ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium tracking-[0.16em] text-white uppercase leading-tight text-left">
            THE VAULT <span className="text-zinc-500 font-light">PIECES</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono tracking-wider text-left mt-2 max-w-md">
            Archival specimens & 1-of-1 wearable art relics handcrafted in our Guwahati studio.
          </p>
        </div>

        {/* Desktop Header Info */}
        <div className="hidden md:block text-right">
          <span className="text-[10px] font-mono text-pink tracking-widest uppercase font-bold block mb-1">
            ✦ INTERACTIVE FAN CAROUSEL
          </span>
          <span className="text-xs font-mono text-zinc-400 tracking-wider">
            HOVER TO INSPECT • ARROWS TO CYCLE
          </span>
        </div>

        {/* Mobile Lookbook-Format Navigation Controls & Counter */}
        <div className="flex md:hidden items-center gap-3 shrink-0 self-start">
          <span className="text-xs font-mono text-zinc-400 tracking-wider">
            [ 0{currentSlide + 1} / 0{cards.length} ]
          </span>

          <button
            onClick={prevSlide}
            aria-label="Previous vault piece"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next vault piece"
            className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all cursor-pointer active:scale-95 shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================
          DESKTOP VIEW: GSAP 3D CARD FAN CAROUSEL
          ======================================================== */}
      <div className="hidden md:flex relative w-full max-w-7xl mx-auto justify-center items-center py-4 sm:py-6">
        <SocialCards cards={cards} onCardClick={handleCardClick} />
      </div>

      {/* ========================================================
          MOBILE VIEW: FLUID HORIZONTAL SWIPEABLE RAIL (LOOKBOOK FORMAT)
          ======================================================== */}
      <div className="block md:hidden w-full px-2">
        {/* Quick Look Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-4 scroll-smooth">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer border whitespace-nowrap ${
                currentSlide === i
                  ? 'bg-pink text-black font-bold border-pink shadow-md'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:border-pink hover:text-white'
              }`}
            >
              PIECE 0{i + 1}
            </button>
          ))}
        </div>

        {/* Fluid Horizontal Track */}
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-1 scroll-smooth touch-scroll-x"
        >
          {cards.map((card, idx) => (
            <article
              key={idx}
              onClick={() => handleCardClick(card, idx)}
              className="snap-center shrink-0 w-[86vw] max-w-[350px] h-[520px] rounded-3xl overflow-hidden relative flex flex-col justify-between p-5 bg-[#0d0212] border border-white/15 shadow-2xl cursor-pointer select-none"
            >
              {/* Image Frame */}
              <img
                src={card.imgUrl}
                alt={card.alt || card.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

              {/* Top Badge Bar */}
              <div className="relative z-10 flex items-center justify-between text-left">
                <span className="px-3.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono tracking-widest uppercase font-bold">
                  {card.category || `VAULT 00${idx + 1}`}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(card, idx);
                  }}
                  aria-label="Inspect Specimen"
                  className="p-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-pink transition-all cursor-pointer shadow-md"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Editorial Content */}
              <div className="relative z-10 flex flex-col text-left">
                <span className="text-[10px] font-mono text-pink font-semibold tracking-widest uppercase mb-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-pink" />
                  <span>VAULT SPECIMEN</span>
                </span>

                <h3 className="text-xl sm:text-2xl font-mono font-bold uppercase text-white leading-tight mb-1.5">
                  {card.title}
                </h3>

                <p className="text-sm font-mono text-zinc-300 mb-3 font-semibold">
                  {typeof card.price === 'number' ? formatPrice(card.price, currency) : card.price}
                </p>

                <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-xs font-mono">
                  <span className="py-1 px-3 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 bg-white/15 border border-white/20 text-white">
                    <Eye className="w-3.5 h-3.5 text-white" />
                    <span>EXPLORE PIECE ↗</span>
                  </span>

                  <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                    0{idx + 1} / 0{cards.length}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
