-- ============================================================
-- Seed data for Pumpkin Careers Consulting Case Prep Hub
-- All content in GERMAN
-- ============================================================

-- ============================================================
-- 1. mental_math_questions (36 questions)
-- ============================================================

-- EASY: Multiplication (4)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'easy', 'multiplication', '200 x 30', 6000, 0, true),
  ('mental_math', 'easy', 'multiplication', '500 x 40', 20000, 0, true),
  ('mental_math', 'easy', 'multiplication', '150 x 20', 3000, 0, true),
  ('mental_math', 'easy', 'multiplication', '300 x 50', 15000, 0, true);

-- EASY: Percentage (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'easy', 'percentage', '10% von 500', 50, 0, true),
  ('mental_math', 'easy', 'percentage', '25% von 200', 50, 0, true),
  ('mental_math', 'easy', 'percentage', '50% von 1.200', 600, 0, true);

-- EASY: Division (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'easy', 'division', '6.000 ÷ 3', 2000, 0, true),
  ('mental_math', 'easy', 'division', '9.000 ÷ 30', 300, 0, true),
  ('mental_math', 'easy', 'division', '4.800 ÷ 4', 1200, 0, true);

-- EASY: Zero management (2)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'easy', 'zero_management', '50k x 3', 150000, 0, true),
  ('mental_math', 'easy', 'zero_management', '200k x 5', 1000000, 0, true);

-- MEDIUM: Multiplication (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'medium', 'multiplication', '45 x 120', 5400, 0, true),
  ('mental_math', 'medium', 'multiplication', '35 x 240', 8400, 0, true),
  ('mental_math', 'medium', 'multiplication', '72 x 150', 10800, 0, true);

-- MEDIUM: Percentage (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'medium', 'percentage', '15% von 4.800', 720, 0, true),
  ('mental_math', 'medium', 'percentage', '30% von 2.500', 750, 0, true),
  ('mental_math', 'medium', 'percentage', '8% von 12.500', 1000, 0, true);

-- MEDIUM: Division (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'medium', 'division', '84.000 ÷ 12', 7000, 0, true),
  ('mental_math', 'medium', 'division', '56.000 ÷ 8', 7000, 0, true),
  ('mental_math', 'medium', 'division', '39.000 ÷ 13', 3000, 0, true);

-- MEDIUM: Zero management (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'medium', 'zero_management', '2,4 Mio ÷ 8', 300000, 0, true),
  ('mental_math', 'medium', 'zero_management', '1,5 Mio ÷ 5', 300000, 0, true),
  ('mental_math', 'medium', 'zero_management', '750k x 4', 3000000, 0, true);

-- HARD: Multiplication (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'hard', 'multiplication', '3,5 x 250', 875, 0, true),
  ('mental_math', 'hard', 'multiplication', '1,8 x 4.500', 8100, 0, true),
  ('mental_math', 'hard', 'multiplication', '6,25 x 480', 3000, 0, true);

-- HARD: Percentage (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'hard', 'percentage', '12,5% von 640', 80, 0, true),
  ('mental_math', 'hard', 'percentage', '17,5% von 8.000', 1400, 0, true),
  ('mental_math', 'hard', 'percentage', '6,5% von 24.000', 1560, 0, true);

-- HARD: Division (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'hard', 'division', '1,2 Mio ÷ 16', 75000, 0, true),
  ('mental_math', 'hard', 'division', '2,7 Mio ÷ 36', 75000, 0, true),
  ('mental_math', 'hard', 'division', '960.000 ÷ 24', 40000, 0, true);

-- HARD: Zero management (3)
INSERT INTO public.mental_math_questions (module, difficulty, task_type, question, answer_value, tolerance, active)
VALUES
  ('mental_math', 'hard', 'zero_management', '0,5 Mio x 12', 6000000, 0, true),
  ('mental_math', 'hard', 'zero_management', '3,2 Mio ÷ 0,8k', 4000, 0, true),
  ('mental_math', 'hard', 'zero_management', '0,075 Mio x 40', 3000000, 0, true);


-- ============================================================
-- 2. case_math_questions (18 questions)
-- ============================================================

-- EASY: Profitability (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'easy', 'profitability',
   'Ein Unternehmen hat einen Umsatz von **10 Mio €** und Kosten von **7,5 Mio €**. Wie hoch ist der Gewinn in Mio €?',
   2.5, 0.01, true),
  ('case_math', 'easy', 'profitability',
   'Ein Onlineshop erzielt einen monatlichen Umsatz von **800.000 €**. Die Gewinnmarge beträgt **15%**. Wie hoch ist der monatliche Gewinn in €?',
   120000, 1, true);

