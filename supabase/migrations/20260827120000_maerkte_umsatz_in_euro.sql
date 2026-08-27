-- ============================================================
-- Market Sizing, Fragetyp "Märkte & Umsätze" (question_type='maerkte'):
-- ALLE Cases zielen jetzt auf einen JAHRESUMSATZ IN EURO statt auf
-- Stückzahlen. Bei 8 Cases werden Prompt, Zielmetrik, Einheit und die
-- erwartete Größenordnung umgestellt (Range = bisherige Stück-Range ×
-- plausible Ø-Preisspanne); Referenz-Struktur und Beispiel-Annahmen
-- bekommen den Monetarisierungs-Schritt angehängt.
-- Bereits €-basierte Cases (TU München, Zara, Laufschuhe) bleiben wie
-- sie sind; beim Geschenke-Case wird nur die Einheit vereinheitlicht.
-- ============================================================

BEGIN;

-- 1. Sixpacks Bier (bisher: 200–800 Mio Sixpacks/Jahr)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie viel Umsatz wird in Deutschland pro Jahr mit Sixpacks Bier gemacht?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 800000000,
  expected_order_of_magnitude_max = 4000000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss monetarisieren: die hergeleitete Anzahl Sixpacks mit dem Ø-Preis pro Sixpack multiplizieren (ca. 4–6 € für sechs Flaschen) ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' × Ø-Preis ~5 €/Sixpack ≈ 2 Mrd €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie viele Sixpacks Bier werden jedes Jahr in Deutschland verkauft?';

-- 2. Tafeln Zartbitterschokolade (bisher: 115–460 Mio Tafeln/Jahr)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie viel Umsatz wird in Deutschland pro Jahr mit Tafeln Zartbitterschokolade gemacht?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 150000000,
  expected_order_of_magnitude_max = 900000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss monetarisieren: die hergeleitete Anzahl Tafeln mit dem Ø-Preis pro Tafel multiplizieren (ca. 1–2 €) ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' × Ø-Preis ~1,50 €/Tafel ≈ 350 Mio €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie viele Tafeln Zartbitterschokolade werden jedes Jahr in Deutschland verkauft?';

-- 3. Kaffee (bisher: 80–320 Mio Tassen pro Wochentag)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie viel Umsatz wird in Deutschland pro Jahr mit Kaffee gemacht?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 10000000000,
  expected_order_of_magnitude_max = 50000000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss aufs Jahr und in Umsatz übersetzen: Tassen pro Tag × ~365 Tage × Misch-Preis pro Tasse. Für den Preis nach Konsumort aufteilen: zu Hause/Büro (~0,10–0,30 € pro Tasse) vs. unterwegs/Gastronomie (~2–4 €) — gewichtet grob 0,50–1 € pro Tasse ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' → ~150 Mio Tassen/Tag × 365 × Misch-Preis ~0,50 € ≈ 27 Mrd €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie hoch ist der tägliche Kaffee-Konsum in Deutschland (in Tassen) an einem Wochentag?';

-- 4. Autoreifen (bisher: 80–320 Tsd. Reifen pro Tag)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie viel Umsatz wird in Deutschland pro Jahr mit Autoreifen gemacht?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 2000000000,
  expected_order_of_magnitude_max = 12000000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss aufs Jahr hochrechnen (Tagesabsatz × ~200–250 Verkaufstage, oder den Jahresbedarf direkt herleiten) und mit dem Ø-Reifenpreis multiplizieren (~80–120 €) ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' → ~160T Reifen/Tag × 200 Verkaufstage × Ø ~100 € ≈ 3 Mrd €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie viele Autoreifen werden pro Tag in Deutschland verkauft?';

-- 5. Glühbirnen USA (bisher: 262,5 Mio – 1,05 Mrd Stück/Jahr)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie groß ist der Markt für Glühbirnen in privaten Immobilien in den USA (Umsatz in € pro Jahr)?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 800000000,
  expected_order_of_magnitude_max = 4000000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss monetarisieren: die hergeleitete Stückzahl mit dem Ø-Preis pro Glühbirne multiplizieren (LED-lastig, ca. 3–5 €) ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' × Ø-Preis ~3–4 €/Birne ≈ 2 Mrd €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie groß ist der Markt für Glühbirnen in privaten Immobilien in den USA?';

-- 6. Golfbälle USA (bisher: 52–200 Mio Stück/Jahr)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie viel Umsatz wird in den USA pro Jahr mit Golfbällen gemacht?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 100000000,
  expected_order_of_magnitude_max = 600000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss monetarisieren: die hergeleitete Anzahl Bälle mit dem Ø-Preis pro Ball multiplizieren (ca. 2–3 €, ein Dutzend kostet 25–50 $) ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' × Ø-Preis ~2,50 €/Ball ≈ 300 Mio €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie viele Golfbälle werden jedes Jahr in den USA verkauft?';

-- 7. iPhones Deutschland (bisher: 2–8 Mio Stück/Jahr)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie viel Umsatz wird in Deutschland pro Jahr mit iPhones gemacht?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 1600000000,
  expected_order_of_magnitude_max = 8000000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss monetarisieren: die hergeleitete Stückzahl mit dem Ø-Verkaufspreis pro iPhone multiplizieren (Mix aus neuen und günstigeren Modellen, ca. 800–1.000 €) ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' × Ø-Preis ~900 € ≈ 4,5 Mrd €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie viele iPhones werden pro Jahr in Deutschland verkauft?';

-- 8. Gebrauchte Brautkleider UK (bisher: 36–144 Tsd. Stück/Jahr)
UPDATE public.market_sizing_cases SET
  prompt = 'Wie viel Umsatz wird in Großbritannien pro Jahr mit gebrauchten Brautkleidern gemacht?',
  target_metric = 'Jährlicher Umsatz',
  unit_hint = '€/Jahr',
  expected_order_of_magnitude_min = 10000000,
  expected_order_of_magnitude_max = 75000000,
  reference_structure = COALESCE(reference_structure, '') || E'\n\n' ||
    'Zum Schluss monetarisieren: die hergeleitete Anzahl Kleider mit dem Ø-Preis pro gebrauchtem Kleid multiplizieren (ca. 300–500 €) ⇒ Umsatz in €/Jahr.',
  key_assumptions_examples = COALESCE(key_assumptions_examples, '') ||
    ' × Ø-Preis ~400 € ≈ 35 Mio €/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie viele gebrauchte Brautkleider werden in Großbritannien pro Jahr verkauft?';

-- 9. Geschenke 01.01. — nur Einheit vereinheitlichen ('€' → '€/Jahr')
UPDATE public.market_sizing_cases SET
  unit_hint = '€/Jahr'
WHERE question_type = 'maerkte' AND prompt = 'Wie viel Umsatz wird mit Geschenken für Deutsche gemacht, die am 01.01. Geburtstag haben?';

-- Migrations-History direkt mitschreiben (Muster dieses Repos für per-API-Anwendung)
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES ('20260827120000', 'maerkte_umsatz_in_euro', ARRAY['-- applied via management api: maerkte cases auf jahresumsatz in euro umgestellt'])
ON CONFLICT DO NOTHING;

COMMIT;
