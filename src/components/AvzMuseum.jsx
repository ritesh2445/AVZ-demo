import React, { useState } from 'react';
import { Shield, Sparkles, ArrowRight, Eye, X, RefreshCw, Layers } from 'lucide-react';
import { MUSEUM_ITEMS } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function AvzMuseum({ onRequestCustomCommission }) {
  const [selectedArchivePiece, setSelectedArchivePiece] = useState(null);

  const openArchiveItem = (item) => {
    playSound('metal');
    setSelectedArchivePiece(item);
  };

  const closeArchiveItem = () => {
    playSound('pip');
    setSelectedArchivePiece(null);
  };

  return (
    <section id="museum" className="w-full py-28 px-6 sm:px-12 lg:px-20 bg-pitch-black select-none border-t border-white/5 text-left">
      {/* Museum Official Header */}
      <div className="mb-14 pb-8 border-b border-white/10 text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1c041f]/90 border border-[#be185d]/40 backdrop-blur-md mb-3 text-pink-300 text-[11px] font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(190,24,93,0.2)]">
          <Shield className="w-3.5 h-3.5 text-[#f472b6]" />
          <span>VAULT ARCHIVE // PREVIOUS COMMISSIONS & ARTIFACTS</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black font-spartan uppercase tracking-tight text-white mb-8 leading-none text-left">
          AVZ <span className="chrome-text">MUSEUM</span>
        </h2>

        {/* Client's exact introductory quote in high-fashion glass panel */}
        <div className="p-8 md:p-10 rounded-3xl bg-[#1a0520]/75 backdrop-blur-xl border border-[#be185d]/40 border-l-4 border-l-[#be185d] relative overflow-hidden shadow-[0_15px_40px_rgba(45,5,45,0.6)] text-left">
          <p className="text-xl md:text-2xl font-display text-white font-medium mb-3 italic text-left">
            "Welcome to the vault. A live archive of past custom orders and sold-out pieces."
          </p>
          <p className="text-silver/85 text-sm md:text-base leading-relaxed font-montserrat max-w-4xl text-left">
            These sold-out items can be custom-made for you again, but fair warning: because everything is hand-built with upcycled hardware and unique elements, no piece is ever an exact replica.
            <br />
            <span className="text-pink-300 font-semibold mt-2 inline-block">
              Explore the archive, pick your poison, and let's make something custom.
            </span>
          </p>
        </div>
      </div>

      {/* Museum Archive Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        {MUSEUM_ITEMS.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => openArchiveItem(item)}
              className="group relative bg-[#0d020f]/85 border border-[#be185d]/25 hover:border-[#f472b6]/70 rounded-3xl transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-[0_20px_50px_rgba(50,5,45,0.7)] transform-gpu text-left"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/80">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-pink-300 text-[10px] font-mono tracking-widest uppercase">
                    {item.tag}
                  </span>
                  <span className="px-3.5 py-1 rounded-full bg-[#240528]/90 border border-[#be185d]/40 text-pink-200 text-[10px] font-mono shadow-sm">
                    PROVENANCE: {item.year}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 p-3 rounded-full bg-gradient-to-r from-[#9D174D] to-[#BE185D] text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(190,24,93,0.6)]">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Text Description */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-[#130315]/90 border-t border-white/5 text-left">
                <div>
                  <h3 className="text-2xl font-spartan font-black uppercase text-white group-hover:text-pink-300 transition-colors mb-2 text-left">
                    {item.name}
                  </h3>
                  <div className="text-xs font-mono text-silver/60 mb-3 text-left">
                    MATERIALS: <span className="text-silver/90">{item.materials}</span>
                  </div>
                  <p className="text-silver/80 text-xs md:text-sm font-montserrat leading-relaxed line-clamp-3 mb-4 text-left">
                    {item.story}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-pink-300 font-semibold">
                    {item.commissionTier}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSound('metal');
                      onRequestCustomCommission(item.name);
                    }}
                    className="btn-glass-pink text-[11px] py-2 px-4 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>REQUEST CUSTOM</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Individual Museum Item Detail Modal */}
      {selectedArchivePiece && (
        <div
          onClick={closeArchiveItem}
          className="fixed inset-0 z-[99996] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 md:p-10 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#0d020f]/95 border border-[#be185d]/45 rounded-3xl p-6 md:p-10 relative flex flex-col md:flex-row gap-8 max-h-[88vh] overflow-y-auto shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-left"
          >
            <button
              onClick={closeArchiveItem}
              className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/20 bg-black/70 flex items-center justify-center text-silver hover:text-white hover:border-[#be185d] hover:bg-[#be185d]/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="w-full md:w-1/2 flex items-center justify-center rounded-2xl overflow-hidden border border-[#be185d]/20 bg-black">
              <img
                src={selectedArchivePiece.image}
                alt={selectedArchivePiece.name}
                className="w-full h-auto max-h-[60vh] object-contain rounded-2xl"
              />
            </div>

            {/* Info */}
            <div className="w-full md:w-1/2 flex flex-col justify-between text-left">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#9D174D] to-[#BE185D] text-white text-[10px] font-mono tracking-widest uppercase inline-block mb-3 font-bold border border-[#f472b6]/40 shadow-[0_0_12px_rgba(190,24,93,0.4)]">
                  {selectedArchivePiece.tag}
                </span>
                <h2 className="text-2xl md:text-3xl font-spartan font-black uppercase text-white mb-2 text-left">
                  {selectedArchivePiece.name}
                </h2>
                <div className="text-xs font-mono text-silver/70 mb-4 text-left">
                  ORIGIN: {selectedArchivePiece.year} // {selectedArchivePiece.originalOwner}
                </div>

                <div className="p-3.5 rounded-xl bg-[#19041b]/70 border border-[#be185d]/25 text-xs font-mono text-silver mb-4 text-left shadow-inner">
                  <span className="text-[#f472b6] font-bold block mb-1">MATERIALS:</span>
                  {selectedArchivePiece.materials}
                </div>

                <p className="text-silver/90 text-sm font-montserrat leading-relaxed mb-4 text-left">
                  {selectedArchivePiece.story}
                </p>

                <div className="p-3.5 rounded-xl bg-[#200522]/80 border-l-2 border-l-[#be185d] border border-[#be185d]/25 text-xs font-montserrat text-pink-200 mb-6 text-left">
                  <strong className="text-[#f472b6]">Recreation Note:</strong> {selectedArchivePiece.recreationNote}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    playSound('warp');
                    closeArchiveItem();
                    onRequestCustomCommission(selectedArchivePiece.name);
                  }}
                  className="w-full btn-glass-pink flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>COMMISSION AN ITERATION OF THIS PIECE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

