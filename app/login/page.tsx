'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

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
