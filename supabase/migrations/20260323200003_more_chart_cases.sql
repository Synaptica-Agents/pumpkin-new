-- ============================================================
-- Add 25 more chart_cases (total → 50)
-- 8 easy + 9 medium + 8 hard
-- All in German, realistic consulting data
-- ============================================================

-- EASY (8 new)

INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('easy', 'bar',
   'Vergleiche die Mitarbeiterzahl der Abteilungen. Welche Abteilung ist am größten und wie ist das Verhältnis zwischen kundennahen und internen Bereichen?',
   '{"labels": ["Vertrieb", "Produktion", "IT", "Marketing", "HR", "Finanzen"], "datasets": [{"label": "Mitarbeiter", "data": [85, 120, 45, 30, 18, 22], "color": "#3b82f6"}]}',
   'Mitarbeiterzahl nach Abteilung',
   'Gruppiere die Abteilungen in kundennahe (Vertrieb, Marketing) und interne Bereiche (IT, HR, Finanzen, Produktion).',
   'Die Produktion ist mit 120 Mitarbeitern die größte Abteilung (37 % der Belegschaft). Kundennahe Bereiche (Vertrieb 85 + Marketing 30 = 115) und interne Bereiche (Produktion 120 + IT 45 + HR 18 + Finanzen 22 = 205) stehen im Verhältnis 36 % zu 64 %.',
   true),

  ('easy', 'pie',
   'Analysiere die Budgetverteilung der Marketingabteilung. Welcher Kanal erhält den größten Anteil und wie bewertest du den Mix zwischen Online und Offline?',
   '{"labels": ["Social Media", "Google Ads", "TV/Radio", "Events", "Print", "Content/SEO"], "datasets": [{"label": "Budgetanteil (%)", "data": [28, 22, 18, 12, 8, 12], "color": "#f59e0b"}]}',
   'Marketing-Budgetverteilung 2025',
   'Berechne den Anteil digitaler Kanäle (Social Media + Google Ads + Content/SEO) vs. traditioneller Kanäle (TV/Radio + Events + Print).',
   'Digitale Kanäle machen 62 % des Budgets aus (Social Media 28 % + Google Ads 22 % + Content 12 %), traditionelle 38 %. Social Media ist der größte Einzelposten. Der Mix ist digital-lastig, was für ein modernes B2C-Unternehmen angemessen ist.',
   true),

  ('easy', 'line',
   'Eine Eisdiele zeigt ihren monatlichen Umsatz und die Durchschnittstemperatur. Erkennst du einen Zusammenhang?',
   '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], "datasets": [{"label": "Umsatz (Tsd €)", "data": [4, 5, 8, 15, 28, 42, 55, 52, 35, 18, 8, 5], "color": "#3b82f6"}, {"label": "Temperatur (°C)", "data": [1, 2, 7, 12, 18, 22, 25, 24, 19, 12, 6, 2], "color": "#ef4444"}]}',
   'Umsatz vs. Temperatur – Eisdiele 2024',
   'Vergleiche die beiden Kurven. In welchem Monat ist der Umsatz am höchsten und stimmt das mit der Temperatur überein?',
   'Es gibt eine starke positive Korrelation zwischen Temperatur und Umsatz. Der Umsatz-Peak liegt im Juli (55 Tsd €) bei 25 °C. Im Winter (Jan/Feb/Dez) liegt der Umsatz bei nur 4-5 Tsd € – rund 90 % weniger als im Sommer. Das Geschäft ist extrem saisonabhängig.',
   true),

  ('easy', 'bar',
   'Betrachte die App-Downloads über die letzten 6 Monate. Wann gab es einen auffälligen Anstieg und was könnte die Ursache sein?',
   '{"labels": ["Juli", "August", "September", "Oktober", "November", "Dezember"], "datasets": [{"label": "Downloads (Tsd.)", "data": [12, 14, 13, 45, 38, 52], "color": "#10b981"}]}',
   'App-Downloads H2 2024',
   'Achte auf den sprunghaften Anstieg ab Oktober. Mögliche Ursachen: Kampagne, Feature-Launch, Saisonalität.',
   'Die Downloads verdreifachten sich von September (13 Tsd.) auf Oktober (45 Tsd.) – ein klarer Sprung. Dies deutet auf einen externen Trigger hin (z.B. Marketingkampagne oder viraler Moment). Dezember erreicht mit 52 Tsd. den Höchstwert, möglicherweise durch Weihnachtsgeschäft verstärkt.',
   true),

  ('easy', 'pie',
   'Analysiere die Umsatzverteilung eines Einzelhändlers nach Produktgruppe. Welche Gruppe dominiert und wie diversifiziert ist das Geschäft?',
   '{"labels": ["Lebensmittel", "Getränke", "Haushalt", "Kosmetik", "Tierbedarf"], "datasets": [{"label": "Umsatzanteil (%)", "data": [45, 20, 15, 12, 8], "color": "#8b5cf6"}]}',
   'Umsatzverteilung nach Produktgruppe',
   'Prüfe, wie stark das Geschäft von einer einzigen Produktgruppe abhängt. Welches Risiko ergibt sich daraus?',
   'Lebensmittel dominieren mit 45 % den Umsatz. Zusammen mit Getränken (20 %) machen Food & Beverage 65 % aus. Das Geschäft ist stark auf eine Kategorie konzentriert – ein Preiskampf bei Lebensmitteln würde das Gesamtergebnis erheblich belasten.',
   true),

  ('easy', 'line',
   'Betrachte das Follower-Wachstum auf drei Social-Media-Plattformen über 6 Monate. Welche Plattform wächst am stärksten?',
   '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"], "datasets": [{"label": "Instagram (Tsd.)", "data": [25, 28, 32, 38, 45, 55], "color": "#ec4899"}, {"label": "LinkedIn (Tsd.)", "data": [8, 9, 10, 11, 12, 14], "color": "#3b82f6"}, {"label": "TikTok (Tsd.)", "data": [3, 5, 12, 22, 40, 68], "color": "#10b981"}]}',
   'Social-Media-Follower-Wachstum H1 2025',
   'Vergleiche absolutes Wachstum und prozentuales Wachstum. Welche Plattform hat das stärkste Momentum?',
   'TikTok wächst von 3 auf 68 Tsd. (+2.167 %) am stärksten und überholt Instagram ab Mai. Instagram wächst stetig von 25 auf 55 Tsd. (+120 %). LinkedIn wächst am langsamsten (+75 %). TikTok hat klar das stärkste Momentum.',
   true),

  ('easy', 'bar',
   'Vergleiche die Kundenbeschwerden nach Kategorie im letzten Quartal. Wo liegt der größte Handlungsbedarf?',
   '{"labels": ["Lieferverzögerung", "Produktqualität", "Kundenservice", "Rechnungsfehler", "Retouren-Prozess", "Website/App"], "datasets": [{"label": "Beschwerden (Anzahl)", "data": [145, 82, 68, 35, 92, 28], "color": "#ef4444"}]}',
   'Kundenbeschwerden nach Kategorie Q4 2024',
   'Erstelle ein Pareto-Ranking: Welche 2-3 Kategorien verursachen den Großteil der Beschwerden?',
   'Lieferverzögerung (145) und Retouren-Prozess (92) machen zusammen 53 % aller Beschwerden aus. Mit Produktqualität (82) sind es bereits 71 %. Diese drei Kategorien sollten priorisiert werden – alle betreffen die Logistik-Kette.',
   true),

  ('easy', 'pie',
   'Analysiere die Anteile der Verkehrsträger im deutschen Güterverkehr. Welcher dominiert und welche Alternativen gibt es?',
   '{"labels": ["Straße (LKW)", "Schiene", "Binnenschiff", "Pipeline", "Luftfracht"], "datasets": [{"label": "Anteil am Güterverkehr (%)", "data": [72, 18, 6, 3, 1], "color": "#f97316"}]}',
   'Modal Split Güterverkehr Deutschland',
   'Wie stark ist die Dominanz des Straßenverkehrs? Welche Verlagerungspotenziale bestehen?',
   'Der LKW dominiert mit 72 % den Güterverkehr massiv. Die Schiene (18 %) ist die einzige relevante Alternative. Binnenschiff (6 %) ist auf Wasserstraßen beschränkt. Die starke LKW-Abhängigkeit ist ein Risiko bei steigenden CO2-Kosten – Verlagerung auf Schiene hat das größte Potenzial.',
   true);


