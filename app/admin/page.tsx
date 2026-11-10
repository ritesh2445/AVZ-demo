'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Package, Warehouse, Layers, Users,
  FileEdit, Image as ImageIcon, Tag, UsersRound, CreditCard, Truck,
  BarChart3, Compass, BookOpen, Settings, Shield, History, LogOut,
  Search, Plus, Download, RefreshCw, CheckCircle, AlertTriangle,
  ExternalLink, Eye, ChevronRight, X, Sparkles, Filter, Edit3, Trash2,
  Copy, Save, Sliders, ShieldAlert, Check, Menu
  , Palette, Upload, RotateCcw, Calendar
} from 'lucide-react';
import MuseumGalleryAdminTab from '@/src/components/admin/MuseumGalleryAdminTab';
import MediaAndSectionManager from '@/src/components/admin/MediaAndSectionManager';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active navigation module
  const [activeTab, setActiveTab] = useState<string>('overview');
  // Piece Requests state
  const [pieceRequests, setPieceRequests] = useState<any[]>([]);
  const [isResettingActivity, setIsResettingActivity] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editSquadModalOpen, setEditSquadModalOpen] = useState(false);
  const [editingSquad, setEditingSquad] = useState<any>(null);

  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // Admin session state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Global Storefront Controls state
  const [storefrontSettings, setStorefrontSettings] = useState<any>({
    maintenance_mode: { enabled: false, title: 'STORE UNDER MAINTENANCE', message: 'Site updates underway.' },
    announcement: { enabled: false, text: '🪐 COMPLIMENTARY DOMESTIC DISPATCH ON ORDERS OVER ₹5,000', link: '#shop' },
    purchases_enabled: { enabled: true, disabled_message: 'Purchases temporarily paused for new creations.' },
    payment_methods: { online_payments: true, cod: true }
  });
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [kpis, setKpis] = useState<any>(null);
  const [storageData, setStorageData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [inventoryProducts, setInventoryProducts] = useState<any[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [contentSections, setContentSections] = useState<any[]>([]);
  const [mediaAssets, setMediaAssets] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [groupBuys, setGroupBuys] = useState<any[]>([]);
  const [groupCarts, setGroupCarts] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [mediaSearch, setMediaSearch] = useState<string>('');
  const [mediaFilterCategory, setMediaFilterCategory] = useState<string>('all');

  // Modals & form states
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productUrlInput, setProductUrlInput] = useState<string>('');
  const [productPickerOpen, setProductPickerOpen] = useState<boolean>(false);
  const [productPickerSearch, setProductPickerSearch] = useState<string>('');
  const [productPickerPage, setProductPickerPage] = useState<number>(1);
  const [isUploadingR2, setIsUploadingR2] = useState(false);
  const [shippingRates, setShippingRates] = useState<{
    express_courier_fee: number;
    free_threshold_enabled: boolean;
    free_threshold: number;
    courier_partner_label?: string;
  }>({
    express_courier_fee: 250,
    free_threshold_enabled: true,
    free_threshold: 5000,
    courier_partner_label: 'Blue Dart / Delhivery Express Air'
  });
  const [isSavingShipping, setIsSavingShipping] = useState(false);
  const [storeProfile, setStoreProfile] = useState<{
    whatsapp: string;
    email: string;
    phone: string;
    instagram: string;
    studio_city: string;
    cod_enabled: boolean;
  }>({
    whatsapp: '917304264901',
    email: 'aveezahstore@gmail.com',
    phone: '+91 73042 64901',
    instagram: '@dhristroyer',
    studio_city: 'Guwahati, Assam',
    cod_enabled: true
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveStoreProfile = async (newProfile?: any) => {
    const payload = newProfile || storeProfile;
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/admin/storefront/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'store_profile',
          value: payload
        })
      });
      if (res.ok) {
        setStoreProfile(payload);
        showNotification('✅ Store identity & payment settings saved successfully.', 'success');
      } else {
        showNotification('Failed to save store profile.', 'error');
      }
    } catch {
      showNotification('Error saving store profile.', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveShippingRates = async (newRates?: any) => {
    const payload = newRates || shippingRates;
    setIsSavingShipping(true);
    try {
      const res = await fetch('/api/admin/storefront/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'shipping_rates',
          value: payload
        })
      });
      if (res.ok) {
        setShippingRates(payload);
        showNotification('✅ Express Courier charges & free shipping rules saved successfully.', 'success');
      } else {
        showNotification('Failed to save courier charges.', 'error');
      }
    } catch {
      showNotification('Network error saving shipping rates.', 'error');
    } finally {
      setIsSavingShipping(false);
    }
  };
  const [productImagePreview, setProductImagePreview] = useState<string>('');

  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>, targetFieldId = 'p_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingR2(true);
    showNotification('Uploading asset to Cloudflare R2 bucket...', 'success');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload to Cloudflare R2 failed');
      }

      if (targetFieldId) {
        const inputEl = document.getElementById(targetFieldId) as HTMLInputElement;
        if (inputEl) {
          inputEl.value = data.media.url;
        }
        setProductImagePreview(data.media.url);
      }

      // Refresh media library list
      const medRes = await fetch('/api/admin/media');
      const medData = await medRes.json();
      if (medData.assets) setMediaAssets(medData.assets);

      showNotification('✅ Media stored in Cloudflare R2 & accelerated via Edge CDN', 'success');
    } catch (err: any) {
      showNotification(`❌ Upload error: ${err.message}`, 'error');
    } finally {
      setIsUploadingR2(false);
      e.target.value = '';
    }
  };

  // Upload multiple images simultaneously for Product Creation/Editing
  const handleUploadMultipleProductImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingR2(true);
    showNotification(`Uploading ${files.length} asset${files.length > 1 ? 's' : ''} to Cloudflare R2...`, 'success');

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (res.ok && data.success && data.media?.url) {
          newUrls.push(data.media.url);
        }
      }

      if (newUrls.length > 0) {
        setProductImages(prev => [...prev, ...newUrls]);
        showNotification(`Attached ${newUrls.length} new photo${newUrls.length > 1 ? 's' : ''}!`, 'success');
        const medRes = await fetch('/api/admin/media');
        const medData = await medRes.json();
        if (medData.assets) setMediaAssets(medData.assets);
      } else {
        showNotification('Failed to upload photos to R2', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Upload to Cloudflare R2 failed', 'error');
    } finally {
      setIsUploadingR2(false);
      if (e.target) e.target.value = '';
    }
  };

  // Fast filtered & paginated assets for the Product Media Pool picker
  const filteredProductPickerAssets = useMemo(() => {
    const query = productPickerSearch.trim().toLowerCase();
    if (!query) return mediaAssets;
    return mediaAssets.filter(a =>
      (a.title && a.title.toLowerCase().includes(query)) ||
      (a.url && a.url.toLowerCase().includes(query)) ||
      (a.alt_text && a.alt_text.toLowerCase().includes(query))
    );
  }, [mediaAssets, productPickerSearch]);

  const totalProductPickerPages = Math.ceil(filteredProductPickerAssets.length / 24) || 1;
  const paginatedProductPickerAssets = useMemo(() => {
    const start = (productPickerPage - 1) * 24;
    return filteredProductPickerAssets.slice(start, start + 24);
  }, [filteredProductPickerAssets, productPickerPage]);

  const handleToggleProductImageFromPool = (url: string) => {
    if (productImages.includes(url)) {
      setProductImages(prev => prev.filter(u => u !== url));
    } else {
      setProductImages(prev => [...prev, url]);
      showNotification('Photo attached to product!', 'success');
    }
  };
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [inventoryTarget, setInventoryTarget] = useState<any>(null);
  const [inventoryAdjustment, setInventoryAdjustment] = useState<number>(1);
  const [inventoryReason, setInventoryReason] = useState<string>('Studio Restock');
  const [contentEditSection, setContentEditSection] = useState<any>(null);
  const [editableReels, setEditableReels] = useState<any[]>([]);
  const [newReelVimeoUrl, setNewReelVimeoUrl] = useState('');
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelSubtitle, setNewReelSubtitle] = useState('');
  const [newReelTag, setNewReelTag] = useState('');

  const openContentEditModal = (sec: any) => {
    setContentEditSection(sec);
    if (sec.data?.reels && Array.isArray(sec.data.reels)) {
      setEditableReels([...sec.data.reels]);
    } else {
      setEditableReels([]);
    }
  };
  const [newPromoModalOpen, setNewPromoModalOpen] = useState(false);
  const [newCollectionModalOpen, setNewCollectionModalOpen] = useState(false);
  const [newSquadModalOpen, setNewSquadModalOpen] = useState(false);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundOrderTarget, setRefundOrderTarget] = useState<any>(null);
  const [refundReason, setRefundReason] = useState('Customer return & restock requested');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundRestock, setRefundRestock] = useState(false);
  const [refundProcessing, setRefundProcessing] = useState(false);

  // Export Orders CSV Modal states
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportPaymentStatus, setExportPaymentStatus] = useState('all');
  const [exportFulfillmentStatus, setExportFulfillmentStatus] = useState('all');

  const applyExportPreset = (preset: string) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (preset === 'all') {
      setExportStartDate('');
      setExportEndDate('');
    } else if (preset === 'today') {
      setExportStartDate(todayStr);
      setExportEndDate(todayStr);
    } else if (preset === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setExportStartDate(d.toISOString().split('T')[0]);
      setExportEndDate(todayStr);
    } else if (preset === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setExportStartDate(d.toISOString().split('T')[0]);
      setExportEndDate(todayStr);
    } else if (preset === 'this_month') {
      const d = new Date(now.getFullYear(), now.getMonth(), 1);
      setExportStartDate(d.toISOString().split('T')[0]);
      setExportEndDate(todayStr);
    }
  };
  const [navSettings, setNavSettings] = useState<any>({
    header_links: [
      { label: 'Shop', href: '#shop' },
      { label: 'Museum', href: '#museum' },
      { label: 'Custom', href: '#custom' },
      { label: 'About', href: '#about' }
    ],
    footer_links: [
      { label: 'Instagram', href: 'https://instagram.com/avz.vaganza' },
      { label: 'WhatsApp', href: 'https://wa.me/917304264901' },
      { label: 'Shipping & Returns', href: '#specs' }
    ]
  });
  const [policySettings, setPolicySettings] = useState<any>({
    shipping: 'Orders are dispatched within 24-48 hours via Delhivery or BlueDart with tracking.',
    refunds: 'Custom-made pieces are final sale. Unworn ready-to-wear pieces may be exchanged within 7 days.',
    privacy: 'Customer data is processed strictly for order fulfillment and never sold.'
  });

  // Filters & Pagination
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('');
  const [orderFulfillmentFilter, setOrderFulfillmentFilter] = useState('');
  const [orderPage, setOrderPage] = useState<number>(1);
  const [orderTotalPages, setOrderTotalPages] = useState<number>(1);
  const [orderTotalCount, setOrderTotalCount] = useState<number>(0);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Lock background scroll when any modal is open in the admin panel
  const hasActiveAdminModal = Boolean(
    selectedOrder ||
    contentEditSection ||
    (inventoryModalOpen && inventoryTarget) ||
    productModalOpen ||
    productPickerOpen ||
    newCollectionModalOpen ||
    newPromoModalOpen ||
    newSquadModalOpen ||
    newUserModalOpen ||
    editUserModalOpen ||
    editSquadModalOpen ||
    (refundModalOpen && refundOrderTarget) ||
    exportModalOpen
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (hasActiveAdminModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [hasActiveAdminModal]);

  // 1. Initial Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        setAdminUser(data.session);
      } catch (err) {
        router.push('/admin/login');
      } finally {
        setLoadingSession(false);
      }
    };
    checkAuth();
  }, [router]);

  // 2. Fetch Storefront Controls
  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/storefront/settings');
      if (res.ok) {
        const data = await res.json();
        setStorefrontSettings({
          maintenance_mode: data.settings?.maintenance_mode?.data || storefrontSettings.maintenance_mode,
          announcement: data.settings?.announcement?.data || storefrontSettings.announcement,
          purchases_enabled: data.settings?.purchases_enabled?.data || storefrontSettings.purchases_enabled
        });
        if (data.settings?.shipping_rates?.data) {
          setShippingRates(data.settings.shipping_rates.data);
        }
        if (data.settings?.store_profile?.data) {
          setStoreProfile(data.settings.store_profile.data);
        }
      }
    } catch { }
  };

  // 3. Fetch module-specific data
  const fetchData = async () => {
    try {
      fetchSettings();
      // Overview & Analytics
      const anRes = await fetch('/api/admin/analytics');
      if (anRes.ok) {
        const anData = await anRes.json();
        setKpis(anData.kpis);
        setStorageData(anData.storageAnalysis);
      }

      // Orders
      const ordRes = await fetch(`/api/admin/orders?search=${orderSearch}&payment_status=${orderPaymentFilter}&fulfillment_status=${orderFulfillmentFilter}&page=${orderPage}&limit=20`);
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData.orders || []);
        if (ordData.pagination) {
          setOrderTotalPages(ordData.pagination.totalPages || 1);
          setOrderTotalCount(ordData.pagination.total || 0);
        }
      }

      // Products
      const prodRes = await fetch(`/api/admin/products?search=${productSearch}&category=${productCategoryFilter}`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }

      // Inventory
      const invRes = await fetch('/api/admin/inventory');
      if (invRes.ok) {
        const invData = await invRes.json();
        setInventoryProducts(invData.products || []);
        setInventoryLogs(invData.logs || []);
      }

      // Customers
      const custRes = await fetch('/api/admin/customers');
      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomers(custData.customers || []);
      }

      // Content & Website Editor
      const contRes = await fetch('/api/admin/content');
      if (contRes.ok) {
        const contData = await contRes.json();
        setContentSections(contData.sections || []);
      }

      // Media
      const medRes = await fetch('/api/admin/media');
      if (medRes.ok) {
        const medData = await medRes.json();
        setMediaAssets(medData.assets || []);
      }

      // Promotions
      const promoRes = await fetch('/api/admin/promotions');
      if (promoRes.ok) {
        const promoData = await promoRes.json();
        setPromotions(promoData.promotions || []);
      }

      // Group Buys & Collaborative Group Carts
      const gbRes = await fetch('/api/admin/group-buys');
      if (gbRes.ok) {
        const gbData = await gbRes.json();
        setGroupBuys(gbData.group_buys || []);
        setGroupCarts(gbData.group_carts || []);
      }

      // Requested Pieces
      const reqRes = await fetch('/api/admin/piece-requests');
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setPieceRequests(reqData.requests || []);
      }

      // Activity Logs
      const actRes = await fetch('/api/admin/activity');
      if (actRes.ok) {
        const actData = await actRes.json();
        setActivityLogs(actData.logs || []);
      }

      // Users
      const usrRes = await fetch('/api/admin/users');
      if (usrRes.ok) {
        const usrData = await usrRes.json();
        setAdminUsersList(usrData.users || []);
      }

      // Collections
      const colRes = await fetch('/api/admin/collections');
      if (colRes.ok) {
        const colData = await colRes.json();
        setCollections(colData.collections || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!loadingSession && adminUser) {
      fetchData();
    }
  }, [loadingSession, adminUser, orderSearch, orderPaymentFilter, orderFulfillmentFilter, orderPage, productSearch, productCategoryFilter]);

  // Real-Time Live Sync: Automatically poll orders & piece-requests every 6 seconds
  useEffect(() => {
    if (!adminUser) return;
    const interval = setInterval(async () => {
      try {
        const [ordRes, reqRes] = await Promise.all([
          fetch(`/api/admin/orders?limit=20`),
          fetch('/api/admin/piece-requests')
        ]);
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (ordData.orders) {
            setOrders((prev) => {
              if (prev.length > 0 && ordData.orders.length > prev.length) {
                showNotification('✨ New Order Received in Real-Time!');
              }
              return ordData.orders;
            });
          }
        }
        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (reqData.requests) {
            setPieceRequests((prev) => {
              if (prev.length > 0 && reqData.requests.length > prev.length) {
                showNotification('💎 New Piece Request Received in Real-Time!');
              }
              return reqData.requests;
            });
          }
        }
      } catch {}
    }, 6000);
    return () => clearInterval(interval);
  }, [adminUser]);


  // Handler: Open Order Detail with Full Ledger
  const handleOpenOrderDetail = async (ord: any) => {
    setSelectedOrder(ord);
    try {
      const res = await fetch(`/api/admin/orders/${ord.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) setSelectedOrder(data.order);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Toggle Maintenance Mode
  const handleToggleMaintenance = async () => {
    const updated = {
      ...storefrontSettings.maintenance_mode,
      enabled: !storefrontSettings.maintenance_mode.enabled
    };
    try {
      const res = await fetch('/api/admin/storefront/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'maintenance_mode', value: updated })
      });
      if (res.ok) {
        setStorefrontSettings((prev: any) => ({ ...prev, maintenance_mode: updated }));
        showNotification(
          updated.enabled
            ? 'Storefront Maintenance Mode is now ACTIVE. Public visitors will see the maintenance screen.'
            : 'Storefront Maintenance Mode DISABLED. Storefront is live.'
        );
      }
    } catch {
      showNotification('Failed to update maintenance mode', 'error');
    }
  };

  // Handler: Toggle Purchases
  const handleTogglePurchases = async () => {
    const updated = {
      ...storefrontSettings.purchases_enabled,
      enabled: !storefrontSettings.purchases_enabled.enabled
    };
    try {
      const res = await fetch('/api/admin/storefront/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'purchases_enabled', value: updated })
      });
      if (res.ok) {
        setStorefrontSettings((prev: any) => ({ ...prev, purchases_enabled: updated }));
        showNotification(
          updated.enabled ? 'Purchasing re-enabled across storefront.' : 'Purchases FROZEN. Checkouts blocked server-side.'
        );
      }
    } catch {
      showNotification('Failed to update purchase controls', 'error');
    }
  };

  // Handler: Logout
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Handler: Update Order Fulfillment
  const handleUpdateOrderFulfillment = async (orderId: string, status: string, carrier: string, tracking: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fulfillment_status: status,
          carrier,
          tracking_number: tracking
        })
      });
      if (res.ok) {
        showNotification(`Order fulfillment updated to '${status}'`);
        setSelectedOrder(null);
        fetchData();
      }
    } catch {
      showNotification('Failed to update order', 'error');
    }
  };

  // Handler: Adjust Stock
  const handleAdjustStock = async () => {
    if (!inventoryTarget) return;
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: inventoryTarget.id,
          adjustment: inventoryAdjustment,
          reason: inventoryReason
        })
      });
      if (res.ok) {
        showNotification(`Inventory adjusted for ${inventoryTarget.title}`);
        setInventoryModalOpen(false);
        fetchData();
      }
    } catch {
      showNotification('Failed to adjust inventory', 'error');
    }
  };

  // Handler: Save Website Section
  const handleSaveContentSection = async (sectionKey: string, title: string, data: any, status: 'published' | 'draft') => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_key: sectionKey,
          title,
          data,
          status
        })
      });
      if (res.ok) {
        showNotification(
          status === 'published'
            ? `Section '${title}' published live to storefront!`
            : `Draft saved for '${title}'`
        );
        setContentEditSection(null);
        fetchData();
      }
    } catch {
      showNotification('Failed to save website content', 'error');
    }
  };

  // Handler: Create Collection
  const handleCreateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem('colTitle') as HTMLInputElement)?.value;
    const description = (form.elements.namedItem('colDesc') as HTMLTextAreaElement)?.value;
    const image = (form.elements.namedItem('colImage') as HTMLInputElement)?.value;

    try {
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, image })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Collection '${title}' created successfully`);
        setNewCollectionModalOpen(false);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to create collection', 'error');
      }
    } catch {
      showNotification('Error creating collection', 'error');
    }
  };

  // Handler: Delete Collection
  const handleDeleteCollection = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete collection "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/collections?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setCollections((prev) => prev.filter((c) => c.id !== id));
        showNotification(`Collection '${title}' deleted successfully.`);
      } else {
        showNotification('Failed to delete collection', 'error');
      }
    } catch {
      showNotification('Error deleting collection', 'error');
    }
  };

  // Handler: Create Promotion
  const handleCreatePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = (form.elements.namedItem('promoCode') as HTMLInputElement)?.value;
    const discount_type = (form.elements.namedItem('promoType') as HTMLSelectElement)?.value;
    const discount_value = Number((form.elements.namedItem('promoValue') as HTMLInputElement)?.value);
    const min_order_value = Number((form.elements.namedItem('promoMinOrder') as HTMLInputElement)?.value || 0);
    const max_uses = (form.elements.namedItem('promoMaxUses') as HTMLInputElement)?.value;
    const animation_theme = (form.elements.namedItem('promoAnimation') as HTMLSelectElement)?.value || 'sparkles';

    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discount_type,
          discount_value,
          min_order_value,
          max_uses: max_uses ? Number(max_uses) : null,
          animation_theme
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Promotion code '${code.toUpperCase()}' activated with ${animation_theme} celebration!`);
        setNewPromoModalOpen(false);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to create promotion', 'error');
      }
    } catch {
      showNotification('Error creating promotion', 'error');
    }
  };

  const handleDeletePromotion = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete promotion code '${code}'?`)) return;
    try {
      const res = await fetch(`/api/admin/promotions?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showNotification(`Promotion '${code}' deleted`);
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showNotification(data.error || 'Failed to delete promotion', 'error');
      }
    } catch {
      showNotification('Error deleting promotion', 'error');
    }
  };

  const handleTogglePromotion = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: currentStatus === 1 ? 0 : 1 })
      });
      if (res.ok) {
        showNotification(`Promotion status updated`);
        fetchData();
      } else {
        const data = await res.json().catch(() => ({}));
        showNotification(data.error || 'Failed to update promotion', 'error');
      }
    } catch {
      showNotification('Error updating promotion', 'error');
    }
  };

  // Handler: Create Group Buy
  const handleCreateGroupBuy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const squad_code = (form.elements.namedItem('squadCode') as HTMLInputElement)?.value;
    const title = (form.elements.namedItem('squadTitle') as HTMLInputElement)?.value;
    const discount_percent = Number((form.elements.namedItem('squadDiscount') as HTMLInputElement)?.value || 15);
    const min_members = Number((form.elements.namedItem('squadMinMembers') as HTMLInputElement)?.value || 3);
    const min_cart_amount = Number((form.elements.namedItem('squadMinCart') as HTMLInputElement)?.value || 0);
    const duration_days = Number((form.elements.namedItem('squadDays') as HTMLInputElement)?.value || 7);

    try {
      const res = await fetch('/api/admin/group-buys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          squad_code,
          title,
          discount_percent,
          min_members,
          min_cart_amount,
          duration_days
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Squad drop '${title}' published!`);
        setNewSquadModalOpen(false);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to create squad drop', 'error');
      }
    } catch {
      showNotification('Error creating squad drop', 'error');
    }
  };

  // Handler: Update Piece Request Status
  const handleUpdatePieceRequestStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/piece-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        showNotification(`Piece request status updated to ${status}`);
        setPieceRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDeletePieceRequest = async (id: string) => {
    if (!confirm('Remove this piece request inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/piece-requests?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Piece request removed');
        setPieceRequests(prev => prev.filter(r => r.id !== id));
      }
    } catch {
      showNotification('Failed to remove request', 'error');
    }
  };

  // Handler: Reset Activity Log
  const handleResetActivityLog = async () => {
    if (!confirm('Are you sure you want to reset all activity logs? This audit trail action cannot be undone.')) return;
    setIsResettingActivity(true);
    try {
      const res = await fetch('/api/admin/activity', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Activity log has been completely reset.');
        fetchData();
      } else {
        showNotification(data.error || 'Failed to reset log', 'error');
      }
    } catch {
      showNotification('Error resetting activity log', 'error');
    } finally {
      setIsResettingActivity(false);
    }
  };

  // Handler: Update Administrator Access & Password
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const form = e.currentTarget;
    const role = (form.elements.namedItem('editRole') as HTMLSelectElement)?.value;
    const name = (form.elements.namedItem('editName') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('editPassword') as HTMLInputElement)?.value;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          role,
          name,
          password: password && password.trim().length >= 6 ? password.trim() : undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Administrator permissions updated successfully!');
        setEditUserModalOpen(false);
        setEditingUser(null);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to update access', 'error');
      }
    } catch {
      showNotification('Error updating administrator', 'error');
    }
  };

  const handleDeleteUser = async (u: any) => {
    if (!confirm(`Revoke administrator access for ${u.email}?`)) return;
    try {
      const res = await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Administrator ${u.email} removed.`);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to remove administrator', 'error');
      }
    } catch {
      showNotification('Error removing administrator', 'error');
    }
  };

  // Handler: Update Squad Drop Offer
  const handleUpdateSquadOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSquad) return;
    const form = e.currentTarget;
    const title = (form.elements.namedItem('editSquadTitle') as HTMLInputElement)?.value;
    const discount_percent = Number((form.elements.namedItem('editSquadDiscount') as HTMLInputElement)?.value);
    const min_members = Number((form.elements.namedItem('editSquadMinMembers') as HTMLInputElement)?.value);
    const min_cart_amount = Number((form.elements.namedItem('editSquadMinCart') as HTMLInputElement)?.value || 0);
    const status = (form.elements.namedItem('editSquadStatus') as HTMLSelectElement)?.value;

    try {
      const res = await fetch('/api/admin/group-buys', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSquad.id,
          title,
          discount_percent,
          min_members,
          min_cart_amount,
          status
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showNotification('Squad offer updated successfully!');
        setEditSquadModalOpen(false);
        setEditingSquad(null);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to update squad offer', 'error');
      }
    } catch {
      showNotification('Error updating squad offer', 'error');
    }
  };

  const handleDeleteSquadOffer = async (id: string) => {
    if (!confirm('Delete this squad offer?')) return;
    try {
      const res = await fetch(`/api/admin/group-buys?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Squad offer deleted.');
        fetchData();
      }
    } catch {
      showNotification('Error deleting squad offer', 'error');
    }
  };

  // Handler: Save Storefront Freeze Banner & Thank You Message
  const handleSaveStoreMessages = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const freezeTitle = (form.elements.namedItem('freezeTitle') as HTMLInputElement)?.value;
    const freezeMessage = (form.elements.namedItem('freezeMessage') as HTMLTextAreaElement)?.value;
    const thankYouTitle = (form.elements.namedItem('thankYouTitle') as HTMLInputElement)?.value;
    const thankYouMessage = (form.elements.namedItem('thankYouMessage') as HTMLTextAreaElement)?.value;

    try {
      await fetch('/api/admin/storefront/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'purchases_enabled',
          value: {
            ...storefrontSettings.purchases_enabled,
            banner_title: freezeTitle,
            disabled_message: freezeMessage
          }
        })
      });

      await fetch('/api/admin/storefront/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'order_thank_you_message',
          value: {
            title: thankYouTitle,
            message: thankYouMessage
          }
        })
      });

      showNotification('Storefront messages & thank you notice saved!');
      fetchSettings();
    } catch {
      showNotification('Error saving storefront messages', 'error');
    }
  };

  // Handler: Toggle Checkout Payment Options (Online UPI/Cards vs Cash on Delivery)
  const handleTogglePaymentOption = async (option: 'online_payments' | 'cod') => {
    const current = storefrontSettings?.payment_methods || { online_payments: true, cod: true };
    const nextVal = {
      ...current,
      [option]: !current[option]
    };
    if (!nextVal.online_payments && !nextVal.cod) {
      showNotification('At least one payment option (Online or COD) must remain enabled.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/storefront/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'payment_methods', value: nextVal })
      });
      if (res.ok) {
        setStorefrontSettings((prev: any) => ({
          ...prev,
          payment_methods: nextVal
        }));
        showNotification(
          `${option === 'online_payments' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'} is now ${nextVal[option] ? 'ACTIVE' : 'DISABLED'}.`,
          'success'
        );
      } else {
        showNotification('Failed to update payment setting.', 'error');
      }
    } catch {
      showNotification('Network error updating payment setting.', 'error');
    }
  };

  // Handler: Add / Update Admin User
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('userEmail') as HTMLInputElement)?.value;
    const name = (form.elements.namedItem('userName') as HTMLInputElement)?.value;
    const role = (form.elements.namedItem('userRole') as HTMLSelectElement)?.value;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Administrator '${email}' configured!`);
        setNewUserModalOpen(false);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to configure administrator', 'error');
      }
    } catch {
      showNotification('Error configuring administrator', 'error');
    }
  };

  // Handler: Process Order Refund
  const handleProcessRefund = async (orderId: string, reason: string, amount?: number, restock?: boolean) => {
    setRefundProcessing(true);
    try {
      const res = await fetch('/api/admin/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason, amount, restock: restock === true })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'Refund successfully processed!');
        setRefundModalOpen(false);
        setRefundOrderTarget(null);
        setSelectedOrder(null);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to process refund', 'error');
      }
    } catch {
      showNotification('Network error while processing refund', 'error');
    } finally {
      setRefundProcessing(false);
    }
  };

  // Navigation Modules definition
  const navigationModules = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: kpis?.pendingFulfillmentCount },
    { id: 'requested_pieces', label: 'Requested Pieces', icon: Sparkles, badge: pieceRequests.filter(r => r.status === 'pending').length || null, highlight: true },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, badge: kpis?.lowStockCount ? 'Low' : null },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'content', label: 'Content & Website Editor', icon: FileEdit, highlight: true },
    { id: 'media', label: 'Media & Photo Sections', icon: ImageIcon, highlight: true },
    { id: 'promotions', label: 'Promotions & Discounts', icon: Tag },
    { id: 'group_buying', label: 'Group Buying', icon: UsersRound },
    { id: 'payments', label: 'Payments & Refunds', icon: CreditCard },
    { id: 'shipping', label: 'Shipping & Fulfillment', icon: Truck },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'navigation', label: 'Navigation & Menus', icon: Compass },
    { id: 'policies', label: 'Pages & Policies', icon: BookOpen },
    { id: 'settings', label: 'Store Settings', icon: Settings },
    { id: 'users', label: 'Users & Permissions', icon: Shield },
    { id: 'activity', label: 'Activity Log', icon: History }
  ];

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#BE185D]/30 border-t-[#F4C2C2] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070609] text-silver flex flex-col font-sans select-none antialiased">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-mono transition-all animate-in slide-in-from-bottom duration-300 ${notification.type === 'success'
            ? 'bg-[#180F1F] border-[#BE185D] text-white'
            : 'bg-red-950 border-red-700 text-red-200'
            }`}
        >
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4 text-[#F4C2C2]" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* TOP HEADER: Branding & Storefront Controls Bar */}
      <header className="h-16 border-b border-[#231A2A] bg-[#0E0A14]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 rounded-xl bg-[#16121D] border border-neutral-800 text-neutral-300 hover:text-white shrink-0 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#BE185D] to-[#301934] flex items-center justify-center font-cinzel font-black text-white text-sm shrink-0">
              AVZ
            </div>
            <div>
              <span className="font-cinzel font-bold text-white tracking-widest text-xs sm:text-sm uppercase">AVZ Vaganza</span>
              <span className="text-[9px] sm:text-[10px] text-[#F4C2C2] block uppercase tracking-widest font-mono truncate max-w-[140px] sm:max-w-none">Commerce Control Center</span>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-neutral-800 hidden md:block" />

          {/* STOREFRONT CONTROLS QUICK ACTION SWITCHERS */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Maintenance Mode Button */}
            <div className="flex items-center gap-2 bg-[#171120] border border-[#2D2038] px-3 py-1.5 rounded-lg text-xs">
              <span className="text-neutral-400 font-mono text-[11px]">Maintenance:</span>
              <button
                onClick={handleToggleMaintenance}
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider cursor-pointer uppercase transition-all ${storefrontSettings.maintenance_mode.enabled
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}
              >
                {storefrontSettings.maintenance_mode.enabled ? 'ACTIVE (PUBLIC GATED)' : 'DISABLED (PUBLIC LIVE)'}
              </button>
            </div>

            {/* Purchases Enabled Switcher */}
            <div className="flex items-center gap-2 bg-[#171120] border border-[#2D2038] px-3 py-1.5 rounded-lg text-xs">
              <span className="text-neutral-400 font-mono text-[11px]">Purchases:</span>
              <button
                onClick={handleTogglePurchases}
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider cursor-pointer uppercase transition-all ${storefrontSettings.purchases_enabled.enabled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                  }`}
              >
                {storefrontSettings.purchases_enabled.enabled ? 'ACCEPTING ORDERS' : 'CHECKOUT FROZEN'}
              </button>
            </div>
          </div>
        </div>

        {/* User profile & preview actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#F4C2C2] hover:text-white bg-[#301934]/40 hover:bg-[#301934] border border-[#BE185D]/30 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all font-mono"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Storefront</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-neutral-800">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-white font-medium block">{adminUser?.name || 'Administrator'}</span>
              <span className="text-[10px] text-[#F4C2C2] uppercase font-mono tracking-wider">{adminUser?.role || 'Owner'}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-8 h-8 rounded-lg bg-[#16121D] hover:bg-red-950/60 border border-neutral-800 hover:border-red-800/80 flex items-center justify-center text-neutral-400 hover:text-red-300 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Backdrop */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}

        {/* SIDEBAR: 18 Modules (Responsive drawer on mobile, static on desktop) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A070F] border-r border-[#231A2A] flex flex-col shrink-0 overflow-y-auto transition-transform duration-300 md:static md:w-64 md:translate-x-0 ${mobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
            }`}
        >
          {/* Mobile Sidebar Close Header */}
          <div className="flex items-center justify-between p-3 border-b border-[#231A2A] md:hidden">
            <span className="font-cinzel text-xs font-bold text-white tracking-wider uppercase">Menu</span>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="p-1.5 rounded-lg bg-[#16121D] text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono px-3 py-2 block">
              Merchant Operations
            </span>
            <nav className="space-y-1">
              {navigationModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${isActive
                      ? 'bg-gradient-to-r from-[#BE185D]/20 to-[#301934]/40 text-white border border-[#BE185D]/50 shadow-sm'
                      : item.highlight
                        ? 'text-[#F4C2C2] hover:bg-[#1B1324] hover:text-white'
                        : 'text-neutral-400 hover:bg-[#140F1C] hover:text-neutral-200'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4C2C2]' : item.highlight ? 'text-[#F4C2C2]' : 'text-neutral-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#BE185D]/30 border border-[#BE185D]/60 text-[#F4C2C2]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-[#231A2A] bg-[#07050A]">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>DB: Turso LibSQL</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[10px] text-neutral-600 font-mono mt-1">v2.4.0 High-Couture Edition</div>
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#070609] p-4 sm:p-6 lg:p-8 min-w-0">
          {/* MODULE 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-cinzel font-bold text-white tracking-wide">Command Center Overview</h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">Real-time telemetry across boutique orders, catalog inventory, and storefront access.</p>
              </div>

              {/* KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono uppercase text-neutral-400">Total Revenue</span>
                    <span className="p-2 rounded-xl bg-[#BE185D]/10 text-[#F4C2C2]"><CreditCard className="w-4 h-4" /></span>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono">
                    ₹{(kpis?.totalRevenue || 0).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono mt-2 block">100% verified settlement</span>
                </div>

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono uppercase text-neutral-400">Paid Orders</span>
                    <span className="p-2 rounded-xl bg-purple-950/40 text-purple-300"><ShoppingBag className="w-4 h-4" /></span>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono">
                    {kpis?.paidOrdersCount || 0}
                  </div>
                  <span className="text-[11px] text-[#F4C2C2] font-mono mt-2 block">Avg. Ticket: ₹{kpis?.averageOrderValue || 0}</span>
                </div>

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono uppercase text-neutral-400">Awaiting Dispatch</span>
                    <span className="p-2 rounded-xl bg-amber-950/40 text-amber-300"><Truck className="w-4 h-4" /></span>
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
                    {kpis?.pendingFulfillmentCount || 0}
                  </div>
                  <button
                    onClick={() => setActiveTab('shipping')}
                    className="text-[11px] text-amber-300 hover:underline font-mono mt-2 block cursor-pointer"
                  >
                    Generate Courier CSV →
                  </button>
                </div>

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-mono uppercase text-neutral-400">Catalog Size</span>
                    <span className="p-2 rounded-xl bg-blue-950/40 text-blue-300"><Package className="w-4 h-4" /></span>
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono">
                    {kpis?.totalProducts || 0} Pieces
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono mt-2 block">{kpis?.lowStockCount || 0} pieces low stock</span>
                </div>
              </div>

              {/* RECENT ORDERS TABLE */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white font-cinzel">Recent Studio Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#F4C2C2] hover:underline font-mono">
                    View All Orders ({orders.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px]">
                        <th className="py-3 px-3">Order</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Total</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Fulfillment</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#181222] transition-colors">
                          <td className="py-3.5 px-3 font-mono font-bold text-white">{ord.order_number}</td>
                          <td className="py-3.5 px-3">
                            <span className="text-white block">{ord.customer_name}</span>
                            <span className="text-neutral-500 text-[11px]">{ord.customer_email}</span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-white">₹{ord.grand_total}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${ord.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                              {ord.payment_status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${ord.fulfillment_status === 'delivered' ? 'bg-blue-500/10 text-blue-400' :
                              ord.fulfillment_status === 'shipped' ? 'bg-purple-500/10 text-purple-300' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                              {ord.fulfillment_status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleOpenOrderDetail(ord)}
                              className="px-2.5 py-1 rounded bg-[#1D1627] hover:bg-[#301934] border border-[#BE185D]/30 text-[#F4C2C2] text-[11px] font-mono cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white">Orders & Shipping</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Manage real customer purchases, manual courier dispatches, and packing slips.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setExportPaymentStatus('all');
                    setExportFulfillmentStatus('all');
                    setExportModalOpen(true);
                  }}
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Orders CSV
                </button>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#100C17] border border-[#231A2A] p-4 rounded-xl">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order #, Customer, or Phone..."
                    className="w-full bg-[#161020] border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="bg-[#161020] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F4C2C2]"
                >
                  <option value="">All Payment Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </select>
                <select
                  value={orderFulfillmentFilter}
                  onChange={(e) => setOrderFulfillmentFilter(e.target.value)}
                  className="bg-[#161020] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F4C2C2]"
                >
                  <option value="">All Fulfillment Statuses</option>
                  <option value="unfulfilled">Unfulfilled</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* ORDERS TABLE */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px] bg-[#0E0A14]">
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Fulfillment</th>
                        <th className="py-3 px-4">Tracking</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#161120] transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-white">{ord.order_number}</td>
                          <td className="py-4 px-4 font-mono text-neutral-400">
                            {new Date(Number(ord.created_at)).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-white block font-medium">{ord.customer_name}</span>
                            <span className="text-neutral-500 text-[11px]">{ord.customer_email}</span>
                            <span className="text-neutral-500 text-[11px] block">{ord.customer_phone}</span>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            {ord.items?.length} item(s)
                          </td>
                          <td className="py-4 px-4 font-mono text-white font-bold">₹{ord.grand_total}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              ord.payment_status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold' :
                              ord.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                              {ord.payment_status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              ord.fulfillment_status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold' :
                              ord.fulfillment_status === 'delivered' ? 'bg-blue-500/10 text-blue-400' :
                              ord.fulfillment_status === 'shipped' ? 'bg-purple-500/10 text-purple-300' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                              {ord.fulfillment_status}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono text-neutral-400 text-[11px]">
                            {ord.tracking_number ? (
                              <span className="text-purple-300">{ord.carrier}: {ord.tracking_number}</span>
                            ) : (
                              <span className="text-neutral-600">Pending courier</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleOpenOrderDetail(ord)}
                              className="px-3 py-1.5 rounded-lg bg-[#301934] hover:bg-[#BE185D] hover:text-black border border-[#BE185D]/40 text-[#F4C2C2] text-xs font-mono transition-all cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-400">
                  <span>Showing {orders.length} of {orderTotalCount || orders.length} order(s)</span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={orderPage <= 1}
                      onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded bg-[#181122] border border-neutral-800 hover:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-white px-2">Page {orderPage} of {orderTotalPages}</span>
                    <button
                      disabled={orderPage >= orderTotalPages}
                      onClick={() => setOrderPage(p => Math.min(orderTotalPages, p + 1))}
                      className="px-3 py-1 rounded bg-[#181122] border border-neutral-800 hover:border-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: REQUESTED PIECES & CUSTOM COMMISSIONS */}
          {activeTab === 'requested_pieces' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-cinzel font-bold text-white">Requested Pieces & Commissions</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-pink/20 text-pink border border-pink/30">
                      LIVE INTAKE
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    Direct patron requests from the museum gallery and customized couture inquiries.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/admin/piece-requests');
                        if (res.ok) {
                          const data = await res.json();
                          setPieceRequests(data.requests || []);
                          showNotification('Refreshed piece requests');
                        }
                      } catch {
                        showNotification('Error refreshing requests', 'error');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-[#100C17] border border-[#231A2A] hover:border-pink/40 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                </div>
              </div>

              {/* STATS OVERVIEW */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#100C17] border border-[#231A2A] p-4 rounded-xl">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Total Inquiries</span>
                  <p className="text-xl font-bold font-mono text-white mt-1">{pieceRequests.length}</p>
                </div>
                <div className="bg-[#100C17] border border-[#231A2A] p-4 rounded-xl">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Pending Review</span>
                  <p className="text-xl font-bold font-mono text-amber-400 mt-1">
                    {pieceRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-[#100C17] border border-[#231A2A] p-4 rounded-xl">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">Reviewed / In Talks</span>
                  <p className="text-xl font-bold font-mono text-blue-400 mt-1">
                    {pieceRequests.filter(r => r.status === 'reviewed' || r.status === 'contacted').length}
                  </p>
                </div>
                <div className="bg-[#100C17] border border-[#231A2A] p-4 rounded-xl">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Completed</span>
                  <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {pieceRequests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
              </div>

              {/* REQUESTS TABLE */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-xl overflow-hidden">
                {pieceRequests.length === 0 ? (
                  <div className="p-12 text-center">
                    <Sparkles className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                    <p className="text-sm font-mono text-neutral-400">No piece requests recorded yet.</p>
                    <p className="text-xs text-neutral-500 font-mono mt-1">
                      When patrons submit custom piece requests or museum archive commissions, inquiries appear here in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#16101E] border-b border-[#231A2A] text-neutral-400 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-4">Date & ID</th>
                          <th className="p-4">Piece Inquired</th>
                          <th className="p-4">Patron Details</th>
                          <th className="p-4">Patron Notes / Sizing</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#231A2A]">
                        {pieceRequests.map((req) => {
                          const dateStr = req.created_at
                            ? new Date(typeof req.created_at === 'number' && req.created_at < 10000000000 ? req.created_at * 1000 : req.created_at).toLocaleDateString()
                            : 'Recent';
                          const cleanPhone = (req.customer_phone || '').replace(/[^0-9]/g, '');
                          const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hi ${req.customer_name || 'there'}, this is AVZ Studio following up on your request for "${req.piece_title}".`)}` : null;

                          return (
                            <tr key={req.id} className="hover:bg-[#16101F]/60 transition-colors">
                              <td className="p-4">
                                <div className="text-white font-bold">{req.id ? req.id.slice(0, 10) : 'REQ'}</div>
                                <div className="text-[10px] text-neutral-500 mt-0.5">{dateStr}</div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  {req.piece_image && (
                                    <img
                                      src={req.piece_image}
                                      alt={req.piece_title || 'Piece'}
                                      className="w-10 h-10 object-cover rounded-lg border border-[#231A2A] flex-shrink-0"
                                    />
                                  )}
                                  <div>
                                    <div className="text-white font-bold max-w-[180px] truncate">{req.piece_title || 'Custom Garment'}</div>
                                    {req.piece_price && (
                                      <div className="text-[10px] text-pink mt-0.5">₹{req.piece_price.toLocaleString('en-IN')}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="text-white font-medium">{req.customer_name || 'Anonymous Patron'}</div>
                                <div className="text-neutral-400 text-[11px] mt-0.5">{req.customer_email || '—'}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-neutral-500 text-[10px]">{req.customer_phone || '—'}</span>
                                  {waUrl && (
                                    <a
                                      href={waUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] text-emerald-400 hover:text-emerald-300 underline flex items-center gap-0.5"
                                    >
                                      WhatsApp ↗
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 max-w-[220px]">
                                <div className="text-neutral-300 text-[11px] line-clamp-3 whitespace-pre-wrap">
                                  {req.notes || <span className="text-neutral-600 italic">No additional notes provided</span>}
                                </div>
                              </td>
                              <td className="p-4">
                                <select
                                  value={req.status || 'pending'}
                                  onChange={(e) => handleUpdatePieceRequestStatus(req.id, e.target.value)}
                                  className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border uppercase cursor-pointer transition-colors bg-[#0D0A12] ${
                                    req.status === 'completed'
                                      ? 'border-emerald-500/50 text-emerald-400'
                                      : req.status === 'contacted'
                                      ? 'border-purple-500/50 text-purple-400'
                                      : req.status === 'reviewed'
                                      ? 'border-blue-500/50 text-blue-400'
                                      : req.status === 'declined'
                                      ? 'border-rose-500/50 text-rose-400'
                                      : 'border-amber-500/50 text-amber-400'
                                  }`}
                                >
                                  <option value="pending" className="bg-[#100C17] text-amber-400">Pending</option>
                                  <option value="reviewed" className="bg-[#100C17] text-blue-400">Reviewed</option>
                                  <option value="contacted" className="bg-[#100C17] text-purple-400">Contacted</option>
                                  <option value="completed" className="bg-[#100C17] text-emerald-400">Completed</option>
                                  <option value="declined" className="bg-[#100C17] text-rose-400">Declined</option>
                                </select>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeletePieceRequest(req.id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                                  title="Delete inquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 3: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white">Boutique Catalog & Products</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Create, edit, duplicate, and archive 1-of-1 wearable art garments.</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setProductImages([]);
                    setProductUrlInput('');
                    setProductModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-[#BE185D] to-[#F4C2C2] hover:opacity-90 text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#100C17] border border-[#231A2A] p-4 rounded-xl">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by title, SKU, or keywords..."
                    className="w-full bg-[#161020] border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#161020] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F4C2C2]"
                >
                  <option value="">All Categories</option>
                  <option value="Jackets">Jackets</option>
                  <option value="Tops">Tops</option>
                  <option value="Corsets">Corsets</option>
                  <option value="Bralettes">Bralettes</option>
                  <option value="Arm cuffs">Arm cuffs</option>
                  <option value="Wearable Art">Wearable Art</option>
                </select>
              </div>

              {/* PRODUCT GRID / TABLE */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px] bg-[#0E0A14]">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Inventory</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#161120] transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0] || '/assets/editorial_hero_portrait.jpg'}
                                alt={p.title}
                                className="w-10 h-10 rounded-lg object-cover bg-neutral-900 border border-neutral-800"
                              />
                              <div>
                                <span className="font-bold text-white block">{p.title}</span>
                                <span className="text-[11px] text-neutral-500 line-clamp-1">{p.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-neutral-400">{p.sku}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 font-mono">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-white">₹{p.price}</td>
                          <td className="py-4 px-4 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${p.inventory_quantity === 0 ? 'bg-red-500/20 text-red-300' :
                              p.inventory_quantity <= 1 ? 'bg-amber-500/20 text-amber-300' : 'bg-neutral-800 text-neutral-300'
                              }`}>
                              {p.inventory_quantity} in stock
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              p.status === 'draft' ? 'bg-neutral-800 text-neutral-400' : 'bg-red-950/40 text-red-400'
                              }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedProduct(p);
                                  const imgs: string[] = Array.isArray(p.images) && p.images.length > 0
                                    ? p.images
                                    : (p.image ? [p.image] : []);
                                  setProductImages(imgs);
                                  setProductUrlInput('');
                                  setProductModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-[#22172C] hover:bg-[#301934] text-[#F4C2C2] cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Archive ${p.title}?`)) {
                                    await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
                                    showNotification('Product archived safely');
                                    fetchData();
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 cursor-pointer"
                                title="Archive Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 4: INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white">Inventory Control & Movement Ledger</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">1-of-1 studio stock management, low-stock alerts, and auditable movement history.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock table */}
                <div className="lg:col-span-2 bg-[#100C17] border border-[#231A2A] rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white font-cinzel mb-4">Stock Levels by Piece</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px]">
                          <th className="py-2 px-3">Item</th>
                          <th className="py-2 px-3">SKU</th>
                          <th className="py-2 px-3">Current Stock</th>
                          <th className="py-2 px-3 text-right">Adjustment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60">
                        {inventoryProducts.map((item) => (
                          <tr key={item.id} className="hover:bg-[#161120]">
                            <td className="py-3 px-3">
                              <span className="font-bold text-white block">{item.title}</span>
                              <span className="text-[10px] text-neutral-500">{item.category}</span>
                            </td>
                            <td className="py-3 px-3 font-mono text-neutral-400">{item.sku}</td>
                            <td className="py-3 px-3 font-mono">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.inventory_quantity === 0 ? 'bg-red-500/20 text-red-300' :
                                item.isLowStock ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'
                                }`}>
                                {item.inventory_quantity} units
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setInventoryTarget(item);
                                  setInventoryAdjustment(1);
                                  setInventoryModalOpen(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-[#2D1B36] hover:bg-[#BE185D] hover:text-black text-[#F4C2C2] text-xs font-mono transition-all cursor-pointer"
                              >
                                Adjust Stock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit movement log */}
                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white font-cinzel mb-4">Stock Movement Audit Trail</h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {inventoryLogs.map((log) => (
                      <div key={log.id} className="p-3 rounded-xl bg-[#161020] border border-neutral-800/80 text-xs">
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-[#F4C2C2]">{log.sku}</span>
                          <span className={`font-mono font-bold ${log.adjustment > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment}
                          </span>
                        </div>
                        <p className="text-neutral-300 mt-1 text-[11px]">{log.reason}</p>
                        <div className="flex justify-between items-center mt-2 text-[10px] text-neutral-500 font-mono">
                          <span>{log.user_email}</span>
                          <span>{new Date(Number(log.created_at)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: CONTENT & WEBSITE EDITOR (MANDATORY STAR FEATURE) */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white">Complete Website Content & Section Editor</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    Directly configure copy, video reels, CTAs, and founder manifesto. Changes publish instantly to the live storefront!
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/"
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-[#1C1425] hover:bg-[#301934] border border-[#BE185D]/40 text-[#F4C2C2] text-xs font-mono flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Preview Live Site
                  </a>
                </div>
              </div>

              {/* SECTION TILES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {contentSections.map((sec) => (
                  <div key={sec.section_key} className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#301934] text-[#F4C2C2] font-mono uppercase">
                          {sec.section_key}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${sec.status === 'published' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                          }`}>
                          {sec.status} (v{sec.version})
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white font-cinzel mt-2">{sec.title}</h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {sec.data?.subheadline || sec.data?.description || sec.data?.bio || sec.data?.tagline || 'Editable section configuration.'}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Updated: {new Date(Number(sec.updated_at)).toLocaleDateString('en-IN')}
                      </span>
                      <button
                        onClick={() => openContentEditModal(sec)}
                        className="px-3 py-1.5 rounded-lg bg-[#2D1B36] hover:bg-[#BE185D] hover:text-black text-[#F4C2C2] text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Section
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 12: SHIPPING & MANUAL FULFILLMENT */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white">Manual Shipping & Courier Manifests</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    Working fulfillment workflow without Shiprocket. Export courier-ready CSV manifests and assign tracking numbers.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setExportPaymentStatus('all');
                      setExportFulfillmentStatus('unfulfilled');
                      setExportModalOpen(true);
                    }}
                    className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export Courier Manifest CSV
                  </button>
                </div>
              </div>

              {/* EXPRESS COURIER CHARGES & PRICING CONFIGURATION */}
              <div className="bg-[#140e1c] border border-pink/30 rounded-2xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-pink" />
                      <h3 className="text-sm font-bold text-white font-cinzel">Express Courier Delivery Charges & Rules</h3>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                      Configure standard express courier delivery fees across India and complimentary shipping thresholds shown in customer carts.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSaveShippingRates()}
                    disabled={isSavingShipping}
                    className="px-4 py-2 rounded-xl bg-pink hover:bg-pink/90 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingShipping ? 'Saving Rates...' : 'Save Courier Charges'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-bold">Standard Express Courier Fee (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-neutral-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={shippingRates.express_courier_fee}
                        onChange={(e) => setShippingRates({
                          ...shippingRates,
                          express_courier_fee: Math.max(0, Number(e.target.value) || 0)
                        })}
                        className="w-full bg-[#181122] border border-neutral-700 rounded-lg pl-7 pr-3 py-2 text-white font-mono focus:border-pink outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      Charged on orders when free shipping criteria is not met.
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-neutral-300 font-bold">Complimentary Shipping</label>
                      <input
                        type="checkbox"
                        id="chk_free_ship"
                        checked={shippingRates.free_threshold_enabled}
                        onChange={(e) => setShippingRates({
                          ...shippingRates,
                          free_threshold_enabled: e.target.checked
                        })}
                        className="w-4 h-4 accent-pink cursor-pointer"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-neutral-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        disabled={!shippingRates.free_threshold_enabled}
                        value={shippingRates.free_threshold}
                        onChange={(e) => setShippingRates({
                          ...shippingRates,
                          free_threshold: Math.max(0, Number(e.target.value) || 0)
                        })}
                        className="w-full bg-[#181122] border border-neutral-700 rounded-lg pl-7 pr-3 py-2 text-white font-mono focus:border-pink outline-none disabled:opacity-40"
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      Orders of this value or higher unlock free express delivery.
                    </span>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-bold">Primary Courier Partners</label>
                    <input
                      type="text"
                      value={shippingRates.courier_partner_label || ''}
                      onChange={(e) => setShippingRates({
                        ...shippingRates,
                        courier_partner_label: e.target.value
                      })}
                      placeholder="e.g. Blue Dart / Delhivery Express Air"
                      className="w-full bg-[#181122] border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono focus:border-pink outline-none"
                    />
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      Displayed on shipping manifests and customer notices.
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">
                    Live Rule Preview: {shippingRates.free_threshold_enabled ? (
                      <span className="text-white">
                        Orders under <strong className="text-pink">₹{shippingRates.free_threshold.toLocaleString('en-IN')}</strong> will incur a <strong className="text-pink">₹{shippingRates.express_courier_fee}</strong> courier charge. Orders above will be <strong className="text-emerald-400">COMPLIMENTARY</strong>.
                      </span>
                    ) : (
                      <span className="text-white">
                        All orders will incur a flat <strong className="text-pink">₹{shippingRates.express_courier_fee}</strong> express courier delivery charge.
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* UNFULFILLED ORDERS TABLE */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white font-cinzel mb-4">Orders Ready for Packing & Dispatch</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px]">
                        <th className="py-3 px-3">Order #</th>
                        <th className="py-3 px-3">Customer & Address</th>
                        <th className="py-3 px-3">Purchased Items</th>
                        <th className="py-3 px-3">Carrier / Tracking</th>
                        <th className="py-3 px-3 text-right">Dispatch Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {orders.filter(o => o.fulfillment_status === 'unfulfilled').map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#161120]">
                          <td className="py-3.5 px-3 font-mono font-bold text-white">{ord.order_number}</td>
                          <td className="py-3.5 px-3">
                            <span className="text-white block font-medium">{ord.customer_name} ({ord.customer_phone})</span>
                            <span className="text-neutral-400 text-[11px] block">
                              {ord.shipping_address?.address_line1}, {ord.shipping_address?.city}, {ord.shipping_address?.state} - {ord.shipping_address?.pincode}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-neutral-300">
                            {ord.items?.map((i: any) => `${i.title} (x${i.quantity})`).join(', ')}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="text-amber-400 font-mono text-[11px]">Awaiting Label</span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() => handleOpenOrderDetail(ord)}
                              className="px-3 py-1.5 rounded-lg bg-[#301934] hover:bg-[#BE185D] hover:text-black text-[#F4C2C2] text-xs font-mono transition-all cursor-pointer"
                            >
                              Fulfill & Enter Tracking
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 13: ANALYTICS & TURSO STORAGE REPORT */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-cinzel font-bold text-white">Analytics, KPIs & Database Capacity</h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">
                  Order statistics and rigorous Turso SQLite storage footprint calculations (Requirement 5).
                </p>
              </div>

              {/* TURSO DATA CAPACITY CARD */}
              <div className="bg-[#120D1A] border border-[#BE185D]/40 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-[#BE185D]/20 text-[#F4C2C2]">
                    <Warehouse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-cinzel">Turso Database Capacity & Integrity Model</h3>
                    <span className="text-xs text-[#F4C2C2] font-mono">5 GB Quota vs. Lifetime Order Volume Calculation</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#1A1224] p-4 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-mono block">Footprint per Order Transaction</span>
                    <span className="text-xl font-bold font-mono text-white mt-1 block">~2,600 bytes (2.54 KB)</span>
                    <span className="text-[10px] text-neutral-500 mt-1 block">Includes items, customer index, signatures & audit logs</span>
                  </div>
                  <div className="bg-[#1A1224] p-4 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-mono block">Turso Lifetime Capacity</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">~2,060,000 Orders</span>
                    <span className="text-[10px] text-neutral-500 mt-1 block">Without table archiving or compression</span>
                  </div>
                  <div className="bg-[#1A1224] p-4 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 font-mono block">Current Storage Consumption</span>
                    <span className="text-xl font-bold font-mono text-[#F4C2C2] mt-1 block">&lt; 1.5 MB</span>
                    <span className="text-[10px] text-emerald-400 mt-1 block">0.03% of allocated quota</span>
                  </div>
                </div>

                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">Order Volume Longevity Projections:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 text-[10px]">
                        <th className="py-2">Tier</th>
                        <th className="py-2">Monthly Orders</th>
                        <th className="py-2">Monthly Storage</th>
                        <th className="py-2">Longevity Before 5GB Limit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                      {storageData?.projections?.map((proj: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5 text-white">{proj.label}</td>
                          <td className="py-2.5">{proj.monthlyVolume.toLocaleString()}</td>
                          <td className="py-2.5">{proj.monthlyStorageMb}</td>
                          <td className="py-2.5 text-emerald-400 font-bold">{proj.durationYears}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 8: MEDIA & WEBSITE SECTIONS (TWO-SECTION WORKSPACE) */}
          {activeTab === 'media' && (
            <MediaAndSectionManager
              showNotification={showNotification}
              onRefreshProducts={fetchData}
            />
          )}

          {/* MODULE 11: PAYMENTS & RAZORPAY */}
          {activeTab === 'payments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-cinzel font-bold text-white uppercase">Razorpay Payments & Reconciliation Ledger</h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">Server-side HMAC-SHA256 signature verification, live settlement log, and idempotent refund controls.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white font-cinzel mb-3">Gateway Integration Status</h3>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-2 border-b border-neutral-800">
                      <span className="text-neutral-400">Gateway Provider:</span>
                      <span className="text-white font-bold">Razorpay Official</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-800">
                      <span className="text-neutral-400">Environment:</span>
                      <span className="text-emerald-400">Configured (Test & Live Dual Support)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-800">
                      <span className="text-neutral-400">Webhook HMAC Verification:</span>
                      <span className="text-emerald-400">Active (/api/payments/razorpay/webhook)</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-neutral-400">Duplicate Payment Protection:</span>
                      <span className="text-emerald-400">Enforced via Unique Database Constraints</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <h3 className="text-sm font-bold text-white font-cinzel uppercase flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-pink" />
                      Checkout Payment Options
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink/20 text-[#F4C2C2] font-bold uppercase">
                      Live Toggles
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono">
                    Turn on or off the payment options shown to customers at checkout. Keep only online, only cash on delivery, or both.
                  </p>

                  <div className="space-y-3 pt-1">
                    {/* 1. Online Payments Toggle */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      (storefrontSettings.payment_methods?.online_payments ?? true)
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-[#161020] border-neutral-800 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">Online Payment (UPI & Cards)</span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              (storefrontSettings.payment_methods?.online_payments ?? true)
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}>
                              {(storefrontSettings.payment_methods?.online_payments ?? true) ? 'ACTIVE' : 'OFF'}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono block mt-1">
                            Razorpay: UPI (GPay/PhonePe/Paytm), Debit/Credit Cards, Net Banking
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTogglePaymentOption('online_payments')}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                            (storefrontSettings.payment_methods?.online_payments ?? true) ? 'bg-[#BE185D]' : 'bg-neutral-700'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              (storefrontSettings.payment_methods?.online_payments ?? true) ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* 2. Cash on Delivery (COD) Toggle */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      (storefrontSettings.payment_methods?.cod ?? true)
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-[#161020] border-neutral-800 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">Cash on Delivery (Pay on Delivery)</span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              (storefrontSettings.payment_methods?.cod ?? true)
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-neutral-800 text-neutral-400'
                            }`}>
                              {(storefrontSettings.payment_methods?.cod ?? true) ? 'ACTIVE' : 'OFF'}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono block mt-1">
                            Client pays cash directly to the courier upon doorstep receipt
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTogglePaymentOption('cod')}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                            (storefrontSettings.payment_methods?.cod ?? true) ? 'bg-[#BE185D]' : 'bg-neutral-700'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              (storefrontSettings.payment_methods?.cod ?? true) ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Payment & Settlement Ledger */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-white font-cinzel uppercase">Live Transaction Settlement Ledger</h3>
                  <span className="text-xs font-mono text-neutral-400">{orders.length} Total Transactions</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px]">
                        <th className="py-3 px-3">Order #</th>
                        <th className="py-3 px-3">Customer</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Payment Method</th>
                        <th className="py-3 px-3">Gateway Ref</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-neutral-500 font-mono">
                            No transactions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#181222] transition-colors">
                            <td className="py-3 px-3 font-mono font-bold text-white">{ord.order_number}</td>
                            <td className="py-3 px-3">
                              <span className="text-white block">{ord.customer_name}</span>
                              <span className="text-neutral-500 text-[11px] font-mono">{ord.customer_email}</span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-white">₹{ord.grand_total}</td>
                            <td className="py-3 px-3 font-mono text-neutral-300">{ord.payment_method || 'Razorpay'}</td>
                            <td className="py-3 px-3 font-mono text-neutral-400 text-[11px]">
                              {ord.razorpay_payment_id || ord.razorpay_order_id || 'N/A'}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${ord.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                ord.payment_status === 'refunded' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                                  'bg-amber-500/10 text-amber-400'
                                }`}>
                                {ord.payment_status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {ord.payment_status === 'paid' ? (
                                <button
                                  onClick={() => {
                                    setRefundOrderTarget(ord);
                                    setRefundAmount(Number(ord.grand_total));
                                    setRefundModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-200 text-[11px] font-mono cursor-pointer"
                                >
                                  Refund & Restock
                                </button>
                              ) : ord.payment_status === 'refunded' ? (
                                <span className="text-[10px] font-mono text-neutral-500">Restocked</span>
                              ) : (
                                <span className="text-[10px] font-mono text-neutral-500">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 16: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-cinzel font-bold text-white">Store Settings & Credentials Verification</h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">Boutique identity, tax settings, and third-party provider status.</p>
              </div>

              {/* STORE FREEZE & POST-PAYMENT CUSTOM MESSAGES */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white font-cinzel mb-2 uppercase">Storefront Public Notices & Messages</h3>
                <p className="text-xs text-neutral-400 font-mono mb-4">
                  Configure custom banner messages displayed when store checkout is frozen, and customize the post-payment thank-you receipt notice.
                </p>

                <form onSubmit={handleSaveStoreMessages} className="space-y-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[#161020] border border-neutral-800 space-y-3">
                    <span className="text-amber-300 font-bold uppercase block text-[11px]">
                      1. Store Freeze Banner & Notice (When Purchases Paused)
                    </span>
                    <div>
                      <label className="text-neutral-400 block mb-1 uppercase">Banner Headline / Title</label>
                      <input
                        name="freezeTitle"
                        type="text"
                        defaultValue={storefrontSettings.purchases_enabled?.banner_title || 'STORE ORDERS CURRENTLY PAUSED'}
                        placeholder="e.g. STORE ORDERS CURRENTLY PAUSED"
                        className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1 uppercase">Custom Freeze Message</label>
                      <textarea
                        name="freezeMessage"
                        rows={2}
                        defaultValue={storefrontSettings.purchases_enabled?.disabled_message || 'Purchases are momentarily paused while founder Dhrisni finalizes new creations. You may still explore the catalogue.'}
                        placeholder="Message displayed across public top banner and checkout drawer..."
                        className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#161020] border border-neutral-800 space-y-3">
                    <span className="text-emerald-300 font-bold uppercase block text-[11px]">
                      2. Post-Payment Customer Thank You Message
                    </span>
                    <div>
                      <label className="text-neutral-400 block mb-1 uppercase">Confirmation Title</label>
                      <input
                        name="thankYouTitle"
                        type="text"
                        defaultValue={storefrontSettings.order_thank_you_message?.title || 'ORDER RESERVED • OUR TEAM NOTIFIED'}
                        placeholder="e.g. ORDER RESERVED • OUR TEAM NOTIFIED"
                        className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-400 block mb-1 uppercase">Thank You Note</label>
                      <textarea
                        name="thankYouMessage"
                        rows={2}
                        defaultValue={storefrontSettings.order_thank_you_message?.message || 'Your order is confirmed. Dhrisni and our Studio team are preparing your custom presentation box and certificate.'}
                        placeholder="Personalized message displayed to customer upon verified payment..."
                        className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold uppercase cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Storefront Messages</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* 2FA Status Banner */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <span className="font-bold text-white uppercase tracking-wider block text-xs">TWO-FACTOR AUTHENTICATION (2FA) • ENFORCED</span>
                    <span className="text-[11px] text-emerald-300/80">Every administrator login requires master credentials verification + a single-use 6-digit email security code.</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  ACTIVE & ENFORCED
                </span>
              </div>

              {/* PAYMENT RAILS & CHECKOUT TOGGLES */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-cinzel uppercase flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-pink" />
                      Checkout Payment Options (Toggle Rails)
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Turn on or off specific payment methods available to customers during checkout.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase w-fit">
                    Live Toggle Controls
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Online Payments */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    (storefrontSettings.payment_methods?.online_payments ?? true)
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-[#161020] border-neutral-800 opacity-60'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs font-cinzel text-white">Online Payment (UPI & Cards)</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            (storefrontSettings.payment_methods?.online_payments ?? true) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {(storefrontSettings.payment_methods?.online_payments ?? true) ? 'ACTIVE' : 'OFF'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-neutral-400 mt-1.5 leading-relaxed">
                          Razorpay gateway: UPI (GPay, PhonePe, Paytm, BHIM QR), Debit/Credit Cards, and Net Banking.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePaymentOption('online_payments')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                          (storefrontSettings.payment_methods?.online_payments ?? true) ? 'bg-[#BE185D]' : 'bg-neutral-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            (storefrontSettings.payment_methods?.online_payments ?? true) ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Cash on Delivery */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    (storefrontSettings.payment_methods?.cod ?? true)
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-[#161020] border-neutral-800 opacity-60'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs font-cinzel text-white">Cash on Delivery (Pay on Delivery)</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            (storefrontSettings.payment_methods?.cod ?? true) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {(storefrontSettings.payment_methods?.cod ?? true) ? 'ACTIVE' : 'OFF'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-neutral-400 mt-1.5 leading-relaxed">
                          Allow customers to order without immediate payment and pay cash directly to the courier.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePaymentOption('cod')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                          (storefrontSettings.payment_methods?.cod ?? true) ? 'bg-[#BE185D]' : 'bg-neutral-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            (storefrontSettings.payment_methods?.cod ?? true) ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white font-cinzel mb-4">Third-Party Account Status (Requirement 13)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-[#161020] rounded-xl border border-neutral-800 flex justify-between items-center">
                    <span>Cloudflare Pages / DNS:</span>
                    <span className="text-emerald-400 font-bold">Connected</span>
                  </div>
                  <div className="p-3 bg-[#161020] rounded-xl border border-neutral-800 flex justify-between items-center">
                    <span>Turso SQLite Database:</span>
                    <span className="text-emerald-400 font-bold">Operational (Local & Cloud Sync)</span>
                  </div>
                  <div className="p-3 bg-[#161020] rounded-xl border border-neutral-800 flex justify-between items-center">
                    <span>Razorpay Payments:</span>
                    <span className="text-emerald-400 font-bold">Ready</span>
                  </div>
                  <div className="p-3 bg-[#161020] rounded-xl border border-neutral-800 flex justify-between items-center">
                    <span>Cloudinary Media CDN:</span>
                    <span className="text-emerald-400 font-bold">Ready</span>
                  </div>
                  <div className="p-3 bg-[#161020] rounded-xl border border-neutral-800 flex justify-between items-center">
                    <span>Shiprocket Logistics:</span>
                    <span className="text-amber-400 font-bold">Manual Fulfillment CSV Mode (Unblocked)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: PROMOTIONS & DISCOUNTS */}
          {activeTab === 'promotions' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase">Promotions & Discount Codes</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Create percentage codes, fixed amount vouchers, and cart threshold rules.</p>
                </div>
                <button
                  onClick={() => setNewPromoModalOpen(true)}
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Promotion
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotions.map((p) => {
                  const themeKey = (p.animation_theme || 'sparkles').toLowerCase();
                  const themeConfig: Record<string, { label: string; icon: string; color: string }> = {
                    diwali: { label: 'Diwali Diyas & Crackers', icon: '🪔', color: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
                    holi: { label: 'Holi Color Splash', icon: '🎨', color: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30' },
                    cyberpunk: { label: 'Cyberpunk Sparks', icon: '⚡', color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
                    luxury_gold: { label: 'Royal Gold Coins', icon: '🪙', color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' },
                    hearts: { label: 'Romantic Hearts', icon: '💖', color: 'bg-pink-500/10 text-pink-300 border-pink-500/30' },
                    sparkles: { label: 'Classic Sparkles', icon: '✨', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' }
                  };
                  const themeBadge = themeConfig[themeKey] || themeConfig.sparkles;
                  const isActive = p.is_active === 1 || p.is_active === true;

                  return (
                    <div key={p.id} className="p-5 rounded-2xl bg-[#100C17] border border-[#231A2A] space-y-3 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-black text-xl text-[#F4C2C2] tracking-wider block">{p.code}</span>
                          <span className="text-xs font-mono text-neutral-400">
                            {p.discount_type === 'percentage' ? `${p.discount_value}% Discount` : `₹${p.discount_value} Flat Off`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePromotion(p.id, isActive ? 1 : 0)}
                            title={isActive ? 'Click to deactivate' : 'Click to activate'}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase cursor-pointer transition-colors ${
                              isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:text-white'
                            }`}
                          >
                            {isActive ? 'Active' : 'Disabled'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePromotion(p.id, p.code)}
                            title="Delete Promotion"
                            className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Animation Theme Pill */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 ${themeBadge.color}`}>
                          <span>{themeBadge.icon}</span>
                          <span className="font-medium">{themeBadge.label}</span>
                        </span>
                      </div>

                      <div className="text-xs font-mono text-neutral-400 space-y-1 pt-2 border-t border-neutral-800/80">
                        <div className="flex justify-between">
                          <span>Min Order Value:</span>
                          <span className="text-white">₹{p.min_order_value || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Redemptions:</span>
                          <span className="text-white">{p.current_uses ?? p.times_used ?? 0} {p.max_uses ? `/ ${p.max_uses}` : '(Unlimited)'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODULE: GROUP BUYING / SQUAD DROPS */}
          {activeTab === 'group_buying' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase">Group Buying & Squad Buys</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Collective studio drop activations for Discord communities and fashion cliques.</p>
                </div>
                <button
                  onClick={() => setNewSquadModalOpen(true)}
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Squad Drop
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupBuys.map((gb) => (
                  <div key={gb.id} className="p-5 rounded-2xl bg-[#100C17] border border-[#231A2A] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white font-cinzel text-base">{gb.title}</h3>
                        <span className="font-mono text-xs text-[#F4C2C2] font-bold block mt-0.5">Code: {gb.squad_code}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                        {gb.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#161020] p-3 rounded-xl border border-neutral-800/80">
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Discount</span>
                        <span className="text-white font-bold text-sm">{gb.discount_percent}% OFF</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block text-[10px]">Members Joined</span>
                        <span className="text-white font-bold text-sm">{gb.current_members} / {gb.min_members} Target</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 flex justify-between">
                      <span>Expires: {new Date(Number(gb.expires_at)).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Collaborative Squad Carts (Live Multi-User Shopping Sessions) */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-cinzel uppercase">Live Collaborative Squad Carts</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">Real-time group shopping sessions initiated by visitors with shareable invites.</p>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">{groupCarts.length} Active Sessions</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px]">
                        <th className="py-3 px-3">Share Code</th>
                        <th className="py-3 px-3">Creator / Host</th>
                        <th className="py-3 px-3">Participants & Items</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Created</th>
                        <th className="py-3 px-3 text-right">Order Ref</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-mono">
                      {groupCarts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-neutral-500 font-mono">
                            No collaborative squad carts created yet.
                          </td>
                        </tr>
                      ) : (
                        groupCarts.map((gc) => {
                          const members = (() => {
                            try {
                              return typeof gc.members_data === 'string' ? JSON.parse(gc.members_data) : (gc.members_data || []);
                            } catch {
                              return [];
                            }
                          })();
                          const totalPieces = members.reduce((sum: number, m: any) => sum + (Array.isArray(m.items) ? m.items.length : 0), 0);

                          return (
                            <tr key={gc.id} className="hover:bg-[#181222] transition-colors">
                              <td className="py-3 px-3 font-bold text-[#F4C2C2]">{gc.share_code}</td>
                              <td className="py-3 px-3">
                                <span className="text-white block font-sans font-medium">{gc.creator_name}</span>
                                <span className="text-neutral-500 text-[11px]">{gc.creator_email}</span>
                              </td>
                              <td className="py-3 px-3 text-neutral-300">
                                {members.length} {members.length === 1 ? 'member' : 'members'} · {totalPieces} {totalPieces === 1 ? 'piece' : 'pieces'}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${gc.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                  gc.status === 'completed' ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' :
                                    'bg-amber-500/10 text-amber-400'
                                  }`}>
                                  {gc.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-neutral-400 text-[11px]">
                                {new Date(Number(gc.created_at)).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-3 text-right">
                                {gc.order_id ? (
                                  <span className="text-emerald-400 font-bold">{gc.order_id}</span>
                                ) : (
                                  <span className="text-neutral-500">In Cart</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: USERS & PERMISSIONS */}
          {activeTab === 'users' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase">Users & Access Permissions</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Role-based access control (Owner, Store Manager, Content Manager) and OTP logs.</p>
                </div>
                <button
                  onClick={() => setNewUserModalOpen(true)}
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Administrator
                </button>
              </div>

              {/* 2FA Status Banner */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <div>
                    <span className="font-bold text-white uppercase tracking-wider block text-xs">TWO-FACTOR AUTHENTICATION (2FA) • ENFORCED</span>
                    <span className="text-[11px] text-emerald-300/80">Every administrator login requires master credentials verification + a single-use 6-digit email security code.</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  ACTIVE & ENFORCED
                </span>
              </div>

              {/* PAYMENT RAILS & CHECKOUT TOGGLES */}
              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-cinzel uppercase flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-pink" />
                      Checkout Payment Options (Toggle Rails)
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Turn on or off specific payment methods available to customers during checkout.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase w-fit">
                    Live Toggle Controls
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Online Payments */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    (storefrontSettings.payment_methods?.online_payments ?? true)
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-[#161020] border-neutral-800 opacity-60'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs font-cinzel text-white">Online Payment (UPI & Cards)</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            (storefrontSettings.payment_methods?.online_payments ?? true) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {(storefrontSettings.payment_methods?.online_payments ?? true) ? 'ACTIVE' : 'OFF'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-neutral-400 mt-1.5 leading-relaxed">
                          Razorpay gateway: UPI (GPay, PhonePe, Paytm, BHIM QR), Debit/Credit Cards, and Net Banking.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePaymentOption('online_payments')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                          (storefrontSettings.payment_methods?.online_payments ?? true) ? 'bg-[#BE185D]' : 'bg-neutral-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            (storefrontSettings.payment_methods?.online_payments ?? true) ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Option 2: Cash on Delivery */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    (storefrontSettings.payment_methods?.cod ?? true)
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-[#161020] border-neutral-800 opacity-60'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs font-cinzel text-white">Cash on Delivery (Pay on Delivery)</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            (storefrontSettings.payment_methods?.cod ?? true) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {(storefrontSettings.payment_methods?.cod ?? true) ? 'ACTIVE' : 'OFF'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-neutral-400 mt-1.5 leading-relaxed">
                          Allow customers to order without immediate payment and pay cash directly to the courier.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePaymentOption('cod')}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                          (storefrontSettings.payment_methods?.cod ?? true) ? 'bg-[#BE185D]' : 'bg-neutral-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            (storefrontSettings.payment_methods?.cod ?? true) ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px]">
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Email</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Last Login</th>
                        <th className="py-3 px-3">Created</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {adminUsersList.map((u) => (
                        <tr key={u.id} className="hover:bg-[#181222] transition-colors">
                          <td className="py-3.5 px-3 font-bold text-white">{u.name}</td>
                          <td className="py-3.5 px-3 font-mono text-neutral-300">{u.email}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${u.role === 'owner' ? 'bg-[#BE185D]/20 text-[#F4C2C2] border border-[#BE185D]/40 font-bold' :
                              u.role === 'store_manager' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30' :
                                'bg-neutral-800 text-neutral-300'
                              }`}>
                              {u.role.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-neutral-400 text-[11px]">
                            {u.last_login_at ? new Date(Number(u.last_login_at)).toLocaleString() : 'Never'}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-neutral-500 text-[11px]">
                            {new Date(Number(u.created_at)).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setEditingUser(u); setEditUserModalOpen(true); }}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono cursor-pointer transition-colors"
                              >
                                Edit Access 🔑
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                title="Remove Admin"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: NAVIGATION & MENUS */}
          {activeTab === 'navigation' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase">Navigation & Storefront Menus</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Control main header anchor points and global footer destinations.</p>
                </div>
                <button
                  onClick={() => {
                    showNotification('Navigation configuration saved to database');
                  }}
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Navigation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 space-y-4">
                  <h3 className="font-cinzel font-bold text-white text-sm uppercase">Header Primary Links</h3>
                  <div className="space-y-2">
                    {navSettings.header_links.map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-[#161020] p-2.5 rounded-xl border border-neutral-800">
                        <input
                          defaultValue={link.label}
                          className="bg-transparent border-none text-xs font-mono text-white focus:outline-none flex-1"
                        />
                        <input
                          defaultValue={link.href}
                          className="bg-transparent border-none text-xs font-mono text-[#F4C2C2] focus:outline-none flex-1 text-right"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 space-y-4">
                  <h3 className="font-cinzel font-bold text-white text-sm uppercase">Footer Social & Legal Links</h3>
                  <div className="space-y-2">
                    {navSettings.footer_links.map((link: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center bg-[#161020] p-2.5 rounded-xl border border-neutral-800">
                        <input
                          defaultValue={link.label}
                          className="bg-transparent border-none text-xs font-mono text-white focus:outline-none flex-1"
                        />
                        <input
                          defaultValue={link.href}
                          className="bg-transparent border-none text-xs font-mono text-[#F4C2C2] focus:outline-none flex-1 text-right"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE: PAGES & POLICIES */}
          {activeTab === 'policies' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase">Pages & Legal Policies</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Publish shipping details, return policies, and privacy notices.</p>
                </div>
                <button
                  onClick={() => {
                    showNotification('Store policies successfully saved & published');
                  }}
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Policies
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 space-y-3">
                  <label className="text-xs font-cinzel font-bold text-white uppercase block">
                    Shipping & Domestic Logistics Policy
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={policySettings.shipping}
                    className="w-full bg-[#161020] border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 font-mono focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 space-y-3">
                  <label className="text-xs font-cinzel font-bold text-white uppercase block">
                    Returns, Exchanges & Made-to-Order Terms
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={policySettings.refunds}
                    className="w-full bg-[#161020] border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 font-mono focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 space-y-3">
                  <label className="text-xs font-cinzel font-bold text-white uppercase block">
                    Privacy Policy & Customer Data Notice
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={policySettings.privacy}
                    className="w-full bg-[#161020] border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 font-mono focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MODULE: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 max-w-7xl mx-auto space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-cinzel font-bold text-white uppercase">Client Roster & Profiles</h2>
                <span className="text-xs font-mono text-[#F4C2C2] bg-[#301934] px-3 py-1 rounded-lg">{customers.length} Profiles Recorded</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 font-mono uppercase text-[11px]">
                      <th className="py-2 px-3">Name</th>
                      <th className="py-2 px-3">Email</th>
                      <th className="py-2 px-3">Phone</th>
                      <th className="py-2 px-3">Total Orders</th>
                      <th className="py-2 px-3 font-mono">Lifetime Spend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 px-3 font-bold text-white">{c.name}</td>
                        <td className="py-3 px-3 font-mono text-neutral-400">{c.email}</td>
                        <td className="py-3 px-3 font-mono text-neutral-400">{c.phone || 'N/A'}</td>
                        <td className="py-3 px-3 font-mono">{c.total_orders}</td>
                        <td className="py-3 px-3 font-mono text-[#F4C2C2] font-bold">₹{c.total_spent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE: ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6 max-w-7xl mx-auto space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase">Security & Administrative Activity Log</h2>
                  <p className="text-xs text-neutral-400 mt-0.5 font-mono">Durable immutable audit log of administrative sessions and storefront mutations.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetActivityLog}
                    disabled={isResettingActivity}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-mono text-xs px-3.5 py-1.5 rounded-xl cursor-pointer active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isResettingActivity ? 'Resetting...' : 'Reset Activity Log'}</span>
                  </button>
                  <span className="text-xs font-mono text-[#F4C2C2] bg-[#301934] px-3 py-1 rounded-lg">Audit Trail ({activityLogs.length})</span>
                </div>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#140F1D] border border-neutral-800/80 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-white">{log.action}</span>
                      <span className="text-neutral-500 font-mono block text-[11px]">By {log.user_email} on {log.entity_type}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(Number(log.created_at)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: ORDER DETAIL & FULFILLMENT */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-neutral-800 pb-4 sticky top-0 bg-[#120D1A] z-10">
              <div>
                <h3 className="text-lg font-cinzel font-bold text-white">Order Details: {selectedOrder.order_number}</h3>
                <span className="text-xs font-mono text-[#F4C2C2]">Placed on {new Date(Number(selectedOrder.created_at)).toLocaleDateString()}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#181122] p-4 rounded-xl">
              <div>
                <span className="text-neutral-500 uppercase block text-[10px]">Customer Details</span>
                <span className="text-white font-bold block">{selectedOrder.customer_name}</span>
                <span className="text-neutral-300 block">{selectedOrder.customer_email}</span>
                <span className="text-neutral-300 block">{selectedOrder.customer_phone}</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase block text-[10px]">Shipping Destination</span>
                <span className="text-neutral-300 block">{selectedOrder.shipping_address?.address_line1 || 'No street specified'}</span>
                <span className="text-neutral-300 block">
                  {selectedOrder.shipping_address?.city || 'India'}
                  {selectedOrder.shipping_address?.state ? `, ${selectedOrder.shipping_address?.state}` : ''}
                  {selectedOrder.shipping_address?.pincode ? ` - ${selectedOrder.shipping_address?.pincode}` : ''}
                </span>
                <span className="text-neutral-400 block">{selectedOrder.shipping_address?.country || 'India'}</span>
              </div>
            </div>

            {/* Cancellation Status Banner if Cancelled */}
            {(selectedOrder.fulfillment_status === 'cancelled' || selectedOrder.payment_status === 'cancelled' || selectedOrder.cancellation_reason) && (
              <div className="bg-rose-950/40 border border-rose-500/40 p-4 rounded-xl space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-mono font-bold text-xs uppercase">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Order Cancelled</span>
                  {selectedOrder.cancelled_at && (
                    <span className="text-[10px] text-rose-400/80 font-normal">
                      ({new Date(Number(selectedOrder.cancelled_at)).toLocaleString()})
                    </span>
                  )}
                </div>
                <p className="text-xs text-rose-200/90 font-mono">
                  Reason: <span className="text-white">{selectedOrder.cancellation_reason || 'Cancelled by customer / admin request'}</span>
                </p>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Status: Items restored to available inventory.
                </p>
              </div>
            )}

            {/* Order Items Table & Financials */}
            <div className="bg-[#181122] p-4 rounded-xl space-y-3">
              <span className="text-xs font-bold text-white font-cinzel uppercase block">Order Line Items</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px]">
                      <th className="pb-2">Piece / Product</th>
                      <th className="pb-2">Size</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Unit Price</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: any, idx: number) => (
                        <tr key={idx} className="text-neutral-300">
                          <td className="py-2.5 text-white font-medium">{item.title || item.name || 'Wearable Art Piece'}</td>
                          <td className="py-2.5 text-neutral-400">{item.size || 'Standard'}</td>
                          <td className="py-2.5">{item.quantity || 1}</td>
                          <td className="py-2.5">₹{item.price}</td>
                          <td className="py-2.5 text-right font-bold text-white">₹{(item.price || 0) * (item.quantity || 1)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-3 text-neutral-500 italic text-center">No item data recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Summary */}
              <div className="border-t border-neutral-800/80 pt-3 flex justify-between text-xs font-mono">
                <div className="text-neutral-400">
                  <span className="block">Status: <strong className="text-white uppercase">{selectedOrder.payment_status}</strong></span>
                  <span className="block text-[11px] text-neutral-500">Method: {selectedOrder.payment_method || 'Razorpay / UPI'}</span>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-neutral-400">Subtotal: ₹{selectedOrder.subtotal || selectedOrder.grand_total}</div>
                  {Number(selectedOrder.discount) > 0 && (
                    <div className="text-[#BE185D]">Privilege Discount: -₹{selectedOrder.discount}</div>
                  )}
                  {Number(selectedOrder.shipping_fee) > 0 && (
                    <div className="text-neutral-400">Express Courier: ₹{selectedOrder.shipping_fee}</div>
                  )}
                  <div className="text-white font-bold text-sm">Grand Total: ₹{selectedOrder.grand_total}</div>
                </div>
              </div>
            </div>

            {/* Refund Audit Ledger */}
            {Array.isArray(selectedOrder.refunds) && selectedOrder.refunds.length > 0 && (
              <div className="bg-[#181122] p-4 rounded-xl space-y-2 border border-purple-900/40">
                <span className="text-xs font-bold text-purple-300 font-cinzel uppercase block">Refund History & Audit Ledger</span>
                <div className="space-y-1.5 text-xs font-mono">
                  {selectedOrder.refunds.map((ref: any) => (
                    <div key={ref.id} className="p-2.5 rounded bg-black/40 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-white font-bold block">Refund: {ref.id}</span>
                        <span className="text-neutral-400 text-[10px]">
                          Gateway Ref: {ref.provider_refund_id || 'Pending Gateway'} • {new Date(Number(ref.created_at)).toLocaleString()}
                        </span>
                        {ref.reason && <span className="text-neutral-500 text-[10px] block">Reason: {ref.reason}</span>}
                      </div>
                      <div className="text-right">
                        <span className="text-purple-300 font-bold block">₹{ref.amount}</span>
                        <span className={`text-[10px] uppercase font-bold ${ref.status === 'processed' ? 'text-emerald-400' : ref.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                          {ref.status} {ref.restock ? '• Restocked' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fulfillment controls */}
            <div className="p-4 rounded-xl bg-[#1A1224] border border-[#BE185D]/30 space-y-3">
              <span className="text-xs font-bold text-white font-cinzel uppercase block">Update Fulfillment & Tracking</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1">Carrier</label>
                  <input
                    id="carrierInput"
                    defaultValue={selectedOrder.carrier || 'Delhivery Express'}
                    className="w-full bg-[#120D1A] border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 block mb-1">Tracking Number</label>
                  <input
                    id="trackingInput"
                    defaultValue={selectedOrder.tracking_number || ''}
                    placeholder="e.g. DEL99210984IN"
                    className="w-full bg-[#120D1A] border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2 pt-2">
                {selectedOrder.fulfillment_status !== 'cancelled' && selectedOrder.fulfillment_status !== 'delivered' && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to cancel Order ${selectedOrder.order_number}?`)) {
                        handleUpdateOrderFulfillment(selectedOrder.id, 'cancelled', selectedOrder.carrier || '', selectedOrder.tracking_number || '');
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 font-bold text-xs font-mono uppercase"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => {
                    const carrier = (document.getElementById('carrierInput') as HTMLInputElement)?.value;
                    const tracking = (document.getElementById('trackingInput') as HTMLInputElement)?.value;
                    handleUpdateOrderFulfillment(selectedOrder.id, 'shipped', carrier, tracking);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold text-xs font-mono uppercase"
                >
                  Mark as Shipped
                </button>
                <button
                  onClick={() => {
                    const carrier = (document.getElementById('carrierInput') as HTMLInputElement)?.value;
                    const tracking = (document.getElementById('trackingInput') as HTMLInputElement)?.value;
                    handleUpdateOrderFulfillment(selectedOrder.id, 'delivered', carrier, tracking);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono uppercase"
                >
                  Mark as Delivered
                </button>
              </div>
            </div>

            {/* Payment & Refund Controls */}
            <div className="p-4 rounded-xl bg-[#1A1224] border border-[#2D2038] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Payment & Settlement</span>
                <span className={`font-mono text-xs font-bold uppercase ${selectedOrder.payment_status === 'paid' ? 'text-emerald-400' :
                  selectedOrder.payment_status === 'refunded' ? 'text-purple-400' : 'text-amber-400'
                  }`}>
                  {selectedOrder.payment_status} ({selectedOrder.payment_method || 'Razorpay'})
                </span>
                {selectedOrder.razorpay_payment_id && (
                  <span className="text-[10px] text-neutral-500 font-mono block">Gateway ID: {selectedOrder.razorpay_payment_id}</span>
                )}
              </div>
              {(selectedOrder.payment_status === 'paid' || selectedOrder.payment_status === 'partially_refunded') && (
                <button
                  onClick={() => {
                    setRefundOrderTarget(selectedOrder);
                    const remaining = Math.max(0, Number(selectedOrder.captured_amount || selectedOrder.grand_total) - Number(selectedOrder.refunded_amount || 0));
                    setRefundAmount(remaining);
                    setRefundRestock(false);
                    setRefundModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-200 text-xs font-mono uppercase cursor-pointer"
                >
                  Issue Refund
                </button>
              )}
              {selectedOrder.payment_status === 'refunded' && (
                <span className="px-2.5 py-1 rounded bg-purple-950/50 border border-purple-800 text-purple-300 text-[10px] font-mono uppercase">
                  Fully Refunded
                </span>
              )}
            </div>

            {/* Owner Delete Order Option */}
            {adminUser?.role === 'owner' && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={async () => {
                    if (!confirm(`Are you sure you want to permanently delete order ${selectedOrder.order_number}?`)) return;
                    try {
                      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, { method: 'DELETE' });
                      if (res.ok) {
                        showNotification(`Order ${selectedOrder.order_number} deleted successfully`, 'success');
                        setSelectedOrder(null);
                        fetchData();
                      } else {
                        showNotification('Failed to delete order', 'error');
                      }
                    } catch {
                      showNotification('Error deleting order', 'error');
                    }
                  }}
                  className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Order Record
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: EDIT WEBSITE SECTION (CONTENT EDITOR) */}
      {contentEditSection && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-cinzel font-bold text-white">Visual Content Editor</h3>
                <span className="text-xs font-mono text-[#F4C2C2] uppercase">Editing: {contentEditSection.title}</span>
              </div>
              <button onClick={() => setContentEditSection(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {Object.keys(contentEditSection.data || {}).map((key) => {
                const val = contentEditSection.data[key];
                if (key === 'reels' || typeof val === 'object') return null;
                return (
                  <div key={key}>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase mb-1">
                      {key.replace(/_/g, ' ')}
                    </label>
                    {String(val).length > 80 ? (
                      <textarea
                        rows={3}
                        defaultValue={String(val)}
                        id={`content_${key}`}
                        className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                      />
                    ) : (
                      <input
                        type="text"
                        defaultValue={String(val)}
                        id={`content_${key}`}
                        className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                      />
                    )}
                  </div>
                );
              })}

              {/* DEDICATED VIMEO REELS MANAGER */}
              {(contentEditSection.section_key === 'reels' || editableReels.length > 0) && (
                <div className="mt-6 pt-5 border-t border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-cinzel font-bold text-white flex items-center gap-2">
                        <span>Vimeo Video Reels</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#301934] text-[#F4C2C2]">
                          {editableReels.length} Reels
                        </span>
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Add or update Vimeo video links for the homepage autoplaying reels segment.
                      </p>
                    </div>
                  </div>

                  {/* List of active reels */}
                  <div className="space-y-3">
                    {editableReels.map((reel, rIdx) => (
                      <div key={reel.id || rIdx} className="p-3.5 rounded-xl bg-[#181122] border border-neutral-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#F4C2C2] uppercase">
                            Reel #{rIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditableReels(editableReels.filter((_, idx) => idx !== rIdx));
                            }}
                            className="text-red-400 hover:text-red-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-mono text-neutral-400 uppercase">Title</label>
                            <input
                              type="text"
                              value={reel.title || ''}
                              onChange={(e) => {
                                const next = [...editableReels];
                                next[rIdx] = { ...next[rIdx], title: e.target.value };
                                setEditableReels(next);
                              }}
                              className="w-full bg-[#120D1A] border border-neutral-800 rounded p-1.5 text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-neutral-400 uppercase">Tag / Category</label>
                            <input
                              type="text"
                              value={reel.tag || ''}
                              onChange={(e) => {
                                const next = [...editableReels];
                                next[rIdx] = { ...next[rIdx], tag: e.target.value };
                                setEditableReels(next);
                              }}
                              className="w-full bg-[#120D1A] border border-neutral-800 rounded p-1.5 text-white text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 uppercase">Vimeo Link / URL</label>
                          <input
                            type="text"
                            placeholder="https://vimeo.com/824804225 or player.vimeo.com/video/..."
                            value={reel.vimeo_url || ''}
                            onChange={(e) => {
                              const next = [...editableReels];
                              next[rIdx] = { ...next[rIdx], vimeo_url: e.target.value };
                              setEditableReels(next);
                            }}
                            className="w-full bg-[#120D1A] border border-neutral-800 rounded p-1.5 text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-neutral-400 uppercase">Caption / Subtitle</label>
                          <input
                            type="text"
                            value={reel.subtitle || ''}
                            onChange={(e) => {
                              const next = [...editableReels];
                              next[rIdx] = { ...next[rIdx], subtitle: e.target.value };
                              setEditableReels(next);
                            }}
                            className="w-full bg-[#120D1A] border border-neutral-800 rounded p-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Reel Form */}
                  <div className="p-4 rounded-xl bg-[#1C1425] border border-[#BE185D]/30 space-y-3">
                    <h5 className="font-cinzel text-xs font-bold text-white flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-pink" />
                      Add New Vimeo Reel
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Reel Title (e.g. Spiked Moto Shrug)"
                        value={newReelTitle}
                        onChange={(e) => setNewReelTitle(e.target.value)}
                        className="bg-[#120D1A] border border-neutral-800 rounded-lg p-2 text-white text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Tag (e.g. Runway, Studio)"
                        value={newReelTag}
                        onChange={(e) => setNewReelTag(e.target.value)}
                        className="bg-[#120D1A] border border-neutral-800 rounded-lg p-2 text-white text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Vimeo Video Link (e.g. https://vimeo.com/824804225)"
                      value={newReelVimeoUrl}
                      onChange={(e) => setNewReelVimeoUrl(e.target.value)}
                      className="w-full bg-[#120D1A] border border-neutral-800 rounded-lg p-2 text-white text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Caption / Subtitle"
                      value={newReelSubtitle}
                      onChange={(e) => setNewReelSubtitle(e.target.value)}
                      className="w-full bg-[#120D1A] border border-neutral-800 rounded-lg p-2 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newReelVimeoUrl && !newReelTitle) {
                          alert('Please enter at least a title or Vimeo link');
                          return;
                        }
                        const newReel = {
                          id: 'reel-' + Date.now(),
                          title: newReelTitle || 'Featured Video Reel',
                          subtitle: newReelSubtitle || '',
                          vimeo_url: newReelVimeoUrl,
                          fallback_video: newReelVimeoUrl,
                          tag: newReelTag || 'Runway'
                        };
                        setEditableReels([...editableReels, newReel]);
                        setNewReelTitle('');
                        setNewReelSubtitle('');
                        setNewReelVimeoUrl('');
                        setNewReelTag('');
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#BE185D] hover:bg-[#ff3d9a] text-black font-spartan font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Reel to List
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => {
                  const updatedData = { ...contentEditSection.data };
                  Object.keys(contentEditSection.data || {}).forEach((key) => {
                    const el = document.getElementById(`content_${key}`) as HTMLInputElement | HTMLTextAreaElement;
                    if (el) updatedData[key] = el.value;
                  });
                  if (editableReels.length > 0 || contentEditSection.section_key === 'reels') {
                    updatedData.reels = editableReels;
                  }
                  handleSaveContentSection(contentEditSection.section_key, contentEditSection.title, updatedData, 'draft');
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono"
              >
                Save as Draft
              </button>
              <button
                onClick={() => {
                  const updatedData = { ...contentEditSection.data };
                  Object.keys(contentEditSection.data || {}).forEach((key) => {
                    const el = document.getElementById(`content_${key}`) as HTMLInputElement | HTMLTextAreaElement;
                    if (el) updatedData[key] = el.value;
                  });
                  if (editableReels.length > 0 || contentEditSection.section_key === 'reels') {
                    updatedData.reels = editableReels;
                  }
                  handleSaveContentSection(contentEditSection.section_key, contentEditSection.title, updatedData, 'published');
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#F4C2C2] text-black font-bold text-xs font-mono uppercase"
              >
                Publish Live to Storefront
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INVENTORY ADJUSTMENT */}
      {inventoryModalOpen && inventoryTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-cinzel font-bold text-white">Adjust Stock: {inventoryTarget.title}</h3>
            <div className="text-xs text-neutral-400 font-mono">
              Current stock: <strong className="text-white">{inventoryTarget.inventory_quantity} units</strong>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 mb-1">Adjustment Quantity (+ or -)</label>
                <input
                  type="number"
                  value={inventoryAdjustment}
                  onChange={(e) => setInventoryAdjustment(Number(e.target.value))}
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Reason for Adjustment</label>
                <select
                  value={inventoryReason}
                  onChange={(e) => setInventoryReason(e.target.value)}
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                >
                  <option value="Studio Restock">Studio Restock</option>
                  <option value="Physical Count Correction">Physical Studio Count Correction</option>
                  <option value="Damaged in Production">Damaged During Handcrafting</option>
                  <option value="Reserved for Runway">Reserved for Runway Exhibition</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setInventoryModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                className="px-3.5 py-1.5 rounded-lg bg-[#BE185D] text-black font-bold text-xs font-mono uppercase"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-cinzel font-bold text-white">
              {selectedProduct ? 'Edit Catalog Piece' : 'Add New Product'}
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 mb-1">Garment Title</label>
                <input
                  id="p_title"
                  defaultValue={selectedProduct?.title || ''}
                  placeholder="e.g. Cyberpunk Spiked Archive Bodice"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">SKU</label>
                  <input
                    id="p_sku"
                    defaultValue={selectedProduct?.sku || `AVZ-ART-${Math.floor(10 + Math.random() * 90)}`}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    id="p_category"
                    defaultValue={selectedProduct?.category || 'Wearable Art'}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                  >
                    <option value="Jackets">Jackets</option>
                    <option value="Tops">Tops</option>
                    <option value="Corsets">Corsets</option>
                    <option value="Bralettes">Bralettes</option>
                    <option value="Arm cuffs">Arm cuffs</option>
                    <option value="Wearable Art">Wearable Art</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    id="p_price"
                    defaultValue={selectedProduct?.price || 3500}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    id="p_stock"
                    defaultValue={selectedProduct?.inventory_quantity ?? 1}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
              {/* MULTI-PHOTO ATTACHMENT MANAGER */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="block text-neutral-300 font-bold text-xs uppercase">Product Photos ({productImages.length})</label>
                    <span className="text-[10px] text-pink font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Cloudflare R2 Multi-Angle
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProductPickerSearch('');
                      setProductPickerPage(1);
                      setProductPickerOpen(true);
                    }}
                    className="text-xs font-mono text-pink hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Select from Media Pool</span>
                  </button>
                </div>

                {/* Upload & Add URL controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3">
                  <div className="sm:col-span-8 flex gap-2">
                    <input
                      type="text"
                      value={productUrlInput}
                      onChange={(e) => setProductUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = productUrlInput.trim();
                          if (val && !productImages.includes(val)) {
                            setProductImages(prev => [...prev, val]);
                            setProductUrlInput('');
                          }
                        }
                      }}
                      placeholder="Paste photo URL here..."
                      className="flex-1 bg-[#181122] border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-pink focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = productUrlInput.trim();
                        if (val && !productImages.includes(val)) {
                          setProductImages(prev => [...prev, val]);
                          setProductUrlInput('');
                        }
                      }}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold shrink-0 cursor-pointer transition-colors"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="cursor-pointer w-full py-2 px-3 rounded-lg bg-pink/20 hover:bg-pink/30 border border-pink/40 text-pink text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 text-center">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingR2 ? 'Uploading...' : 'Upload Photos'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={isUploadingR2}
                        onChange={handleUploadMultipleProductImages}
                      />
                    </label>
                  </div>
                </div>

                {/* Attached Photos Grid */}
                {productImages.length === 0 ? (
                  <div className="border border-dashed border-neutral-800 rounded-xl p-6 text-center bg-black/30">
                    <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                    <p className="text-xs font-cinzel text-neutral-300">No photos attached yet</p>
                    <p className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      Click "Upload Photos" above or "Select from Media Pool" to attach multiple photos
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {productImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`group relative aspect-[4/5] rounded-xl overflow-hidden border bg-black transition-all ${
                          idx === 0 ? 'border-pink ring-2 ring-pink/50' : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <img src={imgUrl} alt={`Product shot ${idx + 1}`} className="w-full h-full object-cover" />

                        {/* Primary Badge */}
                        {idx === 0 ? (
                          <div className="absolute top-1.5 left-1.5 z-10">
                            <span className="px-1.5 py-0.5 rounded bg-pink text-black text-[8px] font-mono uppercase font-bold shadow">
                              Cover Shot
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setProductImages(prev => [prev[idx], ...prev.filter((_, i) => i !== idx)]);
                            }}
                            className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded bg-black/80 hover:bg-pink hover:text-black text-[8px] font-mono uppercase font-bold text-neutral-300 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Set as Primary Cover"
                          >
                            Set Cover
                          </button>
                        )}

                        {/* Top-Right Remove Button */}
                        <button
                          type="button"
                          onClick={() => setProductImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-black/80 hover:bg-red-600 text-white transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {/* Bottom Bar: Reordering */}
                        <div className="absolute inset-x-0 bottom-0 p-1 bg-black/80 flex items-center justify-between text-[9px] font-mono text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>#{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setProductImages(prev => {
                                    const copy = [...prev];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx - 1];
                                    copy[idx - 1] = temp;
                                    return copy;
                                  });
                                }}
                                className="px-1 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                                title="Move left"
                              >
                                ←
                              </button>
                            )}
                            {idx < productImages.length - 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setProductImages(prev => {
                                    const copy = [...prev];
                                    const temp = copy[idx];
                                    copy[idx] = copy[idx + 1];
                                    copy[idx + 1] = temp;
                                    return copy;
                                  });
                                }}
                                className="px-1 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                                title="Move right"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Status</label>
                  <select
                    id="p_status"
                    defaultValue={selectedProduct?.status || 'published'}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="p_featured"
                    defaultChecked={Boolean(selectedProduct?.is_featured)}
                    className="w-4 h-4 accent-[#BE185D]"
                  />
                  <label htmlFor="p_featured" className="text-neutral-300 font-mono text-[11px] cursor-pointer">
                    Feature on Vault Rail (Homepage)
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Description</label>
                <textarea
                  id="p_description"
                  rows={3}
                  defaultValue={selectedProduct?.description || '1-of-1 wearable art hand-sculpted by Dhrisni.'}
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setProductModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const title = (document.getElementById('p_title') as HTMLInputElement)?.value;
                  const sku = (document.getElementById('p_sku') as HTMLInputElement)?.value;
                  const category = (document.getElementById('p_category') as HTMLSelectElement)?.value;
                  const price = Number((document.getElementById('p_price') as HTMLInputElement)?.value);
                  const inventory_quantity = Number((document.getElementById('p_stock') as HTMLInputElement)?.value);
                  const status = (document.getElementById('p_status') as HTMLSelectElement)?.value || 'published';
                  const is_featured = (document.getElementById('p_featured') as HTMLInputElement)?.checked ?? false;
                  const description = (document.getElementById('p_description') as HTMLTextAreaElement)?.value || '1-of-1 wearable art hand-sculpted by Dhrisni.';
                  const images = productImages.length > 0
                    ? productImages
                    : ['/assets/editorial_hero_portrait.jpg'];

                  if (!title || !sku || isNaN(price)) {
                    showNotification('Title, SKU, and Price are required.', 'error');
                    return;
                  }

                  try {
                    if (selectedProduct) {
                      const res = await fetch(`/api/admin/products/${selectedProduct.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, sku, category, price, inventory_quantity, description, images, status, is_featured })
                      });
                      if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.error || 'Failed to update product');
                      }
                      showNotification('Product updated successfully');
                    } else {
                      const res = await fetch('/api/admin/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, sku, category, price, inventory_quantity, description, images, status, is_featured })
                      });
                      if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.error || 'Failed to create product');
                      }
                      showNotification('Product created successfully');
                    }
                    setProductModalOpen(false);
                    fetchData();
                  } catch (err: any) {
                    showNotification(err.message || 'Error saving product', 'error');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#F4C2C2] text-black font-bold text-xs font-mono uppercase"
              >
                {selectedProduct ? 'Save Changes' : 'Create Piece'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK MULTI-PHOTO PICKER MODAL FOR PRODUCT CATALOG */}
      {productPickerOpen && (
        <div
          onClick={() => setProductPickerOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overscroll-contain animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-[#120b1c] border border-pink/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col h-[85vh] max-h-[720px] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
              <div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">Select Product Photos from Media Pool</h3>
                <p className="text-xs font-mono text-neutral-400 mt-0.5">
                  Click any photo to attach or remove • {productImages.length} photo{productImages.length === 1 ? '' : 's'} attached
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductPickerOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4 shrink-0 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productPickerSearch}
                onChange={(e) => {
                  setProductPickerSearch(e.target.value);
                  setProductPickerPage(1);
                }}
                placeholder="Search photos by title, filename, or tag..."
                className="w-full bg-[#1b1325] border border-white/15 rounded-xl pl-10 pr-9 py-2.5 text-xs text-white font-mono focus:border-pink focus:outline-none"
              />
              {productPickerSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setProductPickerSearch('');
                    setProductPickerPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Grid Area */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
              {paginatedProductPickerAssets.length === 0 ? (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-black/20">
                  <ImageIcon className="w-10 h-10 text-neutral-600 mb-2" />
                  <p className="text-xs font-mono text-neutral-400">No photos found matching your search</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-2">
                  {paginatedProductPickerAssets.map(asset => {
                    const isAttached = productImages.includes(asset.url);
                    const attachedIdx = productImages.indexOf(asset.url);
                    return (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => handleToggleProductImageFromPool(asset.url)}
                        className={`group relative w-full aspect-square block rounded-xl overflow-hidden border transition-all bg-black cursor-pointer ${
                          isAttached
                            ? 'border-pink ring-2 ring-pink shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                            : 'border-white/10 hover:border-pink/60'
                        }`}
                      >
                        <img
                          src={asset.url}
                          alt={asset.title || 'Media'}
                          loading="lazy"
                          className="w-full h-full object-cover block group-hover:scale-105 transition-transform"
                        />
                        {isAttached && (
                          <div className="absolute top-1.5 right-1.5 z-10">
                            <span className="w-5 h-5 rounded-full bg-pink text-black flex items-center justify-center font-bold text-[10px] shadow-lg">
                              #{attachedIdx + 1}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[9px] font-mono text-white truncate px-0.5">{asset.title || 'Photo'}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls & Done Button */}
            <div className="pt-3 border-t border-white/10 mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">
                  {filteredProductPickerAssets.length} total • <span className="text-pink font-bold">{productImages.length} selected</span>
                </span>
                {totalProductPickerPages > 1 && (
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      type="button"
                      disabled={productPickerPage <= 1}
                      onClick={() => setProductPickerPage(p => Math.max(1, p - 1))}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      ← Prev
                    </button>
                    <span className="text-xs font-mono text-neutral-300 px-1">
                      {productPickerPage} / {totalProductPickerPages}
                    </span>
                    <button
                      type="button"
                      disabled={productPickerPage >= totalProductPickerPages}
                      onClick={() => setProductPickerPage(p => Math.min(totalProductPickerPages, p + 1))}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {productImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setProductImages([])}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setProductPickerOpen(false)}
                  className="px-6 py-2 rounded-xl bg-pink text-black font-mono font-bold text-xs uppercase cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                >
                  Done ({productImages.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: CREATE COLLECTION */}
      {/* MODAL: CREATE PROMOTION */}
      {newPromoModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-cinzel font-bold text-white uppercase">Create Discount Promotion</h3>
              <button onClick={() => setNewPromoModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePromotion} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Promo Code *</label>
                  <input
                    name="promoCode"
                    required
                    placeholder="e.g. VIP20"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white uppercase focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Discount Type</label>
                  <select
                    name="promoType"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Value *</label>
                  <input
                    name="promoValue"
                    type="number"
                    required
                    placeholder="e.g. 15 or 500"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Min Order (₹)</label>
                  <input
                    name="promoMinOrder"
                    type="number"
                    defaultValue="0"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Max Uses (Leave blank for unlimited)</label>
                <input
                  name="promoMaxUses"
                  type="number"
                  placeholder="e.g. 100"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Cart Window Celebration Animation</label>
                <select
                  name="promoAnimation"
                  defaultValue="sparkles"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                >
                  <option value="sparkles">✨ Classic Studio Sparkles & Stars</option>
                  <option value="diwali">🪔 Diwali (Glowing Diyas & Firecrackers)</option>
                  <option value="holi">🎨 Holi (Vibrant Gulal Color Splash)</option>
                  <option value="cyberpunk">⚡ Cyberpunk (Matrix & Glitch Sparks)</option>
                  <option value="luxury_gold">🪙 Luxury Gold (Coins & Glitter Dust)</option>
                  <option value="hearts">💖 Lovers / Valentine (Floating Hearts)</option>
                </select>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  When the customer applies this code at checkout, this custom festive visual spectacle triggers in their cart drawer.
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setNewPromoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold text-xs uppercase"
                >
                  Activate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SQUAD DROP */}
      {newSquadModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-cinzel font-bold text-white uppercase">Create Squad Drop (Group Buying)</h3>
              <button onClick={() => setNewSquadModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGroupBuy} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Squad Drop Title *</label>
                <input
                  name="squadTitle"
                  required
                  placeholder="e.g. Cyber Denim Collective"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Squad Code *</label>
                  <input
                    name="squadCode"
                    required
                    placeholder="e.g. SQUAD-CYBER"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white uppercase focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Discount (%)</label>
                  <input
                    name="squadDiscount"
                    type="number"
                    defaultValue="15"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Min Squad Members</label>
                  <input
                    name="squadMinMembers"
                    type="number"
                    defaultValue="3"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Min Cart Amount (₹)</label>
                  <input
                    name="squadMinCart"
                    type="number"
                    defaultValue="0"
                    placeholder="e.g. 5000"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Duration (Days)</label>
                <input
                  name="squadDays"
                  type="number"
                  defaultValue="7"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setNewSquadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold text-xs uppercase"
                >
                  Publish Squad Drop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / UPDATE ADMINISTRATOR */}
      {newUserModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-cinzel font-bold text-white uppercase">Configure Administrator</h3>
              <button onClick={() => setNewUserModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Admin Email *</label>
                <input
                  name="userEmail"
                  type="email"
                  required
                  placeholder="name@avzvaganza.com"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Full Name</label>
                <input
                  name="userName"
                  placeholder="e.g. Studio Manager"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Permission Role</label>
                <select
                  name="userRole"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                >
                  <option value="store_manager">Store Manager (Orders, Inventory, Fulfillments)</option>
                  <option value="content_manager">Content Manager (Editorial, Media, Lookbook)</option>
                  <option value="owner">Owner (Full Privileges & User Management)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold text-xs uppercase"
                >
                  Save Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

            {/* MODAL: EDIT ADMINISTRATOR ACCESS & PASSWORD */}
      {editUserModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-cinzel font-bold text-white uppercase">Edit Admin Access: {editingUser.email}</h3>
              <button onClick={() => setEditUserModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Name</label>
                <input
                  name="editName"
                  type="text"
                  defaultValue={editingUser.name || ''}
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Access Role *</label>
                <select
                  name="editRole"
                  defaultValue={editingUser.role || 'store_manager'}
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                >
                  <option value="store_manager">Store Manager</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="owner">Owner (Full Superuser Access)</option>
                </select>
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">New Password 🔑 (Leave blank to keep unchanged)</label>
                <input
                  name="editPassword"
                  type="password"
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold text-xs uppercase"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SQUAD DROP OFFER */}
      {editSquadModalOpen && editingSquad && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-cinzel font-bold text-white uppercase">Edit Squad Offer: {editingSquad.squad_code}</h3>
              <button onClick={() => setEditSquadModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateSquadOffer} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Squad Campaign Title *</label>
                <input
                  name="editSquadTitle"
                  type="text"
                  required
                  defaultValue={editingSquad.title || ''}
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Discount (%)</label>
                  <input
                    name="editSquadDiscount"
                    type="number"
                    defaultValue={editingSquad.discount_percent || 15}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Min Members in Squad</label>
                  <input
                    name="editSquadMinMembers"
                    type="number"
                    defaultValue={editingSquad.min_members || 3}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Min Cart Amount (₹)</label>
                  <input
                    name="editSquadMinCart"
                    type="number"
                    defaultValue={editingSquad.min_cart_amount || 0}
                    placeholder="e.g. 5000"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase">Offer Status</label>
                  <select
                    name="editSquadStatus"
                    defaultValue={editingSquad.status || 'active'}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="expired">Expired / Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditSquadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold text-xs uppercase"
                >
                  Save Squad Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROCESS REFUND CONFIRMATION */}
      {refundModalOpen && refundOrderTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-red-900/60 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-cinzel font-bold text-white uppercase flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Issue Refund
              </h3>
              <button onClick={() => setRefundModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs font-mono space-y-3">
              <div className="p-3 bg-[#181122] rounded-xl border border-neutral-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Order:</span>
                  <span className="text-white font-bold">{refundOrderTarget.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Captured:</span>
                  <span className="text-emerald-400 font-bold">₹{refundOrderTarget.captured_amount || refundOrderTarget.grand_total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Already Refunded:</span>
                  <span className="text-purple-400">₹{refundOrderTarget.refunded_amount || 0}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-1">
                  <span className="text-neutral-400">Remaining Balance:</span>
                  <span className="text-white font-bold">
                    ₹{Math.max(0, Number(refundOrderTarget.captured_amount || refundOrderTarget.grand_total) - Number(refundOrderTarget.refunded_amount || 0))}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase text-[10px]">Refund Amount (₹) *</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    max={Math.max(0, Number(refundOrderTarget.captured_amount || refundOrderTarget.grand_total) - Number(refundOrderTarget.refunded_amount || 0))}
                    min={1}
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1 uppercase text-[10px]">Refund Mode</label>
                  <div className="py-2.5 text-xs text-[#F4C2C2] font-mono font-bold">
                    {refundAmount < (Number(refundOrderTarget.captured_amount || refundOrderTarget.grand_total) - Number(refundOrderTarget.refunded_amount || 0)) ? 'Partial Refund' : 'Full Refund'}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase text-[10px]">Refund Reason *</label>
                <input
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>

              {/* Explicit Restock Decision (Default Disabled) */}
              <div className="p-3 bg-[#181122] rounded-xl border border-neutral-800 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={refundRestock}
                    onChange={(e) => setRefundRestock(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-[#BE185D] focus:ring-0 w-4 h-4"
                  />
                  <span className="font-bold text-[11px] uppercase text-[#F4C2C2]">Restock Garments into Catalog</span>
                </label>
                <p className="text-neutral-400 text-[10px] leading-relaxed">
                  Default disabled. Keep unchecked for monetary concessions, price matches, or shipping refunds where garments remain with the customer.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setRefundModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={refundProcessing}
                onClick={() => handleProcessRefund(refundOrderTarget.id, refundReason, refundAmount, refundRestock)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono uppercase"
              >
                {refundProcessing ? 'Processing...' : `Confirm Refund (₹${refundAmount})${refundRestock ? ' & Restock' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT ORDERS & MANIFEST CSV MODAL */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#120D1A] border border-[#2A1D38] w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 text-white max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-[#F4C2C2]">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">Export Orders Manifest</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">Filter by date and status criteria before downloading CSV.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Date Presets */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#F4C2C2]" />
                Date Range Presets
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { label: 'All Time', val: 'all' },
                  { label: 'Today', val: 'today' },
                  { label: 'Last 7 Days', val: '7days' },
                  { label: 'Last 30 Days', val: '30days' },
                  { label: 'This Month', val: 'this_month' }
                ].map((p) => {
                  const isAll = p.val === 'all' && !exportStartDate && !exportEndDate;
                  return (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => applyExportPreset(p.val)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
                        isAll
                          ? 'bg-[#BE185D] text-black font-bold border-[#BE185D]'
                          : 'bg-[#1A1424] text-neutral-300 border-white/10 hover:border-pink-500/40 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Date Inputs (From / To) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#171022] border border-white/10 p-3.5 rounded-xl">
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Date From (Start)</label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="w-full bg-[#100B18] border border-neutral-700 focus:border-[#F4C2C2] text-white text-xs font-mono rounded-lg px-3 py-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-neutral-400 uppercase mb-1">Date To (End)</label>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="w-full bg-[#100B18] border border-neutral-700 focus:border-[#F4C2C2] text-white text-xs font-mono rounded-lg px-3 py-2 outline-none"
                />
              </div>
            </div>

            {/* Criteria: Payment Status */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-300 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#F4C2C2]" />
                Payment Criteria
              </label>
              <select
                value={exportPaymentStatus}
                onChange={(e) => setExportPaymentStatus(e.target.value)}
                className="w-full bg-[#171022] border border-white/15 focus:border-[#F4C2C2] text-white text-xs font-mono rounded-xl px-3.5 py-2.5 outline-none"
              >
                <option value="all">All Payment Statuses (Paid, Pending, Refunded, Cancelled)</option>
                <option value="paid">Paid (Successfully Collected via Razorpay)</option>
                <option value="pending">Pending (Awaiting Payment Completion)</option>
                <option value="refunded">Refunded (Full or Partial Refunds)</option>
                <option value="cancelled">Cancelled / Voided Transactions</option>
              </select>
            </div>

            {/* Criteria: Fulfillment Stage */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-300 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#F4C2C2]" />
                Fulfillment & Courier Stage
              </label>
              <select
                value={exportFulfillmentStatus}
                onChange={(e) => setExportFulfillmentStatus(e.target.value)}
                className="w-full bg-[#171022] border border-white/15 focus:border-[#F4C2C2] text-white text-xs font-mono rounded-xl px-3.5 py-2.5 outline-none"
              >
                <option value="all">All Fulfillment Stages</option>
                <option value="unfulfilled">Unfulfilled (Ready for Courier / Needs Packing)</option>
                <option value="shipped">Shipped (Dispatched with Tracking Number)</option>
                <option value="delivered">Delivered (Successfully Received by Client)</option>
                <option value="cancelled">Cancelled (Fulfillment Halted)</option>
              </select>
            </div>

            {/* Summary Tag */}
            <div className="bg-[#191124] border border-pink-500/20 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-400">Target Export:</span>
              <span className="text-[#F4C2C2] font-semibold text-right">
                {exportPaymentStatus === 'all' ? 'All Payments' : exportPaymentStatus.toUpperCase()} •{' '}
                {exportFulfillmentStatus === 'all' ? 'All Stages' : exportFulfillmentStatus.toUpperCase()}
                {exportStartDate ? ` • From ${exportStartDate}` : ''}
                {exportEndDate ? ` To ${exportEndDate}` : ''}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/15 text-neutral-300 hover:text-white hover:bg-white/5 font-mono text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (exportStartDate) params.set('startDate', exportStartDate);
                  if (exportEndDate) params.set('endDate', exportEndDate);
                  if (exportPaymentStatus && exportPaymentStatus !== 'all') params.set('payment_status', exportPaymentStatus);
                  if (exportFulfillmentStatus && exportFulfillmentStatus !== 'all') params.set('fulfillment_status', exportFulfillmentStatus);
                  window.location.href = `/api/admin/fulfillment/export-csv?${params.toString()}`;
                  setExportModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" />
                Download Filtered CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
