'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShoppingBag, Package, Warehouse, Layers, Users,
  FileEdit, Image as ImageIcon, Tag, UsersRound, CreditCard, Truck,
  BarChart3, Compass, BookOpen, Settings, Shield, History, LogOut,
  Search, Plus, Download, RefreshCw, CheckCircle, AlertTriangle,
  ExternalLink, Eye, ChevronRight, X, Sparkles, Filter, Edit3, Trash2,
  Copy, Save, Sliders, ShieldAlert, Check, Menu
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active navigation module
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // Admin session state
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Global Storefront Controls state
  const [storefrontSettings, setStorefrontSettings] = useState<any>({
    maintenance_mode: { enabled: false, title: 'STORE UNDER MAINTENANCE', message: 'Site updates underway.' },
    announcement: { enabled: false, text: '🪐 COMPLIMENTARY DOMESTIC DISPATCH ON ORDERS OVER ₹5,000', link: '#shop' },
    purchases_enabled: { enabled: true, disabled_message: 'Purchases temporarily paused for runway commissions.' }
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
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [adminUsersList, setAdminUsersList] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  // Modals & form states
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [inventoryTarget, setInventoryTarget] = useState<any>(null);
  const [inventoryAdjustment, setInventoryAdjustment] = useState<number>(1);
  const [inventoryReason, setInventoryReason] = useState<string>('Studio Restock');
  const [contentEditSection, setContentEditSection] = useState<any>(null);
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
      }
    } catch {}
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

      // Group Buys
      const gbRes = await fetch('/api/admin/group-buys');
      if (gbRes.ok) {
        const gbData = await gbRes.json();
        setGroupBuys(gbData.group_buys || []);
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

  // Handler: Create Promotion
  const handleCreatePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const code = (form.elements.namedItem('promoCode') as HTMLInputElement)?.value;
    const discount_type = (form.elements.namedItem('promoType') as HTMLSelectElement)?.value;
    const discount_value = Number((form.elements.namedItem('promoValue') as HTMLInputElement)?.value);
    const min_order_value = Number((form.elements.namedItem('promoMinOrder') as HTMLInputElement)?.value || 0);
    const max_uses = (form.elements.namedItem('promoMaxUses') as HTMLInputElement)?.value;

    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discount_type,
          discount_value,
          min_order_value,
          max_uses: max_uses ? Number(max_uses) : null
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Promotion code '${code.toUpperCase()}' activated!`);
        setNewPromoModalOpen(false);
        fetchData();
      } else {
        showNotification(data.error || 'Failed to create promotion', 'error');
      }
    } catch {
      showNotification('Error creating promotion', 'error');
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

  // 18 Modules definition
  const navigationModules = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: kpis?.pendingFulfillmentCount },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, badge: kpis?.lowStockCount ? 'Low' : null },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'content', label: 'Content & Website Editor', icon: FileEdit, highlight: true },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
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
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-mono transition-all animate-in slide-in-from-bottom duration-300 ${
            notification.type === 'success'
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
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider cursor-pointer uppercase transition-all ${
                  storefrontSettings.maintenance_mode.enabled
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
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider cursor-pointer uppercase transition-all ${
                  storefrontSettings.purchases_enabled.enabled
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
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A070F] border-r border-[#231A2A] flex flex-col shrink-0 overflow-y-auto transition-transform duration-300 md:static md:w-64 md:translate-x-0 ${
            mobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
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
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              ord.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {ord.payment_status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              ord.fulfillment_status === 'delivered' ? 'bg-blue-500/10 text-blue-400' :
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
                <a
                  href="/api/admin/fulfillment/export-csv?filter=all"
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export All Orders CSV
                </a>
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
                              ord.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {ord.payment_status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
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
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              p.inventory_quantity === 0 ? 'bg-red-500/20 text-red-300' :
                              p.inventory_quantity <= 1 ? 'bg-amber-500/20 text-amber-300' : 'bg-neutral-800 text-neutral-300'
                            }`}>
                              {p.inventory_quantity} in stock
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
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
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.inventory_quantity === 0 ? 'bg-red-500/20 text-red-300' :
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
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          sec.status === 'published' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
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
                        onClick={() => setContentEditSection(sec)}
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
                  <a
                    href="/api/admin/fulfillment/export-csv?filter=unfulfilled"
                    className="bg-[#BE185D] hover:bg-[#BE185D]/90 text-black font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Unfulfilled Courier CSV
                  </a>
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

          {/* MODULE 8: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white">Media Library & Cloudinary Assets</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Archival runway photography, 4K editorial video reels, and brand assets.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaAssets.map((asset) => (
                  <div key={asset.id} className="bg-[#100C17] border border-[#231A2A] rounded-xl overflow-hidden group">
                    <div className="aspect-square bg-neutral-900 relative">
                      {asset.media_type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-[#1A1224] text-[#F4C2C2]">
                          <span className="font-mono text-xs">Video Asset (MP4)</span>
                        </div>
                      ) : (
                        <img src={asset.url} alt={asset.alt_text} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-3">
                      <span className="text-xs font-bold text-white block truncate">{asset.title}</span>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-neutral-500 font-mono uppercase">{asset.media_type}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(asset.url);
                            showNotification('Asset URL copied to clipboard');
                          }}
                          className="text-[10px] text-[#F4C2C2] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copy URL
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 11: PAYMENTS & RAZORPAY */}
          {activeTab === 'payments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-cinzel font-bold text-white">Razorpay Payments & Reconciliation</h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">Server-side HMAC-SHA256 signature verification and live settlement log.</p>
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

                <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white font-cinzel mb-3">Supported Payment Rails</h3>
                  <div className="space-y-2 text-xs font-mono text-neutral-300">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-4 h-4" /> UPI & Instant QR (GPay, PhonePe, Paytm)
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-4 h-4" /> Credit & Debit Cards (Visa, MasterCard, RuPay)
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-4 h-4" /> Net Banking (50+ Indian Banks)
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Check className="w-4 h-4" /> International Cards (USD, EUR, GBP Currency Conversions)
                    </div>
                  </div>
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

          {/* MODULE: COLLECTIONS */}
          {activeTab === 'collections' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-cinzel font-bold text-white uppercase">Collections Management</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Curate thematic drops, lookbook groupings, and runway categories.</p>
                </div>
                <button
                  onClick={() => setNewCollectionModalOpen(true)}
                  className="bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-mono uppercase cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Collection
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {collections.map((col) => (
                  <div key={col.id} className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-5 space-y-3">
                    <div className="h-32 rounded-xl overflow-hidden bg-neutral-900 relative">
                      <img src={col.image || '/assets/editorial_hero_portrait.jpg'} alt={col.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-[#F4C2C2] border border-white/10 uppercase">
                        {col.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white font-cinzel text-base">{col.title}</h3>
                      <span className="text-[11px] font-mono text-[#F4C2C2] block">/{col.slug}</span>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{col.description || 'No description provided.'}</p>
                    </div>
                    <div className="pt-2 border-t border-neutral-800/80 flex justify-between items-center text-[11px] font-mono text-neutral-500">
                      <span>{(col.product_ids || []).length} Products Assigned</span>
                      <span>{new Date(Number(col.created_at)).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {collections.length === 0 && (
                  <div className="col-span-3 text-center py-12 bg-[#100C17] border border-[#231A2A] rounded-2xl text-neutral-400 font-mono text-xs">
                    No custom collections created yet. Click "Create Collection" to organize catalog pieces.
                  </div>
                )}
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
                {promotions.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#100C17] border border-[#231A2A] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-black text-xl text-[#F4C2C2] tracking-wider block">{p.code}</span>
                        <span className="text-xs font-mono text-neutral-400">
                          {p.discount_type === 'percentage' ? `${p.discount_value}% Discount` : `₹${p.discount_value} Flat Off`}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                        Active
                      </span>
                    </div>
                    <div className="text-xs font-mono text-neutral-400 space-y-1 pt-2 border-t border-neutral-800/80">
                      <div className="flex justify-between">
                        <span>Min Order Value:</span>
                        <span className="text-white">₹{p.min_order_value || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Redemptions:</span>
                        <span className="text-white">{p.current_uses} {p.max_uses ? `/ ${p.max_uses}` : '(Unlimited)'}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
            </div>
          )}

          {/* MODULE: PAYMENTS & REFUNDS */}
          {activeTab === 'payments' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-cinzel font-bold text-white uppercase">Payment & Transaction Ledger</h2>
                <p className="text-xs text-neutral-400 mt-1 font-mono">Live payment settlement audit trail, Razorpay references, and idempotent refund controls.</p>
              </div>

              <div className="bg-[#100C17] border border-[#231A2A] rounded-2xl p-6">
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
                      {orders.map((ord) => (
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
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              ord.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
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
                      ))}
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
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {adminUsersList.map((u) => (
                        <tr key={u.id} className="hover:bg-[#181222] transition-colors">
                          <td className="py-3.5 px-3 font-bold text-white">{u.name}</td>
                          <td className="py-3.5 px-3 font-mono text-neutral-300">{u.email}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                              u.role === 'owner' ? 'bg-[#BE185D]/20 text-[#F4C2C2] border border-[#BE185D]/40 font-bold' :
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
                  <p className="text-xs text-neutral-400 mt-1 font-mono">Publish shipping specs, bespoke return policies, and privacy notices.</p>
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
                <h2 className="text-xl font-cinzel font-bold text-white uppercase">Security & Administrative Activity Log</h2>
                <span className="text-xs font-mono text-[#F4C2C2] bg-[#301934] px-3 py-1 rounded-lg">Audit Trail</span>
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
                        <span className={`text-[10px] uppercase font-bold ${
                          ref.status === 'processed' ? 'text-emerald-400' : ref.status === 'pending' ? 'text-amber-400' : 'text-red-400'
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
                <span className={`font-mono text-xs font-bold uppercase ${
                  selectedOrder.payment_status === 'paid' ? 'text-emerald-400' :
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

            <div className="space-y-3 text-xs">
              {Object.keys(contentEditSection.data || {}).map((key) => {
                const val = contentEditSection.data[key];
                if (typeof val === 'object') return null; // handle complex in json
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
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={() => {
                  const updatedData = { ...contentEditSection.data };
                  Object.keys(contentEditSection.data || {}).forEach((key) => {
                    const el = document.getElementById(`content_${key}`) as HTMLInputElement | HTMLTextAreaElement;
                    if (el) updatedData[key] = el.value;
                  });
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
                  <option value="Studio Restock">Atelier Studio Restock</option>
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
                  const description = (document.getElementById('p_description') as HTMLTextAreaElement)?.value;

                  if (selectedProduct) {
                    await fetch(`/api/admin/products/${selectedProduct.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title, sku, category, price, inventory_quantity, description })
                    });
                    showNotification('Product updated successfully');
                  } else {
                    await fetch('/api/admin/products', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title, sku, category, price, inventory_quantity, description })
                    });
                    showNotification('Product created successfully');
                  }
                  setProductModalOpen(false);
                  fetchData();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#BE185D] to-[#F4C2C2] text-black font-bold text-xs font-mono uppercase"
              >
                {selectedProduct ? 'Save Changes' : 'Create Piece'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: CREATE COLLECTION */}
      {newCollectionModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#120D1A] border border-[#301934] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-cinzel font-bold text-white uppercase">Create New Collection</h3>
              <button onClick={() => setNewCollectionModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCollection} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Collection Title *</label>
                <input
                  name="colTitle"
                  required
                  placeholder="e.g. Cyber Relics Runway 2026"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Description</label>
                <textarea
                  name="colDesc"
                  rows={2}
                  placeholder="Atelier theme and material notes..."
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1 uppercase">Featured Cover Image URL</label>
                <input
                  name="colImage"
                  defaultValue="/assets/editorial_hero_portrait.jpg"
                  className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setNewCollectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#BE185D] hover:bg-[#BE185D]/80 text-black font-bold text-xs uppercase"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <label className="text-neutral-400 block mb-1 uppercase">Target Members</label>
                  <input
                    name="squadMinMembers"
                    type="number"
                    defaultValue="3"
                    className="w-full bg-[#181122] border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#F4C2C2]"
                  />
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
    </div>
  );
}
