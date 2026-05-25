
-- Add rand_key column for efficient random selection
ALTER TABLE public.drill_tasks ADD COLUMN rand_key double precision NOT NULL DEFAULT random();

-- Create index for rand_key-based random selection
CREATE INDEX idx_drill_tasks_rand_key ON public.drill_tasks (category, difficulty, task_type, active, rand_key);

-- Populate existing rows with random values (they already have random() from default, but let's ensure spread)
UPDATE public.drill_tasks SET rand_key = random() WHERE rand_key = 0;
