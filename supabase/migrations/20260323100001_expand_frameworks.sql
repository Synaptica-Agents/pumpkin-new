-- ============================================================
-- Expand framework_cases from 12 to 30 total
-- 18 new cases: 6 easy, 6 medium, 6 hard
-- All content in German
-- ============================================================

-- EASY (6): Obvious framework choices, clear problems
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('easy', 'profitability',
   'Eine regionale Fluggesellschaft verzeichnet sinkende Gewinne trotz stabiler Passagierzahlen. Der CFO vermutet steigende Betriebskosten als Hauptursache.',
   'Kurz- und Mittelstreckenrouten in Europa, Kerosinkosten stark gestiegen',
   'Profitability Framework',
   '• Kostenanalyse: Variable Kosten (Kerosin, Handling) vs. Fixkosten (Leasing, Personal) aufschlüsseln und Kostentreiber identifizieren
• Revenue-Seite: Yield pro Passagier und Ancillary Revenue analysieren, Preisgestaltung auf unprofitablen Routen prüfen
• Handlungsempfehlung: Unprofitable Routen streichen, Hedging-Strategie für Kerosin, Ancillary-Revenue-Modell ausbauen',
   true),

  ('easy', 'market_entry',
   'Ein deutsches Pharmaunternehmen mit starkem OTC-Portfolio möchte in den indischen Markt eintreten. Strukturiere deine Analyse für den Markteintritt.',
   'Wachsende Mittelschicht in Indien, starke lokale Wettbewerber (Sun Pharma, Cipla)',
   'Market Entry Framework',
   '• Marktattraktivität: Marktgrösse, Wachstum, regulatorische Hürden (CDSCO-Zulassung), Preissensitivität bewerten
• Wettbewerbsanalyse: Positionierung gegenüber lokalen Generika-Herstellern, Differenzierung durch Markenqualität
• Eintrittsmodus: Joint Venture mit lokalem Partner vs. Akquisition eines indischen OTC-Players prüfen',
   true),

  ('easy', 'growth',
   'Ein Abo-basierter Essenslieferdienst (Kochboxen) in Deutschland wächst nur noch einstellig. Strukturiere mögliche Wachstumshebel.',
   'Zielgruppe: urbane Doppelverdiener, Churn hoch, CAC gestiegen',
   'Growth Strategy Framework (Ansoff-Matrix)',
   '• Marktdurchdringung: Churn-Reduktion durch Personalisierung und Treueprogramme, Empfehlungsprogramm aktivieren
• Produktentwicklung: Neue Boxen (Diät, Familienbox, Snack-Abo), Erweiterung auf Frühstück und Mittagessen
• Marktentwicklung: Expansion in weitere DACH-Märkte (Österreich, Schweiz), B2B-Segment (Büro-Catering)',
   true),

  ('easy', 'ma',
   'Ein großer FMCG-Konzern erwägt die Übernahme einer aufstrebenden D2C-Naturkosmetikmarke. Bewerte die strategische Logik der Akquisition.',
   'Marke mit loyaler Community, starkem Social-Media-Wachstum und hohem Online-Anteil',
   'M&A Framework',
   '• Strategischer Fit: Zugang zu D2C-Expertise, jüngere Zielgruppe, Naturkosmetik-Trend als Wachstumssegment
• Bewertung: Multiples vergleichbarer D2C-Exits, Umsatz- und Synergiepotenziale quantifizieren
• Integrationsrisiken: Markenautonomie bewahren vs. Synergien heben, Gründer-Retention sicherstellen',
   true),

  ('easy', 'pricing',
   'Ein FinTech mit kostenlosem Girokonto möchte ein Premium-Modell mit Zusatzfunktionen einführen. Entwickle einen strukturierten Ansatz für die Preisfindung.',
   'Große Gratis-Nutzerbasis, geplante Features: Versicherungen, Cashback, Priority-Support',
   'Pricing Framework',
   '• Zahlungsbereitschaft: Conjoint-Analyse und Kundenbefragung zur Ermittlung der Preiselastizität und Feature-Präferenzen
• Wettbewerbsvergleich: Preis-Leistungs-Positionierung gegenüber N26, Vivid und traditionellen Banken
• Preismodell: Gestaffelte Tiers (Basic/Premium/Metal) mit klarer Feature-Differenzierung, Einführungspreis mit Lock-in',
   true),

  ('easy', 'operations',
   'Ein Luxusmöbelhersteller hat deutlich längere Lieferzeiten als der Branchendurchschnitt, und Kundenbeschwerden häufen sich. Strukturiere deine Analyse zur Verbesserung der operativen Effizienz.',
   'Handgefertigte Produktion, wenige Zulieferer für Edelholz, kein ERP-System',
   'Operations Framework',
   '• Prozessanalyse: Wertschöpfungskette von Auftragseingang bis Auslieferung kartieren, Engpässe identifizieren (Materialverfügbarkeit, Fertigungskapazität)
• Quick Wins: ERP-System einführen, Lagerbestand kritischer Materialien aufbauen, Standardisierung von Teilkomponenten
• Langfristig: Lieferantenbasis diversifizieren, modulares Produktionssystem entwickeln, Kapazitätsplanung optimieren',
   true);


