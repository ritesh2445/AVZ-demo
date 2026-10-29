import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Volume2,
  VolumeX,
  Heart,
  Package,
  Sun,
  Moon,
  ChevronDown,
  Check,
  Globe
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
  onOpenTrackingModal,
  theme = 'dark',
  onToggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [visible, setVisible] = useState(true);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyDropdownRef = useRef(null);

  // Close currency dropdown on click outside or Escape
  useEffect(() => {
    if (!currencyOpen) return;
    const handleClickOutside = (e) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target)) {
        setCurrencyOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setCurrencyOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [currencyOpen]);

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
    { id: 'shop', label: 'Shop' },
    { id: 'vault', label: 'Featured' },
    { id: 'lookbook', label: 'Lookbook' },
    { id: 'museum', label: 'Archive' },
    { id: 'custom', label: 'Custom' },
    { id: 'about', label: 'About' }
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
            aria-label="AVZ Home"
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

            {/* Site Themed Luxury Currency Selector Dropdown */}
            <div className="relative" ref={currencyDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  playSound('snap');
                  setCurrencyOpen(!currencyOpen);
                }}
                aria-label="Select Currency"
                aria-expanded={currencyOpen}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/12 hover:border-pink/40 text-zinc-300 hover:text-white transition-all text-[10px] font-mono tracking-wider cursor-pointer active:scale-95 shadow-sm"
              >
                <span className="text-xs leading-none">{CURRENCIES[currency]?.flag || '🌐'}</span>
                <span className="font-semibold">{currency}</span>
                <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${currencyOpen ? 'rotate-180 text-pink' : ''}`} />
              </button>

              {/* Floating Glassmorphic Dropdown */}
              {currencyOpen && (
                <div className="currency-dropdown-menu absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-[#0c0c12]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] z-50 flex flex-col gap-1 animate-fade-in text-left">
                  <div className="px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10 flex items-center justify-between">
                    <span>GLOBAL CURRENCY</span>
                    <span className="text-pink font-semibold">10 MAJOR</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto pr-1 space-y-0.5 no-scrollbar">
                    {Object.entries(CURRENCIES).map(([code, info]) => {
                      const isSelected = currency === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            playSound('pip');
                            onCurrencyChange?.(code);
                            setCurrencyOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer text-xs font-mono ${
                            isSelected
                              ? 'bg-gradient-to-r from-pink/20 to-purple-500/20 text-white font-bold border border-pink/40 shadow-sm'
                              : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm shrink-0">{info.flag}</span>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-xs">{code}</span>
                                <span className="text-[10px] text-zinc-400">({info.symbol.trim()})</span>
                              </div>
                              <span className="text-[9px] text-zinc-400 truncate">{info.name}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              aria-label={soundOn ? 'Mute' : 'Unmute'}
              className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-600" />}
            </button>

            {/* Architectural Light / Dark Mode Toggle */}
            <button
              onClick={() => {
                onToggleTheme?.();
              }}
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-zinc-800 hover:text-black" />
              ) : (
                <Sun className="w-3.5 h-3.5 hover:text-pink-300" />
              )}
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
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-6 pt-20 md:hidden animate-fade-in select-none overflow-y-auto">
          <nav className="flex flex-col gap-5 text-left">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-baseline justify-between border-b border-white/10 pb-2.5 text-left group"
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

          {/* Mobile Currency Grid Selector */}
          <div className="py-4 my-2 border-y border-white/10 text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2.5 flex items-center justify-between">
              <span>SELECT CURRENCY</span>
              <span className="text-pink font-semibold">{CURRENCIES[currency]?.flag} {currency} ({CURRENCIES[currency]?.name})</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.entries(CURRENCIES).map(([code, info]) => {
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      playSound('pip');
                      onCurrencyChange?.(code);
                    }}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-pink text-black font-bold border-pink shadow-md'
                        : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-base leading-none mb-1">{info.flag}</span>
                    <span className="text-[9px] font-mono font-semibold">{code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSoundToggle}
                className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
              >
                {soundOn ? <Volume2 className="w-3.5 h-3.5 text-pink-300" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{soundOn ? 'Sound On' : 'Muted'}</span>
              </button>

              <button
                onClick={() => {
                  onToggleTheme?.();
                }}
                className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]"
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-pink-300" />}
                <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
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