-- EASY: Investment ROI (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'easy', 'investment_roi',
   'Ein Unternehmen investiert **200.000 €** in eine neue Maschine. Der jährliche Zusatzgewinn beträgt **50.000 €**. Wie hoch ist der ROI nach einem Jahr in %?',
   25, 0.1, true),
  ('case_math', 'easy', 'investment_roi',
   'Investition: **1 Mio €**. Jährlicher Cashflow: **250.000 €**. Nach wie vielen Jahren ist die Investition amortisiert?',
   4, 0, true);

-- EASY: Break-even (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'easy', 'break_even',
   'Fixkosten: **60.000 € pro Monat**. Verkaufspreis pro Einheit: **30 €**, variable Kosten: **10 €**. Wie viele Einheiten müssen pro Monat verkauft werden, um den Break-even zu erreichen?',
   3000, 0, true),
  ('case_math', 'easy', 'break_even',
   'Ein Abo-Service hat Fixkosten von **120.000 €/Jahr**. Jeder Kunde zahlt **10 €/Monat** und verursacht variable Kosten von **2 €/Monat**. Wie viele Kunden braucht das Unternehmen, um den Break-even pro Jahr zu erreichen?',
   1250, 0, true);

-- MEDIUM: Profitability (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'medium', 'profitability',
   'Ein SaaS-Unternehmen hat **5.000 Kunden** mit einem durchschnittlichen Jahresumsatz von **2.400 € pro Kunde**. Die Bruttomarge beträgt **70%** und die operativen Kosten belaufen sich auf **6 Mio €**. Wie hoch ist der operative Gewinn in Mio €?',
   2.4, 0.01, true),
  ('case_math', 'medium', 'profitability',
   'Umsatz **25 Mio €**, COGS **40%** vom Umsatz, SG&A **5 Mio €**, F&E **3 Mio €**. Wie hoch ist das EBIT in Mio €?',
   7, 0.01, true);

-- MEDIUM: Investment ROI (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'medium', 'investment_roi',
   'Du investierst **500.000 €** und erzielst nach 3 Jahren einen Gewinn von **125.000 €** pro Jahr. Wie hoch ist der ROI nach 3 Jahren in %?',
   75, 0.1, true),
  ('case_math', 'medium', 'investment_roi',
   'Eine Marketingkampagne kostet **80.000 €**. Sie generiert **2.000 neue Kunden** mit einem durchschnittlichen CLV von **120 €**. Wie hoch ist der ROI in %?',
   200, 0.1, true);

-- MEDIUM: Break-even (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'medium', 'break_even',
   'Ein Restaurant hat monatliche Fixkosten von **45.000 €**. Der durchschnittliche Umsatz pro Gast beträgt **35 €**, davon sind **40%** variable Kosten. Ab wie vielen Gästen pro Monat erreicht das Restaurant den Break-even?',
   2143, 1, true),
  ('case_math', 'medium', 'break_even',
   'Fixkosten eines neuen Produkts: **1,8 Mio €/Jahr**. Stückpreis: **90 €**, variable Kosten: **54 €/Stück**. Wie hoch ist die Break-even-Menge pro Jahr?',
   50000, 0, true);

-- HARD: Profitability (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'hard', 'profitability',
   'Ein Unternehmen hat **3 Geschäftsbereiche**: A (Umsatz **8 Mio €**, Marge **25%**), B (Umsatz **12 Mio €**, Marge **10%**), C (Umsatz **5 Mio €**, Marge **-8%**). Overhead-Kosten: **2 Mio €**. Wie hoch ist der Gesamtgewinn in Mio €?',
   1.8, 0.01, true),
  ('case_math', 'hard', 'profitability',
   'Ein E-Commerce-Unternehmen hat **2 Mio Bestellungen/Jahr** mit einem AOV von **65 €**. Die Retourenquote beträgt **30%** (Retouren generieren keinen Umsatz). Bruttomarge auf behaltene Ware: **45%**, Fulfillment-Kosten: **8 €/Bestellung** (auch für Retouren). Fixkosten: **20 Mio €/Jahr**. Wie hoch ist der Jahresgewinn in Mio €?',
   4.75, 0.1, true);

