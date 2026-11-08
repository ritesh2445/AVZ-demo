'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('AVZ Global Error Boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#09090b] border border-white/15 text-center space-y-4 shadow-[0_0_50px_rgba(244,114,182,0.15)]">
          <div className="w-12 h-12 rounded-full bg-pink/10 border border-pink/30 text-pink flex items-center justify-center mx-auto text-lg font-bold">
            AVZ
          </div>
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
            Connection Restored
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            A temporary display sync occurred. Your bag and session data remain safe.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-full bg-pink text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-pink-600 transition-all cursor-pointer shadow-md"
            >
              Reload Page
            </button>
            <a
              href="/"
              className="px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
