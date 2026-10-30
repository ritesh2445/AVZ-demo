'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Lock, Sparkles, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';

const LegacyApp = dynamic(() => import('@/src/App'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="w-12 h-12 border-2 border-[#BE185D]/30 border-t-[#F4C2C2] rounded-full animate-spin" />
    </div>
  ),
});

export default function ClientStorefront() {
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [storefrontSettings, setStorefrontSettings] = useState<any>(null);
  const [cmsSections, setCmsSections] = useState<any>(null);
  const [storefrontProducts, setStorefrontProducts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Fetch public storefront configuration
        const res = await fetch('/api/storefront/config');
        if (res.ok) {
          const data = await res.json();
          setStorefrontSettings(data.settings);
        }

        // 2. Fetch published website content (CMS)
        const contentRes = await fetch('/api/storefront/content');
        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setCmsSections(contentData.sections);
        }

        // 3. Fetch live catalog products from database
        const prodRes = await fetch('/api/storefront/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData.products) && prodData.products.length > 0) {
            setStorefrontProducts(prodData.products);
          }
        }

        // 4. Check if admin is currently authenticated for maintenance bypass
        const authRes = await fetch('/api/admin/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error('Error fetching storefront config & content:', err);
      } finally {
        setLoadingConfig(false);
      }
    };
    init();
  }, []);

  if (loadingConfig) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-12 h-12 border-2 border-[#BE185D]/30 border-t-[#F4C2C2] rounded-full animate-spin" />
      </div>
    );
  }

  // 1. Check Maintenance Mode
  const isMaintenance = storefrontSettings?.maintenance_mode?.enabled;

  if (isMaintenance && !isAdmin) {
    const maintenanceTitle = storefrontSettings?.maintenance_mode?.title || 'ATELIER CALIBRATION IN PROGRESS';
    const maintenanceMessage = storefrontSettings?.maintenance_mode?.message ||
      'The AVZ Vaganza dimensional gateway is momentarily undergoing bespoke maintenance and runway archiving. We will re-emerge shortly.';
    const bannerUrl = storefrontSettings?.maintenance_mode?.banner_url || '/assets/editorial_hero_portrait.jpg';

    return (
      <div className="min-h-screen bg-black text-silver flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#301934]/40 via-[#BE185D]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg bg-[#0E0A14]/90 border border-[#301934] rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 backdrop-blur-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#301934] to-black border border-[#BE185D]/50 flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#F4C2C2]" />
          </div>

          <h1 className="text-xl sm:text-2xl font-cinzel font-black tracking-widest text-white uppercase mb-3">
            {maintenanceTitle}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 font-montserrat leading-relaxed mb-8 max-w-md mx-auto">
            {maintenanceMessage}
          </p>

          <div className="rounded-2xl overflow-hidden border border-[#2D2038] mb-8 max-h-56 bg-neutral-900">
            <img
              src={bannerUrl}
              alt="Atelier runway archive"
              className="w-full h-full object-cover opacity-80"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
            <a
              href="https://www.instagram.com/avz.vaganza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F4C2C2] hover:underline flex items-center gap-1.5"
            >
              Follow @avz.vaganza on Instagram →
            </a>
            <span className="text-neutral-600 hidden sm:inline">•</span>
            <a
              href="/admin/login"
              className="text-neutral-400 hover:text-white flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Staff Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Announcement Bar config
  const announcement = storefrontSettings?.announcement;

  return (
    <>
      {/* Admin Bypass Notice (shown when maintenance mode is active but admin is logged in) */}
      {isMaintenance && isAdmin && (
        <div className="bg-amber-950/90 border-b border-amber-600/80 text-amber-200 text-xs py-2 px-4 text-center font-mono sticky top-0 z-[99999] flex items-center justify-center gap-3">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>
            <strong>ADMIN BYPASS ACTIVE:</strong> Public storefront maintenance mode is currently ON for general visitors.
          </span>
          <a
            href="/admin"
            className="underline font-bold text-amber-100 hover:text-white ml-2"
          >
            Open Control Center →
          </a>
        </div>
      )}

      {/* Dynamic Announcement Bar from Admin Storefront Controls */}
      {announcement?.enabled && (
        <div
          style={{
            backgroundColor: announcement.bg_color || '#301934',
            color: announcement.text_color || '#F4C2C2'
          }}
          className="text-[11px] sm:text-xs py-2 px-4 text-center font-mono tracking-wider font-semibold border-b border-white/10 z-[99998] relative flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0 opacity-80" />
          <span>{announcement.text}</span>
          {announcement.link && (
            <a
              href={announcement.link}
              className="underline font-bold hover:opacity-80 ml-1 inline-flex items-center gap-1"
            >
              {announcement.link_text || 'VIEW'}
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Main Storefront */}
      <LegacyApp storefrontConfig={storefrontSettings} cmsContent={cmsSections} products={storefrontProducts} />
    </>
  );
}
