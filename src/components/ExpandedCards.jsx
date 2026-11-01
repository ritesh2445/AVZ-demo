import React, { useMemo } from 'react';
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
  },
  {
    imgUrl: "https://cdn.21st.dev/assets/mirror/a6/a61a357faccddd302e85600234a02350a27f21b4cc8b3531578991614c050151.jpg",
    alt: "Mountain landscape editorial campaign",
    title: "North-Eastern Highlands Editorial",
    category: "CAMPAIGN ARCHIVE",
    price: 4000
  },
  {
    imgUrl: "https://cdn.21st.dev/assets/mirror/ec/ec33bb1d53aef764ed557037ded0bf376df17ceb6de92411b60d8edcd68e75b2.jpg",
    alt: "Starry night workshop archive",
    title: "Guwahati Nocturne Studio Series",
    category: "STUDIO ARCHIVE",
    price: 3400
  },
  {
    imgUrl: "https://cdn.21st.dev/assets/mirror/10/109a67c3a7eab23436b0fc0e45a2bdfc722c97cff452c14a2e5944e200c56d98.jpg",
    alt: "Golden sunset catwalk",
    title: "Golden Hour Runway Finale",
    category: "MUSEUM 1-OF-1",
    price: 4800
  }
];

export default function ExpandedCards({ items = [], onSelectProduct, currency = 'INR' }) {
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

      // If less than 7 items, pad with default vault cards for a rich fan presentation
      if (mappedCatalog.length < 10) {
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

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-mono text-[#f472b6] tracking-widest uppercase font-bold block mb-1">
            ✦ INTERACTIVE FAN CAROUSEL
          </span>
          <span className="text-xs font-mono text-zinc-400 tracking-wider">
            HOVER TO INSPECT • ARROWS TO CYCLE
          </span>
        </div>
      </div>

      {/* GSAP 3D Card Fan Carousel Component (Visible in Both Desktop and Mobile View) */}
      <div className="relative w-full max-w-7xl mx-auto flex justify-center items-center py-4 sm:py-6">
        <SocialCards cards={cards} onCardClick={handleCardClick} />
      </div>
    </section>
  );
}
