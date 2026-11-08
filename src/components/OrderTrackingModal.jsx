import React, { useState, useEffect } from 'react';
import { useModalScrollLock } from '../utils/modalScrollLock';
import { X, Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function OrderTrackingModal({ isOpen, onClose, initialOrderNumber = '' }) {
  useModalScrollLock(Boolean(isOpen));
  const [query, setQuery] = useState(initialOrderNumber || '');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchTrack = async (targetOrderNumber) => {
    const clean = (targetOrderNumber || query).trim();
    if (!clean) return;
    playSound('warp');
    setLoading(true);
    setErrorMsg('');
    setOrderStatus(null);

    try {
      const res = await fetch(`/api/storefront/orders/track?number=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'No studio order found matching your identifier.');
        playSound('glitch');
        return;
      }

      const ord = data.order;
      const createdDate = new Date(ord.createdAt);
      const estDelivery = new Date(ord.createdAt + 7 * 86400000);
      const isFulfilled = ord.fulfillmentStatus === 'fulfilled' || ord.fulfillmentStatus === 'delivered';
      const isDelivered = ord.fulfillmentStatus === 'delivered';
      const isCancelled = ord.fulfillmentStatus === 'cancelled' || ord.paymentStatus === 'cancelled';

      setOrderStatus({
        orderId: ord.orderNumber,
        customer: ord.customerMasked,
        placementDate: createdDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        estimatedDelivery: isCancelled ? 'CANCELLED' : estDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        isCancelled,
        courier: isCancelled
          ? 'Cancellation processed — Zero courier liability'
          : ord.trackingNumber
          ? `${ord.carrier} (AWB: ${ord.trackingNumber})`
          : `${ord.carrier} (Dispatches in 24-48 hrs)`,
        paymentMethod: ord.paymentMethod,
        paymentStatus: ord.paymentStatus,
        stages: [
          {
            title: 'Order Confirmed',
            desc: `Craft ticket generated at atelier for ${ord.itemsCount} piece${ord.itemsCount > 1 ? 's' : ''}.`,
            done: true
          },
          {
            title: 'Raw Materials Sourced',
            desc: 'Salvaged telecom motherboards, industrial spikes & textiles allocated.',
            done: true
          },
          {
            title: 'Handmade by Artisans',
            desc: 'Sculpted under Dhrisni’s direct studio supervision in Guwahati, Assam.',
            done: isFulfilled,
            current: !isFulfilled
          },
          {
            title: 'Dispatched via Air Express',
            desc: ord.trackingNumber
              ? `Shipped via ${ord.carrier} — AWB ${ord.trackingNumber}`
              : 'En route to courier partner terminal.',
            done: isDelivered,
            current: isFulfilled && !isDelivered
          }
        ]
      });
      playSound('ping');
    } catch {
      setErrorMsg('Network error checking order craft ticket. Please retry.');
      playSound('glitch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialOrderNumber) {
        setQuery(initialOrderNumber);
        fetchTrack(initialOrderNumber);
      } else {
        setErrorMsg('');
        setOrderStatus(null);
      }
    }
  }, [isOpen, initialOrderNumber]);

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    fetchTrack(query);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99996] bg-black/92 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" data-surface="dark" className="modal-card w-full max-w-lg sm:max-w-xl max-h-[90vh] flex flex-col bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-left relative overflow-hidden"
      >
        {/* Close Button with safe clearance */}
        <button
          onClick={onClose}
          aria-label="Close tracking"
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer z-30 shadow-md active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-10 sm:pr-12 shrink-0">
          <div className="section-badge-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase mb-2 max-w-full shadow-sm">
            <Package className="w-3.5 h-3.5 text-pink shrink-0" />
            <span className="truncate">LIVE ORDER TRACKING • COURIER LOGISTICS</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-mono font-medium uppercase text-white leading-tight">
            TRACK YOUR <span className="text-zinc-400 font-light">ORDER</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-zinc-400 font-montserrat mt-1 leading-relaxed">
            Enter your AVZ Order ID (e.g. AVZ-781920) or phone number for production updates.
          </p>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto pr-1 -mr-1 no-scrollbar space-y-4 flex-1">
          {/* Input Form */}
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. AVZ-891029)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              className="flex-1 bg-black border border-white/15 focus:border-pink/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-50 text-xs font-mono font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              <span>{loading ? 'LOCATING...' : 'TRACK'}</span>
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tracking Timeline Output */}
          {orderStatus && (
            <div className="p-3.5 sm:p-5 rounded-xl bg-black/60 border border-white/10 space-y-3.5 animate-fade-in text-left">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between border-b border-white/10 pb-2.5 gap-2 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[9px] sm:text-[10px]">ORDER IDENTIFIER</span>
                  <span className="text-white font-medium text-xs sm:text-sm">{orderStatus.orderId}</span>
                </div>
                <div className="xs:text-right">
                  <span className="text-zinc-500 block text-[9px] sm:text-[10px]">ESTIMATED ARRIVAL</span>
                  <span className="text-pink font-semibold text-xs sm:text-sm">{orderStatus.estimatedDelivery}</span>
                </div>
              </div>

              {/* Stages List or Cancellation Banner */}
              {orderStatus.isCancelled ? (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono space-y-1">
                  <div className="flex items-center gap-2 font-bold text-white uppercase">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>Order Cancelled</span>
                  </div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    This order was cancelled prior to dispatch. Associated wearable art garments have been returned to studio inventory.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/20">
                  {orderStatus.stages.map((stage, i) => (
                    <div key={i} className="relative text-left">
                      <div
                        className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          stage.done
                            ? 'bg-white border-white text-black'
                            : stage.current
                            ? 'bg-pink border-pink text-black animate-pulse shadow-[0_0_8px_rgba(244,194,194,0.6)]'
                            : 'bg-black border-white/30'
                        }`}
                      >
                        {stage.done && <CheckCircle2 className="w-2.5 h-2.5 text-black" />}
                      </div>

                      <h5
                        className={`text-xs font-mono font-medium uppercase ${
                          stage.done || stage.current ? 'text-white font-bold' : 'text-zinc-500'
                        }`}
                      >
                        {stage.title}
                      </h5>
                      <p className="text-[10px] sm:text-[11px] font-montserrat text-zinc-400 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Courier and Concierge Support */}
              <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between text-xs font-mono">
                <span className="text-[10px] text-zinc-400 break-words">{orderStatus.courier}</span>
                <a
                  href="https://wa.me/917304264901"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink hover:text-white flex items-center gap-1.5 text-[11px] font-semibold transition-colors shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Support ↗</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
