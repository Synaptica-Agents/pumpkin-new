-- Add difficulty column to drill_attempts
ALTER TABLE public.drill_attempts ADD COLUMN difficulty text DEFAULT 'medium';

-- Create index on difficulty for dashboard queries
CREATE INDEX idx_drill_attempts_difficulty ON public.drill_attempts(difficulty);