-- ============================================================

-- Creativity v3: simple Business-Sense-Brainstorms

-- - reference_ideas wieder eingefuehrt (Beispiel-Loesung + Grader-Referenz)

-- - 30 medium-Einzeiler behalten, jetzt mit Referenz-Ideen

-- - 30 hard neu: etwas breiter, aber simpel (kein Zahlen-Kontext,

--   nichts zu rechnen), alte kontextlastige hard-Cases deaktiviert

-- Generiert aus creativity-content/ via build_sql.py

-- ============================================================

BEGIN;

ALTER TABLE public.creativity_cases ADD COLUMN IF NOT EXISTS reference_ideas text;

UPDATE public.creativity_cases SET reference_ideas = $T$• Organisch: eigene Filialen in Mailand/Rom testen, italienischer Online-Shop
• Partnerschaften: Shop-in-Shop mit italienischen Kaufhäusern, Kooperation mit lokalen Verlagen
• Anorganisch: Übernahme einer kleinen italienischen Kette, Joint Venture
• Leicht testen: Pop-up-Stores, deutschsprachige Nische (Touristen, Expats) zuerst$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Optionen hat eine deutsche Buchhandelskette, um nach Italien zu expandieren?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Handel: Listung bei Feinkost-Händlern und Bio-Ketten, Delikatess-Abteilungen der Kaufhäuser
• Direkt: eigener Online-Shop, Abo-Modell, Amazon/Marktplätze
• Gastronomie: Partnerschaften mit Restaurants als Referenz und Vertriebskanal
• Marke: Verkostungen, Food-Messen, Kooperation mit Koch-Influencern$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann eine spanische Olivenöl-Manufaktur in den deutschen Premium-Lebensmittelmarkt eintreten?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Franchise: lokale Franchise-Nehmer rekrutieren, Master-Franchise für NL vergeben
• Eigenbetrieb: Flagship-Salons in Amsterdam/Rotterdam als Leuchttürme
• Anorganisch: Übernahme lokaler Salon-Ketten und Umflaggen
• Risikoarm: Pilot mit 1-2 Standorten, Partnerschaft mit Drogerie-/Beauty-Ketten$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Wege hat ein britisches Friseur-Salon-Franchise, um in den niederländischen Markt zu expandieren?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Vertrieb: französische Fahrradhändler als Partner, eigener Online-Direktvertrieb
• B2B: Flottenkunden (Lieferdienste, Kommunen, Handwerker) direkt ansprechen
• Präsenz: Showrooms in Paris/Lyon, Messen und Test-Events
• Strukturen: lokaler Distributor vs. eigene Vertriebstochter, Leasing-Partnerschaften$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Optionen hat ein deutscher Hersteller von Elektro-Lastenrädern, um den französischen Markt zu erschließen?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Eigenbetrieb: Flagship in New York, weitere Boutiquen in Premium-Lagen
• Handel: Listung bei Premium-Retailern (Whole Foods, Kaufhäuser), Duty-Free
• Online: US-Webshop, Geschenk-/Corporate-Geschäft, Abo-Boxen
• Partner: Franchise/Lizenz, Kooperation mit Hotels und Airlines$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann eine schweizerische Schokoladen-Boutique-Kette in den US-Markt eintreten?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Handel: Listung bei Drogerie-/Apothekenketten, Bio-Fachhandel
• Online: eigene Shops je Land, nordische Beauty-Marktplätze, Amazon
• Marke: Zertifizierungen (Nordic Swan) als Türöffner, Influencer-Kooperationen
• Partner: lokaler Distributor zuerst, später eigene Ländergesellschaft$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Wege hat ein polnischer Bio-Kosmetik-Hersteller, um nach Skandinavien zu expandieren?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Eigenbetrieb: Studios in Großstädten mit hoher Yoga-Dichte (Berlin, München)
• Franchise: deutsche Franchise-Partner, Master-Franchise je Region
• Anorganisch: Übernahme bestehender Studios, Umflaggen
• Digital/leicht: Online-Kurse als Markenaufbau, Pop-up-Kurse, Firmen-Yoga (B2B)$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Optionen hat eine österreichische Yoga-Studio-Kette, um in den deutschen Markt einzutreten?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Vertrieb: lokale Installateur-Partnernetzwerke, eigene Vertriebsteams je Region
• Digital: Online-Konfigurator und Lead-Generierung, Vergleichsportale
• Partner: Kooperation mit Energieversorgern, Baumärkten, Fertighaus-Anbietern
• Angebot: Miet-/Abo-Modelle statt Kauf als Differenzierung$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann ein niederländischer Anbieter von Photovoltaik-Anlagen den deutschen Privatkunden-Markt erschließen?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Partner: Joint Venture mit japanischem Handelshaus, Lizenzpartner mit Lokal-Know-how
• Handel: Corner in Depachika (Kaufhaus-Food-Hallen) — klassischer Einstieg für Premium-Patisserie
• Eigenbetrieb: Flagship in Tokio (Ginza) als Markenanker
• Anpassung: limitierte Editionen und lokale Geschmäcker, Geschenk-Kultur bedienen$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Wege hat eine französische Patisserie-Kette, um nach Japan zu expandieren?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Digital first: Tmall/JD-Flagship-Stores, Social Commerce (WeChat, Douyin), lokale KOL
• Handel: Listung bei Sport-/Outdoor-Ketten, Shop-in-Shop
• Partner: lokaler Distributor oder Joint Venture wegen Marktzugang und Regulierung
• Positionierung: Premium-/Qualitäts-Image aus Deutschland gezielt nutzen$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Optionen hat ein deutscher Hersteller von Outdoor-Bekleidung, um in den chinesischen Markt einzusteigen?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Umsatzdelle im Übergang, Finanzierungsbedarf, Vertrieb muss umlernen, Kunden wollen Eigentum
• Chancen: planbare wiederkehrende Umsätze, engere Kundenbindung, Nutzungsdaten für Service, höherer Lifetime-Value
• Absicherung: Pilot mit einer Produktlinie, Hybrid-Angebot (Kauf + Abo), klare Kalkulation der Servicekosten$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen ergeben sich für einen mittelständischen Maschinenbauer, wenn er sein Geschäftsmodell von Einmalverkauf auf Subscription umstellt?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Konflikt mit Reisebüros, Verlust älterer Kundengruppen, hohe App-/Marketingkosten, technischer Betrieb
• Chancen: Margen ohne Vermittlerprovision, direkte Kundendaten, Personalisierung und Zusatzverkäufe
• Absicherung: schrittweise Umstellung, Reisebüros als Service-Partner behalten, Zielgruppen-Test$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen ergeben sich, wenn ein klassischer Reiseveranstalter voll auf Direktbuchung per App umstellt?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Rechtsstreit und Abfindungen, Verlust lokaler Präsenz und Service-Netz, Kundenirritation
• Chancen: einheitliche Preise, volle Marge, direkte Kundenbeziehung und Daten, besseres Online-Erlebnis
• Absicherung: Agenturmodell als Zwischenschritt, Händler als Service-Partner weiterführen$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen entstehen, wenn ein deutscher Autohersteller seine Händler-Verträge kündigt und Direktvertrieb einführt?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Konflikt mit Markenherstellern (Konditionen, Auslistung), Qualitätsrisiko fällt auf die Kette zurück
• Chancen: deutlich höhere Margen, Differenzierung, Preiseinstiegs-Segment besetzen, Kundenbindung
• Absicherung: Kategorien mit schwacher Markenbindung zuerst, Qualitätssicherung, Zwei-Marken-Strategie$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen ergeben sich, wenn eine Drogeriekette ihre Eigenmarken stark ausbaut?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Kannibalisierung des Kerngeschäfts, Support-Aufwand durch viele Kleinkunden, Preisdruck nach unten
• Chancen: neues Kundensegment, Funnel für spätere Upgrades, Skaleneffekte, Schutz gegen Billig-Wettbewerber
• Absicherung: klare Produkt-/Feature-Trennung, separates Pricing, automatisierter Support$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen entstehen, wenn ein etablierter B2B-Software-Anbieter ein zusätzliches Selfservice-Angebot für kleinere Unternehmen startet?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Verlust älterer/beratungsintensiver Kunden, Imageschaden in der Region, Beratungsqualität bei komplexen Produkten
• Chancen: massive Kostensenkung, Investition in digitale Produkte, jüngere Zielgruppen
• Absicherung: hybride Modelle (Video-Beratung, Partner-Standorte), Filialen datenbasiert statt pauschal schließen$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen ergeben sich, wenn eine Bank ihren Filialbetrieb deutlich reduziert und auf rein digitale Kundenbetreuung umstellt?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Verwässerung des Preis-Images, Komplexität in Sortiment und Lieferkette, Kannibalisierung der Standard-Eigenmarken
• Chancen: höhere Margen und Warenkörbe, neue Kundengruppen (Trading-down von Premium-Käufern), Differenzierung
• Absicherung: klare Markenarchitektur, Tests in Pilotregionen, saisonale Premium-Aktionen zuerst$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen entstehen, wenn ein Lebensmittel-Discounter seine Premium-Eigenmarken aggressiv ausweitet?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: hohe Fixkosten und Anlaufverluste, fehlendes lokales Netzwerk, Rechts-/Personalthemen, längere Zeit bis zum Umsatz
• Chancen: volle Marge und Kontrolle, direkte Kundenbeziehungen, Basis für weitere Osteuropa-Expansion
• Absicherung: klein starten (Vertriebsbüro), lokales Management einstellen, Meilenstein-Plan mit Exit-Option$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen ergeben sich, wenn ein deutscher Mittelständler eine eigene Tochtergesellschaft in Polen aufbaut statt dort einen Distributor zu beauftragen?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Verlust treuer Print-Leser und Anzeigenkunden, digitale Zahlungsbereitschaft unklar, Markenidentität
• Chancen: Druck-/Vertriebskosten entfallen, Daten und Personalisierung, neue Formate (Podcast, Newsletter, Events)
• Absicherung: Übergangsphase mit reduzierter Print-Frequenz, Print-Abonnenten aktiv migrieren, Paywall testen$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen entstehen, wenn ein traditioneller Magazin-Verlag seine Print-Ausgabe einstellt und voll auf digitale Abos setzt?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Risiken: Abhängigkeit vom Partner, geteilte Kundendaten, Programm-Kosten, eigene Marke tritt zurück
• Chancen: Zugang zu Vielflieger-Kundschaft, höhere Auslastung durch Punkte-Einlösung, Differenzierung gegenüber unabhängigen Hotels
• Absicherung: Pilot mit einer Region, klare Datenhoheit im Vertrag, Exklusivität vermeiden$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Risiken und Chancen ergeben sich, wenn eine Hotelkette ihr Loyalty-Programm an eine Airline-Allianz koppelt?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Umsatz: Preisstaffeln und Premium-Mitgliedschaften, Personal Training und Kurse, Zusatzverkäufe (Getränke, Merch)
• Auslastung: Off-Peak-Tarife, Firmenkooperationen, 24/7-Zugang
• Kosten: Energie- und Flächenoptimierung, Personaleinsatz nach Stoßzeiten, Geräte-Leasing prüfen
• Bindung: Kündigungsquote senken (Onboarding, Community) — billiger als Neugewinnung$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Hebel hat eine Fitnessstudio-Kette, um die Profitabilität pro Standort zu steigern?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Marge: Retouren senken (Größenberatung, bessere Fotos), Einkauf bündeln, Sortiment auf Renner fokussieren
• Umsatz je Kunde: Bundles und Cross-Selling, Wiederkauf durch CRM/Newsletter, Treueprogramm
• Kosten: Marketing-Mix auf effiziente Kanäle shiften, Fulfillment optimieren, Lagerumschlag erhöhen
• Neue Quellen: Secondhand-/Outlet-Kanal für Restposten$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann eine Online-Bekleidungs-Marke ihre Profitabilität erhöhen, ohne die Preise zu steigern?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Sortiment: margenstarke Eigenmarken, Frische-/Convenience-Anteil erhöhen, Regalplatz nach Marge steuern
• Umsatz: Bon-Größe durch Platzierung und Aktionen, Kundenkarte, lokale Spezialitäten
• Kosten: Abschriften/Food-Waste senken (dynamische Rabatte), Energieeffizienz, Personalplanung
• Zusatz: Café-/Snack-Ecke, Catering und Gemüsekisten-Abo$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Hebel hat ein Bio-Supermarkt, um die Marge pro Filiale zu steigern?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Churn senken: besseres Onboarding, Health-Scores und proaktiver Support, Jahresverträge mit Anreiz
• Expansion: Upselling in höhere Pläne, Zusatzmodule und Add-ons, nutzungsbasierte Komponenten
• Preis: Pakete nach Wert staffeln, jährliche Preisanpassungen
• Ökosystem: Integrationen und Partner-Apps erhöhen Wechselkosten$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann eine SaaS-Plattform für kleine Unternehmen ihren Customer-Lifetime-Value erhöhen?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Umsatz: Frühstücks-/Lunch-Angebote, saisonale Specials, Bon-Größe durch Kombis und Gebäck
• Auslastung: To-go und Pre-Order-App, tote Nachmittagszeiten mit Aktionen füllen, Abend-Nutzung (Events)
• Kosten: Wareneinsatz standardisieren, Personal nach Frequenz planen, Schwund reduzieren
• Extra: Bohnen/Merch-Verkauf, Catering, Treueprogramm$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Hebel hat eine Café-Kette, um die Profitabilität pro Standort zu steigern?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Preis/Mix: Premium-Linien und limitierte Editionen, Preisdisziplin im Handel, Direktvertrieb ausbauen
• Service: Ersatzteile, Garantieverlängerungen, Kochkurse/Content als Ökosystem
• Kosten: Plattform-/Gleichteile-Strategie, Einkauf bündeln, Komplexität im Sortiment abbauen
• Kanal: D2C-Onlineshop mit höherer Marge, Outlet für B-Ware statt Abschriften$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann ein Hersteller von Premium-Küchengeräten seine EBIT-Marge steigern?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Umsatz je Gast: Treatments und Pakete vorab verkaufen, Upgrades (Zimmer, Late-Checkout), F&B-Angebote
• Preis: dynamische Preise nach Saison/Auslastung, Längere-Aufenthalte-Anreize
• Kosten: Energie (Pool/Sauna) optimieren, Personaleinsatz nach Belegung, Wareneinsatz Spa
• Bindung: Direktbuchung statt OTA-Kommission, Gutscheine und Jahres-Specials$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Hebel hat ein Wellness-Hotel, um die Profitabilität pro Gast zu erhöhen?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Preis: wertbasierte Ersatzteilpreise statt Kosten-plus, Express-Zuschläge, Bundles mit Service
• Umsatz: Wartungsverträge und Teile-Abos, proaktive Ersatzempfehlungen (Sensorik), Nachrüst-Kits
• Schutz: Originalteile-Argumentation gegen Drittanbieter, Seriennummern-Bindung
• Kosten: Bestands- und Logistikoptimierung, 3D-Druck für Exoten$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann ein deutscher Maschinenbauer im Mittelstand die Profitabilität seines Ersatzteil-Geschäfts steigern?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Umsatz: Zusatzleistungen (Färben, Pflege), Produktverkauf am Stuhl, Online-Terminbuchung gegen Leerlauf
• Preis: Leistungsstaffeln (Junior/Senior-Stylist), Stoßzeiten-Preise
• Auslastung: Randzeiten-Rabatte, Walk-in-Steuerung, No-Show-Gebühren
• Kosten: Materialverbrauch standardisieren, Personalplanung nach Frequenz, Flächen teilen (Shop-in-Shop)$T$
WHERE difficulty = 'medium' AND prompt = $T$Welche Hebel hat ein Friseur-Salon-Franchise, um die Profitabilität pro Filiale zu erhöhen?$T$;

