import React, { useState, useEffect, useCallback } from 'react';
import LoadingExperience from './components/LoadingExperience';
import Navbar from './components/Navbar';
import HeroThreeDimension from './components/HeroThreeDimension';
import ExpandedCards from './components/ExpandedCards';
import ParallaxRow from './components/ParallaxRow';
import ImageTunnel from './components/ImageTunnel';
import ShopCatalogue from './components/ShopCatalogue';
import ProductDetailModal from './components/ProductDetailModal';
import RequestPieceModal from './components/RequestPieceModal';
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
import LegalPoliciesModal from './components/LegalPoliciesModal';
import ErrorBoundary from './components/ErrorBoundary';
import { useModalScrollLock } from './utils/modalScrollLock';
import DPDPConsentBanner from './components/DPDPConsentBanner';
import GroupOrderModal from './components/GroupOrderModal';
import { PRODUCTS, LOOKBOOK_ENTRIES } from './data/brandData';
import { playSound } from './utils/audio';
import { Scissors, Sparkles, ArrowDown } from 'lucide-react';
import { authClient } from './lib/auth-client';

export default function App({ storefrontConfig, cmsContent, products: liveProducts, initialSlug }) {
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
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('privacy');
  const handleOpenLegalModal = useCallback((tab = 'privacy') => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  }, []);

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
  const [groupOrderModalOpen, setGroupOrderModalOpen] = useState(false);
  const [requestPieceModalOpen, setRequestPieceModalOpen] = useState(false);
  const [requestedPieceTarget, setRequestedPieceTarget] = useState(null);
  const [activeGroupCart, setActiveGroupCart] = useState(null);

  // Real-Time Live Sync: Polling storefront settings every 6 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/storefront/config');
        if (res.ok) {
          const data = await res.json();
          if (data?.settings) setStorefrontConfig(data.settings);
        }
      } catch {}
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Check for ?groupCart=... collaborative invite link
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const grpId = params.get('groupCart');
    if (grpId) {
      fetch(`/api/storefront/group-cart/${grpId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.groupCart) {
            setActiveGroupCart(data.groupCart);
            setGroupOrderModalOpen(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Check for ?wishlist=... or ?stash=... curated shared link
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get('wishlist') || params.get('stash');
    if (!sharedParam) return;

    const ids = sharedParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (ids.length === 0) return;

    setWishlistItems((prev) => {
      const prevIds = new Set(prev.map((p) => String(p.id || p.slug || p).toLowerCase()));
      const toAdd = catalogProducts.filter((p) =>
        ids.includes(String(p.id).toLowerCase()) ||
        ids.includes(String(p.slug || '').toLowerCase())
      );

      // If any of the IDs are not in catalogProducts, add fallback item
      ids.forEach((id) => {
        const found = toAdd.some(
          (p) => String(p.id).toLowerCase() === id || String(p.slug || '').toLowerCase() === id
        );
        if (!found && !prevIds.has(id)) {
          toAdd.push({
            id,
            name: 'Archival Vault Piece',
            title: 'Archival Vault Piece',
            price: null,
            images: ['/assets/editorial_hero_portrait.jpg'],
            image: '/assets/editorial_hero_portrait.jpg',
            tag: 'ARCHIVE 1-OF-1'
          });
        }
      });

      const combined = [...prev];
      toAdd.forEach((item) => {
        const itemId = String(item.id || item.slug || item).toLowerCase();
        if (!prevIds.has(itemId)) {
          combined.push(item);
          prevIds.add(itemId);
        }
      });

      try {
        localStorage.setItem('avz_vault_stash', JSON.stringify(combined));
      } catch (e) {}
      return combined;
    });

    const timer = setTimeout(() => {
      setWishlistOpen(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [catalogProducts]);

  // Synchronize cart items with live catalog product prices, names, and stock
  useEffect(() => {
    if (!Array.isArray(catalogProducts) || catalogProducts.length === 0) return;

    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems) || prevItems.length === 0) return prevItems;

      let changed = false;
      const updated = prevItems.map((item) => {
        const liveMatch = catalogProducts.find(
          (p) => String(p.id) === String(item.id) ||
                 (p.title && item.name && p.title.toLowerCase() === item.name.toLowerCase()) ||
                 (p.name && item.name && p.name.toLowerCase() === item.name.toLowerCase())
        );

        if (!liveMatch) return item;

        const livePrice = Number(liveMatch.price);
        const currentPrice = Number(item.price);
        const liveName = liveMatch.title || liveMatch.name || item.name;
        const liveImage = liveMatch.image || (Array.isArray(liveMatch.images) ? liveMatch.images[0] : null) || item.image;
        const liveStock = liveMatch.stock !== undefined ? liveMatch.stock : (liveMatch.inventory_quantity !== undefined ? liveMatch.inventory_quantity : item.stock);

        if (
          (!isNaN(livePrice) && livePrice !== currentPrice) ||
          liveName !== item.name ||
          (liveStock !== undefined && liveStock !== item.stock) ||
          (liveImage && liveImage !== item.image)
        ) {
          changed = true;
          return {
            ...item,
            price: !isNaN(livePrice) ? livePrice : item.price,
            name: liveName,
            title: liveName,
            image: liveImage,
            stock: liveStock,
          };
        }
        return item;
      });

      if (changed) {
        try {
          localStorage.setItem('avz_cart', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      }
      return prevItems;
    });
  }, [catalogProducts]);
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

  // Deep-linking route handler: resolves URLs like /custom, /shop, /vault, /lookbook, /cart, /wishlist, /privacy, etc.
  useEffect(() => {
    if (!initialSlug) return;
    const slugStr = Array.isArray(initialSlug)
      ? initialSlug.join('/')
      : String(initialSlug || '');
    const cleanSlug = slugStr.toLowerCase().trim().replace(/^\/+|\/+$/g, '');
    if (!cleanSlug) return;

    const timer = setTimeout(() => {
      // 1. Modals & Drawers
      if (cleanSlug === 'cart' || cleanSlug === 'bag') {
        setCartOpen(true);
        return;
      }
      if (cleanSlug === 'wishlist' || cleanSlug === 'stash') {
        setWishlistOpen(true);
        return;
      }
      if (cleanSlug === 'tracking' || cleanSlug === 'orders' || cleanSlug === 'order-status') {
        setTrackingModalOpen(true);
        return;
      }
      if (cleanSlug === 'privacy' || cleanSlug === 'privacy-policy') {
        handleOpenLegalModal('privacy');
        return;
      }
      if (cleanSlug === 'terms' || cleanSlug === 'terms-of-service') {
        handleOpenLegalModal('terms');
        return;
      }
      if (cleanSlug === 'refund' || cleanSlug === 'returns' || cleanSlug === 'refund-policy') {
        handleOpenLegalModal('refund');
        return;
      }
      if (cleanSlug === 'shipping' || cleanSlug === 'shipping-policy') {
        handleOpenLegalModal('shipping');
        return;
      }
      if (cleanSlug === 'squad' || cleanSlug === 'group-buy' || cleanSlug === 'group-order') {
        setSquadModalOpen(true);
        return;
      }

      // 2. Product Detail deep link (/product/:id or /shop/:id)
      const prodSlug = cleanSlug.startsWith('product/')
        ? cleanSlug.replace('product/', '')
        : (cleanSlug.startsWith('shop/') ? cleanSlug.replace('shop/', '') : cleanSlug);
      
      const foundProduct = catalogProducts.find(
        (p) =>
          String(p.id).toLowerCase() === prodSlug ||
          String(p.slug || '').toLowerCase() === prodSlug ||
          String(p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === prodSlug
      );
      if (foundProduct && (cleanSlug.startsWith('product/') || cleanSlug.startsWith('shop/') || foundProduct.slug === cleanSlug)) {
        setActiveProduct(foundProduct);
        return;
      }

      // 3. Section Scroll Mapping
      const sectionMap = {
        custom: 'custom',
        'custom-order': 'custom',
        'custom-orders': 'custom',
        bespoke: 'custom',
        shop: 'shop',
        collection: 'shop',
        products: 'shop',
        vault: 'vault',
        archive: 'vault',
        lookbook: 'lookbook',
        campaign: 'lookbook',
        museum: 'museum',
        exhibit: 'museum',
        gallery: 'museum',
        about: 'about',
        founders: 'about',
        specs: 'specs',
        craft: 'specs',
        craftsmanship: 'specs',
        testimonials: 'testimonials',
        reviews: 'testimonials',
        faq: 'faq',
        faqs: 'faq',
        contact: 'contact'
      };

      const targetSection = sectionMap[cleanSlug];
      if (targetSection) {
        scrollToSection(targetSection);
        if (targetSection === 'custom') {
          const formInput = document.querySelector('#custom input, #custom textarea');
          if (formInput) formInput.focus();
        }
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [initialSlug, catalogProducts, scrollToSection, handleOpenLegalModal]);



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

  // Wishlist removal handler (memoized, handles item ID string, slug, or product object)
  const handleRemoveFromWishlist = useCallback((productOrId) => {
    if (!productOrId) return;
    const targetId = typeof productOrId === 'object' && productOrId !== null
      ? (productOrId.id || productOrId.slug || productOrId.name)
      : productOrId;

    setWishlistItems((prev) => {
      const updated = prev.filter((p) => {
        const pId = typeof p === 'object' && p !== null ? (p.id || p.slug || p.name) : p;
        return String(pId) !== String(targetId);
      });
      try {
        localStorage.setItem('avz_vault_stash', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Wishlist toggle handler (memoized, handles both object and string ID)
  const handleToggleWishlist = useCallback((product) => {
    if (!product) return;
    const targetId = typeof product === 'object' && product !== null
      ? (product.id || product.slug || product.name)
      : product;

    setWishlistItems((prev) => {
      const exists = prev.some((p) => {
        const pId = typeof p === 'object' && p !== null ? (p.id || p.slug || p.name) : p;
        return String(pId) === String(targetId);
      });
      let updated;
      if (exists) {
        updated = prev.filter((p) => {
          const pId = typeof p === 'object' && p !== null ? (p.id || p.slug || p.name) : p;
          return String(pId) !== String(targetId);
        });
      } else {
        updated = [...prev, typeof product === 'object' ? product : { id: product }];
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
    // If visitor is viewing a shared squad link without being logged in
    if (activeGroupCart && !currentUser) {
      playSound('pip');
      setAuthModalOpen(true);
      return;
    }

    const targetSize = product.selectedSize || 'Standard';

    // If logged in under an active collaborative squad cart, sync piece to backend group cart
    if (activeGroupCart && currentUser) {
      const itemPayload = {
        id: product.id,
        name: product.title || product.name,
        price: Number(product.price || 0),
        images: product.images || (product.image ? [product.image] : []),
        selectedSize: targetSize,
        quantity: 1
      };

      fetch(`/api/storefront/group-cart/${activeGroupCart.id}/add-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id || `user_${Date.now()}`,
          userName: currentUser.name || 'Squad Member',
          userEmail: currentUser.email || 'member@aveezahvaganza.com',
          item: itemPayload
        })
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.groupCart) {
            setActiveGroupCart(data.groupCart);
            setGroupOrderModalOpen(true);
          }
        })
        .catch(() => {});
    }

    setCartItems((prev) => {
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
    if (!activeGroupCart) {
      setCartOpen(true);
    }
  }, [activeGroupCart, currentUser]);

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

  const handleRequestPiece = useCallback((productOrName) => {
    let target = null;
    if (typeof productOrName === 'object' && productOrName !== null) {
      target = productOrName;
    } else if (typeof productOrName === 'string') {
      target = catalogProducts.find((p) => p.name === productOrName || p.title === productOrName) || { name: productOrName };
    }
    setRequestedPieceTarget(target);
    setRequestPieceModalOpen(true);
  }, [catalogProducts]);

  const handleRequestCustom = useCallback((referenceName) => {
    setCustomOrderPrefill(referenceName);
    scrollToSection('custom');
  }, [scrollToSection]);

  const handleInquirySubmitted = useCallback((formData) => {
    setCustomInquiryConfirm(formData);
  }, []);

  // Centralized Modal Lock: guarantees background is 100% stable & scroll-locked when ANY popup is open
  const isAnyModalOpen = Boolean(
    cartOpen ||
    requestPieceModalOpen ||
    searchOpen ||
    tunnelOpen ||
    squadModalOpen ||
    wishlistOpen ||
    trackingModalOpen ||
    legalModalOpen ||
    authModalOpen ||
    groupOrderModalOpen ||
    activeProduct ||
    customInquiryConfirm
  );
  useModalScrollLock(isAnyModalOpen);

  // Cart total count
  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="avz-storefront-root italic min-h-screen w-full bg-pitch-black text-silver relative overflow-x-clip selection:bg-pink selection:text-black">
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
            currentUser={currentUser}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onRequestCustom={handleRequestPiece}
          />
        </section>

        {/* Section 6: AVZ Museum Archive Vault */}
        <AvzMuseum
          onRequestCustomCommission={handleRequestPiece}
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
          onRequestCustom={handleRequestPiece}
          onScrollToSection={scrollToSection}
        />

        {/* Section 9: Packaging & Logistics */}
        <section id="specs" className="w-full">
          <ShippingPackagingReturns onOpenLegalModal={handleOpenLegalModal} />
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
        onRequestCustom={handleRequestPiece}
        onOpenSquadModal={handleOpenSquadModal}
        isWishlisted={wishlistItems.some((p) => p.id === activeProduct?.id)}
        onToggleWishlist={handleToggleWishlist}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />

      <ErrorBoundary>
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          shippingRates={storefrontConfig?.shipping_rates}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          currency={currency}
          onCheckoutComplete={(order) => {
            console.log("Order logged:", order);
          }}
          squadDiscount={squadDiscount}
          onOpenSquadModal={handleOpenSquadModal}
          onOpenGroupOrder={() => setGroupOrderModalOpen(true)}
          currentUser={currentUser}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          purchasesEnabled={storefrontConfig?.purchases_enabled?.enabled ?? true}
          purchasesDisabledMessage={storefrontConfig?.purchases_enabled?.disabled_message}
          thankYouTitle={storefrontConfig?.order_thank_you_message?.title}
          thankYouMessage={storefrontConfig?.order_thank_you_message?.message}
        />
      </ErrorBoundary>

      {/* Group Buying / Shared Order Together Modal */}
      <GroupOrderModal
        isOpen={groupOrderModalOpen}
        onClose={() => setGroupOrderModalOpen(false)}
        groupCart={activeGroupCart}
        cartItems={cartItems}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onGroupCartCreated={(grp) => setActiveGroupCart(grp)}
        onBrowseCatalog={() => {
          setGroupOrderModalOpen(false);
          scrollToSection('shop');
        }}
        onCheckoutGroup={(grp) => {
          setCartOpen(true);
        }}
        currency={currency}
      />

      {/* Dedicated Piece Request Modal (Name, Phone +91 strict 10 digits, Email) */}
      <RequestPieceModal
        isOpen={requestPieceModalOpen}
        onClose={() => setRequestPieceModalOpen(false)}
        piece={requestedPieceTarget}
        currentUser={currentUser}
        currency={currency}
      />

      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        items={wishlistItems}
        onRemoveFromWishlist={handleRemoveFromWishlist}
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
      <Footer
        onScrollToSection={scrollToSection}
        cmsFooter={cmsContent?.footer}
        onOpenLegalModal={handleOpenLegalModal}
      />

      {/* DPDP Act 2023 Explicit Consent Banner */}
      <DPDPConsentBanner onOpenPrivacyModal={handleOpenLegalModal} />

      {/* Official Legal & Policies Modal */}
      <LegalPoliciesModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
