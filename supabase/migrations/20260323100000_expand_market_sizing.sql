-- ============================================================
-- Expand market_sizing_cases: +18 new cases (6 easy, 6 medium, 6 hard)
-- Total after migration: 30 cases
-- All prompts and structures in German, region = Deutschland
-- ============================================================

-- EASY (6)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max)
VALUES
  ('easy', 'fitness', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz der Fitnessbranche (Fitnessstudios und -ketten) in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung 16-65 Jahre → Anteil mit Fitnessstudio-Mitgliedschaft → Durchschnittlicher Monatsbeitrag × 12. Bottom-up: Anzahl Fitnessstudios → Durchschnittliche Mitgliederzahl → Durchschnittlicher Jahresbeitrag.',
   5000000000, 7000000000),

  ('easy', 'food_delivery', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz von Essenslieferdiensten (z. B. Lieferando, Wolt) in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung in Städten > 50.000 Einwohner → Anteil, der Lieferdienste nutzt → Bestellungen pro Nutzer/Jahr → Durchschnittlicher Bestellwert. Bottom-up: Anzahl Partnergastronomien → Bestellungen pro Restaurant/Tag → Durchschnittlicher Bestellwert × 365.',
   8000000000, 14000000000),

  ('easy', 'e_bikes', 'Deutschland',
   'Wie viele E-Bikes werden in Deutschland pro Jahr verkauft?',
   'Anzahl verkaufte E-Bikes', 'Stück/Jahr', 'top-down,bottom-up',
   'Top-down: Gesamter Fahrradmarkt (Stückzahl) → Anteil E-Bikes. Bottom-up: Haushalte mit Fahrrad → Anteil, der ein E-Bike besitzt → durchschnittliche Nutzungsdauer → Ersatzbedarf + Neukäufer pro Jahr.',
   1500000, 2500000),

  ('easy', 'streaming', 'Deutschland',
   'Wie viele zahlende Abonnenten von Video-Streaming-Diensten (Netflix, Disney+, Amazon Prime Video etc.) gibt es in Deutschland?',
   'Anzahl zahlende Abonnenten', 'Abonnenten', 'top-down,bottom-up',
   'Top-down: Haushalte in Deutschland → Anteil mit Breitband-Internet → Anteil mit mindestens einem Streaming-Abo. Bottom-up: Marktanteile der großen Anbieter → bekannte Abonnentenzahlen (Achtung: Überschneidungen).',
   25000000, 40000000),

  ('easy', 'pet_grooming', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz im deutschen Markt für Haustier-Pflegedienste (Hundefriseure, mobile Tierpflege)?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up',
   'Top-down: Anzahl Hunde und Katzen in DE → Anteil, der professionelle Pflege nutzt → Häufigkeit pro Jahr → Durchschnittspreis pro Besuch. Bottom-up: Anzahl Hundesalons/mobile Dienstleister → Durchschnittsumsatz pro Betrieb.',
   500000000, 1200000000),

  ('easy', 'tutoring', 'Deutschland',
   'Wie viele Schülerinnen und Schüler in Deutschland nehmen regelmäßig Nachhilfe in Anspruch?',
   'Anzahl Nachhilfeschüler', 'Personen', 'top-down,bottom-up',
   'Top-down: Gesamtanzahl Schüler (allgemeinbildende Schulen) → Anteil mit Nachhilfe. Bottom-up: Nachhilfe-Institute (z. B. Studienkreis, Schülerhilfe) → Schüler pro Institut + private Nachhilfelehrer → Schüler pro Lehrer.',
   1000000, 1500000);


-- MEDIUM (6)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max)
VALUES
  ('medium', 'telemedicine', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz des Telemedizin-Marktes (Videosprechstunden, Online-Arztpraxen) in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Anzahl Arztbesuche pro Jahr in DE → Anteil Videosprechstunden → Durchschnittliche Vergütung pro Konsultation. Bottom-up: Anzahl Telemedizin-Anbieter → registrierte Ärzte pro Plattform → Konsultationen pro Arzt/Monat → Umsatz pro Konsultation.',
   500000000, 1500000000),

  ('medium', 'cybersecurity', 'Deutschland',
   'Schätze das jährliche Marktvolumen für Cybersecurity-Lösungen (Software und Dienstleistungen) in Deutschland.',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Globaler Cybersecurity-Markt → Anteil Deutschlands am Welt-IT-Markt. Bottom-up: Unternehmen nach Größenklassen → IT-Budget pro Größenklasse → Anteil für Cybersecurity.',
   6000000000, 10000000000),

  ('medium', 'micro_mobility', 'Deutschland',
   'Wie viele Fahrten werden pro Jahr mit geteilten Mikromobilitätsdiensten (E-Scooter, E-Bikes, E-Mopeds) in deutschen Großstädten durchgeführt?',
   'Anzahl Fahrten pro Jahr', 'Fahrten/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung in Städten > 100.000 Einwohner → Anteil, der Sharing-Dienste nutzt → Fahrten pro Nutzer/Monat × 12. Bottom-up: Anzahl verfügbare Fahrzeuge in Großstädten → Fahrten pro Fahrzeug/Tag × 365.',
   150000000, 350000000),

  ('medium', 'plant_based', 'Deutschland',
   'Wie groß ist der jährliche Markt für pflanzliche Fleisch- und Milchalternativen in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up',
   'Top-down: Gesamter Fleisch-/Milchmarkt → Anteil pflanzlicher Alternativen. Bottom-up: Segmentierung (Veganer, Vegetarier, Flexitarier) → Anteil an Bevölkerung → durchschnittlicher Konsum pflanzlicher Produkte pro Kopf → Durchschnittspreis.',
   1500000000, 3000000000),

  ('medium', 'edtech', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz des EdTech-Marktes (digitale Bildungsplattformen und Lern-Apps) in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamtausgaben für Bildung in DE → Anteil digitaler Lösungen. Bottom-up: Segmente (Schule, Hochschule, betriebliche Weiterbildung) → Nutzerzahlen pro Segment → Durchschnittlicher Umsatz pro Nutzer.',
   1000000000, 2500000000),

  ('medium', 'smart_home', 'Deutschland',
   'Wie viele Haushalte in Deutschland nutzen mindestens ein Smart-Home-Gerät (z. B. smarte Lautsprecher, Thermostate, Beleuchtung)?',
   'Anzahl Smart-Home-Haushalte', 'Haushalte', 'top-down,bottom-up',
   'Top-down: Gesamthaushalte in DE → Anteil mit Breitband → Anteil mit Smart-Home-Geräten. Bottom-up: Verkaufszahlen smarter Geräte (Alexa, Google Home, Philips Hue etc.) → Zuordnung zu Haushalten (mehrere Geräte pro Haushalt).',
   10000000, 18000000);


