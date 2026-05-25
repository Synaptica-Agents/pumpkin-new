
-- Add task_type column to drill_tasks
ALTER TABLE public.drill_tasks ADD COLUMN task_type text;

-- Update the unique index to include task_type
DROP INDEX IF EXISTS idx_drill_tasks_dedupe;
CREATE UNIQUE INDEX idx_drill_tasks_dedupe ON public.drill_tasks (category, difficulty, task_type, task);
