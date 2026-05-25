-- ============================================================
-- Expand chart_cases: add 16 new cases (5 easy, 6 medium, 5 hard)
-- Brings total from 9 to 25
-- All content in German
-- ============================================================

-- EASY (5 new cases: 10-14)

-- Easy #10: Line chart – Website-Traffic
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'easy',
  'line',
  'Betrachte den monatlichen Website-Traffic über das erste Halbjahr 2025. In welchem Monat war der Traffic am höchsten und welchen Gesamttrend erkennst du?',
  '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"], "datasets": [{"label": "Seitenaufrufe (Tsd.)", "data": [85, 92, 78, 105, 118, 131], "color": "#3b82f6"}]}',
  'Website-Traffic H1 2025',
  'Achte auf den Gesamttrend (steigend/fallend) und identifiziere den Monat mit dem niedrigsten sowie höchsten Wert.',
  'Der Traffic zeigt einen insgesamt steigenden Trend von 85.000 auf 131.000 Seitenaufrufe, mit einem Rückgang im März. Der höchste Wert liegt im Juni (131.000), der niedrigste im März (78.000).',
  true
);

-- Easy #11: Bar chart – Produktverkäufe
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'easy',
  'bar',
  'Vergleiche die Verkaufszahlen der fünf Produktkategorien. Welches Produkt verkauft sich am besten und welches am schlechtesten?',
  '{"labels": ["Elektronik", "Bekleidung", "Lebensmittel", "Möbel", "Spielzeug"], "datasets": [{"label": "Verkäufe (Tsd. Stück)", "data": [42, 67, 89, 23, 51], "color": "#10b981"}]}',
  'Verkaufszahlen nach Produktkategorie Q1 2025',
  'Identifiziere Maximum und Minimum. Berechne den Unterschied zwischen bestem und schlechtestem Produkt.',
  'Lebensmittel verkaufen sich mit 89.000 Stück am besten, Möbel mit 23.000 Stück am schlechtesten. Der Unterschied beträgt rund 66.000 Stück bzw. fast das Vierfache.',
  true
);

-- Easy #12: Pie chart – Marktanteile Mobilfunk
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'easy',
  'pie',
  'Analysiere die Marktanteile der Mobilfunkanbieter in Deutschland. Welcher Anbieter dominiert den Markt und wie groß ist der Abstand zum zweitgrößten?',
  '{"labels": ["Telekom", "Vodafone", "Telefónica/O2", "1&1", "Sonstige"], "datasets": [{"label": "Marktanteil (%)", "data": [33, 26, 23, 12, 6], "color": "#8b5cf6"}]}',
  'Marktanteile Mobilfunk Deutschland 2025',
  'Vergleiche die Anteile der drei großen Netzbetreiber untereinander und mit den kleineren Anbietern.',
  'Die Telekom dominiert mit 33 % Marktanteil, 7 Prozentpunkte vor Vodafone (26 %). Die drei großen Netzbetreiber halten zusammen 82 % des Marktes, was den stark konsolidierten Charakter des Marktes zeigt.',
  true
);

-- Easy #13: Bar chart – Energieverbrauch nach Gebäude
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'easy',
  'bar',
  'Vergleiche den jährlichen Energieverbrauch der Unternehmensstandorte. Welcher Standort verbraucht am meisten Energie und wo siehst du Einsparpotenzial?',
  '{"labels": ["Zentrale München", "Werk Hannover", "Büro Berlin", "Lager Hamburg", "Büro Frankfurt"], "datasets": [{"label": "Energieverbrauch (MWh)", "data": [2400, 4100, 890, 1750, 920], "color": "#f97316"}]}',
  'Energieverbrauch nach Standort 2024',
  'Berücksichtige die unterschiedlichen Standorttypen (Werk vs. Büro vs. Lager) bei der Bewertung des Verbrauchs.',
  'Das Werk Hannover verbraucht mit 4.100 MWh am meisten, was für einen Produktionsstandort jedoch erwartbar ist. Einsparpotenzial besteht eher bei der Zentrale München (2.400 MWh), die als Bürogebäude einen überproportional hohen Verbrauch aufweist.',
  true
);

