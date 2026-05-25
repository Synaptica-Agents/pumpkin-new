-- ============================================================
-- Add 30 more framework_cases (total → 60)
-- Distribution: ~5 per category, balanced across difficulties
-- All content in German, consulting-interview quality
-- ============================================================

-- EASY (8 new)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('easy', 'market_entry',
   'Ein deutsches Unternehmen für Tiernahrung möchte in den britischen Markt expandieren. Strukturiere deine Markteintrittsanalyse.',
   'Produktlinien für Hund und Katze, UK-Markt dominiert von wenigen großen Marken, wachsender Premium-Trend',
   'Market Entry Framework',
   '• Marktattraktivität: Marktgröße, Wachstum, Premium-Segment-Anteil, Regulierung (Post-Brexit Einfuhrregeln)
• Wettbewerb: Positionierung gegenüber Mars, Nestlé Purina, Aldi-Eigenmarken, Differenzierung durch Premium-Qualität
• Eintrittsmodus: Partnerschaft mit britischem Retailer vs. eigener Online-D2C-Kanal vs. Akquisition einer lokalen Marke',
   true),

  ('easy', 'ma',
   'Ein mittelständischer Softwareanbieter für Handwerksbetriebe erwägt die Übernahme eines kleineren Wettbewerbers mit komplementären Funktionen, aber veralteter Technologie. Bewerte die strategische Logik.',
   'Eigenes Produkt Cloud-basiert, Ziel On-Premise mit starkem CRM-Modul',
   'M&A Framework',
   '• Strategischer Fit: Komplementäre Features (CRM), Kundenüberlappung prüfen, Technologie-Migration bewerten
• Bewertung: Multiples (2,5x ARR), Synergiepotenziale quantifizieren (Cross-Sell, Churn-Reduktion)
• Risiken: Migrationskomplexität On-Premise zu Cloud, Kunden-Churn bei Umstellung, Integrationsaufwand',
   true),

  ('easy', 'pricing',
   'Eine Fitnesskette möchte eine neue Preisstruktur einführen. Aktuell gibt es nur eine Flatrate. Strukturiere die Analyse für ein differenziertes Preismodell.',
   'Studios in Großstädten, niedrigere Auslastung im Schnitt, starke Spitzenzeiten',
   'Pricing Framework',
   '• Segmentierung: Nutzergruppen identifizieren (Casual, Regular, Power-User), Zahlungsbereitschaft pro Segment ermitteln
• Preismodell: 2-3 Tiers (Basic/Flex/Premium) mit differenzierten Leistungen, Peak/Off-Peak Pricing erwägen
• Impact-Analyse: Umsatzeffekt modellieren, Churn-Risiko pro Segment abschätzen, Kommunikationsstrategie planen',
   true),

  ('easy', 'operations',
   'Ein E-Commerce-Unternehmen für Elektronik hat eine deutlich über dem Branchendurchschnitt liegende Retourenquote. Strukturiere deine Analyse zur Retourenreduktion.',
   'Hauptgründe laut Umfrage: unpassende Produktbeschreibungen, Qualitätsprobleme, späte Lieferung',
   'Operations Framework',
   '• Ursachenanalyse: Retourengründe nach Produktkategorie und Kundengruppe aufschlüsseln, Top-Retouren-Produkte identifizieren
• Quick Wins: Produktbeschreibungen und Bilder verbessern, Qualitätskontrolle verschärfen, Lieferzuverlässigkeit erhöhen
• Langfristig: Virtuelle Produktpräsentation (AR/3D), dynamische Empfehlungen, Retouren-Scoring zur Prävention',
   true),

  ('easy', 'growth',
   'Ein Online-Nachhilfeportal in Deutschland stagniert beim Wachstum. Der Gründer sucht Wachstumshebel. Strukturiere deine Analyse.',
   'Nur ein Teil der Registrierten aktiv, Fächer Mathe und Englisch, Zielgruppe Sekundarstufe',
   'Growth Strategy Framework (Ansoff-Matrix)',
   '• Marktdurchdringung: Conversion von registrierten zu aktiven Nutzern steigern, Empfehlungsprogramm einführen
• Produktentwicklung: Neue Fächer (Deutsch, Physik, Chemie), Prüfungsvorbereitung (Abi, MSA), Gruppenunterricht
• Marktentwicklung: Zielgruppe erweitern (Grundschule, Oberstufe, Erwachsene), B2B an Schulen und Nachhilfeinstitute',
   true),

  ('easy', 'profitability',
   'Eine Bäckereikette in Berlin hat sinkende Margen trotz konstanter Kundenzahlen. Strukturiere deine Profitabilitätsanalyse.',
   'Mehl- und Energiekosten stark gestiegen, Mindestlohn höher, einige Filialen in unrentablen Lagen',
   'Profitability Framework',
   '• Kostenanalyse: Wareneinsatz (Mehl, Energie), Personalkosten und Mieten pro Filiale aufschlüsseln
• Filial-Analyse: P&L je Standort erstellen, Bottom-3-Filialen identifizieren, Schließung oder Restrukturierung prüfen
• Gegenmaßnahmen: Preiserhöhung, Sortimentsoptimierung (margenstarke Produkte fördern), Einkaufsgemeinschaft für Rohstoffe',
   true),

  ('easy', 'market_entry',
   'Ein deutsches EdTech-Startup für Sprachlern-Apps plant den Markteintritt in Südkorea. Der koreanische Markt ist groß, aber stark umkämpft. Strukturiere die Analyse.',
   'App für Englisch/Spanisch/Französisch, hohe Bildungsausgaben in Korea, Mobile-First-Kultur',
   'Market Entry Framework',
   '• Marktattraktivität: Marktgröße (Sprachlernen in Korea ~5 Mrd $), Zahlungsbereitschaft, Mobile-First-Kultur
• Wettbewerb: Positionierung vs. lokale Anbieter und globale Player (Duolingo, YBM), Differenzierung identifizieren
• Go-to-Market: Lokalisierung (Koreanische UI, kulturelle Anpassung), Vertriebskanal (App Store, Partnerschaften mit Hagwons)',
   true),

  ('easy', 'ma',
   'Ein Lebensmittelkonzern prüft die Übernahme eines Bio-Snack-Startups. Das Startup hat eine starke Marke bei jungen Konsumenten und wächst dynamisch. Strukturiere deine Bewertung.',
   'Startup mit veganen Riegeln und Chips, vertriebsseitig primär im Einzelhandel',
   'M&A Framework',
   '• Strategischer Fit: Zugang zum Bio/Vegan-Trend, jüngere Zielgruppe, Regalplatz-Synergien im Handel
• Bewertung: 5x Umsatz-Multiple prüfen, Wachstumspotenzial und Skalierbarkeit der Produktion einschätzen
• Integration: Markenautonomie bewahren, Produktionsskalierung über Konzern-Infrastruktur, Gründer-Bindung durch Earn-out',
   true);


