'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

export default function LandingPage() {
  const [dreamText, setDreamText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignInWithGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent('/dashboard')}`
        : '/auth/callback';
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (oauthError) throw oauthError;
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
      const response = await fetch('/api/auth/signup-with-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, dreamText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-20 border-b border-soft-lavender/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <span className="text-xl font-display font-semibold bg-gradient-to-r from-soft-lavender to-accent-moon bg-clip-text text-transparent">
            Dreams Saver
          </span>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-muted-gray hover:text-soft-lavender transition-colors text-sm font-medium">
              Pricing
            </a>
            <Link href="/login" className="text-muted-gray hover:text-soft-lavender transition-colors text-sm font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cloud-white via-soft-lavender to-accent-moon bg-clip-text text-transparent">
              Capture your dreams.
            </span>
            <br />
            <span className="text-soft-lavender-dim">Unlock their meaning.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-gray leading-relaxed max-w-2xl mx-auto mb-4">
            Record your dreams and receive personalized AI-powered insights with Gemini — reflective, supportive, and entirely private.
          </p>
          <p className="text-sm text-muted-gray/80">
            Start with one dream below. No credit card required.
          </p>
        </div>
      </section>

      {/* First Dream Form */}
      <section className="relative z-10 px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card border-soft-lavender/25 shadow-lg shadow-soft-lavender/5">
              <label htmlFor="dream" className="block font-display text-xl font-semibold mb-3 text-cloud-white">
                Share your first dream
              </label>
              <textarea
                id="dream"
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                className="textarea-field focus:ring-2 focus:ring-soft-lavender/30"
                placeholder="I was walking through a forest when..."
                required
              />
            </div>

            {!showSignInForm ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowSignInForm(true)}
                  className="btn-secondary w-full text-base py-3.5 rounded-xl font-medium border-soft-lavender/40 hover:border-soft-lavender/60 hover:bg-soft-lavender/10"
                >
                  Sign in to save your dream
                </button>
                <p className="text-center text-sm text-muted-gray">
                  New here? Click above to create an account with your dream.
                </p>
              </>
            ) : (
              <>
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
                    <span className="px-3 bg-deep-night text-muted-gray">or create account with email</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-base py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-astral-blue/20"
                >
                  {loading ? 'Creating account...' : 'Create account & save dream'}
                </button>

                <p className="text-center text-sm text-muted-gray">
                  Already have an account?{' '}
                  <Link href="/login" className="text-soft-lavender hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4 border-t border-soft-lavender/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-center mb-4 text-cloud-white">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-gray text-center mb-14 max-w-xl mx-auto">
            Record unlimited dreams. Choose how many AI insights you want.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free tier */}
            <div className="relative rounded-2xl border border-soft-lavender/25 bg-deep-night-soft/80 p-8 flex flex-col hover:border-soft-lavender/40 transition-colors duration-300">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-soft-lavender/20 text-soft-lavender mb-4">
                  Free forever
                </span>
                <h3 className="font-display text-2xl font-semibold text-cloud-white mb-2">Free</h3>
                <p className="text-3xl font-bold text-soft-lavender">$0<span className="text-lg font-normal text-muted-gray">/month</span></p>
              </div>
              <ul className="space-y-4 text-muted-gray flex-1">
                <li className="flex items-start gap-3">
                  <span className="text-soft-lavender mt-0.5">✓</span>
                  <span><strong className="text-cloud-white">Unlimited dream recordings</strong> — save as many dreams as you like</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-soft-lavender mt-0.5">✓</span>
                  <span><strong className="text-cloud-white">5 free AI insights</strong> — personalized Gemini analysis for your first 5 insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-soft-lavender mt-0.5">✓</span>
                  <span>Mood & tags, search, and full dashboard</span>
                </li>
              </ul>
              <p className="text-sm text-muted-gray mt-6">
                After 5 insights, upgrade anytime for unlimited.
              </p>
            </div>

            {/* Paid tier */}
            <div className="relative rounded-2xl border-2 border-soft-lavender/50 bg-gradient-to-b from-soft-lavender/10 to-transparent p-8 flex flex-col shadow-lg shadow-soft-lavender/10 hover:shadow-soft-lavender/20 transition-all duration-300">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-soft-lavender/30 text-soft-lavender mb-4">
                  Most popular
                </span>
                <h3 className="font-display text-2xl font-semibold text-cloud-white mb-2">Unlimited</h3>
                <p className="text-3xl font-bold text-soft-lavender">$8<span className="text-lg font-normal text-muted-gray">/month</span></p>
              </div>
              <ul className="space-y-4 text-muted-gray flex-1">
                <li className="flex items-start gap-3">
                  <span className="text-soft-lavender mt-0.5">✓</span>
                  <span><strong className="text-cloud-white">Everything in Free</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-soft-lavender mt-0.5">✓</span>
                  <span><strong className="text-cloud-white">Unlimited AI insights</strong> — get Gemini analysis on every dream</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-soft-lavender mt-0.5">✓</span>
                  <span>Cancel anytime. Access until period end.</span>
                </li>
              </ul>
              <Link
                href="/pricing"
                className="mt-6 inline-flex justify-center items-center px-6 py-3 rounded-xl bg-soft-lavender text-deep-night font-semibold hover:bg-accent-moon transition-colors"
              >
                Upgrade to Unlimited
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="text-4xl mb-4 animate-float">✨</div>
              <h3 className="font-display text-xl font-semibold mb-2 text-cloud-white">AI insights</h3>
              <p className="text-muted-gray text-sm leading-relaxed">
                Personalized interpretations powered by Gemini — summary, emotional tone, and symbolic reflection.
              </p>
            </div>
            <div className="text-center group">
              <div className="text-4xl mb-4 animate-float" style={{ animationDelay: '1s' }}>🌙</div>
              <h3 className="font-display text-xl font-semibold mb-2 text-cloud-white">Unlimited dreams</h3>
              <p className="text-muted-gray text-sm leading-relaxed">
                Record as many dreams as you want on every plan. Your journal never runs out of space.
              </p>
            </div>
            <div className="text-center group">
              <div className="text-4xl mb-4 animate-float" style={{ animationDelay: '2s' }}>🔒</div>
              <h3 className="font-display text-xl font-semibold mb-2 text-cloud-white">Private & secure</h3>
              <p className="text-muted-gray text-sm leading-relaxed">
                Your dreams stay yours. Encrypted and protected with Row-Level Security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-soft-lavender/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-gray">
          <span className="font-display text-soft-lavender-dim">Dreams Saver</span>
          <div className="flex gap-6">
            <a href="#pricing" className="hover:text-soft-lavender transition-colors">Pricing</a>
            <Link href="/login" className="hover:text-soft-lavender transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