UPDATE public.creativity_cases SET reference_ideas = $T$• Umsatz je Order: Mindestbestellwerte, Service-Gebühren differenzieren, Werbeplätze/Ads für Restaurants
• Mix: Eigenzustellung nur wo dicht, sonst Restaurant-Zustellung, Abholung pushen
• Zusatz: Abo-Modell (Liefer-Flat), White-Label-Logistik, Lebensmittel/Convenience als zweite Kategorie
• Kosten: Fahrer-Routen bündeln, Betrugs-/Storno-Quote senken$T$
WHERE difficulty = 'medium' AND prompt = $T$Wie kann eine deutsche Restaurant-Lieferplattform ihre Take-Rate-Profitabilität steigern?$T$;

-- Alte hard-Cases (kontextlastig) deaktivieren

UPDATE public.creativity_cases SET active = false WHERE difficulty = 'hard' AND reference_ideas IS NULL;

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein deutscher Bierhersteller will in ein anderes europäisches Land expandieren. Nenne verschiedene Wege, wie er das tun kann — und sag kurz, welchen du zuerst testen würdest.$T$,
  $T$• Export light: über lokale Getränke-Großhändler und Gastronomie-Distributoren listen
• Handel: Listung bei Supermarkt-Ketten, zunächst als Spezialitäten-Import
• Partner: Lizenz-/Braupartnerschaft mit lokaler Brauerei, Joint Venture
• Eigenpräsenz: eigene Vertriebsgesellschaft, später lokale Braustätte; Brand-Bars/Taprooms als Marketing
• Priorisierung: risikoarm mit Distributor + Gastronomie starten, bei Traktion eigene Strukturen$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Eine Bäckerei-Kette will ins Nachbarland expandieren, hat aber wenig Budget. Welche Optionen gibt es — und wie würdest du sie priorisieren?$T$,
  $T$• Kapitalleicht: Franchise-Partner vor Ort, Lizenzmodell, Shop-in-Shop bei Supermärkten/Tankstellen
