
-- market_sizing_cases: Aufgaben-Pool
CREATE TABLE public.market_sizing_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'market_sizing',
  difficulty public.difficulty_level NOT NULL,
  industry_tag text NOT NULL,
  region text NOT NULL DEFAULT 'Germany',
  prompt text NOT NULL,
  target_metric text NOT NULL,
  unit_hint text,
  allowed_methods text NOT NULL DEFAULT 'top_down',
  reference_structure text,
  expected_order_of_magnitude_min numeric,
  expected_order_of_magnitude_max numeric,
  key_assumptions_examples text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_sizing_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active market_sizing_cases" ON public.market_sizing_cases
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage market_sizing_cases" ON public.market_sizing_cases
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- market_sizing_submissions: User-Antworten
CREATE TABLE public.market_sizing_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.market_sizing_cases(id),
  session_id text,
  user_email text NOT NULL,
  input_mode text NOT NULL DEFAULT 'text',
  answer_text text NOT NULL,
  final_estimate_value numeric,
  final_estimate_unit text,
  time_spent_sec integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_sizing_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert market_sizing_submissions" ON public.market_sizing_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read market_sizing_submissions" ON public.market_sizing_submissions
  FOR SELECT USING (true);

-- market_sizing_evaluations: KI-Bewertungen
CREATE TABLE public.market_sizing_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.market_sizing_submissions(id),
  total_score integer NOT NULL DEFAULT 0,
  scores_json jsonb NOT NULL DEFAULT '{}',
  feedback_json jsonb NOT NULL DEFAULT '{}',
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_sizing_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert market_sizing_evaluations" ON public.market_sizing_evaluations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read market_sizing_evaluations" ON public.market_sizing_evaluations
  FOR SELECT USING (true);

-- market_sizing_rubric: Bewertungs-Rubrik (versioniert)
CREATE TABLE public.market_sizing_rubric (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  rubric_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_sizing_rubric ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read market_sizing_rubric" ON public.market_sizing_rubric
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage market_sizing_rubric" ON public.market_sizing_rubric
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
