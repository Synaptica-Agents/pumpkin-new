-- ============================================================
-- Add 30 more market_sizing_cases (total → 60)
-- 10 easy + 10 medium + 10 hard
-- All in German, region = Deutschland
-- ============================================================

-- EASY (10 new)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max)
VALUES
  ('easy', 'retail', 'Deutschland',
   'Wie viele Brillen werden pro Jahr in Deutschland verkauft?',
   'Anzahl verkaufte Brillen', 'Stück/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung → Anteil Brillenträger → durchschnittliche Nutzungsdauer → Ersatz- und Neukäufe pro Jahr. Bottom-up: Anzahl Optiker → verkaufte Brillen pro Optiker/Jahr.',
   10000000, 15000000),

  ('easy', 'healthcare', 'Deutschland',
   'Wie viele Zahnarztbesuche finden pro Jahr in Deutschland statt?',
   'Anzahl Zahnarztbesuche', 'Besuche/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung → Anteil mit regelmäßigem Zahnarztbesuch → Besuche pro Person/Jahr. Bottom-up: Anzahl Zahnärzte → Patienten pro Zahnarzt/Tag × Arbeitstage.',
   100000000, 160000000),

  ('easy', 'entertainment', 'Deutschland',
   'Wie viele Kinobesuche gibt es pro Jahr in Deutschland?',
   'Anzahl Kinobesuche', 'Besuche/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung → Anteil Kinogänger → Besuche pro Kinogänger/Jahr. Bottom-up: Anzahl Kinosäle → Vorstellungen pro Saal/Tag → Zuschauer pro Vorstellung × 365.',
   80000000, 120000000),

  ('easy', 'education', 'Deutschland',
   'Wie viele Führerscheinprüfungen werden pro Jahr in Deutschland abgelegt?',
   'Anzahl Führerscheinprüfungen', 'Prüfungen/Jahr', 'top-down,bottom-up',
   'Top-down: Jahrgang 17-18 Jahre → Anteil, der den Führerschein macht + Nachzügler aus älteren Jahrgängen. Bottom-up: Anzahl Fahrschulen → Prüflinge pro Fahrschule/Jahr.',
   1500000, 2500000),

  ('easy', 'retail', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz des Blumenhandels (Schnittblumen und Topfpflanzen) in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up',
   'Top-down: Haushalte → Anteil, der regelmäßig Blumen kauft → Ausgaben pro kaufendem Haushalt/Jahr. Bottom-up: Anzahl Blumengeschäfte und Stände → Durchschnittsumsatz pro Geschäft.',
   7000000000, 10000000000),

  ('easy', 'consumer', 'Deutschland',
   'Wie viel Hundefutter wird pro Jahr in Deutschland verkauft (in Tonnen)?',
   'Verkaufsmenge', 'Tonnen/Jahr', 'top-down,bottom-up',
   'Top-down: Anzahl Hunde in DE → Futterbedarf pro Hund/Tag → × 365. Bottom-up: Marktanteile großer Hersteller → deren Produktionsmengen für den deutschen Markt.',
   1000000, 2000000),

  ('easy', 'healthcare', 'Deutschland',
   'Wie viele Apotheken gibt es in Deutschland?',
   'Anzahl Apotheken', 'Stück', 'top-down,bottom-up',
   'Top-down: Bevölkerung → Einwohner pro Apotheke (Richtwert). Bottom-up: Städte und Gemeinden → durchschnittliche Anzahl Apotheken pro Einwohnerzahl.',
   17000, 20000),

  ('easy', 'consumer', 'Deutschland',
   'Wie viele Friseurbesuche finden pro Jahr in Deutschland statt?',
   'Anzahl Friseurbesuche', 'Besuche/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung → Anteil, der zum Friseur geht → Besuche pro Person/Jahr (Männer vs. Frauen). Bottom-up: Anzahl Friseursalons → Kunden pro Salon/Tag × Arbeitstage.',
   200000000, 400000000),

  ('easy', 'mobility', 'Deutschland',
   'Wie viele Autowäschen finden pro Jahr in Deutschland statt?',
   'Anzahl Autowäschen', 'Wäschen/Jahr', 'top-down,bottom-up',
   'Top-down: Anzahl PKW in DE → Anteil, der regelmäßig gewaschen wird → Wäschen pro Auto/Jahr. Bottom-up: Anzahl Waschanlagen → Kapazität × Auslastung × 365.',
   300000000, 500000000),

  ('easy', 'mobility', 'Deutschland',
   'Wie viele Taxifahrten werden pro Jahr in Deutschland durchgeführt?',
   'Anzahl Taxifahrten', 'Fahrten/Jahr', 'top-down,bottom-up',
   'Top-down: Bevölkerung in Großstädten → Anteil Taxi-Nutzer → Fahrten pro Nutzer/Jahr. Bottom-up: Anzahl Taxis → Fahrten pro Taxi/Tag × 365.',
   200000000, 400000000);


