-- ============================================================
-- 50 new chart_cases: expansion 50 → 100 total
-- Themes: Supply Chain, ESG, Healthcare, HR + Consulting classics
-- Rebalances Pie/Scatter/Waterfall (previously thin)
-- ============================================================


-- ============================================================
-- CLUSTER A: Supply Chain / Logistik (8 Cases)
-- ============================================================

INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('easy', 'bar',
   'Du siehst die On-Time-Delivery-Rate der fünf wichtigsten Lieferanten. Welche Lieferanten performen am schlechtesten und was solltest du als nächstes prüfen?',
   '{"labels": ["Lieferant A", "Lieferant B", "Lieferant C", "Lieferant D", "Lieferant E"], "datasets": [{"label": "OTD (%)", "data": [94, 88, 76, 92, 85], "color": "#3b82f6"}]}',
   'Lieferpünktlichkeit Top-5-Lieferanten',
   'Vergleiche die Raten und identifiziere Ausreißer. Welche Schwelle wäre im Einkauf akzeptabel?',
   NULL,
   true),

  ('easy', 'line',
   'Wie hat sich die OTIF-Rate (On Time In Full) über das Jahr entwickelt? Beschreibe den Trend und nenne mögliche Treiber.',
   '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], "datasets": [{"label": "OTIF-Rate (%)", "data": [82, 85, 84, 87, 88, 86, 85, 84, 88, 90, 92, 91], "color": "#10b981"}]}',
   'OTIF-Rate 2024',
   'Achte auf saisonale Muster und die Richtung im zweiten Halbjahr.',
   NULL,
   true),

  ('medium', 'waterfall',
   'Analysiere die Bestandsveränderung zwischen Jahresbeginn und -ende. Welche Positionen treiben den Aufbau und ist das ein Warn- oder Wachstumssignal?',
   '{"labels": ["Bestand Q1", "Rohmaterialien", "Halbfabrikate", "Fertigwaren", "Wertberichtigung", "Bestand Q4"], "datasets": [{"label": "Veränderung (Mio €)", "data": [45, 8, -3, 6, -2, 54], "color": "#3b82f6"}]}',
   'Bestandsentwicklung Q1 → Q4 2024',
   'Welche Kategorie dominiert und wie interpretierst du den Anstieg im Kontext der Umsatzentwicklung?',
   'Rohmaterialien (+8 Mio €) und Fertigwaren (+6 Mio €) treiben den Bestandsaufbau, teilkompensiert durch Abbau bei Halbfabrikaten und höhere Wertberichtigungen. Netto +9 Mio € bei gleichbleibender Umsatzbasis ist ein Warnsignal (langsamer Lagerumschlag, mögliche Nachfrageschwäche). Bei starkem Umsatzwachstum wäre der Aufbau dagegen normal und sogar nötig für Lieferfähigkeit.',
   true),

  ('medium', 'stacked_bar',
   'Du siehst die Lagerkosten pro Standort aufgeschlüsselt nach Kostenart. Welcher Standort ist am teuersten und wo liegen die Haupttreiber?',
   '{"labels": ["Zentrallager", "Regionallager Nord", "Regionallager Süd", "Werkslager"], "datasets": [{"label": "Personal", "data": [4.2, 2.1, 2.3, 1.4], "color": "#3b82f6"}, {"label": "Miete", "data": [2.8, 1.6, 1.4, 0.9], "color": "#f59e0b"}, {"label": "Abschreibungen", "data": [1.5, 0.7, 0.6, 0.5], "color": "#10b981"}]}',
   'Lagerkosten pro Standort (Mio €)',
   'Betrachte absolute Höhe und Mix je Standort. Wo gibt es Konsolidierungspotenzial?',
   'Zentrallager ist mit 8,5 Mio € deutlich am teuersten, getrieben von Personal (4,2) und Miete (2,8). Die beiden Regionallager sind vergleichbar bei rund 4,4 Mio €. Personal dominiert überall den Kostenmix — Automatisierung wäre der primäre Hebel. Potenzial: Zusammenlegung Nord/Süd oder Verlagerung von Zentrallager-Volumen in günstigere Regionen.',
   true),

  ('medium', 'scatter',
   'Du siehst die Liefergenauigkeit (in %) gegen die jährliche Einkaufsmenge je Lieferant. Gibt es eine Korrelation zwischen Volumen und Performance? Welche Lieferanten sind problematisch und welche Chancen siehst du?',
   '{"labels": ["Lieferant 1", "Lieferant 2", "Lieferant 3", "Lieferant 4", "Lieferant 5", "Lieferant 6", "Lieferant 7", "Lieferant 8", "Lieferant 9", "Lieferant 10"], "datasets": [{"label": "Einkaufsvolumen (Mio €)", "data": [12, 3, 8, 15, 5, 22, 2, 18, 7, 11], "color": "#3b82f6"}, {"label": "Liefergenauigkeit (%)", "data": [92, 78, 88, 94, 72, 91, 85, 82, 96, 75], "color": "#10b981"}]}',
   'Liefervolumen vs. Liefergenauigkeit',
   'Suche Muster: Sind große Lieferanten zuverlässiger? Welche Punkte liegen außerhalb des Haupt-Clusters?',
   'Tendenziell liegen große Lieferanten (>10 Mio €) bei 82–94 % Genauigkeit, mit Lieferant 8 (18 Mio €, 82 %) als Underperformer trotz Volumen — dort liegt erheblicher Hebel. Kleine Lieferanten streuen stärker: Lieferant 9 (7 Mio €, 96 %) ist ein Best Performer der bevorzugt werden sollte, Lieferant 5 (5 Mio €, 72 %) ein Kandidat für Austausch. Keine klare Volumen-Qualität-Korrelation — strukturelle Lieferanten-Management-Themen, nicht Volumen-Abhängigkeit.',
   true),

  ('hard', 'line',
   'Du siehst vier Supply-Chain-KPIs über die letzten acht Quartale. Welche Dynamik entsteht aus dem Zusammenspiel der Metriken und welche strategische Konsequenz würdest du dem Vorstand empfehlen?',
   '{"labels": ["Q1/23", "Q2/23", "Q3/23", "Q4/23", "Q1/24", "Q2/24", "Q3/24", "Q4/24"], "datasets": [{"label": "Lieferzeit (Tage)", "data": [14, 15, 16, 17, 18, 17, 16, 15], "color": "#ef4444"}, {"label": "OTD (%)", "data": [92, 90, 88, 85, 82, 84, 87, 89], "color": "#3b82f6"}, {"label": "Bestandsreichweite (Tage)", "data": [45, 48, 52, 55, 58, 55, 52, 50], "color": "#f59e0b"}, {"label": "Logistikkosten-Index", "data": [100, 103, 108, 115, 120, 118, 115, 112], "color": "#10b981"}]}',
   'Supply-Chain-KPI-Dashboard 2023–2024',
   'Lies alle vier KPIs zusammen. Was passierte 2023 → Anfang 2024 und wie erholt sich die Kette?',
   'Zwischen Q1/23 und Q1/24 verschlechterte sich das Gesamtbild deutlich: Lieferzeit stieg von 14 auf 18 Tage, OTD fiel von 92 auf 82 %, Bestände stiegen von 45 auf 58 Tagen (überproduziert als Puffer), Kostenindex +20 %. Klassische Krise durch externe Disruption (wahrscheinlich Rohstoff/Logistik). Ab Q2/24 beginnt Erholung in allen vier KPIs, aber noch nicht auf Vorkrisenniveau. Empfehlung: strukturelles Resilienz-Programm (Dual Sourcing, bessere Prognose-Tools) um Wiederholung zu vermeiden, und Bestandsabbau als Quick-Win zur Kapitalfreisetzung.',
   true),

  ('hard', 'waterfall',
   'Ein Supply-Chain-Transformationsprogramm ist abgeschlossen. Zeichne aus der Waterfall die einzelnen Kostenhebel nach und bewerte, ob das Programm erfolgreich war.',
   '{"labels": ["Logistikkosten 2022", "Netzwerkkonsolidierung", "Nearshoring", "Frachtverhandlung", "Automatisierung", "Digitalisierung", "Inflation", "Logistikkosten 2024"], "datasets": [{"label": "Veränderung (Mio €)", "data": [420, -35, -18, -12, -22, -15, 45, 363], "color": "#3b82f6"}]}',
   'Supply-Chain-Kostenbrücke 2022 → 2024',
   'Identifiziere die Top-3-Hebel und stelle sie gegen Gegenwinde.',
   'Die fünf strukturellen Hebel reduzierten die Kosten um 102 Mio €, angeführt von Netzwerkkonsolidierung (-35) und Automatisierung (-22). Inflation (+45) hat rund 44 % der Einsparungen wieder aufgezehrt. Netto wurden 57 Mio € oder 13,6 % eingespart — deutlich über einem typischen Benchmark-Programm (8–10 %). Das Programm war erfolgreich, aber die Abhängigkeit von Automatisierung und Netzwerk-Design zeigt, dass weitere Hebel (Lieferantenverhandlung, Produkt-Design für Supply Chain) für die nächste Welle offen sind.',
   true),

  ('hard', 'pie',
   'Die Scope-3-Emissionen des Unternehmens verteilen sich auf sechs Kategorien. Welche Kategorien priorisierst du für Reduktionsmaßnahmen und warum?',
   '{"labels": ["Eingekaufte Güter", "Transport Upstream", "Nutzung verkaufter Produkte", "End-of-Life", "Geschäftsreisen", "Pendelverkehr"], "datasets": [{"label": "Anteil", "data": [42, 18, 28, 6, 4, 2], "color": "#3b82f6"}]}',
   'Scope-3-Emissionen-Mix 2024',
   'Priorisierung nach Anteil + Einflussmöglichkeit des Unternehmens. Wo ist Kontrolle hoch, wo niedrig?',
   'Eingekaufte Güter (42 %) und Nutzung verkaufter Produkte (28 %) machen zusammen 70 % aus und sollten höchste Priorität haben. Eingekaufte Güter: über Lieferanten-Scoring, Spezifikationen und Material-Substitution adressierbar — mittlere Kontrolle. Nutzung verkaufter Produkte: nur über Produkt-Redesign (Energieeffizienz) adressierbar — geringe kurzfristige Kontrolle, aber strategisch entscheidend für Wettbewerbsfähigkeit. Transport Upstream (18 %) ist ein Quick-Win über Modus-Shift Schiene/See. End-of-Life/Reisen/Pendeln zusammen 12 % — niedrige Priorität, symbolische Programme.',
   true);