-- MEDIUM (12 new)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('medium', 'profitability',
   'Ein Carsharing-Anbieter in deutschen Großstädten ist weiterhin unprofitabel. Die Unit Economics variieren stark zwischen den Städten. Der Investor fordert einen klaren Weg zur Profitabilität.',
   'EBITDA negativ, Fahrzeugauslastung und Umsatz pro Fahrzeug städtespezifisch stark unterschiedlich, Wartungskosten über Plan',
   'Profitability Framework mit Unit Economics je Stadt',
   '• Stadt-Level-Analyse: P&L pro Stadt aufstellen, Auslastung und Umsatz/Fahrzeug als Haupttreiber identifizieren, Break-even-Auslastung berechnen
• Flottenoptimierung: Unprofitable Zonen eliminieren, dynamisches Pricing zu Spitzenzeiten, Flottenreduktion in schwachen Städten
• Kostensenkung: Wartungsverträge neu verhandeln, Elektrifizierung für geringere Betriebskosten, Versicherungsmodell optimieren',
   true),

  ('medium', 'profitability',
   'Ein Hersteller von Industrieverpackungen sieht seine Marge halbiert, obwohl der Umsatz deutlich gewachsen ist. Das Wachstum kam hauptsächlich durch einen neuen Großkunden. Analysiere die Profitabilitätsproblematik.',
   'Großkunde mit aggressiven Preisverhandlungen, Rohstoffkosten gestiegen, Neukunden-Marge deutlich unter Bestandskunden',
   'Profitability Framework mit Kundensegmentierung',
   '• Kundenprofitabilität: P&L pro Kundengruppe (Bestands- vs. Neukunden), Margenverfall durch Großkunden quantifizieren
• Preisanalyse: Nachkalkulation des Großkunden-Vertrags, versteckte Kosten (Sonderwünsche, Logistik, Zahlungsziele) aufdecken
• Handlungsoptionen: Neuverhandlung mit Großkunde, Bestandskunden-Preiserhöhung, Rohstoff-Hedging, Portfolio-Bereinigung',
   true),

  ('medium', 'market_entry',
   'Ein europäischer Hersteller von Premium-Kaffeemaschinen plant den Eintritt in den US-Markt. In den USA dominieren Kapselmaschinen und Filterkaffee, aber der Specialty-Coffee-Trend wächst. Entwickle eine Markteintrittsstrategie.',
   'Kleines Premium-Segment in den USA, starke Wettbewerber bereits vor Ort (Breville, Jura, DeLonghi), kein eigener US-Vertrieb',
   'Market Entry Framework mit Channel-Strategie',
   '• Marktsegmentierung: Specialty-Coffee-Enthusiasten als Zielgruppe, Marktgröße des Premium-Segments schätzen, Zahlungsbereitschaft validieren
• Channel-Strategie: D2C (eigener Online-Shop) vs. Retail (Williams-Sonoma, Sur La Table) vs. Amazon, Showroom-Konzept prüfen
• Lokalisierung: US-Serviceinfrastruktur aufbauen, Marketingansatz (Influencer, Coffee-Community), Stromspannung/Zertifizierungen (UL)',
   true),

  ('medium', 'growth',
   'Eine Plattform für IT-Freelancer-Vermittlung stagniert auf beiden Seiten des Marktplatzes. Analysiere die Wachstumshebel für eine zweiseitige Plattform.',
   'Freelancer-Retention schwach, Unternehmens-Retention solide, Zufriedenheit auf Freelancer-Seite niedriger',
   'Platform Growth Framework (Network Effects)',
   '• Supply-Seite (Freelancer): Retention verbessern (schnellere Vermittlung, bessere Konditionen), Spezialisierung auf gefragte Skills (Cloud, KI)
• Demand-Seite (Unternehmen): Account-Management stärken, Self-Service für kleinere Projekte, Managed-Service für Enterprise
• Netzwerkeffekte: Matching-Algorithmus verbessern, Qualitätssicherung durch Reviews und Zertifizierungen, Community aufbauen',
   true),

  ('medium', 'growth',
   'Ein Premium-Fitnessstudio-Betreiber möchte den Umsatz pro Mitglied steigern, ohne weitere Studios zu eröffnen. Entwickle eine Wachstumsstrategie auf bestehender Fläche.',
   'Zusatzumsatz marginal, Auslastung moderat, Personal-Trainer-Kapazität stark unterausgelastet, kein digitales Angebot',
   'Growth Strategy Framework (Revenue per Member)',
   '• Upselling: Personal Training Pakete, Ernährungsberatung, Premium-Mitgliedschaften mit Wellness/Sauna
• Cross-Selling: Supplements, Sportbekleidung, Partner-Angebote (Physiotherapie), Corporate-Wellness-Programme
• Digital: Hybrid-Modell mit Online-Kursen, App mit Trainingsplänen (Freemium), digitale Community und Challenges',
   true),

  ('medium', 'ma',
   'Ein Medienkonzern erwägt die Übernahme eines Podcast-Netzwerks mit breitem Show-Portfolio und hohen monatlichen Downloads. Das Netzwerk wächst stark, ist aber noch nicht profitabel. Bewerte die Akquisition.',
   'Starke Konzentration der Downloads auf wenige Top-Shows, EBITDA negativ, exklusive Verträge mit Mehrheit der Hosts',
   'M&A Framework mit Content-Asset-Bewertung',
   '• Content-Assets: Abhängigkeit von Top-5-Shows analysieren, Host-Verträge und Laufzeiten prüfen, IP-Rechte bewerten
• Synergien: Cross-Promotion mit bestehenden Medienmarken, Werbeverkauf über Konzern-Salesforce, Exklusiv-Content für Streaming-Plattform
• Risiken: Host-Abwanderung bei Übernahme, Podcast-Markt-Sättigung, Monetarisierung über Werbung vs. Abo-Modell',
   true),

  ('medium', 'ma',
   'Ein internationaler Logistikkonzern prüft die Übernahme einer Last-Mile-Delivery-Plattform in Südostasien. Die Plattform hat ein Gig-Worker-Modell und wächst stark, steht aber unter regulatorischem Druck. Bewerte den Deal.',
   'Konzern schwach in Asien, Plattform mit negativem EBITDA, Regulierer in mehreren Ländern fordern Festanstellung der Fahrer',
   'M&A Framework mit Regulatory Risk Assessment',
   '• Strategischer Wert: Zugang zu Last-Mile in Wachstumsregion, Netzwerk und Technologie-Plattform bewerten
• Regulatorisches Risiko: Gig-Worker-Gesetzgebung in jedem Land analysieren, Szenario-Modell (Status quo vs. Festanstellung vs. Hybrid)
• Integration: Standalone vs. Integration in Konzernlogistik, Technologie-Plattform als Basis für eigene Services nutzen',
   true),

  ('medium', 'pricing',
   'Ein Cloud-Infrastruktur-Anbieter verliert Kunden an AWS und Azure trotz besser bewerteten Supports. Die Analyse zeigt, dass das Preismodell zu komplex ist und Kunden Schwierigkeiten haben, Kosten vorherzusagen. Entwickle ein neues Preismodell.',
   'Dutzende Preiskomponenten, großer Anteil Support-Tickets zu Abrechnungsfragen, hoher Churn',
   'Pricing Framework mit Simplification Strategy',
   '• Preismodell-Analyse: Aktuelle 47 Komponenten clustern, Hauptkostentreiber identifizieren, Vergleich mit AWS/Azure-Modellen
• Vereinfachung: 3-5 Pakete (S/M/L/Enterprise) mit vorhersagbaren Kosten, Flatrate-Elemente einführen, Pay-as-you-grow
• Migration: Bestandskunden-Transition planen, Savings Guarantee für Wechsler, Transparenz-Dashboard für Kostenprognose',
   true),

  ('medium', 'pricing',
   'Ein Anbieter von Projektmanagement-Software erwägt den Wechsel von Per-User-Pricing zu nutzungsbasiertem Pricing. Analysiere die strategischen und finanziellen Implikationen.',
   'Viele User mit geringer Nutzungsintensität, Umsatzschwergewicht bei Enterprise-Kunden',
   'Pricing Transformation Framework',
   '• Impact-Modell: Umsatzeffekt bei Usage-Pricing simulieren (Gewinner/Verlierer unter Kunden), Risiko bei Enterprise-Kunden quantifizieren
• Hybrid-Modell: Basisgebühr + nutzungsbasierte Komponente, Mindestcommitment für Planungssicherheit, Fair-Use-Modell erwägen
• Transition: Grandfather-Klauseln für Bestandskunden, schrittweise Umstellung über 12 Monate, Metriken zur Messung des Erfolgs',
   true),

  ('medium', 'operations',
   'Ein Krankenversicherer hat eine Bearbeitungszeit für Erstattungsanträge weit über Branchendurchschnitt. Kundenbeschwerden nehmen massiv zu. Strukturiere die Prozessoptimierung.',
   'Überwiegend manuelle Prüfung, mehrere IT-Systeme, hohe Fehlerquote, viele Anträge brauchen Rückfragen',
   'Operations Framework mit Process Optimization',
   '• Prozessanalyse: End-to-End-Prozess kartieren, Engpässe identifizieren (manuelle Prüfung, Systembrüche, Rückfragen)
• Automatisierung: Straight-Through-Processing für Standardfälle, KI-gestützte Dokumentenprüfung, Self-Service-Portal für Kunden
• Quick Wins: Rückfragen reduzieren (bessere Formulare), Prioritäts-Routing (einfache Fälle zuerst), Sachbearbeiter-Schulung',
   true),

  ('medium', 'operations',
   'Ein Automobilhersteller hat im Motorenwerk eine OEE deutlich unter Benchmark. Der Werkleiter bittet um eine systematische Analyse.',
   'Ungeplante Stillstände hoch, Ausschussrate über Ziel, Umrüstzeiten deutlich über Zielwert',
   'Operations Framework (OEE-Analyse)',
   '• OEE-Zerlegung: Verfügbarkeit (ungeplante Stillstände), Leistung (Taktzeit-Verluste), Qualität (Ausschuss) einzeln analysieren
• Verfügbarkeit: Predictive Maintenance einführen, Ersatzteil-Bestandsmanagement optimieren, Stillstandsursachen nach Pareto priorisieren
• Leistung & Qualität: SMED für Umrüstzeiten, Qualitäts-Regelkreise an jeder Linie, Automatisierung kritischer Prüfschritte',
   true),

  ('medium', 'market_entry',
   'Ein deutscher Hersteller von intelligenten Heizsystemen plant den Markteintritt in Frankreich. Frankreich setzt überwiegend auf Elektroheizung und hat strenge Energieeffizienz-Regulierung (RE2020). Strukturiere die Analyse.',
   'Produkt: Smart-Thermostate und Wärmepumpen-Steuerung, hoher Anteil Elektroheizung in FR, Wettbewerber Netatmo (Legrand) und Somfy',
   'Market Entry Framework mit Regulierungsanalyse',
   '• Marktspezifika: Französisches Heizsystem verstehen, Produktanpassung für Elektroheizung, RE2020 als Treiber oder Hürde bewerten
• Wettbewerb: Positionierung vs. Netatmo und Somfy, Differenzierung durch Wärmepumpen-Expertise und Energieeinsparung
• Vertrieb: Partnerschaft mit französischen Installateuren, Baumärkte (Leroy Merlin, Castorama), Online-Kanal',
   true);


