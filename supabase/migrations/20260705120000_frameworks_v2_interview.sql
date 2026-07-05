-- ============================================================
-- Frameworks Drill v2: Interview-Modus (Casebook-Format)
--
-- 1. Neue Spalten:
--    - clarifying_qa jsonb: [{q, a}] — Fakten, die der KI-Interviewer
--      NUR auf entsprechende Rückfragen preisgibt (Casebook-Prinzip
--      "Provide this only if corresponding questions are asked").
--    - interviewer_notes text: Hinweise für Interviewer/Bewertung
--      (was ein guter Kandidat abdecken sollte, Kern-Hebel).
-- 2. Schwierigkeit "easy" wird abgeschafft (Cases bleiben, inaktiv).
-- 3. 8 neue medium + 8 neue hard Cases im Casebook-Stil, komplett
--    ausgestattet (Q&A, reference_solution, reference_tree mit
--    Bullets, interviewer_notes).
-- ============================================================

ALTER TABLE public.framework_cases
  ADD COLUMN IF NOT EXISTS clarifying_qa jsonb,
  ADD COLUMN IF NOT EXISTS interviewer_notes text;

UPDATE public.framework_cases SET active = false WHERE difficulty = 'easy';

-- ────────────────────────────────────────────────────────────
-- MEDIUM (8 neue Cases)
-- ────────────────────────────────────────────────────────────

INSERT INTO public.framework_cases
  (difficulty, category, prompt, context_info, recommended_framework, reference_solution, reference_tree, clarifying_qa, interviewer_notes, active)
