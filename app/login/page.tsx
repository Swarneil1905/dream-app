'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSignInWithGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(searchParams.get('redirect') || '/dashboard')}`
        : '/auth/callback';
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (oauthError) throw oauthError;
      // Supabase will redirect the browser to Google, so we don't need to do anything else
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start Google sign in');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-block font-display text-xl font-semibold bg-gradient-to-r from-soft-lavender to-accent-moon bg-clip-text text-transparent mb-8">
          Dreams Saver
        </Link>
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2 text-cloud-white">Welcome back</h1>
          <p className="text-muted-gray">Sign in to continue your dream journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="button"
            onClick={handleSignInWithGoogle}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-soft-lavender/40 bg-white/5 text-cloud-white font-medium hover:bg-white/10 hover:border-soft-lavender/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-soft-lavender/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-deep-night text-muted-gray">or continue with email</span>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-muted-gray">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field rounded-xl focus:ring-2 focus:ring-soft-lavender/30"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-muted-gray">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field rounded-xl focus:ring-2 focus:ring-soft-lavender/30"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-xl py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-astral-blue/20"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-muted-gray">
            Don&apos;t have an account?{' '}
            <Link href="/" className="text-soft-lavender hover:underline">
              Sign up with your first dream
            </Link>
          </p>
          <p className="text-center text-sm text-muted-gray">
            <Link href="/pricing" className="text-soft-lavender/80 hover:underline">
              View pricing
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