-- HARD: Investment ROI (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'hard', 'investment_roi',
   'Eine Private-Equity-Firma kauft ein Unternehmen für **50 Mio €** mit **60% Fremdkapital** zu **5% Zinsen p.a.**. Nach 5 Jahren wird es für **80 Mio €** verkauft. Der jährliche Free Cashflow von **4 Mio €** wird vollständig zur Schuldentilgung verwendet. Wie hoch ist der Equity-Multiple (Verkaufserlös nach Schulden / Eigenkapital)?',
   2.75, 0.05, true),
  ('case_math', 'hard', 'investment_roi',
   'Investition in eine neue Fabrik: **15 Mio €**. Jährliche Zusatzerlöse: **8 Mio €**, variable Kosten **55%** vom Umsatz, zusätzliche Fixkosten **1,2 Mio €/Jahr**. Ab welchem Jahr erwirtschaftest du kumuliert mehr als die Investitionskosten (Payback-Periode als ganze Zahl)?',
   6, 0, true);

-- HARD: Break-even (2)
INSERT INTO public.case_math_questions (module, difficulty, category, question, answer_value, tolerance, active)
VALUES
  ('case_math', 'hard', 'break_even',
   'Fixkosten: **2,4 Mio €/Jahr**. Stückpreis: **120 €**, variable Kosten: **72 €/Stück**. Ab welcher Stückzahl ist der Break-even erreicht?',
   50000, 0, true),
  ('case_math', 'hard', 'break_even',
   'Ein Startup bietet zwei Produkte an: Basic (**20 €/Monat**, variable Kosten **5 €**, Anteil **70%** der Kunden) und Premium (**50 €/Monat**, variable Kosten **15 €**, Anteil **30%**). Fixkosten: **500.000 €/Jahr**. Wie viele Gesamtkunden braucht das Startup pro Jahr für den Break-even?',
   2232, 5, true);


-- ============================================================
-- 3. market_sizing_cases (12 cases)
-- ============================================================

-- EASY (4)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max, active)
VALUES
  ('easy', 'mobility', 'Germany',
   'Wie groß ist der Markt für E-Scooter-Sharing in Deutschland (jährlicher Umsatz)?',
   'Jährlicher Umsatz', '€/Jahr', 'top_down,bottom_up',
   'Top-down: Bevölkerung in Großstädten → Anteil potenzieller Nutzer → Fahrten pro Nutzer/Jahr → Durchschnittspreis pro Fahrt. Bottom-up: Anzahl E-Scooter → Fahrten pro Scooter/Tag → Umsatz pro Fahrt.',
   100000000, 500000000, true),

  ('easy', 'retail', 'Germany',
   'Wie viele Bäckereien gibt es in Deutschland?',
   'Anzahl Bäckereien', 'Stück', 'top_down,bottom_up',
   'Top-down: Bevölkerung → Einwohner pro Bäckerei. Bottom-up: Anzahl Städte/Gemeinden → durchschnittliche Bäckereien pro Gemeinde.',
   10000, 15000, true),

  ('easy', 'consumer', 'Germany',
   'Wie hoch ist der jährliche Umsatz mit Speiseeis in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top_down,bottom_up',
   'Top-down: Bevölkerung → Pro-Kopf-Verbrauch → Durchschnittspreis. Bottom-up: Absatzkanäle (Supermarkt, Eisdiele, Kiosk) → Volumen pro Kanal.',
   2000000000, 4000000000, true),

  ('easy', 'education', 'Germany',
   'Wie viele Studierende sind aktuell an deutschen Hochschulen eingeschrieben?',
   'Anzahl Studierende', 'Personen', 'top_down',
   'Top-down: Bevölkerung 18-30 Jahre → Anteil Studierende.',
   2500000, 3500000, true);

