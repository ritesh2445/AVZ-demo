import React, { useState, useEffect, useCallback } from 'react';
import LoadingExperience from './components/LoadingExperience';
import Navbar from './components/Navbar';
import HeroThreeDimension from './components/HeroThreeDimension';
import ExpandedCards from './components/ExpandedCards';
import ParallaxRow from './components/ParallaxRow';
import ImageTunnel from './components/ImageTunnel';
import ShopCatalogue from './components/ShopCatalogue';
import ProductDetailModal from './components/ProductDetailModal';
import AvzMuseum from './components/AvzMuseum';
import CustomOrders from './components/CustomOrders';
import CustomInquiryModal from './components/CustomInquiryModal';
import AboutSection from './components/AboutSection';
import AutoplayingReels from './components/AutoplayingReels';
import TestimonialsSection from './components/TestimonialsSection';
import { FAQSection, ContactSection, ShippingPackagingReturns } from './components/InformationalPages';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import SquadBuyModal from './components/SquadBuyModal';
import WishlistDrawer from './components/WishlistDrawer';
import OrderTrackingModal from './components/OrderTrackingModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { PRODUCTS, LOOKBOOK_ENTRIES } from './data/brandData';
import { playSound } from './utils/audio';
import { Scissors, Sparkles, ArrowDown } from 'lucide-react';
import { authClient } from './lib/auth-client';