-- Easy #14: Line chart – Kundenzufriedenheit im Zeitverlauf
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'easy',
  'line',
  'Betrachte die Entwicklung der Kundenzufriedenheit (NPS) über die letzten sechs Quartale. Gibt es einen klaren Trend?',
  '{"labels": ["Q3 2023", "Q4 2023", "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"], "datasets": [{"label": "NPS-Score", "data": [32, 35, 38, 41, 39, 45], "color": "#06b6d4"}]}',
  'Net Promoter Score (NPS) Entwicklung',
  'Achte auf den Gesamttrend und eventuelle Schwankungen. Ein NPS über 30 gilt als gut, über 50 als exzellent.',
  'Der NPS zeigt einen positiven Aufwärtstrend von 32 auf 45 über sechs Quartale, mit einem leichten Rückgang in Q3 2024. Insgesamt eine Steigerung um 13 Punkte (+41 %), was auf erfolgreiche Maßnahmen zur Kundenbindung hindeutet.',
  true
);


-- MEDIUM (6 new cases: 15-20)

-- Medium #15: Stacked bar – Umsatz nach Vertriebskanal
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'medium',
  'stacked_bar',
  'Analysiere die Umsatzentwicklung nach Vertriebskanal über vier Quartale. Welcher Kanal wächst am stärksten und wie verändert sich der Kanalmix? Welche strategischen Empfehlungen leitest du ab?',
  '{"labels": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"], "datasets": [{"label": "Stationärer Handel (Mio €)", "data": [18.5, 17.8, 16.9, 15.2], "color": "#3b82f6"}, {"label": "Online-Shop (Mio €)", "data": [8.2, 9.5, 11.3, 13.8], "color": "#10b981"}, {"label": "Marktplätze (Mio €)", "data": [3.1, 3.8, 4.2, 5.0], "color": "#f59e0b"}]}',
  'Umsatz nach Vertriebskanal 2024',
  'Berechne die Wachstumsraten je Kanal. Wie verändert sich der prozentuale Anteil des Online-Shops am Gesamtumsatz?',
  'Der Online-Shop wächst mit +68 % am stärksten (von 8,2 auf 13,8 Mio €) und steigert seinen Anteil am Gesamtumsatz von ca. 28 % auf 41 %. Der stationäre Handel schrumpft um 18 %. Strategisch sollte in den Online-Kanal investiert werden, wobei ein Omnichannel-Ansatz den stationären Rückgang abfedern kann.',
  true
);

-- Medium #16: Line chart – Vergleich Werbekampagnen
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'medium',
  'line',
  'Vergleiche die Conversion Rates der drei Werbekampagnen über 8 Wochen. Welche Kampagne ist am effektivsten und warum? Ab welcher Woche zeigt sich ein klarer Unterschied?',
  '{"labels": ["Woche 1", "Woche 2", "Woche 3", "Woche 4", "Woche 5", "Woche 6", "Woche 7", "Woche 8"], "datasets": [{"label": "Social-Media-Kampagne (%)", "data": [1.2, 1.8, 2.5, 3.1, 3.6, 3.9, 4.1, 4.2], "color": "#3b82f6"}, {"label": "E-Mail-Kampagne (%)", "data": [2.8, 2.9, 3.0, 2.7, 2.5, 2.6, 2.4, 2.3], "color": "#ef4444"}, {"label": "Influencer-Kampagne (%)", "data": [0.5, 1.0, 2.2, 3.8, 4.5, 4.8, 4.6, 4.4], "color": "#10b981"}]}',
  'Conversion Rates nach Werbekampagne',
  'Vergleiche Startwerte, Endwerte und die Entwicklungsdynamik. Berücksichtige auch die Anlaufzeit jeder Kampagne.',
  'Die Influencer-Kampagne startet niedrig (0,5 %), wächst aber am schnellsten und erreicht den Höchstwert (4,8 %) in Woche 6. Die Social-Media-Kampagne wächst stetig. Die E-Mail-Kampagne stagniert und fällt leicht ab, was auf Adresssättigung hindeutet. Ab Woche 4 überholt die Influencer-Kampagne die E-Mail-Kampagne.',
  true
);

