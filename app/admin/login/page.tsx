'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('avz.vaganza@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-silver flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-tr from-[#301934]/40 via-[#BE185D]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0D0B10] border border-[#301934] rounded-2xl p-5 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
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

        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="avz.vaganza@gmail.com"
                required
                className="w-full bg-[#16121D] border border-neutral-800 focus:border-[#F4C2C2] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 font-mono mb-2">
              Administrator Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                required
                className="w-full bg-[#16121D] border border-neutral-800 focus:border-[#F4C2C2] rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-neutral-600 focus:outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#BE185D] to-[#F4C2C2] hover:opacity-95 text-black font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-neutral-500 font-mono tracking-wider">
            SECURE DIRECT ACCESS • SINGLE ADMINISTRATOR
          </p>
        </div>
      </div>
    </div>
  );
}
