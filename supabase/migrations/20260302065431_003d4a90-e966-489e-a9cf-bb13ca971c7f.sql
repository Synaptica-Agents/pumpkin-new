ALTER TABLE public.drill_tasks 
  ADD COLUMN IF NOT EXISTS answer_value numeric,
  ADD COLUMN IF NOT EXISTS tolerance numeric NOT NULL DEFAULT 0;