-- MEDIUM (4)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max, active)
VALUES
  ('medium', 'saas', 'Germany',
   'Wie viele Unternehmen in Deutschland nutzen aktiv ein CRM-System?',
   'Anzahl Unternehmen', 'Unternehmen', 'top_down,bottom_up',
   'Top-down: Gesamtanzahl Unternehmen → Segmentierung nach Größe → Adoptionsrate pro Segment. Bottom-up: Marktanteile der CRM-Anbieter → bekannte Kundenzahlen.',
   200000, 600000, true),

  ('medium', 'fintech', 'Germany',
   'Wie hoch ist das jährliche Transaktionsvolumen von Mobile-Payment-Lösungen in Deutschland?',
   'Jährliches Transaktionsvolumen', '€/Jahr', 'top_down,bottom_up',
   'Top-down: Smartphone-Nutzer → Anteil Mobile-Payment-Nutzer → Transaktionen pro Nutzer/Jahr → Durchschnittswert. Bottom-up: Marktanteile (Apple Pay, Google Pay, etc.) → gemeldete Volumen.',
   30000000000, 80000000000, true),

  ('medium', 'energy', 'Germany',
   'Wie viele private Solaranlagen (PV-Anlagen) sind derzeit auf deutschen Dächern installiert?',
   'Anzahl PV-Anlagen', 'Anlagen', 'top_down,bottom_up',
   'Top-down: Anzahl Ein-/Zweifamilienhäuser → Anteil mit PV-Anlage. Bottom-up: Installierte Kapazität (GW) ÷ Durchschnittsleistung pro Anlage.',
   2000000, 4000000, true),

  ('medium', 'logistics', 'Germany',
   'Wie viele Pakete werden pro Jahr in Deutschland an Privathaushalte zugestellt?',
   'Anzahl Pakete', 'Pakete/Jahr', 'top_down,bottom_up',
   'Top-down: E-Commerce-Umsatz → Durchschnittlicher Bestellwert → Anzahl Bestellungen. Bottom-up: Haushalte → Online-Besteller → Bestellungen pro Besteller.',
   3500000000, 5000000000, true);

-- HARD (4)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max, active)
VALUES
  ('hard', 'healthcare', 'Germany',
   'Schätze den jährlichen Umsatz des Marktes für digitale Gesundheitsapps (DiGA) in Deutschland.',
   'Jährlicher Umsatz', '€/Jahr', 'top_down,bottom_up',
   'Top-down: GKV-Versicherte → Anteil mit chronischen Erkrankungen → Verordnungsrate → Durchschnittspreis pro DiGA. Bottom-up: Anzahl zugelassener DiGA → Downloads → Conversion → Umsatz pro Nutzer.',
   200000000, 800000000, true),

  ('hard', 'real_estate', 'Germany',
   'Wie hoch ist der jährliche Gesamtumsatz im deutschen Markt für Co-Working-Spaces?',
   'Jährlicher Umsatz', '€/Jahr', 'top_down,bottom_up',
   'Top-down: Büroarbeitsplätze in DE → Anteil flexible Arbeitsplätze → Anteil Co-Working → Durchschnittspreis pro Platz. Bottom-up: Anzahl Co-Working-Spaces → Plätze pro Space → Auslastung → Preis.',
   1500000000, 3000000000, true),

  ('hard', 'mobility', 'Germany',
   'Schätze die Anzahl der öffentlichen Ladepunkte für Elektroautos, die Deutschland bis 2030 benötigt.',
   'Anzahl Ladepunkte', 'Ladepunkte', 'top_down,bottom_up',
   'Top-down: Erwartete E-Autos 2030 → Ladepunkte-pro-Fahrzeug-Verhältnis. Bottom-up: Ladebedarfstypen (Zuhause, Arbeit, öffentlich) → Anteil öffentlich → Ladedauer → benötigte Kapazität.',
   500000, 1500000, true),

  ('hard', 'retail', 'Germany',
   'Wie groß ist der Markt für nachhaltige Mode (Sustainable Fashion) in Deutschland in € pro Jahr?',
   'Jährlicher Umsatz', '€/Jahr', 'top_down,bottom_up',
   'Top-down: Gesamter Bekleidungsmarkt → Anteil nachhaltige Mode. Bottom-up: Zielgruppen-Segmentierung → Zahlungsbereitschaft → Kauffrequenz.',
   3000000000, 8000000000, true);


-- ============================================================
-- 4. framework_cases (12 cases)
-- ============================================================

-- EASY (4)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('easy', 'profitability',
   'Ein mittelständischer Online-Händler verzeichnet sinkende Gewinne trotz steigendem Umsatz. Strukturiere die Analyse der Ursachen.',
   'B2C-Segment, Gewinnmarge deutlich rückläufig',
   'Profitability Framework',
   NULL, true),

  ('easy', 'profitability',
   'Eine Restaurantkette in Deutschland verzeichnet seit einigen Monaten rückläufige Gewinne. Analysiere die möglichen Ursachen.',
   'Personalkosten und Lebensmittelkosten gestiegen',
   'Profitability Framework',
   NULL, true),

  ('easy', 'growth',
   'Ein erfolgreiches Café in München möchte expandieren und den Umsatz deutlich steigern. Strukturiere deinen Ansatz.',
   'Einzelstandort, hohe Kundenzufriedenheit, volle Auslastung zu Stoßzeiten',
   'Growth Strategy Framework (Ansoff-Matrix)',
   NULL, true),

  ('easy', 'operations',
   'Ein Logistikunternehmen liegt bei der Lieferpünktlichkeit deutlich unter dem Branchendurchschnitt. Strukturiere deine Analyse.',
   'Veraltetes IT-System, hohe Mitarbeiterfluktuation',
   'Operations Framework',
   NULL, true);

