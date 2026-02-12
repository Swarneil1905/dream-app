import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password, dreamText } = await request.json();

    if (!email || !password || !dreamText) {
      return NextResponse.json(
        { error: 'Email, password, and dream text are required' },
        { status: 400 }
      );
    }

    const supabase = await createRouteHandlerClient();

    // Sign up the user (Supabase trigger handle_new_user creates profile + subscription)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Save the first dream using service role so RLS doesn't block (session may not be in cookies yet)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server misconfiguration: missing SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const wordCount = dreamText.trim().split(/\s+/).length;
    const { data: dreamData, error: dreamError } = await supabaseAdmin
      .from('dream_entries')
      .insert({
        user_id: authData.user.id,
        content: dreamText,
        title: dreamText.substring(0, 50) + (dreamText.length > 50 ? '...' : ''),
        word_count: wordCount,
      })
      .select()
      .single();

    if (dreamError) {
      console.error('Dream creation error:', dreamError);
      return NextResponse.json(
        { error: 'Account created but failed to save dream. Please try adding it from the dashboard.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, dreamId: dreamData.id });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
