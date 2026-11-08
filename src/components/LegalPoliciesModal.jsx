'use client';

import React, { useState } from 'react';
import { useModalScrollLock } from '../utils/modalScrollLock';
import { X, ShieldCheck, FileText, RefreshCw, Lock, Scale, AlertCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function LegalPoliciesModal({ isOpen, onClose, initialTab = 'privacy' }) {
  useModalScrollLock(Boolean(isOpen));
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99999] bg-black/92 backdrop-blur-xl flex items-center justify-center overscroll-contain p-3 sm:p-6 animate-fade-in overscroll-contain select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-3xl max-h-[90vh] bg-[#0c0c12] border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-left will-change-transform transform-gpu"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-black/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-pink" />
            <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-white">
              AVZ VAGANZA • LEGAL & COMPLIANCE
            </h2>
          </div>
          <button
            onClick={() => {
              playSound('pip');
              onClose();
            }}
            aria-label="Close"
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-white/10 bg-black/40 overflow-x-auto no-scrollbar shrink-0 px-4 pt-2 gap-2">
          <button
            onClick={() => {
              playSound('snap');
              setActiveTab('privacy');
            }}
            className={`pb-2.5 px-3 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'privacy'
                ? 'border-pink text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Privacy & DPDP Act
          </button>
          <button
            onClick={() => {
              playSound('snap');
              setActiveTab('terms');
            }}
            className={`pb-2.5 px-3 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'terms'
                ? 'border-pink text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => {
              playSound('snap');
              setActiveTab('refund');
            }}
            className={`pb-2.5 px-3 text-xs font-mono tracking-widest uppercase transition-all border-b-2 cursor-pointer shrink-0 ${
              activeTab === 'refund'
                ? 'border-pink text-white font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Refund & Sizing Policy
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-8 overflow-y-auto font-montserrat text-xs sm:text-sm text-silver/85 leading-relaxed space-y-6">
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-pink-950/20 border border-pink/30 flex items-start gap-3">
                <Lock className="w-5 h-5 text-pink shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-1">
                    DPDP ACT 2023 COMPLIANCE NOTICE (INDIA)
                  </h3>
                  <p className="text-zinc-300 text-xs">
                    In strict accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act, India), AVZ Vaganza operates with full transparency, explicit purpose limitation, and strict user consent safeguards.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">1. Data Fiduciary Identity</h4>
                <p>
                  AVZ Vaganza (operating under Aveezah Vaganza Studio, registered in Guwahati, Assam, India; Contact: <span className="text-white font-mono">orders@avzvaganza.com</span>) acts as the Data Fiduciary for all personal information collected via our website, direct WhatsApp concierge, and order fulfillment channels.
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">2. Categories of Personal Data Collected</h4>
                <p>We process only the minimum personal data strictly necessary to fulfill luxury bespoke fashion purchases:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-300">
                  <li><strong>Contact Details:</strong> Full name, telephone/WhatsApp mobile number, and email address.</li>
                  <li><strong>Delivery Information:</strong> Physical shipping address, pincode, city, and state for courier dispatch.</li>
                  <li><strong>Bespoke Sizing Data:</strong> Optional custom measurements (bust, waist, torso height) submitted specifically for tailored commissions.</li>
                  <li><strong>Transactional Metadata:</strong> Razorpay payment order references and payment status (we never receive, store, or process raw credit card numbers or banking passwords).</li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">3. Purpose Limitation & Processing Grounds</h4>
                <p>
                  Your data is collected strictly on the lawful ground of your explicit consent and legitimate fulfillment needs:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-300">
                  <li>Processing and courier dispatch of wearable art orders across India and globally.</li>
                  <li>Generating GST-compliant invoices and providing tracking updates.</li>
                  <li>Customer support communications regarding custom commissions.</li>
                  <li><strong>Zero Data Brokerage:</strong> We never sell, lease, monetize, or trade client data to third-party advertising brokers.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">4. Your Rights under the DPDP Act</h4>
                <p>As a Data Principal under Indian law, you hold the following statutory rights:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-300">
                  <li><strong>Right to Access:</strong> Request a comprehensive summary of personal data held about you.</li>
                  <li><strong>Right to Correction & Erasure:</strong> Request immediate correction of outdated information or total deletion of personal records.</li>
                  <li><strong>Right to Withdraw Consent:</strong> Revoke consent for communications at any time.</li>
                  <li><strong>Right to Grievance Redressal:</strong> Direct escalation to our designated Grievance Officer.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">5. Order History Retention & Real-Time Account Access</h4>
                <p className="text-zinc-300">
                  In compliance with statutory commercial record-keeping and data minimization standards, registered patrons can review, track, and download transaction receipts for their complete purchase history for up to <strong>six (6) months</strong> directly through their VIP Client Account portal. Transaction records older than six months are permanently transitioned to offline accounting archives. Patrons may also submit automated order cancellation requests directly from their dashboard prior to courier dispatch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                <h4 className="font-mono font-bold text-white uppercase text-xs mb-1">6. Grievance Officer Contact Details</h4>
                <p className="text-xs text-zinc-400">
                  Designated Data Grievance Redressal Officer:<br />
                  <strong className="text-white">AVZ Compliance Desk</strong> • Aveezah Vaganza Studio, Guwahati, Assam, India<br />
                  Email: <span className="text-pink font-mono">orders@avzvaganza.com</span> / <span className="text-pink font-mono">+91 73042 64901</span><br />
                  Resolution SLA: Grievances are acknowledged within 24 hours and addressed within 15 business days.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">1. Studio Overview & Intellectual Property</h4>
                <p>
                  AVZ Vaganza ("Aveezah Vaganza") is an independent haute couture and sculptural wearable art studio founded by Dhrisni (@Dhristroyer) based in Guwahati, Assam, India. All original garment designs, hardware configurations, runway visual recordings, brand names, and artistic media presented on this site are the exclusive intellectual property of AVZ Vaganza. Any unauthorized replication, commercial reproduction, or counterfeit manufacturing is strictly prohibited and subject to legal enforcement.
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">2. Handcrafted & Archival 1-of-1 Nature</h4>
                <p>
                  Every AVZ creation is individually handcrafted using reclaimed textiles, cold-forged metals, solid spikes, and artisanal chainmail. Because of the bespoke nature of wearable art:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-300">
                  <li>Subtle natural variances in circuit tracing, patina, and hardware placement are hallmarks of authentic handmade craftsmanship.</li>
                  <li>1-of-1 pieces are uniquely serialized and never reproduced as identical mass-factory copies.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">3. Orders, Pricing & Payment Gateways</h4>
                <p>
                  Prices are displayed in Indian Rupees (INR) with estimated multi-currency conversion options for international patrons. Online transactions are securely processed through RBI-authorized payment gateways (Razorpay) utilizing 256-bit SSL encryption. An order confirmation is issued immediately upon receipt of cleared payment.
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">4. Bespoke Production & Delivery Timelines</h4>
                <p>
                  Ready-to-wear drops dispatch within 2–4 business days. Made-to-measure and custom commissions require a dedicated 2 to 3-week studio creation window from the date measurement confirmations are finalized.
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">5. Governing Law & Jurisdiction</h4>
                <p>
                  These terms are governed by the laws of India. Any legal disputes or claims arising out of the use of this website or orders placed with the studio are subject to the exclusive jurisdiction of the competent courts in Guwahati, Assam, India.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-1">
                    BESPOKE WEARABLE ART RETURN & REFUND POLICY
                  </h3>
                  <p className="text-zinc-300 text-xs">
                    Please read carefully prior to ordering. Each creation is handcrafted with extreme care. Due to the sculptural, un-repeated nature of our couture, specific conditions apply.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">
                  1. Transit Damage Verification — Mandatory 360° Unboxing Video
                </h4>
                <p>
                  We inspect and photograph every creation prior to courier dispatch. In the rare event that your package sustains visible transit damage:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-300">
                  <li>A <strong>continuous, uncut 360-degree unboxing video</strong> showing the outer courier seal, shipping label, and unsealing of the package must be recorded.</li>
                  <li>This video must be shared via WhatsApp (+91 73042 64901) or email (<span className="text-white font-mono">orders@avzvaganza.com</span>) within <strong>48 hours of confirmed delivery</strong>.</li>
                  <li>Claims submitted without a continuous uncut unboxing video cannot be validated for courier transit insurance.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">2. Sizing Exchanges (Standard Collection Items)</h4>
                <p>
                  If a standard-sized bralette or garment does not fit as desired, we offer a <strong>complimentary 1-time size exchange</strong> within <strong>7 days of delivery</strong>:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-300">
                  <li>Item must be unworn, unwashed, unaltered, and returned with the original AVZ authenticity tag attached and custom packaging intact.</li>
                  <li>Our studio concierge will guide you through reverse pickup or studio drop-off.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">3. Custom 1-of-1 Commissions & Made-to-Order Pieces</h4>
                <p>
                  Custom commissions sculpted specifically to client measurements and bespoke specifications are <strong>strictly non-refundable</strong> once design sign-off and studio production commence. We provide interactive WhatsApp sizing consultations prior to construction to ensure an impeccable fit.
                </p>
              </div>

              <div>
                <h4 className="font-mono font-bold text-white uppercase text-sm mb-2">4. Refund Processing Window</h4>
                <p>
                  Where an approved return or transit defect refund is authorized, the credit is returned to your original payment method (via Razorpay or direct UPI) within <strong>5 to 7 banking days</strong> of studio receipt and inspection.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs font-mono text-zinc-400 shrink-0">
          <span>LAST REVISED: 2026 • GUWAHATI, ASSAM</span>
          <button
            onClick={() => {
              playSound('snap');
              onClose();
            }}
            className="px-5 py-2 rounded-full bg-white text-black font-bold uppercase tracking-wider hover:bg-zinc-200 cursor-pointer"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
}