-- Medium #17: Waterfall – Kostenentwicklung
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'medium',
  'waterfall',
  'Analysiere die Veränderung der Betriebskosten von 2023 auf 2024. Welche Kostentreiber sind am relevantesten und wo gibt es Einsparpotenzial?',
  '{"labels": ["Kosten 2023", "Rohstoffe", "Personal", "Logistik", "IT-Infrastruktur", "Energie", "Outsourcing-Einsparung", "Kosten 2024"], "datasets": [{"label": "Veränderung (Mio €)", "data": [48.0, 5.2, 3.8, 1.9, 2.1, 1.4, -3.5, 58.9], "color": "#ef4444"}]}',
  'Kostenbrücke 2023 auf 2024',
  'Identifiziere die drei größten Kostentreiber. Welcher Posten ist der einzige mit negativem Vorzeichen (Einsparung)? Berechne die prozentuale Gesamtveränderung.',
  'Die Kosten stiegen um 10,9 Mio € (+22,7 %) von 48 auf 58,9 Mio €. Größte Treiber sind Rohstoffe (+5,2 Mio €) und Personal (+3,8 Mio €). Die Outsourcing-Einsparung von 3,5 Mio € konnte den Anstieg nur teilweise kompensieren. Kurzfristig besteht Einsparpotenzial bei Logistik und Energie.',
  true
);

-- Medium #18: Bar chart – Filialvergleich Profitabilität
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'medium',
  'bar',
  'Vergleiche Umsatz und Betriebskosten der sechs Filialen. Welche Filialen sind profitabel und welche erwirtschaften Verluste? Berechne die Marge pro Filiale.',
  '{"labels": ["Berlin", "München", "Hamburg", "Köln", "Frankfurt", "Stuttgart"], "datasets": [{"label": "Umsatz (Tsd €)", "data": [520, 680, 410, 390, 470, 550], "color": "#10b981"}, {"label": "Betriebskosten (Tsd €)", "data": [480, 530, 430, 350, 510, 490], "color": "#ef4444"}]}',
  'Filialvergleich: Umsatz vs. Betriebskosten 2024',
  'Berechne den Gewinn/Verlust pro Filiale. Welche Filialen haben eine negative Marge und welche Maßnahmen wären sinnvoll?',
  'München ist die profitabelste Filiale (150 Tsd € Gewinn, 22 % Marge), gefolgt von Stuttgart (60 Tsd €) und Köln (40 Tsd €). Berlin ist knapp profitabel (40 Tsd €). Hamburg (-20 Tsd €) und Frankfurt (-40 Tsd €) sind defizitär. Für diese Filialen sollten Kostenreduktion oder Standortoptimierung geprüft werden.',
  true
);

-- Medium #19: Pie chart – Zeitverteilung Projektteam
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'medium',
  'pie',
  'Analysiere die Zeitverteilung des Projektteams. Wie hoch ist der Anteil produktiver Arbeit (Entwicklung + Design) im Vergleich zu Overhead-Aktivitäten? Welche Optimierungsmöglichkeiten siehst du?',
  '{"labels": ["Entwicklung", "Design", "Meetings", "Administration", "Code Reviews", "Testing", "Dokumentation"], "datasets": [{"label": "Zeitanteil (%)", "data": [28, 12, 22, 14, 8, 10, 6], "color": "#8b5cf6"}]}',
  'Zeitverteilung Projektteam – Durchschnittliche Arbeitswoche',
  'Gruppiere die Aktivitäten in wertschöpfende und unterstützende Tätigkeiten. Vergleiche den Meeting-Anteil mit Branchenbenchmarks (üblich: 10-15 %).',
  'Nur 40 % der Arbeitszeit entfallen auf direkt wertschöpfende Tätigkeiten (Entwicklung 28 % + Design 12 %). Der Meeting-Anteil von 22 % liegt deutlich über dem Branchendurchschnitt. Zusammen mit Administration (14 %) macht Overhead 36 % aus. Empfehlung: Meetings straffen und Administrationsprozesse automatisieren.',
  true
);

