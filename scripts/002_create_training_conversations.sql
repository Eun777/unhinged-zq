-- Create training conversations table (user training with AI bots)
CREATE TABLE IF NOT EXISTS public.training_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bot_name TEXT NOT NULL,
  bot_personality TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  learned_traits TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.training_conversations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own training conversations
CREATE POLICY "training_select_own" ON public.training_conversations 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "training_insert_own" ON public.training_conversations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "training_update_own" ON public.training_conversations 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "training_delete_own" ON public.training_conversations 
  FOR DELETE USING (auth.uid() = user_id);
