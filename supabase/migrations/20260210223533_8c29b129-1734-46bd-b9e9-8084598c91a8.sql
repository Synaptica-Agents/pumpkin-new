
-- Create explanations table
CREATE TABLE public.mental_math_explanations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL,
  difficulty public.difficulty_level NOT NULL,
  explanation_text TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (task_type, difficulty)
);

-- Enable RLS
ALTER TABLE public.mental_math_explanations ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Anyone can read explanations"
ON public.mental_math_explanations
FOR SELECT
USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage explanations"
ON public.mental_math_explanations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert (for AI fallback edge function)
CREATE POLICY "Service role can insert explanations"
ON public.mental_math_explanations
FOR INSERT
WITH CHECK (true);

-- Insert the 12 initial explanations
INSERT INTO public.mental_math_explanations (task_type, difficulty, explanation_text) VALUES
-- Multiplication
('multiplication', 'easy', 'Multipliziere zuerst ohne Nullen/Einheiten und hänge die Nullen am Ende dran. Nutze Zerlegung in 10er/5er, wenn es schneller geht.'),
('multiplication', 'medium', 'Zerlege eine Zahl in 10er/20er/… oder in (rund ± Abweichung). Rechne Teilprodukte und addiere/subtrahiere.'),
('multiplication', 'hard', 'Nutze Tricks wie x25 (= /4 ×100), x12,5 (= /8 ×100) oder (rund ±). Bei Dezimalen erst ohne Komma rechnen und am Ende Komma/Skalierung setzen.'),
-- Division
('division', 'easy', 'Teile Schritt für Schritt über einfache Zerlegungen (z.B. durch 10, dann durch 2/3). Prüfe, ob du kürzen kannst.'),
('division', 'medium', 'Mache die Zahl zuerst ''teilbar'' durch Zerlegung (z.B. 96 ÷ 12 = 96 ÷ 3 ÷ 4). Bei k: erst die Zahl ohne k teilen, k bleibt.'),
('division', 'hard', 'Verschiebe Dezimalstellen (z.B. 7,2 ÷ 0,6 → 72 ÷ 6). Bei Mio/k: erst die Mantisse teilen, dann die Einheit wieder dranhängen.'),
-- Percentage
('percentage', 'easy', 'Nutze 10% als Basis und leite 5%, 20%, 25%, 50% daraus ab. Rechne in einfachen Schritten.'),
('percentage', 'medium', 'Zerlege Prozent in Bausteine (z.B. 18% = 10% + 8%). Bei k bleibt die Einheit erhalten.'),
('percentage', 'hard', 'Nutze Bruch-Äquivalente (12,5% = 1/8, 33,3% ≈ 1/3) und rechne über Zerlegung. Runde nur wenn nötig und halte max. 2 Nachkommastellen.'),
-- Zero Management
('zero_management', 'easy', 'Rechne erst mit den Kernzahlen und füge Nullen/Suffixe am Ende hinzu. k = ×1.000, Mio = ×1.000.000.'),
('zero_management', 'medium', 'Wandle in eine ''handliche'' Form um (z.B. 48k = 48×1.000). Rechne mit 48 und hänge die Skalierung wieder an.'),
('zero_management', 'hard', 'Behandle k/Mio wie Einheiten und arbeite mit der Mantisse. Bei Dezimalen erst normalisieren (z.B. 0,48Mio = 480k) und dann rechnen.');
