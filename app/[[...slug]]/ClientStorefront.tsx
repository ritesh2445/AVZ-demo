'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the existing App with SSR disabled so Three.js, Web Audio,
// and browser-only APIs execute cleanly in the client environment without hydration mismatch.
const LegacyApp = dynamic(() => import('@/src/App'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="w-12 h-12 border-2 border-[#BE185D]/30 border-t-[#F4C2C2] rounded-full animate-spin" />
    </div>
  ),
});

export default function ClientStorefront() {
  return <LegacyApp />;
}
