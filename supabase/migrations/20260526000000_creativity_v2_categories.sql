-- ============================================================
-- Creativity Drill v2: case-style categories instead of industries
-- ============================================================
-- Old: filtered by industry (tech / retail / healthcare / mobility / finance / sustainability)
-- New: filtered by category (market_entry / risks_opportunities / financial)
-- Old AI-generated questions deleted; 60 hand-curated cases inserted below.
-- Shared Supabase project — affects Production creativity drill too.
-- ============================================================

-- 1. Wipe old industry-keyed cases
DELETE FROM public.creativity_cases;

-- 2. Schema slim: drop unused columns
ALTER TABLE public.creativity_cases DROP COLUMN IF EXISTS industry;
ALTER TABLE public.creativity_cases DROP COLUMN IF EXISTS context_info;
ALTER TABLE public.creativity_cases DROP COLUMN IF EXISTS reference_ideas;

-- 3. New category column (market_entry / risks_opportunities / financial)
ALTER TABLE public.creativity_cases ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'market_entry';

-- 4. 60 curated cases (3 categories × 2 difficulties × 10)
-- ----------------------------------------------------------------

-- ============================================
-- MARKET ENTRY · MEDIUM (10)
-- ============================================
INSERT INTO public.creativity_cases (difficulty, category, prompt) VALUES
('medium', 'market_entry', 'Welche Optionen hat eine deutsche Buchhandelskette, um nach Italien zu expandieren?'),
('medium', 'market_entry', 'Wie kann eine spanische Olivenöl-Manufaktur in den deutschen Premium-Lebensmittelmarkt eintreten?'),
('medium', 'market_entry', 'Welche Wege hat ein britisches Friseur-Salon-Franchise, um in den niederländischen Markt zu expandieren?'),
('medium', 'market_entry', 'Welche Optionen hat ein deutscher Hersteller von Elektro-Lastenrädern, um den französischen Markt zu erschließen?'),
('medium', 'market_entry', 'Wie kann eine schweizerische Schokoladen-Boutique-Kette in den US-Markt eintreten?'),
('medium', 'market_entry', 'Welche Wege hat ein polnischer Bio-Kosmetik-Hersteller, um nach Skandinavien zu expandieren?'),
('medium', 'market_entry', 'Welche Optionen hat eine österreichische Yoga-Studio-Kette, um in den deutschen Markt einzutreten?'),
('medium', 'market_entry', 'Wie kann ein niederländischer Anbieter von Photovoltaik-Anlagen den deutschen Privatkunden-Markt erschließen?'),
('medium', 'market_entry', 'Welche Wege hat eine französische Patisserie-Kette, um nach Japan zu expandieren?'),
('medium', 'market_entry', 'Welche Optionen hat ein deutscher Hersteller von Outdoor-Bekleidung, um in den chinesischen Markt einzusteigen?');

