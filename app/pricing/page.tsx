'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u ?? null);
      if (u) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status')
          .eq('id', u.id)
          .single();
        setSubscriptionStatus(profile?.subscription_status ?? null);
      }
      setLoading(false);
    })();
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }
    if (subscriptionStatus === 'active') {
      setError('You already have an active subscription.');
      return;
    }
    setCheckoutLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create checkout session');
      if (data.url) window.location.href = data.url;
      else throw new Error('No checkout URL returned');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-soft-lavender/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-display font-semibold bg-gradient-to-r from-soft-lavender to-accent-moon bg-clip-text text-transparent">
            Dreams Saver
          </Link>
          <div className="flex items-center gap-6">
            {user ? (
              <Link href="/dashboard" className="text-muted-gray hover:text-soft-lavender transition-colors text-sm font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/#pricing" className="text-muted-gray hover:text-soft-lavender transition-colors text-sm font-medium">
                  Pricing
                </Link>
                <Link href="/login" className="text-muted-gray hover:text-soft-lavender transition-colors text-sm font-medium">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-center text-cloud-white mb-4">
          Choose your plan
        </h1>
        <p className="text-muted-gray text-center mb-14 max-w-xl mx-auto">
          Free: 5 AI insights. Unlimited: $8/month for unlimited AI insights. Cancel anytime.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl border border-soft-lavender/25 bg-deep-night-soft/80 p-8 flex flex-col">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-soft-lavender/20 text-soft-lavender mb-4 w-fit">
              Free forever
            </span>
            <h2 className="font-display text-2xl font-semibold text-cloud-white mb-2">Free</h2>
            <p className="text-3xl font-bold text-soft-lavender mb-6">$0<span className="text-lg font-normal text-muted-gray">/month</span></p>
            <ul className="space-y-3 text-muted-gray flex-1">
              <li className="flex gap-2">
                <span className="text-soft-lavender">✓</span>
                Unlimited dream recordings
              </li>
              <li className="flex gap-2">
                <span className="text-soft-lavender">✓</span>
                5 free AI insights (lifetime)
              </li>
              <li className="flex gap-2">
                <span className="text-soft-lavender">✓</span>
                Mood, tags, search, dashboard
              </li>
            </ul>
            {user && subscriptionStatus === 'free' && (
              <p className="mt-6 text-sm text-muted-gray">You’re on the free plan.</p>
            )}
          </div>

          {/* Unlimited */}
          <div className="rounded-2xl border-2 border-soft-lavender/50 bg-gradient-to-b from-soft-lavender/10 to-transparent p-8 flex flex-col shadow-lg shadow-soft-lavender/10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-soft-lavender/30 text-soft-lavender mb-4 w-fit">
              Unlimited insights
            </span>
            <h2 className="font-display text-2xl font-semibold text-cloud-white mb-2">Unlimited</h2>
            <p className="text-3xl font-bold text-soft-lavender mb-6">$8<span className="text-lg font-normal text-muted-gray">/month</span></p>
            <ul className="space-y-3 text-muted-gray flex-1">
              <li className="flex gap-2">
                <span className="text-soft-lavender">✓</span>
                Everything in Free
              </li>
              <li className="flex gap-2">
                <span className="text-soft-lavender">✓</span>
                Unlimited AI insights
              </li>
              <li className="flex gap-2">
                <span className="text-soft-lavender">✓</span>
                Cancel anytime
              </li>
            </ul>
            {subscriptionStatus === 'active' ? (
              <p className="mt-6 text-sm text-soft-lavender font-medium">You have an active subscription.</p>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={checkoutLoading}
                className="mt-6 w-full py-3 rounded-xl bg-soft-lavender text-deep-night font-semibold hover:bg-accent-moon transition-colors disabled:opacity-50"
              >
                {checkoutLoading ? 'Redirecting to checkout...' : user ? 'Upgrade to Unlimited' : 'Sign in to upgrade'}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mt-8 p-4 rounded-lg bg-red-900/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        <p className="text-center text-muted-gray text-sm mt-12">
          Secure payment via Stripe. You’ll be redirected to Stripe Checkout to complete your subscription.
        </p>
      </main>
    </div>
  );
}
