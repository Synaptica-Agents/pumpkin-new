
-- Table for tracking drill session results per user (identified by email)
CREATE TABLE public.drill_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  drill_type TEXT NOT NULL, -- 'mental_math' or 'case_math'
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  accuracy_percent INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast lookups by email
CREATE INDEX idx_drill_sessions_email ON public.drill_sessions (user_email);
CREATE INDEX idx_drill_sessions_email_type ON public.drill_sessions (user_email, drill_type, created_at DESC);

-- Enable RLS
ALTER TABLE public.drill_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read for own sessions (filtered by email in app code)
CREATE POLICY "Anyone can read drill_sessions"
  ON public.drill_sessions FOR SELECT
  USING (true);

-- Allow anonymous insert
CREATE POLICY "Anyone can insert drill_sessions"
  ON public.drill_sessions FOR INSERT
  WITH CHECK (true);
