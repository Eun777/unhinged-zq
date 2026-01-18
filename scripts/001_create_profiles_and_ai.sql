-- Create profiles table for user dating profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id TEXT UNIQUE, -- Optional unique username/ID for users who prefer not to use email
  name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  gender TEXT CHECK (gender IN ('man', 'woman', 'non-binary')),
  interested_in TEXT CHECK (interested_in IN ('men', 'women', 'everyone')),
  bio TEXT,
  occupation TEXT,
  photos TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  looking_for TEXT,
  dealbreakers TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prompts table for dating prompts
CREATE TABLE IF NOT EXISTS public.profile_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI learning data table
CREATE TABLE IF NOT EXISTS public.ai_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Text patterns
  uses_all_caps BOOLEAN DEFAULT FALSE,
  laugh_style TEXT DEFAULT 'haha',
  emoji_frequency TEXT DEFAULT 'low' CHECK (emoji_frequency IN ('none', 'low', 'medium', 'high')),
  punctuation_style TEXT DEFAULT 'normal' CHECK (punctuation_style IN ('minimal', 'normal', 'expressive')),
  average_message_length TEXT DEFAULT 'medium' CHECK (average_message_length IN ('short', 'medium', 'long')),
  response_speed TEXT DEFAULT 'thoughtful' CHECK (response_speed IN ('quick', 'thoughtful')),
  -- Learned traits from conversations
  conversation_style TEXT[] DEFAULT '{}',
  learned_traits TEXT[] DEFAULT '{}',
  -- Training progress
  training_conversations_count INTEGER DEFAULT 0,
  last_trained_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI corrections table for learning from user edits
CREATE TABLE IF NOT EXISTS public.ai_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  context TEXT NOT NULL,
  original_response TEXT NOT NULL,
  corrected_response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training conversations table to store conversation history
CREATE TABLE IF NOT EXISTS public.training_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bot_type TEXT NOT NULL, -- 'casual', 'deep', 'flirty', etc.
  messages JSONB NOT NULL DEFAULT '[]',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Allow users to see other profiles for matching (but not sensitive data)
CREATE POLICY "profiles_select_for_matching" ON public.profiles
  FOR SELECT USING (true);

-- RLS Policies for profile_prompts
CREATE POLICY "prompts_select_own" ON public.profile_prompts
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "prompts_insert_own" ON public.profile_prompts
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "prompts_update_own" ON public.profile_prompts
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "prompts_delete_own" ON public.profile_prompts
  FOR DELETE USING (auth.uid() = profile_id);

-- RLS Policies for ai_learning
CREATE POLICY "ai_learning_select_own" ON public.ai_learning
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "ai_learning_insert_own" ON public.ai_learning
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "ai_learning_update_own" ON public.ai_learning
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "ai_learning_delete_own" ON public.ai_learning
  FOR DELETE USING (auth.uid() = profile_id);

-- RLS Policies for ai_corrections
CREATE POLICY "corrections_select_own" ON public.ai_corrections
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "corrections_insert_own" ON public.ai_corrections
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "corrections_update_own" ON public.ai_corrections
  FOR UPDATE USING (auth.uid() = profile_id);

-- RLS Policies for training_conversations
CREATE POLICY "training_select_own" ON public.training_conversations
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "training_insert_own" ON public.training_conversations
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "training_update_own" ON public.training_conversations
  FOR UPDATE USING (auth.uid() = profile_id);

-- Create trigger to auto-create AI learning record when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.ai_learning (profile_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_profile();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_ai_learning_updated_at ON public.ai_learning;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ai_learning_updated_at
  BEFORE UPDATE ON public.ai_learning
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
