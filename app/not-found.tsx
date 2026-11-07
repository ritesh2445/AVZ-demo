import Link from 'next/link';
import { ArrowLeft, Compass, Package, Scissors } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden font-sans">
      {/* Subtle atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
        <span className="font-mono text-xs uppercase tracking-[0.35em] text-red-500/90 mb-4 px-3 py-1 rounded border border-red-500/20 bg-red-950/30">
          ARCHIVE ERROR 404
        </span>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-100 mb-3">
          EXHIBIT NOT FOUND
        </h1>

        <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-8 max-w-md font-light">
          The requested archive corridor, garment, or bespoke dossier does not exist or has been relocated to cold storage.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-neutral-200 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Atelier
          </Link>

          <Link
            href="/custom"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-900 border border-neutral-800 text-neutral-200 font-semibold text-xs uppercase tracking-widest rounded hover:border-neutral-700 hover:text-white transition-all duration-200"
          >
            <Scissors className="w-4 h-4 text-red-400" />
            Custom Orders
          </Link>
        </div>

        {/* Quick Corridor Navigation */}
        <div className="mt-12 pt-8 border-t border-neutral-900/80 w-full flex items-center justify-center gap-6 text-xs font-mono uppercase tracking-widest text-neutral-500">
          <Link href="/shop" className="hover:text-neutral-300 transition-colors">
            Shop
          </Link>
          <span>•</span>
          <Link href="/lookbook" className="hover:text-neutral-300 transition-colors">
            Lookbook
          </Link>
          <span>•</span>
          <Link href="/orders" className="hover:text-neutral-300 transition-colors">
            Tracking
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-neutral-300 transition-colors">
            Policies
          </Link>
        </div>
      </div>
    </main>
  );
}