-- ============================================================
-- CLUSTER B: ESG / Nachhaltigkeit (8 Cases)
-- ============================================================

INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('easy', 'pie',
   'Du siehst den Energiemix eines Produktionsunternehmens für 2024. Welcher Energieträger dominiert und wie siehst du die Nachhaltigkeit des Mixes?',
   '{"labels": ["Erdgas", "Strom (Netz)", "Strom (Erneuerbar)", "Fernwärme", "Heizöl"], "datasets": [{"label": "Anteil", "data": [38, 28, 22, 8, 4], "color": "#3b82f6"}]}',
   'Energiemix 2024',
   'Welcher Anteil ist fossil, welcher dekarbonisiert?',
   NULL,
   true),

  ('easy', 'bar',
   'Du siehst die CO2-Intensität (kg CO2 pro produzierter Tonne) der fünf Werke eines Chemiekonzerns. Wo liegen die Hebel für Emissionsreduktion?',
   '{"labels": ["Werk Ludwigshafen", "Werk Antwerpen", "Werk Freeport", "Werk Nanjing", "Werk Jurong"], "datasets": [{"label": "CO2-Intensität (kg/t)", "data": [180, 165, 220, 290, 210], "color": "#ef4444"}]}',
   'CO2-Intensität je Werk',
   'Vergleiche die Werte gegen den Mittelwert und identifiziere Ausreißer.',
   NULL,
   true),

  ('medium', 'line',
   'Das Unternehmen hat sich einen Dekarbonisierungspfad gesetzt. Liegt man auf Kurs? Wo sind die Risiken?',
   '{"labels": ["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"], "datasets": [{"label": "Ist-Emissionen (Mt CO2)", "data": [2.4, 2.3, 2.2, 2.05, 1.95, null, null, null, null, null, null], "color": "#ef4444"}, {"label": "Zielpfad (Mt CO2)", "data": [2.4, 2.28, 2.16, 2.04, 1.92, 1.80, 1.68, 1.56, 1.44, 1.32, 1.20], "color": "#10b981"}]}',
   'CO2-Reduktionspfad bis 2030',
   'Vergleiche Ist- und Soll-Linie. Ist das Delta wachsend oder schrumpfend?',
   'Bis 2024 liegt der Ist-Pfad minimal unter Plan (1,95 vs. 1,92 Mt), die Linie folgt der Trajektorie sehr genau. Risiko: die lineare Reduktion um rund 5 % pro Jahr reicht ab 2027 nicht mehr aus, wenn einfache Hebel (Effizienz, erneuerbarer Strom) ausgeschöpft sind. Ab dann braucht es strukturelle Maßnahmen (Prozess-Elektrifizierung, CCS, grüner Wasserstoff). Heute lobbyistisch die Hebel vorzubereiten ist wichtig, damit 2027+ nicht gegen die Zielkurve gelaufen wird.',
   true),

  ('medium', 'bar',
   'Du siehst die ESG-Ratings deines Unternehmens (DU) und der fünf engsten Wettbewerber nach MSCI-Methodik. Wo stehst du und was ist der Angriffspunkt für den IR-Bericht?',
   '{"labels": ["DU", "Wettbewerber A", "Wettbewerber B", "Wettbewerber C", "Wettbewerber D", "Wettbewerber E"], "datasets": [{"label": "Environmental", "data": [6.2, 7.8, 5.4, 8.1, 6.9, 4.8], "color": "#10b981"}, {"label": "Social", "data": [7.1, 6.8, 7.3, 7.6, 5.9, 6.2], "color": "#3b82f6"}, {"label": "Governance", "data": [8.0, 7.2, 8.4, 7.9, 6.8, 7.1], "color": "#8b5cf6"}]}',
   'ESG-Ratings (0–10) im Wettbewerbsvergleich',
   'Pro Dimension: wo führst du, wo bist du Schlusslicht?',
   'Environmental (6,2) ist die klare Schwäche — nur Wettbewerber E ist schlechter, die drei stärksten Peers liegen bei 6,9–8,1. Das wird im IR-Report ggü. Investoren der Hebel sein. Social (7,1) ist Mittelfeld, Governance (8,0) ist die Stärke, die aktiv zur Geschichte gehören muss. Empfehlung: ein konkreter E-Transformationsplan (Science-Based Targets, Scope-1+2-Roadmap) mit messbaren 2027er-Meilensteinen, gekoppelt mit der starken G-Story.',
   true),

  ('medium', 'waterfall',
   'Die Scope-1-Emissionen haben sich zwischen 2022 und 2024 verändert. Welche Hebel haben gewirkt und welche Gegenwinde gibt es?',
   '{"labels": ["Scope 1 2022", "Brennstoff-Substitution", "Prozess-Effizienz", "Produktionsvolumen", "Anlagen-Erweiterung", "Scope 1 2024"], "datasets": [{"label": "Veränderung (Kt CO2)", "data": [850, -120, -65, -40, 55, 680], "color": "#3b82f6"}]}',
   'Scope-1-Brücke 2022 → 2024',
   'Welche Maßnahme hatte den größten Effekt — und wie wurde sie realisiert?',
   'Brennstoff-Substitution (-120) dominiert mit rund 55 % der Einsparungen — typisch für den Wechsel von Kohle/Öl auf Erdgas oder Biogas. Prozess-Effizienz (-65) und Volumen-Rückgang (-40) ergänzen. Anlagen-Erweiterung wirkt gegen die Richtung (+55). Netto -170 Kt oder -20 % — ein gutes Ergebnis, aber der Hauptteil kommt aus einem Switching-Effekt, der nicht wiederholbar ist. Nächste Welle (2025+) muss auf Elektrifizierung/Wasserstoff setzen, sonst werden die Kurve flach.',
   true),

  ('medium', 'stacked_bar',
   'Du siehst die Anteile zertifizierter Rohstoffe je Produktmarke. Welche Marken sind führend und wo musst du aufholen, bevor die neue Regulierung greift?',
   '{"labels": ["Marke Alpha", "Marke Beta", "Marke Gamma", "Marke Delta"], "datasets": [{"label": "Zertifiziert", "data": [82, 64, 95, 48], "color": "#10b981"}, {"label": "Teilzertifiziert", "data": [12, 22, 4, 28], "color": "#f59e0b"}, {"label": "Nicht zertifiziert", "data": [6, 14, 1, 24], "color": "#ef4444"}]}',
   'Zertifizierungsquoten nach Marke (%)',
   'Welche Marken sind unterhalb einer möglichen Regulierungsschwelle von 80 %?',
   'Gamma ist Best-in-Class (95 %) und kann intern als Benchmark dienen. Alpha ist solide (82 %) und knapp über einer plausiblen Regulierungsschwelle. Beta (64 %) und vor allem Delta (48 %) sind kritisch — wenn die EU-Entwaldungsverordnung oder vergleichbare Regeln 80 % fordern, drohen Vermarktungsverbote. Delta braucht ein eigenes Sourcing-Programm mit 2-Jahres-Timeline, Beta reicht ein Beschleunigungsprogramm. Gegebenenfalls als Risk-Item in das Board-Risk-Reporting.',
   true),

  ('hard', 'scatter',
   'Ein PE-Fonds analysiert sein Portfolio von zwölf Beteiligungen nach ESG-Score und Umsatzrendite. Gibt es einen Zusammenhang und welche Unternehmen fallen auf?',
   '{"labels": ["Beteiligung 1", "Beteiligung 2", "Beteiligung 3", "Beteiligung 4", "Beteiligung 5", "Beteiligung 6", "Beteiligung 7", "Beteiligung 8", "Beteiligung 9", "Beteiligung 10", "Beteiligung 11", "Beteiligung 12"], "datasets": [{"label": "ESG-Score (0-100)", "data": [82, 45, 68, 75, 52, 88, 38, 61, 72, 55, 91, 48], "color": "#10b981"}, {"label": "EBITDA-Marge (%)", "data": [18, 22, 15, 20, 12, 25, 8, 14, 19, 16, 28, 10], "color": "#3b82f6"}]}',
   'ESG-Score vs. EBITDA-Marge im Portfolio',
   'Identifiziere Cluster und Ausreißer. Gibt es ein ESG-Performance-Paradoxon?',
   'Grobe Positiv-Korrelation: die vier ESG-Spitzenreiter (>80) haben alle EBITDA-Margen ≥18 %, die ESG-Schwächsten (<50) haben Margen 8–12 %. Zwei interessante Ausreißer: Beteiligung 2 (ESG 45, Marge 22 %) — hohe Profitabilität trotz schwacher ESG, Risiko falls Regulierung verschärft. Beteiligung 10 (ESG 55, Marge 16 %) unterdurchschnittlich in beidem — Kandidat für Exit oder Turnaround. Portfolio-These: ESG und Performance gehen zusammen, daher sollten die beiden Ausreißer-Fälle aktiv adressiert werden (Beteiligung 2 durch ESG-Programm, Beteiligung 10 durch Kritische-Prüfung).',
   true),

  ('hard', 'pie',
   'Du siehst die Umsatzverteilung eines Konsumgüterkonzerns nach Kategorien der zirkulären Wertschöpfung (Stand 2024). Formuliere die Transformations-Strategie in Richtung 2030.',
   '{"labels": ["Linear (Einwegverpackung)", "Recyclat-Anteil", "Nachfüllsysteme", "Pfand-/Rücknahme", "Konzentrate/Weniger Verpackung"], "datasets": [{"label": "Umsatzanteil (%)", "data": [62, 18, 8, 9, 3], "color": "#3b82f6"}]}',
   'Umsatz nach Zirkularitäts-Modellen',
   'Wo sind Quick-Wins, wo braucht es größere Produktlinien-Änderungen?',
   'Der lineare Anteil (62 %) ist der Hebel — aber nicht mit einem einzigen Modell ablösbar. Recyclat-Anteil (18 %) ist bereits eine große Basis und sollte auf 30–40 % ausgebaut werden (Investition in rPET-Kapazität, Spezifikationen). Nachfüll- und Pfand-Systeme (zusammen 17 %) sind strukturell aufwendig, aber strategisch wertvoll für B2C-Differenzierung — Fokus auf 2–3 Schlüsselmarken mit Pilotregionen. Konzentrate (3 %) sind wachstumsträchtig (30-40 % weniger Verpackung pro Verkaufseinheit), müssen aber Consumer-Education haben. Empfehlung 2030-Ziel: linearer Anteil unter 40 %, jede alternative Kategorie mindestens verdoppelt.',
   true);


