'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('aveezahstore@gmail.com');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to request passcode');
      }

      setStep('otp');
      if (data.otp) {
        setDemoOtp(data.otp);
        setCode(data.otp); // autofill for instant login during demo/audit
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid passcode');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-silver flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#301934]/40 via-[#BE185D]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0D0B10] border border-[#301934] rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#301934] to-black border border-[#BE185D]/40 rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-[#F4C2C2]" />
          </div>
          <h1 className="text-2xl font-black tracking-widest text-white uppercase font-cinzel">
            AVZ VAGANZA
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#F4C2C2] mt-1 font-mono">
            Admin Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 font-mono mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@avzvaganza.com"
                  required
                  className="w-full bg-[#16121D] border border-neutral-800 focus:border-[#F4C2C2] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div className="bg-[#16121D]/70 border border-[#301934] rounded-xl p-3 text-[11px] text-neutral-400">
              <span className="text-[#F4C2C2] font-semibold">Authorized Allowlist:</span> aveezahstore@gmail.com, dhrisni@aveezahvaganza.com, saksham@avzvaganza.com
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#BE185D] to-[#F4C2C2] hover:opacity-95 text-black font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Verifying Authorization...' : 'Dispatch One-Time Passcode'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-mono">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-[11px] text-[#F4C2C2] hover:underline"
                >
                  Change email
                </button>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full bg-[#16121D] border border-neutral-800 focus:border-[#F4C2C2] rounded-xl py-3 pl-10 pr-4 text-center tracking-[0.5em] text-lg font-mono font-bold text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {demoOtp && (
              <div
                onClick={() => setCode(demoOtp)}
                className="bg-[#301934]/60 border border-[#BE185D]/40 rounded-xl p-3 text-xs text-[#F4C2C2] cursor-pointer flex items-center justify-between hover:bg-[#301934]"
              >
                <span className="flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-[#F4C2C2]" />
                  Active Passcode: <strong className="text-white text-sm">{demoOtp}</strong>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-300">Tap to Autofill</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#BE185D] to-[#F4C2C2] hover:opacity-95 text-black font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Control Center'}
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-[#301934]/60 pt-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
            Secure Admin Access • Protected
          </p>
        </div>
      </div>
    </div>
  );
}
