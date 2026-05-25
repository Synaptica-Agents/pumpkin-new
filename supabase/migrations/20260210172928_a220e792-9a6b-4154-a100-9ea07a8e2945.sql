
-- Create category enum
CREATE TYPE public.drill_category AS ENUM ('case_math', 'mental_math');

-- Create drill_tasks table
CREATE TABLE public.drill_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category drill_category NOT NULL,
  difficulty difficulty_level NOT NULL,
  task TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique index for deduplication
CREATE UNIQUE INDEX idx_drill_tasks_dedupe ON public.drill_tasks (category, difficulty, task);

-- Enable RLS
ALTER TABLE public.drill_tasks ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can do everything on drill_tasks"
  ON public.drill_tasks
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Public read for active tasks
CREATE POLICY "Anyone can read active drill_tasks"
  ON public.drill_tasks
  FOR SELECT
  USING (active = true);
