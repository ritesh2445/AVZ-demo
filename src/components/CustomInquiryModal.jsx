import React, { useEffect } from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function CustomInquiryModal({ isOpen, onClose, inquiryData }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !inquiryData) return null;

  // Format WhatsApp message
  const textMessage = encodeURIComponent(
    `Hello Dhrisni (@Dhristroyer)! I just submitted a custom commission brief on the AVZ Vaganza website.\n\n` +
    `• Name: ${inquiryData.name}\n` +
    `• Contact: ${inquiryData.contact}\n` +
    `• Requested Piece: ${inquiryData.category}\n` +
    `• Reference Item: ${inquiryData.referencePiece || 'Custom concept'}\n` +
    `• Measurements: ${inquiryData.measurements}\n` +
    `• Target Price Tier: ${inquiryData.budgetTier}\n` +
    `• Design Notes: ${inquiryData.designNotes}\n\n` +
    `Looking forward to discussing this wearable art piece with you.`
  );

  const directWhatsAppUrl = `https://wa.me/917304264901?text=${textMessage}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" data-surface="dark" className="modal-card w-full max-w-lg bg-[#0c0c10] border border-white/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative text-center shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
      >
        {/* Close Button with safe clearance */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 flex items-center justify-center text-zinc-400 hover:text-white hover:rotate-90 cursor-pointer transition-all z-30 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>

        <div className="px-6 text-[10px] font-mono tracking-widest text-zinc-400 uppercase mb-2">
          CUSTOM ORDER LOGGED • GUWAHATI STUDIO
        </div>

        <h2 className="px-4 text-xl sm:text-2xl font-mono font-medium uppercase text-white mb-2 leading-tight">
          CUSTOM REQUEST READY
        </h2>

        <p className="text-xs sm:text-sm text-zinc-400 font-montserrat leading-relaxed mb-6">
          Thank you, <strong className="text-white">{inquiryData.name}</strong>. Your custom specifications have been validated. For real-time consultation on hardware allocation and scheduling, forward this request directly to Dhrisni.
        </p>

        {/* Inquiry Brief Summary */}
        <div className="p-4 bg-black/60 border border-white/10 rounded-xl text-left text-xs font-mono text-zinc-300 mb-6 space-y-1.5">
          <div><strong className="text-white">Category:</strong> {inquiryData.category}</div>
          <div><strong className="text-white">Reference:</strong> {inquiryData.referencePiece || 'Custom Concept'}</div>
          <div><strong className="text-white">Price Tier:</strong> {inquiryData.budgetTier}</div>
          <div><strong className="text-white">Measurements:</strong> {inquiryData.measurements}</div>
        </div>

        {/* WhatsApp Dispatch Button */}
        <a
          href={directWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSound('warp')}
          className="w-full py-3.5 px-6 rounded-full bg-white text-black hover:bg-zinc-200 text-xs font-mono font-semibold tracking-widest uppercase flex items-center justify-center gap-2 mb-3 cursor-pointer no-underline transition-all active:scale-[0.99]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>CHAT ON WHATSAPP WITH OUR TEAM ↗</span>
        </a>

        <button
          onClick={onClose}
          className="text-xs font-mono text-zinc-500 hover:text-white cursor-pointer bg-transparent border-none transition-colors"
        >
          Close & return to shop
        </button>
      </div>
    </div>
  );
}
