-- ============================================================

-- Diagramme-Drill v2: Exhibit-Format

-- Neue Spalten (title, exhibits, additional_info, questions),

-- Alt-Cases deaktiviert, 30 neue Cases (15 easy / 15 hard).

-- Exhibit-Stil: Case-Interview-Slides (Tabellen, Charts,

-- Additional Info, 1-2 Fragen mit Musterlösung).

-- Generiert aus charts-content/ via build_sql.py

-- ============================================================

BEGIN;

ALTER TABLE public.chart_cases
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS exhibits jsonb,
  ADD COLUMN IF NOT EXISTS additional_info jsonb,
  ADD COLUMN IF NOT EXISTS questions jsonb;

ALTER TABLE public.chart_cases ALTER COLUMN chart_data DROP NOT NULL;

-- Alt-Cases (V1: ein Freitext-Prompt, keine Fragen/Tabellen) deaktivieren

UPDATE public.chart_cases SET active = false WHERE exhibits IS NULL;

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'table', $T$RetailMax – Exhibit 1$T$, $T$Dein Klient RetailMax betreibt Supermärkte in zwei Formaten. Das Management möchte wissen, welches Format profitabler arbeitet.$T$,
  $J$[{"type": "table", "title": "Kennzahlen je Filialformat", "unit_note": "Ø je Filiale, in Tsd. € pro Jahr", "columns": ["Innenstadt-Filiale", "Stadtrand-Filiale"], "rows": [{"label": "Umsatz", "values": [4800, 6200], "style": "bold"}, {"label": "Wareneinsatz", "values": [3360, 4340], "indent": 1}, {"label": "Personal", "values": [720, 620], "indent": 1}, {"label": "Miete", "values": [480, 250], "indent": 1}, {"label": "Sonstige Kosten", "values": [120, 150], "indent": 1}, {"label": "Operativer Gewinn", "values": [120, 840], "style": "total"}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Wie hoch ist die operative Marge der beiden Formate (in % vom Umsatz)?", "solution": "Innenstadt: 2,5 % (120 von 4.800), Stadtrand: ~13,5 % (840 von 6.200).", "calc": "120 ÷ 4.800 = 0,025 → 2,5 %; 840 ÷ 6.200 ≈ 0,135 → ~13,5 %."}]$J$::jsonb,
  $T$- Beide Formate haben dieselbe Wareneinsatzquote (70 % vom Umsatz) — der Unterschied entsteht bei Personal und vor allem Miete.
- Stadtrand erwirtschaftet 840 Tsd. € operativen Gewinn je Filiale, Innenstadt nur 120 Tsd. € — bei nur ~29 % mehr Umsatz.
- Haupttreiber: fast doppelte Miete (480 vs. 250 Tsd. €) und höhere Personalkosten in der Innenstadt.
- So what: Expansion eher im Stadtrand-Format prüfen bzw. Innenstadt-Mieten neu verhandeln.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'table', $T$CloudWork – Exhibit 1$T$, $T$CloudWork verkauft HR-Software an zwei Kundensegmente. Der Vorstand fragt, wo künftig die Vertriebsressourcen hin sollen.$T$,
  $J$[{"type": "table", "title": "Kundensegmente im Überblick", "unit_note": null, "columns": ["KMU", "Enterprise"], "rows": [{"label": "Anzahl Kunden", "values": [2000, 200]}, {"label": "Ø Umsatz je Kunde (Tsd. € p.a.)", "values": [12, 250]}, {"label": "Gesamtumsatz (Mio. €)", "values": [24, 50], "style": "bold"}, {"label": "Kündigungsquote p.a.", "values": ["18 %", "6 %"]}, {"label": "Ø Akquisekosten je Kunde (Tsd. €)", "values": [3, 75]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Welches Segment trägt mehr zum Gesamtumsatz bei, und wie viel Prozent des Gesamtumsatzes macht es aus?", "solution": "Enterprise: 50 von 74 Mio. € ≈ 68 % des Umsatzes.", "calc": "24 + 50 = 74 Mio. €; 50 ÷ 74 ≈ 0,676 → ~68 %."}]$J$::jsonb,
  $T$- Nur 200 Enterprise-Kunden (~9 % der Kundenbasis) liefern 50 Mio. € — rund 68 % des Umsatzes.
- Enterprise ist zudem deutlich loyaler: 6 % Kündigungsquote vs. 18 % bei KMU.
- KMU heißt: viele Kunden, wenig Umsatz je Kunde, hohe Abwanderung — ein teures Segment.
- So what: Vertriebs- und Wachstumsressourcen zuerst ins Enterprise-Segment lenken.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'table', $T$MaschinenWerk – Exhibit 2$T$, $T$MaschinenWerk fertigt identische Komponenten an zwei Standorten und vergleicht die Stückkosten.$T$,
  $J$[{"type": "table", "title": "Stückkosten je Standort", "unit_note": null, "columns": ["Werk Stuttgart", "Werk Brno"], "rows": [{"label": "Produktionsmenge (Tsd. Stück p.a.)", "values": [120, 80]}, {"label": "Materialkosten je Stück (€)", "values": [42, 41], "indent": 1}, {"label": "Lohnkosten je Stück (€)", "values": [38, 19], "indent": 1}, {"label": "Logistik je Stück (€)", "values": [4, 12], "indent": 1}, {"label": "Gesamtkosten je Stück (€)", "values": [84, 72], "style": "total"}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Um wie viel Prozent sind die Stückkosten in Brno niedriger als in Stuttgart?", "solution": "Rund 14 % niedriger (72 vs. 84 €).", "calc": "84 − 72 = 12 €; 12 ÷ 84 ≈ 0,143 → ~14 %."}]$J$::jsonb,
  $T$- Brno fertigt je Stück 12 € (~14 %) günstiger als Stuttgart.
- Der Vorteil kommt fast komplett aus den Lohnkosten (19 vs. 38 €/Stück) — Material ist praktisch identisch.
- Gegenläufig: Logistik ist in Brno dreimal so teuer (12 vs. 4 €) und frisst einen Teil des Lohnvorteils.
- So what: Bei einer Verlagerung zählt die Netto-Ersparnis; Logistikkosten je Absatzmarkt genauer prüfen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'table', $T$AlpinHotels – Exhibit 1$T$, $T$Eine Hotelgruppe in den Alpen vergleicht ihr Sommer- und Wintergeschäft, um über Investitionen zu entscheiden.$T$,
  $J$[{"type": "table", "title": "Saisonvergleich Zimmergeschäft", "unit_note": null, "columns": ["Sommersaison", "Wintersaison"], "rows": [{"label": "Auslastung", "values": ["58 %", "89 %"]}, {"label": "Ø Zimmerpreis (€/Nacht)", "values": [110, 190]}, {"label": "Verfügbare Zimmernächte (Tsd.)", "values": [90, 90]}, {"label": "Zimmerumsatz (Mio. €)", "values": ["5,7", "15,2"], "style": "bold"}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Wie viel Umsatz pro verfügbarer Zimmernacht macht das Hotel im Winter — und um welchen Faktor liegt das über dem Sommer?", "solution": "Winter: ~169 € je verfügbarer Zimmernacht, Sommer: ~63 € — der Winter liegt beim ~2,7-Fachen.", "calc": "15,2 Mio. ÷ 90 Tsd. ≈ 169 €; 5,7 Mio. ÷ 90 Tsd. ≈ 63 €; 169 ÷ 63 ≈ 2,7."}]$J$::jsonb,
  $T$- Der Winter dominiert klar: 15,2 vs. 5,7 Mio. € Zimmerumsatz bei identischer Kapazität.
- Beide Hebel wirken zugleich: höhere Auslastung (89 % vs. 58 %) UND höherer Preis (190 vs. 110 €).
- Im Sommer stehen 42 % der Zimmernächte leer — viel ungenutzte Kapazität.
- So what: Sommer-Nachfrage gezielt aufbauen (Pakete, Events) oder Kapazität saisonal flexibilisieren.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'bars', $T$AutoNova – Exhibit 1$T$, $T$AutoNova prüft den Einstieg in ein neues Fahrzeugsegment und schaut zunächst auf die Marktvolumina des Vorjahres.$T$,
  $J$[{"type": "bar", "title": "Absatz nach Segment (Vorjahr)", "unit": "Mio. Fahrzeuge", "labels": ["City-Flitzer", "Mittelklasse", "Kompakt-SUV", "Groß-SUV"], "datasets": [{"label": "Absatz", "data": [2.5, 1.0, 2.0, 3.5]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Um welchen Faktor ist das Groß-SUV-Segment größer als die Mittelklasse, und welchen Anteil hat es am Gesamtmarkt?", "solution": "3,5-mal so groß wie die Mittelklasse; ~39 % des Gesamtmarkts (3,5 von 9 Mio.).", "calc": "3,5 ÷ 1,0 = 3,5; Gesamt: 2,5 + 1,0 + 2,0 + 3,5 = 9 Mio.; 3,5 ÷ 9 ≈ 0,39."}]$J$::jsonb,
  $T$- Groß-SUV ist mit 3,5 Mio. Fahrzeugen das mit Abstand größte Segment (~39 % des Markts).
- Die Mittelklasse ist mit 1,0 Mio. das kleinste Segment — weniger als ein Drittel des SUV-Volumens.
- City-Flitzer (2,5) und Kompakt-SUV (2,0) bilden das Mittelfeld.
- So what: Nach Volumen spricht alles für Groß-SUV — als Nächstes Wettbewerbsdichte und Margen je Segment prüfen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'bars', $T$FitFirst – Exhibit 1$T$, $T$Die Fitnesskette FitFirst hat drei Standorttypen und vergleicht die Mitgliederentwicklung seit 2023.$T$,
  $J$[{"type": "bar", "title": "Mitglieder nach Standorttyp", "unit": "Tsd. Mitglieder", "labels": ["City-Studios", "Vorort-Studios", "Premium-Clubs"], "datasets": [{"label": "2023", "data": [45, 30, 10]}, {"label": "2025", "data": [36, 42, 15]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Welcher Standorttyp ist von 2023 auf 2025 prozentual am stärksten gewachsen — und um wie viel Prozent?", "solution": "Premium-Clubs: +50 % (von 10 auf 15 Tsd.). Zum Vergleich: Vorort +40 %, City −20 %.", "calc": "Premium: (15−10) ÷ 10 = 50 %; Vorort: (42−30) ÷ 30 = 40 %; City: (36−45) ÷ 45 = −20 %."}]$J$::jsonb,
  $T$- Gegenläufige Entwicklung: City-Studios verlieren (−20 %), Vorort (+40 %) und Premium (+50 %) wachsen.
- Absolut ist Vorort der größte Gewinner (+12 Tsd. Mitglieder); Premium wächst relativ am stärksten.
- Die Gesamtbasis wächst von 85 auf 93 Tsd. (+~9 %) — das Wachstum verlagert sich aber komplett aus der City heraus.
- So what: Investitions- und Flächenstrategie Richtung Vorort/Premium drehen; Ursachen der City-Abwanderung (Homeoffice?) klären.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'bars', $T$TeleNet – Exhibit 2$T$, $T$Der Telko-Anbieter TeleNet verliert Kunden und hat die Kündigungsgründe des letzten Jahres ausgewertet.$T$,
  $J$[{"type": "bar", "title": "Kündigungsgründe", "unit": "% der Kündigungen", "labels": ["Preis", "Netzqualität", "Service", "Umzug", "Sonstige"], "datasets": [{"label": "Anteil", "data": [38, 27, 17, 10, 8]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Welchen Anteil der Kündigungen könnten Preis- und Service-Maßnahmen zusammen maximal adressieren?", "solution": "55 % (38 % Preis + 17 % Service).", "calc": "38 + 17 = 55."}]$J$::jsonb,
  $T$- Preis ist mit 38 % der dominante Kündigungsgrund, gefolgt von Netzqualität (27 %).
- Preis + Service = 55 % — mehr als die Hälfte der Kündigungen ist durch eigene Maßnahmen adressierbar.
- Umzug (10 %) ist kaum beeinflussbar, Netzqualität nur mit langfristigem Invest.
- So what: Kurzfristig Retention-Angebote und Service-Qualität, parallel Netzausbau in Problemregionen priorisieren.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'bars', $T$PharmaVital – Exhibit 1$T$, $T$PharmaVital möchte seine Wettbewerbsposition im OTC-Markt verstehen. Du siehst die Umsätze der fünf größten Anbieter.$T$,
  $J$[{"type": "bar", "title": "Umsatz Top-5-Anbieter", "unit": "Mio. €", "labels": ["Klient", "Wettb. A", "Wettb. B", "Wettb. C", "Wettb. D"], "datasets": [{"label": "Umsatz", "data": [320, 480, 260, 180, 160]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Wie hoch ist der Marktanteil des Klienten innerhalb dieses Top-5-Felds?", "solution": "~23 % (320 von 1.400 Mio. €).", "calc": "320 + 480 + 260 + 180 + 160 = 1.400; 320 ÷ 1.400 ≈ 0,23."}]$J$::jsonb,
  $T$- Der Klient ist mit 320 Mio. € klare Nr. 2 hinter Wettbewerber A (480 Mio. €, ~34 % des Felds).
- Nach vorne ist A das 1,5-Fache des Klienten; nach hinten liegt B nur 60 Mio. € zurück.
- Die Top 2 vereinen zusammen ~57 % des Wettbewerbsfelds.
- So what: Verstehen, womit A führt (Portfolio, Preis, Vertrieb) — und den Vorsprung auf B absichern.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'trend', $T$StreamNow – Exhibit 1$T$, $T$Der Streaming-Dienst StreamNow zeigt dem Board seine Abonnentenentwicklung der letzten acht Quartale.$T$,
  $J$[{"type": "line", "title": "Abonnenten je Quartal", "unit": "Mio. Abonnenten", "labels": ["Q1/24", "Q2/24", "Q3/24", "Q4/24", "Q1/25", "Q2/25", "Q3/25", "Q4/25"], "datasets": [{"label": "Abonnenten", "data": [4.2, 4.6, 5.1, 5.5, 5.8, 6.0, 6.1, 6.2]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Wie hat sich das Quartalswachstum entwickelt? Vergleiche den Zuwachs am Anfang und am Ende des Zeitraums.", "solution": "Das Wachstum flacht stark ab: Anfangs +0,4 Mio. pro Quartal (~10 %), zuletzt nur noch +0,1 Mio. (~2 %).", "calc": "Q1→Q2/24: 4,6 − 4,2 = +0,4 (≈ 10 %); Q3→Q4/25: 6,2 − 6,1 = +0,1 (≈ 2 %)."}]$J$::jsonb,
  $T$- Abonnenten wachsen in zwei Jahren von 4,2 auf 6,2 Mio. (+~48 %) — aber das Wachstum verlangsamt sich Quartal für Quartal.
- Der Zuwachs fällt von +0,4 auf +0,1 Mio. je Quartal: klare Sättigungstendenz.
- Ohne neue Impulse droht Stagnation knapp über 6 Mio.
- So what: Neue Wachstumshebel prüfen (Märkte, Preismodelle, Content) oder den Fokus auf Umsatz je Nutzer verschieben.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'trend', $T$ModeMonde – Exhibit 1$T$, $T$Der Online-Modehändler ModeMonde beobachtet seine Retourenquote über das letzte Jahr.$T$,
  $J$[{"type": "line", "title": "Retourenquote je Monat", "unit": "% der Bestellungen", "labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], "datasets": [{"label": "Retourenquote", "data": [22, 21, 23, 22, 24, 26, 28, 31, 33, 34, 36, 38]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Um wie viele Prozentpunkte ist die Retourenquote über das Jahr gestiegen — und was heißt das relativ?", "solution": "+16 Prozentpunkte (von 22 % auf 38 %), relativ ein Anstieg um ~73 %.", "calc": "38 − 22 = 16 Prozentpunkte; 16 ÷ 22 ≈ 0,73."}]$J$::jsonb,
  $T$- Die Retourenquote steigt fast durchgehend von 22 % auf 38 % (+16 Prozentpunkte).
- Ab Juni beschleunigt sich der Anstieg deutlich — mögliche Treiber: Sortimentswechsel, neue Kundengruppen, großzügigere Retourenregeln.
- Jede Retoure kostet Marge (Logistik, Aufbereitung, Abschriften) — der Trend ist ein direktes Ergebnisrisiko.
- So what: Retouren nach Kategorie/Kundengruppe segmentieren und gezielt gegensteuern (Größenberatung, Fotos, ggf. Gebühren).$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'trend', $T$OmniRetail – Exhibit 1$T$, $T$OmniRetail verkauft über Filialen und einen Online-Shop. Das Management will wissen, wohin sich der Umsatzmix bewegt.$T$,
  $J$[{"type": "line", "title": "Umsatz nach Kanal", "unit": "Mio. €", "labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"], "datasets": [{"label": "Filialen", "data": [20, 19, 19, 18, 17, 16]}, {"label": "Online", "data": [10, 11, 12, 13, 14, 15]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Wie haben sich beide Kanäle im Halbjahr entwickelt, und wann kreuzen sie sich, wenn die Trends anhalten?", "solution": "Online +50 % (10 → 15 Mio. €), Filialen −20 % (20 → 16). Bei +1/−~1 Mio. € pro Monat kreuzen sich die Linien im Juli.", "calc": "Online: (15−10) ÷ 10 = +50 %; Filiale: (16−20) ÷ 20 = −20 %; Lücke im Juni: 1 Mio. € bei gegenläufigen Trends → Kreuzung im Folgemonat."}]$J$::jsonb,
  $T$- Klarer Kanal-Shift: Online wächst stetig (+1 Mio. €/Monat, +50 % seit Januar), Filialen schrumpfen (−20 %).
- Der Gesamtumsatz bleibt fast konstant (30 → 31 Mio. €) — es ist Verlagerung, kein Wachstum.
- Bei anhaltendem Trend überholt Online die Filialen im Juli.
- So what: Kostenstruktur an den Shift anpassen (Filialnetz, Fulfillment-Kapazität) statt beide Kanäle unverändert weiterzufahren.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'share', $T$FoodExpress – Exhibit 1$T$, $T$Der Lieferdienst FoodExpress analysiert, zu welchen Tageszeiten sein Umsatz entsteht, um Fahrerkapazitäten zu planen.$T$,
  $J$[{"type": "pie", "title": "Umsatz nach Tageszeit", "unit": "Mio. € p.a.", "labels": ["Mittag (11–14 Uhr)", "Nachmittag", "Abend (18–22 Uhr)", "Nacht"], "datasets": [{"label": "Umsatz", "data": [7.2, 2.4, 12, 2.4]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Welche zwei Zeitfenster machen zusammen 80 % des Umsatzes aus?", "solution": "Abend (12 Mio. €, 50 %) und Mittag (7,2 Mio. €, 30 %) — zusammen 19,2 von 24 Mio. € = 80 %.", "calc": "Gesamt: 7,2 + 2,4 + 12 + 2,4 = 24 Mio. €; (12 + 7,2) ÷ 24 = 0,8."}]$J$::jsonb,
  $T$- Das Geschäft konzentriert sich auf zwei Peaks: Abend (50 %) und Mittag (30 %) — zusammen 80 % des Umsatzes.
- Nachmittag und Nacht sind mit je 10 % Randzeiten.
- Fahrer- und Küchenkapazität müssen auf die Peaks ausgelegt werden; dazwischen droht Leerlauf.
- So what: Peak-Kapazität optimieren und Randzeiten mit Aktionen füllen — oder Servicezeiten straffen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'share', $T$BauTrend – Exhibit 2$T$, $T$Das Bauunternehmen BauTrend vergleicht seinen Umsatzmix von 2023 und 2025.$T$,
  $J$[{"type": "stacked_bar", "title": "Umsatz nach Sparte", "unit": "Mio. €", "labels": ["2023", "2025"], "datasets": [{"label": "Neubau", "data": [60, 55]}, {"label": "Sanierung", "data": [30, 45]}, {"label": "Service & Wartung", "data": [10, 20]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Wie stark ist der Gesamtumsatz gewachsen, und welche Sparte hat am meisten dazu beigetragen?", "solution": "+20 Mio. € (100 → 120, +20 %); größter Treiber ist die Sanierung mit +15 Mio. €.", "calc": "2023: 60+30+10 = 100; 2025: 55+45+20 = 120; Deltas: Sanierung +15, Service +10, Neubau −5."}]$J$::jsonb,
  $T$- Wachstum von +20 % kommt komplett aus Sanierung (+15 Mio. €) und Service (+10) — der Neubau schrumpft (−5).
- Der Mix dreht sich: Neubau-Anteil fällt von 60 % auf ~46 %.
- Sanierung und Service sind typischerweise margenstärker und konjunkturrobuster als Neubau.
- So what: Kapazitäten und Vertrieb aktiv in Richtung Sanierung/Service verschieben.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'combo', $T$CityBike – Exhibit 1$T$, $T$Der Bike-Sharing-Anbieter CityBike wächst bei den Fahrten, aber der Finanzchef ist unsicher, was beim Umsatz ankommt.$T$,
  $J$[{"type": "bar", "title": "Anzahl Fahrten", "unit": "Tsd. Fahrten", "labels": ["2023", "2024", "2025"], "datasets": [{"label": "Fahrten", "data": [480, 600, 690]}]}, {"type": "bar", "title": "Ø Umsatz je Fahrt", "unit": "€", "labels": ["2023", "2024", "2025"], "datasets": [{"label": "Umsatz je Fahrt", "data": [2.6, 2.4, 2.2]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Wie hat sich der Gesamtumsatz von 2023 auf 2025 entwickelt?", "solution": "Von ~1,25 auf ~1,52 Mio. € gestiegen (+~22 %) — das Mengenwachstum überkompensiert den Preisverfall.", "calc": "2023: 480 Tsd. × 2,60 € ≈ 1,25 Mio. €; 2025: 690 Tsd. × 2,20 € ≈ 1,52 Mio. €; +0,27 ÷ 1,25 ≈ +22 %."}]$J$::jsonb,
  $T$- Fahrten +44 % (480 → 690 Tsd.), aber Umsatz je Fahrt −15 % (2,60 → 2,20 €).
- Netto wächst der Umsatz um ~22 % — Menge schlägt (noch) Preis.
- Den Preisverfall je Fahrt verstehen: Rabatte, Abo-Mix, kürzere Fahrten?
- So what: Monetarisierung je Fahrt stabilisieren — sonst braucht jedes Umsatzwachstum immer mehr Volumen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('easy', 'combo', $T$KaffeeKult – Exhibit 2$T$, $T$Die Café-Kette KaffeeKult vergleicht ihre drei Regionen nach Umsatz und Kundenzufriedenheit.$T$,
  $J$[{"type": "bar", "title": "Umsatz je Region", "unit": "Mio. €", "labels": ["Nord", "West", "Süd"], "datasets": [{"label": "Umsatz", "data": [18, 26, 16]}]}, {"type": "bar", "title": "Net Promoter Score je Region", "unit": "NPS-Punkte", "labels": ["Nord", "West", "Süd"], "datasets": [{"label": "NPS", "data": [12, 45, 38]}]}]$J$::jsonb,
  NULL,
  $J$[{"text": "Welche Region fällt im Verhältnis von Umsatz und Zufriedenheit aus dem Rahmen — und wie ordnest du das ein?", "solution": "Nord: solider Umsatz (18 Mio. €), aber mit Abstand schlechtester NPS (12) — dieser Umsatz ist mittelfristig gefährdet.", "calc": "Panel-Vergleich: West führt bei beidem (26 Mio. € / NPS 45); Süd hat den kleinsten Umsatz, aber guten NPS (38); Nord kombiniert mittleren Umsatz mit sehr niedrigem NPS."}]$J$::jsonb,
  $T$- West ist die stärkste Region: höchster Umsatz (26 Mio. €) UND höchster NPS (45).
- Nord fällt ab: NPS von nur 12 bei 18 Mio. € Umsatz — Unzufriedenheit gefährdet den künftigen Umsatz.
- Süd: kleinster Umsatz, aber zufriedene Kunden — hier liegt Wachstumspotenzial.
- So what: In Nord Ursachen beheben (Service, Standorte), in Süd Expansion prüfen, West als Benchmark nutzen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'table', $T$TechnoPart – Exhibit 2$T$, $T$Dein Klient prüft die Übernahme eines von zwei Elektronikzulieferern. Beide Kandidaten liegen dir mit ihrer aktuellen Ergebnisrechnung vor.$T$,
  $J$[{"type": "table", "title": "Ergebnisrechnung der Kandidaten (letztes Geschäftsjahr)", "unit_note": "Alle Zahlen in Mio. €", "columns": ["Kandidat A (Frankreich)", "Kandidat B (Polen)"], "rows": [{"label": "Umsatz", "values": [70, 85], "style": "bold"}, {"label": "Variable Kosten", "values": [10, 11.5], "style": "bold"}, {"label": "Rohmaterial", "values": [7.5, 8.5], "indent": 1}, {"label": "Transport", "values": [1.5, 2.0], "indent": 1}, {"label": "Energie", "values": [1.0, 1.0], "indent": 1}, {"label": "Fixkosten", "values": [55, 50.5], "style": "bold"}, {"label": "Produktion (Personal)", "values": [42, 33.5], "indent": 1}, {"label": "Forschung & Entwicklung", "values": [10, 15], "indent": 1}, {"label": "Vertrieb & Verwaltung", "values": [3, 2], "indent": 1}, {"label": "Operativer Gewinn", "values": [5, 23], "style": "total"}]}]$J$::jsonb,
  $J$["Variable Kosten sind seit Jahren stabil und dürften es bleiben (langfristige Lieferverträge).", "Fixkosten steigen seit fünf Jahren langsam, aber stetig — es gab weder Personalauf- noch -abbau."]$J$::jsonb,
  $J$[{"text": "Wie hoch ist die operative Marge beider Kandidaten?", "solution": "Kandidat A: ~7 % (5 von 70), Kandidat B: ~27 % (23 von 85).", "calc": "5 ÷ 70 ≈ 7,1 %; 23 ÷ 85 ≈ 27,1 %."}, {"text": "Angenommen, Kandidat A senkt seine Produktions-Personalkosten je Umsatz-Euro auf das Niveau von B. Wie viel zusätzlicher Gewinn entsteht?", "solution": "Rund 14–15 Mio. € Ersparnis — der operative Gewinn stiege von 5 auf ~19–20 Mio. €.", "calc": "B: 33,5 ÷ 85 ≈ 39 % Produktionskosten vom Umsatz; A heute: 42 ÷ 70 = 60 %. A bei 39 %: 70 × 0,39 ≈ 27,5 Mio. € → Ersparnis 42 − 27,5 ≈ 14,5 Mio. €."}]$J$::jsonb,
  $T$- B ist deutlich profitabler: ~27 % operative Marge vs. ~7 % bei A — bei fast gleicher variabler Kostenquote (~14 %).
- Der Unterschied liegt fast vollständig im Produktions-Personal: 42 vs. 33,5 Mio. € — und das bei weniger Umsatz von A.
- B investiert mehr in F&E (15 vs. 10 Mio. €) und kauft sich damit Zukunftsfähigkeit.
- So what: B ist das gesündere Asset; A wäre eine Restrukturierungs-Wette auf die Produktionskosten.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'table', $T$MetroBus – Exhibit 2$T$, $T$Eine Stadt lässt die Kostenprojektion ihres ÖPNV-Systems prüfen. Externe Effekte könnten die Planung deutlich verändern.$T$,
  $J$[{"type": "table", "title": "Kostenprojektion ÖPNV (nächstes Jahr)", "unit_note": "in Mio. € p.a.", "columns": ["Mio. € p.a."], "rows": [{"label": "Gesamtkosten", "values": [1000], "style": "total"}, {"label": "Busse", "values": [750], "style": "bold"}, {"label": "Wartung", "values": [150], "indent": 1}, {"label": "Kraftstoff", "values": [250], "indent": 1}, {"label": "Fahrer", "values": [280], "indent": 1}, {"label": "Sonstige", "values": [70], "indent": 1}, {"label": "U-Bahn", "values": [250], "style": "bold"}, {"label": "Wartung", "values": [60], "indent": 1}, {"label": "Strom", "values": [80], "indent": 1}, {"label": "Fahrer", "values": [70], "indent": 1}, {"label": "Sonstige", "values": [40], "indent": 1}]}]$J$::jsonb,
  $J$["Kraftstoffkosten Busse = 500 Mio. km × 0,5 l/km × 1,00 €/Liter Diesel.", "Neue Prognose: Dieselpreis −20 %, Strompreis −10 % gegenüber der Projektion.", "Geplantes Nachtfahrverbot: Bus-Kilometer −10 % und Bus-Fahrerkosten −10 % (nur Busse betroffen)."]$J$::jsonb,
  $J$[{"text": "Um wie viel sinken die Kraftstoffkosten der Busse durch den niedrigeren Dieselpreis UND die 10 % weniger Kilometer zusammen?", "solution": "Auf 180 Mio. € — eine Ersparnis von 70 Mio. € (−28 %).", "calc": "250 × 0,8 (Preis) × 0,9 (Menge) = 180; 250 − 180 = 70."}, {"text": "Wie hoch sind die Gesamtkosten nach allen drei Effekten (Diesel, Strom, Nachtfahrverbot)?", "solution": "~894 Mio. € statt 1.000 (Busse 652 + U-Bahn 242) — rund −11 %.", "calc": "Busse: 150 + 180 (Kraftstoff) + 252 (Fahrer: 280 × 0,9) + 70 = 652; U-Bahn: 60 + 72 (Strom: 80 × 0,9) + 70 + 40 = 242; Summe 894."}]$J$::jsonb,
  $T$- Busse dominieren die Kosten: 750 von 1.000 Mio. € (75 %); größte Blöcke sind Fahrer (280) und Kraftstoff (250).
- Die drei Effekte wirken fast nur auf die Bus-Seite; die U-Bahn ist mit −8 Mio. € kaum betroffen.
- Gesamtersparnis ~106 Mio. € (−11 %), davon allein 70 Mio. € beim Kraftstoff (Preis- und Mengeneffekt multiplizieren sich).
- So what: Energiepreise absichern (Hedging) und Fahrplan-/Kilometeroptimierung sind die stärksten Hebel; Wartung und Sonstige separat angehen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'table', $T$RegioBank – Exhibit 3$T$, $T$Eine Regionalbank überprüft ihre drei Kundensegmente und diskutiert ein Digitalisierungsprogramm im Privatkundengeschäft.$T$,
  $J$[{"type": "table", "title": "Segmentübersicht Privat- und Geschäftskunden", "unit_note": null, "columns": ["Retail", "Premium", "Business"], "rows": [{"label": "Kunden (Tsd.)", "values": [400, 60, 40]}, {"label": "Ertrag je Kunde (€ p.a.)", "values": [180, 950, 1400]}, {"label": "Kosten je Kunde (€ p.a.)", "values": [150, 520, 700]}, {"label": "Ergebnis je Kunde (€ p.a.)", "values": [30, 430, 700], "style": "total"}]}]$J$::jsonb,
  $J$["Digitalisierungsprogramm: senkt die Kosten je Retail-Kunde um 40 €, kostet aber 12 Mio. € p.a. (Abschreibung + Betrieb).", "Premium wächst ~5 % p.a., Retail schrumpft ~2 % p.a."]$J$::jsonb,
  $J$[{"text": "Welches Segment liefert heute das höchste Gesamtergebnis?", "solution": "Business mit 28 Mio. € (Premium 25,8 Mio. €, Retail 12 Mio. €).", "calc": "Kunden × Ergebnis je Kunde: 40 Tsd. × 700 € = 28 Mio. €; 60 Tsd. × 430 € = 25,8 Mio. €; 400 Tsd. × 30 € = 12 Mio. €."}, {"text": "Lohnt sich das Digitalisierungsprogramm im Retail-Segment?", "solution": "Ja, knapp: 16 Mio. € Ersparnis vs. 12 Mio. € Programmkosten → +4 Mio. € p.a. (Retail-Ergebnis +33 %). Bei schrumpfender Retail-Basis sinkt der Nutzen allerdings jedes Jahr.", "calc": "400 Tsd. Kunden × 40 € = 16 Mio. € Ersparnis; 16 − 12 = +4 Mio. € p.a."}]$J$::jsonb,
  $T$- Retail hat die Masse (400 Tsd. Kunden), aber nur 30 € Ergebnis je Kunde — Premium und Business tragen mit 100 Tsd. Kunden ~82 % des Ergebnisses (53,8 von 65,8 Mio. €).
- Business ist das wertvollste Segment (700 € je Kunde, 28 Mio. € gesamt).
- Wachstum liegt im Premium-Segment (+5 % p.a.), Retail schrumpft — die Schere öffnet sich weiter.
- So what: Ressourcen Richtung Premium/Business; Retail nur mit konsequenter Kostensenkung (Digitalisierung, +4 Mio. € p.a.) weiterführen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'table', $T$ShopRocket – Exhibit 2$T$, $T$Der E-Commerce-Händler ShopRocket verkauft über die eigene Website und einen großen Marktplatz. Der CFO will die Kanäle ehrlich vergleichen.$T$,
  $J$[{"type": "table", "title": "Unit Economics je Bestellung", "unit_note": "in € je Bestellung", "columns": ["Eigene Website", "Marktplatz"], "rows": [{"label": "Ø Warenkorb", "values": [80, 60], "style": "bold"}, {"label": "Wareneinsatz", "values": [44, 33], "indent": 1}, {"label": "Versand & Fulfillment", "values": [8, 9], "indent": 1}, {"label": "Marketing bzw. Marktplatz-Gebühr", "values": [16, 9], "indent": 1}, {"label": "Deckungsbeitrag je Bestellung", "values": [12, 9], "style": "total"}]}]$J$::jsonb,
  $J$["Bestellungen p.a.: Website 1,5 Mio., Marktplatz 2,5 Mio.", "Retourenquote: Website 25 %, Marktplatz 45 %. Retouren sind oben NICHT enthalten und kosten je Retoure 10 € (Website) bzw. 12 € (Marktplatz).", "Die Marktplatz-Gebühr steigt nächstes Jahr von 15 % auf 18 % des Warenkorbs."]$J$::jsonb,
  $J$[{"text": "Wie hoch ist der Deckungsbeitrag je Bestellung NACH Retourenkosten in beiden Kanälen?", "solution": "Website: 9,50 €, Marktplatz: 3,60 € je Bestellung.", "calc": "Website: 12 − 25 % × 10 € = 12 − 2,50 = 9,50 €; Marktplatz: 9 − 45 % × 12 € = 9 − 5,40 = 3,60 €."}, {"text": "Was passiert mit dem Marktplatz-Deckungsbeitrag (nach Retouren), wenn die Gebühr auf 18 % steigt?", "solution": "Er halbiert sich auf 1,80 € je Bestellung.", "calc": "Mehrkosten: 60 € Warenkorb × 3 Prozentpunkte = 1,80 €; 3,60 − 1,80 = 1,80 €."}]$J$::jsonb,
  $T$- Website-Bestellungen sind je Stück deutlich wertvoller: DB 12 vs. 9 € — nach Retouren wächst der Abstand auf 9,50 vs. 3,60 €.
- Der Marktplatz bringt Volumen (2,5 vs. 1,5 Mio. Bestellungen), aber 45 % Retouren und Gebühren fressen die Marge.
- Gesamt-DB nach Retouren: Website ~14,3 Mio. €, Marktplatz ~9 Mio. € — trotz 67 % mehr Bestellungen.
- So what: Kanal-Mix Richtung Website steuern, Marktplatz-Konditionen verhandeln oder dort auf retourenarme Artikel fokussieren — die Gebührenerhöhung macht den Kanal sonst fast wertlos.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'bars', $T$SolarTech – Exhibit 1$T$, $T$Der Modulhersteller SolarTech boomt — aber der COO warnt, dass die Produktion nicht hinterherkommt.$T$,
  $J$[{"type": "bar", "title": "Auftragseingang vs. Produktionskapazität", "unit": "MW", "labels": ["2023", "2024", "2025"], "datasets": [{"label": "Auftragseingang", "data": [400, 700, 1100]}, {"label": "Produktionskapazität", "data": [500, 650, 800]}]}]$J$::jsonb,
  $J$["Kapazitätsausbau von +150 MW pro Jahr ist bereits beschlossen (in den Zahlen enthalten).", "Nicht bediente Aufträge wandern in der Regel zum Wettbewerb ab (keine Warteliste).", "Deckungsbeitrag: ~120 Tsd. € je MW."]$J$::jsonb,
  $J$[{"text": "Wie groß ist die Kapazitätslücke 2025, und wie viel Deckungsbeitrag entgeht dadurch?", "solution": "300 MW Lücke (1.100 vs. 800) → ~36 Mio. € entgangener Deckungsbeitrag.", "calc": "1.100 − 800 = 300 MW; 300 × 120 Tsd. € = 36 Mio. €."}, {"text": "Reicht das beschlossene Ausbautempo (+150 MW p.a.), wenn die Nachfrage weiter um ~400 MW p.a. wächst?", "solution": "Nein — die Lücke wächst jedes Jahr um ~250 MW; 2026 wären es bereits ~550 MW.", "calc": "Lücken-Delta p.a.: 400 − 150 = 250 MW; Lücke 2025: 300 → 2026: ~550 MW."}]$J$::jsonb,
  $T$- Die Nachfrage wächst viel schneller als die Kapazität: Aufträge +175 % in zwei Jahren (400 → 1.100 MW), Kapazität nur +60 % (500 → 800).
- 2023 gab es noch Überkapazität (+100 MW); seit 2024 dreht das Bild — 2025 fehlen 300 MW.
- Entgangener Deckungsbeitrag 2025: ~36 Mio. €, Tendenz stark steigend.
- So what: Ausbau beschleunigen (Capex, Partner, Lohnfertigung) und/oder Preise erhöhen, um die knappe Kapazität besser zu monetarisieren.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'bars', $T$ChemCore – Exhibit 2$T$, $T$Der Chemiekonzern ChemCore vergleicht die Herstellkosten seiner vier Werke mit dem Wettbewerb.$T$,
  $J$[{"type": "bar", "title": "Herstellkosten je Tonne nach Werk", "unit": "€ je Tonne", "labels": ["Werk A", "Werk B", "Werk C", "Werk D"], "datasets": [{"label": "Herstellkosten", "data": [410, 380, 520, 450]}]}]$J$::jsonb,
  $J$["Benchmark effizienter Wettbewerber: ~390 € je Tonne.", "Jahresmengen: A 250, B 300, C 80, D 170 Tsd. Tonnen.", "Werk C läuft mit nur 60 % Auslastung; ~50 % seiner Kosten sind fix."]$J$::jsonb,
  $J$[{"text": "Wie hoch sind die gewichteten Durchschnittskosten je Tonne über alle vier Werke?", "solution": "~418 € je Tonne (gewichtet über 800 Tsd. Tonnen) — über dem Benchmark von 390 €.", "calc": "(250×410 + 300×380 + 80×520 + 170×450) ÷ 800 = 334.600 ÷ 800 ≈ 418 €."}, {"text": "Werk C soll von 80 auf 120 Tsd. Tonnen ausgelastet werden. Was passiert grob mit den Stückkosten dort (50 % Fixkostenanteil)?", "solution": "Sie fallen um ~17 % auf ~433 € je Tonne, weil sich der Fixkostenblock auf 50 % mehr Menge verteilt.", "calc": "Fix heute: 50 % × 520 = 260 €/t × 80 Tsd. t = 20,8 Mio. €; bei 120 Tsd. t: 20,8 ÷ 120 ≈ 173 €/t; plus 260 €/t variabel ≈ 433 €/t."}]$J$::jsonb,
  $T$- Große Spannweite: 380 (Werk B) bis 520 €/t (Werk C) — fast 37 % Unterschied zwischen bestem und schlechtestem Werk.
- Nur Werk B schlägt den Wettbewerbs-Benchmark (390 €/t); der gewichtete Schnitt liegt mit ~418 €/t darüber.
- Werk C ist klein UND schlecht ausgelastet — der klassische Fixkosten-Nachteil.
- So what: Werk C besser auslasten (oder Produktion verlagern/schließen) und Best Practices von B auf A und D übertragen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'bars', $T$ConsultPro – Exhibit 3$T$, $T$Die Beratung ConsultPro verliert auffällig viele Mitarbeitende und vergleicht ihre Fluktuation mit dem Branchenschnitt.$T$,
  $J$[{"type": "bar", "title": "Freiwillige Fluktuation nach Karrierestufe", "unit": "% pro Jahr", "labels": ["Analyst", "Consultant", "Manager", "Partner"], "datasets": [{"label": "Klient", "data": [22, 28, 12, 4]}, {"label": "Branchenschnitt", "data": [18, 19, 10, 5]}]}]$J$::jsonb,
  $J$["Wiederbesetzungskosten: ~1,5 Jahresgehälter je Abgang auf Consultant-Level (Ø-Gehalt: 90 Tsd. €).", "Consultant-Headcount: 200 Personen.", "Exit-Interviews nennen auf Consultant-Level vor allem Arbeitsbelastung und fehlende Beförderungsperspektive."]$J$::jsonb,
  $J$[{"text": "Wie viele Consultant-Abgänge pro Jahr gehen über das Branchenniveau hinaus, und was kosten sie?", "solution": "18 zusätzliche Abgänge p.a. (9 Prozentpunkte × 200 Köpfe) — Kosten ~2,4 Mio. € pro Jahr.", "calc": "28 % − 19 % = 9 Pp.; 9 % × 200 = 18 Abgänge; 18 × 1,5 × 90 Tsd. € = 2,43 Mio. €."}, {"text": "Auf welche Karrierestufe sollte ein Retention-Programm zuerst zielen — und warum?", "solution": "Auf das Consultant-Level: größte Lücke zur Branche (+9 Pp.), hohe Kosten je Abgang und klar adressierbare Gründe (Workload, Beförderungspfade).", "calc": "Abweichung vom Branchenschnitt: Analyst +4 Pp., Consultant +9 Pp., Manager +2 Pp., Partner −1 Pp."}]$J$::jsonb,
  $T$- Die Fluktuation liegt auf fast allen Stufen über Branche; der Ausreißer ist das Consultant-Level: 28 % vs. 19 %.
- Partner sind stabil (4 %, sogar unter Branche) — das Problem sitzt im Mittelbau, der das Delivery-Geschäft trägt.
- Allein die Überschuss-Fluktuation der Consultants kostet ~2,4 Mio. € p.a. — ohne Projektausfälle und Know-how-Verlust.
- So what: Retention-Programm für Consultants (Workload-Steuerung, transparente Beförderung) hat den schnellsten Payback.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'bars', $T$GlowUp – Exhibit 1$T$, $T$Die D2C-Kosmetikmarke GlowUp gewinnt Neukunden über vier Marketingkanäle und hinterfragt ihre Budgetverteilung.$T$,
  $J$[{"type": "bar", "title": "Neukunden je Kanal (letztes Jahr)", "unit": "Tsd. Neukunden", "labels": ["SEO", "Paid Social", "TV", "Affiliate"], "datasets": [{"label": "Neukunden", "data": [24, 40, 16, 20]}]}]$J$::jsonb,
  $J$["Budget je Kanal: SEO 1,2 Mio. €, Paid Social 6,0 Mio. €, TV 4,0 Mio. €, Affiliate 1,6 Mio. €.", "Ø Deckungsbeitrag je Neukunde im ersten Jahr: 90 €.", "SEO ist kurzfristig kaum skalierbar; Paid Social und TV lassen sich frei skalieren."]$J$::jsonb,
  $J$[{"text": "Berechne die Akquisekosten (CAC) je Kanal. Welcher Kanal ist am teuersten?", "solution": "TV mit 250 € CAC (SEO 50 €, Affiliate 80 €, Paid Social 150 €).", "calc": "Budget ÷ Neukunden: 1.200 ÷ 24 = 50 €; 6.000 ÷ 40 = 150 €; 4.000 ÷ 16 = 250 €; 1.600 ÷ 20 = 80 €."}, {"text": "Welche Kanäle verdienen schon im ersten Jahr Geld (DB 90 € je Kunde), und wohin würdest du Budget umschichten?", "solution": "Nur SEO (+40 €) und Affiliate (+10 €) sind im ersten Jahr positiv; TV (−160 €) ist am schwächsten. Budget von TV Richtung Affiliate (und SEO bis zur Sättigung) verschieben; Paid Social braucht besseres Targeting oder höheren Kundenwert.", "calc": "DB 90 € − CAC: SEO +40, Affiliate +10, Paid Social −60, TV −160."}]$J$::jsonb,
  $T$- Paid Social bringt die meisten Neukunden (40 Tsd.) — aber Menge ist nicht gleich Effizienz.
- Die CAC-Spanne ist enorm: 50 € (SEO) bis 250 € (TV), Faktor 5.
- Gemessen am Erstjahres-DB von 90 € verbrennen TV und Paid Social zunächst Geld; ihr Payback hängt komplett an der Wiederkaufrate.
- So what: Budget von TV zu Affiliate verschieben, SEO maximal ausschöpfen und den Customer Lifetime Value je Kanal nachschärfen, bevor Paid Social weiter skaliert wird.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'trend', $T$PayFlow – Exhibit 2$T$, $T$Der Zahlungsdienstleister PayFlow wächst seit Jahren — trotzdem ist der CFO mit dem Umsatz unzufrieden.$T$,
  $J$[{"type": "line", "title": "Transaktionsvolumen vs. Umsatz (indexiert, 2019 = 100)", "unit": "Index", "labels": ["2019", "2020", "2021", "2022", "2023", "2024", "2025"], "datasets": [{"label": "Transaktionsvolumen", "data": [100, 118, 140, 165, 195, 230, 270]}, {"label": "Umsatz", "data": [100, 112, 126, 140, 155, 170, 186]}]}]$J$::jsonb,
  $J$["Umsatz = Transaktionsvolumen × Take Rate (Gebührensatz).", "Regulierung und Wettbewerb erzeugen anhaltenden Preisdruck auf die Take Rate."]$J$::jsonb,
  $J$[{"text": "Was ist seit 2019 mit der Take Rate passiert (in %)?", "solution": "Sie ist um ~31 % gefallen: Volumen-Index 270, Umsatz-Index nur 186 → Take-Rate-Index ≈ 69.", "calc": "Take-Rate-Index = Umsatz ÷ Volumen = 186 ÷ 270 ≈ 0,69 → −31 % seit 2019."}, {"text": "Das Volumen wächst weiter mit ~17 % p.a., die Take Rate erodiert um ~4 % p.a. Wie entwickelt sich der Umsatz?", "solution": "Er wächst weiter, aber nur noch mit ~12 % pro Jahr.", "calc": "Umsatzwachstum ≈ 1,17 × 0,96 ≈ 1,12 → ~+12 % p.a."}]$J$::jsonb,
  $T$- Das Volumen hat sich seit 2019 fast verdreifacht (Index 270, ~18 % p.a.), der Umsatz wächst nur auf 186.
- Die Schere heißt Take-Rate-Erosion: kumuliert ~−31 % — Wachstum wird laufend durch Preisdruck aufgezehrt.
- Die Zukunft hängt damit allein an der Menge; jede weitere Gebührensenkung wirkt direkt aufs Topline-Wachstum.
- So what: Monetarisierung diversifizieren (Value-Added Services, Software, FX), statt nur auf Volumen zu setzen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'trend', $T$PackPro – Exhibit 2$T$, $T$Der Verpackungshersteller PackPro leidet unter gestiegenen Rohstoffpreisen und prüft, wie gut er sie an Kunden weitergibt.$T$,
  $J$[{"type": "line", "title": "Einkaufs- vs. Verkaufspreise (indexiert, Q1/24 = 100)", "unit": "Index", "labels": ["Q1/24", "Q2/24", "Q3/24", "Q4/24", "Q1/25", "Q2/25", "Q3/25", "Q4/25"], "datasets": [{"label": "Einkaufspreis-Index", "data": [100, 108, 118, 130, 138, 144, 148, 150]}, {"label": "Verkaufspreis-Index", "data": [100, 102, 105, 109, 114, 120, 127, 135]}]}]$J$::jsonb,
  $J$["Materialkosten machten im Basisquartal 70 % des Umsatzes aus; sonstige Kosten (20 % des Umsatzes) sind weitgehend fix.", "Vertragliche Gleitklauseln: Preisanpassungen an Kunden wirken mit ~2 Quartalen Verzögerung."]$J$::jsonb,
  $J$[{"text": "Die operative Marge lag im Basisquartal bei 10 %. Wo liegt sie im letzten Quartal ungefähr?", "solution": "Bei nur noch ~7,4 %: Der absolute Gewinn bleibt bei 10, aber auf 35 % größerer Umsatzbasis.", "calc": "Basis: 100 − 70 (Material) − 20 (Sonstige) = 10 → 10 %. Q4/25: 135 − 70×1,5 − 20 = 135 − 105 − 20 = 10 → 10 ÷ 135 ≈ 7,4 %."}, {"text": "Die Einkaufspreise bleiben ab jetzt stabil. Was passiert wegen der Gleitklauseln mit der Marge?", "solution": "Die Verkaufspreise ziehen noch ~2 Quartale nach, während der Einkauf stillsteht — die Lücke schließt sich und die Marge erholt sich zeitversetzt Richtung Ausgangsniveau.", "calc": "Verkaufsindex (135) läuft dem Einkaufsindex (150) strukturell ~2 Quartale hinterher; bei stabilem Einkauf holen die nachlaufenden Anpassungen die 15 Indexpunkte weitgehend auf."}]$J$::jsonb,
  $T$- Einkaufspreise +50 % in zwei Jahren, Verkaufspreise nur +35 % — die Lücke von 15 Indexpunkten ist die Margen-Story.
- Die Weitergabe erfolgt strukturell verzögert (~2 Quartale Gleitklauseln); die Lücke war zuletzt am größten.
- Relative Marge fällt von 10 % auf ~7,4 %, obwohl der absolute Gewinn stabil bleibt.
- So what: Gleitklauseln verkürzen bzw. indexieren, Einkauf hedgen und das Sortiment Richtung weniger materialintensiver Produkte entwickeln.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'share', $T$MediaHouse – Exhibit 1$T$, $T$Das Verlagshaus MediaHouse steckt mitten in der Digital-Transformation und schaut auf seinen Umsatzmix.$T$,
  $J$[{"type": "pie", "title": "Umsatzmix (aktuelles Jahr)", "unit": "Mio. €", "labels": ["Print-Anzeigen", "Print-Abos", "Digital-Abos", "Digital-Werbung", "Events"], "datasets": [{"label": "Umsatz", "data": [30, 25, 18, 15, 12]}]}]$J$::jsonb,
  $J$["Wachstum p.a.: Print-Anzeigen −12 %, Print-Abos −6 %, Digital-Abos +25 %, Digital-Werbung +10 %, Events +5 %.", "Bruttomarge: Digital-Abos ~70 %, Print-Geschäft ~35 %."]$J$::jsonb,
  $J$[{"text": "Wie groß ist der Digitalanteil am Umsatz heute — und wie groß in einem Jahr bei den genannten Wachstumsraten?", "solution": "Heute 33 % (33 von 100 Mio. €); in einem Jahr ~38 % (39 von ~101,5 Mio. €).", "calc": "Digital heute: 18 + 15 = 33. In 1 Jahr: 18×1,25 = 22,5 und 15×1,1 = 16,5 → 39; Gesamt: 26,4 + 23,5 + 22,5 + 16,5 + 12,6 = 101,5; 39 ÷ 101,5 ≈ 38 %."}, {"text": "Print-Anzeigen schrumpfen mit −12 % p.a. Wie lange dauert es grob, bis sich dieser Umsatz halbiert?", "solution": "Rund 5–6 Jahre.", "calc": "Faustregel 72: 72 ÷ 12 = 6 Jahre; exakt: 0,88^n = 0,5 → n ≈ 5,4 Jahre."}]$J$::jsonb,
  $T$- Print liefert noch 55 % des Umsatzes, schrumpft aber strukturell (−12 %/−6 % p.a.); Digital (33 %) wächst zweistellig.
- Digital-Abos sind der strategische Kern: +25 % Wachstum UND doppelte Marge (~70 % vs. ~35 %).
- Der Mix kippt schnell: Digitalanteil steigt binnen eines Jahres von 33 % auf ~38 %.
- So what: Den Übergang aktiv managen — Print-Kosten variabilisieren, den Digital-Abo-Funnel skalieren, Events als stabiles Zusatzgeschäft pflegen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'share', $T$AeroLine – Exhibit 2$T$, $T$Die Airline AeroLine verliert Kurzstrecken-Marktanteile an einen Low-Cost-Anbieter und vergleicht die Kostenstrukturen.$T$,
  $J$[{"type": "stacked_bar", "title": "Kosten je Flugstunde (indexiert, Klient = 100)", "unit": "Indexpunkte", "labels": ["Klient", "Low-Cost-Wettbewerber"], "datasets": [{"label": "Treibstoff", "data": [30, 28]}, {"label": "Personal", "data": [25, 15]}, {"label": "Flughafen & Gebühren", "data": [15, 8]}, {"label": "Wartung", "data": [12, 10]}, {"label": "Verwaltung & Vertrieb", "data": [18, 9]}]}]$J$::jsonb,
  $J$["Beide fliegen vergleichbare Kurzstrecken-Netze mit ähnlichem Fluggerät.", "Personal: Der Wettbewerber nutzt eine Einheitsflotte und flexible Tarifverträge.", "Verwaltung & Vertrieb: Der Wettbewerber verkauft über 95 % der Tickets direkt online."]$J$::jsonb,
  $J$[{"text": "Wie groß ist der gesamte Kostenabstand, und in welchem Block liegt der größte absolute Vorteil des Wettbewerbers?", "solution": "30 Indexpunkte (100 vs. 70, also −30 %). Größter Einzelblock: Personal (−10), gefolgt von Verwaltung & Vertrieb (−9) und Gebühren (−7).", "calc": "100 − 70 = 30; Deltas je Block: Treibstoff −2, Personal −10, Gebühren −7, Wartung −2, Verwaltung & Vertrieb −9."}, {"text": "Welche Kostenlücken kann der Klient kurzfristig angehen, welche kaum?", "solution": "Kurzfristig: Verwaltung & Vertrieb (Direktvertrieb ausbauen, bis zu −9 Punkte) und Teile der Gebühren (Flughafen-Mix). Kaum kurzfristig: Personal (Tarifverträge, Flottenstruktur) und Treibstoff (ohnehin fast gleich).", "calc": "Ableitung aus den Zusatzinfos: Online-Direktvertrieb ist eine Vertriebsentscheidung; Tarif- und Flottenstruktur wirken nur mittel- bis langfristig."}]$J$::jsonb,
  $T$- Der Low-Cost-Wettbewerber fliegt ~30 % günstiger (Index 70 vs. 100).
- Die Lücke steckt in drei strukturellen Blöcken: Personal (−10), Verwaltung & Vertrieb (−9), Flughafen-Gebühren (−7) — Treibstoff und Wartung sind fast identisch.
- Das ist ein Geschäftsmodell-Unterschied (Einheitsflotte, Direktvertrieb, Sekundärflughäfen), kein Effizienz-Feintuning.
- So what: Zuerst Direktvertrieb und Flughafen-Mix; die Personalkosten-Lücke schließt nur eine langfristige Struktur-Entscheidung.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'share', $T$WohnBau – Exhibit 3$T$, $T$Der Projektentwickler WohnBau prüft, ob sich Wohnungsneubau überhaupt noch rechnet.$T$,
  $J$[{"type": "stacked_bar", "title": "Projektkosten je Wohnung", "unit": "Tsd. € je Wohnung", "labels": ["2021", "2025"], "datasets": [{"label": "Grundstück", "data": [90, 130]}, {"label": "Bau", "data": [180, 240]}, {"label": "Nebenkosten & Gebühren", "data": [30, 50]}]}]$J$::jsonb,
  $J$["Erzielbarer Verkaufspreis je Wohnung: 2021: 340 Tsd. €, 2025: 430 Tsd. €.", "Ein Förderprogramm könnte die Nebenkosten & Gebühren um 40 % senken."]$J$::jsonb,
  $J$[{"text": "Wie hat sich die Marge je Wohnung von 2021 auf 2025 entwickelt?", "solution": "Eingebrochen: von 40 Tsd. € (~12 % vom Preis) auf 10 Tsd. € (~2 %).", "calc": "2021: 340 − 300 (90+180+30) = 40; 2025: 430 − 420 (130+240+50) = 10."}, {"text": "Was bringt das Förderprogramm für die Marge 2025?", "solution": "+20 Tsd. € je Wohnung — die Marge verdreifacht sich von 10 auf 30 Tsd. € (~7 % vom Preis).", "calc": "50 × 40 % = 20 Tsd. € Ersparnis; 10 + 20 = 30 Tsd. €."}]$J$::jsonb,
  $T$- Projektkosten +40 % in vier Jahren (300 → 420 Tsd. €), Verkaufspreise nur +26 % (340 → 430) — die Schere frisst die Marge.
- Alle drei Blöcke steigen: absolut am stärksten der Bau (+60), relativ am stärksten die Nebenkosten (+67 %).
- Marge je Wohnung bricht von ~12 % auf ~2 % ein — Neubau ist kaum noch wirtschaftlich.
- So what: Förderprogramme konsequent mitnehmen (+20 Tsd. €), Baukosten über serielle Standards senken, Grundstücks-Pipeline neu bewerten.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'combo', $T$VersichertPlus – Exhibit 1$T$, $T$Der Sachversicherer VersichertPlus sieht seine Schadensbilanz kippen und analysiert die Treiber.$T$,
  $J$[{"type": "bar", "title": "Anzahl Schadensfälle", "unit": "Tsd. Fälle", "labels": ["2019", "2022", "2025"], "datasets": [{"label": "Schadensfälle", "data": [40, 46, 52]}]}, {"type": "bar", "title": "Ø Schadenhöhe je Fall", "unit": "Tsd. €", "labels": ["2019", "2022", "2025"], "datasets": [{"label": "Schadenhöhe", "data": [3.0, 3.8, 5.0]}]}]$J$::jsonb,
  $J$["Prämieneinnahmen: 2019: 180 Mio. €, 2025: 260 Mio. €.", "Verwaltungs- und Vertriebskosten: ~20 % der Prämien. Eine Combined Ratio über 100 % bedeutet versicherungstechnischen Verlust."]$J$::jsonb,
  $J$[{"text": "Wie haben sich die gesamten Schadenszahlungen von 2019 auf 2025 entwickelt?", "solution": "Mehr als verdoppelt: von 120 auf 260 Mio. € (+117 %).", "calc": "2019: 40 Tsd. × 3,0 Tsd. € = 120 Mio. €; 2025: 52 × 5,0 = 260 Mio. €."}, {"text": "Wie steht die Sparte 2025 da (Combined Ratio), verglichen mit 2019?", "solution": "2025: ~120 % (Schäden = 100 % der Prämien + ~20 % Kosten) → klarer versicherungstechnischer Verlust. 2019 lag sie noch bei ~87 %.", "calc": "2025: 260 ÷ 260 = 100 % + 20 % = 120 %. 2019: 120 ÷ 180 ≈ 67 % + 20 % ≈ 87 %."}]$J$::jsonb,
  $T$- Doppelter Gegenwind: Fallzahlen +30 % (40 → 52 Tsd.) UND Ø-Schadenhöhe +67 % (3,0 → 5,0 Tsd. €).
- Beide Effekte multiplizieren sich: Schadenszahlungen wachsen auf das 2,2-Fache (120 → 260 Mio. €) — die Prämien nur um +44 %.
- Die Sparte rutscht von ~87 % auf ~120 % Combined Ratio — aus solidem Gewinn wird deutlicher Verlust.
- So what: Prämien risikogerecht anheben, Selbstbehalte und Tarifstruktur anpassen, Schadensteuerung (z.B. Partnerwerkstätten) ausbauen.$T$, true);

INSERT INTO public.chart_cases
  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)
VALUES ('hard', 'combo', $T$GastroGruppe – Exhibit 2$T$, $T$Eine Restaurantgruppe betreibt zwei Konzepte und diskutiert, wohin das Expansionskapital fließen soll.$T$,
  $J$[{"type": "table", "title": "Kennzahlen je Konzept (2025)", "unit_note": null, "columns": ["Casual Dining", "Fine Dining"], "rows": [{"label": "Anzahl Restaurants", "values": [40, 10]}, {"label": "Umsatz je Restaurant (Mio. €)", "values": ["1,2", "2,0"]}, {"label": "EBITDA-Marge", "values": ["12 %", "4 %"], "style": "bold"}]}, {"type": "bar", "title": "EBITDA je Fine-Dining-Restaurant", "unit": "Tsd. €", "labels": ["2023", "2024", "2025"], "datasets": [{"label": "EBITDA je Haus", "data": [200, 130, 80]}]}]$J$::jsonb,
  $J$["Fine-Dining-Kostentreiber: Personalkosten +25 % seit 2023 (Fachkräftemangel).", "Zwei der zehn Fine-Dining-Standorte machen bereits Verlust.", "Das Casual-Konzept ist standardisiert und skaliert über eine Zentralküche."]$J$::jsonb,
  $J$[{"text": "Wie viel EBITDA liefert jedes Konzept 2025 insgesamt?", "solution": "Casual: ~5,8 Mio. € (40 × 1,2 Mio. × 12 %); Fine Dining: 0,8 Mio. € (10 × 2,0 Mio. × 4 %).", "calc": "40 × 1,2 × 0,12 = 5,76 Mio. €; 10 × 2,0 × 0,04 = 0,8 Mio. €."}, {"text": "Der Fine-Dining-Trend (−~60 Tsd. € EBITDA je Haus und Jahr) hält an. Was heißt das für 2026 — und strategisch?", "solution": "EBITDA je Haus fällt Richtung ~20 Tsd. € → die Sparte landet nahe Null bzw. im Verlust. Strategisch: Portfolio bereinigen (Verluststandorte schließen/umflaggen) und das Kapital ins skalierbare Casual-Konzept lenken.", "calc": "Trend: 200 → 130 → 80 (Ø −60 p.a.); 80 − 60 = 20 Tsd. € je Haus × 10 Häuser = 0,2 Mio. € — vor Zentralkosten, mit zwei Häusern bereits im Minus."}]$J$::jsonb,
  $T$- Casual trägt das Ergebnis: ~5,8 von 6,6 Mio. € EBITDA (~88 %) — trotz kleinerer Häuser.
- Fine Dining erodiert schnell: EBITDA je Haus 200 → 80 Tsd. € in zwei Jahren, Haupttreiber Personalkosten (+25 %).
- Der Trend zeigt für 2026 Richtung Null; zwei Standorte sind schon defizitär.
- So what: Fine-Dining-Portfolio bereinigen (schließen, umflaggen, Preise testen) und Expansionskapital ins standardisierte Casual-Konzept geben.$T$, true);

COMMIT;
