-- ============================================================
-- New drill tables: framework_cases, chart_cases, creativity_cases
-- Generic text_drill_submissions & text_drill_evaluations
-- ============================================================

-- framework_cases
CREATE TABLE public.framework_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty public.difficulty_level NOT NULL,
  category text NOT NULL, -- profitability, market_entry, growth, ma, pricing, operations
  prompt text NOT NULL,
  context_info text,
  recommended_framework text,
  reference_solution text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.framework_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active framework_cases" ON public.framework_cases
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage framework_cases" ON public.framework_cases
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- chart_cases (chart data stored as JSON)
CREATE TABLE public.chart_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty public.difficulty_level NOT NULL,
  chart_type text NOT NULL, -- bar, line, pie, waterfall, scatter, stacked_bar
  prompt text NOT NULL,
  chart_data jsonb NOT NULL, -- {labels: [...], datasets: [{label, data: [...], color}]}
  chart_title text,
  interpretation_hints text,
  reference_answer text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.chart_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active chart_cases" ON public.chart_cases
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage chart_cases" ON public.chart_cases
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- creativity_cases
CREATE TABLE public.creativity_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  difficulty public.difficulty_level NOT NULL,
  industry text NOT NULL,
  prompt text NOT NULL,
  context_info text,
  reference_ideas text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.creativity_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active creativity_cases" ON public.creativity_cases
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage creativity_cases" ON public.creativity_cases
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Generic text drill submissions (for frameworks, charts, creativity)
CREATE TABLE public.text_drill_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drill_type text NOT NULL, -- 'frameworks', 'charts', 'creativity'
  case_id uuid NOT NULL,
  session_id text,
  user_email text NOT NULL,
  answer_text text NOT NULL,
  time_spent_sec integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.text_drill_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert text_drill_submissions" ON public.text_drill_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read text_drill_submissions" ON public.text_drill_submissions
  FOR SELECT USING (true);

CREATE INDEX idx_text_drill_submissions_user_email ON public.text_drill_submissions (user_email);
CREATE INDEX idx_text_drill_submissions_drill_type ON public.text_drill_submissions (drill_type);

-- Generic text drill evaluations
CREATE TABLE public.text_drill_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.text_drill_submissions(id),
  total_score integer NOT NULL DEFAULT 0,
  scores_json jsonb NOT NULL DEFAULT '{}',
  feedback_json jsonb NOT NULL DEFAULT '{}',
  flagged boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.text_drill_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert text_drill_evaluations" ON public.text_drill_evaluations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read text_drill_evaluations" ON public.text_drill_evaluations
  FOR SELECT USING (true);
