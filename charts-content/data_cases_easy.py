# -*- coding: utf-8 -*-
"""15 Einsteiger-Cases (difficulty=easy) für den Diagramme-Drill.
Format je Case:
  chart_type: Kategorie (table|bars|trend|share|combo)
  title:      Exhibit-Titel ("Klient – Exhibit N")
  prompt:     Kontext, 1-2 Sätze
  exhibits:   1-2 Exhibit-Specs (Tabelle oder Chart, s. src/types/charts.ts)
  info:       Additional-Info-Bullets oder None
  questions:  genau 1 Frage {text, solution, calc}
  reference:  Muster-Interpretation (Bullets, \n-getrennt)
Alle Zahlen sind intern konsistent — bei Änderungen Rechenwege mitziehen!
"""

EASY_CASES = [
    # ---------- TABLE (4) ----------
    {
        "chart_type": "table",
        "title": "RetailMax – Exhibit 1",
        "prompt": "Dein Klient RetailMax betreibt Supermärkte in zwei Formaten. Das Management möchte wissen, welches Format profitabler arbeitet.",
        "exhibits": [{
            "type": "table",
            "title": "Kennzahlen je Filialformat",
            "unit_note": "Ø je Filiale, in Tsd. € pro Jahr",
            "columns": ["Innenstadt-Filiale", "Stadtrand-Filiale"],
            "rows": [
                {"label": "Umsatz", "values": [4800, 6200], "style": "bold"},
                {"label": "Wareneinsatz", "values": [3360, 4340], "indent": 1},
                {"label": "Personal", "values": [720, 620], "indent": 1},
                {"label": "Miete", "values": [480, 250], "indent": 1},
                {"label": "Sonstige Kosten", "values": [120, 150], "indent": 1},
                {"label": "Operativer Gewinn", "values": [120, 840], "style": "total"},
            ],
        }],
        "info": None,
        "questions": [{
            "text": "Wie hoch ist die operative Marge der beiden Formate (in % vom Umsatz)?",
            "solution": "Innenstadt: 2,5 % (120 von 4.800), Stadtrand: ~13,5 % (840 von 6.200).",
            "calc": "120 ÷ 4.800 = 0,025 → 2,5 %; 840 ÷ 6.200 ≈ 0,135 → ~13,5 %.",
        }],
        "reference": "- Beide Formate haben dieselbe Wareneinsatzquote (70 % vom Umsatz) — der Unterschied entsteht bei Personal und vor allem Miete.\n- Stadtrand erwirtschaftet 840 Tsd. € operativen Gewinn je Filiale, Innenstadt nur 120 Tsd. € — bei nur ~29 % mehr Umsatz.\n- Haupttreiber: fast doppelte Miete (480 vs. 250 Tsd. €) und höhere Personalkosten in der Innenstadt.\n- So what: Expansion eher im Stadtrand-Format prüfen bzw. Innenstadt-Mieten neu verhandeln.",
    },
    {
        "chart_type": "table",
        "title": "CloudWork – Exhibit 1",
        "prompt": "CloudWork verkauft HR-Software an zwei Kundensegmente. Der Vorstand fragt, wo künftig die Vertriebsressourcen hin sollen.",
        "exhibits": [{
            "type": "table",
            "title": "Kundensegmente im Überblick",
            "unit_note": None,
            "columns": ["KMU", "Enterprise"],
            "rows": [
                {"label": "Anzahl Kunden", "values": [2000, 200]},
                {"label": "Ø Umsatz je Kunde (Tsd. € p.a.)", "values": [12, 250]},
                {"label": "Gesamtumsatz (Mio. €)", "values": [24, 50], "style": "bold"},
                {"label": "Kündigungsquote p.a.", "values": ["18 %", "6 %"]},
                {"label": "Ø Akquisekosten je Kunde (Tsd. €)", "values": [3, 75]},
            ],
        }],
        "info": None,
        "questions": [{
            "text": "Welches Segment trägt mehr zum Gesamtumsatz bei, und wie viel Prozent des Gesamtumsatzes macht es aus?",
            "solution": "Enterprise: 50 von 74 Mio. € ≈ 68 % des Umsatzes.",
            "calc": "24 + 50 = 74 Mio. €; 50 ÷ 74 ≈ 0,676 → ~68 %.",
        }],
        "reference": "- Nur 200 Enterprise-Kunden (~9 % der Kundenbasis) liefern 50 Mio. € — rund 68 % des Umsatzes.\n- Enterprise ist zudem deutlich loyaler: 6 % Kündigungsquote vs. 18 % bei KMU.\n- KMU heißt: viele Kunden, wenig Umsatz je Kunde, hohe Abwanderung — ein teures Segment.\n- So what: Vertriebs- und Wachstumsressourcen zuerst ins Enterprise-Segment lenken.",
    },
    {
        "chart_type": "table",
        "title": "MaschinenWerk – Exhibit 2",
        "prompt": "MaschinenWerk fertigt identische Komponenten an zwei Standorten und vergleicht die Stückkosten.",
        "exhibits": [{
            "type": "table",
            "title": "Stückkosten je Standort",
            "unit_note": None,
            "columns": ["Werk Stuttgart", "Werk Brno"],
            "rows": [
                {"label": "Produktionsmenge (Tsd. Stück p.a.)", "values": [120, 80]},
                {"label": "Materialkosten je Stück (€)", "values": [42, 41], "indent": 1},
                {"label": "Lohnkosten je Stück (€)", "values": [38, 19], "indent": 1},
                {"label": "Logistik je Stück (€)", "values": [4, 12], "indent": 1},
                {"label": "Gesamtkosten je Stück (€)", "values": [84, 72], "style": "total"},
            ],
        }],
        "info": None,
        "questions": [{
            "text": "Um wie viel Prozent sind die Stückkosten in Brno niedriger als in Stuttgart?",
            "solution": "Rund 14 % niedriger (72 vs. 84 €).",
            "calc": "84 − 72 = 12 €; 12 ÷ 84 ≈ 0,143 → ~14 %.",
        }],
        "reference": "- Brno fertigt je Stück 12 € (~14 %) günstiger als Stuttgart.\n- Der Vorteil kommt fast komplett aus den Lohnkosten (19 vs. 38 €/Stück) — Material ist praktisch identisch.\n- Gegenläufig: Logistik ist in Brno dreimal so teuer (12 vs. 4 €) und frisst einen Teil des Lohnvorteils.\n- So what: Bei einer Verlagerung zählt die Netto-Ersparnis; Logistikkosten je Absatzmarkt genauer prüfen.",
    },
    {
        "chart_type": "table",
        "title": "AlpinHotels – Exhibit 1",
        "prompt": "Eine Hotelgruppe in den Alpen vergleicht ihr Sommer- und Wintergeschäft, um über Investitionen zu entscheiden.",
        "exhibits": [{
            "type": "table",
            "title": "Saisonvergleich Zimmergeschäft",
            "unit_note": None,
            "columns": ["Sommersaison", "Wintersaison"],
            "rows": [
                {"label": "Auslastung", "values": ["58 %", "89 %"]},
                {"label": "Ø Zimmerpreis (€/Nacht)", "values": [110, 190]},
                {"label": "Verfügbare Zimmernächte (Tsd.)", "values": [90, 90]},
                {"label": "Zimmerumsatz (Mio. €)", "values": ["5,7", "15,2"], "style": "bold"},
            ],
        }],
        "info": None,
        "questions": [{
            "text": "Wie viel Umsatz pro verfügbarer Zimmernacht macht das Hotel im Winter — und um welchen Faktor liegt das über dem Sommer?",
            "solution": "Winter: ~169 € je verfügbarer Zimmernacht, Sommer: ~63 € — der Winter liegt beim ~2,7-Fachen.",
            "calc": "15,2 Mio. ÷ 90 Tsd. ≈ 169 €; 5,7 Mio. ÷ 90 Tsd. ≈ 63 €; 169 ÷ 63 ≈ 2,7.",
        }],
        "reference": "- Der Winter dominiert klar: 15,2 vs. 5,7 Mio. € Zimmerumsatz bei identischer Kapazität.\n- Beide Hebel wirken zugleich: höhere Auslastung (89 % vs. 58 %) UND höherer Preis (190 vs. 110 €).\n- Im Sommer stehen 42 % der Zimmernächte leer — viel ungenutzte Kapazität.\n- So what: Sommer-Nachfrage gezielt aufbauen (Pakete, Events) oder Kapazität saisonal flexibilisieren.",
    },

    # ---------- BARS (4) ----------
    {
        "chart_type": "bars",
        "title": "AutoNova – Exhibit 1",
        "prompt": "AutoNova prüft den Einstieg in ein neues Fahrzeugsegment und schaut zunächst auf die Marktvolumina des Vorjahres.",
        "exhibits": [{
            "type": "bar",
            "title": "Absatz nach Segment (Vorjahr)",
            "unit": "Mio. Fahrzeuge",
            "labels": ["City-Flitzer", "Mittelklasse", "Kompakt-SUV", "Groß-SUV"],
            "datasets": [{"label": "Absatz", "data": [2.5, 1.0, 2.0, 3.5]}],
        }],
        "info": None,
        "questions": [{
            "text": "Um welchen Faktor ist das Groß-SUV-Segment größer als die Mittelklasse, und welchen Anteil hat es am Gesamtmarkt?",
            "solution": "3,5-mal so groß wie die Mittelklasse; ~39 % des Gesamtmarkts (3,5 von 9 Mio.).",
            "calc": "3,5 ÷ 1,0 = 3,5; Gesamt: 2,5 + 1,0 + 2,0 + 3,5 = 9 Mio.; 3,5 ÷ 9 ≈ 0,39.",
        }],
        "reference": "- Groß-SUV ist mit 3,5 Mio. Fahrzeugen das mit Abstand größte Segment (~39 % des Markts).\n- Die Mittelklasse ist mit 1,0 Mio. das kleinste Segment — weniger als ein Drittel des SUV-Volumens.\n- City-Flitzer (2,5) und Kompakt-SUV (2,0) bilden das Mittelfeld.\n- So what: Nach Volumen spricht alles für Groß-SUV — als Nächstes Wettbewerbsdichte und Margen je Segment prüfen.",
    },
    {
        "chart_type": "bars",
        "title": "FitFirst – Exhibit 1",
        "prompt": "Die Fitnesskette FitFirst hat drei Standorttypen und vergleicht die Mitgliederentwicklung seit 2023.",
        "exhibits": [{
            "type": "bar",
            "title": "Mitglieder nach Standorttyp",
            "unit": "Tsd. Mitglieder",
            "labels": ["City-Studios", "Vorort-Studios", "Premium-Clubs"],
            "datasets": [
                {"label": "2023", "data": [45, 30, 10]},
                {"label": "2025", "data": [36, 42, 15]},
            ],
        }],
        "info": None,
        "questions": [{
            "text": "Welcher Standorttyp ist von 2023 auf 2025 prozentual am stärksten gewachsen — und um wie viel Prozent?",
            "solution": "Premium-Clubs: +50 % (von 10 auf 15 Tsd.). Zum Vergleich: Vorort +40 %, City −20 %.",
            "calc": "Premium: (15−10) ÷ 10 = 50 %; Vorort: (42−30) ÷ 30 = 40 %; City: (36−45) ÷ 45 = −20 %.",
        }],
        "reference": "- Gegenläufige Entwicklung: City-Studios verlieren (−20 %), Vorort (+40 %) und Premium (+50 %) wachsen.\n- Absolut ist Vorort der größte Gewinner (+12 Tsd. Mitglieder); Premium wächst relativ am stärksten.\n- Die Gesamtbasis wächst von 85 auf 93 Tsd. (+~9 %) — das Wachstum verlagert sich aber komplett aus der City heraus.\n- So what: Investitions- und Flächenstrategie Richtung Vorort/Premium drehen; Ursachen der City-Abwanderung (Homeoffice?) klären.",
    },
    {
        "chart_type": "bars",
        "title": "TeleNet – Exhibit 2",
        "prompt": "Der Telko-Anbieter TeleNet verliert Kunden und hat die Kündigungsgründe des letzten Jahres ausgewertet.",
        "exhibits": [{
            "type": "bar",
            "title": "Kündigungsgründe",
            "unit": "% der Kündigungen",
            "labels": ["Preis", "Netzqualität", "Service", "Umzug", "Sonstige"],
            "datasets": [{"label": "Anteil", "data": [38, 27, 17, 10, 8]}],
        }],
        "info": None,
        "questions": [{
            "text": "Welchen Anteil der Kündigungen könnten Preis- und Service-Maßnahmen zusammen maximal adressieren?",
            "solution": "55 % (38 % Preis + 17 % Service).",
            "calc": "38 + 17 = 55.",
        }],
        "reference": "- Preis ist mit 38 % der dominante Kündigungsgrund, gefolgt von Netzqualität (27 %).\n- Preis + Service = 55 % — mehr als die Hälfte der Kündigungen ist durch eigene Maßnahmen adressierbar.\n- Umzug (10 %) ist kaum beeinflussbar, Netzqualität nur mit langfristigem Invest.\n- So what: Kurzfristig Retention-Angebote und Service-Qualität, parallel Netzausbau in Problemregionen priorisieren.",
    },
    {
        "chart_type": "bars",
        "title": "PharmaVital – Exhibit 1",
        "prompt": "PharmaVital möchte seine Wettbewerbsposition im OTC-Markt verstehen. Du siehst die Umsätze der fünf größten Anbieter.",
        "exhibits": [{
            "type": "bar",
            "title": "Umsatz Top-5-Anbieter",
            "unit": "Mio. €",
            "labels": ["Klient", "Wettb. A", "Wettb. B", "Wettb. C", "Wettb. D"],
            "datasets": [{"label": "Umsatz", "data": [320, 480, 260, 180, 160]}],
        }],
        "info": None,
        "questions": [{
            "text": "Wie hoch ist der Marktanteil des Klienten innerhalb dieses Top-5-Felds?",
            "solution": "~23 % (320 von 1.400 Mio. €).",
            "calc": "320 + 480 + 260 + 180 + 160 = 1.400; 320 ÷ 1.400 ≈ 0,23.",
        }],
        "reference": "- Der Klient ist mit 320 Mio. € klare Nr. 2 hinter Wettbewerber A (480 Mio. €, ~34 % des Felds).\n- Nach vorne ist A das 1,5-Fache des Klienten; nach hinten liegt B nur 60 Mio. € zurück.\n- Die Top 2 vereinen zusammen ~57 % des Wettbewerbsfelds.\n- So what: Verstehen, womit A führt (Portfolio, Preis, Vertrieb) — und den Vorsprung auf B absichern.",
    },

    # ---------- TREND (3) ----------
    {
        "chart_type": "trend",
        "title": "StreamNow – Exhibit 1",
        "prompt": "Der Streaming-Dienst StreamNow zeigt dem Board seine Abonnentenentwicklung der letzten acht Quartale.",
        "exhibits": [{
            "type": "line",
            "title": "Abonnenten je Quartal",
            "unit": "Mio. Abonnenten",
            "labels": ["Q1/24", "Q2/24", "Q3/24", "Q4/24", "Q1/25", "Q2/25", "Q3/25", "Q4/25"],
            "datasets": [{"label": "Abonnenten", "data": [4.2, 4.6, 5.1, 5.5, 5.8, 6.0, 6.1, 6.2]}],
        }],
        "info": None,
        "questions": [{
            "text": "Wie hat sich das Quartalswachstum entwickelt? Vergleiche den Zuwachs am Anfang und am Ende des Zeitraums.",
            "solution": "Das Wachstum flacht stark ab: Anfangs +0,4 Mio. pro Quartal (~10 %), zuletzt nur noch +0,1 Mio. (~2 %).",
            "calc": "Q1→Q2/24: 4,6 − 4,2 = +0,4 (≈ 10 %); Q3→Q4/25: 6,2 − 6,1 = +0,1 (≈ 2 %).",
        }],
        "reference": "- Abonnenten wachsen in zwei Jahren von 4,2 auf 6,2 Mio. (+~48 %) — aber das Wachstum verlangsamt sich Quartal für Quartal.\n- Der Zuwachs fällt von +0,4 auf +0,1 Mio. je Quartal: klare Sättigungstendenz.\n- Ohne neue Impulse droht Stagnation knapp über 6 Mio.\n- So what: Neue Wachstumshebel prüfen (Märkte, Preismodelle, Content) oder den Fokus auf Umsatz je Nutzer verschieben.",
    },
    {
        "chart_type": "trend",
        "title": "ModeMonde – Exhibit 1",
        "prompt": "Der Online-Modehändler ModeMonde beobachtet seine Retourenquote über das letzte Jahr.",
        "exhibits": [{
            "type": "line",
            "title": "Retourenquote je Monat",
            "unit": "% der Bestellungen",
            "labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
            "datasets": [{"label": "Retourenquote", "data": [22, 21, 23, 22, 24, 26, 28, 31, 33, 34, 36, 38]}],
        }],
        "info": None,
        "questions": [{
            "text": "Um wie viele Prozentpunkte ist die Retourenquote über das Jahr gestiegen — und was heißt das relativ?",
            "solution": "+16 Prozentpunkte (von 22 % auf 38 %), relativ ein Anstieg um ~73 %.",
            "calc": "38 − 22 = 16 Prozentpunkte; 16 ÷ 22 ≈ 0,73.",
        }],
        "reference": "- Die Retourenquote steigt fast durchgehend von 22 % auf 38 % (+16 Prozentpunkte).\n- Ab Juni beschleunigt sich der Anstieg deutlich — mögliche Treiber: Sortimentswechsel, neue Kundengruppen, großzügigere Retourenregeln.\n- Jede Retoure kostet Marge (Logistik, Aufbereitung, Abschriften) — der Trend ist ein direktes Ergebnisrisiko.\n- So what: Retouren nach Kategorie/Kundengruppe segmentieren und gezielt gegensteuern (Größenberatung, Fotos, ggf. Gebühren).",
    },
    {
        "chart_type": "trend",
        "title": "OmniRetail – Exhibit 1",
        "prompt": "OmniRetail verkauft über Filialen und einen Online-Shop. Das Management will wissen, wohin sich der Umsatzmix bewegt.",
        "exhibits": [{
            "type": "line",
            "title": "Umsatz nach Kanal",
            "unit": "Mio. €",
            "labels": ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"],
            "datasets": [
                {"label": "Filialen", "data": [20, 19, 19, 18, 17, 16]},
                {"label": "Online", "data": [10, 11, 12, 13, 14, 15]},
            ],
        }],
        "info": None,
        "questions": [{
            "text": "Wie haben sich beide Kanäle im Halbjahr entwickelt, und wann kreuzen sie sich, wenn die Trends anhalten?",
            "solution": "Online +50 % (10 → 15 Mio. €), Filialen −20 % (20 → 16). Bei +1/−~1 Mio. € pro Monat kreuzen sich die Linien im Juli.",
            "calc": "Online: (15−10) ÷ 10 = +50 %; Filiale: (16−20) ÷ 20 = −20 %; Lücke im Juni: 1 Mio. € bei gegenläufigen Trends → Kreuzung im Folgemonat.",
        }],
        "reference": "- Klarer Kanal-Shift: Online wächst stetig (+1 Mio. €/Monat, +50 % seit Januar), Filialen schrumpfen (−20 %).\n- Der Gesamtumsatz bleibt fast konstant (30 → 31 Mio. €) — es ist Verlagerung, kein Wachstum.\n- Bei anhaltendem Trend überholt Online die Filialen im Juli.\n- So what: Kostenstruktur an den Shift anpassen (Filialnetz, Fulfillment-Kapazität) statt beide Kanäle unverändert weiterzufahren.",
    },

    # ---------- SHARE (2) ----------
    {
        "chart_type": "share",
        "title": "FoodExpress – Exhibit 1",
        "prompt": "Der Lieferdienst FoodExpress analysiert, zu welchen Tageszeiten sein Umsatz entsteht, um Fahrerkapazitäten zu planen.",
        "exhibits": [{
            "type": "pie",
            "title": "Umsatz nach Tageszeit",
            "unit": "Mio. € p.a.",
            "labels": ["Mittag (11–14 Uhr)", "Nachmittag", "Abend (18–22 Uhr)", "Nacht"],
            "datasets": [{"label": "Umsatz", "data": [7.2, 2.4, 12, 2.4]}],
        }],
        "info": None,
        "questions": [{
            "text": "Welche zwei Zeitfenster machen zusammen 80 % des Umsatzes aus?",
            "solution": "Abend (12 Mio. €, 50 %) und Mittag (7,2 Mio. €, 30 %) — zusammen 19,2 von 24 Mio. € = 80 %.",
            "calc": "Gesamt: 7,2 + 2,4 + 12 + 2,4 = 24 Mio. €; (12 + 7,2) ÷ 24 = 0,8.",
        }],
        "reference": "- Das Geschäft konzentriert sich auf zwei Peaks: Abend (50 %) und Mittag (30 %) — zusammen 80 % des Umsatzes.\n- Nachmittag und Nacht sind mit je 10 % Randzeiten.\n- Fahrer- und Küchenkapazität müssen auf die Peaks ausgelegt werden; dazwischen droht Leerlauf.\n- So what: Peak-Kapazität optimieren und Randzeiten mit Aktionen füllen — oder Servicezeiten straffen.",
    },
    {
        "chart_type": "share",
        "title": "BauTrend – Exhibit 2",
        "prompt": "Das Bauunternehmen BauTrend vergleicht seinen Umsatzmix von 2023 und 2025.",
        "exhibits": [{
            "type": "stacked_bar",
            "title": "Umsatz nach Sparte",
            "unit": "Mio. €",
            "labels": ["2023", "2025"],
            "datasets": [
                {"label": "Neubau", "data": [60, 55]},
                {"label": "Sanierung", "data": [30, 45]},
                {"label": "Service & Wartung", "data": [10, 20]},
            ],
        }],
        "info": None,
        "questions": [{
            "text": "Wie stark ist der Gesamtumsatz gewachsen, und welche Sparte hat am meisten dazu beigetragen?",
            "solution": "+20 Mio. € (100 → 120, +20 %); größter Treiber ist die Sanierung mit +15 Mio. €.",
            "calc": "2023: 60+30+10 = 100; 2025: 55+45+20 = 120; Deltas: Sanierung +15, Service +10, Neubau −5.",
        }],
        "reference": "- Wachstum von +20 % kommt komplett aus Sanierung (+15 Mio. €) und Service (+10) — der Neubau schrumpft (−5).\n- Der Mix dreht sich: Neubau-Anteil fällt von 60 % auf ~46 %.\n- Sanierung und Service sind typischerweise margenstärker und konjunkturrobuster als Neubau.\n- So what: Kapazitäten und Vertrieb aktiv in Richtung Sanierung/Service verschieben.",
    },

    # ---------- COMBO (2) ----------
    {
        "chart_type": "combo",
        "title": "CityBike – Exhibit 1",
        "prompt": "Der Bike-Sharing-Anbieter CityBike wächst bei den Fahrten, aber der Finanzchef ist unsicher, was beim Umsatz ankommt.",
        "exhibits": [
            {
                "type": "bar",
                "title": "Anzahl Fahrten",
                "unit": "Tsd. Fahrten",
                "labels": ["2023", "2024", "2025"],
                "datasets": [{"label": "Fahrten", "data": [480, 600, 690]}],
            },
            {
                "type": "bar",
                "title": "Ø Umsatz je Fahrt",
                "unit": "€",
                "labels": ["2023", "2024", "2025"],
                "datasets": [{"label": "Umsatz je Fahrt", "data": [2.6, 2.4, 2.2]}],
            },
        ],
        "info": None,
        "questions": [{
            "text": "Wie hat sich der Gesamtumsatz von 2023 auf 2025 entwickelt?",
            "solution": "Von ~1,25 auf ~1,52 Mio. € gestiegen (+~22 %) — das Mengenwachstum überkompensiert den Preisverfall.",
            "calc": "2023: 480 Tsd. × 2,60 € ≈ 1,25 Mio. €; 2025: 690 Tsd. × 2,20 € ≈ 1,52 Mio. €; +0,27 ÷ 1,25 ≈ +22 %.",
        }],
        "reference": "- Fahrten +44 % (480 → 690 Tsd.), aber Umsatz je Fahrt −15 % (2,60 → 2,20 €).\n- Netto wächst der Umsatz um ~22 % — Menge schlägt (noch) Preis.\n- Den Preisverfall je Fahrt verstehen: Rabatte, Abo-Mix, kürzere Fahrten?\n- So what: Monetarisierung je Fahrt stabilisieren — sonst braucht jedes Umsatzwachstum immer mehr Volumen.",
    },
    {
        "chart_type": "combo",
        "title": "KaffeeKult – Exhibit 2",
        "prompt": "Die Café-Kette KaffeeKult vergleicht ihre drei Regionen nach Umsatz und Kundenzufriedenheit.",
        "exhibits": [
            {
                "type": "bar",
                "title": "Umsatz je Region",
                "unit": "Mio. €",
                "labels": ["Nord", "West", "Süd"],
                "datasets": [{"label": "Umsatz", "data": [18, 26, 16]}],
            },
            {
                "type": "bar",
                "title": "Net Promoter Score je Region",
                "unit": "NPS-Punkte",
                "labels": ["Nord", "West", "Süd"],
                "datasets": [{"label": "NPS", "data": [12, 45, 38]}],
            },
        ],
        "info": None,
        "questions": [{
            "text": "Welche Region fällt im Verhältnis von Umsatz und Zufriedenheit aus dem Rahmen — und wie ordnest du das ein?",
            "solution": "Nord: solider Umsatz (18 Mio. €), aber mit Abstand schlechtester NPS (12) — dieser Umsatz ist mittelfristig gefährdet.",
            "calc": "Panel-Vergleich: West führt bei beidem (26 Mio. € / NPS 45); Süd hat den kleinsten Umsatz, aber guten NPS (38); Nord kombiniert mittleren Umsatz mit sehr niedrigem NPS.",
        }],
        "reference": "- West ist die stärkste Region: höchster Umsatz (26 Mio. €) UND höchster NPS (45).\n- Nord fällt ab: NPS von nur 12 bei 18 Mio. € Umsatz — Unzufriedenheit gefährdet den künftigen Umsatz.\n- Süd: kleinster Umsatz, aber zufriedene Kunden — hier liegt Wachstumspotenzial.\n- So what: In Nord Ursachen beheben (Service, Standorte), in Süd Expansion prüfen, West als Benchmark nutzen.",
    },
]
