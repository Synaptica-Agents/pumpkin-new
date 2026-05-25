
-- Table for individual task attempts with task_type for breakdown analytics
CREATE TABLE public.drill_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  drill_type TEXT NOT NULL,       -- 'mental_math' or 'case_math'
  task_type TEXT NOT NULL,         -- e.g. 'multiplication', 'percentage', 'profitability', etc.
  is_correct BOOLEAN NOT NULL,
  response_time_ms INTEGER NOT NULL DEFAULT 0,
  session_id UUID REFERENCES public.drill_sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for efficient dashboard queries
CREATE INDEX idx_drill_attempts_user_email ON public.drill_attempts(user_email);
CREATE INDEX idx_drill_attempts_created_at ON public.drill_attempts(created_at);
CREATE INDEX idx_drill_attempts_drill_type ON public.drill_attempts(drill_type);

-- RLS
ALTER TABLE public.drill_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert drill_attempts"
  ON public.drill_attempts FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read drill_attempts"
  ON public.drill_attempts FOR SELECT USING (true);
