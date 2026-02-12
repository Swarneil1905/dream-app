'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

interface Dream {
  id: string;
  content: string;
  created_at: string;
  word_count: number | null;
  title: string | null;
}

interface DreamMetadata {
  user_mood: string | null;
  tags: string[] | null;
}

interface DreamInsight {
  analysis_text: string;
  summary: string;
  emotional_tone: any;
  symbolic_interpretation: string;
  generated_at: string;
}

interface UserProfile {
  ai_insight_count_free: number;
  subscription_status: string;
}
export default function DreamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dreamId = params.dreamId as string;
  
  const [dream, setDream] = useState<Dream | null>(null);
  const [metadata, setMetadata] = useState<DreamMetadata | null>(null);
  const [insight, setInsight] = useState<DreamInsight | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingInsight, setGeneratingInsight] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDreamData();
  }, [dreamId]);

  const fetchDreamData = async () => {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch dream
      const { data: dreamData, error: dreamError } = await supabase
        .from('dream_entries')
        .select('*')
        .eq('id', dreamId)
        .single();

      if (dreamError) throw dreamError;
      setDream(dreamData);
      // Fetch metadata
      const { data: metadataData } = await supabase
        .from('dream_metadata')
        .select('*')
        .eq('dream_id', dreamId)
        .single();

      if (metadataData) setMetadata(metadataData);

      // Fetch insight
      const { data: insightData } = await supabase
        .from('dream_insights')
        .select('*')
        .eq('dream_id', dreamId)
        .single();

      if (insightData) setInsight(insightData);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('ai_insight_count_free, subscription_status')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData);
    } catch (error) {
      console.error('Error fetching dream data:', error);
      setError('Failed to load dream');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    if (!dream || !profile) return;
    // Check if user has insights remaining
    if (profile.subscription_status === 'free' && profile.ai_insight_count_free <= 0) {
      setError('You have used all your free insights. Please upgrade to continue.');
      return;
    }

    setGeneratingInsight(true);
    setError('');

    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamId: dream.id,
          dreamText: dream.content,
          metadata: metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate insight');
      }

      setInsight(data.insight);
      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insight');
    } finally {
      setGeneratingInsight(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-gray mb-4">Dream not found</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-soft-lavender/20 bg-deep-night/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-soft-lavender hover:text-cloud-white transition-colors text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Dream Title and Metadata */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-4 text-cloud-white">
            {dream.title || 'Untitled Dream'}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-gray mb-4">
            <span>📅 {formatDate(dream.created_at)}</span>
            {dream.word_count && <span>📝 {dream.word_count} words</span>}
            {metadata?.user_mood && (
              <span className="tag">{metadata.user_mood}</span>
            )}
          </div>

          {metadata?.tags && metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dream Content */}
        <div className="card mb-8 rounded-xl border-soft-lavender/20">
          <h2 className="font-display text-xl font-semibold mb-4 text-soft-lavender">Your Dream</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {dream.content}
            </p>
          </div>
        </div>
        {/* AI Insight Section */}
        <div className="bg-insight-tint border border-soft-lavender/30 rounded-2xl p-6 shadow-lg shadow-soft-lavender/5">
          <h2 className="font-display text-2xl font-semibold mb-4 text-soft-lavender flex items-center gap-2">
            ✨ AI Insight
          </h2>

          {!insight && !generatingInsight && (
            <div className="text-center py-8">
              {profile && profile.subscription_status === 'free' && profile.ai_insight_count_free <= 0 ? (
                <>
                  <p className="text-muted-gray mb-4">
                    You&apos;ve used all 5 free insights. Upgrade for unlimited AI analysis.
                  </p>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-soft-lavender text-deep-night font-semibold hover:bg-accent-moon transition-colors"
                  >
                    Upgrade to Unlimited — $8/month
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-muted-gray mb-4">
                    Generate an AI-powered insight to discover the deeper meaning of your dream.
                  </p>
                  <button 
                    onClick={handleGenerateInsight}
                    className="btn-primary"
                  >
                    Generate Insight
                  </button>
                  {profile && (
                    <p className="text-sm text-muted-gray mt-3">
                      {profile.ai_insight_count_free} free insights remaining
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          {generatingInsight && (
            <div className="text-center py-8">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-muted-gray">
                Generating your personalized insight with Gemini AI...
              </p>
            </div>
          )}

          {insight && (
            <div className="space-y-6">
              {insight.summary && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-lavender">Summary</h3>
                  <p className="text-cloud-white leading-relaxed">{insight.summary}</p>
                </div>
              )}

              {insight.emotional_tone && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-lavender">Emotional Analysis</h3>
                  <p className="text-cloud-white leading-relaxed">
                    {typeof insight.emotional_tone === 'string' 
                      ? insight.emotional_tone 
                      : JSON.stringify(insight.emotional_tone)}
                  </p>
                </div>
              )}

              {insight.symbolic_interpretation && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-lavender">Symbolic Interpretation</h3>
                  <p className="text-cloud-white leading-relaxed">{insight.symbolic_interpretation}</p>
                </div>
              )}
              {insight.analysis_text && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-soft-lavender">Full Analysis</h3>
                  <p className="text-cloud-white leading-relaxed whitespace-pre-wrap">
                    {insight.analysis_text}
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-gray pt-4 border-t border-soft-lavender/20">
                Generated {formatDate(insight.generated_at)}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}