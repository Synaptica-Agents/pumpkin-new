-- ============================================================
-- Top-up framework_cases to 3 per (difficulty × category) combo.
-- Current state: most combos at 3, six combos at 2. Adds exactly
-- those six missing cases so every user filter returns ≥3 cases.
--
-- Content rules follow feedback_drill_simplification.md:
--   easy  → 0 numbers in prompt + context_info
--   hard  → 3-4 structural numbers only (scale / direction)
-- ============================================================

-- EASY (4 new: profitability, growth, pricing, operations)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('easy', 'profitability',
   'Ein Coworking-Space-Anbieter in einer deutschen Großstadt verzeichnet rückläufige Profitabilität trotz konstanter Auslastung. Strukturiere deine Analyse.',
   'Mehrere Standorte in zentralen Lagen, Mitglieder-Mix aus Freelancern und Firmen-Teams, Gastronomie-Anteil ausbaufähig',
   'Profitability Framework',
   '• Kostenanalyse: Fixkosten (Miete, Personal) pro Standort aufschlüsseln, variable Kosten (Energie, Services) analysieren
• Umsatzseite: Durchschnittlicher Umsatz pro Mitglied, Mix aus Einzel-/Team-Tarifen, Zusatzleistungen (Meeting-Räume, Events) bewerten
• Handlungsempfehlung: Auslastungsgetriebene Staffelpreise, Zusatzeinnahmen aus Events und Gastronomie, Standort-Portfolio überprüfen',
   true),

  ('easy', 'growth',
   'Eine Online-Plattform für Yoga-Kurse hat ihr schnelles Wachstum hinter sich und stagniert. Strukturiere Wachstumshebel.',
   'Kostenpflichtige Mitgliedschaften, Zielgruppe bislang urbane Frauen 25-45, Live- und On-Demand-Kurse',
   'Growth Strategy Framework (Ansoff-Matrix)',
   '• Marktdurchdringung: Churn reduzieren durch Community-Features, Empfehlungsprogramm, Win-back-Kampagnen für Ex-Mitglieder
• Produktentwicklung: Ergänzende Formate (Meditation, Ernährung, Rückentraining), Corporate-Wellness-Pakete
• Marktentwicklung: Neue Zielgruppen (Senioren, Männer, Schwangere), Expansion in weitere DACH-Märkte',
   true),

  ('easy', 'pricing',
   'Ein Streaming-Anbieter für deutschsprachige Hörbücher möchte seine Preise überarbeiten. Strukturiere die Analyse.',
   'Aktuell eine einzige Flatrate, wachsende Katalog-Kosten, Wettbewerb durch internationale Player',
   'Pricing Framework',
   '• Zahlungsbereitschaft: Nutzergruppen segmentieren (Vielhörer, Gelegenheitsnutzer, Familien) und Preisschwellen ermitteln
• Wettbewerbsbenchmark: Preispositionierung gegenüber internationalen und lokalen Anbietern, differenzierende Merkmale herausarbeiten
• Preismodell: Gestaffelte Tiers (Basic/Standard/Family), Jahresabo mit Rabatt, Werbefinanzierte Einstiegsvariante prüfen',
   true),

  ('easy', 'operations',
   'Ein regionaler Paketzusteller für Nahversorgungs-Lieferungen kämpft mit sinkender Liefertreue und steigenden Beschwerden. Strukturiere deine Analyse.',
   'Last-Mile-Fokus, saisonale Spitzen im Umsatz, kein durchgängiges Tracking, manuelle Tourenplanung',
   'Operations Framework',
   '• Prozessanalyse: Tourenplanung, Hub-Abläufe und Auslieferung kartieren, Engpässe und Fehlerquellen identifizieren
• Quick Wins: Dynamische Tourenoptimierung, Echtzeit-Tracking für Kunden, strukturierte Eskalations-Prozesse für Reklamationen
• Langfristig: Automatisierung im Hub, Kapazitätsplanung nach Saisonalität, Qualitätskennzahlen pro Fahrer etablieren',
   true);


-- HARD (2 new: market_entry, ma)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('hard', 'market_entry',
   'Ein europäischer SaaS-Anbieter für Compliance-Management (Umsatz ca. 120 Mio €) erwägt Markteintritt in die USA – entweder durch den Aufbau einer eigenen Vertriebsorganisation oder durch Akquisition eines kleineren US-Players. Strukturiere die Go-to-Market-Entscheidung.',
   'US-Markt: 3 große Platzhirsche decken den Enterprise-Bereich ab, Mid-Market fragmentiert. Ziel-Akquisition: ca. 20 Mio USD ARR, profitabel, aber mit limitiertem Produkt-Fit',
   'Market Entry + Build-vs-Buy + 3C Framework',
   '• Marktattraktivität und Fit: Segmentierung des US-Marktes (Enterprise vs Mid-Market), regulatorische Unterschiede (SEC, HIPAA), Produkt-Lokalisierung, realistische Ziel-Segmente
• Build-Szenario: Aufbau eigener Vertrieb + Customer Success, Sales-Cycle und Ramp-up-Zeit, Break-even-Projektion, Risiko geringer Marktdurchdringung ohne lokale Marke
• Buy-Szenario: Strategischer Fit der Ziel-Firma, Synergien (Cross-Sell in Bestandskunden, Produkt-Konvergenz), Integrationsrisiken, Bewertung ob 20 Mio USD ARR Cash-Flow rechtfertigen
• Entscheidungs-Logik: Trade-off zwischen Geschwindigkeit (Buy) und Marge (Build), Fallback-Optionen (Channel-Partner, JV), klare KPIs und Meilensteine für beide Pfade',
   true),

  ('hard', 'ma',
   'Ein börsennotierter Industrie-Konzern (Umsatz ca. 4 Mrd €, 4 Geschäftsbereiche, 2 profitabel/2 mit Verlust) prüft einen Portfolio-Umbau: Verkauf eines verlustbringenden Segments und Akquisition eines Spezialisten im Kernbereich. Strukturiere die Analyse für den Aufsichtsrat.',
   'Aktionärsdruck auf Fokussierung, Verlustsegment mit stabilem Umsatz aber fallendem EBIT, Akquisitionsziel: Nischenführer im Kerngeschäft mit ca. 300 Mio € Umsatz',
   'M&A Framework (Divestiture + Acquisition + Capital Allocation)',
   '• Divestiture-Logik: Strategischer Fit des Verlust-Segments prüfen, Bewertung realistischer Verkaufspreise, steuerliche Konsequenzen, Impact auf Konzernkennzahlen (EBIT-Marge, ROCE)
• Akquisitions-Logik: Strategischer Fit der Zielfirma (Technologie, Kunden, Geografie), Bewertung vs. Multiples vergleichbarer Transaktionen, quantifizierbare Synergien (Umsatz + Kosten)
• Kapital- und Timing-Analyse: Verwendung des Verkaufserlöses (Akquisition, Schuldentilgung, Dividende), Sequenzierung der Deals, Finanzierung (Cash, Aktien, Fremdkapital)
• Kommunikation und Governance: Aufsichtsrat-Vote, Investoren-Story, Mitarbeiter-Kommunikation, Meilensteine und Post-Merger-Integration',
   true);