-- ============================================
-- MARKET ENTRY · HARD (10)
-- ============================================
INSERT INTO public.creativity_cases (difficulty, category, prompt) VALUES
('hard', 'market_entry', 'Ein deutscher Bio-Premium-Müsli-Hersteller mit starkem Vertrieb über Reformhäuser und Online-Direct-to-Consumer plant den Markteintritt in die USA. Im US-Markt dominieren etablierte Marken über Supermarkt-Eigenmarken, die Health-Food-Nische ist fragmentiert und stark Influencer-getrieben. Welche Markteintritts-Optionen sollten sie prüfen?'),
('hard', 'market_entry', 'Ein deutscher Premium-Lautsprecher-Hersteller, bisher ausschließlich über Fachhandel in DACH, plant den Eintritt in den US-Markt. Der US-Audio-Markt ist stark gespalten zwischen Mainstream-Brands über Amazon und einer engen High-End-Custom-Installer-Nische. Welche Markteintritts-Optionen sollten sie prüfen?'),
('hard', 'market_entry', 'Eine schweizerische Privatbank, die seit Generationen vermögende Familien in der DACH-Region bedient, plant den Markteintritt in Singapur. Der lokale Markt wird von etablierten asiatischen Privatbanken dominiert, Regulierung schränkt grenzüberschreitende Geschäftsmodelle stark ein. Welche Wege sollten sie in Erwägung ziehen?'),
('hard', 'market_entry', 'Eine deutsche SaaS-Plattform für Handwerksbetriebe, bisher nur in Deutschland aktiv, plant die Expansion nach Spanien. Spanische Handwerker sind preissensibler, der Digitalisierungsgrad ist niedriger, und ein lokaler Wettbewerber dominiert mit einem Freemium-Modell. Welche Optionen sollten sie prüfen?'),
('hard', 'market_entry', 'Eine französische Luxus-Kosmetik-Marke, deren Vertrieb fast vollständig über eigene Boutiquen und Department Stores in Paris, Mailand und London läuft, will den indischen Markt erschließen. Der indische Premium-Beauty-Markt wächst stark, ist aber Tier-City-fokussiert und stark E-Commerce-getrieben. Welche Markteintritts-Strategien kommen in Frage?'),
('hard', 'market_entry', 'Ein nordeuropäisches Fintech mit Open-Banking-API, sehr erfolgreich in Skandinavien, plant den Eintritt in den deutschen Markt. Deutschland hat strengere Datenschutz-Auflagen, eine konservative Bank-Kultur und mehrere lokale Fintech-Konkurrenten mit größerer Vertriebs-Power. Welche Strategien sollten sie prüfen?'),
('hard', 'market_entry', 'Eine deutsche Brauerei mit Premium-Pilsner-Sortiment, bisher nur in DACH und Tschechien, plant den Markteintritt in Brasilien. Der brasilianische Biermarkt wird von zwei Konzernen dominiert, Import-Premium ist eine wachsende Nische, und der Vertrieb läuft eher über Bars und Hotels als über Supermärkte. Welche Optionen kommen in Frage?'),
('hard', 'market_entry', 'Ein deutscher Hersteller von Industrieautomatisierungs-Lösungen, traditionell stark im Maschinenbau-DACH-Markt, plant die Expansion nach Indien. Der indische Markt ist preissensibler, Service-Erwartungen sind hoch, und mehrere chinesische Wettbewerber bieten günstige Standardlösungen an. Welche Markteintritts-Optionen sollten sie prüfen?'),
('hard', 'market_entry', 'Eine deutsche Sportstudio-Kette mit Fokus auf Premium-Functional-Training, bisher in deutschen Großstädten, plant den Eintritt in den UK-Markt. London ist gesättigt mit Boutique-Studios, Mieten sind hoch, und der typische Kundenkreis bucht über Class-Pass-ähnliche Aggregatoren. Welche Wege sollten sie prüfen?'),
('hard', 'market_entry', 'Ein deutscher Online-Optiker, der per Direct-to-Consumer-Modell schnell in DACH gewachsen ist, plant den Markteintritt in Italien. Italiener kaufen Brillen traditionell beim lokalen Optiker mit Beratungsgespräch, der Online-Marktanteil ist niedrig, demografisch besteht aber starkes Wachstumspotenzial. Welche Optionen sollten sie prüfen?');

