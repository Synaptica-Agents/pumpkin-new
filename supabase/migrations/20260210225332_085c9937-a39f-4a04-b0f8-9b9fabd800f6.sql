
-- Create the explanation templates table
CREATE TABLE public.mental_math_explanation_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_type TEXT NOT NULL,
  difficulty public.difficulty_level NOT NULL,
  match_rule TEXT NOT NULL,
  explanation_text TEXT NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mental_math_explanation_templates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read active explanation templates"
ON public.mental_math_explanation_templates
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage explanation templates"
ON public.mental_math_explanation_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index for efficient lookup
CREATE INDEX idx_explanation_templates_lookup
ON public.mental_math_explanation_templates (task_type, difficulty, priority DESC)
WHERE active = true;

-- ============================================================
-- SEED: ~96 templates (8 per task_type × difficulty = 4×3×8)
-- ============================================================

-- MULTIPLICATION / EASY
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('multiplication', 'easy', 'contains: x 10', '×10: Einfach eine Null anhängen.', 10),
('multiplication', 'easy', 'contains: x 5', '×5: Halbiere die Zahl und multipliziere mit 10.', 10),
('multiplication', 'easy', 'contains: x 2', '×2: Verdopple die Zahl.', 10),
('multiplication', 'easy', 'contains: x 4', '×4: Zweimal verdoppeln.', 10),
('multiplication', 'easy', 'contains: x 11', '×11: Die Zahl plus die Zahl mal 10.', 9),
('multiplication', 'easy', 'contains: x 9', '×9: Mal 10 minus einmal die Zahl.', 9),
('multiplication', 'easy', 'contains: x 3', '×3: Verdopple und addiere einmal die Zahl.', 8),
('multiplication', 'easy', 'contains: x 6', '×6: Mal 3, dann verdoppeln.', 8);

-- MULTIPLICATION / MEDIUM
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('multiplication', 'medium', 'contains: x 25', '×25: Erst mal 100, dann durch 4.', 10),
('multiplication', 'medium', 'contains: x 50', '×50: Mal 100, dann halbieren.', 10),
('multiplication', 'medium', 'contains: x 75', '×75: Mal 3, dann durch 4, dann mal 100. Oder: 50% + 25% der Zahl.', 10),
('multiplication', 'medium', 'contains: x 15', '×15: Mal 10 plus die Hälfte davon.', 9),
('multiplication', 'medium', 'contains: x 12', '×12: Mal 10 plus mal 2.', 9),
('multiplication', 'medium', 'contains: x 20', '×20: Mal 2, dann mal 10.', 9),
('multiplication', 'medium', 'regex: ,', 'Bei Dezimalzahlen: Erst ohne Komma rechnen, dann das Komma richtig setzen.', 5),
('multiplication', 'medium', 'contains: k', 'Bei k (Tausend): Rechne mit der Zahl, k bleibt als Einheit.', 5);

-- MULTIPLICATION / HARD
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('multiplication', 'hard', 'contains: x 125', '×125: Mal 1000 und dann durch 8.', 10),
('multiplication', 'hard', 'contains: x 250', '×250: Mal 1000 und durch 4.', 10),
('multiplication', 'hard', 'contains: x 99', '×99: Mal 100 minus einmal die Zahl.', 10),
('multiplication', 'hard', 'contains: Mio', 'Bei Mio: Rechne die Zahl normal und behalte die Mio-Einheit.', 7),
('multiplication', 'hard', 'contains: x 33', '×33: Mal 100 und durch 3. Oder: mal 30 plus mal 3.', 9),
('multiplication', 'hard', 'contains: x 45', '×45: Mal 50 minus mal 5. Oder: mal 9 mal 5.', 9),
('multiplication', 'hard', 'regex: ,', 'Dezimalzahlen: Zuerst ohne Komma multiplizieren, Komma am Ende korrekt setzen.', 5),
('multiplication', 'hard', 'contains: k', 'k steht für Tausend. Rechne die Zahlen, k bleibt als Skalierung.', 5);

-- DIVISION / EASY
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('division', 'easy', 'contains: ÷ 2', '÷2: Halbiere die Zahl.', 10),
('division', 'easy', 'contains: ÷ 10', '÷10: Streiche die letzte Null oder verschiebe das Komma.', 10),
('division', 'easy', 'contains: ÷ 5', '÷5: Durch 10 und dann verdoppeln.', 10),
('division', 'easy', 'contains: ÷ 4', '÷4: Zweimal halbieren.', 10),
('division', 'easy', 'contains: ÷ 3', '÷3: Prüfe ob die Quersumme durch 3 teilbar ist, dann Schritt für Schritt teilen.', 8),
('division', 'easy', 'contains: ÷ 100', '÷100: Komma um zwei Stellen nach links.', 9),
('division', 'easy', 'contains: ÷ 20', '÷20: Durch 2, dann durch 10.', 9),
('division', 'easy', 'contains: ÷ 50', '÷50: Durch 100, dann verdoppeln.', 9);