-- MEDIUM (6): Require combining framework elements
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('medium', 'profitability',
   'Ein D2C-Matratzenhersteller wächst stark, schreibt aber trotz hoher Bruttomarge Verluste. Das Performance-Marketing-Budget wurde zuletzt deutlich erhöht, und die Unit Economics verschlechtern sich.',
   'EBITDA negativ, CAC stark gestiegen, LTV/CAC-Verhältnis unter 2, hohe Retourenquote',
   'Profitability Framework mit Unit Economics',
   '• Unit Economics: LTV/CAC-Verhältnis analysieren (aktuell 1,8x, fallend), CAC-Payback-Period berechnen, Retourenkosten in CLTV einpreisen
• Kostenstruktur: Marketing-Mix diversifizieren (Brandbuilding vs. Performance), Retouren-Ursachen analysieren und reduzieren
• Break-even-Szenario: Pfad zur Profitabilität modellieren mit verschiedenen Wachstums- und CAC-Szenarien',
   true),

  ('medium', 'market_entry',
   'Ein europäischer Online-Marktplatz für Handwerkerdienstleistungen plant die Expansion nach Japan. Entwickle eine differenzierte Markteintrittsstrategie.',
   'Etablierte EU-Plattform, japanischer Markt fragmentiert, sehr niedriger Digitalisierungsgrad, Vertrauen durch persönliche Beziehungen',
   'Market Entry Framework mit 3C-Analyse',
   '• Markt- und Kulturanalyse: Japanische Geschäftskultur (Vertrauen, Qualitätsstandards), lokale Regulierung, Zahlungsgewohnheiten verstehen
• Wettbewerbs- und Kundenanalyse: Lokale Incumbents, Customer Journey kartieren, Akzeptanz digitaler Plattformen nach Segmenten bewerten
• Go-to-Market: Lokalen Partner oder Akquisition bevorzugen, Pilotstart in einer Stadt (z.B. Tokyo), Qualitätszertifizierung als Differenzierung',
   true),

  ('medium', 'growth',
   'Ein B2B-SaaS-Unternehmen für Supply-Chain-Management stagniert beim Umsatz und hat eine Net Revenue Retention unter 100%. Entwickle eine Strategie zur Reaktivierung des Wachstums.',
   'Enterprise-Fokus im DACH-Raum, langer Sales Cycle, Feature-Requests unbearbeitet, Wettbewerber mit KI-Features',
   '3C Framework mit Growth Strategy',
   '• Customer: Churn-Ursachen analysieren (Feature-Gaps, Kundenzufriedenheit), Expansion Revenue durch Upselling und Cross-Selling steigern
• Competition: KI-Features auf Produkt-Roadmap priorisieren, Wettbewerbs-Benchmarking durchführen
• Company: Produktentwicklungskapazität erhöhen, Customer Success Team aufbauen, Land-and-Expand-Strategie in bestehenden Kunden implementieren',
   true),

  ('medium', 'ma',
   'Ein mittelständischer Versicherer prüft die Übernahme eines InsurTech mit Telematik-basierten Kfz-Versicherungen. Die Technologie ist vielversprechend, aber das Startup verbrennt stark Cash. Führe eine strukturierte Bewertung durch.',
   'Versicherer mit starkem Kfz-Anteil, InsurTech mit proprietärer Telematik-Plattform und negativem EBITDA',
   'M&A Framework mit Technology Assessment',
   '• Strategischer Mehrwert: Telematik-Kompetenz als Differenzierung im Kfz-Segment, Zugang zu digitalaffiner Zielgruppe, Daten-Assets bewerten
• Finanzielle Bewertung: DCF und Multiples, Cash-Burn-Rate und Runway analysieren, Synergiepotenziale quantifizieren (Vertrieb, Schadensprävention)
• Integrationsplan: Tech-Integration in Legacy-Systeme, Kulturelle Passung, Regulatorische Genehmigungen (BaFin), Earn-out-Struktur für Gründer',
   true),

  ('medium', 'pricing',
   'Ein Industrieunternehmen für Spezialchemikalien möchte von kostenbasierter auf wertbasierte Preisgestaltung umstellen. Die Kunden nutzen die Produkte in sehr unterschiedlichen Anwendungen mit stark variierendem Mehrwert. Entwickle eine Transformationsstrategie für das Pricing.',
   'Breites Produktportfolio, heterogene Kundenanwendungen, Vertrieb hat Angst vor Kundenverlusten, kein systematisches Pricing-Tool',
   'Value-Based Pricing Framework',
   '• Wertanalyse: Kundensegmentierung nach Anwendung und Zahlungsbereitschaft, Total Cost of Ownership für Kunden berechnen, Referenzwert vs. Differenzierungswert ermitteln
• Implementierung: Pilotprojekt mit 50 Kunden und 20 Produkten starten, Pricing-Tool und Dateninfrastruktur aufbauen
• Change Management: Vertriebstraining und neue Incentive-Strukturen, Kundenkommunikation vorbereiten, Eskalationsprozesse definieren',
   true),

  ('medium', 'operations',
   'Ein großes Krankenhaus-Netzwerk betreibt dezentrale Shared-Services (IT, Einkauf, HR) und hat dadurch hohe Redundanzen und inkonsistente Prozesse. Der Vorstand erwägt eine Zentralisierung.',
   'Mehrere Standorte mit je eigener IT-, Einkaufs- und HR-Abteilung, heterogene Software-Systeme',
   'Operations Framework mit Shared Services Analyse',
   '• Ist-Analyse: Prozesslandkarte erstellen, Redundanzen und Ineffizienzen quantifizieren, Best Practices einzelner Standorte identifizieren
• Zentralisierungsmodell: Shared Service Center für IT, Einkauf und HR designen, Standortwahl, Governance-Struktur definieren
• Umsetzungsplan: Phasenweise Migration (Quick Wins zuerst), Change Management für betroffene Mitarbeiter, KPIs für Servicequalität und Kosteneinsparung',
   true);