-- MEDIUM (9 new)

INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('medium', 'stacked_bar',
   'Analysiere die Altersstruktur der Belegschaft über 5 Jahre. Welches demografische Risiko erkennst du und welche HR-Maßnahmen empfiehlst du?',
   '{"labels": ["2020", "2021", "2022", "2023", "2024"], "datasets": [{"label": "Unter 30 (%)", "data": [25, 22, 20, 18, 15], "color": "#10b981"}, {"label": "30-50 (%)", "data": [45, 44, 43, 42, 40], "color": "#3b82f6"}, {"label": "Über 50 (%)", "data": [30, 34, 37, 40, 45], "color": "#ef4444"}]}',
   'Altersstruktur Belegschaft 2020-2024',
   'Berechne die Veränderungsrate jeder Altersgruppe. In wie vielen Jahren wird die Über-50-Gruppe die Mehrheit stellen?',
   'Die Über-50-Gruppe wächst von 30 % auf 45 % (+15 Pkt in 5 Jahren, +3 Pkt/Jahr). Die Unter-30-Gruppe schrumpft von 25 % auf 15 %. Bei diesem Trend stellt die Über-50-Gruppe in ca. 2 Jahren die Mehrheit. Risiko: Wissensverlust durch Pensionierungswelle. HR-Maßnahmen: Nachwuchsprogramme, Wissenstransfer, altersgemischte Teams.',
   true),

  ('medium', 'line',
   'Vergleiche den Aktienkurs des Unternehmens mit dem Branchenindex über 12 Monate. Wann outperformt das Unternehmen und wann underperformt es? Was könnten die Ursachen sein?',
   '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], "datasets": [{"label": "Unternehmen (Index: 100)", "data": [100, 105, 98, 92, 88, 95, 108, 115, 120, 112, 118, 125], "color": "#3b82f6"}, {"label": "Branchenindex (100)", "data": [100, 103, 101, 98, 96, 100, 104, 107, 110, 108, 112, 115], "color": "#f59e0b"}]}',
   'Aktienkurs vs. Branchenindex 2024',
   'Berechne die Outperformance am Jahresende. Identifiziere Phasen der Under- und Outperformance.',
   'Das Unternehmen outperformt den Index am Jahresende um 10 Pkt (125 vs. 115 = +8,7 %). Phase 1 (Jan-Mai): Underperformance, Kurs fällt stärker (-12 % vs. -4 %). Phase 2 (Mai-Dez): Starke Outperformance (+42 % vs. +20 %). Der Turnaround ab Mai deutet auf ein positives Event hin (z.B. Strategiewechsel, gute Quartalszahlen).',
   true),

  ('medium', 'waterfall',
   'Analysiere die Umsatzveränderung eines Unternehmens nach den drei Treibern: Preis, Menge und Produktmix. Welcher Faktor hat den größten Einfluss?',
   '{"labels": ["Umsatz 2023", "Preiseffekt", "Mengeneffekt", "Mixeffekt", "Wechselkurse", "Umsatz 2024"], "datasets": [{"label": "Veränderung (Mio €)", "data": [240, 12, -18, 8, -5, 237], "color": "#3b82f6"}]}',
   'Umsatzbrücke 2023 → 2024',
   'Berechne den Nettoeffekt. Welcher positive Treiber kompensiert den Mengenrückgang am besten?',
   'Der Umsatz sinkt leicht um 3 Mio € (-1,3 %). Der Mengenrückgang (-18 Mio €) ist der größte negative Treiber und wird nur teilweise durch Preiseffekt (+12 Mio €) und Mixeffekt (+8 Mio €) kompensiert. Wechselkurse belasten zusätzlich (-5 Mio €). Strategie: Volumen stabilisieren, Premium-Mix weiter ausbauen.',
   true),

  ('medium', 'bar',
   'Ein Unternehmen hat drei Varianten einer Landingpage getestet. Vergleiche Conversion Rate und durchschnittlichen Warenkorbwert. Welche Variante sollte ausgerollt werden?',
   '{"labels": ["Variante A (Original)", "Variante B (Neues Layout)", "Variante C (Video-Header)"], "datasets": [{"label": "Conversion Rate (%)", "data": [3.2, 4.1, 3.8], "color": "#10b981"}, {"label": "Ø Warenkorb (€)", "data": [65, 58, 72], "color": "#3b82f6"}]}',
   'A/B/C-Test Ergebnisse – Landingpage',
   'Berechne den erwarteten Umsatz pro 1.000 Besucher für jede Variante (Conversion Rate × Warenkorbwert). Welche Variante maximiert den Umsatz?',
   'Umsatz pro 1.000 Besucher: A = 32 × 65 = 2.080 €, B = 41 × 58 = 2.378 €, C = 38 × 72 = 2.736 €. Variante C maximiert den Umsatz trotz niedrigerer Conversion Rate als B, weil der höhere Warenkorbwert (+24 % vs. A) den Unterschied macht. Empfehlung: Variante C ausrollen.',
   true),

  ('medium', 'pie',
   'Vergleiche die Kostenstruktur des Unternehmens mit dem Branchendurchschnitt. Wo gibt es die größten Abweichungen und welche Optimierungshebel ergeben sich?',
   '{"labels": ["Material", "Personal", "Miete", "Marketing", "IT", "Sonstiges"], "datasets": [{"label": "Unternehmen (%)", "data": [35, 28, 10, 12, 8, 7], "color": "#3b82f6"}, {"label": "Branche (%)", "data": [30, 25, 8, 15, 12, 10], "color": "#f59e0b"}]}',
   'Kostenstruktur: Unternehmen vs. Branche',
   'Identifiziere Posten, bei denen das Unternehmen über dem Branchendurchschnitt liegt. Wo wird gespart?',
   'Das Unternehmen liegt bei Material (+5 Pkt) und Personal (+3 Pkt) über der Branche – zusammen 8 Pkt Overhead. Dafür wird bei Marketing (-3 Pkt) und IT (-4 Pkt) gespart. Die IT-Unterinvestition könnte langfristig problematisch sein. Materialkosten sollten durch bessere Einkaufskonditionen oder Lieferantenwechsel optimiert werden.',
   true),

  ('medium', 'line',
   'Betrachte den Zusammenhang zwischen Churn-Rate und Kundenzufriedenheit (CSAT) über 8 Quartale. Welchen Trend erkennst du und ab welchem CSAT-Wert steigt die Churn-Rate kritisch?',
   '{"labels": ["Q1 23", "Q2 23", "Q3 23", "Q4 23", "Q1 24", "Q2 24", "Q3 24", "Q4 24"], "datasets": [{"label": "Churn-Rate (%)", "data": [2.5, 2.8, 3.2, 3.0, 3.5, 4.2, 3.8, 4.5], "color": "#ef4444"}, {"label": "CSAT-Score (1-10)", "data": [8.2, 7.9, 7.5, 7.6, 7.2, 6.8, 7.0, 6.5], "color": "#10b981"}]}',
   'Churn-Rate vs. Kundenzufriedenheit',
   'Gibt es eine inverse Korrelation? Ab welchem CSAT-Wert eskaliert die Churn-Rate besonders?',
   'Klare inverse Korrelation: Wenn CSAT sinkt, steigt die Churn-Rate. Der kritische Schwellenwert liegt bei CSAT 7,0 – darunter springt die Churn-Rate auf über 4 %. Von Q1 2023 bis Q4 2024 sank der CSAT um 1,7 Punkte, während die Churn-Rate von 2,5 % auf 4,5 % stieg (+80 %). Priorität: CSAT über 7,5 stabilisieren.',
   true),

  ('medium', 'stacked_bar',
   'Analysiere den Energiemix eines Landes über 4 Jahre. Wie schnell findet die Energiewende statt und welche Energieträger werden verdrängt?',
   '{"labels": ["2021", "2022", "2023", "2024"], "datasets": [{"label": "Kohle (%)", "data": [28, 24, 20, 16], "color": "#6b7280"}, {"label": "Gas (%)", "data": [25, 26, 25, 24], "color": "#f59e0b"}, {"label": "Kernenergie (%)", "data": [12, 8, 4, 0], "color": "#8b5cf6"}, {"label": "Wind (%)", "data": [18, 22, 26, 30], "color": "#3b82f6"}, {"label": "Solar (%)", "data": [10, 13, 17, 22], "color": "#f97316"}, {"label": "Sonstige (%)", "data": [7, 7, 8, 8], "color": "#10b981"}]}',
   'Energiemix Deutschland 2021-2024',
   'Berechne die Veränderung der erneuerbaren Energien (Wind + Solar) und der fossilen (Kohle + Gas). Wie hat der Atomausstieg den Mix beeinflusst?',
   'Erneuerbare (Wind + Solar) stiegen von 28 % auf 52 % (+24 Pkt). Kohle sank am stärksten (-12 Pkt). Der Atomausstieg (-12 Pkt) wurde vollständig durch Erneuerbare kompensiert. Gas blieb nahezu stabil. Die Energiewende verläuft schnell: +6 Pkt Erneuerbare pro Jahr.',
   true),

  ('medium', 'waterfall',
   'Analysiere die Working-Capital-Veränderung eines Unternehmens. Welche Positionen binden am meisten Kapital und wo wurde Kapital freigesetzt?',
   '{"labels": ["Working Capital Q1", "Forderungen", "Vorräte", "Verbindlichkeiten", "Anzahlungen", "Working Capital Q4"], "datasets": [{"label": "Veränderung (Mio €)", "data": [32.0, 8.5, 5.2, -4.0, -2.8, 38.9], "color": "#8b5cf6"}]}',
   'Working-Capital-Bridge Q1 → Q4 2024',
   'Welche Positionen erhöhen das Working Capital (binden Kapital) und welche senken es (setzen Kapital frei)?',
   'Das Working Capital stieg um 6,9 Mio € (+21,6 %). Kapitalbindend: Forderungen (+8,5 Mio €) und Vorräte (+5,2 Mio €) – zusammen +13,7 Mio €. Kapitalfreisetzend: Verbindlichkeiten (-4,0 Mio €) und Anzahlungen (-2,8 Mio €) – zusammen -6,8 Mio €. Empfehlung: Forderungsmanagement verbessern (Zahlungsziele verkürzen) und Vorratsoptimierung (Just-in-Time).',
   true),

  ('medium', 'bar',
   'Betrachte den Conversion Funnel eines B2B-Unternehmens. Wo ist der größte Drop-off und welche Maßnahmen empfiehlst du?',
   '{"labels": ["Website-Besucher", "Leads", "Qualifizierte Leads", "Opportunities", "Angebote", "Abschlüsse"], "datasets": [{"label": "Anzahl", "data": [10000, 800, 320, 180, 95, 42], "color": "#06b6d4"}]}',
   'B2B Sales Funnel Q4 2024',
   'Berechne die Conversion Rate zwischen jeder Stufe. Wo ist der größte prozentuale Drop-off?',
   'Conversion Rates: Besucher→Lead: 8 %, Lead→Qualifiziert: 40 %, Qualifiziert→Opportunity: 56 %, Opportunity→Angebot: 53 %, Angebot→Abschluss: 44 %. Der größte absolute Drop-off ist Besucher→Lead (92 % Verlust). Der stärkste relative Drop-off nach der Qualifizierung ist Angebot→Abschluss (44 %). Empfehlung: Lead-Generierung optimieren und Abschlussquote durch bessere Angebotsprozesse steigern.',
   true);