• Test: 1-2 Pilotfilialen in Grenznähe, Food-Trucks/Marktstände als Markttest
• Partner: Kooperation mit lokalem Bäcker (Co-Branding), Großhandel an Cafés/Hotels
• Priorisierung: erst Pilot/Franchise (wenig Kapital, schnelles Lernen), Eigenfilialen später$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein reiner Online-Möbelhändler will erstmals stationär präsent sein. Welche Formate kommen infrage, und was spricht jeweils dafür oder dagegen?$T$,
  $T$• Showroom (klein, zentral): Beratung + Bestellung online — geringe Fläche, kein Lager, aber keine Mitnahme
• Flagship-Store: Markenerlebnis — teuer, nur in Top-Städten sinnvoll
• Shop-in-Shop: Konzessionsfläche bei Möbelhäusern oder Kaufhäusern — schnell und günstig, wenig Kontrolle
• Pop-up-Stores: Markttest je Stadt — flexibel, aber temporär
• Outlet für Retouren/B-Ware: löst zugleich ein Kostenproblem$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein deutscher Streaming-Dienst für Dokumentationen will international wachsen. Wie kann er den Einstieg in neue Länder angehen?$T$,
  $T$• Länderwahl: Sprachnähe (DACH, dann EN), Zahlungsbereitschaft, Wettbewerbsdichte