-- ============================================================
-- CLUSTER C: Healthcare / Pharma (8 Cases)
-- ============================================================

INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('easy', 'bar',
   'Du siehst die Patientenzahlen der sechs Abteilungen eines Krankenhauses im letzten Jahr. Welche Abteilungen tragen das Volumen?',
   '{"labels": ["Innere", "Chirurgie", "Orthopädie", "Kardiologie", "Onkologie", "Neurologie"], "datasets": [{"label": "Patienten (Tsd)", "data": [14.2, 11.8, 9.5, 7.3, 5.1, 4.2], "color": "#3b82f6"}]}',
   'Patientenvolumen pro Abteilung',
   'Welche Abteilungen dominieren und welche sind eher klein?',
   NULL,
   true),

  ('easy', 'line',
   'Die Medikamenten-Adherence eines chronischen Patientenpools wurde über 12 Monate erhoben. Wie entwickelt sich die Compliance?',
   '{"labels": ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"], "datasets": [{"label": "Adherence (%)", "data": [92, 88, 85, 81, 78, 75, 72, 70, 68, 66, 65, 63], "color": "#ef4444"}]}',
   'Adherence-Rate chronische Medikation',
   'Ist der Trend linear oder beschleunigend? Wo müsste eine Intervention ansetzen?',
   NULL,
   true),

  ('medium', 'pie',
   'Du siehst die F&E-Pipeline eines Biotechs nach Phasen. Wie bewertest du die Balance und das Risiko?',
   '{"labels": ["Präklinik", "Phase I", "Phase II", "Phase III", "Zulassungsverfahren"], "datasets": [{"label": "Anzahl Kandidaten", "data": [18, 8, 5, 3, 2], "color": "#3b82f6"}]}',
   'F&E-Pipeline nach Entwicklungsphase',
   'Wie verteilt sich das Risiko? Wo liegen die Werttreiber?',
   'Die Pipeline hat eine solide Basis (18 präklinische Kandidaten) und eine normal-trichterförmige Verteilung nach Standard-Attritionsraten (rund 10 % von Phase I bis Zulassung ist branchentypisch). Gute Balance, aber: nur 2 Kandidaten im Zulassungsverfahren bedeutet, dass die nächsten 24 Monate keine großen Launches bringen — Revenue-Gap wahrscheinlich 2026-27. Phase II (5 Kandidaten) muss dringend Phase-III-Starts erzeugen, um das Launch-Fenster 2028+ zu füllen. Empfehlung: bei den 5 Phase-II-Kandidaten aggressiv priorisieren.',
   true),

  ('medium', 'line',
   'Du siehst die Erfolgsrate (Phase III → Zulassung) für fünf Indikationsbereiche über die letzten zehn Jahre. Wo sind die strategischen Chancen und Risiken?',
   '{"labels": ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"], "datasets": [{"label": "Onkologie", "data": [48, 52, 55, 58, 62, 65, 68, 70, 72, 74], "color": "#ef4444"}, {"label": "Neurologie", "data": [28, 30, 28, 32, 35, 33, 38, 40, 42, 45], "color": "#3b82f6"}, {"label": "Seltene Erkrankungen", "data": [72, 75, 78, 80, 82, 83, 85, 86, 87, 88], "color": "#10b981"}]}',
   'Phase-III-Erfolgsrate nach Indikation',
   'Welche Indikation wächst am stärksten, welche stagniert? Was bedeutet das für Pipeline-Investments?',
   'Seltene Erkrankungen sind historisch die höchste Erfolgsquote (72 → 88 %) mit kontinuierlichem Anstieg — getrieben von besserem Patientenstratifizieren, Biomarkern und Orphan-Drug-Anreizen. Onkologie holt stark auf (+26 Punkte) und nähert sich dem Seltenen-Niveau — das ist auf Precision Oncology zurückzuführen. Neurologie bleibt der Nachzügler (+17 Punkte, aber nur 45 %) — strukturell schwierige Indikation. Investment-These: Seltene Erkrankungen und Onkologie bleiben Priorität (hohe Erfolgsrate), Neurologie nur bei differenzierten Mechanismen, nicht bei Me-Too-Kandidaten.',
   true),

  ('medium', 'waterfall',
   'Der Erstattungsumsatz für ein Medikament hat sich nach der Markteinführung über drei Jahre entwickelt. Welche Effekte haben gewirkt und was bedeutet das für zukünftige Launches?',
   '{"labels": ["Umsatz Jahr 1", "Volumen-Ausweitung", "Preisverhandlung GKV", "Neue Indikation", "Biosimilar-Wettbewerb", "Umsatz Jahr 3"], "datasets": [{"label": "Veränderung (Mio €)", "data": [85, 45, -18, 28, -22, 118], "color": "#3b82f6"}]}',
   'Erstattungsumsatz-Brücke Jahr 1 → Jahr 3',
   'Welche Effekte sind einmalig, welche strukturell? Was lernst du für künftige Launches?',
   'Das Medikament wuchs netto von 85 auf 118 Mio € (+39 %). Wachstumstreiber: organische Volumenausweitung (+45) und neue Indikation (+28) — zusammen +73 Mio €. Gegenwind durch GKV-Preisverhandlung (-18, typischer AMNOG-Schnitt im 2. Jahr) und Biosimilar (-22, Patentablauf oder ähnliche Konkurrenz). Lessons learned: Indikations-Erweiterung ist der größte Hebel für Lifecycle-Management und sollte vor Launch bereits geplant sein. Preisverlust ist planbar — in BCR-Annahmen schon eingepreist, nicht überraschend. Biosimilar-Risiko unterstreicht, dass Patentstrategie und Follow-on-Produkte kritisch sind.',
   true),

  ('hard', 'stacked_bar',
   'Du siehst die Patientenpfade fürs Krankheitsbild Diabetes Typ 2 über drei Altersgruppen — aufgeschlüsselt nach Behandlungslinien. Welche Therapie-Segmente sind unterversorgt und wo liegen die strategischen Chancen für einen Pharma-Hersteller?',
   '{"labels": ["18–39 Jahre", "40–64 Jahre", "65+ Jahre"], "datasets": [{"label": "Lifestyle/Metformin", "data": [62, 38, 18], "color": "#10b981"}, {"label": "Orale Zweitlinie", "data": [24, 32, 28], "color": "#3b82f6"}, {"label": "GLP-1-Agonisten", "data": [8, 18, 22], "color": "#8b5cf6"}, {"label": "Insulin", "data": [6, 12, 32], "color": "#f59e0b"}]}',
   'Behandlungslinie nach Altersgruppe (%)',
   'Wo gibt es Alters-Shifts? Welche Segmente wachsen und welche sind saturiert?',
   'Zwei strukturelle Shifts sichtbar: (1) mit dem Alter schwindet Lifestyle/Metformin (62 → 18 %) zugunsten intensiverer Therapien — Insulin allein springt von 6 auf 32 %. (2) GLP-1-Agonisten wachsen mittleres Alter (8 → 18 → 22) — der große strategische Trend (auch aus Adipositas-Indikation bekannt). Chancen: GLP-1 in jungen Patientengruppen (18–39) ist unterrepräsentiert (8 %) — wenn Präventionsevidenz stärker wird, ist hier ein Markt mit wachsender Prävalenz. Orale Zweitlinie ist saturiert und leicht rückläufig in alten Patienten — Lifecycle-Ende typischer DPP4-Klasse. Insulin bei 65+ ist strukturell groß, aber generisch preisregliert — wenig Profit-Hebel.',
   true),

  ('hard', 'scatter',
   'Du siehst zwölf Therapien gegen die gleiche Krankheit nach klinischer Wirksamkeit (responderrate in %) und monatlichem Preis (€). Wie bewertest du Value-based Pricing in diesem Markt und welche Therapien sind unter-/überpreist?',
   '{"labels": ["Therapie 1", "Therapie 2", "Therapie 3", "Therapie 4", "Therapie 5", "Therapie 6", "Therapie 7", "Therapie 8", "Therapie 9", "Therapie 10", "Therapie 11", "Therapie 12"], "datasets": [{"label": "Wirksamkeit (%)", "data": [42, 58, 71, 35, 62, 78, 48, 82, 55, 68, 38, 74], "color": "#3b82f6"}, {"label": "Monatspreis (€)", "data": [1200, 2400, 3800, 850, 2100, 4500, 1600, 5200, 2000, 3200, 1100, 4100], "color": "#10b981"}]}',
   'Wirksamkeit vs. Monatspreis im Therapie-Vergleich',
   'Zeichne die gerade durch das Feld. Wo liegen Underpricing- und Overpricing-Signale?',
   'Grob linearer Zusammenhang: Preis steigt etwa proportional zur Wirksamkeit (Value-based Pricing ist am Markt etabliert). Outlier analyse: Therapie 8 (82 %, 5200 €) und Therapie 6 (78 %, 4500 €) sind Spitze in beidem — Premium-Segment bestätigt. Therapie 12 (74 %, 4100 €) ist ein Kandidat für Preiserhöhung, wenn Wirksamkeit tatsächlich der von Therapie 6 nahe kommt. Underpricing-Signale: Therapie 10 (68 %, 3200 €) — Pricing-Upside von 500-800 €. Overpriced relativ: Therapie 2 (58 %, 2400 €) ist teurer als Therapie 9 (55 %, 2000 €) ohne klaren Vorteil — kommt unter Erstattungsdruck. Strategie: regelmäßiges Pricing-Review gegen relativer Wirksamkeit einführen, Spitzenwirksamkeit aggressiv monetarisieren.',
   true),

  ('hard', 'line',
   'Nach Patentablauf eines Blockbusters in drei Ländern beobachtest du die Generika-Einführung. Welche Dynamik siehst du und welche Lehren ziehst du für den nächsten Patentablauf?',
   '{"labels": ["M0", "M3", "M6", "M9", "M12", "M15", "M18", "M21", "M24"], "datasets": [{"label": "Generika-Marktanteil DE (%)", "data": [0, 12, 28, 48, 65, 78, 84, 88, 90], "color": "#3b82f6"}, {"label": "Generika-Marktanteil FR (%)", "data": [0, 8, 18, 28, 42, 55, 65, 72, 78], "color": "#ef4444"}, {"label": "Generika-Marktanteil UK (%)", "data": [0, 18, 45, 68, 82, 88, 92, 94, 95], "color": "#10b981"}]}',
   'Generika-Uptake nach Patentablauf in drei Märkten',
   'Wo ist die Abwanderung am schnellsten? Was treibt die Unterschiede?',
   'UK hat den aggressivsten Uptake: 45 % Generika bereits nach 6 Monaten, 95 % nach 2 Jahren — getrieben durch NHS-Generics-Policy mit automatischer Substitution. Deutschland folgt klar: 65 % nach 12 Monaten, finaler Wert 90 % — getrieben durch Rabattverträge und Apotheker-Substitution. Frankreich ist der langsamste Markt: nur 78 % nach 24 Monaten — niedrigere Substitutions-Inzentive für Apotheker und stärkere Markenbindung. Lessons learned: (1) Revenue-Modell für Lifecycle-Management muss UK/DE-Erosion innerhalb 12 Monaten annehmen, FR als Buffer-Markt für 18-24 Monate einpreisen. (2) Authorised Generics als Verteidigung vor allem in UK prüfen. (3) Differenzierte Hebel pro Land: für DE Rabattverhandlung vorbereiten, für FR Patient-Kampagne & Arzt-Aufklärung ansetzen.',
   true);