VALUES
(
  'medium', 'profitability',
  $tx$Dein Klient ist MoccaRoyal, eine Kaffeehauskette mit 45 Filialen in deutschen Innenstädten. Die Umsätze sind seit drei Jahren stabil, aber der Gewinn ist im gleichen Zeitraum deutlich gesunken. Die Geschäftsführung bittet dich um eine strukturierte Analyse: Woran liegt es, und was soll sie tun?$tx$,
  NULL,
  'Profitability Framework',
  $tx$• Umsatzseite: Preis (letzte Erhöhung vor 2 Jahren), Mix (Getränke vs. Food), Frequenz je Filiale prüfen
• Kostenseite: Wareneinsatz (Kaffee-/Milchpreise gestiegen), Personal (Tariferhöhungen), Mieten (indexiert) aufschlüsseln
• Filialportfolio: Innenstadtlagen vs. Nebenlagen vergleichen — Problem konzentriert sich auf Toplagen
• Maßnahmen: kurzfristig (Preisarchitektur, Einkauf, Personaleinsatzplanung) vs. strukturell (Mietverhandlung, Formatanpassung, Portfoliobereinigung)$tx$,
  $qa$[
    {"id":"m1","title":"Umsatzseite","bulletPoints":[{"id":"m1b1","text":"Preise: letzte Erhöhung vor 2 Jahren — Spielraum?"},{"id":"m1b2","text":"Produktmix: Getränke vs. Food, Marge je Kategorie"},{"id":"m1b3","text":"Frequenz & Bon je Filiale im Zeitverlauf"}],"children":[]},
    {"id":"m2","title":"Kostenseite","isPriority":true,"bulletPoints":[{"id":"m2b1","text":"Wareneinsatz: Kaffee-/Milchpreise, Einkaufskonditionen"},{"id":"m2b2","text":"Personal: Tarifsteigerungen, Einsatzplanung vs. Frequenz"},{"id":"m2b3","text":"Miete & Nebenkosten: Indexierung, Laufzeiten"}],"children":[]},
    {"id":"m3","title":"Filialportfolio","bulletPoints":[{"id":"m3b1","text":"Profitabilität je Filiale/Lage clustern"},{"id":"m3b2","text":"Toplagen vs. Nebenlagen: Miete pro m² vs. Umsatz"}],"children":[]},
    {"id":"m4","title":"Maßnahmen & Priorisierung","bulletPoints":[{"id":"m4b1","text":"Kurzfristig: Preisarchitektur, Einkauf bündeln, Schichtplanung"},{"id":"m4b2","text":"Strukturell: Mietverhandlungen, kleinere Formate, Schließungen"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Ziel des Klienten?","a":"Die Marge soll innerhalb von zwei Jahren wieder das Niveau von vor drei Jahren erreichen. Ein konkretes Zahlenziel gibt es nicht."},
    {"q":"Ist der Umsatz wirklich stabil?","a":"Ja — der Gesamtumsatz ist über die letzten drei Jahre nahezu konstant, auch je Filiale gibt es keine großen Ausreißer nach unten."},
    {"q":"Welche Kosten sind gestiegen?","a":"Vor allem Wareneinsatz (Kaffee- und Milchpreise) und Personal (Tariferhöhungen). Die Mieten sind indexiert und steigen automatisch mit der Inflation."},
    {"q":"Sind alle Filialen gleich betroffen?","a":"Nein — die Innenstadt-Toplagen sind deutlich stärker betroffen, weil dort die Mieten am stärksten gestiegen sind."},
    {"q":"Geht es den Wettbewerbern genauso?","a":"Teilweise — die Branche spürt denselben Kostendruck, aber einige Wettbewerber haben ihre Preise bereits zweimal erhöht."},
    {"q":"Wie preissensibel sind die Kunden?","a":"Dazu gibt es keine belastbaren Daten. Die letzte Preiserhöhung vor zwei Jahren hat die Frequenz nicht messbar gedrückt."}
  ]$qa$::jsonb,
  $tx$Kern des Cases: Umsatz stabil + Gewinn sinkt => Kostenproblem, kein Umsatzproblem. Ein guter Kandidat erkennt das früh (idealerweise durch Rückfragen) und legt den Schwerpunkt auf die Kostenseite plus Filial-Differenzierung (Toplagen-Mieten). Preiserhöhung als Hebel ist legitim, sollte aber gegen Preissensibilität abgewogen werden. Vollständige GuV-Zerlegung ist nicht nötig — 3-4 saubere MECE-Äste mit klarer Priorisierung reichen.$tx$,
  true
),
(
  'medium', 'market_entry',
  $tx$Dein Klient ist AlpenMilch, eine regionale Bio-Molkerei mit starker Marke. Der Kuhmilch-Absatz stagniert, und die Geschäftsführung überlegt, in den wachsenden Markt für Haferdrinks einzusteigen. Wie würdest du den Klienten beraten?$tx$,
  NULL,
  'Market Entry Framework',
  $tx$• Marktattraktivität: Marktgröße und -wachstum, Wettbewerbsintensität (etablierte Anbieter, Handelsmarken), Preisniveau
• Eigene Fähigkeiten: starke Bio-Regionalmarke und LEH-Listungen vorhanden, aber keine Hafer-Produktionsanlage
• Eintrittsoptionen: eigene Anlage (Investition), Lohnfertigung (schnell, geringere Marge), Partnerschaft/Zukauf
• Wirtschaftlichkeit & Risiken: Kannibalisierung der Milchprodukte, Investitionsbedarf, Break-even, Markenpassung$tx$,
  $qa$[
    {"id":"e1","title":"Marktattraktivität","bulletPoints":[{"id":"e1b1","text":"Marktgröße & Wachstum Haferdrinks"},{"id":"e1b2","text":"Wettbewerber & Handelsmarken, Preisniveau"},{"id":"e1b3","text":"Kundensegmente & Kaufkriterien (bio, regional?)"}],"children":[]},
    {"id":"e2","title":"Eigene Fähigkeiten","isPriority":true,"bulletPoints":[{"id":"e2b1","text":"Marke: Bio-/Regional-Image übertragbar?"},{"id":"e2b2","text":"Vertrieb: bestehende LEH-Listungen nutzbar"},{"id":"e2b3","text":"Produktion: keine Hafer-Anlage — Lücke"}],"children":[]},
    {"id":"e3","title":"Eintrittsoptionen","bulletPoints":[{"id":"e3b1","text":"Eigene Anlage bauen (Capex, Dauer)"},{"id":"e3b2","text":"Lohnfertigung (schnell, margenschwächer)"},{"id":"e3b3","text":"Partnerschaft oder Zukauf"}],"children":[]},
    {"id":"e4","title":"Wirtschaftlichkeit & Risiken","bulletPoints":[{"id":"e4b1","text":"Investment, Marge, Break-even je Option"},{"id":"e4b2","text":"Kannibalisierung des Milchgeschäfts"},{"id":"e4b3","text":"Markenrisiko bei Misserfolg"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Ziel des Klienten?","a":"Ein profitables zweites Standbein innerhalb von drei Jahren aufbauen und die Abhängigkeit von Kuhmilch reduzieren."},
    {"q":"Wie entwickelt sich der Haferdrink-Markt?","a":"Er wächst seit Jahren zweistellig, es gibt aber mehrere etablierte Marken und zunehmend günstige Handelsmarken."},
    {"q":"Kann AlpenMilch Haferdrinks selbst produzieren?","a":"Nein, dafür fehlt eine eigene Anlage. Die bestehende Abfülltechnik könnte aber teilweise genutzt werden."},
    {"q":"Wie stark ist der Vertrieb?","a":"AlpenMilch ist bei den großen regionalen LEH-Ketten gelistet und hat gute Beziehungen zum Handel."},
    {"q":"Welches Budget steht zur Verfügung?","a":"Das Budget ist begrenzt — eine große Übernahme ist ausgeschlossen, eine mittlere Investition in eine Anlage wäre denkbar."},
    {"q":"Ist die Marke auf Haferdrinks übertragbar?","a":"Erste Kundenbefragungen deuten darauf hin, dass das Bio- und Regional-Image gut zu Haferdrinks passt."}
  ]$qa$::jsonb,
  $tx$Klassischer Market Entry: Markt (attraktiv, aber kompetitiv) x Fähigkeiten (Marke+Vertrieb stark, Produktion fehlt) x Eintrittsweg. Ein guter Kandidat behandelt alle drei Dimensionen und leitet die Eintrittsoption aus der Produktionslücke ab (Lohnfertigung als pragmatischer Start ist eine naheliegende Empfehlung, aber jede begründete Option zählt). Kannibalisierung sollte mindestens als Risiko genannt werden.$tx$,
  true
),
(
  'medium', 'growth',
  $tx$Dein Klient ist LinguaFox, eine Sprachlern-App aus München. Nach Jahren mit starkem Wachstum stagnieren Nutzerzahlen und Umsatz seit zwei Quartalen. Der Gründer bittet dich, Wachstumshebel strukturiert zu erarbeiten.$tx$,
  NULL,
  'Growth Framework (Ansoff-Logik)',
  $tx$• Bestandskunden: Churn nach Monat 3 senken (Engagement, Streaks, Community), Free-to-Paid-Conversion (4%) verbessern, Preis-/Pakettests
• Neukundengewinnung: neue Kanäle und Segmente im DACH-Markt (Performance, Partnerschaften, Schulen)
• Neue Produkte: B2B-Angebot für Unternehmen, Zertifikatskurse, weitere Sprachen
• Neue Märkte: Expansion über DACH hinaus — gegen starke internationale Wettbewerber abwägen$tx$,
  $qa$[
    {"id":"g1","title":"Bestandskunden monetarisieren","isPriority":true,"bulletPoints":[{"id":"g1b1","text":"Churn nach Monat 3 senken (Engagement, Habit-Features)"},{"id":"g1b2","text":"Conversion Free→Paid (aktuell 4%) verbessern"},{"id":"g1b3","text":"Pricing & Pakete testen (Jahresabo, Familie)"}],"children":[]},
    {"id":"g2","title":"Neukunden DACH","bulletPoints":[{"id":"g2b1","text":"Kanal-Mix: Performance, ASO, Influencer, Referral"},{"id":"g2b2","text":"Neue Segmente: Schüler, Berufspendler, 50+"}],"children":[]},
    {"id":"g3","title":"Neue Produkte","bulletPoints":[{"id":"g3b1","text":"B2B: Firmenlizenzen, Weiterbildungsbudgets"},{"id":"g3b2","text":"Zertifikate & Prüfungsvorbereitung"},{"id":"g3b3","text":"Neue Sprachen / Content-Tiefe"}],"children":[]},
    {"id":"g4","title":"Neue Märkte","bulletPoints":[{"id":"g4b1","text":"Expansion außerhalb DACH: Attraktivität vs. Wettbewerb"},{"id":"g4b2","text":"Lokalisierungskosten & Fokusrisiko"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Ziel — Nutzer oder Umsatz?","a":"Am Ende zählt der Umsatz. Nutzerwachstum ist Mittel zum Zweck."},
    {"q":"Wie verdient LinguaFox Geld?","a":"Freemium-Modell: Die App ist gratis, ein Premium-Abo schaltet alle Inhalte frei. Rund 4% der aktiven Nutzer zahlen."},
    {"q":"Wie ist die Kundenbindung?","a":"Der Churn ist hoch: Ein großer Teil der Nutzer wird nach etwa drei Monaten inaktiv."},
    {"q":"In welchen Märkten ist die App aktiv?","a":"Bisher nur im DACH-Raum, App und Marketing sind auf Deutsch ausgerichtet."},
    {"q":"Wer sind die Wettbewerber?","a":"Zwei große internationale Apps dominieren weltweit; im DACH-Raum ist LinguaFox aber unter den Top 3."},
    {"q":"Gibt es schon B2B-Kunden?","a":"Nein, bisher reines B2C-Geschäft. Es gab aber vereinzelt Anfragen von Unternehmen."}
  ]$qa$::jsonb,
  $tx$Wachstums-Case mit Ansoff-Logik. Ein guter Kandidat trennt sauber Bestandskunden (Retention/Conversion — bei 4% Conversion und hohem Churn der größte Hebel) von Neukunden, neuen Produkten (B2B-Anfragen existieren bereits!) und neuen Märkten. Priorisierung auf Retention/Monetarisierung ist die stärkste Antwort, aber jede klar begründete Priorisierung zählt. Internationale Expansion sollte kritisch gegen die starken Wettbewerber abgewogen werden.$tx$,
  true
),
(
  'medium', 'ma',
  $tx$Dein Klient ist ein mittelständischer Maschinenbauer für Verpackungsanlagen. Er überlegt, einen unabhängigen Service-Spezialisten mit 40 Technikern zu übernehmen, um sein Servicegeschäft auszubauen. Wie gehst du strukturiert an die Bewertung dieser Übernahme heran?$tx$,
  NULL,
  'M&A Framework',
  $tx$• Strategischer Fit: Serviceanteil und wiederkehrende Umsätze erhöhen, Kundenbindung, Abdeckung installierte Basis
• Standalone-Attraktivität: Profitabilität und Kundenstamm des Targets, Abhängigkeit von Schlüsselpersonen
• Synergien & Risiken: Cross-Selling in eigene installierte Basis, Auslastung der Techniker; Risiko Technikerabwanderung, Kulturunterschied
• Deal: Bewertung/Preis, Alternativen (organischer Aufbau dauert 5+ Jahre), Integrationsplan, Bindung der Schlüsselkräfte$tx$,
  $qa$[
    {"id":"a1","title":"Strategischer Fit","bulletPoints":[{"id":"a1b1","text":"Passt Service-Ausbau zur Strategie? (wiederkehrende Umsätze)"},{"id":"a1b2","text":"Überlappung mit eigener installierter Basis"}],"children":[]},
    {"id":"a2","title":"Attraktivität des Targets","bulletPoints":[{"id":"a2b1","text":"Umsatz, Marge, Vertragsstruktur (Wartungsverträge?)"},{"id":"a2b2","text":"Kundenstamm & Konzentration"},{"id":"a2b3","text":"Abhängigkeit von Gründer/Schlüsseltechnikern"}],"children":[]},
    {"id":"a3","title":"Synergien & Risiken","isPriority":true,"bulletPoints":[{"id":"a3b1","text":"Cross-Selling: Service für eigene Anlagenflotte"},{"id":"a3b2","text":"Technikerauslastung & Gebietsabdeckung"},{"id":"a3b3","text":"Risiko: Technikerabwanderung nach Übernahme"}],"children":[]},
    {"id":"a4","title":"Deal & Integration","bulletPoints":[{"id":"a4b1","text":"Preis & Bewertungslogik, Earn-out"},{"id":"a4b2","text":"Alternative: organischer Aufbau (5+ Jahre)"},{"id":"a4b3","text":"Integrationsplan & Retention-Pakete"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Ziel der Übernahme?","a":"Das Servicegeschäft mit wiederkehrenden Umsätzen deutlich ausbauen — heute macht Service nur einen kleinen Teil des Umsatzes aus."},
    {"q":"Wie steht das Target wirtschaftlich da?","a":"Es ist seit Jahren profitabel, hat rund 40 Techniker und einen treuen Kundenstamm, der sich stark mit der Kundenbasis des Klienten überschneidet."},
    {"q":"Gibt es schon einen Kaufpreis?","a":"Nein, es gab erst Vorgespräche. Zuerst soll der strategische Fit bewertet werden."},
    {"q":"Gibt es Alternativen zur Übernahme?","a":"Ein organischer Aufbau wurde geprüft — er würde nach interner Schätzung über fünf Jahre dauern, vor allem wegen des Technikermangels."},
    {"q":"Gibt es kartellrechtliche Bedenken?","a":"Nein, beide Unternehmen sind dafür zu klein."},
    {"q":"Woran könnte der Deal scheitern?","a":"Das größte Risiko sehen alle Beteiligten darin, dass Techniker nach der Übernahme abwandern — sie sind der eigentliche Wert des Unternehmens."}
  ]$qa$::jsonb,
  $tx$M&A-Grundgerüst: strategische Logik, Target-Qualität, Synergien/Risiken, Deal. Ein guter Kandidat erkennt, dass der Wert in den Technikern steckt (Retention = Kernrisiko) und dass die Alternative "organisch aufbauen" am Technikermangel scheitert. Bewertungsdetails (DCF etc.) sind NICHT gefordert — die Struktur zählt.$tx$,
  true
),
(
  'medium', 'pricing',
  $tx$Dein Klient betreibt einen großen Freizeitpark. Es gibt einen Einheitspreis an der Tageskasse und eine einfache Saisonkarte. Der CEO fragt dich: Wie sollten wir unser Preismodell weiterentwickeln, um den Umsatz zu steigern, ohne Besucher zu verlieren?$tx$,
  NULL,
  'Pricing Framework',
  $tx$• Preisdifferenzierung: nach Zeit (Wochentag/Saison — Auslastung unter der Woche schwach), Segment (Familien, Jugendliche, Touristen), Kanal (online vs. Kasse)
• Zahlungsbereitschaft & Elastizität: Segmente unterscheiden sich stark; Wettbewerbspreise als Anker
• Zusatzerlöse: Fast-Pass/Priority, F&B-Bundles, Parken, Hotelpakete
• Risiken: Fairness-Wahrnehmung, Kannibalisierung der Saisonkarte, Komplexität an der Kasse$tx$,
  $qa$[
    {"id":"p1","title":"Preisdifferenzierung","isPriority":true,"bulletPoints":[{"id":"p1b1","text":"Zeitlich: Wochentag vs. Wochenende, Saison, dynamisch"},{"id":"p1b2","text":"Segmente: Familien, Jugendliche, Touristen, Gruppen"},{"id":"p1b3","text":"Kanal: Online-Vorverkauf vs. Tageskasse"}],"children":[]},
    {"id":"p2","title":"Zahlungsbereitschaft","bulletPoints":[{"id":"p2b1","text":"Elastizität je Segment (Daten? Tests?)"},{"id":"p2b2","text":"Wettbewerbspreise als Referenz"}],"children":[]},
    {"id":"p3","title":"Zusatzerlöse & Produkte","bulletPoints":[{"id":"p3b1","text":"Fast-Pass / Priority-Angebote"},{"id":"p3b2","text":"Bundles: Eintritt+F&B, Familienpakete, Hotel"},{"id":"p3b3","text":"Saisonkarten-Staffelung"}],"children":[]},
    {"id":"p4","title":"Risiken & Umsetzung","bulletPoints":[{"id":"p4b1","text":"Fairness-Wahrnehmung & Kommunikation"},{"id":"p4b2","text":"Kannibalisierung & Komplexität"},{"id":"p4b3","text":"Stufenweiser Rollout, A/B-Tests"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Ziel genau?","a":"Mehr Umsatz pro Jahr — aber die Besucherzahlen sollen mindestens stabil bleiben, der Park lebt auch vom vollen Eindruck."},
    {"q":"Wie ist die Auslastung verteilt?","a":"An Wochenenden und in den Ferien ist der Park voll, an normalen Wochentagen deutlich unter Kapazität."},
    {"q":"Welche Kundensegmente gibt es?","a":"Vor allem Familien aus der Region, Jugendliche/junge Erwachsene und Touristen. Die Segmente reagieren unterschiedlich auf Preise, genaue Daten fehlen aber."},
    {"q":"Was macht der Wettbewerb?","a":"Zwei vergleichbare Parks in zwei Stunden Entfernung haben ähnliche Preise; einer testet gerade Online-Frühbucherrabatte."},
    {"q":"Wie hoch ist der Anteil Online-Verkauf?","a":"Etwa ein Drittel der Tickets wird online gekauft, der Rest an der Tageskasse."},
    {"q":"Gibt es Zusatzerlöse im Park?","a":"Ja — Gastronomie und Merchandising machen einen relevanten Umsatzanteil aus, Parken ist kostenpflichtig. Einen Fast-Pass gibt es nicht."}
  ]$qa$::jsonb,
  $tx$Pricing-Case mit klarem Differenzierungshebel: schwache Wochentagsauslastung => zeitliche Preisdifferenzierung/Online-Steuerung liegt nahe; dazu Segment-Pricing und Zusatzprodukte (Fast-Pass fehlt bislang!). Ein guter Kandidat strukturiert nach Differenzierungsdimensionen + Zahlungsbereitschaft + Risiken. Konkrete Preishöhen sind nicht gefordert.$tx$,
  true
),
(
  'medium', 'operations',
  $tx$Dein Klient ist ein Online-Fashion-Händler mit einem Zentrallager in Süddeutschland. Kunden beschweren sich über Lieferzeiten, und die Logistikkosten pro Bestellung steigen. Der COO möchte von dir eine strukturierte Analyse der Logistik.$tx$,
  NULL,
  'Operations Framework (E2E-Logistik)',
  $tx$• Lager & Netzwerk: ein Zentrallager im Süden benachteiligt den Norden; Prozesse im Lager (Pick/Pack-Effizienz, Automatisierung)
• Versand & letzte Meile: Abhängigkeit von einem Hauptcarrier, Cut-off-Zeiten, Carrier-Mix
• Retouren: Fashion-typisch hohe Quote — Prävention (Größenberatung, Produktdaten) und effiziente Abwicklung
• Planung: Bestands- und Peak-Planung (Q4 doppeltes Volumen), Forecast-Qualität$tx$,
  $qa$[
    {"id":"o1","title":"Lager & Netzwerk","isPriority":true,"bulletPoints":[{"id":"o1b1","text":"Standortstruktur: 1 Zentrallager Süd vs. 2. Standort/Norden"},{"id":"o1b2","text":"Lagerprozesse: Pick/Pack-Zeiten, Automatisierungsgrad"},{"id":"o1b3","text":"Cut-off-Zeit für Same-Day-Versand"}],"children":[]},
    {"id":"o2","title":"Versand & letzte Meile","bulletPoints":[{"id":"o2b1","text":"Carrier-Strategie: ein Hauptdienstleister = Risiko"},{"id":"o2b2","text":"Laufzeiten je Region messen"},{"id":"o2b3","text":"Kosten je Sendung, Verträge"}],"children":[]},
    {"id":"o3","title":"Retouren","bulletPoints":[{"id":"o3b1","text":"Prävention: Größenberatung, Bilder, Bewertungen"},{"id":"o3b2","text":"Abwicklung: Durchlaufzeit, Wiedereinlagerung"},{"id":"o3b3","text":"Retourenkosten je Bestellung"}],"children":[]},
    {"id":"o4","title":"Planung & Peaks","bulletPoints":[{"id":"o4b1","text":"Forecast-Qualität, Bestandsverteilung"},{"id":"o4b2","text":"Q4-Peak: Kapazität, Zeitarbeit, Priorisierung"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Ziel?","a":"Lieferzeit von heute durchschnittlich 4 Tagen auf 2 Tage senken — bei stabilen Logistikkosten pro Bestellung."},
    {"q":"Wie ist das Logistiknetz aufgebaut?","a":"Ein einziges Zentrallager in Süddeutschland, alle Bestellungen laufen darüber. Kunden in Norddeutschland warten am längsten."},
    {"q":"Wie hoch ist die Retourenquote?","a":"Fashion-typisch hoch — etwa die Hälfte der bestellten Artikel kommt zurück, die Abwicklung dauert im Schnitt eine Woche."},
    {"q":"Mit welchen Paketdiensten wird versendet?","a":"Fast alles läuft über einen einzigen Hauptcarrier; ein zweiter wird nur für Sperrgut genutzt."},
    {"q":"Gibt es saisonale Spitzen?","a":"Ja, im vierten Quartal verdoppelt sich das Volumen — dann brechen Lieferzeiten regelmäßig ein."},
    {"q":"Wie modern ist das Lager?","a":"Überwiegend manuelle Prozesse, die Kommissionierwege sind lang. Eine Automatisierung wurde noch nie geprüft."}
  ]$qa$::jsonb,
  $tx$End-to-End-Logistik-Case. Gute Antworten decken Lager/Netzwerk, Versand/Carrier, Retouren und Planung/Peaks ab. Der stärkste Einzelhebel ist die Netzwerkfrage (zweiter Standort/Norden) plus Carrier-Diversifizierung — aber jede MECE-Struktur entlang der Lieferkette zählt. Retouren gehören bei Fashion zwingend in die Struktur.$tx$,
  true
),
(
  'medium', 'profitability',
  $tx$Dein Klient ist PumpHouse, eine Fitnessstudio-Kette mit 12 Studios. Zehn Studios laufen gut, zwei schreiben seit zwei Jahren Verluste. Der CEO fragt: Was sollen wir mit den beiden Studios machen?$tx$,
  NULL,
  'Profitability / Turnaround Framework',
  $tx$• Diagnose je Studio: Umsatz (Mitglieder, Beitrag je Mitglied) vs. Kosten (Miete, Personal, Betrieb) im Vergleich zu den 10 profitablen Studios
• Standortfaktoren: Lage, Einzugsgebiet, Wettbewerbsdichte, Demografie
• Turnaround-Optionen: Mitgliederwachstum (Marketing, Angebot), Kostensenkung (Fläche, Öffnungszeiten), Mietneuverhandlung
• Exit-Optionen: Schließung (Mietvertrag läuft noch 4 Jahre!), Untervermietung, Verkauf, Umwandlung des Formats$tx$,
  $qa$[
    {"id":"f1","title":"Diagnose: Warum defizitär?","isPriority":true,"bulletPoints":[{"id":"f1b1","text":"Umsatz: Mitgliederzahl & Beitrag vs. Benchmark-Studios"},{"id":"f1b2","text":"Kosten: Miete, Personal, Betrieb im Vergleich"},{"id":"f1b3","text":"Entwicklung über Zeit: strukturell oder temporär?"}],"children":[]},
    {"id":"f2","title":"Standortfaktoren","bulletPoints":[{"id":"f2b1","text":"Einzugsgebiet, Lage, Erreichbarkeit"},{"id":"f2b2","text":"Wettbewerbsdichte (Discount-Ketten?)"}],"children":[]},
    {"id":"f3","title":"Turnaround-Optionen","bulletPoints":[{"id":"f3b1","text":"Mitglieder gewinnen: lokales Marketing, Kurse, Firmenkunden"},{"id":"f3b2","text":"Kosten senken: Fläche, Öffnungszeiten, Personalmix"},{"id":"f3b3","text":"Miete neu verhandeln"}],"children":[]},
    {"id":"f4","title":"Exit-Optionen","bulletPoints":[{"id":"f4b1","text":"Schließung: Mietvertrag 4 Jahre Restlaufzeit => Kosten"},{"id":"f4b2","text":"Untervermietung / Verkauf / Formatwechsel"},{"id":"f4b3","text":"Entscheidungslogik: Turnaround-Potenzial vs. Exit-Kosten"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Warum sind die beiden Studios defizitär?","a":"Das ist genau die Frage — bekannt ist: Beide haben deutlich weniger Mitglieder als der Durchschnitt und überdurchschnittlich hohe Mieten."},
    {"q":"Sind die Preise überall gleich?","a":"Ja, PumpHouse hat bundesweit einheitliche Mitgliedsbeiträge."},
    {"q":"Wie lange laufen die Mietverträge?","a":"In beiden defizitären Studios noch vier Jahre, ohne Sonderkündigungsrecht."},
    {"q":"Wie sieht der Wettbewerb an den Standorten aus?","a":"An beiden Standorten haben in den letzten drei Jahren Discount-Ketten eröffnet, die deutlich günstiger sind."},
    {"q":"Wie stehen die anderen 10 Studios da?","a":"Solide profitabel — sie haben im Schnitt fast doppelt so viele Mitglieder pro Quadratmeter."},
    {"q":"Gibt es ein Zielvorgabe des CEO?","a":"Innerhalb von 18 Monaten sollen beide Studios eine klare Perspektive haben: profitabel oder Exit."}
  ]$qa$::jsonb,
  $tx$Turnaround-Entscheidungscase. Die stärkste Struktur trennt Diagnose (warum defizitär: Mitgliederzahl + hohe Miete + Discount-Wettbewerb) von Turnaround-Optionen und Exit-Optionen — und benennt die 4-jährige Mietbindung als zentrale Restriktion der Schließung. Eine reine GuV-Analyse ohne Optionen-Teil ist unvollständig.$tx$,
  true
),
(
  'medium', 'growth',
  $tx$Dein Klient ist HeizWerk, ein regionaler Heizungs- und Sanitärbetrieb mit 35 Mitarbeitern. Durch den Wärmepumpen-Boom übersteigt die Nachfrage die Kapazität deutlich — Kunden warten vier Monate. Der Inhaber will das Unternehmen in fünf Jahren verdoppeln. Wie strukturierst du das Wachstum?$tx$,
  NULL,
  'Growth Framework (kapazitätsgetrieben)',
  $tx$• Kapazität & Fachkräfte: Engpass Nr. 1 — Rekrutierung, Ausbildung, Bindung, Subunternehmer
• Angebot & Fokus: Wärmepumpen priorisieren (Marge, Nachfrage), Wartungsverträge als wiederkehrender Umsatz
• Kunden & Kanäle: Auftragsselektion (profitabelste Projekte), Gewerbekunden, Partnerschaften (Energieberater, Stadtwerke)
• Prozesse & Skalierung: Standardisierung der Installation, Digitalisierung (Planung, Doku), Einkauf$tx$,
  $qa$[
    {"id":"h1","title":"Kapazität & Fachkräfte","isPriority":true,"bulletPoints":[{"id":"h1b1","text":"Rekrutierung & Ausbildung (eigene Azubis, Quereinsteiger)"},{"id":"h1b2","text":"Mitarbeiterbindung: Lohn, Kultur, Ausstattung"},{"id":"h1b3","text":"Subunternehmer & Partnerbetriebe"}],"children":[]},
    {"id":"h2","title":"Angebot & Fokus","bulletPoints":[{"id":"h2b1","text":"Fokus Wärmepumpe: höchste Nachfrage & Marge"},{"id":"h2b2","text":"Wartungsverträge: wiederkehrender Umsatz"},{"id":"h2b3","text":"Unrentable Kleinaufträge reduzieren"}],"children":[]},
    {"id":"h3","title":"Kunden & Kanäle","bulletPoints":[{"id":"h3b1","text":"Auftragsselektion nach Marge/Auslastung"},{"id":"h3b2","text":"Gewerbe & Wohnungswirtschaft als Großkunden"},{"id":"h3b3","text":"Partnerschaften: Energieberater, Stadtwerke, Hersteller"}],"children":[]},
    {"id":"h4","title":"Prozesse & Skalierung","bulletPoints":[{"id":"h4b1","text":"Standardisierte Installationspakete"},{"id":"h4b2","text":"Digitale Planung & Baustellendoku"},{"id":"h4b3","text":"Einkauf & Lagerhaltung professionalisieren"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was genau soll sich verdoppeln?","a":"Der Umsatz — bei mindestens gleichbleibender Marge. Der Inhaber will kein Wachstum um jeden Preis."},
    {"q":"Was ist der Engpass?","a":"Eindeutig Fachkräfte: Monteure und Meister sind kaum zu bekommen, der Markt ist leergefegt."},
    {"q":"Wie profitabel sind die Aufträge?","a":"Wärmepumpen-Projekte haben die beste Marge, klassische Kleinreparaturen sind kaum kostendeckend."},
    {"q":"Wie ist die Region abgegrenzt?","a":"Großraum plus etwa 50 km Umkreis. Eine geografische Expansion ist denkbar, aber nicht zwingend."},
    {"q":"Gibt es wiederkehrende Umsätze?","a":"Bisher wenig — Wartungsverträge existieren nur vereinzelt und unsystematisch."},
    {"q":"Wie läuft die Auftragsannahme?","a":"First come, first served — es gibt keine Priorisierung nach Auftragsgröße oder Marge."}
  ]$qa$::jsonb,
  $tx$Wachstum bei Überlastung: Der Kandidat sollte erkennen, dass NICHT Nachfrage, sondern Kapazität (Fachkräfte) der Engpass ist — Wachstumshebel müssen daran ansetzen (Rekrutierung/Bindung, Subunternehmer, Prozesseffizienz, Auftragsselektion/Pricing). Eine klassische "mehr Marketing"-Struktur geht am Case vorbei. Wartungsverträge als wiederkehrender Umsatz sind ein Plus.$tx$,
  true
);

-- ────────────────────────────────────────────────────────────
-- HARD (8 neue Cases)
-- ────────────────────────────────────────────────────────────

INSERT INTO public.framework_cases
  (difficulty, category, prompt, context_info, recommended_framework, reference_solution, reference_tree, clarifying_qa, interviewer_notes, active)
VALUES
(
  'hard', 'profitability',
  $tx$Dein Klient ist ein Regionalflughafen mit 1,2 Mio. Passagieren pro Jahr. Er ist seit Jahren defizitär und wurde bisher von der öffentlichen Hand bezuschusst — diese Zuschüsse laufen in drei Jahren aus. Der Aufsichtsrat beauftragt dich mit einer strukturierten Analyse: Wie kann der Flughafen den Break-even erreichen?$tx$,
  NULL,
  'Profitability / Turnaround Framework',
  $tx$• Aviation-Erlöse (60%): Airline-Portfolio (70% Volumen bei einer Low-Cost-Airline = Klumpenrisiko), Entgelte, neue Strecken/Frequenzen
• Non-Aviation-Erlöse (40%): Parken, Retail/Gastro, Immobilienentwicklung auf Flughafengelände — oft der realistischere Hebel
• Kostenstruktur: hoher Fixkostenanteil (Sicherheit, Infrastruktur), Auslagerung, Betriebszeiten-Anpassung
• Strategische Optionen & Stakeholder: Fracht/Spezialisierung, Verhandlung über Auslauf der Zuschüsse, Teilschließung/Redimensionierung — politisch heikel$tx$,
  $qa$[
    {"id":"r1","title":"Aviation-Erlöse","bulletPoints":[{"id":"r1b1","text":"Airline-Abhängigkeit: 70% Volumen bei einem Low-Cost-Carrier"},{"id":"r1b2","text":"Entgeltstruktur & Verhandlungsmacht"},{"id":"r1b3","text":"Neue Strecken/Frequenzen realistisch?"}],"children":[]},
    {"id":"r2","title":"Non-Aviation-Erlöse","isPriority":true,"bulletPoints":[{"id":"r2b1","text":"Parken: Preise, Produkte, Auslastung"},{"id":"r2b2","text":"Retail & Gastro: Flächen, Konzepte, Pacht"},{"id":"r2b3","text":"Immobilien: Gewerbeflächen, Logistikansiedlung"}],"children":[]},
    {"id":"r3","title":"Kostenstruktur","bulletPoints":[{"id":"r3b1","text":"Fixkosten: Sicherheit, Winterdienst, Infrastruktur"},{"id":"r3b2","text":"Variabilisierung: Outsourcing, Betriebszeiten"},{"id":"r3b3","text":"Investitionsstau vs. Sparzwang"}],"children":[]},
    {"id":"r4","title":"Strategische Optionen","bulletPoints":[{"id":"r4b1","text":"Fracht, Wartung, Spezialverkehre als 2. Standbein"},{"id":"r4b2","text":"Redimensionierung/Teilschließung"},{"id":"r4b3","text":"Stakeholder: Politik, Region, Arbeitsplätze"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Wie setzt sich der Umsatz zusammen?","a":"Rund 60% Aviation (Start-/Lande-/Passagierentgelte), 40% Non-Aviation (Parken, Retail, Vermietung)."},
    {"q":"Wie abhängig ist der Flughafen von einzelnen Airlines?","a":"Sehr — eine Low-Cost-Airline steht für rund 70% des Passagiervolumens und verhandelt entsprechend hart bei den Entgelten."},
    {"q":"Wie entwickeln sich die Passagierzahlen?","a":"Seit der Pandemie leicht rückläufig, aktuell 1,2 Mio. pro Jahr — vor allem Urlaubsflüge, kaum Geschäftsreisende."},
    {"q":"Wie hoch ist das Defizit?","a":"Im niedrigen zweistelligen Millionenbereich pro Jahr; die Zuschüsse decken es bisher fast vollständig."},
    {"q":"Warum ist die Kostenbasis so starr?","a":"Sicherheits- und Infrastrukturauflagen gelten unabhängig vom Verkehrsaufkommen — ein Großteil der Kosten fällt auch bei weniger Flügen an."},
    {"q":"Gibt es politische Restriktionen?","a":"Ja: Das Nachtflugverbot bleibt bestehen, und eine vollständige Schließung ist politisch derzeit nicht gewollt."},
    {"q":"Gibt es Flächenreserven?","a":"Ja, erhebliche ungenutzte Flächen auf dem Gelände, die für Gewerbe oder Logistik entwickelt werden könnten."}
  ]$qa$::jsonb,
  $tx$Anspruchsvoller Turnaround mit Stakeholder-Dimension. Starke Antworten: (1) trennen Aviation/Non-Aviation und erkennen die Airline-Abhängigkeit als Risiko UND Verhandlungsthema, (2) sehen Non-Aviation/Immobilien als realistischsten Hebel, (3) adressieren die starre Kostenbasis ehrlich, (4) denken strategische Optionen inkl. Redimensionierung und Politik mit. Wer nur "mehr Passagiere gewinnen" strukturiert, verfehlt den Kern.$tx$,
  true
),
(
  'hard', 'market_entry',
  $tx$Dein Klient ist ein deutscher Premium-Küchenhersteller (Umsatz 400 Mio. EUR, Export bisher nur in EU-Nachbarländer). Der Vorstand will in den US-Markt eintreten und in fünf Jahren dort einen relevanten Umsatzanteil erreichen. Strukturiere die Entscheidungsgrundlage.$tx$,
  NULL,
  'Market Entry Framework (international)',
  $tx$• Markt & Segment: US-Küchenmarkt ist fragmentiert und regional unterschiedlich; Zielsegment Premium/Luxus definieren, Metro-Regionen priorisieren
• Go-to-Market: Vertrieb über Küchenstudios/Dealer vs. eigene Flagship-Stores vs. Partnerschaften mit Bauträgern/Architekten; Markenaufbau nötig
• Operations & Supply Chain: Lieferzeit 10 Wochen ab Werk + Fracht + Zoll (zweistelliger Preisaufschlag) — lokale Endmontage/Lager prüfen
• Business Case & Risiken: Investment, Preispositionierung gegen lokale Premium-Anbieter, Wechselkurs, Service/Montage-Qualität$tx$,
  $qa$[
    {"id":"u1","title":"Markt & Zielsegment","bulletPoints":[{"id":"u1b1","text":"Marktgröße/Wachstum Premium-Segment, Metro-Regionen"},{"id":"u1b2","text":"Wettbewerb: lokale Premium-Player, EU-Importeure"},{"id":"u1b3","text":"Kaufverhalten: Designer/Architekten als Einflussnehmer"}],"children":[]},
    {"id":"u2","title":"Go-to-Market","isPriority":true,"bulletPoints":[{"id":"u2b1","text":"Kanalwahl: Dealer-Netz vs. Flagship vs. Projektgeschäft"},{"id":"u2b2","text":"Markenaufbau: Positionierung, Referenzprojekte"},{"id":"u2b3","text":"Phasierung: 2-3 Metro-Regionen als Start"}],"children":[]},
    {"id":"u3","title":"Operations & Supply Chain","bulletPoints":[{"id":"u3b1","text":"Lieferzeit 10 Wochen + Fracht + Zoll => Wettbewerbsnachteil"},{"id":"u3b2","text":"Lokale Endmontage / Lagerhaltung / Servicepartner"},{"id":"u3b3","text":"Montage- & Servicequalität sichern"}],"children":[]},
    {"id":"u4","title":"Business Case & Risiken","bulletPoints":[{"id":"u4b1","text":"Investment & Break-even je Markteintrittsmodell"},{"id":"u4b2","text":"Preispositionierung trotz Zoll/Fracht"},{"id":"u4b3","text":"Wechselkurs-, Ramp-up- und Reputationsrisiken"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das konkrete Ziel?","a":"In fünf Jahren sollen rund 10% des Konzernumsatzes aus den USA kommen — das wären etwa 40 Mio. EUR."},
    {"q":"Wie verkauft der Klient heute?","a":"Ausschließlich über unabhängige Küchenstudios und Händler; eigene Stores gibt es nicht."},
    {"q":"Wie sieht der US-Wettbewerb aus?","a":"Stark fragmentiert: lokale Custom-Hersteller im Luxussegment, große Mittelklasse-Ketten, dazu einige europäische Importmarken in den Metropolen."},
    {"q":"Was bedeuten Zoll und Logistik für den Preis?","a":"Fracht und Einfuhrzölle erhöhen den Endpreis um einen zweistelligen Prozentsatz gegenüber dem EU-Preis."},
    {"q":"Wie lange sind die Lieferzeiten?","a":"Etwa 10 Wochen ab Werk in Deutschland — plus Seefracht. US-Premium-Kunden sind kürzere Zeiten gewohnt."},
    {"q":"Ist lokale Produktion eine Option?","a":"Ein eigenes US-Werk ist in den ersten Jahren ausgeschlossen; denkbar wären ein Auslieferungslager und lokale Endmontage."},
    {"q":"Gibt es schon US-Erfahrung im Team?","a":"Nein, keine eigene Organisation vor Ort. Einzelne Projektanfragen aus den USA wurden bisher ad hoc bedient."}
  ]$qa$::jsonb,
  $tx$Komplexer internationaler Markteintritt. Starke Antworten segmentieren den Markt (Premium, Metro-Regionen), treffen eine begründete Kanalentscheidung, nehmen die Supply-Chain-Realität ernst (Lieferzeit/Zoll => lokale Montage/Lager) und phasieren den Eintritt. Wer Operations komplett ignoriert oder "einfach Flagship-Stores eröffnen" ohne Business-Case-Denken vorschlägt, bleibt unter den Erwartungen.$tx$,
  true
),
(
  'hard', 'growth',
  $tx$Dein Klient ist eine regionale Verlagsgruppe (Tageszeitungen, Anzeigenblätter). Das Printgeschäft verliert rund 8% Umsatz pro Jahr, Digital wächst zweistellig, ist aber erst ein Fünftel des Umsatzes. Der Vorstand will den Gesamtumsatz in fünf Jahren mindestens halten. Entwickle eine Wachstumsstruktur.$tx$,
  NULL,
  'Growth / Portfolio-Transformation Framework',
  $tx$• Digitale Abos: Paywall-Strategie, Conversion und Pricing, Content-Fokus (Lokaljournalismus als Differenzierung)
• Werbegeschäft: digitale Vermarktung lokal (KMU-Pakete), Daten/Targeting, Abhängigkeit von Plattformen
• Neue Geschäftsfelder: Events, Rubrikenportale (Jobs, Immobilien), Agentur-Services für lokale Unternehmen, Logistik-Assets nutzen
• Print & Kosten: managed decline (Preiserhöhungen, Zustelllogistik, Druck-Kooperationen), freiwerdende Mittel in Digital umschichten
• Quantifizierung: Lücke berechnen — Print -8% p.a. muss durch Digital-Wachstum überkompensiert werden$tx$,
  $qa$[
    {"id":"v1","title":"Digitale Abos","isPriority":true,"bulletPoints":[{"id":"v1b1","text":"Paywall-Modell & Conversion-Funnel (40k Abos heute)"},{"id":"v1b2","text":"Pricing & Bundles (Print+Digital, Familientarife)"},{"id":"v1b3","text":"Lokal-exklusiver Content als Zahlgrund"}],"children":[]},
    {"id":"v2","title":"Werbegeschäft","bulletPoints":[{"id":"v2b1","text":"Lokale KMU-Pakete: Reichweite + Umsetzung"},{"id":"v2b2","text":"First-Party-Daten & Targeting"},{"id":"v2b3","text":"Print-Werbung: Preisdisziplin im Rückgang"}],"children":[]},
    {"id":"v3","title":"Neue Geschäftsfelder","bulletPoints":[{"id":"v3b1","text":"Rubriken: Jobs/Immobilien-Portale regional"},{"id":"v3b2","text":"Events & Corporate Publishing"},{"id":"v3b3","text":"Digital-Agentur für lokale Unternehmen"}],"children":[]},
    {"id":"v4","title":"Print-Basis & Kosten","bulletPoints":[{"id":"v4b1","text":"Managed decline: Preis, Erscheinungstage, Zustellung"},{"id":"v4b2","text":"Druck & Logistik: Kooperation/Outsourcing"},{"id":"v4b3","text":"Freigesetzte Mittel in Digital reinvestieren"}],"children":[]},
    {"id":"v5","title":"Ziel-Logik","bulletPoints":[{"id":"v5b1","text":"Lücken-Rechnung: -8% Print p.a. vs. nötiges Digital-Wachstum"},{"id":"v5b2","text":"Meilensteine & Portfolio-Prioritäten"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Wie ist der Umsatz heute verteilt?","a":"Rund 80% Print (Vertrieb + Anzeigen), 20% Digital. Digital wächst mit etwa 15% pro Jahr."},
    {"q":"Wie viele Digital-Abos gibt es?","a":"Etwa 40.000 zahlende Digital-Abos; die Conversion von Reichweite zu Abo ist niedrig."},
    {"q":"Was sind die Stärken der Gruppe?","a":"Starke lokale Marken, eigene Redaktionen in jeder Region, langjährige Beziehungen zu lokalen Werbekunden — und eine eigene Zustellorganisation."},
    {"q":"Wie entwickelt sich der Werbemarkt?","a":"Digitale Werbebudgets wandern überwiegend zu den großen Plattformen; lokale Vermarktung funktioniert nur mit eigenen Produkten und Beratung."},
    {"q":"Sind Zukäufe möglich?","a":"Kleinere Zukäufe (Portale, Agenturen) sind finanzierbar; große Übernahmen nicht."},
    {"q":"Ist Kostensenkung im Print ein Tabu?","a":"Nein — aber die Zustellung ist gesetzlich und politisch sensibel, und die Redaktionsqualität soll nicht ausgehöhlt werden."}
  ]$qa$::jsonb,
  $tx$Transformations-Case mit Rechenlogik im Hintergrund: Print -8% auf 80% Basis erfordert sehr starkes Digital-Wachstum plus neue Felder — gute Kandidaten machen diese Lücken-Logik explizit (grob reicht). Die Struktur sollte Abo, Werbung, neue Felder UND Print-Kostenmanagement trennen. Reine "Digital first"-Parolen ohne Print-Seite und ohne Quantifizierungs-Idee sind zu dünn.$tx$,
  true
),
(
  'hard', 'ma',
  $tx$Dein Klient ist ein Private-Equity-Fonds, der eine Buy-and-Build-Strategie im Markt für Tierarztpraxen prüft: eine Plattform-Praxisgruppe kaufen und kleinere Praxen dazukaufen. Der Investment Director bittet dich um eine strukturierte Bewertung der Investmentthese.$tx$,
  NULL,
  'M&A / Buy-and-Build Framework',
  $tx$• Markt & Konsolidierungslogik: stark fragmentiert (90% Einzelpraxen), stabile Nachfrage (Heimtiere), Konsolidierung läuft bereits — Timing prüfen
• Plattform-Auswahl: Kriterien (Größe, Standorte, Management, Systeme), Verfügbarkeit, Bewertung
• Wertschöpfung: Multiple-Arbitrage (Einzelpraxis 5-7x vs. Gruppe 12-15x EBITDA), Synergien (Einkauf, Labor, Admin), Professionalisierung; organisches Wachstum
• Risiken & Exit: Regulierung (Fremdbesitz-Beschränkungen!), Tierärztemangel und Abhängigkeit von Behandlern, Integrationsfähigkeit, Käuferuniversum beim Exit$tx$,
  $qa$[
    {"id":"b1","title":"Markt & These","bulletPoints":[{"id":"b1b1","text":"Fragmentierung: 90% Einzelpraxen => Konsolidierungspotenzial"},{"id":"b1b2","text":"Nachfrage: Heimtierboom, Zahlungsbereitschaft, Zyklik gering"},{"id":"b1b3","text":"Wettbewerb: andere Konsolidierer schon aktiv"}],"children":[]},
    {"id":"b2","title":"Plattform-Auswahl","bulletPoints":[{"id":"b2b1","text":"Kriterien: Größe, Regionen, Management-Team, IT"},{"id":"b2b2","text":"Pipeline & Bewertung der Plattform"}],"children":[]},
    {"id":"b3","title":"Wertschöpfungsplan","isPriority":true,"bulletPoints":[{"id":"b3b1","text":"Multiple-Arbitrage: 5-7x Einzelkauf vs. 12-15x Gruppen-Exit"},{"id":"b3b2","text":"Synergien: Einkauf, Labor, Backoffice, Recruiting"},{"id":"b3b3","text":"Professionalisierung: Pricing, Auslastung, Spezialisierung"}],"children":[]},
    {"id":"b4","title":"Risiken & Exit","bulletPoints":[{"id":"b4b1","text":"Regulierung: Fremdbesitz-/Berufsrechts-Beschränkungen"},{"id":"b4b2","text":"Tierärztemangel: Behandler binden = Wertfrage"},{"id":"b4b3","text":"Integrationskapazität bei hoher Deal-Frequenz"},{"id":"b4b4","text":"Exit: Käuferuniversum, Haltedauer 5-7 Jahre"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Renditeziel des Fonds?","a":"Etwa 3x auf das eingesetzte Kapital bei einer Haltedauer von fünf bis sieben Jahren."},
    {"q":"Wie fragmentiert ist der Markt?","a":"Rund 90% sind Einzel- oder Kleinpraxen. Einige internationale Ketten konsolidieren bereits, der Markt ist aber noch früh."},
    {"q":"Welche Multiples werden gezahlt?","a":"Einzelpraxen wechseln für etwa 5-7x EBITDA den Besitzer, etablierte Gruppen erzielen 12-15x."},
    {"q":"Gibt es regulatorische Hürden?","a":"Ja — in Teilen des Marktes gelten Beschränkungen für Fremdbesitz an Praxen; die rechtliche Struktur ist ein zentrales Prüfthema."},
    {"q":"Wie ist die Personalsituation?","a":"Es herrscht ausgeprägter Tierärztemangel. Praxen mit abwandernden Behandlern verlieren schnell an Wert."},
    {"q":"Wie stabil ist die Nachfrage?","a":"Sehr stabil bis wachsend: mehr Heimtiere, steigende Zahlungsbereitschaft, geringe Konjunkturabhängigkeit."}
  ]$qa$::jsonb,
  $tx$Buy-and-Build-These strukturiert prüfen: Markt/These, Plattform, Wertschöpfung (Multiple-Arbitrage explizit!), Risiken/Exit. Die zwei kritischen Spezifika sind Regulierung (Fremdbesitz) und Tierärztemangel — starke Kandidaten heben beide hervor. Reines Standard-M&A ohne Buy-and-Build-Logik (Arbitrage, Deal-Frequenz, Integrationskapazität) ist zu wenig.$tx$,
  true
),
(
  'hard', 'pricing',
  $tx$Dein Klient ist ein Softwareanbieter für Bauplanung (5.000 Bestandskunden, klassisches Lizenzmodell: Einmalkauf plus 20% jährliche Wartung). Der Beirat drängt auf die Umstellung auf ein SaaS-Abomodell. Der CEO fragt dich: Wie sollen wir die Preis- und Migrationsstrategie strukturieren?$tx$,
  NULL,
  'Pricing / Business-Model-Transition Framework',
  $tx$• Ziel-Preismodell: Abo-Tiers und Preismetrik (pro Nutzer, pro Projekt), Preispunkte relativ zu Lizenz+Wartung, Cloud-Mehrwert begründen
• Migration der Bestandskunden: Segmentierung, Anreize (Rabatt, Mehrwert, Grandfathering), Zwang (End-of-Life) als letztes Mittel, Zeitplan
• Finanzielle Brücke: Umsatzdelle beim Übergang (Einmalerlöse fallen weg, ARR baut sich auf) modellieren und kommunizieren; Cashflow- und KPI-Wechsel (ARR, NRR, Churn)
• Organisation & Risiken: Vertriebsvergütung umstellen, Support/Cloud-Kosten, Churn-Risiko bei Zwangsmigration, Wettbewerber als Ausweichoption$tx$,
  $qa$[
    {"id":"s1","title":"Ziel-Preismodell","isPriority":true,"bulletPoints":[{"id":"s1b1","text":"Preismetrik: pro Nutzer / Projekt / Modul"},{"id":"s1b2","text":"Tiers & Packaging, Cloud-Mehrwert (Kollaboration, Updates)"},{"id":"s1b3","text":"Preisniveau: Ziel-Payback vs. Lizenz+Wartung"}],"children":[]},
    {"id":"s2","title":"Bestandskunden-Migration","isPriority":true,"bulletPoints":[{"id":"s2b1","text":"Segmentierung: Größe, Wartungsstatus, Nutzungsintensität"},{"id":"s2b2","text":"Anreize: Umstiegsrabatte, Zusatzfeatures, Grandfathering"},{"id":"s2b3","text":"End-of-Life-Politik & Zeitplan"}],"children":[]},
    {"id":"s3","title":"Finanzielle Brücke","bulletPoints":[{"id":"s3b1","text":"Umsatzdelle: Wegfall Einmalerlöse vs. ARR-Aufbau"},{"id":"s3b2","text":"Kohorten-Plan & neue KPIs (ARR, NRR, Churn)"},{"id":"s3b3","text":"Cloud-COGS & Margenpfad"}],"children":[]},
    {"id":"s4","title":"Organisation & Risiken","bulletPoints":[{"id":"s4b1","text":"Vertriebsanreize auf Abo umstellen"},{"id":"s4b2","text":"Churn-Risiko & Wettbewerber-Ausweich"},{"id":"s4b3","text":"Kommunikation & Stufenplan"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Warum die Umstellung — was ist das Ziel?","a":"Planbare wiederkehrende Umsätze und eine höhere Bewertung. Der Beirat will einen klaren ARR-Wachstumspfad sehen; die Umsatzdelle beim Übergang soll so klein wie möglich bleiben."},
    {"q":"Wie sieht das heutige Modell aus?","a":"Einmallizenz plus 20% Wartung pro Jahr. Etwa 80% der Bestandskunden zahlen aktiv Wartung."},
    {"q":"Was macht der Wettbewerb?","a":"Die beiden Hauptwettbewerber sind bereits vollständig auf SaaS umgestiegen — mit gemischten Reaktionen ihrer Kunden."},
    {"q":"Ist das Produkt technisch cloud-fähig?","a":"Eine Cloud-Version existiert und ist funktional gleichwertig; einige Großkunden haben aber On-Premise-Anforderungen."},
    {"q":"Wie verändert die Cloud die Kosten?","a":"Hosting und Betrieb erhöhen die laufenden Kosten je Kunde spürbar — die Bruttomarge je Kunde sinkt gegenüber der Lizenz."},
    {"q":"Wie reagieren Bestandskunden auf Abos?","a":"Erste Sondierungen zeigen: Ein Teil ist offen (wegen laufender Updates), ein lauter Teil lehnt 'Miete statt Kauf' grundsätzlich ab."}
  ]$qa$::jsonb,
  $tx$Transition-Pricing ist mehr als Preissetzung: Starke Antworten trennen Zielmodell, Migration (Segmentierung + Anreiz vs. Zwang), finanzielle Brücke (Umsatzdelle! neue KPIs) und Organisation/Risiken. Wer die Bestandskunden-Migration oder die Umsatzdelle weglässt, verfehlt den Kern des Cases. Konkrete Preishöhen sind nicht nötig — die Logik zählt.$tx$,
  true
),
(
  'hard', 'operations',
  $tx$Dein Klient ist ein kommunaler Krankenhausverbund mit drei Häusern. Die OP-Säle sind in der Kernzeit nur zu 60% ausgelastet, gleichzeitig warten Patienten monatelang auf planbare Eingriffe. Die Geschäftsführung will beides verbessern — ohne Neubau. Strukturiere das Problem.$tx$,
  NULL,
  'Operations Framework (Engpass-Analyse)',
  $tx$• Prozess & Planung: OP-Slot-Management, pünktlicher First-Case-Start, Wechselzeiten, realistischere OP-Zeiten-Schätzung, Puffer für Notfälle (30% ungeplant)
• Personal: Engpass Anästhesie-Pflege — Dienstmodelle, Skill-Mix, Springer-Pools, Bindung/Rekrutierung
• Nachfrage-Steuerung: Priorisierung der Warteliste, Verlagerung ambulanter Eingriffe, Verteilung zwischen den drei Häusern (Spezialisierung)
• Governance & Daten: OP-Statut, verbindliche Kennzahlen, Anreize der Fachabteilungen, digitales OP-Management$tx$,
  $qa$[
    {"id":"k1","title":"Prozess & Planung","isPriority":true,"bulletPoints":[{"id":"k1b1","text":"First-Case-Start & Wechselzeiten messen und managen"},{"id":"k1b2","text":"Slot-Vergabe & realistische OP-Zeit-Schätzung"},{"id":"k1b3","text":"Notfall-Puffer statt Plan-Sprengung (30% ungeplant)"}],"children":[]},
    {"id":"k2","title":"Personal-Engpass","isPriority":true,"bulletPoints":[{"id":"k2b1","text":"Anästhesie-Pflege: Dienstmodelle, Pools, Bindung"},{"id":"k2b2","text":"Skill-Mix & flexible Einsatzplanung"}],"children":[]},
    {"id":"k3","title":"Nachfrage & Portfolio","bulletPoints":[{"id":"k3b1","text":"Wartelisten-Priorisierung (medizinisch + ökonomisch)"},{"id":"k3b2","text":"Ambulantisierung geeigneter Eingriffe"},{"id":"k3b3","text":"Spezialisierung der 3 Häuser (OP-Cluster)"}],"children":[]},
    {"id":"k4","title":"Governance & Daten","bulletPoints":[{"id":"k4b1","text":"OP-Statut mit verbindlichen Regeln"},{"id":"k4b2","text":"Kennzahlen-Transparenz je Fachabteilung"},{"id":"k4b3","text":"Digitales OP-Management statt Excel"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Wo genau liegt der Engpass?","a":"Nicht an den Sälen: Vor allem fehlt Anästhesie-Personal, und die Planung ist unzuverlässig — Programme starten spät und werden oft umgeworfen."},
    {"q":"Wie viele Eingriffe sind ungeplant?","a":"Rund 30% sind Notfälle, die das elektive Programm regelmäßig sprengen, weil es keine festen Notfallkapazitäten gibt."},
    {"q":"Wie wird heute geplant?","a":"Jede Fachabteilung meldet Wünsche, die OP-Koordination plant teils manuell in Excel. Verbindliche Regeln (OP-Statut) existieren nur auf dem Papier."},
    {"q":"Was heißt 60% Auslastung genau?","a":"Anteil der genutzten Saalzeit an der verfügbaren Kernzeit (7:30-15:30). Späte Starts und lange Wechselzeiten sind die größten Verlustquellen."},
    {"q":"Sind die drei Häuser spezialisiert?","a":"Kaum — alle machen fast alles. Eine Bündelung planbarer Eingriffe an einem Standort wurde nie ernsthaft geprüft."},
    {"q":"Gibt es finanzielle Restriktionen?","a":"Der Verbund schreibt leichte Verluste; Investitionen sind möglich, wenn sie sich in 2-3 Jahren rechnen. Ein Neubau ist ausgeschlossen."}
  ]$qa$::jsonb,
  $tx$Operations-Case mit Paradox (niedrige Auslastung + lange Wartezeit) — die Auflösung liegt in Prozess/Planung + Personalengpass, nicht in mehr Sälen. Starke Kandidaten strukturieren entlang Prozess, Personal, Nachfrage-/Portfolio-Steuerung und Governance und erkennen den Notfall-Puffer sowie die Standort-Spezialisierung als Hebel. "Mehr Kapazität bauen" widerspricht der Vorgabe.$tx$,
  true
),
(
  'hard', 'market_entry',
  $tx$Dein Klient ist ein großer Lebensmittel-Discounter. Der Vorstand beobachtet den Quick-Commerce-Trend (Lieferung in unter 30 Minuten) und fragt: Sollen wir einsteigen — und wenn ja, wie? Entwickle eine Entscheidungsstruktur.$tx$,
  NULL,
  'Market Entry / Strategic Options Framework',
  $tx$• Marktattraktivität & Timing: Quick-Commerce wächst, aber Player sind unprofitabel und konsolidieren — abwarten, einsteigen oder Nische?
• Strategischer Fit: dichtes Filialnetz + Einkaufsmacht + Preisimage als Assets; Zielkonflikt Discount-Preise vs. teure Lieferung
• Betriebsmodell-Optionen: Dark Stores vs. Kommissionierung aus Filialen, eigene Flotte vs. Partner/White-Label, Pilotregionen
• Unit Economics: kleiner Warenkorb + Pick- und Lieferkosten => Mindestbestellwert, Liefergebühren, Dichtevorteile; Kannibalisierung des Filialgeschäfts
• Alternativen: Partnerschaft mit bestehendem Player, Beteiligung/Übernahme aus der Konsolidierung, Click&Collect als Zwischenschritt$tx$,
  $qa$[
    {"id":"q1","title":"Markt & Timing","bulletPoints":[{"id":"q1b1","text":"Nachfrage: Segmente, Anlässe, Zahlungsbereitschaft"},{"id":"q1b2","text":"Wettbewerb: unprofitable Player, Konsolidierung => Timing"},{"id":"q1b3","text":"Nische: eigene Kundenbasis vs. urbaner Massenmarkt"}],"children":[]},
    {"id":"q2","title":"Strategischer Fit","bulletPoints":[{"id":"q2b1","text":"Assets: Filialnetz-Dichte, Einkaufsmacht, Logistik"},{"id":"q2b2","text":"Markenkonflikt: Discount-Image vs. Convenience-Premium"},{"id":"q2b3","text":"Verteidigungslogik: junge Kunden nicht verlieren"}],"children":[]},
    {"id":"q3","title":"Betriebsmodell","isPriority":true,"bulletPoints":[{"id":"q3b1","text":"Dark Stores vs. In-Store-Picking aus Filialen"},{"id":"q3b2","text":"Eigene Flotte vs. Lieferpartner/White-Label"},{"id":"q3b3","text":"Pilot: wenige Städte, klare Abbruchkriterien"}],"children":[]},
    {"id":"q4","title":"Unit Economics","isPriority":true,"bulletPoints":[{"id":"q4b1","text":"Warenkorb, Pickkosten, Lieferkosten je Order"},{"id":"q4b2","text":"Mindestbestellwert & Gebührenmodell"},{"id":"q4b3","text":"Kannibalisierung & Zusatzfrequenz sauber trennen"}],"children":[]},
    {"id":"q5","title":"Alternativen","bulletPoints":[{"id":"q5b1","text":"Partnerschaft statt Eigenbau"},{"id":"q5b2","text":"Beteiligung/Zukauf aus der Konsolidierung"},{"id":"q5b3","text":"Click&Collect / geplante Lieferung als Zwischenweg"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Was ist das Ziel des Vorstands?","a":"Relevanz bei jüngeren, urbanen Kunden sichern und den Anschluss nicht verlieren — mittelfristig muss ein Einstieg aber profitabel darstellbar sein."},
    {"q":"Wie läuft es bei den Quick-Commerce-Playern?","a":"Die meisten verbrennen weiterhin Geld, mehrere sind bereits fusioniert oder vom Markt verschwunden. Die Verbleibenden konzentrieren sich auf wenige Großstädte."},
    {"q":"Welche Assets bringt der Discounter mit?","a":"Ein sehr dichtes Filialnetz (auch innerstädtisch), enorme Einkaufsmacht und effiziente Logistikzentren — aber keinerlei Erfahrung mit Endkunden-Lieferung."},
    {"q":"Wie sehen die Unit Economics im Quick-Commerce aus?","a":"Kleine Warenkörbe treffen auf hohe Pick- und Lieferkosten je Bestellung; profitabel wird es meist erst mit hoher Bestelldichte, Mindestbestellwerten und Gebühren."},
    {"q":"Gibt es interne Restriktionen?","a":"Das Preisimage darf nicht beschädigt werden, und große dauerhafte Verluste akzeptiert der Vorstand nicht — ein begrenztes Pilotbudget wäre aber verfügbar."},
    {"q":"Wäre eine Partnerschaft denkbar?","a":"Ja, es gab bereits lose Gespräche mit einem Lieferplattform-Anbieter über ein White-Label-Modell."}
  ]$qa$::jsonb,
  $tx$Strategie-Case mit echter Entscheidungsfrage (ob UND wie). Starke Antworten: Markt/Timing kritisch (Konsolidierung!), eigene Assets als Differenzierung (Filialnetz => In-Store-Picking als Kostenvorteil), Unit-Economics-Logik explizit, Alternativen (Partnerschaft, Zukauf, Click&Collect) statt nur Eigenbau. Ein klares "Nein mit Bedingungen" ist genauso wertvoll wie ein "Ja mit Pilot" — die Struktur der Abwägung zählt.$tx$,
  true
),
(
  'hard', 'growth',
  $tx$Dein Klient ist ein mittelständischer Industriepumpen-Hersteller (200.000 installierte Pumpen im Feld). Das Neugeschäft ist zyklisch, deshalb soll der Serviceanteil am Umsatz von 15% auf 30% steigen. Der Vertriebsvorstand bittet dich um eine Struktur für den Aufbau des Servicegeschäfts.$tx$,
  NULL,
  'Growth Framework (Service-Geschäftsaufbau)',
  $tx$• Service-Portfolio: Wartungsverträge, Ersatzteile, Retrofit, Monitoring/Predictive Maintenance (IoT-Pilot läuft) — Priorisierung nach Marge und Skalierbarkeit
• Installierte Basis & Daten: 200k Pumpen, aber lückenhafte Felddaten — Basis erfassen, Sensorik-Retrofit, Connectivity
• Kommerzialisierung: Service aktiv verkaufen (heute "mitverkauft"), Pricing (Verträge vs. Einzelleistung), Vertriebssteuerung und Anreize
• Aufbau & Make-or-Buy: Servicetechniker-Kapazität, regionale Abdeckung, Partnernetz vs. eigene Organisation, Wettbewerb durch billigere Drittanbieter$tx$,
  $qa$[
    {"id":"w1","title":"Service-Portfolio","isPriority":true,"bulletPoints":[{"id":"w1b1","text":"Wartungsverträge als Basis (planbar, margenstark)"},{"id":"w1b2","text":"Ersatzteile: Verfügbarkeit & Pricing schützen"},{"id":"w1b3","text":"IoT/Predictive: Pilot skalieren, Mehrwert beweisen"}],"children":[]},
    {"id":"w2","title":"Installierte Basis & Daten","bulletPoints":[{"id":"w2b1","text":"Felddaten erfassen: Wo laufen welche 200k Pumpen?"},{"id":"w2b2","text":"Sensorik-Retrofit & Connectivity-Strategie"},{"id":"w2b3","text":"Priorisierung: kritische Anwendungen zuerst"}],"children":[]},
    {"id":"w3","title":"Kommerzialisierung","bulletPoints":[{"id":"w3b1","text":"Aktiver Service-Vertrieb statt Beiwerk"},{"id":"w3b2","text":"Pricing: Vertragsstaffeln, SLAs, Bundles"},{"id":"w3b3","text":"Vertriebsanreize & Zielsteuerung anpassen"}],"children":[]},
    {"id":"w4","title":"Aufbau & Make-or-Buy","bulletPoints":[{"id":"w4b1","text":"Technikerkapazität & regionale Abdeckung"},{"id":"w4b2","text":"Partnernetz vs. eigene Organisation"},{"id":"w4b3","text":"Antwort auf billigere Drittanbieter"}],"children":[]}
  ]$qa$::jsonb,
  $qa$[
    {"q":"Wie ist das Servicegeschäft heute aufgestellt?","a":"Service wird vom Produktvertrieb 'mitverkauft': überwiegend reaktive Reparaturen und Ersatzteile, wenige systematische Wartungsverträge."},
    {"q":"Was weiß der Klient über die installierte Basis?","a":"Wenig — von den rund 200.000 Pumpen im Feld sind Standort und Zustand nur bei einem Bruchteil systematisch erfasst."},
    {"q":"Wie weit ist das IoT-Thema?","a":"Ein Pilot mit Retrofit-Sensoren an 500 Pumpen läuft seit einem Jahr; die technischen Ergebnisse sind vielversprechend, ein Geschäftsmodell dazu fehlt."},
    {"q":"Wer sind die Wettbewerber im Service?","a":"Unabhängige Servicefirmen, die Wartung deutlich billiger anbieten, und teilweise die Instandhaltungsteams der Kunden selbst."},
    {"q":"Wie sind die Margen verteilt?","a":"Ersatzteile und Verträge sind deutlich margenstärker als das zyklische Neugeschäft — genau deshalb will der Vorstand den Serviceanteil verdoppeln."},
    {"q":"Gibt es genug Servicetechniker?","a":"Nein, das ist ein Engpass: Der Aufbau eigener Kapazität dauert, ein Partnernetz existiert nur in Ansätzen."}
  ]$qa$::jsonb,
  $tx$Servicegeschäft-Aufbau: Starke Strukturen decken Portfolio (Verträge/Teile/IoT), installierte Basis/Daten (die 200k Pumpen sind der Schatz — aber unerfasst!), Kommerzialisierung (Vertrieb/Anreize/Pricing) und Aufbau/Make-or-Buy ab. Wer nur "IoT-Produkte bauen" strukturiert und Vertrieb + Techniker-Engpass ignoriert, greift zu kurz.$tx$,
  true
);
