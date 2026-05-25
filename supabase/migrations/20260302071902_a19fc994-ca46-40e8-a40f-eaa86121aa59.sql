
CREATE TABLE public.case_math_explanation_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type text NOT NULL,
  difficulty public.difficulty_level NOT NULL,
  match_rule text NOT NULL,
  explanation_text text NOT NULL,
  priority integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.case_math_explanation_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage case math explanation templates"
  ON public.case_math_explanation_templates
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read active case math explanation templates"
  ON public.case_math_explanation_templates
  FOR SELECT
  USING (active = true);