• Leichtgewichtig: englische Version + Untertitel weltweit freischalten, Performance beobachten
• Lokal: Untertitel/Dubbing, lokaler Content und Kuratierung, lokale Preise
• Partner: Bundles mit Telkos/TV-Anbietern, Content-Lizenz-Deals mit lokalen Sendern
• Marketing: Nischen-Communities (Wissenschaft, Natur) statt breiter Kampagnen$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein Hersteller von E-Scootern verkauft bisher nur an Privatkunden. Wie kann er zusätzlich ins Firmenkunden-Geschäft (B2B) einsteigen?$T$,
  $T$• Segmente: Flotten für Lieferdienste, Mitarbeiter-Mobilität (Job-Scooter), Hotels/Campusse, Kommunen
• Angebot: Leasing/Abo statt Kauf, Wartungs- und Serviceverträge, Flottenmanagement-Software
• Vertrieb: eigenes Key-Account-Team, Partnerschaften mit Leasing-Firmen und Mobilitätsbudget-Anbietern
• Start: Pilotkunden mit Referenzcharakter, dann Skalierung$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Eine Premium-Eismarke verkauft bisher nur über Supermärkte. Welche neuen Vertriebskanäle könnte sie erschließen — kurz- und langfristig?$T$,
  $T$• Kurzfristig: Gastronomie (Restaurants, Cafés), Kioske und Tankstellen, Lieferdienste/Quick-Commerce