-- DIVISION / MEDIUM
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('division', 'medium', 'contains: ÷ 8', '÷8: Dreimal halbieren.', 10),
('division', 'medium', 'contains: ÷ 12', '÷12: Erst durch 3, dann durch 4.', 10),
('division', 'medium', 'contains: ÷ 15', '÷15: Durch 3, dann durch 5.', 10),
('division', 'medium', 'contains: ÷ 25', '÷25: Durch 100 und dann mal 4.', 10),
('division', 'medium', 'contains: ÷ 6', '÷6: Durch 2, dann durch 3.', 9),
('division', 'medium', 'contains: ÷ 9', '÷9: Durch 3, dann nochmal durch 3.', 9),
('division', 'medium', 'regex: ,', 'Dezimal-Division: Verschiebe die Dezimalstellen, bis es einfacher wird.', 5),
('division', 'medium', 'contains: Mio', 'Bei Mio: Rechne mit der Zahl, die Einheit bleibt Mio.', 5);

-- DIVISION / HARD
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('division', 'hard', 'contains: ÷ 16', '÷16: Viermal halbieren.', 10),
('division', 'hard', 'contains: ÷ 125', '÷125: Durch 1000 und dann mal 8.', 10),
('division', 'hard', 'contains: ÷ 250', '÷250: Durch 1000, dann mal 4.', 10),
('division', 'hard', 'contains: ÷ 75', '÷75: Durch 3, dann durch 25.', 9),
('division', 'hard', 'contains: ÷ 40', '÷40: Durch 4, dann durch 10.', 9),
('division', 'hard', 'contains: Mio', 'Bei Millionen: Zahl teilen, Einheit beibehalten.', 5),
('division', 'hard', 'regex: ,', 'Dezimaldivision: Beide Zahlen so verschieben, dass der Teiler ganzzahlig wird.', 5),
('division', 'hard', 'contains: k', 'k = Tausend. Teile die Zahl, k bleibt als Skalierung.', 5);

-- PERCENTAGE / EASY
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('percentage', 'easy', 'contains: 10%', '10%: Einfach durch 10.', 10),
('percentage', 'easy', 'contains: 50%', '50%: Halbiere die Zahl.', 10),
('percentage', 'easy', 'contains: 25%', '25% ist ein Viertel: Durch 4.', 10),
('percentage', 'easy', 'contains: 1%', '1%: Durch 100.', 9),
('percentage', 'easy', 'contains: 5%', '5%: Erst 10% berechnen, dann halbieren.', 9),
('percentage', 'easy', 'contains: 20%', '20%: Durch 5. Oder 10% verdoppeln.', 9),
('percentage', 'easy', 'contains: 1/2', '1/2 ist die Hälfte: Durch 2.', 9),
('percentage', 'easy', 'contains: 1/4', '1/4 ist ein Viertel: Durch 4.', 9);

-- PERCENTAGE / MEDIUM
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('percentage', 'medium', 'contains: 12,5%', '12,5% ist ein Achtel: Durch 8.', 10),
('percentage', 'medium', 'contains: 15%', '15%: 10% plus die Hälfte davon.', 10),
('percentage', 'medium', 'contains: 30%', '30%: 3 mal 10%.', 9),
('percentage', 'medium', 'contains: 75%', '75% ist drei Viertel: Durch 4, dann mal 3.', 10),
('percentage', 'medium', 'contains: 3/4', '3/4: Erst ein Viertel berechnen, dann mal 3.', 10),
('percentage', 'medium', 'contains: 1/3', '1/3: Durch 3.', 9),
('percentage', 'medium', 'contains: 2/3', '2/3: Erst durch 3, dann mal 2.', 9),
('percentage', 'medium', 'contains: 37,5%', '37,5% = 25% + 12,5%: Ein Viertel plus ein Achtel.', 10);