-- ============================================================
-- CLUSTER D: HR / Retention (8 Cases)
-- ============================================================

INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('easy', 'bar',
   'Du siehst die jährliche Fluktuationsrate der sechs größten Abteilungen. Wo liegen die HR-Alarm­zeichen?',
   '{"labels": ["Vertrieb", "IT", "Marketing", "HR", "Finance", "Operations"], "datasets": [{"label": "Fluktuation (%)", "data": [18, 22, 12, 8, 6, 11], "color": "#ef4444"}]}',
   'Fluktuationsrate nach Abteilung',
   'Welche Abteilungen liegen weit über einer typischen Gesundheits-Schwelle von 10–12 %?',
   NULL,
   true),

  ('easy', 'pie',
   'Du siehst die Headcount-Verteilung nach Funktion. Ist die Organisation kopf- oder linienlastig?',
   '{"labels": ["Produktion/Operations", "Vertrieb", "F&E", "Administration", "Management"], "datasets": [{"label": "Mitarbeiter", "data": [48, 18, 15, 14, 5], "color": "#3b82f6"}]}',
   'Headcount-Verteilung nach Funktion',
   'Vergleiche das Verhältnis Wertschöpfung vs. Overhead.',
   NULL,
   true),

  ('medium', 'line',
   'Der Engagement-Score wird quartalsweise erhoben. Wie entwickelt er sich und wo greifen die HR-Maßnahmen?',
   '{"labels": ["Q1/22", "Q2/22", "Q3/22", "Q4/22", "Q1/23", "Q2/23", "Q3/23", "Q4/23", "Q1/24", "Q2/24", "Q3/24", "Q4/24"], "datasets": [{"label": "Engagement-Score (0-100)", "data": [68, 65, 62, 58, 55, 52, 54, 58, 62, 66, 70, 72], "color": "#10b981"}]}',
   'Engagement-Score Trend',
   'Wo ist der Wendepunkt und was könnte der Auslöser gewesen sein?',
   'Der Score fiel von 68 auf 52 bis Q2/23 — typisches Zeichen für post-Corona Wellenbrecher, Change-Fatigue oder Führungsthemen. Ab Q3/23 kehrt sich die Kurve, monoton steigend bis 72 in Q4/24. Trendwende im Q2/23 lässt auf eine gezielte HR-Intervention schließen (neue Führungskräfte-Entwicklung, Gehaltsanpassung, Neugestaltung der Führungskulturgespräche). Absolute Wert von 72 ist solide, aber nicht Spitze — Benchmark für High-Performer-Organisationen liegt bei 78-82. Fortsetzen, aber nicht nachlassen.',
   true),

  ('medium', 'stacked_bar',
   'Du siehst den Anteil von Frauen, Männern und nicht-binären Personen auf vier Führungsebenen. Wo sind die strukturellen Breakpoints der Pipeline?',
   '{"labels": ["Sachbearbeiter", "Teamleiter", "Abteilungsleiter", "Geschäftsführung"], "datasets": [{"label": "Frauen", "data": [48, 42, 28, 15], "color": "#ec4899"}, {"label": "Männer", "data": [50, 57, 71, 84], "color": "#3b82f6"}, {"label": "Non-binary / Keine Angabe", "data": [2, 1, 1, 1], "color": "#8b5cf6"}]}',
   'Gender-Verteilung nach Führungsebene (%)',
   'Wo halbiert sich der Frauenanteil? Das ist der strukturelle Engpass.',
   'Der Frauenanteil ist auf Sachbearbeiterebene annähernd ausgewogen (48 %), fällt nur moderat auf Teamleiter (42 %), bricht aber auf Abteilungsleiter deutlich (28 %) und halbiert sich nochmal zur Geschäftsführung (15 %). Der strukturelle Breakpoint liegt bei Teamleiter → Abteilungsleiter. Typische Treiber: Vereinbarkeit Karriere-Familie, weniger Sponsoring, seltener interne Mobilität. Konkrete Intervention: Nachfolgeplanung mit mindestens 40 % Frauenquote unter den Potenzialen pro Abteilung, flexible Modelle auf Abteilungsleiterebene, gezieltes Sponsoring-Programm. Geschäftsführung wird sich automatisch bessern, wenn Abteilungsleiter-Pool stärker wird.',
   true),

  ('medium', 'waterfall',
   'Die Belegschaft hat sich im Jahresverlauf verändert. Aus welchen Bewegungen setzt sich die Netto-Entwicklung zusammen?',
   '{"labels": ["Headcount Jan", "Fluktuation", "Ruhestand", "Neueinstellungen", "Interne Versetzung (Abgang)", "Headcount Dez"], "datasets": [{"label": "Mitarbeiter", "data": [3200, -420, -85, 580, -125, 3150], "color": "#3b82f6"}]}',
   'Personalbewegungen über das Jahr',
   'Was sagt die Netto-Entwicklung vs. Bruttobewegungen?',
   'Brutto sind über 1.200 Mitarbeiter-Bewegungen (605 Abgänge, 580 Zugänge, 125 intern) — rund 38 % Churn-Exposure relativ zur Belegschaft. Netto nur -50 Köpfe (-1,5 %), also fast stabil. Das bedeutet: die Organisation ist in einer ständigen Umbau-Bewegung, der kommunizierte „stabile Headcount" versteckt die Realität einer hohen Fluktuation. Einsparungspotenzial: wenn Fluktuation um nur 20 % gesenkt würde (von 420 auf 335), würden 85 Rekrutierungen und Onboardings entfallen — bei typischen Recruiting-Kosten von 15-20 Tsd € pro Stelle rund 1,3-1,7 Mio € pro Jahr.',
   true),

  ('hard', 'scatter',
   'Du siehst Gehalt und Betriebszugehörigkeit für alle Sachbearbeiter in einer Abteilung. Was lernst du über Gehaltsgerechtigkeit und Retention-Risiken?',
   '{"labels": ["MA 1", "MA 2", "MA 3", "MA 4", "MA 5", "MA 6", "MA 7", "MA 8", "MA 9", "MA 10", "MA 11", "MA 12", "MA 13", "MA 14", "MA 15"], "datasets": [{"label": "Betriebszugehörigkeit (Jahre)", "data": [2, 5, 8, 1, 12, 3, 7, 15, 4, 9, 2, 6, 11, 3, 8], "color": "#3b82f6"}, {"label": "Gehalt (T€)", "data": [52, 58, 68, 48, 72, 55, 62, 80, 56, 68, 54, 60, 74, 57, 65], "color": "#10b981"}]}',
   'Gehalt vs. Betriebszugehörigkeit',
   'Wo liegen Ausreißer nach oben und nach unten? Welche Retention-Risiken stehen offen?',
   'Erwartete Positiv-Korrelation (je länger, desto höher) ist präsent aber lose: Spanne 48-80 T€ für 1-15 Jahre. Auffällige Fälle: MA 11 (2 Jahre, 54 T€) und MA 14 (3 Jahre, 57 T€) liegen deutlich über MA 1 (2 Jahre, 52 T€) und MA 4 (1 Jahr, 48 T€) — mögliche Einstellungspremien oder höher qualifizierte Neueinstellungen. Unterpay-Risiko: MA 13 (11 Jahre, 74 T€) und MA 10 (9 Jahre, 68 T€) — überdurchschnittliche Zugehörigkeit bei moderatem Gehalt. Wenn sie vom Markt 5-10 % über ihr aktuelles Gehalt bekommen, sind sie Top-Retention-Risiko. Empfehlung: proaktive Gehaltsüberprüfung für langjährige Erfahrene, formalisierte Gehaltsbänder einführen um Willkür-Wirkung bei Neueinstellungen zu reduzieren.',
   true),

  ('hard', 'bar',
   'Du siehst die Nachfolge-Abdeckung (Ready-Now und Ready-in-2-Years) für acht kritische Positionen im Management. Wo liegt das Risiko und wie priorisierst du Entwicklungsprogramme?',
   '{"labels": ["CEO", "CFO", "CTO", "CMO", "COO", "GF Region A", "GF Region B", "GF Region C"], "datasets": [{"label": "Ready-Now (Kandidaten)", "data": [2, 3, 1, 0, 2, 1, 2, 0], "color": "#10b981"}, {"label": "Ready-in-2-Years (Kandidaten)", "data": [3, 2, 3, 2, 4, 3, 3, 1], "color": "#f59e0b"}]}',
   'Nachfolge-Pipeline kritische Führungspositionen',
   'Welche Positionen haben keine oder nur eine Option? Was bedeutet das für Notfallrisiko?',
   'Kritisch ohne Ready-Now-Kandidat: CMO und GF Region C. CMO hat noch 2 Mittelfrist-Kandidaten, also managebar mit Entwicklung. GF Region C hat nur 1 Mittelfrist-Kandidaten — doppeltes Risiko (keine Sofort-Option + dünne Pipeline), muss Top-Priorität für externes Scouting oder gezieltes Development werden. Gesunde Situation bei CFO (3 sofort, 2 mittelfristig) und COO (2 + 4). CTO mit nur einem Ready-Now ist solide aber schmal — beim nächsten Wechsel könnte Lücke entstehen. Empfehlung: Development-Programm konzentriert auf CMO, GF Region C und weiterer CTO-Kandidat. Externes Benchmarking parallel zur internen Pipeline, keine Entweder/Oder-Strategie.',
   true),

  ('hard', 'line',
   'Die Time-to-Fill (Zeit zwischen Stellenausschreibung und Besetzung) wird pro Seniority-Level getrackt. Welche Dynamik wird sichtbar und was bedeutet das für die Talent-Strategie?',
   '{"labels": ["2020", "2021", "2022", "2023", "2024"], "datasets": [{"label": "Junior (Tage)", "data": [32, 34, 38, 42, 40], "color": "#3b82f6"}, {"label": "Mid-Level (Tage)", "data": [48, 52, 62, 78, 85], "color": "#f59e0b"}, {"label": "Senior (Tage)", "data": [72, 82, 95, 125, 148], "color": "#ef4444"}, {"label": "Executive (Tage)", "data": [120, 135, 155, 175, 195], "color": "#8b5cf6"}]}',
   'Time-to-Fill nach Seniority',
   'Welcher Level verschlechtert sich am stärksten und was bedeutet das für Business-Continuity?',
   'Der absolute Zuwachs ist auf Senior-Ebene am dramatischsten: +76 Tage (72 → 148) — mehr als Verdopplung. Executive folgt (+75 Tage) aber relativ gesehen weniger krass (+63 %). Junior ist nahezu stabil (+8 Tage). Strukturelle Lesart: der Talent-Markt für Senior-Rollen ist massiv verknappt, die organisationsinterne Entwicklung hat nicht Schritt gehalten. Bei 5 Monaten Vakanz für Senior und 6,5 Monaten für Executive ist die Business-Continuity bei Abgang einzelner Schlüsselpersonen gefährdet. Konsequenzen: (1) Succession-Planning für alle Senior-Rollen verpflichtend einführen; (2) interne Talent-Pipeline auf Senior-Level priorisieren (Führungskräfteentwicklung 2-3 Jahre im Voraus); (3) Externe Headhunting-Verträge mit Retainer für schnellen Zugriff; (4) Vergütung im Senior-Band marktprüfen — zunehmende Time-to-Fill ist oft auch Preis-Signal.',
   true);


