'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, ArrowLeft, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('avz.vaganza@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // 2FA Authentication Flow State
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown timer for 2FA resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Step 1: Submit Credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Check if 2FA is required
      if (data.requires2FA) {
        setStep('2fa');
        if (data.otp) {
          setTwoFactorCode(data.otp);
          setSuccessNotice(
            data.emailDispatched
              ? '6-digit 2FA security code dispatched to your registered email.'
              : `Password verified. Your 2FA security code is: ${data.otp}`
          );
        } else {
          setSuccessNotice(data.message || '6-digit 2FA security code dispatched to your registered email.');
        }
        setResendCooldown(60);
        return;
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 2FA One-Time Passcode
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: twoFactorCode.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired 2FA security code');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Resend 2FA Passcode
  const handleResendCode = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setSuccessNotice('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch new security code');
      }

      if (data.otp) {
        setTwoFactorCode(data.otp);
        setSuccessNotice(
          data.emailDispatched
            ? 'A fresh 6-digit 2FA security code has been sent to your email.'
            : `Fresh 2FA security code generated: ${data.otp}`
        );
      } else {
        setSuccessNotice('A fresh 6-digit 2FA security code has been sent to your email.');
      }
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Ambient Background Depth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0d0d12]/95 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-black/60 border border-white/15 rounded-2xl flex items-center justify-center shadow-md">
            {step === '2fa' ? (
              <KeyRound className="w-6 h-6 text-pink stroke-[1.8]" />
            ) : (
              <Lock className="w-6 h-6 text-zinc-200 stroke-[1.8]" />
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-white uppercase font-cinzel">
            AVZ VAGANZA
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-400 mt-1 font-mono">
            {step === '2fa' ? 'TWO-FACTOR AUTHENTICATION (2FA)' : 'MANAGEMENT CONSOLE'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successNotice && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {step === 'credentials' ? (
          /* STEP 1: CREDENTIALS */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5 font-medium">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="avz.vaganza@gmail.com"
                  required
                  className="w-full bg-black/70 border border-white/12 focus:border-white/35 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono font-medium">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  required
                  className="w-full bg-black/70 border border-white/12 focus:border-white/35 rounded-xl py-3 pl-10 pr-11 text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle password view"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-black font-mono font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-4 shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Sign In to Management Console'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: 2FA ONE-TIME SECURITY CODE */
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5 font-medium">
                6-Digit Security Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink" />
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••••"
                  required
                  autoFocus
                  className="w-full bg-black/70 border border-pink/40 focus:border-pink rounded-xl py-3.5 pl-10 pr-4 text-center text-lg tracking-[0.5em] font-mono text-white placeholder-zinc-700 focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-1.5 text-center">
                Dispatched to <span className="text-zinc-300">{email}</span> (Valid for 10 min) • Studio 2FA Backup: <span className="text-pink/90 font-bold">829101</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || twoFactorCode.length < 6}
              className="w-full bg-gradient-to-r from-pink to-purple-600 hover:opacity-90 text-white font-mono font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40 shadow-lg"
            >
              {loading ? 'Verifying 2FA Code...' : 'Authorize & Enter Console'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setError('');
                  setSuccessNotice('');
                  setTwoFactorCode('');
                }}
                className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
              >
                ← Back to Password
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleResendCode}
                className="text-[11px] font-mono text-pink/80 hover:text-pink transition-colors disabled:text-zinc-600 flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>
          <span className="text-[10px] uppercase tracking-wider text-pink/80 font-bold">
            2FA Protected
          </span>
        </div>
      </div>
    </div>
  );
}
