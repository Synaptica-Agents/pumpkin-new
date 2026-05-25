
-- Create enums
CREATE TYPE public.difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE public.case_math_category AS ENUM ('profitability', 'investment_roi', 'break_even', 'market_sizing');
CREATE TYPE public.mental_math_task_type AS ENUM ('multiplication', 'percentage', 'division', 'zero_management');
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create case_math_questions table
CREATE TABLE public.case_math_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL DEFAULT 'case_math',
  difficulty public.difficulty_level NOT NULL,
  category public.case_math_category NOT NULL,
  question TEXT NOT NULL,
  answer_value NUMERIC NOT NULL,
  answer_unit TEXT,
  answer_display TEXT,
  tolerance NUMERIC NOT NULL DEFAULT 0,
  tags TEXT,
  explanation TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create mental_math_questions table
CREATE TABLE public.mental_math_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL DEFAULT 'mental_math',
  difficulty public.difficulty_level NOT NULL,
  task_type public.mental_math_task_type NOT NULL,
  question TEXT NOT NULL,
  answer_value NUMERIC NOT NULL,
  answer_display TEXT,
  tolerance NUMERIC NOT NULL DEFAULT 0,
  number_format TEXT,
  time_limit_sec INTEGER,
  tags TEXT,
  explanation TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.case_math_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_math_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for case_math_questions: anyone can read active, admin can do everything
CREATE POLICY "Anyone can read active case_math_questions"
  ON public.case_math_questions FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can do everything on case_math_questions"
  ON public.case_math_questions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS for mental_math_questions: anyone can read active, admin can do everything
CREATE POLICY "Anyone can read active mental_math_questions"
  ON public.mental_math_questions FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can do everything on mental_math_questions"
  ON public.mental_math_questions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS for user_roles: admins can read, no public access
CREATE POLICY "Admins can read user_roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

-- Unique constraint for deduplication
CREATE UNIQUE INDEX idx_case_math_dedupe ON public.case_math_questions (difficulty, category, question);
CREATE UNIQUE INDEX idx_mental_math_dedupe ON public.mental_math_questions (difficulty, task_type, question);
