-- Dreams Saver Database Schema
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ai_insight_count_free INTEGER NOT NULL DEFAULT 5 CHECK (ai_insight_count_free >= 0 AND ai_insight_count_free <= 5),
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'active'))
);

-- Dream entries table
CREATE TABLE IF NOT EXISTS dream_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL CHECK (char_length(content) > 0),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  word_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dream metadata table
CREATE TABLE IF NOT EXISTS dream_metadata (
  dream_id UUID PRIMARY KEY REFERENCES dream_entries(id) ON DELETE CASCADE,
  user_mood VARCHAR(50),
  tags TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dream insights table
CREATE TABLE IF NOT EXISTS dream_insights (
  dream_id UUID PRIMARY KEY REFERENCES dream_entries(id) ON DELETE CASCADE,
  analysis_text TEXT,
  summary TEXT,
  emotional_tone JSONB,
  symbolic_interpretation TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  usage_cost INTEGER NOT NULL DEFAULT 1
);
-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  current_period_end TIMESTAMPTZ,
  plan_name VARCHAR(50) NOT NULL DEFAULT 'free',
  last_webhook_event JSONB
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dream_entries_user_id ON dream_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_dream_entries_created_at ON dream_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dream_insights_dream_id ON dream_insights(dream_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Dream entries policies
CREATE POLICY "Users can view own dreams" ON dream_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dreams" ON dream_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dreams" ON dream_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dreams" ON dream_entries
  FOR DELETE USING (auth.uid() = user_id);
-- Dream metadata policies
CREATE POLICY "Users can view own dream metadata" ON dream_metadata
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM dream_entries 
      WHERE dream_entries.id = dream_metadata.dream_id 
      AND dream_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own dream metadata" ON dream_metadata
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM dream_entries 
      WHERE dream_entries.id = dream_metadata.dream_id 
      AND dream_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own dream metadata" ON dream_metadata
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM dream_entries 
      WHERE dream_entries.id = dream_metadata.dream_id 
      AND dream_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own dream metadata" ON dream_metadata
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM dream_entries 
      WHERE dream_entries.id = dream_metadata.dream_id 
      AND dream_entries.user_id = auth.uid()
    )
  );

-- Dream insights policies
CREATE POLICY "Users can view own dream insights" ON dream_insights
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM dream_entries 
      WHERE dream_entries.id = dream_insights.dream_id 
      AND dream_entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own dream insights" ON dream_insights
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM dream_entries 
      WHERE dream_entries.id = dream_insights.dream_id 
      AND dream_entries.user_id = auth.uid()
    )
  );
-- Subscriptions policies
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, ai_insight_count_free, subscription_status)
  VALUES (new.id, new.email, 5, 'free');
  
  INSERT INTO public.subscriptions (user_id, plan_name)
  VALUES (new.id, 'free');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update word count automatically
CREATE OR REPLACE FUNCTION public.update_dream_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count := array_length(regexp_split_to_array(trim(NEW.content), '\s+'), 1);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate word count
DROP TRIGGER IF EXISTS calculate_word_count ON dream_entries;
CREATE TRIGGER calculate_word_count
  BEFORE INSERT OR UPDATE OF content ON dream_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_dream_word_count();