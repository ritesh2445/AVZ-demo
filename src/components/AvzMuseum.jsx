import React, { useState, useMemo } from 'react';
import { Scissors, Sparkles, X, ArrowUpRight, Layers, LayoutGrid, Eye } from 'lucide-react';
import SocialCards, { CardItem } from './ui/card-fan-carousel';
import { MUSEUM_ITEMS, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

// Archival pieces derived from brand heritage
const EXPANDED_MUSEUM_ITEMS = [
  ...MUSEUM_ITEMS,
  {
    id: "mus-005",
    name: "Cyberpunk Circuitry Gauntlet Cuff",
    shortName: "Circuitry Gauntlet",
    aspectRatio: 220 / 415,
    year: "2024",
    tag: "SOLD OUT · CUSTOM ORDER AVAILABLE",
    materials: "Salvaged Telecom PCB Boards, Industrial Rivets, Leather Lining",
    priceTier: "Accessories & Small Pieces (Under ₹1,000)",
    originalOwner: "Permanent Collection (Guwahati)",
    image: ASSET_MANIFEST.products.motherboardCuff || "/assets/prod_motherboard_cuff.jpg",
    story: "Built during an all-night studio session in Guwahati. Features exposed copper pathways and golden solder joints curved comfortably over the wrist.",
    recreationNote: "Handcrafted to fit your custom wrist size."
  },
  {
    id: "mus-006",
    name: "Hand-Riveted Chrome Spike Bodice Top",
    shortName: "Spike Bodice Top",
    aspectRatio: 245 / 435,
    year: "2023",
    tag: "SOLD OUT · CUSTOM ORDER AVAILABLE",
    materials: "Denim Base, 64 Solid Steel Spikes, Satin Ties",
    priceTier: "Core Statement Pieces (₹1,000 – ₹3,000)",
    originalOwner: "Private Collection (Bangalore)",
    image: ASSET_MANIFEST.products.spikeBodice || "/assets/look_spike_bodice.jpg",
    story: "One of Dhrisni's earliest sculptural armor pieces. Designed to make a bold, rebellious statement in everyday spaces.",
    recreationNote: "Each spike is hand-riveted with smooth backings for comfort."
  },
  {
    id: "mus-007",
    name: "Guwahati Heavy Stainless Steel Chainmail",
    shortName: "Guwahati Chainmail",
    aspectRatio: 832 / 1152,
    year: "2024",
    tag: "SOLD OUT · CUSTOM ORDER AVAILABLE",
    materials: "1,200 Hand-Linked Stainless Steel Rings, Carabiners",
    priceTier: "Full Outfits & Heavy Art (₹3,000+)",
    originalOwner: "Editorial Cover Collection",
    image: ASSET_MANIFEST.products.chainmailArmor || "/assets/look_chainmail_armor.jpg",
    story: "Woven ring-by-ring by local women artisans under Dhrisni's direction over 45 intensive hours. Heavy, fluid, and eye-catching in motion.",
    recreationNote: "Takes 2 to 3 weeks of hand assembly."
  },
  {
    id: "mus-008",
    name: "Reconstructed Denim Statement Jacket",
    shortName: "Denim Statement Jacket",
    aspectRatio: 245 / 435,
    year: "2024",
    tag: "SOLD OUT · CUSTOM ORDER AVAILABLE",
    materials: "Upcycled Vintage Denim, Silver Eyelets, Steel Cable Lacing",
    priceTier: "Full Outfits & Heavy Art (₹3,000+)",
    originalOwner: "Private Collection (Mumbai)",
    image: ASSET_MANIFEST.products.reworkedJacket || "/assets/product_reworked_jacket.jpg",
    story: "Made from an oversized vintage trucker jacket. Cut into 18 asymmetric panels and laced with adjustable tension cables.",
    recreationNote: "Denim wash patterns vary uniquely per piece."
  }
];

export default function AvzMuseum({ onRequestCustomCommission, theme = 'dark', cmsMuseum }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('fan'); // 'fan' | 'grid'

  // Map Museum pieces to Card Fan Carousel structure
  const museumCards = useMemo(() => {
    return EXPANDED_MUSEUM_ITEMS.map((item, idx) => ({
      imgUrl: item.image,
      alt: item.name,
      title: item.shortName || item.name,
      category: item.tag || '1-OF-1 PIECE',
      price: item.priceTier || item.commissionTier,
      data: item
    }));
  }, []);

  const handleCardClick = (card, index) => {
    playSound('pip');
    setSelectedItem(card.data || EXPANDED_MUSEUM_ITEMS[index % EXPANDED_MUSEUM_ITEMS.length]);
  };

  const handleOrderClick = (item) => {
    playSound('metal');
    setSelectedItem(null);
    if (onRequestCustomCommission) {
      onRequestCustomCommission(item.name || item.shortName);
    }
  };

  return (
    <section id="museum" className="w-full py-12 sm:py-16 md:py-20 px-3 sm:px-6 lg:px-14 bg-transparent select-none relative overflow-hidden border-t border-white/10">
      {/* Section Header (Consistent on Desktop and Mobile) */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 gap-4 relative z-10 text-left border-b border-white/10 pb-6">
        <div>
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-pink animate-pulse shrink-0" />
            <span>WEARABLE ART GALLERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-medium tracking-[0.16em] text-white uppercase leading-tight text-left">
            MUSEUM <span className="text-zinc-500 font-light">ARCHIVE</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mono tracking-wider text-left mt-2 max-w-xl leading-relaxed">
            One-of-a-kind past designs and runway pieces handcrafted by Dhrisni in our Guwahati studio.
          </p>
        </div>

        {/* View Mode Switcher: Fan Showcase vs Grid Index */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <button
            onClick={() => {
              playSound('snap');
              setViewMode('fan');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'fan'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Fan Carousel</span>
          </button>
          <button
            onClick={() => {
              playSound('snap');
              setViewMode('grid');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-black shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Items Grid</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="relative w-full max-w-7xl mx-auto flex justify-center items-center">
        {viewMode === 'fan' ? (
          /* Card Fan Carousel View (Identical & Optimized for both Desktop & Mobile) */
          <div className="w-full flex flex-col items-center">
            <SocialCards cards={museumCards} onCardClick={handleCardClick} />
            <p className="text-[10px] sm:text-[11px] font-mono text-zinc-500 uppercase tracking-widest text-center mt-3 sm:mt-4">
              TAP OR CLICK ANY ITEM TO VIEW DETAILS & ORDER A CUSTOM PIECE
            </p>
          </div>
        ) : (
          /* Archive Index Grid View (Clean, responsive layout on all screen sizes) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full py-4">
            {EXPANDED_MUSEUM_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  playSound('pip');
                  setSelectedItem(item);
                }}
                className="group p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0d0d12] hover:border-pink/50 transition-all cursor-pointer flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-black mb-3 relative flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-pink tracking-widest uppercase">
                      {item.tag}
                    </div>
                  </div>
                  <h4 className="font-mono text-xs sm:text-sm uppercase font-bold text-white mb-1 line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-400 line-clamp-2">
                    {item.materials}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 group-hover:text-pink transition-colors">
                  <span>PIECE 0{idx + 1}</span>
                  <span className="flex items-center gap-1 font-semibold">VIEW ↗</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          PIECE DETAILS MODAL
          Clear, user-friendly details modal showing the story, craft, and custom order button
          ========================================================================= */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar bg-[#0d0d12] border border-white/20 rounded-3xl shadow-2xl p-5 sm:p-8 relative flex flex-col md:flex-row gap-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Item Image */}
            <div className="md:w-1/2 flex flex-col">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 bg-black relative shadow-inner">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-pink tracking-widest uppercase font-bold">
                  {selectedItem.tag || "1-OF-1 PIECE"}
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center mt-2.5 block">
                HANDMADE IN GUWAHATI · {selectedItem.year || "2024"}
              </span>
            </div>

            {/* Right: Story, Materials & Order Button */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink font-semibold block mb-1">
                  DESIGN DETAILS
                </span>
                <h3 className="text-xl sm:text-2xl font-mono font-bold uppercase text-white mb-2 leading-tight">
                  {selectedItem.name}
                </h3>

                <div className="inline-block px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300 mb-4">
                  {selectedItem.priceTier || selectedItem.commissionTier || "Custom Made-to-Order"}
                </div>

                {/* Story Box */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 relative overflow-hidden mb-4">
                  <div className="absolute top-0 left-0 w-1 h-full bg-pink" />
                  <p className="text-xs sm:text-[13px] font-mono text-zinc-300 italic leading-relaxed pl-2">
                    "{selectedItem.story}"
                  </p>
                </div>

                {/* Materials & Details */}
                <div className="space-y-3 mb-5 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-zinc-500 block uppercase text-[9px] tracking-[0.2em] mb-1 font-semibold">
                      MATERIALS USED
                    </span>
                    <span className="text-white font-medium">
                      {selectedItem.materials}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-1 text-zinc-400">
                    <span className="uppercase text-[9px] tracking-[0.2em]">ORIGINAL PIECE:</span>
                    <span className="text-white text-[11px] font-semibold">{selectedItem.originalOwner || "Archive"}</span>
                  </div>

                  {selectedItem.recreationNote && (
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
                      <span className="text-pink font-semibold uppercase text-[9px] tracking-wider block mb-0.5">CUSTOM ORDER NOTE:</span>
                      {selectedItem.recreationNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Action Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => handleOrderClick(selectedItem)}
                  className="w-full py-3.5 px-5 rounded-full bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs tracking-[0.2em] uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scissors className="w-4 h-4" />
                  <span>ORDER A CUSTOM PIECE ↗</span>
                </button>
                <p className="text-[10px] font-mono text-zinc-500 text-center mt-2 uppercase tracking-wider">
                  Handmade by Dhrisni & our team in Guwahati • 2 to 3 weeks
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