-- ============================================
-- RISIKEN & OPPORTUNITIES · MEDIUM (10)
-- ============================================
INSERT INTO public.creativity_cases (difficulty, category, prompt) VALUES
('medium', 'risks_opportunities', 'Welche Risiken und Chancen ergeben sich für einen mittelständischen Maschinenbauer, wenn er sein Geschäftsmodell von Einmalverkauf auf Subscription umstellt?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen ergeben sich, wenn ein klassischer Reiseveranstalter voll auf Direktbuchung per App umstellt?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen entstehen, wenn ein deutscher Autohersteller seine Händler-Verträge kündigt und Direktvertrieb einführt?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen ergeben sich, wenn eine Drogeriekette ihre Eigenmarken stark ausbaut?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen entstehen, wenn ein etablierter B2B-Software-Anbieter ein zusätzliches Selfservice-Angebot für kleinere Unternehmen startet?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen ergeben sich, wenn eine Bank ihren Filialbetrieb deutlich reduziert und auf rein digitale Kundenbetreuung umstellt?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen entstehen, wenn ein Lebensmittel-Discounter seine Premium-Eigenmarken aggressiv ausweitet?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen ergeben sich, wenn ein deutscher Mittelständler eine eigene Tochtergesellschaft in Polen aufbaut statt dort einen Distributor zu beauftragen?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen entstehen, wenn ein traditioneller Magazin-Verlag seine Print-Ausgabe einstellt und voll auf digitale Abos setzt?'),
('medium', 'risks_opportunities', 'Welche Risiken und Chancen ergeben sich, wenn eine Hotelkette ihr Loyalty-Programm an eine Airline-Allianz koppelt?');

-- ============================================
-- RISIKEN & OPPORTUNITIES · HARD (10)
-- ============================================
INSERT INTO public.creativity_cases (difficulty, category, prompt) VALUES
('hard', 'risks_opportunities', 'Die XY GmbH, ein mittelgroßes IT-Consulting aus Großbritannien mit Fokus auf SAP-Migrationen, plant die Übernahme eines US-amerikanischen Startups, das sich auf KI-gestützte Code-Modernisierung spezialisiert hat. Das Startup arbeitet remote-first und bedient bisher hauptsächlich Mittelstandskunden. Welche Risiken und Chancen ergeben sich aus dieser Übernahme?'),
('hard', 'risks_opportunities', 'Eine etablierte deutsche Logistik-Gruppe, traditionell stark im Stückgut-Geschäft mit eigener LKW-Flotte, plant die Übernahme eines digitalen Logistik-Marktplatzes, der ohne eigene Assets Frachten zwischen Verladern und Speditionen vermittelt. Der Marktplatz hat zwar schnelles Wachstum, aber noch keine Profitabilität. Welche Risiken und Chancen sollten sie bewerten?'),
('hard', 'risks_opportunities', 'Ein traditioneller deutscher Brillenhersteller, bekannt für Premium-Kunststoffrahmen und mit eigenem Vertrieb über Optiker, plant den Launch einer eigenen Direct-to-Consumer-Marke mit eigenständigem Branding und Online-Shop. Bestehende Optiker reagieren bereits skeptisch. Welche Risiken und Chancen sind besonders zu prüfen?'),
('hard', 'risks_opportunities', 'Eine mittelständische deutsche Apotheken-Kette, deren stationäres Filial-Netz seit Jahren stagniert, plant die Übernahme eines Telemedizin-Startups, das Patienten direkt mit Ärzten vernetzt. Das Startup hat eine etablierte App mit hoher Nutzer-Engagement, aber Regulierung im DACH-Markt ist komplex. Welche Risiken und Chancen ergeben sich aus dieser Übernahme?'),
('hard', 'risks_opportunities', 'Eine traditionelle Schweizer Uhrenmanufaktur mit langem Erbe im mechanischen Premium-Segment plant den Launch einer Smartwatch-Linie unter einer separaten Marke. Das Smartwatch-Segment ist stark von US-Tech-Konzernen dominiert, aber Premium-Lifestyle-Smartwatches sind ein wachsendes Sub-Segment. Welche Risiken und Chancen sind zu adressieren?'),
('hard', 'risks_opportunities', 'Eine große deutsche Versicherung, deren Kerngeschäft im Vertrieb über Makler und eigenen Außendienst liegt, plant eine White-Label-Versicherungs-Plattform für Fintechs zu launchen. Die Plattform soll es Fintechs erlauben, eigene Versicherungsprodukte schnell anzubieten. Welche Risiken und Chancen sind besonders zu beachten?'),
('hard', 'risks_opportunities', 'Ein deutscher Lebensmittel-Konzern, mit Eigenmarken in fast jedem deutschen Supermarkt, plant den Launch einer eigenen Direct-to-Consumer-Plattform für Bio-Premium-Produkte. Bestehende Handelspartner reagieren bereits irritiert, und der Konzern hat kein Direkt-Vertriebs-Knowhow. Welche Risiken und Chancen sind kritisch?'),
('hard', 'risks_opportunities', 'Eine erfolgreiche deutsche E-Bike-Marke, traditionell über Fachhandel mit hoher Marge verkauft, plant die Eröffnung eigener Flagship-Stores in deutschen Großstädten. Bestehende Händler fürchten Konkurrenz, gleichzeitig will die Marke das Markenerlebnis kontrollieren. Welche Risiken und Chancen sind zu erwarten?'),
('hard', 'risks_opportunities', 'Ein deutsches Mittelstandsunternehmen aus der Kunststoff-Verarbeitung, bisher fast ausschließlich B2B-Zulieferer für Automobilhersteller, plant die Diversifikation in den Medizintechnik-Markt. Die Margen dort sind höher, aber Regulierung (CE-Zertifizierung, FDA) ist anspruchsvoll. Welche Risiken und Chancen sind zentral?'),
('hard', 'risks_opportunities', 'Eine deutsche Bank, die im klassischen Filialgeschäft Kosten reduzieren muss, plant die Auslagerung ihres gesamten IT-Betriebs an einen indischen Service-Provider. Bestehende IT-Mitarbeiter sind betroffen, regulatorische Anforderungen (BaFin) sind hoch, und es geht um sensible Kundendaten. Welche Risiken und Chancen sind besonders zu prüfen?');

