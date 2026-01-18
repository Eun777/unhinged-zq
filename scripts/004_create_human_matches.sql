-- Create human matches table (after both users like each other)
CREATE TABLE IF NOT EXISTS public.human_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_conversation_id UUID NOT NULL REFERENCES public.ai_match_conversations(id) ON DELETE CASCADE,
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  human_messages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.human_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "human_matches_select_involved" ON public.human_matches 
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "human_matches_insert_involved" ON public.human_matches 
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "human_matches_update_involved" ON public.human_matches 
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);