• Erlebnis: eigene Eisdielen/Flagships, Food-Trucks, Events und Festivals
• Direkt: Online-Versand (Trockeneis-Logistik), Abo-Boxen, Corporate Gifting
• Langfristig: Travel Retail (Flughäfen), Export, Lizenzprodukte (Desserts, Shakes)$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein Anbieter einer Sprachlern-App für Privatnutzer will Unternehmen als Kunden gewinnen. Welche Einstiegswege gibt es?$T$,
  $T$• Produkt: Team-Lizenzen mit Admin-Dashboard, Business-Sprachkurse (Meetings, E-Mails), Fortschritts-Reporting
• Vertrieb: HR-/L&D-Abteilungen direkt, Benefits-Plattformen, HR-Software-Marktplätze
• Einstieg: Freemium für Teams, Pilotprogramme mit Referenzkunden, Webinare
• Partner: Weiterbildungsanbieter und Business Schools, Reseller$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein italienischer Modehändler will nach Deutschland expandieren — online, stationär oder beides? Nenne die Optionen und wäge kurz ab.$T$,
  $T$• Online first: eigener DE-Shop + Zalando/About You — schnell, messbar, geringes Risiko; aber Marketingkosten und Retouren
• Stationär: eigene Stores in Top-Lagen — Markenaufbau, aber teuer und langsam; Alternative: Shop-in-Shop/Konzession
• Hybrid: online starten, Nachfrage-Städte identifizieren, dort Pop-ups → beste Lernkurve
• Partner: Wholesale an Multibrand-Boutiquen als risikoarmer Türöffner$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein Betreiber von Padel-Tennis-Hallen will in zwei Jahren von 3 auf 20 Standorte wachsen. Welche Wege gibt es, so schnell zu skalieren?$T$,
  $T$• Kapital: Investoren/Private Equity, Sale-and-Leaseback der Immobilien, Fremdkapital