-- ============================================================
-- CLUSTER E: Consulting Classics (18 Cases)
-- ============================================================

-- EASY (7)
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('easy', 'bar',
   'Du siehst den Umsatz nach Region für das letzte Geschäftsjahr. Welche Region ist am stärksten und welche hinkt hinterher?',
   '{"labels": ["DACH", "Südeuropa", "Nordeuropa", "Nordamerika", "Asien-Pazifik", "Rest der Welt"], "datasets": [{"label": "Umsatz (Mio €)", "data": [320, 180, 145, 250, 210, 80], "color": "#3b82f6"}]}',
   'Regionaler Umsatz 2024',
   'Wo sind die großen Umsatzsäulen und wo die dünnen?',
   NULL,
   true),

  ('easy', 'pie',
   'Du siehst den Umsatz nach Produktkategorie. Wie ist das Portfolio gewichtet?',
   '{"labels": ["Premium-Linie", "Standard-Linie", "Einstiegsprodukte", "Services", "Ersatzteile"], "datasets": [{"label": "Anteil", "data": [28, 42, 15, 10, 5], "color": "#3b82f6"}]}',
   'Umsatz nach Produktkategorie',
   'Welcher Teil trägt am meisten und welcher ist ein potenzieller Wachstumskandidat?',
   NULL,
   true),

  ('easy', 'line',
   'Der Aktienkurs des Unternehmens seit 2020. Wie bewertest du die Kursentwicklung?',
   '{"labels": ["2020", "2021", "2022", "2023", "2024"], "datasets": [{"label": "Aktienkurs (€)", "data": [42, 58, 72, 65, 78], "color": "#10b981"}]}',
   'Aktienkurs 2020–2024',
   'Welche Jahre waren stark, welche schwach? Gesamt-Trend?',
   NULL,
   true),

  ('easy', 'bar',
   'Du siehst die Marktanteile der Top-5-Spieler in einem Markt. Wer dominiert?',
   '{"labels": ["Unternehmen A", "Unternehmen B", "Unternehmen C", "Unternehmen D", "Unternehmen E", "Rest"], "datasets": [{"label": "Marktanteil (%)", "data": [28, 22, 15, 10, 7, 18], "color": "#3b82f6"}]}',
   'Marktanteile im Industriemarkt',
   'Wie konzentriert ist der Markt? CR3 (Summe Top 3)?',
   NULL,
   true),

  ('easy', 'stacked_bar',
   'Du siehst den Umsatz nach Vertriebskanal über drei Jahre. Welcher Kanal wächst?',
   '{"labels": ["2022", "2023", "2024"], "datasets": [{"label": "Filiale", "data": [280, 265, 250], "color": "#3b82f6"}, {"label": "Online-Direct", "data": [85, 125, 175], "color": "#10b981"}, {"label": "Marketplace", "data": [45, 72, 105], "color": "#f59e0b"}]}',
   'Umsatz nach Vertriebskanal (Mio €)',
   'Welcher Kanal wächst, welcher schrumpft?',
   NULL,
   true),

  ('easy', 'line',
   'Die Kundenzufriedenheit (NPS) wurde quartalsweise gemessen. Wie entwickelt sie sich?',
   '{"labels": ["Q1/22", "Q3/22", "Q1/23", "Q3/23", "Q1/24", "Q3/24"], "datasets": [{"label": "NPS", "data": [32, 28, 35, 42, 48, 52], "color": "#10b981"}]}',
   'NPS-Entwicklung über 3 Jahre',
   'Ab welchem Zeitpunkt verbessert sich die Kurve?',
   NULL,
   true),

  ('easy', 'pie',
   'Du siehst die Kostenstruktur eines Dienstleistungsunternehmens. Welche Kostenkategorie dominiert?',
   '{"labels": ["Personal", "IT & Software", "Miete", "Marketing", "Sonstiges"], "datasets": [{"label": "Anteil", "data": [58, 14, 12, 9, 7], "color": "#3b82f6"}]}',
   'Kostenstruktur nach Kategorie',
   'Wie dominant ist der Personalkostenblock?',
   NULL,
   true);


