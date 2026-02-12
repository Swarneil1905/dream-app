import { createBrowserClient, createServerClient as createSSRClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          created_at: string
          ai_insight_count_free: number
          subscription_status: 'free' | 'active'
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          created_at?: string
          ai_insight_count_free?: number
          subscription_status?: 'free' | 'active'
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          created_at?: string
          ai_insight_count_free?: number
          subscription_status?: 'free' | 'active'
        }
      }
      dream_entries: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          recorded_at: string
          word_count: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          recorded_at?: string
          word_count?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          recorded_at?: string
          word_count?: number | null
          created_at?: string
        }
      }
      dream_metadata: {
        Row: {
          dream_id: string
          user_mood: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          dream_id: string
          user_mood?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          dream_id?: string
          user_mood?: string | null
          tags?: string[] | null
          updated_at?: string
        }
      }
      dream_insights: {
        Row: {
          dream_id: string
          analysis_text: string | null
          summary: string | null
          emotional_tone: Json | null
          symbolic_interpretation: string | null
          generated_at: string
          usage_cost: number
        }
        Insert: {
          dream_id: string
          analysis_text?: string | null
          summary?: string | null
          emotional_tone?: Json | null
          symbolic_interpretation?: string | null
          generated_at?: string
          usage_cost?: number
        }
        Update: {
          dream_id?: string
          analysis_text?: string | null
          summary?: string | null
          emotional_tone?: Json | null
          symbolic_interpretation?: string | null
          generated_at?: string
          usage_cost?: number
        }
      }
      subscriptions: {
        Row: {
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_end: string | null
          plan_name: string
          last_webhook_event: Json | null
        }
        Insert: {
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          plan_name?: string
          last_webhook_event?: Json | null
        }
        Update: {
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          plan_name?: string
          last_webhook_event?: Json | null
        }
      }
    }
  }
}

// Browser client - for use in client components
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server client - for use in server components and API routes
export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createSSRClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}