-- Medium #20: Scatter chart – Preis vs. Kundenbewertung
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'medium',
  'scatter',
  'Analysiere den Zusammenhang zwischen Verkaufspreis und Kundenbewertung der Produkte. Gibt es eine Korrelation? Welche Produkte sind Ausreißer?',
  '{"labels": ["Produkt A", "Produkt B", "Produkt C", "Produkt D", "Produkt E", "Produkt F", "Produkt G", "Produkt H", "Produkt I", "Produkt J"], "datasets": [{"label": "Verkaufspreis (€)", "data": [29, 49, 79, 99, 149, 199, 249, 349, 59, 179], "color": "#3b82f6"}, {"label": "Kundenbewertung (1-5)", "data": [3.2, 4.1, 3.8, 4.5, 4.3, 4.7, 3.1, 4.8, 4.6, 2.9], "color": "#f59e0b"}]}',
  'Preis vs. Kundenbewertung – Produktportfolio',
  'Suche nach Mustern: Werden teurere Produkte besser bewertet? Identifiziere Produkte mit niedrigem Preis und hoher Bewertung (Stars) sowie hohem Preis und niedriger Bewertung (Problemkinder).',
  'Es gibt keine klare lineare Korrelation zwischen Preis und Bewertung. Produkt I (59 €, Bewertung 4,6) ist ein Star mit exzellentem Preis-Leistungs-Verhältnis. Produkt G (249 €, Bewertung 3,1) und Produkt J (179 €, Bewertung 2,9) sind Problemkinder mit hohem Preis aber schlechter Bewertung – hier besteht dringender Handlungsbedarf.',
  true
);


-- HARD (5 new cases: 21-25)

-- Hard #21: Stacked bar – Segmentanalyse mit Margenverfall
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'hard',
  'stacked_bar',
  'Analysiere die Umsatz- und Margenentwicklung der drei Geschäftsbereiche über vier Quartale. Welcher Bereich zeigt die besorgniserregendste Entwicklung? Welche strategischen Maßnahmen empfiehlst du dem Vorstand?',
  '{"labels": ["Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024"], "datasets": [{"label": "Automotive (Mio €)", "data": [45.0, 43.2, 38.5, 32.1], "color": "#3b82f6"}, {"label": "Industrie (Mio €)", "data": [22.0, 23.5, 25.0, 26.8], "color": "#10b981"}, {"label": "Consumer (Mio €)", "data": [15.0, 16.2, 15.8, 17.5], "color": "#f59e0b"}, {"label": "Bruttomarge Automotive (%)", "data": [18.5, 16.2, 12.1, 8.3], "color": "#ef4444"}, {"label": "Bruttomarge Industrie (%)", "data": [24.0, 24.5, 25.1, 25.8], "color": "#06b6d4"}]}',
  'Geschäftsbereichsanalyse: Umsatz und Margen 2024',
  'Berechne den Umsatzrückgang im Automotive-Bereich absolut und prozentual. Vergleiche die Margenentwicklung der Segmente. Wie verändert sich der Gesamtumsatz trotz Automotive-Rückgang?',
  'Der Automotive-Bereich zeigt eine kritische Doppelentwicklung: Umsatz sinkt um 28,7 % (45,0 auf 32,1 Mio €) bei gleichzeitigem Margenverfall von 18,5 % auf 8,3 %. Der Gesamtumsatz sinkt nur leicht (82,0 auf 76,4 Mio €), da Industrie (+21,8 %) und Consumer (+16,7 %) das teilweise kompensieren. Empfehlung: Automotive restrukturieren oder Ausstieg prüfen, Industriegeschäft als neuen Wachstumskern ausbauen.',
  true
);