• Modelle: Franchise, Joint Ventures mit lokalen Betreibern, Management-Verträge für fremde Hallen
• Anorganisch: Übernahme bestehender Padel-/Tennis-Anlagen und Umbau
• Leicht: Flächen mieten statt bauen (Hallen, Industrieflächen), Partnerschaften mit Fitnessketten$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'market_entry', $T$Ein deutscher Tiefkühlkost-Hersteller beliefert bisher nur den Einzelhandel. Wie kann er in die Gastronomie (B2B) einsteigen, und worauf sollte er achten?$T$,
  $T$• Zugang: Gastro-Großhändler (Metro, Transgourmet) listen, eigener Außendienst für Ketten, Messen
• Angebot: Großgebinde und Convenience-Grade, Speisekarten-Lösungen, verlässliche Liefer-Logistik
• Segmente: Systemgastronomie, Kantinen/Caterer, Hotels — unterschiedliche Anforderungen
• Achtung: andere Margen- und Preislogik, Kannibalisierung vermeiden, ggf. eigene B2B-Marke$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Eine Supermarktkette überlegt, nachts unbemannte, kassenlose Mini-Filialen anzubieten. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: Umsatz in toten Stunden, Differenzierung, Personalkosten minimal, Daten über Nachtnachfrage
• Risiken: Diebstahl/Vandalismus, Technikkosten und -ausfälle, Akzeptanz älterer Kunden, rechtliche Fragen
• Absicherung: Pilot an 2-3 Standorten, Kameratechnik + App-Zugang, begrenztes Sortiment$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Ein Spielzeughersteller will KI-gestützte, sprechende Kuscheltiere auf den Markt bringen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: Differenzierung und Premium-Preis, wiederkehrende Umsätze (Abo/Inhalte), starkes Medieninteresse
• Risiken: Datenschutz bei Kindern (sehr sensibel!), Fehlverhalten der KI, Batterien/Sicherheit, Eltern-Skepsis
• Absicherung: Offline-Modus und strenge Inhaltsfilter, Zertifizierungen, transparente Eltern-Kontrolle$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Eine Airline überlegt, für Handgepäck eine Gebühr einzuführen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: Zusatzerlöse, schnelleres Boarding, wettbewerbsfähigere Basispreise in Vergleichsportalen
• Risiken: Imageschaden und Kundenabwanderung, schlechte Presse, Vergleichbarkeit sinkt scheinbar — Vertrauensverlust
• Absicherung: nur bei Basistarifen, klare Kommunikation, Vielflieger ausnehmen, A/B-Test auf ausgewählten Strecken$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Eine Traditionsbrauerei will ein alkoholfreies Trend-Getränk für die Gen Z launchen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: Wachstumsmarkt alkoholfrei, neue junge Zielgruppe, Nutzung vorhandener Brau- und Vertriebs-Infrastruktur
• Risiken: Marke passt nicht zur Zielgruppe (zu traditionell), Kannibalisierung des Kerngeschäfts, Trend-Lebensdauer
• Absicherung: eigenständige Marke statt Dachmarke, Social-Media-first-Marketing, limitierter Test-Launch$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Ein Möbelhaus will Möbel im Abo vermieten statt nur zu verkaufen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: wiederkehrende Umsätze, junge/mobile Zielgruppen (Studenten, Expats), B2B (Büros, möblierte Wohnungen)
• Risiken: Kapitalbindung im Bestand, Abnutzung und Aufbereitungskosten, Logistik, Kannibalisierung des Verkaufs
• Absicherung: robustes Sortiment für Miete, B2B zuerst, Preis so kalkulieren, dass 2. und 3. Mietzyklus profitabel sind$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Eine Krankenkasse will Fitness-Tracker-Daten für Beitrags-Boni nutzen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: gesündere Versicherte und geringere Kosten, Differenzierung, junge Zielgruppen, Präventions-Image
• Risiken: Datenschutz und öffentliche Debatte, Diskriminierungsvorwurf (Benachteiligung Kranker), Manipulation der Daten
• Absicherung: freiwillig und bonus-basiert (nie Malus), Datensparsamkeit, unabhängige Zertifizierung$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Ein Modehändler will einen großen Secondhand-Bereich in seinen Filialen einführen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: Nachhaltigkeits-Image, neue preisbewusste Kunden, Frequenz durch Ankauf, Marge auf kuratierte Ware
• Risiken: Kannibalisierung des Neuware-Geschäfts, aufwändige Prozesse (Prüfung, Aufbereitung), Flächenverlust
• Absicherung: Pilotfilialen, klare Flächen-Trennung, Ankauf gegen Gutscheine (bindet Umsatz im Haus)$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Ein Stadtwerk will große E-Auto-Ladeparks in der Innenstadt bauen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: Wachstumsmarkt, Standortvorteil und Netz-Know-how, Zusatzgeschäft (Shop, Werbung), kommunale Unterstützung
• Risiken: hohe Investitionen bei unsicherer Auslastung, Technologie-/Preisrisiko Strom, private Wettbewerber (Tesla, EnBW)
• Absicherung: stufenweiser Ausbau, Anker-Partner (Taxi-/Carsharing-Flotten), Kombination mit Parkhäusern$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Eine Fast-Food-Kette will Filialen mit vollautomatischer Küche und ohne Personal testen. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: Personalkosten und -mangel gelöst, 24/7-Betrieb, konstante Qualität, PR-Effekt
• Risiken: hohe Technikkosten und Ausfälle, Kundenerlebnis leidet, öffentliche Jobverlust-Debatte, begrenztes Menü
• Absicherung: Hybrid (Automatisierung hinten, Mensch vorn), Standorte mit hohem Durchsatz zuerst, Wartungsverträge$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'risks_opportunities', $T$Ein Schulbuch-Verlag will neue Bücher nur noch digital anbieten. Welche Risiken und Chancen siehst du?$T$,
  $T$• Chancen: keine Druck-/Lagerkosten, Updates und interaktive Inhalte, Lizenzmodelle je Schüler, Lernanalysen