-- MEDIUM (10 new)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max)
VALUES
  ('medium', 'real_estate', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz von Coworking-Spaces in deutschen Großstädten (Städte > 200.000 Einwohner)?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Büroarbeitsplätze in Großstädten → Anteil flexible Arbeitsplätze → Anteil Coworking → Durchschnittspreis/Platz/Monat × 12. Bottom-up: Anzahl Coworking-Spaces → Plätze pro Space → Auslastung → Monatspreis.',
   1000000000, 2500000000),

  ('medium', 'media', 'Deutschland',
   'Wie groß ist der jährliche Markt für Podcast-Werbung in Deutschland?',
   'Jährlicher Werbeumsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamter Online-Werbemarkt → Anteil Audio → Anteil Podcasts. Bottom-up: Podcast-Hörer in DE → Stunden/Woche → Werbespots pro Stunde → CPM.',
   100000000, 400000000),

  ('medium', 'energy', 'Deutschland',
   'Wie viele öffentliche Ladestationen für E-Autos gibt es aktuell in Deutschland?',
   'Anzahl Ladestationen', 'Stück', 'top-down,bottom-up',
   'Top-down: Anzahl E-Autos → Verhältnis E-Autos pro Ladestation. Bottom-up: Ladestationen pro Autobahnrastplatz + pro Supermarkt + innerstädtisch + Wohngebiete.',
   100000, 200000),

  ('medium', 'retail', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz des Second-Hand-Modemarktes (online und offline) in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamtbekleidungsmarkt → Anteil Second-Hand. Bottom-up: Online-Plattformen (Vinted, Momox) + stationäre Shops → Umsatz je Kanal.',
   3000000000, 7000000000),

  ('medium', 'food_delivery', 'Deutschland',
   'Wie viele Cloud-Küchen (Ghost Kitchens, virtuelle Restaurants ohne Gastraum) gibt es in Deutschland?',
   'Anzahl Cloud-Küchen', 'Stück', 'top-down,bottom-up',
   'Top-down: Städte mit Lieferdienst-Abdeckung → Bedarf an Cloud-Küchen pro Liefergebiet. Bottom-up: Bekannte Anbieter (CloudEats, Keatz, etc.) → Standorte + Eigenständige → Schätzung.',
   500, 2000),

  ('medium', 'logistics', 'Deutschland',
   'Wie groß ist der potenzielle jährliche Markt für kommerzielle Drohnenlieferungen (Pakete, Medikamente, Lebensmittel) in Deutschland?',
   'Potenzielles Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamter Paket-/Express-Markt → Anteil geeigneter Sendungen (leicht, dringend, ländlich) → Zahlungsbereitschaft für Drohnenlieferung. Bottom-up: Pilotprojekte und genehmigte Routen → Hochrechnung auf Gesamtmarkt.',
   200000000, 1000000000),

  ('medium', 'manufacturing', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz des 3D-Druck-Marktes (Drucker, Materialien, Dienstleistungen) in Deutschland?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Globaler 3D-Druck-Markt → Anteil Deutschland (Industrieland, Maschinenbau-Fokus). Bottom-up: Segmente (Industrie, Dental, Prototyping, Consumer) → Drucker + Materialien + Services pro Segment.',
   1500000000, 3000000000),

  ('medium', 'education', 'Deutschland',
   'Wie viele Kinder unter 6 Jahren besuchen eine Kindertagesstätte (Kita) in Deutschland?',
   'Anzahl Kita-Kinder', 'Kinder', 'top-down,bottom-up',
   'Top-down: Kinder 0-5 Jahre in DE → Betreuungsquote nach Altersgruppe (unter 3, 3-5). Bottom-up: Anzahl Kitas → Plätze pro Kita → Auslastung.',
   3000000, 4000000),

  ('medium', 'entertainment', 'Deutschland',
   'Wie hoch ist der jährliche Umsatz des deutschen Gaming-Marktes (Spiele, Hardware, In-Game-Käufe)?',
   'Jährlicher Umsatz', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gamer in DE → Ausgaben pro Gamer/Jahr (Spiele + Hardware + Mikrotransaktionen). Bottom-up: Segmente (PC, Konsole, Mobile) → Umsatz pro Segment.',
   8000000000, 12000000000),

  ('medium', 'fintech', 'Deutschland',
   'Wie viele Haustiere in Deutschland sind krankenversichert?',
   'Anzahl versicherte Haustiere', 'Tiere', 'top-down,bottom-up',
   'Top-down: Gesamtanzahl Haustiere (Hunde + Katzen) → Versicherungsdurchdringung. Bottom-up: Marktführer (Agila, Petplan, etc.) → geschätzte Policen pro Anbieter.',
   1500000, 3000000);


