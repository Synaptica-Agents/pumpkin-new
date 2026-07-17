# -*- coding: utf-8 -*-
"""15 Fortgeschrittenen-Cases (difficulty=hard) für den Diagramme-Drill.
Wie data_cases_easy.py, aber: genau 2 Fragen je Case (mehrstufige Rechnungen,
Zusatzinfos müssen einbezogen werden) und immer Additional-Info-Bullets.
Alle Zahlen sind intern konsistent — bei Änderungen Rechenwege mitziehen!
"""

HARD_CASES = [
    # ---------- TABLE (4) ----------
    {
        "chart_type": "table",
        "title": "TechnoPart – Exhibit 2",
        "prompt": "Dein Klient prüft die Übernahme eines von zwei Elektronikzulieferern. Beide Kandidaten liegen dir mit ihrer aktuellen Ergebnisrechnung vor.",
        "exhibits": [{
            "type": "table",
            "title": "Ergebnisrechnung der Kandidaten (letztes Geschäftsjahr)",
            "unit_note": "Alle Zahlen in Mio. €",
            "columns": ["Kandidat A (Frankreich)", "Kandidat B (Polen)"],
            "rows": [
                {"label": "Umsatz", "values": [70, 85], "style": "bold"},
                {"label": "Variable Kosten", "values": [10, 11.5], "style": "bold"},
                {"label": "Rohmaterial", "values": [7.5, 8.5], "indent": 1},
                {"label": "Transport", "values": [1.5, 2.0], "indent": 1},
                {"label": "Energie", "values": [1.0, 1.0], "indent": 1},
                {"label": "Fixkosten", "values": [55, 50.5], "style": "bold"},
                {"label": "Produktion (Personal)", "values": [42, 33.5], "indent": 1},
                {"label": "Forschung & Entwicklung", "values": [10, 15], "indent": 1},
                {"label": "Vertrieb & Verwaltung", "values": [3, 2], "indent": 1},
                {"label": "Operativer Gewinn", "values": [5, 23], "style": "total"},
            ],
        }],
        "info": [
            "Variable Kosten sind seit Jahren stabil und dürften es bleiben (langfristige Lieferverträge).",
            "Fixkosten steigen seit fünf Jahren langsam, aber stetig — es gab weder Personalauf- noch -abbau.",
        ],
        "questions": [
            {
                "text": "Wie hoch ist die operative Marge beider Kandidaten?",
                "solution": "Kandidat A: ~7 % (5 von 70), Kandidat B: ~27 % (23 von 85).",
                "calc": "5 ÷ 70 ≈ 7,1 %; 23 ÷ 85 ≈ 27,1 %.",
            },
            {
                "text": "Angenommen, Kandidat A senkt seine Produktions-Personalkosten je Umsatz-Euro auf das Niveau von B. Wie viel zusätzlicher Gewinn entsteht?",
                "solution": "Rund 14–15 Mio. € Ersparnis — der operative Gewinn stiege von 5 auf ~19–20 Mio. €.",
                "calc": "B: 33,5 ÷ 85 ≈ 39 % Produktionskosten vom Umsatz; A heute: 42 ÷ 70 = 60 %. A bei 39 %: 70 × 0,39 ≈ 27,5 Mio. € → Ersparnis 42 − 27,5 ≈ 14,5 Mio. €.",
            },
        ],
        "reference": "- B ist deutlich profitabler: ~27 % operative Marge vs. ~7 % bei A — bei fast gleicher variabler Kostenquote (~14 %).\n- Der Unterschied liegt fast vollständig im Produktions-Personal: 42 vs. 33,5 Mio. € — und das bei weniger Umsatz von A.\n- B investiert mehr in F&E (15 vs. 10 Mio. €) und kauft sich damit Zukunftsfähigkeit.\n- So what: B ist das gesündere Asset; A wäre eine Restrukturierungs-Wette auf die Produktionskosten.",
    },
    {
        "chart_type": "table",
        "title": "MetroBus – Exhibit 2",
        "prompt": "Eine Stadt lässt die Kostenprojektion ihres ÖPNV-Systems prüfen. Externe Effekte könnten die Planung deutlich verändern.",
        "exhibits": [{
            "type": "table",
            "title": "Kostenprojektion ÖPNV (nächstes Jahr)",
            "unit_note": "in Mio. € p.a.",
            "columns": ["Mio. € p.a."],
            "rows": [
                {"label": "Gesamtkosten", "values": [1000], "style": "total"},
                {"label": "Busse", "values": [750], "style": "bold"},
                {"label": "Wartung", "values": [150], "indent": 1},
                {"label": "Kraftstoff", "values": [250], "indent": 1},
                {"label": "Fahrer", "values": [280], "indent": 1},
                {"label": "Sonstige", "values": [70], "indent": 1},
                {"label": "U-Bahn", "values": [250], "style": "bold"},
                {"label": "Wartung", "values": [60], "indent": 1},
                {"label": "Strom", "values": [80], "indent": 1},
                {"label": "Fahrer", "values": [70], "indent": 1},
                {"label": "Sonstige", "values": [40], "indent": 1},
            ],
        }],
        "info": [
            "Kraftstoffkosten Busse = 500 Mio. km × 0,5 l/km × 1,00 €/Liter Diesel.",
            "Neue Prognose: Dieselpreis −20 %, Strompreis −10 % gegenüber der Projektion.",
            "Geplantes Nachtfahrverbot: Bus-Kilometer −10 % und Bus-Fahrerkosten −10 % (nur Busse betroffen).",
        ],
        "questions": [
            {
                "text": "Um wie viel sinken die Kraftstoffkosten der Busse durch den niedrigeren Dieselpreis UND die 10 % weniger Kilometer zusammen?",
                "solution": "Auf 180 Mio. € — eine Ersparnis von 70 Mio. € (−28 %).",
                "calc": "250 × 0,8 (Preis) × 0,9 (Menge) = 180; 250 − 180 = 70.",
            },
            {
                "text": "Wie hoch sind die Gesamtkosten nach allen drei Effekten (Diesel, Strom, Nachtfahrverbot)?",
                "solution": "~894 Mio. € statt 1.000 (Busse 652 + U-Bahn 242) — rund −11 %.",
                "calc": "Busse: 150 + 180 (Kraftstoff) + 252 (Fahrer: 280 × 0,9) + 70 = 652; U-Bahn: 60 + 72 (Strom: 80 × 0,9) + 70 + 40 = 242; Summe 894.",
            },
        ],
        "reference": "- Busse dominieren die Kosten: 750 von 1.000 Mio. € (75 %); größte Blöcke sind Fahrer (280) und Kraftstoff (250).\n- Die drei Effekte wirken fast nur auf die Bus-Seite; die U-Bahn ist mit −8 Mio. € kaum betroffen.\n- Gesamtersparnis ~106 Mio. € (−11 %), davon allein 70 Mio. € beim Kraftstoff (Preis- und Mengeneffekt multiplizieren sich).\n- So what: Energiepreise absichern (Hedging) und Fahrplan-/Kilometeroptimierung sind die stärksten Hebel; Wartung und Sonstige separat angehen.",
    },
    {
        "chart_type": "table",
        "title": "RegioBank – Exhibit 3",
        "prompt": "Eine Regionalbank überprüft ihre drei Kundensegmente und diskutiert ein Digitalisierungsprogramm im Privatkundengeschäft.",
        "exhibits": [{
            "type": "table",
            "title": "Segmentübersicht Privat- und Geschäftskunden",
            "unit_note": None,
            "columns": ["Retail", "Premium", "Business"],
            "rows": [
                {"label": "Kunden (Tsd.)", "values": [400, 60, 40]},
                {"label": "Ertrag je Kunde (€ p.a.)", "values": [180, 950, 1400]},
                {"label": "Kosten je Kunde (€ p.a.)", "values": [150, 520, 700]},
                {"label": "Ergebnis je Kunde (€ p.a.)", "values": [30, 430, 700], "style": "total"},
            ],
        }],
        "info": [
            "Digitalisierungsprogramm: senkt die Kosten je Retail-Kunde um 40 €, kostet aber 12 Mio. € p.a. (Abschreibung + Betrieb).",
            "Premium wächst ~5 % p.a., Retail schrumpft ~2 % p.a.",
        ],
        "questions": [
            {
                "text": "Welches Segment liefert heute das höchste Gesamtergebnis?",
                "solution": "Business mit 28 Mio. € (Premium 25,8 Mio. €, Retail 12 Mio. €).",
                "calc": "Kunden × Ergebnis je Kunde: 40 Tsd. × 700 € = 28 Mio. €; 60 Tsd. × 430 € = 25,8 Mio. €; 400 Tsd. × 30 € = 12 Mio. €.",
            },
            {
                "text": "Lohnt sich das Digitalisierungsprogramm im Retail-Segment?",
                "solution": "Ja, knapp: 16 Mio. € Ersparnis vs. 12 Mio. € Programmkosten → +4 Mio. € p.a. (Retail-Ergebnis +33 %). Bei schrumpfender Retail-Basis sinkt der Nutzen allerdings jedes Jahr.",
                "calc": "400 Tsd. Kunden × 40 € = 16 Mio. € Ersparnis; 16 − 12 = +4 Mio. € p.a.",
            },
        ],
        "reference": "- Retail hat die Masse (400 Tsd. Kunden), aber nur 30 € Ergebnis je Kunde — Premium und Business tragen mit 100 Tsd. Kunden ~82 % des Ergebnisses (53,8 von 65,8 Mio. €).\n- Business ist das wertvollste Segment (700 € je Kunde, 28 Mio. € gesamt).\n- Wachstum liegt im Premium-Segment (+5 % p.a.), Retail schrumpft — die Schere öffnet sich weiter.\n- So what: Ressourcen Richtung Premium/Business; Retail nur mit konsequenter Kostensenkung (Digitalisierung, +4 Mio. € p.a.) weiterführen.",
    },
    {
        "chart_type": "table",
        "title": "ShopRocket – Exhibit 2",
        "prompt": "Der E-Commerce-Händler ShopRocket verkauft über die eigene Website und einen großen Marktplatz. Der CFO will die Kanäle ehrlich vergleichen.",
        "exhibits": [{
            "type": "table",
            "title": "Unit Economics je Bestellung",
            "unit_note": "in € je Bestellung",
            "columns": ["Eigene Website", "Marktplatz"],
            "rows": [
                {"label": "Ø Warenkorb", "values": [80, 60], "style": "bold"},
                {"label": "Wareneinsatz", "values": [44, 33], "indent": 1},
                {"label": "Versand & Fulfillment", "values": [8, 9], "indent": 1},
                {"label": "Marketing bzw. Marktplatz-Gebühr", "values": [16, 9], "indent": 1},
                {"label": "Deckungsbeitrag je Bestellung", "values": [12, 9], "style": "total"},
            ],
        }],
        "info": [
            "Bestellungen p.a.: Website 1,5 Mio., Marktplatz 2,5 Mio.",
            "Retourenquote: Website 25 %, Marktplatz 45 %. Retouren sind oben NICHT enthalten und kosten je Retoure 10 € (Website) bzw. 12 € (Marktplatz).",
            "Die Marktplatz-Gebühr steigt nächstes Jahr von 15 % auf 18 % des Warenkorbs.",
        ],
        "questions": [
            {
                "text": "Wie hoch ist der Deckungsbeitrag je Bestellung NACH Retourenkosten in beiden Kanälen?",
                "solution": "Website: 9,50 €, Marktplatz: 3,60 € je Bestellung.",
                "calc": "Website: 12 − 25 % × 10 € = 12 − 2,50 = 9,50 €; Marktplatz: 9 − 45 % × 12 € = 9 − 5,40 = 3,60 €.",
            },
            {
                "text": "Was passiert mit dem Marktplatz-Deckungsbeitrag (nach Retouren), wenn die Gebühr auf 18 % steigt?",
                "solution": "Er halbiert sich auf 1,80 € je Bestellung.",
                "calc": "Mehrkosten: 60 € Warenkorb × 3 Prozentpunkte = 1,80 €; 3,60 − 1,80 = 1,80 €.",
            },
        ],
        "reference": "- Website-Bestellungen sind je Stück deutlich wertvoller: DB 12 vs. 9 € — nach Retouren wächst der Abstand auf 9,50 vs. 3,60 €.\n- Der Marktplatz bringt Volumen (2,5 vs. 1,5 Mio. Bestellungen), aber 45 % Retouren und Gebühren fressen die Marge.\n- Gesamt-DB nach Retouren: Website ~14,3 Mio. €, Marktplatz ~9 Mio. € — trotz 67 % mehr Bestellungen.\n- So what: Kanal-Mix Richtung Website steuern, Marktplatz-Konditionen verhandeln oder dort auf retourenarme Artikel fokussieren — die Gebührenerhöhung macht den Kanal sonst fast wertlos.",
    },

    # ---------- BARS (4) ----------
    {
        "chart_type": "bars",
        "title": "SolarTech – Exhibit 1",
        "prompt": "Der Modulhersteller SolarTech boomt — aber der COO warnt, dass die Produktion nicht hinterherkommt.",
        "exhibits": [{
            "type": "bar",
            "title": "Auftragseingang vs. Produktionskapazität",
            "unit": "MW",
            "labels": ["2023", "2024", "2025"],
            "datasets": [
                {"label": "Auftragseingang", "data": [400, 700, 1100]},
                {"label": "Produktionskapazität", "data": [500, 650, 800]},
            ],
        }],
        "info": [
            "Kapazitätsausbau von +150 MW pro Jahr ist bereits beschlossen (in den Zahlen enthalten).",
            "Nicht bediente Aufträge wandern in der Regel zum Wettbewerb ab (keine Warteliste).",
            "Deckungsbeitrag: ~120 Tsd. € je MW.",
        ],
        "questions": [
            {
                "text": "Wie groß ist die Kapazitätslücke 2025, und wie viel Deckungsbeitrag entgeht dadurch?",
                "solution": "300 MW Lücke (1.100 vs. 800) → ~36 Mio. € entgangener Deckungsbeitrag.",
                "calc": "1.100 − 800 = 300 MW; 300 × 120 Tsd. € = 36 Mio. €.",
            },
            {
                "text": "Reicht das beschlossene Ausbautempo (+150 MW p.a.), wenn die Nachfrage weiter um ~400 MW p.a. wächst?",
                "solution": "Nein — die Lücke wächst jedes Jahr um ~250 MW; 2026 wären es bereits ~550 MW.",
                "calc": "Lücken-Delta p.a.: 400 − 150 = 250 MW; Lücke 2025: 300 → 2026: ~550 MW.",
            },
        ],
        "reference": "- Die Nachfrage wächst viel schneller als die Kapazität: Aufträge +175 % in zwei Jahren (400 → 1.100 MW), Kapazität nur +60 % (500 → 800).\n- 2023 gab es noch Überkapazität (+100 MW); seit 2024 dreht das Bild — 2025 fehlen 300 MW.\n- Entgangener Deckungsbeitrag 2025: ~36 Mio. €, Tendenz stark steigend.\n- So what: Ausbau beschleunigen (Capex, Partner, Lohnfertigung) und/oder Preise erhöhen, um die knappe Kapazität besser zu monetarisieren.",
    },
    {
        "chart_type": "bars",
        "title": "ChemCore – Exhibit 2",
        "prompt": "Der Chemiekonzern ChemCore vergleicht die Herstellkosten seiner vier Werke mit dem Wettbewerb.",
        "exhibits": [{
            "type": "bar",
            "title": "Herstellkosten je Tonne nach Werk",
            "unit": "€ je Tonne",
            "labels": ["Werk A", "Werk B", "Werk C", "Werk D"],
            "datasets": [{"label": "Herstellkosten", "data": [410, 380, 520, 450]}],
        }],
        "info": [
            "Benchmark effizienter Wettbewerber: ~390 € je Tonne.",
            "Jahresmengen: A 250, B 300, C 80, D 170 Tsd. Tonnen.",
            "Werk C läuft mit nur 60 % Auslastung; ~50 % seiner Kosten sind fix.",
        ],
        "questions": [
            {
                "text": "Wie hoch sind die gewichteten Durchschnittskosten je Tonne über alle vier Werke?",
                "solution": "~418 € je Tonne (gewichtet über 800 Tsd. Tonnen) — über dem Benchmark von 390 €.",
                "calc": "(250×410 + 300×380 + 80×520 + 170×450) ÷ 800 = 334.600 ÷ 800 ≈ 418 €.",
            },
            {
                "text": "Werk C soll von 80 auf 120 Tsd. Tonnen ausgelastet werden. Was passiert grob mit den Stückkosten dort (50 % Fixkostenanteil)?",
                "solution": "Sie fallen um ~17 % auf ~433 € je Tonne, weil sich der Fixkostenblock auf 50 % mehr Menge verteilt.",
                "calc": "Fix heute: 50 % × 520 = 260 €/t × 80 Tsd. t = 20,8 Mio. €; bei 120 Tsd. t: 20,8 ÷ 120 ≈ 173 €/t; plus 260 €/t variabel ≈ 433 €/t.",
            },
        ],
        "reference": "- Große Spannweite: 380 (Werk B) bis 520 €/t (Werk C) — fast 37 % Unterschied zwischen bestem und schlechtestem Werk.\n- Nur Werk B schlägt den Wettbewerbs-Benchmark (390 €/t); der gewichtete Schnitt liegt mit ~418 €/t darüber.\n- Werk C ist klein UND schlecht ausgelastet — der klassische Fixkosten-Nachteil.\n- So what: Werk C besser auslasten (oder Produktion verlagern/schließen) und Best Practices von B auf A und D übertragen.",
    },
    {
        "chart_type": "bars",
        "title": "ConsultPro – Exhibit 3",
        "prompt": "Die Beratung ConsultPro verliert auffällig viele Mitarbeitende und vergleicht ihre Fluktuation mit dem Branchenschnitt.",
        "exhibits": [{
            "type": "bar",
            "title": "Freiwillige Fluktuation nach Karrierestufe",
            "unit": "% pro Jahr",
            "labels": ["Analyst", "Consultant", "Manager", "Partner"],
            "datasets": [
                {"label": "Klient", "data": [22, 28, 12, 4]},
                {"label": "Branchenschnitt", "data": [18, 19, 10, 5]},
            ],
        }],
        "info": [
            "Wiederbesetzungskosten: ~1,5 Jahresgehälter je Abgang auf Consultant-Level (Ø-Gehalt: 90 Tsd. €).",
            "Consultant-Headcount: 200 Personen.",
            "Exit-Interviews nennen auf Consultant-Level vor allem Arbeitsbelastung und fehlende Beförderungsperspektive.",
        ],
        "questions": [
            {
                "text": "Wie viele Consultant-Abgänge pro Jahr gehen über das Branchenniveau hinaus, und was kosten sie?",
                "solution": "18 zusätzliche Abgänge p.a. (9 Prozentpunkte × 200 Köpfe) — Kosten ~2,4 Mio. € pro Jahr.",
                "calc": "28 % − 19 % = 9 Pp.; 9 % × 200 = 18 Abgänge; 18 × 1,5 × 90 Tsd. € = 2,43 Mio. €.",
            },
            {
                "text": "Auf welche Karrierestufe sollte ein Retention-Programm zuerst zielen — und warum?",
                "solution": "Auf das Consultant-Level: größte Lücke zur Branche (+9 Pp.), hohe Kosten je Abgang und klar adressierbare Gründe (Workload, Beförderungspfade).",
                "calc": "Abweichung vom Branchenschnitt: Analyst +4 Pp., Consultant +9 Pp., Manager +2 Pp., Partner −1 Pp.",
            },
        ],
        "reference": "- Die Fluktuation liegt auf fast allen Stufen über Branche; der Ausreißer ist das Consultant-Level: 28 % vs. 19 %.\n- Partner sind stabil (4 %, sogar unter Branche) — das Problem sitzt im Mittelbau, der das Delivery-Geschäft trägt.\n- Allein die Überschuss-Fluktuation der Consultants kostet ~2,4 Mio. € p.a. — ohne Projektausfälle und Know-how-Verlust.\n- So what: Retention-Programm für Consultants (Workload-Steuerung, transparente Beförderung) hat den schnellsten Payback.",
    },
    {
        "chart_type": "bars",
        "title": "GlowUp – Exhibit 1",
        "prompt": "Die D2C-Kosmetikmarke GlowUp gewinnt Neukunden über vier Marketingkanäle und hinterfragt ihre Budgetverteilung.",
        "exhibits": [{
            "type": "bar",
            "title": "Neukunden je Kanal (letztes Jahr)",
            "unit": "Tsd. Neukunden",
            "labels": ["SEO", "Paid Social", "TV", "Affiliate"],
            "datasets": [{"label": "Neukunden", "data": [24, 40, 16, 20]}],
        }],
        "info": [
            "Budget je Kanal: SEO 1,2 Mio. €, Paid Social 6,0 Mio. €, TV 4,0 Mio. €, Affiliate 1,6 Mio. €.",
            "Ø Deckungsbeitrag je Neukunde im ersten Jahr: 90 €.",
            "SEO ist kurzfristig kaum skalierbar; Paid Social und TV lassen sich frei skalieren.",
        ],
        "questions": [
            {
                "text": "Berechne die Akquisekosten (CAC) je Kanal. Welcher Kanal ist am teuersten?",
                "solution": "TV mit 250 € CAC (SEO 50 €, Affiliate 80 €, Paid Social 150 €).",
                "calc": "Budget ÷ Neukunden: 1.200 ÷ 24 = 50 €; 6.000 ÷ 40 = 150 €; 4.000 ÷ 16 = 250 €; 1.600 ÷ 20 = 80 €.",
            },
            {
                "text": "Welche Kanäle verdienen schon im ersten Jahr Geld (DB 90 € je Kunde), und wohin würdest du Budget umschichten?",
                "solution": "Nur SEO (+40 €) und Affiliate (+10 €) sind im ersten Jahr positiv; TV (−160 €) ist am schwächsten. Budget von TV Richtung Affiliate (und SEO bis zur Sättigung) verschieben; Paid Social braucht besseres Targeting oder höheren Kundenwert.",
                "calc": "DB 90 € − CAC: SEO +40, Affiliate +10, Paid Social −60, TV −160.",
            },
        ],
        "reference": "- Paid Social bringt die meisten Neukunden (40 Tsd.) — aber Menge ist nicht gleich Effizienz.\n- Die CAC-Spanne ist enorm: 50 € (SEO) bis 250 € (TV), Faktor 5.\n- Gemessen am Erstjahres-DB von 90 € verbrennen TV und Paid Social zunächst Geld; ihr Payback hängt komplett an der Wiederkaufrate.\n- So what: Budget von TV zu Affiliate verschieben, SEO maximal ausschöpfen und den Customer Lifetime Value je Kanal nachschärfen, bevor Paid Social weiter skaliert wird.",
    },

    # ---------- TREND (2) ----------
    {
        "chart_type": "trend",
        "title": "PayFlow – Exhibit 2",
        "prompt": "Der Zahlungsdienstleister PayFlow wächst seit Jahren — trotzdem ist der CFO mit dem Umsatz unzufrieden.",
        "exhibits": [{
            "type": "line",
            "title": "Transaktionsvolumen vs. Umsatz (indexiert, 2019 = 100)",
            "unit": "Index",
            "labels": ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
            "datasets": [
                {"label": "Transaktionsvolumen", "data": [100, 118, 140, 165, 195, 230, 270]},
                {"label": "Umsatz", "data": [100, 112, 126, 140, 155, 170, 186]},
            ],
        }],
        "info": [
            "Umsatz = Transaktionsvolumen × Take Rate (Gebührensatz).",
            "Regulierung und Wettbewerb erzeugen anhaltenden Preisdruck auf die Take Rate.",
        ],
        "questions": [
            {
                "text": "Was ist seit 2019 mit der Take Rate passiert (in %)?",
                "solution": "Sie ist um ~31 % gefallen: Volumen-Index 270, Umsatz-Index nur 186 → Take-Rate-Index ≈ 69.",
                "calc": "Take-Rate-Index = Umsatz ÷ Volumen = 186 ÷ 270 ≈ 0,69 → −31 % seit 2019.",
            },
            {
                "text": "Das Volumen wächst weiter mit ~17 % p.a., die Take Rate erodiert um ~4 % p.a. Wie entwickelt sich der Umsatz?",
                "solution": "Er wächst weiter, aber nur noch mit ~12 % pro Jahr.",
                "calc": "Umsatzwachstum ≈ 1,17 × 0,96 ≈ 1,12 → ~+12 % p.a.",
            },
        ],
        "reference": "- Das Volumen hat sich seit 2019 fast verdreifacht (Index 270, ~18 % p.a.), der Umsatz wächst nur auf 186.\n- Die Schere heißt Take-Rate-Erosion: kumuliert ~−31 % — Wachstum wird laufend durch Preisdruck aufgezehrt.\n- Die Zukunft hängt damit allein an der Menge; jede weitere Gebührensenkung wirkt direkt aufs Topline-Wachstum.\n- So what: Monetarisierung diversifizieren (Value-Added Services, Software, FX), statt nur auf Volumen zu setzen.",
    },
    {
        "chart_type": "trend",
        "title": "PackPro – Exhibit 2",
        "prompt": "Der Verpackungshersteller PackPro leidet unter gestiegenen Rohstoffpreisen und prüft, wie gut er sie an Kunden weitergibt.",
        "exhibits": [{
            "type": "line",
            "title": "Einkaufs- vs. Verkaufspreise (indexiert, Q1/24 = 100)",
            "unit": "Index",
            "labels": ["Q1/24", "Q2/24", "Q3/24", "Q4/24", "Q1/25", "Q2/25", "Q3/25", "Q4/25"],
            "datasets": [
                {"label": "Einkaufspreis-Index", "data": [100, 108, 118, 130, 138, 144, 148, 150]},
                {"label": "Verkaufspreis-Index", "data": [100, 102, 105, 109, 114, 120, 127, 135]},
            ],
        }],
        "info": [
            "Materialkosten machten im Basisquartal 70 % des Umsatzes aus; sonstige Kosten (20 % des Umsatzes) sind weitgehend fix.",
            "Vertragliche Gleitklauseln: Preisanpassungen an Kunden wirken mit ~2 Quartalen Verzögerung.",
        ],
        "questions": [
            {
                "text": "Die operative Marge lag im Basisquartal bei 10 %. Wo liegt sie im letzten Quartal ungefähr?",
                "solution": "Bei nur noch ~7,4 %: Der absolute Gewinn bleibt bei 10, aber auf 35 % größerer Umsatzbasis.",
                "calc": "Basis: 100 − 70 (Material) − 20 (Sonstige) = 10 → 10 %. Q4/25: 135 − 70×1,5 − 20 = 135 − 105 − 20 = 10 → 10 ÷ 135 ≈ 7,4 %.",
            },
            {
                "text": "Die Einkaufspreise bleiben ab jetzt stabil. Was passiert wegen der Gleitklauseln mit der Marge?",
                "solution": "Die Verkaufspreise ziehen noch ~2 Quartale nach, während der Einkauf stillsteht — die Lücke schließt sich und die Marge erholt sich zeitversetzt Richtung Ausgangsniveau.",
                "calc": "Verkaufsindex (135) läuft dem Einkaufsindex (150) strukturell ~2 Quartale hinterher; bei stabilem Einkauf holen die nachlaufenden Anpassungen die 15 Indexpunkte weitgehend auf.",
            },
        ],
        "reference": "- Einkaufspreise +50 % in zwei Jahren, Verkaufspreise nur +35 % — die Lücke von 15 Indexpunkten ist die Margen-Story.\n- Die Weitergabe erfolgt strukturell verzögert (~2 Quartale Gleitklauseln); die Lücke war zuletzt am größten.\n- Relative Marge fällt von 10 % auf ~7,4 %, obwohl der absolute Gewinn stabil bleibt.\n- So what: Gleitklauseln verkürzen bzw. indexieren, Einkauf hedgen und das Sortiment Richtung weniger materialintensiver Produkte entwickeln.",
    },

    # ---------- SHARE (3) ----------
    {
        "chart_type": "share",
        "title": "MediaHouse – Exhibit 1",
        "prompt": "Das Verlagshaus MediaHouse steckt mitten in der Digital-Transformation und schaut auf seinen Umsatzmix.",
        "exhibits": [{
            "type": "pie",
            "title": "Umsatzmix (aktuelles Jahr)",
            "unit": "Mio. €",
            "labels": ["Print-Anzeigen", "Print-Abos", "Digital-Abos", "Digital-Werbung", "Events"],
            "datasets": [{"label": "Umsatz", "data": [30, 25, 18, 15, 12]}],
        }],
        "info": [
            "Wachstum p.a.: Print-Anzeigen −12 %, Print-Abos −6 %, Digital-Abos +25 %, Digital-Werbung +10 %, Events +5 %.",
            "Bruttomarge: Digital-Abos ~70 %, Print-Geschäft ~35 %.",
        ],
        "questions": [
            {
                "text": "Wie groß ist der Digitalanteil am Umsatz heute — und wie groß in einem Jahr bei den genannten Wachstumsraten?",
                "solution": "Heute 33 % (33 von 100 Mio. €); in einem Jahr ~38 % (39 von ~101,5 Mio. €).",
                "calc": "Digital heute: 18 + 15 = 33. In 1 Jahr: 18×1,25 = 22,5 und 15×1,1 = 16,5 → 39; Gesamt: 26,4 + 23,5 + 22,5 + 16,5 + 12,6 = 101,5; 39 ÷ 101,5 ≈ 38 %.",
            },
            {
                "text": "Print-Anzeigen schrumpfen mit −12 % p.a. Wie lange dauert es grob, bis sich dieser Umsatz halbiert?",
                "solution": "Rund 5–6 Jahre.",
                "calc": "Faustregel 72: 72 ÷ 12 = 6 Jahre; exakt: 0,88^n = 0,5 → n ≈ 5,4 Jahre.",
            },
        ],
        "reference": "- Print liefert noch 55 % des Umsatzes, schrumpft aber strukturell (−12 %/−6 % p.a.); Digital (33 %) wächst zweistellig.\n- Digital-Abos sind der strategische Kern: +25 % Wachstum UND doppelte Marge (~70 % vs. ~35 %).\n- Der Mix kippt schnell: Digitalanteil steigt binnen eines Jahres von 33 % auf ~38 %.\n- So what: Den Übergang aktiv managen — Print-Kosten variabilisieren, den Digital-Abo-Funnel skalieren, Events als stabiles Zusatzgeschäft pflegen.",
    },
    {
        "chart_type": "share",
        "title": "AeroLine – Exhibit 2",
        "prompt": "Die Airline AeroLine verliert Kurzstrecken-Marktanteile an einen Low-Cost-Anbieter und vergleicht die Kostenstrukturen.",
        "exhibits": [{
            "type": "stacked_bar",
            "title": "Kosten je Flugstunde (indexiert, Klient = 100)",
            "unit": "Indexpunkte",
            "labels": ["Klient", "Low-Cost-Wettbewerber"],
            "datasets": [
                {"label": "Treibstoff", "data": [30, 28]},
                {"label": "Personal", "data": [25, 15]},
                {"label": "Flughafen & Gebühren", "data": [15, 8]},
                {"label": "Wartung", "data": [12, 10]},
                {"label": "Verwaltung & Vertrieb", "data": [18, 9]},
            ],
        }],
        "info": [
            "Beide fliegen vergleichbare Kurzstrecken-Netze mit ähnlichem Fluggerät.",
            "Personal: Der Wettbewerber nutzt eine Einheitsflotte und flexible Tarifverträge.",
            "Verwaltung & Vertrieb: Der Wettbewerber verkauft über 95 % der Tickets direkt online.",
        ],
        "questions": [
            {
                "text": "Wie groß ist der gesamte Kostenabstand, und in welchem Block liegt der größte absolute Vorteil des Wettbewerbers?",
                "solution": "30 Indexpunkte (100 vs. 70, also −30 %). Größter Einzelblock: Personal (−10), gefolgt von Verwaltung & Vertrieb (−9) und Gebühren (−7).",
                "calc": "100 − 70 = 30; Deltas je Block: Treibstoff −2, Personal −10, Gebühren −7, Wartung −2, Verwaltung & Vertrieb −9.",
            },
            {
                "text": "Welche Kostenlücken kann der Klient kurzfristig angehen, welche kaum?",
                "solution": "Kurzfristig: Verwaltung & Vertrieb (Direktvertrieb ausbauen, bis zu −9 Punkte) und Teile der Gebühren (Flughafen-Mix). Kaum kurzfristig: Personal (Tarifverträge, Flottenstruktur) und Treibstoff (ohnehin fast gleich).",
                "calc": "Ableitung aus den Zusatzinfos: Online-Direktvertrieb ist eine Vertriebsentscheidung; Tarif- und Flottenstruktur wirken nur mittel- bis langfristig.",
            },
        ],
        "reference": "- Der Low-Cost-Wettbewerber fliegt ~30 % günstiger (Index 70 vs. 100).\n- Die Lücke steckt in drei strukturellen Blöcken: Personal (−10), Verwaltung & Vertrieb (−9), Flughafen-Gebühren (−7) — Treibstoff und Wartung sind fast identisch.\n- Das ist ein Geschäftsmodell-Unterschied (Einheitsflotte, Direktvertrieb, Sekundärflughäfen), kein Effizienz-Feintuning.\n- So what: Zuerst Direktvertrieb und Flughafen-Mix; die Personalkosten-Lücke schließt nur eine langfristige Struktur-Entscheidung.",
    },
    {
        "chart_type": "share",
        "title": "WohnBau – Exhibit 3",
        "prompt": "Der Projektentwickler WohnBau prüft, ob sich Wohnungsneubau überhaupt noch rechnet.",
        "exhibits": [{
            "type": "stacked_bar",
            "title": "Projektkosten je Wohnung",
            "unit": "Tsd. € je Wohnung",
            "labels": ["2021", "2025"],
            "datasets": [
                {"label": "Grundstück", "data": [90, 130]},
                {"label": "Bau", "data": [180, 240]},
                {"label": "Nebenkosten & Gebühren", "data": [30, 50]},
            ],
        }],
        "info": [
            "Erzielbarer Verkaufspreis je Wohnung: 2021: 340 Tsd. €, 2025: 430 Tsd. €.",
            "Ein Förderprogramm könnte die Nebenkosten & Gebühren um 40 % senken.",
        ],
        "questions": [
            {
                "text": "Wie hat sich die Marge je Wohnung von 2021 auf 2025 entwickelt?",
                "solution": "Eingebrochen: von 40 Tsd. € (~12 % vom Preis) auf 10 Tsd. € (~2 %).",
                "calc": "2021: 340 − 300 (90+180+30) = 40; 2025: 430 − 420 (130+240+50) = 10.",
            },
            {
                "text": "Was bringt das Förderprogramm für die Marge 2025?",
                "solution": "+20 Tsd. € je Wohnung — die Marge verdreifacht sich von 10 auf 30 Tsd. € (~7 % vom Preis).",
                "calc": "50 × 40 % = 20 Tsd. € Ersparnis; 10 + 20 = 30 Tsd. €.",
            },
        ],
        "reference": "- Projektkosten +40 % in vier Jahren (300 → 420 Tsd. €), Verkaufspreise nur +26 % (340 → 430) — die Schere frisst die Marge.\n- Alle drei Blöcke steigen: absolut am stärksten der Bau (+60), relativ am stärksten die Nebenkosten (+67 %).\n- Marge je Wohnung bricht von ~12 % auf ~2 % ein — Neubau ist kaum noch wirtschaftlich.\n- So what: Förderprogramme konsequent mitnehmen (+20 Tsd. €), Baukosten über serielle Standards senken, Grundstücks-Pipeline neu bewerten.",
    },

    # ---------- COMBO (2) ----------
    {
        "chart_type": "combo",
        "title": "VersichertPlus – Exhibit 1",
        "prompt": "Der Sachversicherer VersichertPlus sieht seine Schadensbilanz kippen und analysiert die Treiber.",
        "exhibits": [
            {
                "type": "bar",
                "title": "Anzahl Schadensfälle",
                "unit": "Tsd. Fälle",
                "labels": ["2019", "2022", "2025"],
                "datasets": [{"label": "Schadensfälle", "data": [40, 46, 52]}],
            },
            {
                "type": "bar",
                "title": "Ø Schadenhöhe je Fall",
                "unit": "Tsd. €",
                "labels": ["2019", "2022", "2025"],
                "datasets": [{"label": "Schadenhöhe", "data": [3.0, 3.8, 5.0]}],
            },
        ],
        "info": [
            "Prämieneinnahmen: 2019: 180 Mio. €, 2025: 260 Mio. €.",
            "Verwaltungs- und Vertriebskosten: ~20 % der Prämien. Eine Combined Ratio über 100 % bedeutet versicherungstechnischen Verlust.",
        ],
        "questions": [
            {
                "text": "Wie haben sich die gesamten Schadenszahlungen von 2019 auf 2025 entwickelt?",
                "solution": "Mehr als verdoppelt: von 120 auf 260 Mio. € (+117 %).",
                "calc": "2019: 40 Tsd. × 3,0 Tsd. € = 120 Mio. €; 2025: 52 × 5,0 = 260 Mio. €.",
            },
            {
                "text": "Wie steht die Sparte 2025 da (Combined Ratio), verglichen mit 2019?",
                "solution": "2025: ~120 % (Schäden = 100 % der Prämien + ~20 % Kosten) → klarer versicherungstechnischer Verlust. 2019 lag sie noch bei ~87 %.",
                "calc": "2025: 260 ÷ 260 = 100 % + 20 % = 120 %. 2019: 120 ÷ 180 ≈ 67 % + 20 % ≈ 87 %.",
            },
        ],
        "reference": "- Doppelter Gegenwind: Fallzahlen +30 % (40 → 52 Tsd.) UND Ø-Schadenhöhe +67 % (3,0 → 5,0 Tsd. €).\n- Beide Effekte multiplizieren sich: Schadenszahlungen wachsen auf das 2,2-Fache (120 → 260 Mio. €) — die Prämien nur um +44 %.\n- Die Sparte rutscht von ~87 % auf ~120 % Combined Ratio — aus solidem Gewinn wird deutlicher Verlust.\n- So what: Prämien risikogerecht anheben, Selbstbehalte und Tarifstruktur anpassen, Schadensteuerung (z.B. Partnerwerkstätten) ausbauen.",
    },
    {
        "chart_type": "combo",
        "title": "GastroGruppe – Exhibit 2",
        "prompt": "Eine Restaurantgruppe betreibt zwei Konzepte und diskutiert, wohin das Expansionskapital fließen soll.",
        "exhibits": [
            {
                "type": "table",
                "title": "Kennzahlen je Konzept (2025)",
                "unit_note": None,
                "columns": ["Casual Dining", "Fine Dining"],
                "rows": [
                    {"label": "Anzahl Restaurants", "values": [40, 10]},
                    {"label": "Umsatz je Restaurant (Mio. €)", "values": ["1,2", "2,0"]},
                    {"label": "EBITDA-Marge", "values": ["12 %", "4 %"], "style": "bold"},
                ],
            },
            {
                "type": "bar",
                "title": "EBITDA je Fine-Dining-Restaurant",
                "unit": "Tsd. €",
                "labels": ["2023", "2024", "2025"],
                "datasets": [{"label": "EBITDA je Haus", "data": [200, 130, 80]}],
            },
        ],
        "info": [
            "Fine-Dining-Kostentreiber: Personalkosten +25 % seit 2023 (Fachkräftemangel).",
            "Zwei der zehn Fine-Dining-Standorte machen bereits Verlust.",
            "Das Casual-Konzept ist standardisiert und skaliert über eine Zentralküche.",
        ],
        "questions": [
            {
                "text": "Wie viel EBITDA liefert jedes Konzept 2025 insgesamt?",
                "solution": "Casual: ~5,8 Mio. € (40 × 1,2 Mio. × 12 %); Fine Dining: 0,8 Mio. € (10 × 2,0 Mio. × 4 %).",
                "calc": "40 × 1,2 × 0,12 = 5,76 Mio. €; 10 × 2,0 × 0,04 = 0,8 Mio. €.",
            },
            {
                "text": "Der Fine-Dining-Trend (−~60 Tsd. € EBITDA je Haus und Jahr) hält an. Was heißt das für 2026 — und strategisch?",
                "solution": "EBITDA je Haus fällt Richtung ~20 Tsd. € → die Sparte landet nahe Null bzw. im Verlust. Strategisch: Portfolio bereinigen (Verluststandorte schließen/umflaggen) und das Kapital ins skalierbare Casual-Konzept lenken.",
                "calc": "Trend: 200 → 130 → 80 (Ø −60 p.a.); 80 − 60 = 20 Tsd. € je Haus × 10 Häuser = 0,2 Mio. € — vor Zentralkosten, mit zwei Häusern bereits im Minus.",
            },
        ],
        "reference": "- Casual trägt das Ergebnis: ~5,8 von 6,6 Mio. € EBITDA (~88 %) — trotz kleinerer Häuser.\n- Fine Dining erodiert schnell: EBITDA je Haus 200 → 80 Tsd. € in zwei Jahren, Haupttreiber Personalkosten (+25 %).\n- Der Trend zeigt für 2026 Richtung Null; zwei Standorte sind schon defizitär.\n- So what: Fine-Dining-Portfolio bereinigen (schließen, umflaggen, Preise testen) und Expansionskapital ins standardisierte Casual-Konzept geben.",
    },
]