-- MEDIUM (4)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('medium', 'market_entry',
   'Ein deutsches Fintech-Startup möchte in den brasilianischen Markt expandieren. Strukturiere deine Analyse.',
   'Produkt: Mobile Payment App, etablierte DACH-Nutzerbasis, Series B finanziert',
   'Market Entry Framework',
   NULL, true),

  ('medium', 'pricing',
   'Ein B2B-SaaS-Unternehmen für HR-Software plant eine deutliche Preiserhöhung. Analysiere die strategischen Implikationen und entwickle eine Empfehlung.',
   'Etabliertes Kundenportfolio, solide Churn, mehrere Hauptwettbewerber',
   'Pricing Framework',
   NULL, true),

  ('medium', 'ma',
   'Ein großer deutscher Automobilzulieferer erwägt die Übernahme eines kleineren Batterie-Startups. Bewerte die strategische Logik dieser Akquisition.',
   'Großer Zulieferer, Startup mit Festkörperbatterie-Technologie und Patentportfolio',
   'M&A Framework',
   NULL, true),

  ('medium', 'growth',
   'Ein traditioneller Verlag (Bücher und Zeitschriften) verliert seit Jahren Marktanteile. Der Vorstand möchte eine digitale Wachstumsstrategie. Strukturiere deinen Ansatz.',
   'Sinkender Umsatz, starke Marke, kaum digitale Präsenz',
   'Digital Transformation / Growth Framework',
   NULL, true);

-- HARD (4)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('hard', 'profitability',
   'Ein internationaler Industriekonzern mit 4 Geschäftsbereichen hat trotz Umsatzwachstum sinkende Gesamtprofitabilität. 2 Bereiche sind profitabel, 2 verlieren Geld. Strukturiere Analyse und Handlungsempfehlungen.',
   'Konzernumsatz ~5 Mrd €. Profitabel: Automotive und Chemicals. Negatives EBIT: Energy und Digital.',
   'Profitability Framework mit Portfolio-Analyse',
   NULL, true),

  ('hard', 'market_entry',
   'Ein europäischer Luxusmodehersteller plant den Eintritt in den chinesischen Markt über ein Direct-to-Consumer-Modell. Es gibt bereits lokale und internationale Wettbewerber. Entwickle eine umfassende Markteintritts-Strategie.',
   'Traditionsmarke mit ~800 Mio € Umsatz (nur Europa), hohe EU-Markenbekanntheit, kein Asien-Track-Record, definiertes Markteintrittsbudget',
   'Market Entry Framework mit Customer Journey & Channel Strategy',
   NULL, true),

  ('hard', 'ma',
   'Eine große Versicherungsgruppe plant die Übernahme eines InsurTech-Startups mit KI-basierter Schadensregulierung. Führe eine umfassende Due Diligence durch und bewerte den strategischen Fit.',
   'Großversicherer (~10 Mrd € Prämienvolumen, konservative IT). InsurTech: kleines Umsatzvolumen, proprietärer ML-Algorithmus, B2B-Kundenstamm.',
   'M&A Framework mit Tech Due Diligence',
   NULL, true),

  ('hard', 'pricing',
   'Ein Pharmaunternehmen bringt ein neuartiges Medikament gegen eine seltene Krankheit auf den deutschen Markt. Es gibt keine vergleichbare Therapie. Entwickle eine Preisstrategie, die regulatorische, ethische und wirtschaftliche Aspekte berücksichtigt.',
   'Kleine Patientenpopulation in DE, hohe F&E-Kosten, Patentschutz vorhanden, hohe klinische Wirksamkeit, GKV-Erstattung notwendig',
   'Value-Based Pricing Framework mit Stakeholder-Analyse',
   NULL, true);


-- ============================================================
-- 5. chart_cases (9 cases)
-- ============================================================