-- Hard #22: Waterfall – EBITDA-Brücke Akquisition
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'hard',
  'waterfall',
  'Ein Unternehmen hat eine Akquisition durchgeführt. Analysiere die EBITDA-Brücke und bewerte, ob die geplanten Synergien realistisch erzielt wurden. Welche Positionen überraschen und welche Risiken bestehen?',
  '{"labels": ["EBITDA Käufer", "EBITDA Zielunternehmen", "Umsatzsynergien", "Kostensynergien", "Integrationskosten", "Kundenabwanderung", "Managementkosten", "Regulatorische Auflagen", "EBITDA kombiniert"], "datasets": [{"label": "Veränderung (Mio €)", "data": [120.0, 35.0, 8.5, 12.0, -9.5, -7.2, -3.8, -2.5, 152.5], "color": "#3b82f6"}]}',
  'EBITDA-Brücke Post-Akquisition',
  'Vergleiche positive Synergien (Umsatz + Kosten = 20,5 Mio €) mit negativen Effekten (Integrationskosten + Kundenabwanderung + Management + Regulierung = 23,0 Mio €). Bewerte die Netto-Synergien.',
  'Die Brutto-Synergien von 20,5 Mio € (Umsatz 8,5 + Kosten 12,0) werden durch negative Effekte von 23,0 Mio € überkompensiert. Die Netto-Synergien sind negativ (-2,5 Mio €). Besonders besorgniserregend ist die Kundenabwanderung (-7,2 Mio €), die auf Integrationsrisiken hindeutet. Das kombinierte EBITDA von 152,5 Mio € liegt unter der Summe der Einzelunternehmen (155 Mio €) – die Akquisition hat bisher Wert vernichtet.',
  true
);

-- Hard #23: Line chart – Mehrdimensionale SaaS-Metriken
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'hard',
  'line',
  'Analysiere die SaaS-KPIs über 12 Monate. Identifiziere kritische Entwicklungen und erkläre, warum trotz steigendem MRR die Unit Economics problematisch sind. Welche Maßnahmen würdest du empfehlen?',
  '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], "datasets": [{"label": "MRR (Tsd €)", "data": [180, 195, 210, 228, 245, 260, 275, 290, 308, 325, 342, 360], "color": "#3b82f6"}, {"label": "CAC (€)", "data": [250, 270, 295, 320, 350, 380, 410, 445, 480, 520, 560, 610], "color": "#ef4444"}, {"label": "Monatliche Churn Rate (%)", "data": [2.1, 2.3, 2.5, 2.8, 3.0, 3.2, 3.5, 3.8, 4.0, 4.3, 4.6, 5.0], "color": "#f59e0b"}, {"label": "ARPU (€)", "data": [45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34], "color": "#10b981"}]}',
  'SaaS-KPI-Dashboard 2024',
  'Berechne die Veränderungsraten: MRR-Wachstum, CAC-Steigerung, Churn-Zunahme und ARPU-Rückgang. Bewerte die LTV/CAC-Ratio am Anfang und Ende des Zeitraums.',
  'Trotz MRR-Wachstum von 100 % (180 auf 360 Tsd €) verschlechtern sich die Unit Economics dramatisch: CAC steigt um 144 % (250 auf 610 €), Churn verdoppelt sich (2,1 % auf 5,0 %) und ARPU sinkt um 24 % (45 auf 34 €). Die LTV/CAC-Ratio fällt von ca. 7,5x auf unter 2x – ein kritischer Kipppunkt. Das Unternehmen wächst durch aggressive Kundenakquise immer unrentablerer Kunden. Empfehlung: Churn-Reduktion priorisieren, Preismodell überarbeiten und Akquisitionskanäle mit niedrigem CAC fokussieren.',
  true
);