-- HARD (8 new)

INSERT INTO public.chart_cases (difficulty, chart_type, prompt, chart_data, chart_title, interpretation_hints, reference_answer, active)
VALUES
  ('hard', 'stacked_bar',
   'Vergleiche die P&L-Struktur dreier Wettbewerber. Welches Unternehmen ist am effizientesten? Wo liegen die strukturellen Unterschiede und welche strategischen Schlussfolgerungen ziehst du?',
   '{"labels": ["Unternehmen A", "Unternehmen B", "Unternehmen C"], "datasets": [{"label": "Umsatz (Mio €)", "data": [500, 420, 680], "color": "#3b82f6"}, {"label": "COGS (Mio €)", "data": [275, 190, 410], "color": "#ef4444"}, {"label": "SGA (Mio €)", "data": [125, 140, 150], "color": "#f59e0b"}, {"label": "F&E (Mio €)", "data": [50, 60, 35], "color": "#8b5cf6"}, {"label": "EBIT (Mio €)", "data": [50, 30, 85], "color": "#10b981"}]}',
   'P&L-Vergleich: Drei Wettbewerber 2024',
   'Berechne EBIT-Marge, Bruttomarge und SGA-Quote für jedes Unternehmen. Welches hat die beste operative Effizienz?',
   'Bruttomargen: A 45 %, B 55 %, C 40 %. EBIT-Margen: A 10 %, B 7 %, C 12,5 %. SGA-Quote: A 25 %, B 33 %, C 22 %. Unternehmen C hat trotz niedrigster Bruttomarge die höchste EBIT-Marge durch niedrige SGA/F&E-Quoten – skalenbedingte Effizienz. B hat die höchste Bruttomarge (Premium-Positionierung) aber die schlechteste EBIT-Marge wegen aufgeblähter SGA. B sollte SGA optimieren; A sollte Bruttomarge verbessern.',
   true),

  ('hard', 'line',
   'Ein Krankenhaus trackt vier KPIs über 12 Monate. Analysiere die Wechselwirkungen: Wie hängen Auslastung, Wartezeit, Kosten pro Patient und Qualitätsindex zusammen? Wo liegt das optimale Gleichgewicht?',
   '{"labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], "datasets": [{"label": "Auslastung (%)", "data": [82, 85, 88, 91, 94, 97, 98, 96, 93, 90, 87, 84], "color": "#3b82f6"}, {"label": "Wartezeit (Tage)", "data": [3, 4, 5, 7, 10, 15, 18, 14, 9, 6, 4, 3], "color": "#ef4444"}, {"label": "Kosten/Patient (Tsd €)", "data": [8.2, 8.0, 7.8, 7.5, 7.2, 7.0, 6.9, 7.1, 7.4, 7.7, 8.0, 8.3], "color": "#f59e0b"}, {"label": "Qualitätsindex (0-100)", "data": [88, 87, 85, 82, 78, 72, 68, 73, 80, 84, 87, 89], "color": "#10b981"}]}',
   'Krankenhaus-KPI-Dashboard 2024',
   'Identifiziere den Kipppunkt: Ab welcher Auslastung brechen Qualität und Wartezeit ein? Welche Auslastung ist optimal?',
   'Ab 94 % Auslastung (Mai) eskalieren Wartezeit und Qualitätsverlust: Wartezeit verdreifacht sich, Qualität fällt um 20 Punkte. Die Kosten/Patient sinken zwar mit steigender Auslastung (Skaleneffekt), aber der Qualitätsverlust überwiegt. Optimale Auslastung: 88-90 % – hier sind Kosten noch günstig (7,5-7,8 Tsd €), Qualität hoch (82-85) und Wartezeit akzeptabel (5-6 Tage).',
   true),

  ('hard', 'waterfall',
   'Analysiere die Free-Cashflow-Brücke des Unternehmens vom EBITDA zum Free Cashflow. Welche Positionen konsumieren am meisten Cash und wie bewertest du die Cash-Conversion?',
   '{"labels": ["EBITDA", "Working Capital", "Steuern", "Zinsen", "CapEx Erhaltung", "CapEx Wachstum", "Leasing", "Sonstiges", "Free Cashflow"], "datasets": [{"label": "Veränderung (Mio €)", "data": [180, -25, -38, -12, -30, -55, -8, -2, 10], "color": "#10b981"}]}',
   'Free-Cashflow-Bridge 2024',
   'Berechne die Cash Conversion (FCF/EBITDA). Unterscheide zwischen Erhaltungs-CapEx und Wachstums-CapEx. Wie hoch wäre der FCF ohne Wachstumsinvestitionen?',
   'Die Cash Conversion ist mit 5,6 % (10/180 Mio €) extrem niedrig. Größte Cash-Verbraucher: Wachstums-CapEx (55 Mio €, 31 % des EBITDA) und Steuern (38 Mio €). Ohne Wachstums-CapEx wäre der FCF 65 Mio € (36 % Conversion) – deutlich gesünder. Die hohen Wachstumsinvestitionen drücken den FCF massiv. Entscheidend: Generieren die 55 Mio € Wachstums-CapEx ausreichend zukünftigen Return?',
   true),

  ('hard', 'bar',
   'Du bewertest drei potenzielle Akquisitionsziele anhand von sechs KPIs. Welches Ziel bietet das beste Chance-Risiko-Profil? Begründe deine Empfehlung mit einer gewichteten Bewertung.',
   '{"labels": ["Umsatzwachstum (%)", "EBITDA-Marge (%)", "Kundenbindung (%)", "Marktanteil (%)", "Tech-Reife (1-10)", "Kultureller Fit (1-10)"], "datasets": [{"label": "Ziel Alpha", "data": [25, 8, 75, 12, 9, 5], "color": "#3b82f6"}, {"label": "Ziel Beta", "data": [12, 22, 92, 8, 6, 8], "color": "#10b981"}, {"label": "Ziel Gamma", "data": [18, 15, 85, 15, 7, 7], "color": "#f59e0b"}]}',
   'Due-Diligence-Vergleich: Drei Akquisitionsziele',
   'Erstelle eine Scoring-Matrix mit Gewichtung der KPIs (z.B. 25 % Financials, 25 % Kunden, 25 % Markt, 25 % Integration).',
   'Alpha: Hohes Wachstum (25 %) und Top-Technologie (9/10), aber niedrige Marge (8 %) und schlechter kultureller Fit (5/10) – hohes Integrations-Risiko. Beta: Profitabelste Option (22 % EBITDA), beste Kundenbindung (92 %) und kultureller Fit (8/10), aber geringes Wachstum. Gamma: Balanced-Profil ohne Ausreißer. Empfehlung: Beta – profitabel, stabile Kundenbasis, guter kultureller Fit minimiert Integrationsrisiken. Wachstum kann post-Akquisition durch Synergien gesteigert werden.',
   true),

  ('hard', 'stacked_bar',
   'Analysiere die Marktanteilsentwicklung der Top-5-Anbieter über 6 Jahre. Welcher Anbieter gewinnt Marktanteile, welcher verliert? Was bedeutet das für die Marktstruktur?',
   '{"labels": ["2019", "2020", "2021", "2022", "2023", "2024"], "datasets": [{"label": "Marktführer A (%)", "data": [35, 33, 30, 28, 25, 22], "color": "#3b82f6"}, {"label": "Herausforderer B (%)", "data": [15, 17, 20, 22, 25, 28], "color": "#10b981"}, {"label": "Nischenplayer C (%)", "data": [12, 12, 13, 13, 14, 15], "color": "#f59e0b"}, {"label": "Newcomer D (%)", "data": [0, 2, 5, 8, 12, 16], "color": "#ef4444"}, {"label": "Sonstige (%)", "data": [38, 36, 32, 29, 24, 19], "color": "#6b7280"}]}',
   'Marktanteilsentwicklung 2019-2024',
   'Berechne, wann Herausforderer B den Marktführer A überholt hat. Wie verändert sich der Herfindahl-Index (Marktkonzentration)?',
   'B überholt A in 2023 (beide 25 %) und liegt 2024 vorne (28 % vs. 22 %). Newcomer D wächst am schnellsten (0→16 % in 5 Jahren). Die „Sonstigen" verlieren massiv (-19 Pkt) – der Markt konsolidiert sich. Der Top-4-Anteil steigt von 62 % auf 81 %. Die Marktstruktur wandelt sich von fragmentiert zu oligopolistisch. A muss dringend reagieren (Innovation, M&A oder Nischenstrategie).',
   true),

  ('hard', 'line',
   'Ein Unternehmen testet drei Preispunkte und misst Absatzmenge und Gesamtumsatz. Analysiere die Preiselastizität und empfehle den optimalen Preis.',
   '{"labels": ["15 €", "20 €", "25 €", "30 €", "35 €", "40 €", "45 €", "50 €"], "datasets": [{"label": "Absatzmenge (Tsd. Stück)", "data": [120, 105, 88, 72, 55, 40, 28, 18], "color": "#3b82f6"}, {"label": "Umsatz (Tsd. €)", "data": [1800, 2100, 2200, 2160, 1925, 1600, 1260, 900], "color": "#10b981"}, {"label": "Deckungsbeitrag (Tsd. €)", "data": [600, 840, 1012, 1080, 1045, 920, 756, 540], "color": "#f59e0b"}]}',
   'Preiselastizitäts-Analyse',
   'Bei welchem Preis wird der Umsatz maximiert? Bei welchem der Deckungsbeitrag? Warum unterscheiden sich die beiden Optima?',
   'Umsatz-Maximum: 25 € (2.200 Tsd. €). Deckungsbeitrags-Maximum: 30 € (1.080 Tsd. €). Die Optima unterscheiden sich, weil bei höherem Preis zwar weniger verkauft wird, aber der Beitrag pro Stück steigt (variable Kosten bleiben gleich). Empfehlung: 30 € – maximiert den Deckungsbeitrag. Umsatzmaximierung (25 €) wäre nur sinnvoll bei Marktanteils-Strategie.',
   true),

  ('hard', 'waterfall',
   'Vergleiche die geplante mit der tatsächlichen Profitabilität. Welche Plan-Abweichungen sind am kritischsten und welche Gegenmaßnahmen empfiehlst du für das nächste Jahr?',
   '{"labels": ["EBIT Plan", "Umsatz-Delta", "Rohstoff-Delta", "Personal-Delta", "Marketing-Delta", "FX-Delta", "Einmaleffekte", "EBIT Ist"], "datasets": [{"label": "Veränderung (Mio €)", "data": [45.0, -8.5, -6.2, -3.1, 2.5, -4.8, -1.5, 23.4], "color": "#ef4444"}]}',
   'Profitabilitätsbrücke: Plan vs. Ist 2024',
   'Berechne die Planabweichung absolut und prozentual. Welche Abweichungen waren vermeidbar und welche extern bedingt?',
   'EBIT-Verfehlung: 21,6 Mio € (-48 % vs. Plan). Extern bedingt: Rohstoff-Delta (-6,2 Mio €) und FX (-4,8 Mio €) = 11,0 Mio €. Intern bedingt: Umsatz-Delta (-8,5 Mio €) und Personal (-3,1 Mio €) = 11,6 Mio €. Marketing hat +2,5 Mio € eingespart (positiv, aber evtl. Ursache für Umsatz-Delta?). Für nächstes Jahr: Rohstoff-Hedging, Personalplanung verschärfen und prüfen ob Marketing-Kürzung den Umsatz belastet hat.',
   true),

  ('hard', 'bar',
   'Vergleiche fünf Produktionsstandorte anhand von vier KPIs gleichzeitig. Welcher Standort performt insgesamt am besten und wo besteht dringender Handlungsbedarf?',
   '{"labels": ["Werk A (DE)", "Werk B (PL)", "Werk C (CN)", "Werk D (US)", "Werk E (MX)"], "datasets": [{"label": "Stückkosten (€)", "data": [12.5, 8.2, 6.8, 14.0, 7.5], "color": "#ef4444"}, {"label": "Qualitätsrate (%)", "data": [98.5, 96.2, 93.8, 97.0, 95.5], "color": "#10b981"}, {"label": "Liefertreue (%)", "data": [95, 92, 88, 97, 90], "color": "#3b82f6"}, {"label": "Auslastung (%)", "data": [82, 91, 95, 68, 88], "color": "#f59e0b"}]}',
   'Standort-Benchmarking: 5 Werke weltweit',
   'Erstelle ein Ranking pro KPI und ein Gesamtranking. Berücksichtige, dass niedrigere Stückkosten besser sind, aber höhere Qualität/Liefertreue/Auslastung.',
   'Gesamtranking: 1. Werk B (PL) – niedrige Kosten (8,2 €), gute Auslastung (91 %), solide Qualität. 2. Werk A (DE) – beste Qualität (98,5 %) und Liefertreue (95 %), aber höchste Kosten (12,5 €). 3. Werk E (MX) – günstig (7,5 €) mit akzeptabler Qualität. Handlungsbedarf: Werk D (US) hat niedrigste Auslastung (68 %) bei höchsten Kosten (14 €) – Restrukturierung oder Schließung prüfen. Werk C (CN) hat die niedrigsten Kosten, aber Qualitäts- und Liefertreue-Probleme.',
   true);