-- MEDIUM (5)
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('medium', 'waterfall',
   'Du siehst die Margenbrücke zwischen zwei Jahren. Welche Hebel haben gewirkt, welche gegen?',
   '{"labels": ["EBIT-Marge 2023", "Preiseffekt", "Kosten-Effizienz", "Mix-Effekt", "Rohstoffkosten", "Lohnkosten", "EBIT-Marge 2024"], "datasets": [{"label": "Veränderung (%p)", "data": [12.0, 1.5, 2.0, -0.8, -2.5, -1.0, 11.2], "color": "#3b82f6"}]}',
   'EBIT-Marge 2023 → 2024',
   'Sind die positiven Effekte einmalig oder wiederholbar? Wie reagiert man auf die Gegenwinde?',
   'Von 12,0 auf 11,2 Punkte — netto -0,8 Prozentpunkte. Gegenwinde (Rohstoffe -2,5, Lohn -1,0, Mix -0,8) summieren sich auf -4,3 Punkte und wurden nur zu 81 % durch Preise (+1,5) und Effizienz (+2,0) kompensiert. Sorge: Pricing-Hebel ist in Jahr 3 eines Erhöhungszyklus eventuell ausgeschöpft, während Rohstoff-Druck strukturell ist. Empfehlung: nächstes Jahr stärker auf Kosten-Effizienz und Produkt-Mix setzen (margenstarke Produkte fördern), Pricing nur noch dort wo Nachfrage es trägt. Sonst wird -0,8 Punkte zum wiederholten Muster.',
   true),

  ('medium', 'bar',
   'Du siehst den durchschnittlichen Umsatz pro Kunde (ARPU) für vier Kundensegmente. Wie priorisierst du die Segmente für ein Key-Account-Programm?',
   '{"labels": ["Mikro (<10 MA)", "Klein (10-50 MA)", "Mittel (50-250 MA)", "Groß (>250 MA)"], "datasets": [{"label": "Kundenanzahl", "data": [1200, 450, 180, 45], "color": "#3b82f6"}, {"label": "ARPU (T€)", "data": [2.5, 8.5, 32, 120], "color": "#10b981"}]}',
   'ARPU und Kundenanzahl nach Segment',
   'Multipliziere mental: wo ist der Umsatzbeitrag am größten?',
   'Gesamtumsatz pro Segment: Mikro 3,0 Mio €, Klein 3,8 Mio €, Mittel 5,8 Mio €, Groß 5,4 Mio € — erstaunlich gleichmäßig verteilt. Das Groß-Segment generiert mit nur 45 Kunden fast so viel Umsatz wie 1.200 Mikro-Kunden, bei wahrscheinlich viel besserer Unit-Economics (geringere Sales-Kosten, höhere Retention). Klarer Pitch: Key-Account-Programm mit Fokus auf Groß- und Mittel-Segment (gemeinsam 225 Kunden, 11,2 Mio € oder 62 % des Umsatzes). Mikro sollte digital self-service bleiben — kein Key-Account-Invest. Klein ist das Wachstums-Testfeld: ob sich mit halbem Account-Management-Einsatz ARPU auf 15-20 T€ steigern lässt.',
   true),

  ('medium', 'line',
   'Du siehst die EV/EBITDA-Multiples für ein Zielunternehmen und den Sektor-Median in den letzten fünf Jahren. Ist ein Kaufzeitpunkt günstig?',
   '{"labels": ["2020", "2021", "2022", "2023", "2024"], "datasets": [{"label": "Zielunternehmen", "data": [8.2, 11.5, 13.8, 10.4, 9.5], "color": "#3b82f6"}, {"label": "Sektor-Median", "data": [9.5, 12.8, 14.2, 11.8, 10.8], "color": "#f59e0b"}]}',
   'EV/EBITDA-Multiple im Vergleich',
   'Wie sieht das Premium/Discount aus und wo im Zyklus sind wir?',
   'Das Zielunternehmen wird historisch 1-1,5 Turns unter dem Sektor-Median gehandelt — möglicherweise aufgrund Unternehmensgröße, Wachstums-Profil oder Profitabilitäts-Delta. Aktuell ist das Multiple bei 9,5 vs. 10,8 im Median, also -1,3. Absolut gesehen ist 2024 ein günstiges Multiple vs. 2022er Peak (13,8). Für Käufer attraktiv, wenn (a) die fundamentale Qualität des Ziels stimmt und (b) man das Dishard des letzten Jahres verkraftet. Warnung: Multiple-Expansion von 9,5 zurück auf 13 ist nicht gratis — sie passiert nur wenn EBITDA wächst und/oder der Sektor insgesamt neu bewertet wird. Die M&A-Story muss auf den operativen Wertschöpfungshebeln und nicht auf Multiple-Arbitrage stehen.',
   true),

  ('medium', 'stacked_bar',
   'Du siehst die Umsatzverteilung über vier Vertriebskanäle und drei Kundensegmente. Welche Kombinationen sind unterbesetzt und was bedeutet das für das Go-to-Market?',
   '{"labels": ["Filiale", "Direct Sales", "Online", "Partner"], "datasets": [{"label": "B2C", "data": [140, 15, 85, 30], "color": "#3b82f6"}, {"label": "B2B SMB", "data": [25, 60, 45, 55], "color": "#10b981"}, {"label": "B2B Enterprise", "data": [5, 140, 18, 22], "color": "#8b5cf6"}]}',
   'Umsatz nach Kanal × Segment (Mio €)',
   'Wo sind leere Felder und wo Überschneidungen? Wo fehlt Abdeckung?',
   'Klare Matrix-Muster: B2C dominiert in Filiale (140) und Online (85) — zusammen 83 % des B2C-Umsatzes; Partner und Direct schwach. B2B SMB ist gut diversifiziert über alle vier Kanäle (185 Mio € Gesamt). B2B Enterprise hängt massiv von Direct Sales ab (140 Mio €, 77 %) mit Online nur 18 — leeres Feld für digitales Self-Service oberhalb 100k €. Empfehlungen: (1) Online-Kanal für B2B Enterprise aufbauen (Self-Service-Portal mit Konfigurator, API-Integration) — potenziell 30-50 Mio € Umsatz-Upside; (2) Direct Sales für B2C abziehen und in Enterprise verlagern; (3) Partner-Kanal für B2B SMB als Hauptwachstumshebel nutzen.',
   true),

  ('medium', 'scatter',
   'Du siehst CAC und LTV pro Marketing-Kanal. Welche Kanäle skaliert man auf, welche dreht man ab?',
   '{"labels": ["Google Search", "Facebook Ads", "LinkedIn Ads", "Content Marketing", "SEO", "Events", "Partner-Programm", "Influencer", "Retargeting", "Display-Netzwerk"], "datasets": [{"label": "CAC (€)", "data": [120, 85, 380, 45, 25, 520, 180, 280, 65, 95], "color": "#ef4444"}, {"label": "LTV (€)", "data": [520, 320, 1800, 280, 240, 2100, 850, 480, 240, 180], "color": "#10b981"}]}',
   'CAC vs. LTV pro Marketing-Kanal',
   'Ratio > 3 = gesund. Welche Kanäle haben das beste Verhältnis?',
   'LTV/CAC-Ratios: Events 4,0, LinkedIn 4,7, Partner 4,7, SEO 9,6, Content 6,2, Google 4,3, Facebook 3,8, Retargeting 3,7, Influencer 1,7, Display 1,9. Top-Quartil für Aufstockung: SEO (extrem günstig, Skalierungs-Potenzial), Content, LinkedIn und Partner (letztere zwei hoch im LTV, rechtfertigen hohe CACs). Problemkanäle: Influencer und Display mit Ratio < 2 — entweder deutlich optimieren (Creatives, Targeting) oder abdrehen. Events ist in sich gut, aber absoluter CAC von 520 € begrenzt Skalierbarkeit — nur wenn Segment hoher Relevanz. Retargeting und Facebook solide aber nicht Top — Status Quo halten.',
   true);