-- Hard #24: Scatter chart – Marktattraktivität vs. Wettbewerbsposition
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'hard',
  'scatter',
  'Du siehst eine McKinsey-Matrix mit 10 Geschäftseinheiten. Die erste Datenreihe zeigt die Marktattraktivität (0-100), die zweite die relative Wettbewerbsstärke (0-100). Welche Einheiten sollten ausgebaut, gehalten oder desinvestiert werden? Begründe deine Portfoliostrategie.',
  '{"labels": ["Cloud Services", "Legacy Software", "Cybersecurity", "IoT-Plattform", "Managed Services", "Hardware-Wartung", "AI/ML Tools", "Datenanalyse", "ERP On-Premise", "Mobile Apps"], "datasets": [{"label": "Marktattraktivität (0-100)", "data": [92, 25, 88, 75, 60, 20, 95, 82, 30, 68], "color": "#3b82f6"}, {"label": "Wettbewerbsstärke (0-100)", "data": [78, 65, 45, 55, 72, 80, 35, 70, 85, 40], "color": "#10b981"}]}',
  'McKinsey-Matrix: Portfolioanalyse Geschäftseinheiten',
  'Kategorisiere die Einheiten: Invest (hohe Marktattraktivität + hohe Wettbewerbsstärke), Selektiv (mittel/mittel oder gemischt), Desinvest (niedrig/niedrig). Beachte besondere Fälle wie hohe Attraktivität bei niedriger Stärke.',
  'Ausbauen: Cloud Services (92/78) und Datenanalyse (82/70) – attraktive Märkte mit starker Position. Selektiv investieren: Cybersecurity (88/45) und AI/ML Tools (95/35) – sehr attraktive Märkte, aber schwache Position, erfordern gezielte Investitionen oder Partnerschaften. IoT-Plattform und Managed Services halten. Desinvestieren: Legacy Software (25/65), Hardware-Wartung (20/80) und ERP On-Premise (30/85) – starke Position in unattraktiven Märkten, Cash-Cows für begrenzten Zeitraum nutzen und Ressourcen in Wachstumsbereiche umschichten.',
  true
);

-- Hard #25: Stacked bar + Waterfall hybrid – Profitabilitätsanalyse nach Region
INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES (
  'hard',
  'stacked_bar',
  'Analysiere die Profitabilität der vier Regionen unter Berücksichtigung von Umsatz, variablen und fixen Kosten. Berechne den Deckungsbeitrag und die Nettomarge pro Region. Welche Region subventioniert welche und welche Portfolio-Entscheidungen empfiehlst du?',
  '{"labels": ["DACH", "Westeuropa", "Osteuropa", "Nordamerika"], "datasets": [{"label": "Umsatz (Mio €)", "data": [85.0, 52.0, 28.0, 42.0], "color": "#3b82f6"}, {"label": "Variable Kosten (Mio €)", "data": [38.0, 28.0, 18.5, 22.0], "color": "#f59e0b"}, {"label": "Fixkosten (Mio €)", "data": [25.0, 18.0, 12.0, 24.0], "color": "#ef4444"}, {"label": "Investitionen (Mio €)", "data": [5.0, 3.5, 4.5, 8.0], "color": "#8b5cf6"}]}',
  'Regionale Profitabilitätsanalyse 2024',
  'Berechne für jede Region: Deckungsbeitrag (Umsatz - Variable Kosten), operativer Gewinn (DB - Fixkosten), und Nettoergebnis (op. Gewinn - Investitionen). Vergleiche die Margen. Welche Region erzielt einen negativen Nettoertrag?',
  'DACH ist mit 17 Mio € Nettoergebnis (20 % Nettomarge) der Gewinnmotor. Westeuropa erzielt 2,5 Mio € (4,8 % Marge). Osteuropa ist mit -7 Mio € stark defizitär (DB -2,5 Mio € + hohe Investitionen), aber die Investitionen (4,5 Mio €) deuten auf Aufbauphase hin. Nordamerika verliert trotz solidem DB von 20 Mio € durch überhöhte Fixkosten (24 Mio €) und Investitionen (8 Mio €) netto 12 Mio €. DACH und Westeuropa subventionieren die Expansion. Empfehlung: Fixkosten in Nordamerika rigoros senken, Osteuropa-Investitionen nur fortsetzen bei klarem Break-even-Pfad.',
  true
);
