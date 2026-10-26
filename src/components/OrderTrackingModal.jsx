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
      customer: 'Certified Baddie',
      placementDate: '24 Oct 2026',
      estimatedDelivery: '30 Oct 2026',
      courier: 'Blue Dart Air Express (AWB: BLUEDART-984129)',
      currentStage: 3,
      stages: [
        { title: 'Order Secured', desc: 'Payment verified & craft ticket generated.', done: true },
        { title: 'Raw Hardware Deconstructed', desc: 'Circuits, spikes, and reclaimed textiles gathered.', done: true },
        { title: 'Hand-Built by Guwahati Artisans', desc: 'Women artisans crafting piece under Dhrisni’s supervision.', done: true, current: true },
        { title: 'Quality & Tension Checked', desc: 'Dhrisni personally tests hardware strength and fit.', done: false },
        { title: 'Packed With Chocolates & Freebies', desc: 'Sealed in matte-black AVZ box with handwritten note.', done: false },
        { title: 'Dispatched via Air Courier', desc: 'On its way to your doorstep with tracking SMS.', done: false }
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
        className="w-full max-w-xl bg-gradient-to-b from-[#18031d] via-black to-[#0e0210] border border-[#be185d]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(40,2,40,0.9)] text-left relative"
      >
        <button
          onClick={onClose}
          aria-label="Close tracking"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white hover:text-pink-300 hover:border-[#be185d] cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c041f] border border-[#be185d]/40 text-pink-300 text-[10px] font-mono tracking-widest uppercase mb-2">
            <Package className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>LIVE ATELIER TRACKING // D2C PARCEL CONCIERGE</span>
          </div>

          <h3 className="text-2xl font-black font-spartan uppercase text-white leading-tight">
            TRACK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">GRAIL DISPATCH</span>
          </h3>
          <p className="text-xs text-silver/80 font-montserrat mt-1">
            Enter your AVZ Order ID (e.g. AVZ-781920) or phone number to see live craftsmanship & shipping progress.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="e.g. AVZ-891029 or 7304264901"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-white/5 border border-white/15 focus:border-[#be185d] rounded-2xl px-4 py-3 text-xs font-mono text-white placeholder-silver/40 focus:outline-none"
          />
          <button
            type="submit"
            className="btn-glass-pink py-3 px-5 text-xs font-spartan font-black tracking-widest uppercase cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>TRACK</span>
          </button>
        </form>

        {/* Tracking Timeline Output */}
        {orderStatus && (
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
              <div>
                <span className="text-silver/60 block">ORDER IDENTIFIER</span>
                <span className="text-pink-300 font-bold">{orderStatus.orderId}</span>
              </div>
              <div className="text-right">
                <span className="text-silver/60 block">ESTIMATED ARRIVAL</span>
                <span className="text-white font-bold">{orderStatus.estimatedDelivery}</span>
              </div>
            </div>

            {/* Stages */}
            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/20">
              {orderStatus.stages.map((stage, i) => (
                <div key={i} className="relative text-left">
                  <div className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    stage.done
                      ? 'bg-[#be185d] border-[#be185d] text-white'
                      : stage.current
                      ? 'bg-pink-400 border-white animate-pulse'
                      : 'bg-black border-white/30'
                  }`}>
                    {stage.done && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                  </div>

                  <h5 className={`text-xs font-spartan font-bold uppercase ${stage.done || stage.current ? 'text-white' : 'text-silver/50'}`}>
                    {stage.title}
                  </h5>
                  <p className="text-[11px] font-montserrat text-silver/70">
                    {stage.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-silver/60">{orderStatus.courier}</span>
              <a
                href="https://wa.me/917304264901"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-300 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Atelier Concierge</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