-- ============================================
-- FINANCIAL (Profitability) · MEDIUM (10)
-- ============================================
INSERT INTO public.creativity_cases (difficulty, category, prompt) VALUES
('medium', 'financial', 'Welche Hebel hat eine Fitnessstudio-Kette, um die Profitabilität pro Standort zu steigern?'),
('medium', 'financial', 'Wie kann eine Online-Bekleidungs-Marke ihre Profitabilität erhöhen, ohne die Preise zu steigern?'),
('medium', 'financial', 'Welche Hebel hat ein Bio-Supermarkt, um die Marge pro Filiale zu steigern?'),
('medium', 'financial', 'Wie kann eine SaaS-Plattform für kleine Unternehmen ihren Customer-Lifetime-Value erhöhen?'),
('medium', 'financial', 'Welche Hebel hat eine Café-Kette, um die Profitabilität pro Standort zu steigern?'),
('medium', 'financial', 'Wie kann ein Hersteller von Premium-Küchengeräten seine EBIT-Marge steigern?'),
('medium', 'financial', 'Welche Hebel hat ein Wellness-Hotel, um die Profitabilität pro Gast zu erhöhen?'),
('medium', 'financial', 'Wie kann ein deutscher Maschinenbauer im Mittelstand die Profitabilität seines Ersatzteil-Geschäfts steigern?'),
('medium', 'financial', 'Welche Hebel hat ein Friseur-Salon-Franchise, um die Profitabilität pro Filiale zu erhöhen?'),
('medium', 'financial', 'Wie kann eine deutsche Restaurant-Lieferplattform ihre Take-Rate-Profitabilität steigern?');