-- HARD (6): Ambiguous, multiple valid approaches
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('hard', 'profitability',
   'Ein europäischer Airline-Konzern betreibt neben dem Passagiergeschäft auch Cargo, MRO und ein Loyalty-Programm. Passagiergeschäft ist post-COVID zurück, aber Gesamtprofitabilität bleibt unter Vorkrisenniveau. Der Vorstand erwägt, das Loyalty-Programm an die Börse zu bringen.',
   'Konzernumsatz ~28 Mrd €. Passage und MRO margenschwach, Cargo und Loyalty deutlich profitabler. Hohe Nettoverschuldung.',
   'Profitability Framework mit Portfolio-Strategie und Sum-of-Parts-Bewertung',
   '• Portfolio-Analyse: Jedes Segment einzeln bewerten (ROIC, Wachstum, strategische Rolle), Cross-Subsidies identifizieren, Sum-of-Parts vs. Konglomeratsabschlag berechnen
• Passagiergeschäft: Yield Management optimieren, Flotteneffizienz steigern, Streckenportfolio bereinigen, Kostenprogramm für Rückkehr zur Vorkrisenmarge
• Loyalty-IPO: Standalone-Bewertung, Wechselwirkungen mit Passage-Geschäft modellieren, Kontrollverlust vs. Entschuldung abwägen',
   true),

  ('hard', 'market_entry',
   'Ein deutsches Vertical-SaaS-Unternehmen für die Bauindustrie möchte nach Nordamerika expandieren. Der US-Markt ist deutlich größer, die Regulierung unterscheidet sich fundamental, und ein US-Wettbewerber hat Interesse an einer strategischen Partnerschaft signalisiert.',
   'Produkt: Projektmanagement und BIM-Integration. US-Markt vielfach größer als DACH, Top-3-Wettbewerber konsolidiert. Potenzieller Partner mit komplementärem Produkt (Estimating) sucht europäische Expansion.',
   'Market Entry Framework mit Partnerschafts- und Build-vs-Buy-Analyse',
   '• Make-or-Ally: Eigenständiger Markteintritt vs. strategische Partnerschaft vs. Akquisition bewerten, Opportunity Cost jeder Option modellieren
• Partnerschaftsanalyse: Strategischen Fit mit US-Partner prüfen (Produktkomplementarität, Kundenbasis-Overlap, kulturelle Passung), Deal-Strukturen evaluieren (JV, Cross-Licensing, Merger)
• Lokalisierung: Regulatorische Anpassung (US Building Codes, Zertifizierungen), Go-to-Market in fragmentiertem US-Markt, Aufbau lokaler Organisation vs. Remote-Betreuung aus DACH',
   true),

  ('hard', 'growth',
   'Ein digitaler Versicherungsbroker ist Marktführer unter den unabhängigen Online-Brokern in Deutschland. Das Wachstum verlangsamt sich. Der Vorstand diskutiert drei strategische Optionen: (1) vertikale Integration durch eigene Versicherung, (2) horizontale Expansion in angrenzende Finanzprodukte, (3) internationale Expansion. Bewerte die Optionen und priorisiere.',
   'Etablierte Kundenbasis, stark gebremstes Wachstum, moderner Tech-Stack, solide Kapitalausstattung aus Series C',
   'Growth Strategy Framework mit Ansoff-Matrix und Strategiebewertung',
   '• Optionsbewertung: Jede Option nach Marktpotenzial, Umsetzungskomplexität, Kapitalbedarf und strategischem Fit bewerten, Risiko-Rendite-Matrix erstellen
• Vertikale Integration: Regulatorische Hürden (BaFin-Lizenz), Kapitalanforderungen, Interessenkonflikt mit bestehenden Versicherungspartnern abwägen
• Priorisierung: Cross-Selling als Quick Win (niedrige Komplexität, hoher Impact), internationale Expansion mittelfristig (Produkt-Lokalisierung), eigene Versicherung langfristig (höchstes Risiko und Ertragspotenzial)',
   true),

  ('hard', 'ma',
   'Ein Private-Equity-Fonds prüft die Übernahme einer notleidenden Automobilzuliefererkette mit Werken in Deutschland und Osteuropa. Starke Technologieposition in Leichtbau, aber erheblicher finanzieller Druck durch verlorene Aufträge und steigende Energiekosten. Bewerte Investmentthese und Turnaround-Plan.',
   'Umsatz rückläufig, EBITDA negativ, hohe Nettoverschuldung. Starke Kundenkonzentration auf wenige OEMs, Patentportfolio für Karbon-Leichtbau, Werke unterausgelastet.',
   'M&A Framework mit Distressed-Asset-Bewertung und Turnaround-Strategie',
   '• Investment Thesis: Technologie-Assets (Patente, Know-how) vs. operative Risiken bewerten, Downside-Szenario und Liquidationswert berechnen
• Turnaround-Plan: Restrukturierung der Schulden, Werkkonsolidierung (DE-Werke von 3 auf 2), Verlagerung von Produktion nach Osteuropa, Neuverhandlung der OEM-Verträge
• Wertschöpfung: Elektromobilitäts-Pivot der Leichtbautechnologie, neue Kundensegmente (Aerospace, Wind), Buy-and-Build-Strategie in fragmentiertem Zulieferermarkt',
   true),

  ('hard', 'pricing',
   'Eine große europäische Hotelkette mit 3 Marken (Budget, Business, Luxury) möchte ihr Pricing grundlegend transformieren. Aktuell halbjährliche Preise auf Basis historischer Daten; Dynamic Pricing mit externen Signalen (Events, Wetter, Flugauslastung) steht zur Debatte. Sorge: aggressive Preisgestaltung könnte die Marke im Luxussegment beschädigen.',
   'RevPAR unter Benchmark, Wettbewerber bereits mit AI-Pricing, Kundenbeschwerden über Preisintransparenz nehmen zu',
   'Dynamic Pricing Framework mit Marken- und Segmentierungsstrategie',
   '• Segmentierte Pricing-Strategie: Unterschiedliche Pricing-Logiken je Marke (Budget: aggressiv dynamisch, Business: nachfragebasiert, Luxury: zurückhaltend mit Fokus auf Wertwahrnehmung)
• Technologie und Daten: KI-Pricing-Engine aufbauen, externe Datenquellen integrieren (Events, Wetter, Flüge, Wettbewerberpreise), A/B-Testing-Infrastruktur implementieren
• Risikomanagement: Preiskorridore pro Marke definieren, Transparenzkommunikation für Kunden, Monitoring von Markenwahrnehmung und Kundenzufriedenheit',
   true),

  ('hard', 'operations',
   'Ein globaler Konsumgüterhersteller (Lebensmittel und Getränke) will seine Supply Chain klimaneutral gestalten und gleichzeitig die Kosten deutlich senken. Die aktuelle Supply Chain ist historisch gewachsen und redundant. Große Handelspartner fordern zunehmend Transparenz über den CO2-Fußabdruck jedes Produkts.',
   'Umsatz ~12 Mrd €. Supply-Chain-Kosten deutlich über Branchendurchschnitt, hoher Rohstoffanteil aus Schwellenländern, Top-Handelskunden fordern Product Carbon Footprint Daten.',
   'Operations Framework mit Supply-Chain-Transformation und Nachhaltigkeitsstrategie',
   '• Netzwerk-Optimierung: Supply-Chain-Footprint analysieren, Fabrik- und Lagerkonsolidierung modellieren, Nearshoring-Potenziale evaluieren, Zielkosten von 18% vom Umsatz anstreben
• Dekarbonisierung: Scope-1+2-Reduktionspfad definieren (Elektrifizierung, erneuerbare Energien), Scope-3-Hotspots identifizieren, CO2-Tracking-System implementieren
• Digitalisierung: Digital Twin der Supply Chain aufbauen, Demand Sensing und predictive Analytics einführen, Product Carbon Footprint Reporting für Handelspartner automatisieren',
   true);