-- HARD (10 new)
INSERT INTO public.framework_cases (difficulty, category, prompt, context_info, recommended_framework, reference_solution, active)
VALUES
  ('hard', 'profitability',
   'Ein globaler Tier-1-Automobilzulieferer steht vor einem Dilemma: Das profitable ICE-Geschäft schrumpft, während das wachsende E-Mobility-Segment hohe Verluste produziert. Der Vorstand muss den Übergang steuern, ohne die kurzfristige Profitabilität zu zerstören.',
   'Konzernumsatz ~8 Mrd €. ICE-Geschäft profitabel, aber schrumpfend. E-Mobility stark negatives EBIT, hohe Wachstumsrate. Großteil der Mitarbeiter im ICE-Bereich.',
   'Profitability Framework mit Portfolio-Transformation und Szenarioanalyse',
   '• Dual-Transformation: ICE als Cash-Cow managen (Kosten optimieren, keine Neuinvestitionen), E-Mobility zur Break-even-Reife bringen, Übergangsszenarien modellieren
• ICE-Management: Erntestrategie definieren, Personalabbau sozialverträglich planen, Produktionskonsolidierung (Werke schließen)
• E-Mobility: Break-even-Pfad modellieren, Skaleneffekte quantifizieren, strategische Partnerschaften für Kostenreduktion, Kundenportfolio diversifizieren',
   true),

  ('hard', 'market_entry',
   'Ein europäischer Telekommunikationskonzern plant den Eintritt in den afrikanischen Mobilfunkmarkt durch Übernahme eines Betreibers in Nigeria oder Kenia. Beide Märkte bieten Wachstumspotenzial, aber unterschiedliche Risikoprofile. Gleichzeitig steht zur Debatte, Mobile Money als zweiten Geschäftszweig aufzubauen.',
   'Nigeria: großer Markt mit mehreren Wettbewerbern, politisch instabil. Kenia: dominiert von Safaricom, M-Pesa als Mobile-Money-Benchmark. Kein bisheriges Afrika-Exposure.',
   'Market Entry Framework mit Ländervergleich und Business-Model-Innovation',
   '• Ländervergleich: Nigeria vs. Kenia nach Marktgröße, Wettbewerb, Regulierung, politischem Risiko und Wachstumspotenzial bewerten
• Mobile Money: Zusätzliche Wertschöpfung durch Finanzdienstleistungen, M-Pesa als Benchmark, regulatorische Anforderungen (Banking-Lizenz)
• Risikomanagement: Währungsrisiko (Naira-Volatilität), politische Risiken, Infrastruktur-Investitionen, Exit-Optionen bei Misserfolg',
   true),

  ('hard', 'growth',
   'Ein etablierter Versand-Apothekenbetreiber steht vor einem Wachstumsproblem: Der OTC-Markt wächst kaum, Margen sinken durch Preiskampf. Das E-Rezept eröffnet einen vielfach größeren Rx-Markt, erfordert aber massive Investitionen in Logistik und Regulierung. Gleichzeitig drängen Amazon und neue Startups in den Markt. Entwickle eine priorisierte Wachstumsstrategie.',
   'Umsatz heute fast ausschließlich OTC, sinkende Bruttomarge. Rx erfordert Kühlkette und Same-Day-Delivery. Amazon Pharmacy bereits in US aktiv, VC-finanzierte Rx-Startups in DE.',
   'Growth Strategy mit Competitive Response und Capability Assessment',
   '• OTC-Verteidigung: Kundenbindung stärken (Abo-Modell, Loyalty), Margendruck durch Eigenmarken und Effizienz begegnen
• Rx-Expansion: Investitionsbedarf für Kühlkette und Same-Day-Delivery berechnen, regulatorische Hürden klären, Pilotregion starten
• Wettbewerbsreaktion: Differenzierung vs. Amazon (Beratung, Vertrauen, Schnelligkeit), First-Mover-Advantage im E-Rezept vs. Startups',
   true),

  ('hard', 'ma',
   'Ein mittelständischer Maschinenbauer mit Weltmarktführerschaft in Spezialpumpen wird von drei Käufern umworben: (1) strategischer Wettbewerber, (2) Private-Equity-Fonds, (3) chinesischer Industriekonzern. Der Eigentümer (Familienunternehmen in 3. Generation) muss die Optionen bewerten.',
   'Wettbewerber verspricht Synergien, PE lässt Management bleiben, China-Angebot mit höchstem Preis und Technologietransfer-Erwartung. Mitarbeiterrat besorgt um Standortgarantie.',
   'M&A Framework mit Seller-Perspektive und Stakeholder-Analyse',
   '• Optionsvergleich: Preis, Bedingungen, strategische Implikationen für jede Option, Risiko-Rendite-Matrix erstellen
• Stakeholder-Interessen: Familie (Vermögen + Vermächtnis), Mitarbeiter (Arbeitsplätze), Kunden (Lieferkontinuität), Region (Wirtschaftsfaktor)
• Due Diligence der Käufer: Strategischer Wettbewerber (Synergien vs. Kannibalisierung), PE (Value Creation Plan, Exit nach 5 Jahren), China (Technologietransfer-Risiko, geopolitische Sensitivität)',
   true),

  ('hard', 'pricing',
   'Ein globaler Hersteller von Industrierobotern verkauft aktuell Hardware mit einmaligem Kaufpreis und optionalem Wartungsvertrag. Der Vorstand will auf ein Robot-as-a-Service (RaaS) Modell umstellen, bei dem Kunden pro Einheit oder Betriebsstunde zahlen. Entwickle die Preisstrategie.',
   'Heutiger Umsatz überwiegend Hardware, mittlere Wartungsvertrags-Attach-Rate. Wettbewerber testen RaaS, Kunden wünschen OpEx statt CapEx, CFO besorgt über Revenue-Recognition-Effekte.',
   'Pricing Transformation Framework (CapEx to OpEx)',
   '• Finanzielles Modell: RaaS-Pricing berechnen (Leasing-Kalkulation, Zielrendite), Revenue-Recognition-Impact modellieren, Cash-Flow-Übergangsphase planen
• Kundenanalyse: Welche Segmente profitieren von RaaS (KMU, projektbasierte Fertigung), welche bevorzugen Kauf (Großserie), Hybrid-Modell anbieten
• Risikomanagement: Auslastungsrisiko (Kunde zahlt weniger bei Unterauslastung), Asset-Management (Rücknahme, Zweitmarkt), Vertragsgestaltung (Mindestlaufzeit, Mindestabnahme)',
   true),

  ('hard', 'pricing',
   'Eine europäische Billigfluggesellschaft erwägt ein Abo-Modell: monatliche Pauschale, unbegrenzt fliegen. Analysiere die strategischen und finanziellen Implikationen dieses radikalen Preismodells.',
   'Heute sehr hoher Load Factor. Wettbewerber Ryanair und easyJet. Separate Abo-Tarife für Inland und EU-weit geplant, Test in zwei Märkten.',
   'Pricing Innovation Framework mit Demand Modeling',
   '• Nachfragemodell: Kannibalisierung bestehender Buchungen quantifizieren, inkrementelle Nachfrage schätzen, Kapazitätsimpact bei 93% Load Factor
• Unit Economics: Break-even-Frequenz pro Abo-Kunde berechnen, Segmentierung (Geschäftsreisende vs. Leisure), Ancillary Revenue bei Abo-Kunden
• Risiken: Adverse Selection (Vielflieger abonnieren, Wenigflieger nicht), Kapazitätsengpässe auf beliebten Routen, Marken-Repositionierung, regulatorische Fragen',
   true),

  ('hard', 'operations',
   'Ein globaler Halbleiterhersteller muss entscheiden, ob eine neue Chip-Fabrik in Europa (EU-Förderung) oder in Südostasien (niedrigere Kosten) gebaut wird. Die Investition ist die größte Einzelentscheidung der Firmengeschichte. Strukturiere die Entscheidungsanalyse.',
   'Bestehende Fabs in Taiwan, Singapur und USA. Europa deutlich höhere Energiekosten und längere Bauzeit, dafür EU Chips Act Förderung. Geopolitisches Risiko Taiwan steigt.',
   'Operations Framework mit Standortentscheidung und Szenarioanalyse',
   '• Total Cost of Ownership: Investitionskosten (mit/ohne Förderung), Betriebskosten (Energie, Personal, Logistik), 20-Jahres-NPV für beide Optionen
• Strategische Faktoren: Kundennähe, geopolitische Diversifizierung (Abhängigkeit von Asien reduzieren), EU-Regulierung (Versorgungssicherheit), Fachkräfteverfügbarkeit
• Risikobewertung: Förder-Clawback-Klauseln, Technologiegeneration (welcher Chip-Node in welchem Markt), Szenario bei Eskalation Taiwan-Konflikt',
   true),

  ('hard', 'operations',
   'Ein Lebensmittelkonzern betreibt eine komplexe Kühlkette von mehreren Produktionsstandorten zu vielen Verkaufspunkten. Logistikkosten liegen deutlich über Benchmark, Ware wird wegen Kühlkettenunterbrechungen entsorgt. Der Vorstand will Logistikkosten auf Benchmark senken und Schwund halbieren.',
   'Gemischte Flotte aus eigenen LKW und Subunternehmern, IoT-Sensorik nur in kleinem Teil der Flotte, keine zentrale Transportplanung',
   'Operations Framework mit Supply-Chain-Transformation',
   '• Netzwerkoptimierung: Verteilzentren konsolidieren, Transportrouten optimieren (Hub-and-Spoke vs. Direktbelieferung), Auslastung der LKW-Flotte steigern
• Schwundreduktion: IoT-Sensorik auf 100% ausweiten, Echtzeitüberwachung der Kühlkette, Qualitätsmanagement an Übergabepunkten
• Digitalisierung: Zentrale Transportplanungssoftware einführen, Predictive Analytics für Nachfrage und Routing, Kosten-Dashboard pro Route und Verkaufspunkt',
   true),

  ('hard', 'growth',
   'Ein europäisches FinTech für KMU-Kreditvergabe (Revenue-Based Financing) hat Product-Market-Fit in Deutschland bewiesen, steht aber vor einem Trilemma: (1) geografische Expansion in weitere EU-Länder, (2) Produkt-Expansion in neue Finanzprodukte (Factoring, Versicherung), (3) Upstream-Integration durch eigene Banking-Plattform. Das Kapital reicht nur für eine Richtung. Priorisiere und begründe.',
   'BaFin-Lizenz für DE vorhanden, jedes EU-Land braucht eigene Lizenzierung, Banking-Plattform würde BaFin-Volllizenz erfordern. Runway überschaubar.',
   'Growth Strategy mit Optionsbewertung und Resource Allocation',
   '• Optionsbewertung: Jede Richtung nach Marktpotenzial, Regulierungskomplexität, Kapitalbedarf und Time-to-Revenue bewerten
• Geo-Expansion: EU-Passporting-Möglichkeiten, Kreditrisiko-Modelle pro Land anpassen, Pilotland auswählen (NL oder AT als Low-Risk)
• Empfehlung: Sequenzieller Ansatz priorisieren — erst Produkt-Expansion (Factoring, niedrige regulatorische Hürde, Up-Sell an Bestandskunden), dann Geo-Expansion, Banking-Plattform langfristig',
   true),

  ('hard', 'profitability',
   'Ein diversifizierter Medienkonzern besitzt TV-Sender, Zeitungen, eine Streaming-Plattform und ein Eventgeschäft. Die Gesamtprofitabilität sinkt, die Segmente entwickeln sich sehr unterschiedlich: Print schrumpft, TV stagniert, Streaming wächst mit Verlusten, Events boomen. Der Vorstand diskutiert einen radikalen Portfolioumbau.',
   'Konzernumsatz ~3,5 Mrd €. Print und Streaming mit negativem EBIT, TV stabil profitabel, Events deutlich profitabel und wachsend. Großer Mitarbeiteranteil im Print-Segment.',
   'Profitability Framework mit Portfolio-Strategie (BCG Matrix)',
   '• Portfolio-Analyse: Jedes Segment als Star/Cash Cow/Question Mark/Dog klassifizieren, Sum-of-Parts-Bewertung erstellen, Konzernabschlag quantifizieren
• Strategische Optionen: Print-Verkauf oder kontrolliertes Schrumpfen (Harvest), TV als Cash Cow für Streaming-Investitionen nutzen, Events als Wachstumssäule ausbauen
• Streaming-Turnaround: Break-even-Pfad modellieren, Content-Synergien mit TV, Abo vs. Werbefinanzierung, Partnerschaften oder Konsolidierung prüfen',
   true);