-- ============================================
-- FINANCIAL (Profitability) · HARD (10)
-- ============================================
INSERT INTO public.creativity_cases (difficulty, category, prompt) VALUES
('hard', 'financial', 'Eine deutsche Restaurantkette mit Schwerpunkt auf urbanen Lagen kämpft seit der Energiekrise mit sinkenden Margen — Lebensmittelkosten sind gestiegen, Personal teurer, Innenstadt-Mieten ziehen weiter an. Das Mittagsgeschäft läuft gut, abends ist die Auslastung schwach. Welche Hebel haben sie, um die Profitabilität zu steigern?'),
('hard', 'financial', 'Eine deutsche Modemarke im Mittelpreissegment kämpft mit fallenden EBIT-Margen — der Online-Anteil wächst zwar, aber Retouren-Quoten und Marketing-Kosten ziehen die Bruttomarge runter, gleichzeitig läuft der stationäre Handel über Department-Stores schwächer als geplant. Welche Hebel haben sie, um die Profitabilität wieder zu erhöhen?'),
('hard', 'financial', 'Ein deutscher Hersteller von Industrie-Heizsystemen sieht seit zwei Jahren stagnierende Gewinne — Materialkosten sind gestiegen, die Löhne in der Produktion ebenfalls, und Preiserhöhungen lassen sich gegenüber den langfristigen Auftraggebern nur schwer durchsetzen. Welche Hebel kommen in Frage?'),
('hard', 'financial', 'Ein mittelständischer deutscher Online-Shop für Heimtierbedarf hat hohe Konversion und gute Kundenbewertungen, aber die EBIT-Marge ist niedrig — Versandkosten und Lagerkosten sind hoch, das durchschnittliche Bestellvolumen ist klein, und die Wiederkäufer-Rate ist gut aber nicht herausragend. Welche Hebel haben sie?'),
('hard', 'financial', 'Eine große deutsche Privatklinik-Gruppe, deren Versorgungs-Geschäft mit gesetzlichen Krankenkassen gerade noch kostendeckend läuft, sucht Wege, die Gesamt-Profitabilität zu steigern — Selbstzahler-Anteil ist wachsend, Bettenkapazität ist nicht voll ausgelastet, Auslandspatienten sind eine ungenutzte Option. Welche Hebel kommen in Frage?'),
('hard', 'financial', 'Eine deutsche Beratungsfirma mit Schwerpunkt Strategy-Consulting kämpft mit sinkender Auslastung der Senior-Berater — der Pyramidenfuß (Junior-Auslastung) ist OK, aber Senior-Tage werden nur knapp verkauft. Mitarbeiterkosten sind hoch, Kundenakquise dauert lange. Welche Hebel haben sie?'),
('hard', 'financial', 'Ein deutscher SaaS-Anbieter für mittelständische Buchhaltungs-Software wuchs zuletzt stark, aber die Burn-Rate ist hoch — Customer-Acquisition-Cost ist gestiegen, Churn bei Kleinkunden hoch, Sales-Cycle bei Enterprise-Kunden lang. Welche Hebel haben sie, um Profitabilität zu erreichen?'),
('hard', 'financial', 'Eine Premium-Marke für Outdoor-Bekleidung, traditionell hochpreisig und mit ausgesuchten Händlern, sieht ihre Profit-Marge bedroht — etablierte Discount-Outdoor-Marken nähern sich qualitativ, eigene Lagerhaltung wird teurer, und die Generation Z kauft anders ein als Boomer. Welche Hebel sollten sie evaluieren?'),
('hard', 'financial', 'Ein deutscher Pizza-Lieferdienst mit Standorten in mehreren Großstädten kämpft mit dünnen Margen — Lieferplattform-Provisionen fressen Marge, eigene Fahrer sind teurer als gedacht, das Bestellvolumen pro Mitarbeiter-Stunde stagniert. Welche Hebel haben sie?'),
('hard', 'financial', 'Eine große Co-Working-Kette mit Standorten in deutschen Innenstädten kämpft seit dem Remote-Work-Boom mit niedriger Auslastung und hohen Mietkosten — Bestandsverträge haben lange Laufzeiten, das Tagesnutzer-Geschäft wächst, aber der Festkunden-Anteil schrumpft. Welche Hebel haben sie, um die Profitabilität zu retten?');

-- ============================================
-- 5. Sanity check (run after the inserts above)
-- ============================================
-- SELECT category, difficulty, count(*) FROM public.creativity_cases
-- GROUP BY 1, 2 ORDER BY 1, 2;
-- Expected: 6 rows, each with count = 10.
