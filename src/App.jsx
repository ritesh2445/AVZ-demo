import React, { useState, useEffect } from 'react';
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
import { FAQSection, ContactSection, ShippingPackagingReturns } from './components/InformationalPages';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import SquadBuyModal from './components/SquadBuyModal';
import WishlistDrawer from './components/WishlistDrawer';
import OrderTrackingModal from './components/OrderTrackingModal';
import Footer from './components/Footer';
import { PRODUCTS, LOOKBOOK_ENTRIES } from './data/brandData';
import { playSound } from './utils/audio';
import { Scissors, Sparkles, ArrowDown } from 'lucide-react';

export default function App() {
  // 1. Loading sequence state
  const [isLoading, setIsLoading] = useState(true);

  // 2. Active section for dynamic navbar tracking
  const [activeSection, setActiveSection] = useState('hero');

  // 3. Modals and drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tunnelOpen, setTunnelOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [customInquiryConfirm, setCustomInquiryConfirm] = useState(null);
  const [customOrderPrefill, setCustomOrderPrefill] = useState('');

  // 4. Baddie Squad Buy state
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

  // 8. Shopping bag state with 1-of-1 inventory restrictions
  const [cartItems, setCartItems] = useState([]);

  // Scroll to section handler
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -75; // compensate for sleek fixed navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Track active section via IntersectionObserver with zero main-thread scroll lag
  useEffect(() => {
    if (isLoading) return;

    const sections = ['hero', 'vault', 'lookbook', 'shop', 'museum', 'custom', 'about', 'specs', 'faq', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-15% 0px -40% 0px',
        threshold: [0, 0.2, 0.5]
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading]);

  // Wishlist toggle handler
  const handleToggleWishlist = (product) => {
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
  };

  const handleOpenSquadModal = (product = null) => {
    setSquadModalProduct(product);
    setSquadModalOpen(true);
  };

  const handleApplySquadDiscount = (discountData) => {
    setSquadDiscount(discountData);
    setCartOpen(true);
  };

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === product.id && i.selectedSize === product.selectedSize
      );

      // If already exists and stock is 1, prevent duplicate
      if (existingIndex > -1) {
        if (product.stock === 1) return prev;
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    setActiveProduct(null);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id, size);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.selectedSize === size) {
          if (item.stock === 1 && newQty > 1) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id, size) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.selectedSize === size)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleRequestCustom = (referenceName) => {
    setCustomOrderPrefill(referenceName);
    scrollToSection('custom');
  };

  const handleInquirySubmitted = (formData) => {
    setCustomInquiryConfirm(formData);
  };

  // Cart total count
  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen w-full bg-pitch-black text-silver relative overflow-x-clip selection:bg-pink selection:text-black">
      {/* Cinematic Pitch-black Loading Experience */}
      {isLoading && (
        <LoadingExperience onComplete={() => setIsLoading(false)} />
      )}

      {/* Main Global Icon Navigation */}
      <Navbar
        activeSection={activeSection}
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
      />

      {/* Single Continuous Page Scroll Pipeline */}
      <main className="w-full pt-20 flex flex-col">
        {/* Section 1: Pure 3D WebGL Hero */}
        <section id="hero" className="w-full">
          <HeroThreeDimension
            isReady={!isLoading}
            onOpenTunnel={() => setTunnelOpen(true)}
          />
        </section>

        {/* Section 2: Vault Piece Rail */}
        <section id="vault" className="w-full">
          <ExpandedCards
            items={PRODUCTS.slice(0, 5)}
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
            onSelectProduct={setActiveProduct}
            currency={currency}
            initialCategory="All"
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistItems.map((p) => p.id)}
            onOpenSquadModal={handleOpenSquadModal}
          />
        </section>

        {/* Section 6: AVZ Museum Archive Vault */}
        <section id="museum" className="w-full">
          <AvzMuseum onRequestCustomCommission={handleRequestCustom} />
        </section>

        {/* Section 7: Custom Atelier Bespoke Orders */}
        <section id="custom" className="w-full">
          <CustomOrders
            initialReference={customOrderPrefill}
            onInquirySubmitted={handleInquirySubmitted}
          />
        </section>

        {/* Section 8: Founder's World & Atelier Parallax Journey (Fixed Horizontal Scroll Lock) */}
        <section id="about" className="w-full">
          <AboutSection
            onScrollToSection={scrollToSection}
            onOpenSquadModal={handleOpenSquadModal}
          />
        </section>

        {/* Section 9: Packaging & Logistics */}
        <section id="specs" className="w-full">
          <ShippingPackagingReturns />
        </section>

        {/* Section 10: FAQ */}
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
        onSelectProduct={(p) => {
          if (p.price) {
            setActiveProduct(p);
          } else {
            handleRequestCustom(p.name);
          }
        }}
        currency={currency}
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
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}