-- PERCENTAGE / HARD
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('percentage', 'hard', 'contains: 62,5%', '62,5% = 50% + 12,5%: Hälfte plus ein Achtel.', 10),
('percentage', 'hard', 'contains: 87,5%', '87,5% = 100% − 12,5%: Alles minus ein Achtel.', 10),
('percentage', 'hard', 'contains: 33%', '33% ist ungefähr ein Drittel: Durch 3.', 9),
('percentage', 'hard', 'contains: 66%', '66% ist ungefähr zwei Drittel: Durch 3, dann mal 2.', 9),
('percentage', 'hard', 'contains: 1/8', '1/8: Dreimal halbieren.', 9),
('percentage', 'hard', 'contains: 3/8', '3/8: Ein Achtel berechnen, dann mal 3.', 9),
('percentage', 'hard', 'contains: 5/8', '5/8 = 1/2 + 1/8: Hälfte plus ein Achtel.', 9),
('percentage', 'hard', 'contains: 7/8', '7/8 = 1 − 1/8: Alles minus ein Achtel.', 9);

-- ZERO_MANAGEMENT / EASY
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('zero_management', 'easy', 'contains: k', 'k steht für Tausend. Rechne die Zahl normal und behalte k als Einheit.', 10),
('zero_management', 'easy', 'contains: 000', 'Viele Nullen? Kürze sie raus: 6.000 = 6k. Rechne einfacher.', 9),
('zero_management', 'easy', 'contains: Mio', 'Mio = Million. Rechne die Zahl, behalte die Einheit.', 10),
('zero_management', 'easy', 'contains: .000', 'Kürze die Nullen: z.B. 12.000 = 12k. Rechne mit 12.', 9),
('zero_management', 'easy', 'regex: \\+', 'Bei Addition: Gleiche Einheiten beibehalten (k+k=k, Mio+Mio=Mio).', 7),
('zero_management', 'easy', 'regex: -', 'Bei Subtraktion: Gleiche Einheiten beibehalten.', 7),
('zero_management', 'easy', 'regex: x|×', 'Bei Multiplikation mit großen Zahlen: Einheiten separat multiplizieren (k×k = Mio).', 7),
('zero_management', 'easy', 'regex: ÷', 'Bei Division großer Zahlen: Einheiten kürzen (Mio÷k = k).', 7);

-- ZERO_MANAGEMENT / MEDIUM
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('zero_management', 'medium', 'contains: 0,', 'Dezimalzahl vor Mio/k? Umrechnen: 0,5 Mio = 500k.', 10),
('zero_management', 'medium', 'regex: Mio.*,|,.*Mio', 'Mio mit Dezimal: In k umdenken. 0,48 Mio = 480k.', 10),
('zero_management', 'medium', 'contains: Mrd', 'Mrd = Milliarde = 1.000 Mio. Rechne in Mio um wenn nötig.', 9),
('zero_management', 'medium', 'regex: k.*Mio|Mio.*k', 'Verschiedene Einheiten? Erst auf gleiche Basis bringen (z.B. alles in k).', 10),
('zero_management', 'medium', 'regex: \\d{4,}', 'Große Zahlen: In k oder Mio umwandeln, dann einfacher rechnen.', 6),
('zero_management', 'medium', 'contains: k', 'k = Tausend. Bei gemischten Einheiten erst alles auf k bringen.', 7),
('zero_management', 'medium', 'contains: Mio', 'Mio-Rechnung: Konzentriere dich auf die Zahl, die Einheit folgt den Rechenregeln.', 7),
('zero_management', 'medium', 'regex: ,', 'Dezimalstellen: Zähle die Stellen und setze das Komma am Ende richtig.', 5);

-- ZERO_MANAGEMENT / HARD
INSERT INTO public.mental_math_explanation_templates (task_type, difficulty, match_rule, explanation_text, priority) VALUES
('zero_management', 'hard', 'regex: Mio.*Mio', 'Mio × Mio = Billionen. Mio ÷ Mio = einfache Zahl. Achte auf die Einheiten.', 10),
('zero_management', 'hard', 'regex: Mrd', 'Mrd-Rechnung: 1 Mrd = 1.000 Mio. Rechne in der passenden Einheit.', 9),
('zero_management', 'hard', 'regex: 0,0', 'Kleine Dezimalzahlen: Verschiebe das Komma und passe die Einheit an.', 9),
('zero_management', 'hard', 'regex: k.*k', 'k × k = Mio. k ÷ k = einfache Zahl. Einheiten-Regeln beachten.', 9),
('zero_management', 'hard', 'contains: Mio', 'Bei Mio in schweren Aufgaben: Erst in k umrechnen wenn das hilft.', 7),
('zero_management', 'hard', 'contains: k', 'Bei k in schweren Aufgaben: Prüfe ob Umrechnung in Mio die Rechnung vereinfacht.', 7),
('zero_management', 'hard', 'regex: ,', 'Viele Dezimalstellen: Komma verschieben und Einheit anpassen.', 5),
('zero_management', 'hard', 'regex: \\d{5,}', 'Sehr große Zahlen: In passende Einheit umwandeln (k, Mio, Mrd).', 5);