export default function App({ storefrontConfig, cmsContent, products: liveProducts }) {
  // Live catalog products from database with fallback to brand data
  const catalogProducts = Array.isArray(liveProducts) && liveProducts.length > 0 ? liveProducts : PRODUCTS;

  // 1. Loading sequence state: Only show on initial visit per session for instant navigation
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return !sessionStorage.getItem('avz_intro_seen');
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    try {
      sessionStorage.setItem('avz_intro_seen', 'true');
    } catch (e) {}
  }, []);

  // 3. Modals and drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tunnelOpen, setTunnelOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [customInquiryConfirm, setCustomInquiryConfirm] = useState(null);
  const [customOrderPrefill, setCustomOrderPrefill] = useState('');

  // 4. Collective group buy state
  const [squadModalOpen, setSquadModalOpen] = useState(false);
  const [squadModalProduct, setSquadModalProduct] = useState(null);
  const [squadDiscount, setSquadDiscount] = useState(null); // { squadCode, discountPercent, memberCount }

  // 5. Vault Stash / Wishlist state with localStorage persistence
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem('avz_vault_stash');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // 6. Live D2C Order Tracking state
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  // 7. Global currency preference
  const [currency, setCurrency] = useState('INR');

  // 8. Shopping bag state with 1-of-1 inventory restrictions & localStorage persistence
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('avz_cart');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // 10. Client Auth & Guest Explorer state with persistence
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('avz_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('avz_user', JSON.stringify(userData));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('avz_user');
    } catch (e) {}
  };

  // Synchronize active Better Auth session (OAuth callbacks, persistent cookies)
  useEffect(() => {
    authClient
      .getSession()
      .then(({ data }) => {
        if (data?.user) {
          const sessionUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
            emailVerified: data.user.emailVerified,
            isGuest: false,
            tier: 'Archive VIP Member',
            loginTime: new Date(data.session?.createdAt || Date.now()).toISOString(),
          };
          setCurrentUser(sessionUser);
          try {
            localStorage.setItem('avz_user', JSON.stringify(sessionUser));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  // Enforce pure dark studio mode
  useEffect(() => {
    document.documentElement.classList.remove('light-theme');
    document.documentElement.removeAttribute('data-theme');
    try {
      localStorage.removeItem('avz_theme');
    } catch (e) {}
  }, []);

  // Scroll to section handler (memoized for zero child re-renders)
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -75; // compensate for sleek fixed navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);



  // Ensure all sections are permanently solid and rendered immediately on mount
  // Eliminates blank frames, layout jump, and artificial scroll-reveal delays
  useEffect(() => {
    if (isLoading) return;

    const sections = ['hero', 'vault', 'lookbook', 'shop', 'museum', 'custom', 'about', 'reels', 'specs', 'testimonials', 'faq', 'contact'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('is-visible');
      }
    });
  }, [isLoading]);

  // Wishlist toggle handler (memoized)
  const handleToggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      let updated;
      if (exists) {
        updated = prev.filter((p) => p.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      try {
        localStorage.setItem('avz_vault_stash', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const handleOpenSquadModal = useCallback((product = null) => {
    setSquadModalProduct(product);
    setSquadModalOpen(true);
  }, []);

  const handleApplySquadDiscount = useCallback((discountData) => {
    setSquadDiscount(discountData);
    setCartOpen(true);
  }, []);

  const handleAddToCart = useCallback((product) => {
    setCartItems((prev) => {
      const targetSize = product.selectedSize || 'Standard';
      const existingIndex = prev.findIndex(
        (i) => String(i.id) === String(product.id) && (i.selectedSize || 'Standard') === targetSize
      );

      let updated;
      if (existingIndex > -1) {
        if (product.stock === 1) return prev;
        updated = [...prev];
        updated[existingIndex].quantity += 1;
      } else {
        updated = [...prev, { ...product, quantity: 1, selectedSize: targetSize }];
      }

      try {
        localStorage.setItem('avz_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setActiveProduct(null);
    setCartOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((id, size, newQty) => {
    setCartItems((prev) => {
      let updated;
      if (newQty <= 0) {
        updated = prev.filter(
          (i) => !(String(i.id) === String(id) && (!size || !i.selectedSize || i.selectedSize === size))
        );
      } else {
        updated = prev.map((item) => {
          if (String(item.id) === String(id) && (!size || !item.selectedSize || item.selectedSize === size)) {
            if (item.stock === 1 && newQty > 1) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        });
      }

      try {
        localStorage.setItem('avz_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const handleRemoveItem = useCallback((id, size) => {
    setCartItems((prev) => {
      const updated = prev.filter(
        (i) => !(String(i.id) === String(id) && (!size || !i.selectedSize || i.selectedSize === size))
      );
      try {
        localStorage.setItem('avz_cart', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    try {
      localStorage.removeItem('avz_cart');
    } catch (e) {}
  }, []);

  const handleRequestCustom = useCallback((referenceName) => {
    setCustomOrderPrefill(referenceName);
    scrollToSection('custom');
  }, [scrollToSection]);

  const handleInquirySubmitted = useCallback((formData) => {
    setCustomInquiryConfirm(formData);
  }, []);

  // Cart total count
  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen w-full bg-pitch-black text-silver relative overflow-x-clip selection:bg-pink selection:text-black">
      {/* Cinematic Pitch-black Loading Experience */}
      {isLoading && (
        <LoadingExperience onComplete={handleLoadingComplete} />
      )}

      {/* Global Studio Announcement Bar (Configured via Admin Panel) */}
      {storefrontConfig?.announcement?.enabled && storefrontConfig?.announcement?.text && (
        <aside
          role="region"
          aria-label="Studio Announcement"
          className="relative z-50 w-full py-2 px-4 bg-gradient-to-r from-[#1f0326] via-[#be185d] to-[#1f0326] text-white text-[11px] font-mono tracking-widest uppercase font-bold text-center border-b border-pink/40 shadow-sm flex items-center justify-center gap-2 select-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-200 animate-pulse shrink-0" />
          {storefrontConfig.announcement.link ? (
            <a
              href={storefrontConfig.announcement.link}
              onClick={(e) => {
                if (storefrontConfig.announcement.link.startsWith('#')) {
                  e.preventDefault();
                  scrollToSection(storefrontConfig.announcement.link.replace('#', ''));
                }
              }}
              className="hover:underline flex items-center gap-1.5 cursor-pointer text-white"
            >
              <span>{storefrontConfig.announcement.text}</span>
              <span className="text-pink-200">↗</span>
            </a>
          ) : (
            <span>{storefrontConfig.announcement.text}</span>
          )}
        </aside>
      )}

      {/* Main Global Icon Navigation */}
      <Navbar
        onScrollToSection={scrollToSection}
        cartCount={cartTotalCount}
        onOpenCart={() => setCartOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenTunnel={() => setTunnelOpen(true)}
        wishlistCount={wishlistItems.length}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenSquadModal={() => handleOpenSquadModal()}
        onOpenTrackingModal={() => setTrackingModalOpen(true)}
        user={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Single Continuous Page Scroll Pipeline */}
      <main className="w-full flex flex-col">
        {/* Section 1: Pure 3D WebGL Hero */}
        <section id="hero" className="w-full">
          <HeroThreeDimension
            isReady={!isLoading}
            onOpenTunnel={() => setTunnelOpen(true)}
            onExploreCatalogue={() => scrollToSection('shop')}
            onScrollToSection={scrollToSection}
            cmsHero={cmsContent?.hero}
          />
        </section>

        {/* Section 2: Vault Piece Rail */}
        <section id="vault" className="w-full">
          <ExpandedCards
            items={catalogProducts.slice(0, 5)}
            onSelectProduct={setActiveProduct}
            currency={currency}
          />
        </section>

        {/* Section 3: Spatial Parallax Lookbook Drift */}
        <section id="lookbook" className="w-full">
          <ParallaxRow
            entries={LOOKBOOK_ENTRIES}
            onCommissionLook={handleRequestCustom}
          />
        </section>

        {/* Section 4: Full Shop Catalogue */}
        <section id="shop" className="w-full">
          <ShopCatalogue
            products={catalogProducts}
            onSelectProduct={setActiveProduct}
            onAddToCart={handleAddToCart}
            currency={currency}
            initialCategory="All"
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistItems.map((p) => p.id)}
            onOpenSquadModal={handleOpenSquadModal}
          />
        </section>

        {/* Section 6: AVZ Museum Archive Vault */}
        <AvzMuseum
          onRequestCustomCommission={handleRequestCustom}
          theme="dark"
          cmsMuseum={cmsContent?.museum}
        />

        {/* Section 7: Custom Orders */}
        <CustomOrders
          initialReference={customOrderPrefill}
          onInquirySubmitted={handleInquirySubmitted}
          cmsCustomOrders={cmsContent?.custom_orders}
        />

        {/* Section 8: Founder's World & Story (Fixed Horizontal Scroll Lock) */}
        <section id="about" className="w-full">
          <AboutSection
            onScrollToSection={scrollToSection}
            onOpenSquadModal={handleOpenSquadModal}
            cmsFounders={cmsContent?.founders}
          />
        </section>

        {/* Section 8.5: Autoplaying Runway & Studio Reels with Vimeo links */}
        <AutoplayingReels
          cmsReels={cmsContent?.reels}
          onSelectProduct={setActiveProduct}
          onRequestCustom={handleRequestCustom}
          onScrollToSection={scrollToSection}
        />

        {/* Section 9: Packaging & Logistics */}
        <section id="specs" className="w-full">
          <ShippingPackagingReturns />
        </section>

        {/* Section 9.5: Customer Testimonials (What People Say) */}
        <TestimonialsSection
          currentUser={currentUser}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />

        {/* Section 10: Client Questions (FAQ) */}
        <section id="faq" className="w-full">
          <FAQSection />
        </section>

        {/* Section 11: Direct Contact & Social */}
        <section id="contact" className="w-full">
          <ContactSection />
        </section>
      </main>

      {/* Global Modals & Center-Aligned Drawers */}
      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
        currency={currency}
        onRequestCustom={handleRequestCustom}
        onOpenSquadModal={handleOpenSquadModal}
        isWishlisted={wishlistItems.some((p) => p.id === activeProduct?.id)}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currency={currency}
        onCheckoutComplete={(order) => {
          console.log("Order logged:", order);
        }}
        squadDiscount={squadDiscount}
        onOpenSquadModal={handleOpenSquadModal}
        currentUser={currentUser}
        purchasesEnabled={storefrontConfig?.purchases_enabled?.enabled ?? true}
        purchasesDisabledMessage={storefrontConfig?.purchases_enabled?.disabled_message}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        currency={currency}
        onOpenSquadModal={handleOpenSquadModal}
      />

      <SquadBuyModal
        isOpen={squadModalOpen}
        onClose={() => setSquadModalOpen(false)}
        onApplySquadDiscount={handleApplySquadDiscount}
        activeProduct={squadModalProduct}
      />

      <OrderTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={catalogProducts}
        onSelectProduct={(p) => {
          if (p.price) {
            setActiveProduct(p);
          } else {
            handleRequestCustom(p.name);
          }
        }}
        currency={currency}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <ImageTunnel
        isOpen={tunnelOpen}
        onClose={() => setTunnelOpen(false)}
      />

      <CustomInquiryModal
        isOpen={!!customInquiryConfirm}
        onClose={() => setCustomInquiryConfirm(null)}
        inquiryData={customInquiryConfirm}
      />

      {/* Global Full-Width Footer */}
      <Footer onScrollToSection={scrollToSection} cmsFooter={cmsContent?.footer} />
    </div>
  );
}
