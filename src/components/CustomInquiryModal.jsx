import React from 'react';
import { CheckCircle2, MessageCircle, X } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function CustomInquiryModal({ isOpen, onClose, inquiryData }) {
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
    `Looking forward to forging this wearable art with you!`
  );

  const directWhatsAppUrl = `https://wa.me/917304264901?text=${textMessage}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0d020f]/95 backdrop-blur-2xl border border-[#be185d]/40 rounded-3xl p-6 sm:p-8 relative text-center shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-white/20 bg-black/60 flex items-center justify-center text-silver hover:text-white hover:border-[#be185d] hover:bg-[#be185d]/20 cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <CheckCircle2 className="w-14 h-14 text-[#f472b6] mx-auto mb-4 animate-bounce" />

        <div className="text-xs font-mono tracking-widest text-[#f472b6] uppercase mb-2">
          INQUIRY BRIEF LOGGED // GUWAHATI ATELIER
        </div>

        <h2 className="text-2xl sm:text-3xl font-black font-spartan uppercase text-white mb-3">
          BRIEF READY FOR DHRISTROYER
        </h2>

        <p className="text-xs sm:text-sm text-silver/80 font-montserrat leading-relaxed mb-6">
          Thank you, <strong className="text-white">{inquiryData.name}</strong>. Your custom specifications have been validated. To get immediate real-time priority feedback on fabric choice and hardware scheduling, send this brief directly to Dhrisni on WhatsApp.
        </p>

        {/* Inquiry Brief Summary */}
        <div className="p-4 bg-[#19041b]/70 border border-[#be185d]/25 rounded-2xl text-left text-xs font-mono text-silver mb-6 space-y-1.5 shadow-inner">
          <div><strong className="text-[#f472b6]">Piece:</strong> {inquiryData.category}</div>
          <div><strong className="text-[#f472b6]">Reference:</strong> {inquiryData.referencePiece || 'N/A'}</div>
          <div><strong className="text-[#f472b6]">Budget Tier:</strong> {inquiryData.budgetTier}</div>
          <div><strong className="text-[#f472b6]">Measurements:</strong> {inquiryData.measurements}</div>
        </div>

        {/* WhatsApp Dispatch Button */}
        <a
          href={directWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSound('warp')}
          className="btn-glass-pink w-full py-4 text-xs font-spartan font-black tracking-widest uppercase flex items-center justify-center gap-2 mb-3 cursor-pointer no-underline"
        >
          <MessageCircle className="w-4 h-4" />
          <span>SEND BRIEF TO DHRISNI VIA WHATSAPP ↗</span>
        </a>

        <button
          onClick={onClose}
          className="text-xs font-mono text-silver/60 hover:text-white underline cursor-pointer bg-transparent border-none transition-colors"
        >
          Close & return to website
        </button>
      </div>
    </div>
  );
}