-- HARD (6)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max)
VALUES
  ('hard', 'quantum_computing', 'Deutschland',
   'Schätze das aktuelle jährliche Marktvolumen für Quantencomputing-Lösungen (Hardware, Software und Beratungsdienstleistungen) in Deutschland.',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Globaler Quantencomputing-Markt → Deutschlands Anteil am globalen IT-Forschungsmarkt. Bottom-up: Anzahl Unternehmen und Forschungseinrichtungen mit Quantencomputing-Programmen → Durchschnittliches Budget pro Organisation.',
   200000000, 600000000),

  ('hard', 'vertical_farming', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz des Vertical-Farming-Marktes in Deutschland (Indoor-Farmen, die Gemüse und Kräuter in vertikalen Anlagen anbauen)?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamtmarkt für frisches Gemüse und Kräuter in DE → Anteil, der durch Vertical Farming abgedeckt wird. Bottom-up: Anzahl kommerzieller Vertical Farms in DE → Durchschnittliche Anbaufläche → Ertrag pro m² → Durchschnittspreis pro kg.',
   50000000, 200000000),

  ('hard', 'space_tourism', 'Deutschland',
   'Schätze das potenzielle jährliche Marktvolumen für Weltraumtourismus-Angebote, die von Deutschland aus vermarktet oder gebucht werden.',
   'Potenzielles Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Anzahl HNWI (High Net Worth Individuals) in DE → Anteil mit Interesse an Weltraumtourismus → Zahlungsbereitschaft. Bottom-up: Verfügbare Plätze bei Anbietern (SpaceX, Blue Origin, Virgin Galactic) → Anteil deutscher Kunden → Ticketpreis.',
   50000000, 300000000),

  ('hard', 'carbon_credits', 'Deutschland',
   'Wie groß ist der jährliche Markt für freiwillige CO₂-Kompensationszertifikate (Voluntary Carbon Credits) in Deutschland?',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: CO₂-Emissionen der deutschen Wirtschaft → Anteil, der freiwillig kompensiert wird → Durchschnittspreis pro Tonne CO₂. Bottom-up: Unternehmen mit Nachhaltigkeitsstrategie → Anteil, der freiwillig kompensiert → Tonnen pro Unternehmen → Preis pro Tonne.',
   200000000, 800000000),

  ('hard', 'lab_grown_meat', 'Deutschland',
   'Schätze das potenzielle jährliche Marktvolumen für kultiviertes Fleisch (Laborfleisch) in Deutschland, sobald eine Zulassung erfolgt und erste Produkte verfügbar sind.',
   'Potenzielles Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamter Fleischmarkt in DE → Anteil Konsumenten mit Bereitschaft zu kultiviertem Fleisch → Preispremium vs. konventionelles Fleisch. Bottom-up: Zielgruppe (Flexitarier, Vegetarier, die Fleischgeschmack vermissen) → Kauffrequenz → Menge pro Kauf → Preis pro kg.',
   100000000, 500000000),

  ('hard', 'autonomous_trucking', 'Deutschland',
   'Schätze das jährliche Marktvolumen für autonome Lkw-Lösungen (Level 4+, Autobahn-Hub-to-Hub) in Deutschland bis 2030.',
   'Marktvolumen 2030', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamtmarkt Straßengüterverkehr DE → Anteil Autobahnkilometer → Automatisierungspotenzial (Anteil geeigneter Strecken) → Kosteneinsparung × Volumen. Bottom-up: Geplante Flotten der Hersteller (Daimler, MAN, Einride etc.) → Einsatzstunden × Umsatz pro Stunde.',
   2000000000, 6000000000);
