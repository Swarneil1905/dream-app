import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password, dreamText } = await request.json();

    if (!email || !password || !dreamText) {
      return NextResponse.json(
        { error: 'Email, password, and dream text are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Sign up the user
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

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    // Save the first dream
    const wordCount = dreamText.trim().split(/\s+/).length;
    
    const { data: dreamData, error: dreamError } = await supabase
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
