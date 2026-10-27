import React, { useState } from 'react';
import {
  ShoppingBag,
  Layers,
  Camera,
  Landmark,
  Scissors,
  User,
  Mail,
  Search,
  Menu,
  X,
  Compass,
  Volume2,
  VolumeX,
  Heart,
  Users,
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
  onOpenTunnel,
  wishlistCount = 0,
  onOpenWishlist,
  onOpenSquadModal,
  onOpenTrackingModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const handleSoundToggle = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playSound('click');
  };

  // Nav icons with tooltip labels
  const navItems = [
    { id: 'shop', label: 'Baddie Shop', icon: ShoppingBag },
    { id: 'vault', label: 'Vault Rail', icon: Layers },
    { id: 'lookbook', label: 'Lookbook', icon: Camera },
    { id: 'museum', label: 'AVZ Museum', icon: Landmark },
    { id: 'custom', label: 'Custom Atelier', icon: Scissors },
    { id: 'about', label: 'Dhristroyer World', icon: User },
    { id: 'contact', label: 'Contact DM', icon: Mail }
  ];

  const handleNavClick = (id) => {
    playSound('snap');
    setMobileMenuOpen(false);
    onScrollToSection(id);
  };

  return (
    <header className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] sm:w-auto sm:max-w-5xl select-none transition-all duration-300">
      {/* Floating Center Capsule Container with Purple Gradient Glassmorphism */}
      <div className="glass-capsule-purple rounded-full px-3 sm:px-5 h-12 sm:h-14 flex items-center justify-between gap-1.5 sm:gap-4 shadow-2xl w-full">
        
        {/* Brand Logo & Monogram */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img
              src={ASSET_MANIFEST.logo}
              alt="AVZ Emblem"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(244,194,194,0.4)] transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="font-spartan font-black text-sm tracking-[0.2em] text-white uppercase group-hover:text-pink transition-colors">
            AVZ
          </span>
        </div>

        {/* Desktop Minimalist Icon Navigation */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <div key={item.id} className="relative group flex flex-col items-center">
                <button
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => playSound('hover')}
                  aria-label={item.label}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-[#be185d]/30 text-pink-300 border-[#be185d]/70 shadow-[0_0_15px_rgba(190,24,93,0.5)]'
                      : 'text-silver/70 hover:text-white border-transparent hover:border-white/15 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>

                {/* Floating Tooltip Bubble */}
                <div className="absolute -bottom-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/95 border border-[#be185d]/40 text-[10px] font-mono text-pink-300 tracking-wider shadow-lg">
                  {item.label}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Right Tools Capsule (Squad Buy, Wishlist, Tracking, Bag, Audio) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Squad Buy Shortcut - Hidden on mobile */}
          {onOpenSquadModal && (
            <div className="relative group hidden sm:flex flex-col items-center">
              <button
                onClick={() => {
                  playSound('snap');
                  onOpenSquadModal();
                }}
                onMouseEnter={() => playSound('hover')}
                aria-label="Squad Buy"
                className="w-8 h-8 rounded-full flex items-center justify-center text-pink-300 hover:text-white cursor-pointer transition-all border border-pink-400/20 hover:border-pink-400 bg-pink-400/10"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
              <div className="absolute -bottom-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/95 border border-[#be185d]/40 text-[10px] font-mono text-pink-300 tracking-wider shadow-lg">
                Squad Buy (Save 20%)
              </div>
            </div>
          )}

          {/* Wishlist / Vault Stash Shortcut - Hidden on mobile (in mobile menu) */}
          {onOpenWishlist && (
            <div className="relative group hidden sm:flex flex-col items-center">
              <button
                onClick={() => {
                  playSound('snap');
                  onOpenWishlist();
                }}
                onMouseEnter={() => playSound('hover')}
                aria-label="Vault Stash"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-silver/80 hover:text-pink-300 cursor-pointer transition-all border border-white/10 hover:border-[#be185d] bg-white/5"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-pink-400 fill-pink-400' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#be185d] text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <div className="absolute -bottom-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/95 border border-[#be185d]/40 text-[10px] font-mono text-pink-300 tracking-wider shadow-lg">
                Vault Stash ({wishlistCount})
              </div>
            </div>
          )}

          {/* Live Order Tracking Shortcut - Hidden on mobile */}
          {onOpenTrackingModal && (
            <div className="relative group hidden sm:flex flex-col items-center">
              <button
                onClick={() => {
                  playSound('snap');
                  onOpenTrackingModal();
                }}
                onMouseEnter={() => playSound('hover')}
                aria-label="Track Parcel"
                className="w-8 h-8 rounded-full flex items-center justify-center text-silver/80 hover:text-white cursor-pointer transition-all border border-white/10 hover:border-[#be185d] bg-white/5"
              >
                <Package className="w-3.5 h-3.5" />
              </button>
              <div className="absolute -bottom-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/95 border border-[#be185d]/40 text-[10px] font-mono text-pink-300 tracking-wider shadow-lg">
                Track Parcel
              </div>
            </div>
          )}

          {/* 3D Tunnel Icon Trigger */}
          <div className="relative group flex flex-col items-center hidden sm:flex">
            <button
              onClick={() => {
                playSound('warp');
                onOpenTunnel();
              }}
              onMouseEnter={() => playSound('hover')}
              aria-label="3D Hyper Tunnel"
              className="w-8 h-8 rounded-full flex items-center justify-center text-pink-300 hover:text-white cursor-pointer transition-all duration-200 border border-transparent hover:border-[#be185d]/50 hover:bg-white/5"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
            <div className="absolute -bottom-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-black/95 border border-[#be185d]/40 text-[10px] font-mono text-pink-300 tracking-wider shadow-lg">
              3D Tunnel
            </div>
          </div>

          {/* Compact Currency Switcher - Hidden on mobile */}
          <select
            value={currency}
            onChange={(e) => {
              playSound('snap');
              onCurrencyChange(e.target.value);
            }}
            aria-label="Currency"
            className="hidden sm:block bg-transparent text-silver/80 hover:text-white text-xs font-mono cursor-pointer border-none outline-none py-1 transition-colors"
          >
            {Object.keys(CURRENCIES).map((c) => (
              <option key={c} value={c} className="bg-neutral-950 text-silver">
                {c}
              </option>
            ))}
          </select>

          {/* Audio Haptics Toggle */}
          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute Audio' : 'Unmute Audio'}
            className="w-7 h-7 rounded-full flex items-center justify-center text-silver/70 hover:text-pink transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 text-pink" /> : <VolumeX className="w-3.5 h-3.5 text-silver/40" />}
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => {
              playSound('snap');
              onOpenSearch();
            }}
            aria-label="Search"
            className="w-7 h-7 rounded-full flex items-center justify-center text-silver/70 hover:text-pink transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Bag Capsule Button with Count */}
          <button
            onClick={() => {
              playSound('snap');
              onOpenCart();
            }}
            aria-label="Shopping Bag"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full btn-glass text-white hover:text-pink font-spartan font-bold text-xs tracking-wider transition-all cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-pink" />
            <span className="font-mono text-[11px] font-bold text-pink">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              playSound('snap');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Mobile Navigation"
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-silver hover:text-white bg-white/5 cursor-pointer ml-1"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Glass Overlay) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] sm:top-[72px] left-3 right-3 bg-black/97 backdrop-blur-2xl border border-[#be185d]/40 rounded-3xl p-4 shadow-2xl flex flex-col gap-1 z-50 animate-fade-in text-left max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#be185d]/30 text-pink-300 font-bold border border-[#be185d]/50'
                    : 'text-silver/80 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 text-pink" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Mobile-only extras */}
          <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-1">
            {/* Currency selector in mobile menu */}
            <div className="flex items-center gap-3 px-4 py-2">
              <span className="text-[10px] font-mono text-silver/50 uppercase tracking-widest">Currency</span>
              <select
                value={currency}
                onChange={(e) => { playSound('snap'); onCurrencyChange(e.target.value); }}
                className="bg-transparent text-silver/80 text-xs font-mono cursor-pointer border-none outline-none"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c} className="bg-neutral-950 text-silver">{c}</option>
                ))}
              </select>
            </div>

            {/* Wishlist in mobile menu */}
            {onOpenWishlist && (
              <button
                onClick={() => { playSound('snap'); setMobileMenuOpen(false); onOpenWishlist(); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-mono tracking-wider uppercase text-silver/80 hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-pink-400 fill-pink-400' : 'text-pink'}`} />
                <span>Vault Stash {wishlistCount > 0 ? `(${wishlistCount})` : ''}</span>
              </button>
            )}

            {/* Squad Buy in mobile menu */}
            {onOpenSquadModal && (
              <button
                onClick={() => { playSound('snap'); setMobileMenuOpen(false); onOpenSquadModal(); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-mono tracking-wider uppercase text-silver/80 hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-pink" />
                <span>Squad Buy (Save 20%)</span>
              </button>
            )}

            {/* Track order in mobile menu */}
            {onOpenTrackingModal && (
              <button
                onClick={() => { playSound('snap'); setMobileMenuOpen(false); onOpenTrackingModal(); }}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-xs font-mono tracking-wider uppercase text-silver/80 hover:text-white hover:bg-white/5 border border-transparent transition-all cursor-pointer"
              >
                <Package className="w-4 h-4 text-pink" />
                <span>Track Order</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
