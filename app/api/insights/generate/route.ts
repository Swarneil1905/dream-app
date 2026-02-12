import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { analyzeDream } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
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

    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Check if user has insights remaining
    if (profile.subscription_status === 'free' && profile.ai_insight_count_free <= 0) {
      return NextResponse.json(
        { error: 'No free insights remaining. Please upgrade.' },
        { status: 403 }
      );
    }
    // Generate AI insight using Gemini
    const insight = await analyzeDream(dreamText, metadata);

    // Save insight to database
    const { data: insightData, error: insightError } = await supabase
      .from('dream_insights')
      .insert({
        dream_id: dreamId,
        analysis_text: insight.fullAnalysis,
        summary: insight.summary,
        emotional_tone: insight.emotionalTone,
        symbolic_interpretation: insight.symbolicInterpretation,
      })
      .select()
      .single();

    if (insightError) {
      return NextResponse.json({ error: 'Failed to save insight' }, { status: 500 });
    }

    // Decrement free insight count for free users
    if (profile.subscription_status === 'free') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ ai_insight_count_free: profile.ai_insight_count_free - 1 })
        .eq('id', user.id);

      if (updateError) {
        console.error('Failed to update insight count:', updateError);
      }

      profile.ai_insight_count_free -= 1;
    }

    return NextResponse.json({
      insight: insightData,
      profile: {
        ai_insight_count_free: profile.ai_insight_count_free,
        subscription_status: profile.subscription_status,
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