-- HARD (10 new)
INSERT INTO public.market_sizing_cases (difficulty, industry_tag, region, prompt, target_metric, unit_hint, allowed_methods, reference_structure, expected_order_of_magnitude_min, expected_order_of_magnitude_max)
VALUES
  ('hard', 'healthcare', 'Deutschland',
   'Schätze das jährliche Marktvolumen für Wearable-basierte Gesundheitsüberwachung (Smartwatches, Fitness-Tracker mit medizinischer Funktion wie EKG, Blutzucker, SpO2) in Deutschland.',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Bevölkerung mit chronischen Erkrankungen → Anteil mit Interesse an digitalem Monitoring → Zahlungsbereitschaft (Gerät + Abo). Bottom-up: Verkaufszahlen Apple Watch + Fitbit + Oura → Anteil mit Health-Features → Hardware + Abo-Umsatz.',
   1500000000, 4000000000),

  ('hard', 'energy', 'Deutschland',
   'Schätze das Marktvolumen für grünen Wasserstoff (Produktion, Transport, Nutzung) in Deutschland bis 2030.',
   'Marktvolumen 2030', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Nationaler Wasserstoffbedarf lt. Strategie → Anteil grüner H2 → Preis pro kg. Bottom-up: Geplante Elektrolyseur-Kapazitäten → Produktionsmenge × Preis + Transport + Infrastruktur.',
   5000000000, 15000000000),

  ('hard', 'real_estate', 'Deutschland',
   'Wie groß ist der jährliche Markt für PropTech-Lösungen (digitale Immobilienverwaltung, Bewertung, Mietplattformen, Smart Building) in Deutschland?',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamter Immobilienmarkt → IT-Ausgaben im Immobiliensektor → Anteil PropTech. Bottom-up: PropTech-Segmente (Verwaltung, Vermittlung, Smart Building, FinTech) → Umsatz pro Segment.',
   2000000000, 5000000000),

  ('hard', 'fintech', 'Deutschland',
   'Schätze das Marktvolumen für Embedded Insurance (in Kaufprozesse integrierte Versicherungen, z.B. Reiseversicherung beim Flugbuchen, Handyversicherung beim Kauf) in Deutschland.',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Relevante Kauftransaktionen (Reise, Elektronik, Mobilität) → Attach-Rate für eingebettete Versicherungen → Durchschnittsprämie. Bottom-up: Anbieter (Hepster, Getsafe, ELEMENT) → Prämienvolumen + B2B-Partner × Conversion.',
   500000000, 2000000000),

  ('hard', 'consumer', 'Deutschland',
   'Wie groß ist der jährliche Markt für personalisierte Ernährung (DNA-basierte Ernährungspläne, personalisierte Supplements, Mikrobiom-Tests) in Deutschland?',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesundheitsbewusste Bevölkerung → Anteil mit Interesse an Personalisierung → Zahlungsbereitschaft für Tests + Produkte. Bottom-up: Anbieter (Lykon, BIOMES, Cerascreen) → Kundenzahlen × ARPU + Supplement-Umsatz.',
   200000000, 800000000),

  ('hard', 'manufacturing', 'Deutschland',
   'Schätze das Marktvolumen für Digital-Twin-Technologie (virtuelle Abbilder physischer Assets) in der deutschen Industrie.',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamte Industrie-IT-Ausgaben → Anteil IoT/Simulation → Anteil Digital Twins. Bottom-up: Unternehmen nach Branche (Automotive, Maschinenbau, Chemie) → Adoptionsrate → Lizenz + Implementierungskosten.',
   1000000000, 3000000000),

  ('hard', 'energy', 'Deutschland',
   'Schätze den jährlichen Markt für Agri-Photovoltaik (gleichzeitige Nutzung von Ackerflächen für Landwirtschaft und Solarstromerzeugung) in Deutschland.',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Landwirtschaftliche Fläche → geeigneter Anteil → installierbare Kapazität → Investitionskosten + Stromertrag. Bottom-up: Pilotprojekte und geplante Anlagen → Hochrechnung mit Wachstumsrate.',
   200000000, 1000000000),

  ('hard', 'logistics', 'Deutschland',
   'Wie groß ist der jährliche Markt für nachhaltige Verpackungslösungen (kompostierbar, recycelt, Mehrweg) im E-Commerce in Deutschland?',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: E-Commerce-Pakete pro Jahr → Verpackungsmaterial pro Paket → Anteil nachhaltige Alternativen → Preispremium. Bottom-up: Anbieter nachhaltiger Verpackungen → Umsatz + Anteil E-Commerce-Kunden.',
   500000000, 2000000000),

  ('hard', 'saas', 'Deutschland',
   'Schätze das Marktvolumen für Edge-Computing-Lösungen (dezentrale Datenverarbeitung nahe am Endgerät) in Deutschland.',
   'Marktvolumen', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamter Cloud-Markt → Anteil Edge Computing. Bottom-up: Anwendungsfälle (IoT-Industrie, autonomes Fahren, 5G, Retail) → Edge-Infrastruktur-Bedarf pro Use Case × Kosten.',
   1500000000, 4000000000),

  ('hard', 'mobility', 'Deutschland',
   'Schätze das jährliche Umsatzvolumen für Wasserstoff-Brennstoffzellen-LKW (Fahrzeuge + Betankungsinfrastruktur) in Deutschland bis 2030.',
   'Marktvolumen 2030', '€/Jahr', 'top-down,bottom-up,mixed',
   'Top-down: Gesamter LKW-Markt → Anteil Neuzulassungen mit Brennstoffzelle bis 2030 → Durchschnittspreis + Betankungsinfrastruktur. Bottom-up: Hersteller-Ankündigungen (Daimler, Hyundai, Nikola) → geplante Stückzahlen × Preis + H2-Tankstellen-Investitionen.',
   2000000000, 8000000000);