-- EASY (3)
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('easy', 'bar',
   'Analysiere die Umsatzentwicklung des Unternehmens über die letzten 4 Quartale. Was fällt dir auf?',
   '{"labels": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"], "datasets": [{"label": "Umsatz (Mio €)", "data": [12.5, 14.2, 13.8, 16.1], "color": "#f59e0b"}]}',
   'Quartalsumsatz 2024',
   'Achte auf den Gesamttrend und mögliche Saisonalität.',
   NULL, true),

  ('easy', 'pie',
   'Analysiere die Umsatzverteilung nach Regionen. In welcher Region siehst du das größte Wachstumspotenzial?',
   '{"labels": ["DACH", "Westeuropa", "Osteuropa", "Nordamerika", "Asien"], "datasets": [{"label": "Umsatzanteil (%)", "data": [45, 25, 5, 15, 10], "color": "#3b82f6"}]}',
   'Umsatzverteilung nach Region 2024',
   'Vergleiche die Regionen hinsichtlich Marktgröße und aktuellem Anteil.',
   NULL, true),

  ('easy', 'bar',
   'Vergleiche die Mitarbeiterzufriedenheit in den verschiedenen Abteilungen. Wo besteht Handlungsbedarf?',
   '{"labels": ["Vertrieb", "Marketing", "IT", "HR", "Produktion", "F&E"], "datasets": [{"label": "Zufriedenheit (1-10)", "data": [7.2, 8.1, 6.3, 7.8, 5.9, 8.5], "color": "#10b981"}]}',
   'Mitarbeiterzufriedenheit nach Abteilung',
   'Identifiziere Abteilungen unter dem Durchschnitt und mögliche Ursachen.',
   NULL, true);

-- MEDIUM (3)
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('medium', 'line',
   'Vergleiche die Entwicklung von Umsatz und Kosten über die letzten 4 Quartale. Welche Trends erkennst du und welche Handlungsempfehlungen leitest du ab?',
   '{"labels": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"], "datasets": [{"label": "Umsatz (Mio €)", "data": [12.5, 14.2, 13.8, 16.1], "color": "#f59e0b"}, {"label": "Kosten (Mio €)", "data": [10.1, 11.5, 12.2, 11.8], "color": "#ef4444"}]}',
   'Umsatz vs. Kosten 2024',
   'Berechne die Marge pro Quartal. Wie entwickelt sich die Schere zwischen Umsatz und Kosten?',
   NULL, true),

  ('medium', 'bar',
   'Analysiere die Kundenakquisitionskosten (CAC) und den Customer Lifetime Value (CLV) nach Kanal. Welcher Kanal ist am effizientesten?',
   '{"labels": ["Google Ads", "Social Media", "Content Marketing", "Empfehlungen", "Messen"], "datasets": [{"label": "CAC (€)", "data": [120, 85, 45, 25, 200], "color": "#ef4444"}, {"label": "CLV (€)", "data": [480, 350, 520, 680, 420], "color": "#10b981"}]}',
   'CAC vs. CLV nach Marketingkanal',
   'Berechne das CLV/CAC-Verhältnis pro Kanal. Welche Kanäle sollen ausgebaut werden?',
   NULL, true),

  ('medium', 'line',
   'Analysiere die monatliche Entwicklung der drei wichtigsten KPIs. Welche Korrelationen erkennst du?',
   '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], "datasets": [{"label": "Umsatz (Tsd €)", "data": [320, 310, 345, 360, 380, 410, 350, 340, 390, 420, 450, 510], "color": "#3b82f6"}, {"label": "Marketingausgaben (Tsd €)", "data": [40, 35, 50, 55, 60, 65, 45, 40, 55, 60, 70, 80], "color": "#f59e0b"}, {"label": "Neue Kunden", "data": [150, 140, 170, 180, 200, 220, 160, 155, 195, 210, 240, 280], "color": "#10b981"}]}',
   'KPI-Dashboard 2024',
   'Untersuche den Zusammenhang zwischen Marketingausgaben und Neukundengewinnung. Gibt es einen zeitverzögerten Effekt?',
   NULL, true);

