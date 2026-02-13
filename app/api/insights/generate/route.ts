import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { analyzeDream } from '@/lib/gemini';
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type DreamInsightInsert = Database['public']['Tables']['dream_insights']['Insert'];
type Json = Database['public']['Tables']['dream_insights']['Row']['emotional_tone'];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dreamId, dreamText, metadata } = await request.json();

    // Fetch user profile to check insight limit
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('ai_insight_count_free, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Type assertion to ensure TypeScript recognizes the profile type
    const userProfile = profile as Pick<Profile, 'ai_insight_count_free' | 'subscription_status'>;

    // Check if user has insights remaining
    if (userProfile.subscription_status === 'free' && userProfile.ai_insight_count_free <= 0) {
      return NextResponse.json(
        { error: 'No free insights remaining. Please upgrade.' },
        { status: 403 }
      );
    }
    // Generate AI insight using Gemini
    const insight = await analyzeDream(dreamText, metadata);

    // Save insight to database
    const { data: insightData, error: insightError } = await (supabase
      .from('dream_insights') as any)
      .insert({
        dream_id: dreamId,
        analysis_text: insight.fullAnalysis,
        summary: insight.summary,
        emotional_tone: insight.emotionalTone as Json,
        symbolic_interpretation: insight.symbolicInterpretation,
      })
      .select()
      .single();

    if (insightError) {
      return NextResponse.json({ error: 'Failed to save insight' }, { status: 500 });
    }

    // Decrement free insight count for free users
    if (userProfile.subscription_status === 'free') {
      const updateData = { ai_insight_count_free: userProfile.ai_insight_count_free - 1 };
      const { error: updateError } = await (supabase
        .from('profiles') as any)
        .update(updateData)
        .eq('id', user.id);

      if (updateError) {
        console.error('Failed to update insight count:', updateError);
      }

      userProfile.ai_insight_count_free -= 1;
    }

    return NextResponse.json({
      insight: insightData,
      profile: {
        ai_insight_count_free: userProfile.ai_insight_count_free,
        subscription_status: userProfile.subscription_status,
      },
    });
  } catch (error) {
    console.error('Error generating insight:', error);
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    );
  }
}