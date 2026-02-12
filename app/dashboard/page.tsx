'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

interface Dream {
  id: string;
  content: string;
  created_at: string;
  word_count: number | null;
  title: string | null;
}

interface UserProfile {
  ai_insight_count_free: number;
  subscription_status: string;
}

export default function DashboardPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDreamModal, setShowNewDreamModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    fetchDreams();
    fetchProfile();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
    }
  };

  const fetchDreams = async () => {
    try {
      const { data, error } = await supabase
        .from('dream_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDreams(data || []);
    } catch (error) {
      console.error('Error fetching dreams:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('ai_insight_count_free, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const filteredDreams = dreams.filter(dream =>
    dream.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dream.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-soft-lavender/20 bg-deep-night/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <Link href="/dashboard" className="font-display text-2xl font-semibold bg-gradient-to-r from-soft-lavender to-accent-moon bg-clip-text text-transparent">
            Dreams Saver
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            {profile && (
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${profile.subscription_status === 'active' ? 'border-soft-lavender/50 text-soft-lavender bg-soft-lavender/10' : profile.ai_insight_count_free > 0 ? 'border-soft-lavender/30 text-soft-lavender bg-soft-lavender/5' : 'border-amber-500/40 text-amber-300 bg-amber-500/10'}`}>
                  {profile.subscription_status === 'active' ? (
                    'Unlimited'
                  ) : (
                    <>Free insights: {profile.ai_insight_count_free}/5</>
                  )}
                </div>
                {profile.subscription_status === 'free' && (
                  <Link href="/pricing" className="text-sm text-soft-lavender hover:underline font-medium">
                    Upgrade
                  </Link>
                )}
              </div>
            )}
            <button onClick={handleLogout} className="btn-secondary text-sm py-2">
              Logout
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats and Actions */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold mb-1 text-cloud-white">Your Dreams</h2>
            <p className="text-muted-gray text-sm">{dreams.length} dreams recorded</p>
          </div>
          <button 
            onClick={() => setShowNewDreamModal(true)}
            className="btn-primary rounded-xl px-6 py-3 font-medium shadow-lg shadow-astral-blue/20"
          >
            + Record New Dream
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search your dreams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field rounded-xl focus:ring-2 focus:ring-soft-lavender/30"
          />
        </div>

        {/* Dreams List */}
        <div className="space-y-4">
          {filteredDreams.length === 0 ? (
            <div className="text-center py-16 text-muted-gray rounded-2xl border border-dashed border-soft-lavender/20 bg-deep-night-soft/50">
              {searchQuery ? 'No dreams match your search.' : 'No dreams recorded yet. Record your first dream above.'}
            </div>
          ) : (
            filteredDreams.map((dream) => (
              <div
                key={dream.id}
                onClick={() => router.push(`/dream/${dream.id}`)}
                className="card cursor-pointer rounded-xl border-soft-lavender/20 hover:border-soft-lavender/40 hover:shadow-lg hover:shadow-soft-lavender/10 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-lg font-semibold text-cloud-white">
                    {dream.title || 'Untitled Dream'}
                  </h3>
                  <span className="text-sm text-muted-gray shrink-0">
                    {formatDate(dream.created_at)}
                  </span>
                </div>
                <p className="text-muted-gray line-clamp-2 leading-relaxed">
                  {dream.content}
                </p>
                <div className="mt-3 text-xs text-muted-gray">
                  {dream.word_count != null && `${dream.word_count} words`}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* New Dream Modal */}
      {showNewDreamModal && (
        <NewDreamModal 
          onClose={() => {
            setShowNewDreamModal(false);
            fetchDreams();
            fetchProfile();
          }} 
        />
      )}
    </div>
  );
}
// New Dream Modal Component
function NewDreamModal({ onClose }: { onClose: () => void }) {
  const [dreamText, setDreamText] = useState('');
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const wordCount = dreamText.trim().split(/\s+/).length;

      const { data, error } = await supabase
        .from('dream_entries')
        .insert({
          user_id: user.id,
          content: dreamText,
          title: title || null,
          word_count: wordCount,
        })
        .select()
        .single();

      if (error) throw error;
      // Insert metadata if provided
      if (data && (mood || tags)) {
        await supabase
          .from('dream_metadata')
          .insert({
            dream_id: data.id,
            user_mood: mood || null,
            tags: tags ? tags.split(',').map(t => t.trim()) : null,
          });
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save dream');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-insight-tint border border-soft-lavender/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl shadow-soft-lavender/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl font-semibold text-cloud-white">Record New Dream</h2>
          <button onClick={onClose} className="text-muted-gray hover:text-cloud-white p-1 rounded-lg hover:bg-white/5 transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-muted-gray">
              Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Give your dream a title..."
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-muted-gray">
              Dream *
            </label>
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              className="textarea-field"
              placeholder="I was walking through a forest when..."
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-muted-gray">
              Mood (optional)
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="input-field"
            >
              <option value="">Select a mood...</option>
              <option value="calm">Calm</option>
              <option value="anxious">Anxious</option>
              <option value="joyful">Joyful</option>
              <option value="confused">Confused</option>
              <option value="peaceful">Peaceful</option>
              <option value="frightening">Frightening</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2 text-muted-gray">
              Tags (optional, comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-field"
              placeholder="flying, water, family"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 rounded-xl"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 rounded-xl font-medium"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Dream'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}