-- HARD (6)
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('hard', 'stacked_bar',
   'Nach einer großen M&A-Akquisition siehst du die drei Synergie-Kategorien pro Jahr über fünf Jahre. Wie bewertest du die Werthebung des Deals?',
   '{"labels": ["Jahr 1", "Jahr 2", "Jahr 3", "Jahr 4", "Jahr 5"], "datasets": [{"label": "Einkaufssynergien", "data": [8, 18, 25, 28, 30], "color": "#3b82f6"}, {"label": "IT-/Overhead-Einsparungen", "data": [5, 15, 22, 25, 26], "color": "#10b981"}, {"label": "Revenue-Synergien", "data": [2, 8, 18, 32, 45], "color": "#f59e0b"}]}',
   'Synergie-Realisierung nach M&A (Mio €)',
   'Welche Synergie kommt schnell, welche langsam? Welche ist am größten?',
   'Kostensynergien (Einkauf + IT/Overhead) werden schnell realisiert: Jahr 1 bereits 13 Mio €, Plateau bei Jahr 3-4 bei rund 50 Mio €. Revenue-Synergien laufen deutlich langsamer an (Jahr 1 nur 2 Mio €) und wachsen linear auf 45 Mio € in Jahr 5 — aber sie sind der finale Growth-Engine. Jahr 5 Summe: 101 Mio € Jahreslauf, typisch für einen erfolgreich umgesetzten 100 Mio € Synergie-Case. Lesson learned für nächsten Deal: Kostenseitiges Committment ist nachhaltig (Overhead bleibt geschnitten), aber Revenue-Synergien sind die eigentlichen Werttreiber — und sie erfordern disziplinierte Integration der GTM-Organisationen. Wenn Revenue-Kurve in Jahr 3 nicht steil ist, muss Alarm geschlagen werden.',
   true),

  ('hard', 'pie',
   'Du siehst die EBIT-Beiträge der sieben Geschäftsbereiche eines Konzerns. Welche Portfolio-Fragen stellst du?',
   '{"labels": ["GB1 Auto-Electronics", "GB2 Industrial", "GB3 Consumer Health", "GB4 Chemicals", "GB5 Energy", "GB6 Digital Services", "GB7 Agriculture"], "datasets": [{"label": "EBIT (Mio €)", "data": [145, 92, 58, 32, -18, -42, 15], "color": "#3b82f6"}]}',
   'EBIT-Beitrag pro Geschäftsbereich',
   'Welche GB sind Cash Cows, welche Problems? Was sind die Synergien vs. Desinvest-Kandidaten?',
   'Konzern-EBIT 282 Mio € — getragen zu 84 % von GB1, GB2, GB3. GB1 (Auto-Electronics) ist Cash-Cow, aber Strukturrisiko (Verbrennerabhängigkeit?). GB2 und GB3 stabile Mittelzentren. GB4 (Chemicals) klein und margenschwach — Synergie-Kandidat oder Verkauf? GB5 und GB6 verursachen -60 Mio €, zusammen 21 % des Gesamt-EBIT-Pools als Belastung. Key-Questions: (1) Sind GB5 und GB6 im Turnaround oder in struktureller Krise? (2) Hat GB1 eine E-Mobility-Transformations-Story? (3) Sind die Corporate-Functions auf Konzerngröße gerechtfertigt, wenn man den Konzern gedanklich reduziert auf GB1+GB2+GB3 (295 Mio € EBIT)? Empfehlung: strategisches Review mit Szenarien „Core" (Verkauf GB4-GB7) vs. „Full Portfolio Turnaround".',
   true),

  ('hard', 'scatter',
   'Du analysierst 15 internationale Märkte nach Marktgröße und Wachstumsrate. Welche Märkte sind Priorität für eine Expansion?',
   '{"labels": ["Deutschland", "Frankreich", "Italien", "Spanien", "UK", "Niederlande", "Polen", "USA", "Kanada", "Brasilien", "Mexiko", "China", "Indien", "Japan", "Südkorea"], "datasets": [{"label": "Marktgröße (Mrd €)", "data": [8.5, 6.2, 4.8, 3.5, 7.2, 2.4, 1.8, 28, 3.2, 2.8, 2.2, 18, 8, 6.5, 3.8], "color": "#3b82f6"}, {"label": "Wachstum p.a. (%)", "data": [2.5, 2.0, 1.5, 2.2, 2.8, 3.2, 6.5, 4.2, 3.5, 7.8, 5.5, 8.5, 12.5, 1.2, 2.8], "color": "#10b981"}]}',
   'Markt-Portfolio: Größe vs. Wachstum',
   'Teile das Feld in vier Quadranten. Wo liegen die besten Expansions-Ziele?',
   'Quadranten-Analyse (Grenzen etwa: 5 Mrd € Größe, 4 % Wachstum): Star-Quadrant (groß & schnell) USA, China — Pflichtmärkte, aber höchste Eintrittsbarrieren. Hidden-Gem-Quadrant (klein & schnell) Polen, Brasilien, Mexiko, Indien — Top-Priorität für eine differenzierte Expansion. Indien sticht heraus mit 12,5 % Wachstum und 8 Mrd € Größe — also eher auch Star. Saturated-Quadrant (groß & langsam) Deutschland, UK, Frankreich, Italien, Japan — Konsolidierung, nicht Expansion. Empfehlung: Fokus auf Indien als lead, Polen/Mexiko als Test-Märkte mit geringem Invest, USA opportunistisch via Akquisition. Saturierte Märkte durch Konsolidierung aktiv bearbeiten aber nicht als Wachstumsträger.',
   true),

  ('hard', 'line',
   'Du siehst drei KPIs nach einem zweijährigen Transformations-Programm. Was lernst du daraus und welchen Rat gibst du dem Vorstand?',
   '{"labels": ["Q1/23", "Q2/23", "Q3/23", "Q4/23", "Q1/24", "Q2/24", "Q3/24", "Q4/24"], "datasets": [{"label": "Umsatzwachstum YoY (%)", "data": [2.5, 1.8, 3.2, 4.5, 5.8, 6.2, 7.5, 8.2], "color": "#3b82f6"}, {"label": "EBIT-Marge (%)", "data": [8.5, 9.2, 10.1, 11.5, 12.2, 12.8, 13.5, 13.8], "color": "#10b981"}, {"label": "Mitarbeiterzufriedenheit (0-100)", "data": [58, 54, 52, 50, 55, 62, 68, 72], "color": "#f59e0b"}]}',
   'Transformations-Dashboard 2023–2024',
   'Welche Kennzahl entwickelt sich wie und wie hängen sie zusammen?',
   'Finanzielle Kennzahlen sind von Anfang an aufwärts: Umsatzwachstum verdreifacht, Marge +5,3 Punkte — ein starkes Transformations-Ergebnis. Aber: Mitarbeiterzufriedenheit fiel zunächst (58 → 50 in Q4/23) — Change-Fatigue und Belastung. Ab Q1/24 kehrt sich das Momentum: MA-Zufriedenheit +22 Punkte bis Q4/24. Das erklärt möglicherweise auch den Sprung in Performance in H2/24 — engagierte Teams liefern. Rat an den Vorstand: (1) Celebration of success etablieren — die MA-Zufriedenheits-Trend ist fragil, ohne Feedback-Loop dreht sie sich schnell. (2) Transformation nicht zu früh als abgeschlossen erklären — die Dynamik beschleunigt gerade. (3) Nächstes Programm-Design muss explizit People-First starten, nicht als Nachgedanke wie im Anfangsjahr.',
   true),

  ('hard', 'waterfall',
   'Du siehst die Bewertungsbrücke eines Carve-Out-Targets von der Stand-Alone-Bewertung bis zum finalen Deal-Preis. Wie beurteilst du den Deal?',
   '{"labels": ["Stand-Alone-Bewertung", "Dis-Synergien", "Stranded Costs", "TSA-Kosten", "Synergiehebung (Käufer)", "Kontroll-Prämie", "Deal-Preis"], "datasets": [{"label": "Wert (Mio €)", "data": [480, -35, -28, -15, 85, 38, 525], "color": "#3b82f6"}]}',
   'Carve-Out-Bewertungs-Bridge',
   'Welche Werte sind symmetrisch, welche asymmetrisch zwischen Käufer und Verkäufer?',
   'Stand-Alone 480, Netto-Carve-Out-Impact auf Verkäufer -78 (Dis-Synergien, Stranded Costs, TSA) — das reduziert die verkäuferseitige Bewertung auf 402. Auf Käuferseite addieren sich eigene Synergien (+85) und Kontroll-Prämie (+38) — sie sehen Wert von 525, was die Zahlungsbereitschaft definiert. Spread zwischen 402 (Verkäufer-Minimum) und 525 (Käufer-Maximum) = 123 Mio € Verhandlungsspanne. Deal bei 525 wäre ein Sieg des Verkäufers (volle Käufer-Zahlungsbereitschaft geholt). Warnung: wenn Käufer die 85 Mio € Synergien nicht hebt, hat er 83 Mio € zu teuer bezahlt — Post-Deal-Execution ist kritisch. Empfehlung an Käufer-Board: Kaufpreis-Obergrenze auf 500 Mio € setzen (Puffer 25 Mio € für Synergie-Risiko), strukturierte Earnouts einführen wenn möglich.',
   true),

  ('hard', 'bar',
   'Du siehst fünf Wettbewerber nach drei strategischen KPIs. Wo steht dein Unternehmen im Peer-Set und was ist deine Empfehlung für den 3-Jahres-Plan?',
   '{"labels": ["DU", "Wettbewerber A", "Wettbewerber B", "Wettbewerber C", "Wettbewerber D"], "datasets": [{"label": "Umsatzwachstum (%)", "data": [4.2, 6.8, 3.2, 8.5, 2.1], "color": "#3b82f6"}, {"label": "EBIT-Marge (%)", "data": [12.5, 11.2, 15.8, 9.2, 14.5], "color": "#10b981"}, {"label": "Kapitalumschlag", "data": [1.8, 2.2, 1.4, 2.8, 1.2], "color": "#f59e0b"}]}',
   'Peer-Benchmark: Wachstum, Marge, Kapitaleffizienz',
   'DuPont-Logik: Wachstum × Marge × Umschlag = ROCE-Treiber. Wo bist du schwach?',
   'DU ist Mittelfeld in allen drei Dimensionen: niemand exzellent. Wettbewerber C ist ein Growth-Champion (Wachstum 8,5 %, Umschlag 2,8) mit schwacher Marge (9,2) — Scale-über-Margen-Strategie. Wettbewerber B ist Margen-Champion (15,8) mit schwachem Wachstum (3,2) — Premium-Nischen-Spieler. Wettbewerber A balanciert alles hoch (6,8/11,2/2,2). Wettbewerber D ist der Underperformer. DU hat zwei strategische Optionen: (a) Wachstum beschleunigen wie C (benötigt Investitionsoffensive, kurzfristige Margen-Einbuße einkalkulieren) oder (b) Premium-Positionierung wie B (Produkt-Portfolio schärfen, niedrigmargige Volumen abziehen). Mittelweg ist weiterhin Mittelfeld — muss vermieden werden. 3-Jahres-Plan-Empfehlung: Entscheidung durch den Vorstand bis Q2 treffen, Strategie differenziert pro Geschäftsbereich denken.',
   true);
