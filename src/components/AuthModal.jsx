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
  MessageCircle
} from 'lucide-react';
import { BRAND_INFO, ASSET_MANIFEST } from '../data/brandData';
import { playSound } from '../utils/audio';

export default function AuthModal({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [vipAlerts, setVipAlerts] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

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

  // 2. Sign In Submit
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      playSound('metal');
      setStatusMessage({ type: 'error', text: 'Please enter your email and password.' });
      return;
    }

    playSound('snap');
    const signedInUser = {
      id: 'client_' + Date.now().toString(36),
      name: email.split('@')[0] || 'AVZ Client',
      email: email.trim(),
      isGuest: false,
      tier: 'Archive VIP Member',
      loginTime: new Date().toISOString()
    };

    onLogin?.(signedInUser);
    setStatusMessage({ type: 'success', text: 'Signed in successfully. Welcome back!' });
    setTimeout(() => {
      onClose?.();
    }, 700);
  };

  // 3. Create Account Submit
  const handleSignUpSubmit = (e) => {
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

    playSound('snap');
    const newUser = {
      id: 'client_' + Date.now().toString(36),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      isGuest: false,
      tier: 'Archive VIP Member',
      vipAlerts,
      loginTime: new Date().toISOString()
    };

    onLogin?.(newUser);
    setStatusMessage({ type: 'success', text: 'Account created! Welcome to AVZ Vaganza.' });
    setTimeout(() => {
      onClose?.();
    }, 700);
  };

  // 4. WhatsApp Quick Concierge
  const handleWhatsAppConcierge = () => {
    playSound('pip');
    const msg = encodeURIComponent(
      `Hello Dhrisni! I'm browsing AVZ Vaganza and would like VIP client access or assistance.`
    );
    window.open(`https://wa.me/${BRAND_INFO.whatsapp}?text=${msg}`, '_blank');
  };

  // 5. Sign Out
  const handleSignOut = () => {
    playSound('snap');
    onLogout?.();
    setStatusMessage({ type: 'success', text: 'Signed out of session.' });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[99998] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in select-none overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="auth-modal-card w-full max-w-md bg-[#0d0714] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col text-left relative my-auto"
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
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all active:scale-95"
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

        {/* IF USER IS ALREADY LOGGED IN: ACTIVE PROFILE VIEW */}
        {user ? (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink/20 border border-pink/40 flex items-center justify-center text-pink font-mono font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white uppercase">
                      {user.name}
                    </h3>
                    <span className="text-[10px] font-mono text-pink tracking-wider uppercase block">
                      {user.tier || (user.isGuest ? 'VIP Guest Pass' : 'Archive VIP Member')}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <div className="text-xs font-montserrat text-zinc-300 border-t border-white/10 pt-2.5 space-y-1">
                <p className="text-[11px] text-zinc-400">
                  Email: <span className="text-white font-mono">{user.email}</span>
                </p>
                {user.isGuest && (
                  <p className="text-[11px] text-pink-300/90 leading-relaxed">
                    You are browsing with temporary Guest status. Your cart items and saved favorites are stored on this device.
                  </p>
                )}
              </div>
            </div>

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
                  Upgrade to Permanent Account
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
        ) : (
          /* USER NOT LOGGED IN: GUEST CARD + TABS (SIGN IN / SIGN UP) */
          <div className="space-y-5">
            {/* 1. HERO "EXPLORE AS A GUEST" BUTTON */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 via-pink/10 to-black border border-pink/35 relative overflow-hidden group hover:border-pink/60 transition-all shadow-[0_8px_30px_rgba(244,194,194,0.1)]">
              <div className="flex items-center justify-between mb-2">
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

              <p className="text-xs text-zinc-300 font-montserrat leading-relaxed mb-3">
                No sign-up or password required. Explore pieces, save favorites, and place custom orders instantly.
              </p>

              <button
                type="button"
                onClick={handleExploreAsGuest}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink via-purple-400 to-pink-300 hover:brightness-110 text-black font-mono text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <Compass className="w-4 h-4 text-black" />
                <span>Explore as a Guest</span>
                <ArrowRight className="w-3.5 h-3.5 text-black" />
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0d0714] px-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500 shrink-0">
                OR CLIENT LOGIN
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

            {/* FORM: SIGN IN */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Email Address or Phone
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
                    <input
                      type="text"
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
                        alert('Password reset link sent to your registered email or phone.');
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
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <User className="w-4 h-4" />
                  Sign In
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
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none transition-colors"
                  />
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink to-purple-500 hover:from-pink-300 hover:to-purple-400 text-black font-mono text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Create VIP Account
                </button>
              </form>
            )}

            {/* DIRECT WHATSAPP CONCIERGE ASSISTANCE */}
            <div className="pt-2 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={handleWhatsAppConcierge}
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-mono text-[11px] tracking-wider transition-colors cursor-pointer py-1"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Need help? Chat with AVZ Studio Concierge</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
