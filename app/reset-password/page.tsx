'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authClient } from '@/src/lib/auth-client';
import { Lock, Eye, EyeOff, Check, X, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const errorParam = searchParams.get('error') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (errorParam) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid or expired password reset link. Please request a new one.',
      });
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setStatusMessage({
        type: 'error',
        text: 'Missing reset token. Please use the link sent to your email.',
      });
      return;
    }

    if (password.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'Password must be at least 6 characters.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (res.error) {
        setStatusMessage({
          type: 'error',
          text:
            res.error.message ||
            'Failed to reset password. The token may be expired.',
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Password updated successfully! Redirecting to home...',
        });
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0d0714] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col text-left relative">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atelier</span>
        </Link>
        <span className="font-mono text-[10px] tracking-[0.2em] text-pink uppercase font-bold">
          SECURITY PROTOCOL
        </span>
      </div>

      <div className="mb-6">
        <h1 className="font-mono text-lg font-bold text-white uppercase tracking-wider">
          Establish New Password
        </h1>
        <p className="text-xs text-zinc-400 font-montserrat mt-1">
          Enter a secure password for your AVZ client archive account.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`mb-5 px-3.5 py-2.5 rounded-xl font-mono text-xs flex items-center gap-2 ${
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            New Password (min 6 characters)
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
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/60 border border-white/15 focus:border-pink/60 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white font-mono outline-none transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink to-purple-500 hover:from-pink-300 hover:to-purple-400 text-black font-mono text-xs font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Updating Password...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#07030b] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Loading security gateway...
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
