import React, { useState } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function OrderTrackingModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    playSound('warp');

    // Simulate realistic D2C order timeline
    setOrderStatus({
      orderId: query.startsWith('AVZ-') ? query.toUpperCase() : `AVZ-${query}`,
      customer: 'Private Client',
      placementDate: '24 Oct 2026',
      estimatedDelivery: '30 Oct 2026',
      courier: 'Blue Dart Air Express (AWB: BLUEDART-984129)',
      currentStage: 3,
      stages: [
        { title: 'Order Confirmed', desc: 'Craft ticket generated at studio.', done: true },
        { title: 'Raw Materials Sourced', desc: 'Circuits, hardware, and reclaimed textiles allocated.', done: true },
        { title: 'Handmade by Artisans', desc: 'Under Dhrisni’s direct studio supervision in Guwahati.', done: true, current: true },
        { title: 'Tension & Fit Calibration', desc: 'Structural strength and hardware fit verified.', done: false },
        { title: 'Packaging & Authenticity Certificate', desc: 'Sealed in matte-black box with authentication card.', done: false },
        { title: 'Dispatched via Air Courier', desc: 'In transit with real-time SMS delivery tracking.', done: false }
      ]
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99996] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-left relative"
      >
        {/* Close Button with safe clearance */}
        <button
          onClick={onClose}
          aria-label="Close tracking"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer z-30 shadow-md active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6 pr-10 sm:pr-12">
          <div className="section-badge-pill inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/15 text-zinc-400 text-[10px] font-mono tracking-widest uppercase mb-2 max-w-full shadow-sm">
            <Package className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">LIVE ORDER TRACKING • COURIER LOGISTICS</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-mono font-medium uppercase text-white leading-tight">
            TRACK YOUR <span className="text-zinc-400 font-light">ORDER</span>
          </h3>
          <p className="text-xs text-zinc-400 font-montserrat mt-1">
            Enter your AVZ Order Identifier (e.g. AVZ-781920) or phone number for production and courier updates.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="e.g. AVZ-891029 or 7304264901"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-black border border-white/15 focus:border-white/40 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-mono font-semibold tracking-wider uppercase cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>TRACK</span>
          </button>
        </form>

        {/* Tracking Timeline Output */}
        {orderStatus && (
          <div className="p-5 rounded-xl bg-black/60 border border-white/10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px]">ORDER IDENTIFIER</span>
                <span className="text-white font-medium">{orderStatus.orderId}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block text-[10px]">ESTIMATED ARRIVAL</span>
                <span className="text-white font-medium">{orderStatus.estimatedDelivery}</span>
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/20">
              {orderStatus.stages.map((stage, i) => (
                <div key={i} className="relative text-left">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    stage.done
                      ? 'bg-white border-white text-black'
                      : stage.current
                      ? 'bg-zinc-400 border-white animate-pulse'
                      : 'bg-black border-white/30'
                  }`}>
                    {stage.done && <CheckCircle2 className="w-2.5 h-2.5 text-black" />}
                  </div>

                  <h5 className={`text-xs font-mono font-medium uppercase ${stage.done || stage.current ? 'text-white' : 'text-zinc-500'}`}>
                    {stage.title}
                  </h5>
                  <p className="text-[11px] font-montserrat text-zinc-400">
                    {stage.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-500">{orderStatus.courier}</span>
              <a
                href="https://wa.me/917304264901"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Studio Support Line</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
