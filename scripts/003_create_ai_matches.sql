-- Create AI match conversations table (conversations between user AIs)
CREATE TABLE IF NOT EXISTS public.ai_match_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL if AI-generated match
  is_ai_match BOOLEAN DEFAULT false, -- true if user2 is a generated AI profile
  ai_profile_data JSONB, -- stored data for AI-generated matches
  conversation JSONB DEFAULT '[]', -- the AI-to-AI conversation
  compatibility_score INTEGER,
  compatibility_reasons JSONB DEFAULT '[]',
  user1_decision TEXT CHECK (user1_decision IN ('liked', 'passed', 'pending')) DEFAULT 'pending',
  user2_decision TEXT CHECK (user2_decision IN ('liked', 'passed', 'pending')) DEFAULT 'pending',
  is_match BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_match_conversations ENABLE ROW LEVEL SECURITY;

-- Users can see conversations they're part of
CREATE POLICY "ai_matches_select_involved" ON public.ai_match_conversations 
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "ai_matches_insert_own" ON public.ai_match_conversations 
  FOR INSERT WITH CHECK (auth.uid() = user1_id);

CREATE POLICY "ai_matches_update_involved" ON public.ai_match_conversations 
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);
