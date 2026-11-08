import { useModalScrollLock } from '../utils/modalScrollLock';
import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Sparkles,
  Compass,
  Check,
  Eye,
  EyeOff,
  LogOut,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  KeyRound,
  Loader2,
  Send,
  ArrowLeft,
  Package,
  Clock,
  AlertTriangle,
  RotateCcw,
  FileText,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';
import { authClient } from '../lib/auth-client';

function GoogleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function AuthModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  onTrackOrder
}) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Assam');
  const [pincode, setPincode] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [vipAlerts, setVipAlerts] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Client Order History & Cancellation State (Up to 6 Months)
  const [userTab, setUserTab] = useState('orders'); // 'orders' | 'profile'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of mind');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  // Load user profile delivery details when VIP profile opens
  useEffect(() => {
    if (user && !user.isGuest && user.email) {
      if (user.phone) {
        const raw = String(user.phone);
        const digits = raw.replace(/\D/g, '');
        const clean = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
        setPhoneDigits(clean.slice(0, 10));
      }
      if (user.address) setAddress(user.address);
      if (user.city) setCity(user.city);
      if (user.state) setStateName(user.state);
      if (user.pincode) setPincode(user.pincode);

      fetch(`/api/storefront/user-profile?email=${encodeURIComponent(user.email)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && data.profile) {
            const p = data.profile;
            if (p.name && !name) setName(p.name);
            if (p.phone) {
              const digits = p.phone.replace(/\D/g, '');
              const clean = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
              setPhoneDigits(clean.slice(0, 10));
              setPhone(p.phone);
            }
            if (p.address) setAddress(p.address);
            if (p.city) setCity(p.city);
            if (p.state) setStateName(p.state);
            if (p.pincode) setPincode(p.pincode);
          }
        })
        .catch(() => {});
    }
  }, [user, isOpen]);

  // Fetch 6-month order history when modal opens for a logged-in non-guest user
  useEffect(() => {
    if (!isOpen || !user || user.isGuest || !user.email) return;

    setLoadingOrders(true);
    fetch('/api/storefront/orders/my-orders', {
      headers: {
        'x-user-email': user.email
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingOrders(false);
      });
  }, [isOpen, user]);

  const handleCancelOrderSubmit = async (e) => {
    e.preventDefault();
    if (!cancellingOrder) return;

    setIsCancelling(true);
    setCancelSuccessMsg('');
    try {
      const res = await fetch('/api/storefront/orders/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': user.email
        },
        body: JSON.stringify({
          orderId: cancellingOrder.id,
          orderNumber: cancellingOrder.orderNumber,
          reason: cancelReason,
          userEmail: user.email
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound('sparkle');
        setCancelSuccessMsg(`Order ${cancellingOrder.orderNumber} successfully cancelled. Items restocked.`);
        setOrders((prev) =>
          prev.map((o) =>
            o.id === cancellingOrder.id
              ? {
                  ...o,
                  fulfillmentStatus: 'cancelled',
                  paymentStatus: 'cancelled',
                  canCancel: false,
                  cancellationReason: cancelReason
                }
              : o
          )
        );
        setTimeout(() => {
          setCancellingOrder(null);
          setCancelSuccessMsg('');
        }, 2000);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to cancel order.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Network error processing cancellation.' });
    } finally {
      setIsCancelling(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset status on tab switch or open
  useEffect(() => {
    setStatusMessage(null);
    setLoading(false);
  }, [activeTab, isOpen]);

  if (!isOpen) return null;

  // 1. Instant Guest Mode Explorer
  const handleExploreAsGuest = () => {
    playSound('snap');
    const guestUser = {
      id: 'guest_' + Date.now().toString(36),
      name: 'Guest Client',
      email: 'guest@avzvaganza.com',
      isGuest: true,
      tier: 'Guest VIP Explorer',
      loginTime: new Date().toISOString()
    };
    onLogin?.(guestUser);
    setStatusMessage({ type: 'success', text: 'Welcome! Exploring as VIP Guest.' });
    setTimeout(() => {
      onClose?.();
    }, 600);
  };

  // 2. Google OAuth 2.0 One-Click Login / Register
  const handleGoogleAuth = async () => {
    playSound('snap');
    setLoading(true);
    setStatusMessage(null);

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aveezahvaganza.com';
      const currentPath = typeof window !== 'undefined' ? (window.location.pathname + window.location.search) : '/';
      const callbackURL = `${origin}${currentPath}`;

      // 1. Try Better Auth client
      const res = await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      });

      // Explicitly redirect if Better Auth returned the target Google URL
      const targetUrl = res?.data?.url || res?.url;
      if (targetUrl) {
        window.location.href = targetUrl;
        return;
      }

      if (res?.error) {
        playSound('metal');
        setStatusMessage({
          type: 'error',
          text:
            res.error.message ||
            'Google OAuth not configured. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.'
        });
        setLoading(false);
        return;
      }

      // 2. Direct API fallback if client returned without immediate navigation
      const directRes = await fetch('/api/auth/sign-in/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          callbackURL,
        }),
      });

      if (directRes.ok) {
        const directData = await directRes.json();
        if (directData?.url) {
          window.location.href = directData.url;
          return;
        }
      }

      setLoading(false);
    } catch (err) {
      console.warn('Better Auth client Google sign-in failed, trying direct endpoint:', err);
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://aveezahvaganza.com';
        const callbackURL = `${origin}/`;
        const directRes = await fetch('/api/auth/sign-in/social', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider: 'google',
            callbackURL,
          }),
        });

        if (directRes.ok) {
          const directData = await directRes.json();
          if (directData?.url) {
            window.location.href = directData.url;
            return;
          }
        }
      } catch (fallbackErr) {
        console.error('Direct fallback also failed:', fallbackErr);
      }

      playSound('metal');
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Google authentication encountered an issue.'
      });
      setLoading(false);
    }
  };

  // 3. Email & Password Sign In
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Please enter your email and password.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (res.error) {
        playSound('metal');
        setStatusMessage({
          type: 'error',
          text: res.error.message || 'Invalid email or password.'
        });
        setLoading(false);
        return;
      }

      playSound('snap');
      const signedInUser = {
        id: res.data?.user?.id || ('client_' + Date.now().toString(36)),
        name: res.data?.user?.name || email.split('@')[0] || 'AVZ Client',
        email: res.data?.user?.email || email.trim(),
        image: res.data?.user?.image,
        emailVerified: res.data?.user?.emailVerified || false,
        isGuest: false,
        tier: 'Archive VIP Member',
        loginTime: new Date().toISOString()
      };

      onLogin?.(signedInUser);
      setStatusMessage({ type: 'success', text: 'Signed in successfully. Welcome back!' });
      setTimeout(() => {
        onClose?.();
        setLoading(false);
      }, 700);
    } catch (err) {
      playSound('metal');
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Sign in failed. Please verify credentials.'
      });
      setLoading(false);
    }
  };

  // 4. Create Permanent VIP Account
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Please enter your name or alias.' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (password.length < 6) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (phoneDigits && phoneDigits.length !== 10) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'WhatsApp / Phone number must be strictly 10 digits.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      });

      if (res.error) {
        playSound('metal');
        setStatusMessage({
          type: 'error',
          text:
            res.error.message ||
            'Registration failed. An account with this email may already exist.'
        });
        setLoading(false);
        return;
      }

      playSound('snap');
      const fullPhone = phoneDigits ? `${countryCode} ${phoneDigits}` : '';
      const newUser = {
        id: res.data?.user?.id || ('client_' + Date.now().toString(36)),
        name: res.data?.user?.name || name.trim(),
        email: res.data?.user?.email || email.trim(),
        image: res.data?.user?.image,
        emailVerified: res.data?.user?.emailVerified || false,
        phone: fullPhone,
        address: address.trim(),
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim(),
        isGuest: false,
        tier: 'Archive VIP Member',
        vipAlerts,
        loginTime: new Date().toISOString()
      };

      // Persist profile to server
      fetch('/api/storefront/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          phone: fullPhone,
          address: address.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim()
        })
      }).catch(() => {});

      onLogin?.(newUser);
      setStatusMessage({
        type: 'success',
        text: 'Account created! Welcome to AVZ Vaganza.'
      });
      setTimeout(() => {
        onClose?.();
        setLoading(false);
      }, 700);
    } catch (err) {
      playSound('metal');
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Account creation encountered an error.'
      });
      setLoading(false);
    }
  };

  // Save profile updates
  const handleSaveProfileDetails = async (e) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (phoneDigits && phoneDigits.length !== 10) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Phone number must be strictly 10 digits.' });
      return;
    }

    setSavingProfile(true);
    setProfileSuccessMsg('');

    try {
      const fullPhone = phoneDigits ? `${countryCode} ${phoneDigits}` : phone;
      const res = await fetch('/api/storefront/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: name || user.name,
          phone: fullPhone,
          address,
          city,
          state: stateName,
          pincode
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        playSound('sparkle');
        setProfileSuccessMsg('Profile delivery details saved successfully!');
        setIsEditingProfile(false);
        const updated = {
          ...user,
          name: name || user.name,
          phone: fullPhone,
          address,
          city,
          state: stateName,
          pincode
        };
        onLogin?.(updated);
        try {
          localStorage.setItem('avz_user', JSON.stringify(updated));
        } catch {}
      } else {
        playSound('metal');
        setStatusMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Error saving profile details.' });
    } finally {
      setSavingProfile(false);
    }
  };

  // 5. Forgot Password Request (Resend email delivery)
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const res = await authClient.forgetPassword({
        email: forgotEmail.trim(),
        redirectTo,
      });

      if (res?.error) {
        playSound('metal');
        setStatusMessage({
          type: 'error',
          text: res.error.message || 'Unable to process reset request.'
        });
      } else {
        playSound('snap');
        setStatusMessage({
          type: 'success',
          text: 'Password reset link sent to your email. Check your inbox.'
        });
      }
    } catch (err) {
      playSound('metal');
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Password reset request failed.'
      });
    } finally {
      setLoading(false);
    }
  };

  // 6. WhatsApp Support
  const handleWhatsAppSupport = () => {
    playSound('pip');
    const msg = encodeURIComponent(
      `Hello Dhrisni! I'm browsing AVZ Vaganza and would like VIP client access or assistance.`
    );
    window.open(`https://wa.me/${BRAND_INFO.whatsapp}?text=${msg}`, '_blank');
  };
  const handleWhatsAppConcierge = handleWhatsAppSupport;

  // 7. Sign Out
  const handleSignOut = async () => {
    playSound('snap');
    try {
      await authClient.signOut();
    } catch {}
    onLogout?.();
    setStatusMessage({ type: 'success', text: 'Signed out of session.' });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99998] bg-black/92 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-fade-in select-none overflow-y-auto overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" data-surface="dark" className="auth-modal-card modal-card w-full max-w-md bg-[#0d0714] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col text-left relative my-auto"
      >
        {/* Header Close & Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <img
                src={ASSET_MANIFEST.logo}
                alt="AVZ"
                className="w-full h-full object-contain avz-logo-highest-brightness"
              />
            </div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase">
              AVZ CLIENT ACCESS
            </span>
          </div>

          <button
            onClick={() => {
              playSound('pip');
              onClose?.();
            }}
            aria-label="Close modal"
            className="p-1.5 text-zinc-400 hover:text-white hover:rotate-90 flex items-center justify-center cursor-pointer transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Message Banner */}
        {statusMessage && (
          <div
            className={`mb-4 px-3.5 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/50 border border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <X className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* IF USER IS ALREADY LOGGED IN: ACTIVE PROFILE & ORDER HISTORY */}
        {user ? (
          <div className="space-y-4">
            {/* Tab Selector between Order History and Profile */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  playSound('snap');
                  setUserTab('orders');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userTab === 'orders'
                    ? 'bg-gradient-to-r from-pink to-purple-600 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders</span>
                {orders.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${userTab === 'orders' ? 'bg-black text-pink' : 'bg-pink/20 text-pink'}`}>
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('snap');
                  setUserTab('profile');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  userTab === 'profile'
                    ? 'bg-gradient-to-r from-pink to-purple-600 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>VIP Profile</span>
              </button>
            </div>

            {/* TAB 1: ORDER HISTORY & CANCELLATIONS (6 MONTH ROLLING ACCESS) */}
            {userTab === 'orders' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-pink" />
                    Past 6 Months History
                  </span>
                  <span className="text-[10px] text-zinc-500">DPDP Act Compliant</span>
                </div>

                {/* Cancellation In-Modal Dialog */}
                {cancellingOrder && (
                  <form
                    onSubmit={handleCancelOrderSubmit}
                    className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3 animate-fade-in"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                          Cancel Order {cancellingOrder.orderNumber}?
                        </h4>
                        <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                          Garment items will be automatically restocked into atelier inventory. If paid online, an automated full refund is initiated to your payment source.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono uppercase text-zinc-400">
                        Reason for Cancellation
                      </label>
                      <select
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 font-mono"
                      >
                        <option value="Change of mind">Change of mind</option>
                        <option value="Incorrect sizing or delivery address">Incorrect sizing or delivery address</option>
                        <option value="Selected wrong payment method">Selected wrong payment method</option>
                        <option value="Ordered another piece in collection">Ordered another piece in collection</option>
                        <option value="Delivery timeline concern">Delivery timeline concern</option>
                        <option value="Other reason">Other reason</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isCancelling}
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          'Confirm Cancellation'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancellingOrder(null)}
                        disabled={isCancelling}
                        className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 font-mono text-xs font-medium cursor-pointer"
                      >
                        Keep Order
                      </button>
                    </div>
                  </form>
                )}

                {/* Cancellation Success Feedback */}
                {cancelSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 font-mono text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{cancelSuccessMsg}</span>
                  </div>
                )}

                {/* Orders List Container */}
                {loadingOrders ? (
                  <div className="py-12 text-center space-y-2">
                    <Loader2 className="w-6 h-6 text-pink animate-spin mx-auto" />
                    <p className="text-xs font-mono text-zinc-400">Loading purchase ledger...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-10 text-center space-y-3 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <Package className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="text-xs font-mono text-zinc-400">
                      No purchase orders recorded in the past 6 months.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('snap');
                        onClose?.();
                      }}
                      className="inline-block py-2 px-4 rounded-xl bg-gradient-to-r from-pink to-purple-500 text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Explore Atelier Catalog
                    </button>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {orders.map((ord) => {
                      const isCancelled = ord.fulfillmentStatus === 'cancelled' || ord.paymentStatus === 'cancelled';
                      const isPaid = ord.paymentStatus === 'paid';
                      const isShipped = ord.fulfillmentStatus === 'shipped';
                      const isDelivered = ord.fulfillmentStatus === 'delivered';

                      return (
                        <div
                          key={ord.id}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isCancelled
                              ? 'bg-rose-950/20 border-rose-500/30'
                              : 'bg-white/5 border-white/10 hover:border-pink/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-mono font-bold text-xs text-white block">
                                {ord.orderNumber}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400">
                                {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {/* Payment badge */}
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                                  isCancelled
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : isPaid
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {isCancelled ? 'CANCELLED' : isPaid ? 'PAID' : ord.paymentMethod || 'COD'}
                              </span>

                              {/* Fulfillment badge */}
                              {!isCancelled && (
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                                    isDelivered
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                      : isShipped
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                      : 'bg-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  {ord.fulfillmentStatus}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Items Preview */}
                          <div className="border-t border-white/5 pt-2 space-y-1.5">
                            {(ord.items || []).map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-zinc-200 line-clamp-1 font-montserrat">
                                  {item.name || item.title || 'Wearable Art'}
                                  {item.size ? ` (${item.size})` : ''}
                                  <span className="text-zinc-400 font-mono text-[11px] ml-1">x{item.quantity || 1}</span>
                                </span>
                                <span className="font-mono text-pink text-[11px] shrink-0 font-bold">
                                  ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Grand Total & Courier */}
                          <div className="border-t border-white/5 pt-2 mt-2 flex justify-between items-center">
                            <span className="text-xs font-mono font-bold text-white">
                              Total: ₹{ord.grandTotal?.toLocaleString('en-IN')}
                            </span>

                            {ord.trackingNumber && (
                              <span className="text-[10px] font-mono text-purple-300">
                                {ord.carrier}: {ord.trackingNumber}
                              </span>
                            )}
                          </div>

                          {/* Cancellation Note if Cancelled */}
                          {isCancelled && ord.cancellationReason && (
                            <div className="mt-2 text-[10px] font-mono text-rose-300/80 bg-rose-950/40 p-1.5 rounded border border-rose-500/20">
                              Cancelled: {ord.cancellationReason}
                            </div>
                          )}

                          {/* Action Buttons: Cancel Order & Real-Time Tracking */}
                          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                playSound('warp');
                                if (onTrackOrder) {
                                  onTrackOrder(ord.orderNumber);
                                }
                              }}
                              className="text-[10px] font-mono text-zinc-300 hover:text-pink flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink/40"
                            >
                              <FileText className="w-3 h-3 text-pink" />
                              <span>Track Ticket</span>
                            </button>

                            {ord.canCancel && (
                              <button
                                type="button"
                                onClick={() => {
                                  playSound('snap');
                                  setCancellingOrder(ord);
                                }}
                                className="py-1 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VIP PROFILE CARD */}
            {userTab === 'profile' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border border-pink/40 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-pink/20 border border-pink/40 flex items-center justify-center text-pink font-mono font-bold text-sm">
                          {user.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                      )}
                      <div>
                        <h3 className="font-mono text-sm font-bold text-white uppercase">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-pink tracking-wider uppercase block">
                            {user.tier || (user.isGuest ? 'VIP Guest Pass' : 'Archive VIP Member')}
                          </span>
                          {user.emailVerified && (
                            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[8px] font-mono uppercase rounded border border-emerald-500/30">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>

                  <div className="text-xs font-montserrat text-zinc-300 border-t border-white/10 pt-2.5 space-y-1.5">
                    <p className="text-[11px] text-zinc-400">
                      Email: <span className="text-white font-mono">{user.email}</span>
                    </p>
                    {user.phone && (
                      <p className="text-[11px] text-zinc-400">
                        Phone: <span className="text-white font-mono">{user.phone}</span>
                      </p>
                    )}
                    {user.address && (
                      <p className="text-[11px] text-zinc-400">
                        Address: <span className="text-white">{user.address}, {user.city} {user.pincode}</span>
                      </p>
                    )}
                    {user.isGuest && (
                      <p className="text-[11px] text-pink-300/90 leading-relaxed">
                        You are browsing with temporary Guest status. Your cart items and saved favorites are stored on this device.
                      </p>
                    )}
                  </div>
                </div>

                {/* EDITABLE DELIVERY ADDRESS SECTION */}
                {!user.isGuest && (
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-pink" />
                        <span>Saved Delivery & Contact Details</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="text-[11px] font-mono text-pink hover:underline cursor-pointer"
                      >
                        {isEditingProfile ? 'Cancel' : 'Edit Details ✏️'}
                      </button>
                    </div>

                    {profileSuccessMsg && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                        {profileSuccessMsg}
                      </div>
                    )}

                    {isEditingProfile ? (
                      <form onSubmit={handleSaveProfileDetails} className="space-y-3 pt-1 text-xs font-mono">
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={name || user.name || ''}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="w-full bg-black/70 border border-white/15 px-3 py-2 rounded-xl text-white outline-none focus:border-pink"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1">WhatsApp / Phone (Strictly 10 Digits)</label>
                          <div className="flex gap-2">
                            <div className="shrink-0 bg-black/70 border border-white/15 rounded-xl px-2.5 py-2 text-xs text-pink font-bold">
                              {countryCode}
                            </div>
                            <input
                              type="tel"
                              value={phoneDigits}
                              onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              placeholder="10-digit number"
                              maxLength={10}
                              className="flex-1 bg-black/70 border border-white/15 px-3 py-2 rounded-xl text-white outline-none focus:border-pink"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-zinc-400 mb-1">Street Address</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="House/Apartment, Street"
                            className="w-full bg-black/70 border border-white/15 px-3 py-2 rounded-xl text-white outline-none focus:border-pink"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">City</label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="City"
                              className="w-full bg-black/70 border border-white/15 px-3 py-2 rounded-xl text-white outline-none focus:border-pink"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-zinc-400 mb-1">Pincode</label>
                            <input
                              type="text"
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="Pincode"
                              maxLength={6}
                              className="w-full bg-black/70 border border-white/15 px-3 py-2 rounded-xl text-white outline-none focus:border-pink"
                            />
                          </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            disabled={savingProfile}
                            className="px-4 py-2 rounded-full bg-white hover:bg-pink text-black font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50"
                          >
                            {savingProfile ? 'Saving...' : 'Save Profile Details'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-[11px] font-mono text-zinc-300 space-y-1">
                        <p><span className="text-zinc-500">Contact:</span> {phoneDigits ? `${countryCode} ${phoneDigits}` : user.phone || 'Not set'}</p>
                        <p><span className="text-zinc-500">Destination:</span> {address ? `${address}, ${city} ${pincode}` : 'No saved address'}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2.5">
                  {user.isGuest && (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('pip');
                        onLogout?.();
                        setActiveTab('signup');
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink to-purple-500 hover:from-pink-300 hover:to-purple-400 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      Upgrade to Permanent VIP Account
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      playSound('snap');
                      onClose?.();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    Continue Browsing
                  </button>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-rose-500/25 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out of Session
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* USER NOT LOGGED IN: GUEST CARD + GOOGLE + TABS (SIGN IN / SIGN UP / FORGOT) */
          <div className="space-y-4">
            {activeTab !== 'forgot' && (
              <>
                {/* 1. HERO "EXPLORE AS A GUEST" BUTTON */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 via-pink/10 to-black border border-pink/35 relative overflow-hidden group hover:border-pink/60 transition-all shadow-[0_8px_30px_rgba(244,194,194,0.1)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink animate-pulse" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                        Instant Guest Access
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-pink text-black font-bold">
                      Zero Friction
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 font-montserrat leading-relaxed mb-2.5">
                    No password required. Explore pieces, save favorites, and place custom orders instantly.
                  </p>

                  <button
                    type="button"
                    onClick={handleExploreAsGuest}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink via-purple-400 to-pink-300 hover:brightness-110 text-black font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-95 transition-all"
                  >
                    <Compass className="w-4 h-4 text-black" />
                    <span>Explore as a Guest</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>

                {/* 2. ONE-CLICK GOOGLE OAUTH 2.0 LOGIN */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleAuth}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>Continue with Google</span>
                </button>

                {/* DIVIDER */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#0d0714] px-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500 shrink-0">
                    OR WITH EMAIL
                  </span>
                  <div className="border-t border-white/10 w-full" />
                </div>

                {/* TAB SELECTOR: SIGN IN / CREATE ACCOUNT */}
                <div className="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pip');
                      setActiveTab('signin');
                    }}
                    className={`py-2 text-center rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'signin'
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pip');
                      setActiveTab('signup');
                    }}
                    className={`py-2 text-center rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'signup'
                        ? 'bg-white/15 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}

            {/* FORM: SIGN IN */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('pip');
                        setForgotEmail(email);
                        setActiveTab('forgot');
                      }}
                      className="text-[10px] font-mono text-pink hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-pink"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Remember Session</span>
                  </label>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> 256-bit Encrypted
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-pink" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>Sign In</span>
                </button>
              </form>
            )}

            {/* FORM: CREATE ACCOUNT */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Your Name / Alias *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Email Address *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <div className="shrink-0 bg-black/60 border border-white/15 rounded-xl px-2.5 py-2.5 text-xs text-pink font-mono font-bold flex items-center gap-1">
                      <span>🇮🇳</span>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-transparent text-pink outline-none cursor-pointer text-xs"
                      >
                        <option value="+91" className="bg-[#12091c] text-white">+91 (IN)</option>
                        <option value="+1" className="bg-[#12091c] text-white">+1 (US)</option>
                        <option value="+44" className="bg-[#12091c] text-white">+44 (UK)</option>
                        <option value="+971" className="bg-[#12091c] text-white">+971 (AE)</option>
                        <option value="+65" className="bg-[#12091c] text-white">+65 (SG)</option>
                      </select>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneDigits}
                      onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="flex-1 bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 block mt-1">
                    Strictly 10 digits ({phoneDigits.length}/10 entered)
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Delivery Address (For Faster Checkout)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat / Street Name"
                    className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Guwahati / Pune"
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="e.g. 781006"
                      maxLength={6}
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Password (min 6 characters) *
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-400 hover:text-zinc-200 pt-1">
                  <input
                    type="checkbox"
                    checked={vipAlerts}
                    onChange={(e) => setVipAlerts(e.target.checked)}
                    className="rounded accent-pink"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    Receive 1-of-1 Drop & Runway Alerts
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink to-purple-500 hover:from-pink-300 hover:to-purple-400 text-black font-mono text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Create VIP Account</span>
                </button>
              </form>
            )}

            {/* FORM: FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pip');
                      setActiveTab('signin');
                    }}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-white font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-pink">
                    PASSWORD RECOVERY
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-montserrat leading-relaxed">
                  Enter your registered client email to receive a secure password reset link via Resend.
                </p>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="client@domain.com"
                      className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink to-purple-500 hover:from-pink-300 hover:to-purple-400 text-black font-mono text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Send Reset Link</span>
                </button>
              </form>
            )}

            {/* DIRECT WHATSAPP CONCIERGE ASSISTANCE */}
            <div className="pt-2 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={handleWhatsAppSupport}
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-mono text-[11px] tracking-wider transition-colors cursor-pointer py-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Need help? Chat with Us on WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