• Risiken: Schul-Infrastruktur und Bundesland-Vorgaben, Lehrer-Akzeptanz, Piraterie, Verlust des Gebrauchtmarkt-Ersatzkaufs
• Absicherung: hybride Übergangsphase, Pilotschulen, Bundle Print+Digital, starke Lehrerfortbildung$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Ein Kino ist unter der Woche halb leer. Welche Ideen hast du, Umsatz und Profitabilität zu steigern — ohne einfach die Ticketpreise zu erhöhen?$T$,
  $T$• Auslastung: Themen-Abende (Horror-Dienstag), Senioren-/Studenten-Nachmittage, Abo-Modell (Kino-Flat)
• Neue Nutzung: Säle tagsüber vermieten (Firmen-Events, Gaming-Turniere, Vorlesungen), Kindergeburtstage
• Umsatz je Besucher: Food-&-Beverage-Bundles, Premium-Sitze, Vorbestellung per App
• Partnerschaften: Restaurants (Dinner+Kino), lokale Vereine, Sneak-Previews$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Ein Freizeitpark will den Umsatz pro Besucher steigern. Sammle Ideen entlang des gesamten Besuchs — von der Buchung bis zum Verlassen des Parks.$T$,
  $T$• Vor dem Besuch: Online-Upsells (Express-Pass, Parken, Menü-Deals), dynamische Ticketpreise, Übernachtungs-Pakete
• Im Park: Fotos und Videos der Fahrten, Merchandising an Attraktionen, Premium-Erlebnisse (VIP-Tour, Fast Lane)
• Essen: Themen-Restaurants, Refill-Becher, Family-Bundles
• Danach: Jahreskarten-Upgrade am Ausgang, Online-Shop, Geburtstags-/Event-Angebote$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Eine Autowerkstatt-Kette will profitabler werden. Welche Hebel gibt es auf der Umsatz- und auf der Kostenseite?$T$,
  $T$• Umsatz: Wartungspakete und Service-Abos, Zusatzverkäufe (Reifen, Wischer) am Termin, Hol-/Bring-Service gegen Gebühr
• Preis: transparente Paketpreise statt Stundensätze, Express-Zuschläge
• Kosten: Teile-Einkauf bündeln, Werkstattauslastung glätten (Online-Termine), Standardzeiten je Reparatur
• Bindung: Erinnerungs-Service (TÜV, Inspektion), Flottenverträge mit Firmen$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Ein Zoo sucht neue, wiederkehrende Einnahmequellen. Welche Ideen hast du?$T$,
  $T$• Mitgliedschaften: Jahreskarten-Stufen, Familien-Abos, Förderkreis