-- HARD (3)
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('hard', 'stacked_bar',
   'Analysiere die Umsatzverteilung nach Produktsegmenten über 4 Quartale. Welche strategischen Implikationen erkennst du? Welches Segment sollte priorisiert werden?',
   '{"labels": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"], "datasets": [{"label": "Segment A: Hardware (Mio €)", "data": [8.5, 8.2, 7.8, 7.1], "color": "#3b82f6"}, {"label": "Segment B: Software (Mio €)", "data": [3.0, 3.8, 4.5, 5.6], "color": "#10b981"}, {"label": "Segment C: Services (Mio €)", "data": [1.0, 2.2, 1.5, 3.4], "color": "#f59e0b"}]}',
   'Umsatz nach Produktsegment 2024',
   'Berechne die Wachstumsraten pro Segment. Welches Segment wächst am stärksten? Wie verändert sich der Umsatzmix?',
   NULL, true),

  ('hard', 'waterfall',
   'Erkläre den Gewinnrückgang von 2023 auf 2024 mithilfe der Waterfall-Analyse. Welche Hebel sind am wirkungsvollsten, um den Gewinn wieder zu steigern?',
   '{"labels": ["Gewinn 2023", "Umsatzwachstum", "COGS-Anstieg", "Personalkosten", "Marketing", "Miete", "Sonstige", "Gewinn 2024"], "datasets": [{"label": "Veränderung (Mio €)", "data": [15.0, 4.5, -3.2, -2.8, -1.5, -0.8, -0.7, 10.5], "color": "#3b82f6", "type": "waterfall"}]}',
   'Gewinnbrücke 2023 → 2024',
   'Identifiziere die größten negativen Treiber. Welche sind beeinflussbar? Priorisiere Maßnahmen nach Wirkung und Umsetzbarkeit.',
   NULL, true),

  ('hard', 'scatter',
   'Analysiere den Zusammenhang zwischen Filialfläche und Umsatz pro Quadratmeter. Welche Filialen sind über- bzw. unterperformend? Welche strategischen Schlüsse ziehst du?',
   '{"labels": ["Filiale München", "Filiale Berlin", "Filiale Hamburg", "Filiale Frankfurt", "Filiale Köln", "Filiale Stuttgart", "Filiale Düsseldorf", "Filiale Leipzig"], "datasets": [{"label": "Fläche (m²)", "data": [450, 800, 350, 600, 280, 520, 400, 200], "color": "#3b82f6"}, {"label": "Umsatz/m² (€)", "data": [12500, 8200, 14800, 9500, 11000, 13200, 7800, 15500], "color": "#ef4444"}]}',
   'Filialperformance: Fläche vs. Umsatz/m²',
   'Identifiziere Ausreißer. Gibt es eine optimale Filialgröße? Welche Filialen sollten vergrößert/verkleinert werden?',
   NULL, true);


-- ============================================================
-- 6. creativity_cases (12 cases)
-- ============================================================

-- EASY (4)
INSERT INTO public.creativity_cases (difficulty, industry, prompt, context_info, reference_ideas, active)
VALUES
  ('easy', 'retail',
   'Ein traditioneller Buchladen in einer Kleinstadt verliert Kunden an Amazon. Entwickle eine kreative Strategie, um den Laden wieder profitabel zu machen.',
   '50 m² Ladenfläche, 2 Mitarbeiter, treue ältere Stammkunden, Innenstadt-Lage, Jahresumsatz 180.000 €',
   NULL, true),

  ('easy', 'tech',
   'Ein kleines IT-Beratungsunternehmen hat Schwierigkeiten, qualifizierte Entwickler zu rekrutieren. Entwickle kreative Ansätze zur Mitarbeitergewinnung.',
   '15 Mitarbeiter, Standort: mittelgroße Stadt, Budget für Recruiting: 20.000 €/Jahr, bisher nur Stellenanzeigen auf Indeed',
   NULL, true),

  ('easy', 'healthcare',
   'Eine Hausarztpraxis in einer ländlichen Region hat Probleme mit langen Wartezeiten und unzufriedenen Patienten. Entwickle innovative Lösungsansätze.',
   '2 Ärzte, 3 Arzthelferinnen, 80 Patienten/Tag, durchschnittliche Wartezeit: 45 Minuten, keine Online-Terminbuchung',
   NULL, true),

  ('easy', 'finance',
   'Eine lokale Volksbank verliert junge Kunden (18-30 Jahre) an Neobanken wie N26 oder Trade Republic. Entwickle eine Strategie, um diese Zielgruppe zurückzugewinnen.',
   '50 Filialen in der Region, 120.000 Kunden, Durchschnittsalter: 52 Jahre, App vorhanden aber veraltet, starkes Filialnetz',
   NULL, true);

