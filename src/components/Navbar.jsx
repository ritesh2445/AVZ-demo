import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Volume2,
  VolumeX,
  Heart,
  Package
} from 'lucide-react';
import { ASSET_MANIFEST, CURRENCIES } from '../data/brandData';
import { playSound, toggleSound } from '../utils/audio';

export default function Navbar({
  activeSection,
  onScrollToSection,
  cartCount,
  onOpenCart,
  currency,
  onCurrencyChange,
  onOpenSearch,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenTrackingModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [visible, setVisible] = useState(true);

  // Auto-hide navbar on scroll down, reveal on scroll up or at top
  useEffect(() => {
    let lastY = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      // If scrolled past threshold
      if (currentY > 60) {
        if (currentY > lastY && currentY - lastY > 8) {
          // Scrolling DOWN: hide navbar smoothly
          setVisible(false);
          setMobileMenuOpen(false);
        } else if (currentY < lastY && lastY - currentY > 8) {
          // Scrolling UP: reveal navbar
          setVisible(true);
        }
      } else {
        // At the very top: always visible
        setVisible(true);
      }
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playSound('click');
  };

  const navItems = [
    { id: 'shop', label: 'Collection' },
    { id: 'vault', label: 'Vault' },
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'museum', label: 'Archive' },
    { id: 'custom', label: 'Bespoke' },
    { id: 'about', label: 'Atelier' }
  ];

  const handleNavClick = (id) => {
    playSound('snap');
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] sm:w-auto sm:min-w-[620px] max-w-4xl select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        {/* Sleek, Architectural Glass Capsule */}
        <div className="bg-[#0b030f]/85 backdrop-blur-2xl border border-white/12 rounded-full px-4 sm:px-6 h-11 sm:h-12 flex items-center justify-between gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          {/* Brand Mark */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 focus:outline-none"
            aria-label="AVZ Atelier Home"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <img
                src={ASSET_MANIFEST.logo}
                alt="AVZ"
                className="w-full h-full object-contain filter brightness-110 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="font-mono text-xs font-semibold tracking-[0.25em] text-white uppercase group-hover:text-pink-300 transition-colors">
              AVZ
            </span>
          </button>

          {/* Desktop Minimalist Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-[11px] font-mono tracking-[0.2em] uppercase transition-all duration-200 cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-white font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-[#be185d]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search */}
            <button
              onClick={() => {
                playSound('snap');
                onOpenSearch?.();
              }}
              aria-label="Search Collection"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist */}
            {onOpenWishlist && (
              <button
                onClick={() => {
                  playSound('snap');
                  onOpenWishlist();
                }}
                aria-label="Wishlist"
                className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-[#be185d] fill-[#be185d]' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#be185d] text-white text-[8px] font-mono font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            )}

            {/* Shopping Bag */}
            <button
              onClick={() => {
                playSound('snap');
                onOpenCart?.();
              }}
              aria-label="Shopping Bag"
              className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/10 hover:border-white/25 bg-white/5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#be185d] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => {
                playSound('snap');
                onCurrencyChange?.(e.target.value);
              }}
              aria-label="Currency"
              className="hidden sm:block bg-transparent text-zinc-400 hover:text-white text-[10px] font-mono tracking-wider cursor-pointer border-none outline-none pl-1 transition-colors"
            >
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c} className="bg-neutral-950 text-silver">
                  {c}
                </option>
              ))}
            </select>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              aria-label={soundOn ? 'Mute' : 'Unmute'}
              className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => {
                playSound('snap');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle Menu"
              className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Editorial Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 pt-24 md:hidden animate-fade-in select-none">
          <nav className="flex flex-col gap-6 text-left">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-baseline justify-between border-b border-white/10 pb-3 text-left group"
              >
                <span className="font-mono text-sm tracking-[0.25em] text-white uppercase group-hover:text-pink-300 transition-colors">
                  {item.label}
                </span>
                <span className="font-mono text-[10px] text-zinc-500">
                  0{idx + 1}
                </span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSoundToggle}
                className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5 text-pink-300" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundOn ? 'Sound On' : 'Muted'}</span>
              </button>
            </div>
            {onOpenTrackingModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackingModal();
                }}
                className="flex items-center gap-1 text-[11px] tracking-wider uppercase text-zinc-400 hover:text-white"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