• Patenschaften: Tier-Patenschaften für Privatpersonen und Firmen
• Events: Abendführungen, Übernachtungen im Zoo, Firmenevents und Hochzeiten
• B2B/Content: Bildungsprogramme für Schulen im Abo, Kamera-Livestreams mit Sponsoring, Gastro-/Shop-Verpachtung$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Ein Buchverlag will seine Marge verbessern, ohne mehr Bücher verkaufen zu müssen. Welche Möglichkeiten siehst du?$T$,
  $T$• Direkt: eigener Online-Shop und Direktvertrieb (Handelsrabatt spart 40-50 %), signierte Sonderausgaben
• Formate: E-Book/Hörbuch (kein Druck), Print-on-Demand für Backlist statt Lager
• Rechte: Lizenzen (Übersetzung, Film, Hörspiel), Bundles
• Kosten: Druck bündeln, Remittenden senken (kleinere Erstauflagen), Backlist pflegen statt Novitäten-Flut$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Eine Bowlingbahn ist abends voll, tagsüber leer. Welche Möglichkeiten gibt es, die leeren Stunden zu Geld zu machen?$T$,
  $T$• Zielgruppen tagsüber: Senioren-Ligen, Schulen und Kindergärten, Schichtarbeiter, Studenten-Deals
• B2B: Firmen-Teamevents, Meetingraum + Bowling-Pakete
• Fläche anders nutzen: Co-Working mit Kaffee, Kurse/Events, Kindergeburtstage am Nachmittag
• Preis: dynamische Preise (Happy Hour), Tages-Flatrates, Abo-Modelle$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Ein Software-Anbieter hat nur einen einzigen Abo-Preis für alle Kunden. Wie könnte er seine Monetarisierung weiterentwickeln?$T$,
  $T$• Stufen: Basic/Pro/Enterprise nach Funktionsumfang, Team-Preise pro Nutzer
• Nutzung: nutzungsbasierte Komponenten (API-Calls, Speicher), Add-ons und Module
• Segmente: günstiger Einstieg für Kleine, Enterprise mit Support-SLA und Security-Features
• Extras: Jahreszahlung mit Rabatt, Onboarding-/Schulungspakete, Partner-Marktplatz mit Umsatzbeteiligung$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Ein Fußballverein aus der 2. Liga will seine Einnahmen diversifizieren. Sammle Ideen — von naheliegend bis kreativ.$T$,
  $T$• Stadion: Events und Konzerte, Stadiontouren, Business-Seats und Logen unter der Woche vermieten
• Fans: Mitglieder-Abos mit Content, eSports-Team, Fan-Token/Kollektionen, internationaler Merch-Shop
• Partner: Namensrechte (Stadion, Trainingszentrum), regionale Business-Netzwerke
• Entwicklung: Nachwuchsleistungszentrum + Transfererlöse, Fußballschulen und Camps, Immobilien am Stadion$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Eine Bäckerei wirft jeden Abend viel unverkaufte Ware weg. Welche Ideen hast du, daraus Umsatz zu machen oder Kosten zu sparen?$T$,
  $T$• Abverkauf: Abend-Rabatte (ab 17 Uhr −50 %), Überraschungstüten (Too Good To Go), Vortagsware-Ecke
• Weiterverwertung: Croutons/Semmelbrösel/Chips aus Brot, Brotpudding und Snacks, Tierfutter-Kooperationen
• Steuerung: bessere Produktionsplanung nach Wochentag/Wetter, Sortiment am Abend ausdünnen, Vorbestellungen
• Sozial/Marke: Spenden an Tafeln (Entsorgungskosten sparen + Image)$T$, true);

INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)
VALUES ('hard', 'financial', $T$Ein Co-Working-Anbieter will die Profitabilität je Standort erhöhen. Welche Hebel siehst du auf Umsatz- und Kostenseite?$T$,
  $T$• Umsatz: Meetingräume stundenweise an Externe, virtuelle Büro-Adressen, Events/Workshops, Kaffee-/Snack-Upsells
• Mix: feste Büros (höhere Marge) vs. Flex-Desks ausbalancieren, Team-Pakete, Enterprise-Kunden
• Auslastung: Tages-/Abendpässe, Wochenend-Nutzung (Kurse, Communities)
• Kosten: Flächen untervermieten, Energie smart steuern, Reinigung/Services poolen$T$, true);

COMMIT;