-- MEDIUM (4)
INSERT INTO public.creativity_cases (difficulty, industry, prompt, context_info, reference_ideas, active)
VALUES
  ('medium', 'mobility',
   'Ein Carsharing-Anbieter hat in Innenstädten Probleme mit der Auslastung am Wochenende. Unter der Woche liegt die Auslastung bei 70%, am Wochenende bei nur 25%. Entwickle ein innovatives Konzept zur Steigerung der Wochenend-Nutzung.',
   '5.000 Fahrzeuge in 8 deutschen Großstädten, Zielgruppe: urbane Professionals 25-45, Kooperation mit ÖPNV vorhanden, durchschnittliche Mietdauer: 45 Minuten',
   NULL, true),

  ('medium', 'sustainability',
   'Ein mittelständischer Lebensmittelproduzent (Fertiggerichte) möchte seine Verpackungen vollständig nachhaltig gestalten, ohne die Kosten signifikant zu erhöhen. Entwickle ein kreatives Konzept.',
   'Aktueller Verpackungsanteil an Produktkosten: 12%, 50 verschiedene Produkte, Großteil Plastikverpackungen, Kunden zunehmend umweltbewusst, Jahresumsatz: 80 Mio €',
   NULL, true),

  ('medium', 'tech',
   'Ein traditionelles Handwerksunternehmen (Schreinerei, 30 Mitarbeiter) möchte sich digital transformieren. Der Geschäftsführer hat wenig Tech-Erfahrung. Entwickle einen realistischen und kreativen Digitalisierungsplan.',
   'Umsatz: 3 Mio €/Jahr, Auftragsbuch handschriftlich geführt, Kundenkommunikation per Telefon und Fax, Mitarbeiter-Durchschnittsalter: 42, Website: nur Kontaktinfos',
   NULL, true),

  ('medium', 'retail',
   'Eine Modekette mit 40 Filialen kämpft mit hohen Retourenquoten im Onlineshop (45%). Entwickle kreative Lösungen, um die Retouren zu reduzieren, ohne den Online-Umsatz zu gefährden.',
   'Online-Anteil: 35% des Gesamtumsatzes, durchschnittlicher Warenkorbwert: 85 €, Hauptgrund Retouren: falsche Größe (60%), Retourenkosten: 8 €/Retoure',
   NULL, true);

-- HARD (4)
INSERT INTO public.creativity_cases (difficulty, industry, prompt, context_info, reference_ideas, active)
VALUES
  ('hard', 'sustainability',
   'Entwickle ein disruptives Geschäftsmodell für nachhaltige Lebensmittelversorgung in deutschen Großstädten, das bestehende Lieferketten grundlegend verändert.',
   'Kontext: 30% Lebensmittelverschwendung, steigende Nachfrage nach regionalen Produkten, Urban Farming als Trend, letzte Meile als Kostentreiber, 40 Mio Stadtbewohner in DE',
   NULL, true),

  ('hard', 'healthcare',
   'Entwickle ein innovatives Geschäftsmodell, das die psychische Gesundheitsversorgung in Deutschland revolutioniert. Berücksichtige die aktuelle Versorgungslücke (durchschnittlich 6 Monate Wartezeit auf einen Therapieplatz).',
   '5,7 Mio Menschen mit behandlungsbedürftiger psychischer Erkrankung, ca. 27.000 Psychotherapeuten in DE, GKV-Erstattung komplex, Digitale-Versorgung-Gesetz als Chance, Stigmatisierung als Barriere',
   NULL, true),

  ('hard', 'mobility',
   'Entwirf ein völlig neues Mobilitätskonzept für eine deutsche Großstadt (500.000 Einwohner), das bis 2035 den Individualverkehr mit Verbrennungsmotoren vollständig ersetzt. Das Konzept muss wirtschaftlich tragbar und sozial gerecht sein.',
   'Aktuelle Situation: 250.000 zugelassene PKW, ÖPNV-Anteil 22%, Fahrrad-Anteil 15%, 30% der Bevölkerung über 60, hügelige Topographie, durchschnittliches Pendleraufkommen: 80.000/Tag',
   NULL, true),

  ('hard', 'finance',
   'Entwickle ein innovatives Finanzprodukt oder -service, das die Altersvorsorge für Millennials und Gen Z in Deutschland grundlegend neu denkt. Berücksichtige die sinkende Rentenerwartung und das veränderte Sparverhalten.',
   'Durchschnittliche Sparquote 18-35-Jährige: 8%, nur 30% haben private Altersvorsorge, 60% misstrauen klassischen Bankprodukten, hohe Affinität zu Apps und digitalen Lösungen, Riester/Rürup als gescheitert wahrgenommen',
   NULL, true);
