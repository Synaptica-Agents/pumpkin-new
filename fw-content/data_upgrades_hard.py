# -*- coding: utf-8 -*-
# Casebook-Upgrade der 22 aktiven hard-Alt-Cases.

UPGRADES_HARD = {

"5c317ca6": {  # growth: Digitaler Versicherungsbroker, 3 Optionen
 "qa": [
  ("Was ist das übergeordnete Ziel?", "Zurück auf einen klaren Wachstumspfad für eine spätere Series D oder einen Exit — der Vorstand will EINE priorisierte Richtung."),
  ("Wie viel Kapital steht bereit?", "Die Series C erlaubt eine große Wette oder zwei kleine — nicht alle drei Optionen parallel."),
  ("Was spricht für die eigene Versicherung?", "Volle Wertschöpfung und Produktkontrolle; dagegen sprechen BaFin-Lizenz, Kapitalanforderungen und Konflikt mit den heutigen Versicherungspartnern."),
  ("Welche angrenzenden Finanzprodukte wären denkbar?", "Baufinanzierung, Konsumkredite und Geldanlage — die Kundenbasis fragt das teilweise aktiv nach."),
  ("Wie realistisch ist internationale Expansion?", "Der Broker-Markt ist national reguliert und fragmentiert; jedes Land bedeutet fast einen Neustart."),
 ],
 "tree": [
  {"t": "Bewertungsrahmen", "star": True, "b": ["Kriterien: Marktpotenzial, Komplexität, Kapital, Fit", "Synergien mit Kundenbasis & Tech-Stack"], "c": [{"t": "Risiko-Rendite-Matrix über die 3 Optionen", "b": []}]},
  {"t": "Option 1: Vertikal (eigene Versicherung)", "b": ["BaFin-Lizenz & Kapitalbindung", "Kanalkonflikt mit Versicherungspartnern"]},
  {"t": "Option 2: Horizontal (Finanzprodukte)", "b": ["Cross-Selling in Bestandskunden = Quick Win", "Regulatorisch leichter (Vermittlermodell)"]},
  {"t": "Option 3: International", "b": ["Länderregulierung = hoher Aufwand je Markt", "Erst nach gewonnener Heimatbasis sinnvoll"]},
  {"t": "Empfehlung & Sequenz", "b": ["Priorisierung mit Begründung", "Meilensteine & Abbruchkriterien"]},
 ],
 "notes": "Optionsbewertungs-Case: Erwartet wird ein expliziter Bewertungsrahmen plus begründete Priorisierung (typisch: horizontal zuerst als Quick Win, vertikal/international später). Wer nur eine Option vertieft, verfehlt das Format.",
},

"bb5ca514": {  # growth: Versandapotheke, E-Rezept
 "qa": [
  ("Wie ist die Ausgangslage im OTC-Geschäft?", "Fast der gesamte Umsatz ist OTC; der Markt wächst kaum und der Preiskampf drückt die Bruttomarge Jahr für Jahr."),
  ("Wie groß ist die Rx-Chance?", "Der Rx-Markt ist um ein Vielfaches größer als OTC; mit dem E-Rezept wird er erstmals digital adressierbar."),
  ("Was fehlt für Rx operativ?", "Kühlkette, Same-Day-Fähigkeit in Ballungsräumen und pharmazeutische Beratungskapazität — alles investitionsintensiv."),
  ("Wie akut ist die Amazon-Gefahr?", "Amazon Pharmacy ist in den USA aktiv; ein EU-Start gilt intern als Frage der Zeit, nicht des Ob."),
  ("Welche finanzielle Leitplanke gilt?", "Die Rx-Investitionen müssen aus dem laufenden OTC-Cashflow finanzierbar sein — keine externe Kapitalerhöhung."),
 ],
 "tree": [
  {"t": "OTC-Basis verteidigen", "b": ["Kundenbindung: Abo & Loyalty", "Marge: Eigenmarken, Einkaufs- und Prozesseffizienz"]},
  {"t": "Rx-Expansion", "star": True, "b": ["Investitionsplan Kühlkette & Logistik", "Regulatorik & Beratungspflichten klären"], "c": [{"t": "Pilotregion mit Same-Day als Testfeld", "b": []}]},
  {"t": "Wettbewerbsstrategie", "b": ["Differenzierung vs. Amazon: Beratung, Vertrauen", "First-Mover-Tempo vs. VC-Startups"]},
  {"t": "Finanzierung & Sequenz", "b": ["Rx-Invest aus OTC-Cashflow staffeln", "Meilensteine & Stop-Kriterien"]},
 ],
 "notes": "Zwei-Fronten-Case: OTC-Cash-Basis sichern UND Rx-Fenster nutzen, unter Finanzierungsrestriktion. Starke Antworten sequenzieren (Pilot → Skalierung) und behandeln Amazon/Startups als getrennte Bedrohungen.",
},

"4a60a56f": {  # growth: FinTech RBF Trilemma
 "qa": [
  ("Wie lange reicht die Runway?", "Rund 20 Monate bei aktuellem Burn — die gewählte Richtung muss davor sichtbare Traktion zeigen."),
  ("Wie gut läuft das Kerngeschäft?", "Product-Market-Fit in Deutschland ist belegt: gute Rückzahlungsquoten, wachsende Nachfrage, enge Bank-Partnerschaften."),
  ("Was würde die Geo-Expansion kosten?", "Jedes EU-Land braucht eigene Lizenzierung und lokale Kreditrisikomodelle — pro Land ein mittlerer siebenstelliger Betrag bis zur Traktion."),
  ("Wie groß ist das Cross-Sell-Potenzial?", "Bestandskunden fragen aktiv nach Factoring; die Vertriebsbeziehung existiert bereits."),
  ("Was spräche für die Banking-Plattform?", "Langfristig höhere Margen und Unabhängigkeit — aber BaFin-Volllizenz, lange Vorlaufzeit und das höchste Kapitalrisiko."),
 ],
 "tree": [
  {"t": "Bewertungsrahmen", "star": True, "b": ["Kriterien: Time-to-Revenue, Kapitalbedarf, Regulatorik, Fit", "Runway 20 Monate als harte Nebenbedingung"], "c": [{"t": "Szenario je Option: Was ist in 12 Monaten beweisbar?", "b": []}]},
  {"t": "Produkt-Expansion (Factoring & Co.)", "b": ["Cross-Sell an Bestandskunden: schnellste Traktion", "Geringste regulatorische Hürde"]},
  {"t": "Geo-Expansion", "b": ["Lizenz & Risikomodell je Land", "Pilotland-Logik (AT/NL) — aber teuer & langsam"]},
  {"t": "Banking-Plattform", "b": ["Volllizenz: Dauer & Kapital sprengen die Runway", "Später als Option offenhalten"]},
  {"t": "Empfehlung", "b": ["Sequenz: Produkt zuerst, Geo nach Nachweis", "Meilensteine für Investoren"]},
 ],
 "notes": "Trilemma unter Kapitalknappheit: Die Runway ist das entscheidende Bewertungskriterium. Erwartet wird eine klare, begründete Sequenz-Empfehlung (typisch: Produkt-Expansion zuerst) — nicht drei parallele Analysen.",
},

"6cd182f6": {  # ma: Versicherungsgruppe übernimmt KI-InsurTech
 "qa": [
  ("Was ist das strategische Motiv?", "Die Schadensregulierung ist der größte Kostenblock des Konzerns; die KI-Lösung verspricht schnellere und günstigere Bearbeitung."),
  ("Wie belastbar ist der Algorithmus?", "Bei B2B-Kunden nachweislich gute Ergebnisse — aber trainiert auf fremden Datenbeständen; die Übertragbarkeit auf das eigene Portfolio ist offen."),
  ("Wie hängt das Startup von Schlüsselpersonen ab?", "Stark: Ein kleines ML-Team um die beiden Gründer trägt die gesamte Weiterentwicklung."),
  ("Kauft man nicht Konkurrenz zum eigenen Bestand?", "Das InsurTech bedient heute auch zwei Wettbewerber des Konzerns — diese Verträge würden bei Übernahme wackeln."),
  ("Was wäre die Alternative zum Kauf?", "Eine mehrjährige Exklusiv-Lizenz oder ein gemeinsames Pilotprojekt mit Kaufoption."),
 ],
 "tree": [
  {"t": "Strategischer Fit & Nutzen", "star": True, "b": ["Einsparpotenzial in eigener Schadenregulierung quantifizieren", "Pilot auf eigenem Portfolio vor Signing"], "c": [{"t": "Make/Buy/Partner-Vergleich", "b": []}]},
  {"t": "Tech- & Team-Due-Diligence", "b": ["Algorithmus-Qualität & Datenübertragbarkeit", "Retention des ML-Teams (Earn-out, Anreize)"]},
  {"t": "Kommerzielle Effekte", "b": ["B2B-Kundenverlust (Wettbewerber) einpreisen", "Integrationsfähigkeit in konservative IT"]},
  {"t": "Deal & Risiken", "b": ["Bewertung: Kostenersparnis-Case statt Umsatz-Multiple", "Kultur- und Integrationsrisiko Konzern vs. Startup"]},
 ],
 "notes": "Capability-M&A mit Besonderheit: Der Business Case ist Kostenersparnis im eigenen Haus, nicht das Umsatzwachstum des Targets. Pilot-vor-Kauf und Team-Retention sind die Schlüsselpunkte.",
},

"f030619d": {  # ma: PE, notleidender Automobilzulieferer
 "qa": [
  ("Warum überhaupt dieses Target?", "Der Fonds sucht Distressed-Gelegenheiten mit Technologie-Substanz — das Karbon-Leichtbau-Portfolio gilt als unterbewertet."),
  ("Wie akut ist die Finanzlage?", "EBITDA negativ, Covenants gerissen; ohne frisches Geld droht in etwa einem Jahr die Zahlungsunfähigkeit."),
  ("Wie werthaltig sind die Patente?", "Das Leichtbau-Know-how ist auch für E-Mobilität und Luftfahrt relevant — die heutigen Kunden nutzen es kaum."),
  ("Wie flexibel sind die Werke?", "Deutsche Werke sind unterausgelastet mit hohen Fixkosten; Osteuropa ist kostengünstig und ausbaufähig."),
  ("Was erwartet der Fonds als Rendite?", "Distressed-typisch: mindestens 2,5-3x über fünf Jahre, mit klarem Downside-Schutz über den Liquidationswert."),
 ],
 "tree": [
  {"t": "Investment-These", "star": True, "b": ["Tech-Assets vs. operative Risiken bewerten", "Downside: Liquidationswert als Boden"], "c": [{"t": "Einstieg über Debt oder Equity strukturieren", "b": []}]},
  {"t": "Turnaround-Plan", "b": ["Bilanz: Schulden restrukturieren", "Operativ: Werkkonsolidierung, Verlagerung nach Osteuropa"]},
  {"t": "Wertschöpfung", "b": ["Leichtbau-Pivot zu E-Mobility/Aerospace", "Kundenbasis diversifizieren (weg von wenigen OEMs)"]},
  {"t": "Risiken & Exit", "b": ["OEM-Verträge & Kundenkonzentration", "Exit-Kanäle: Strategen vs. Secondary"]},
 ],
 "notes": "Distressed-PE: These = billiger Einstieg + Tech-Substanz + hartes Turnaround-Programm. Downside-Schutz (Liquidationswert) und Restrukturierung der Passivseite gehören zwingend in die Struktur.",
},

"dc6bd971": {  # ma: Familienunternehmen, 3 Käufer
 "qa": [
  ("Was ist der Familie am wichtigsten?", "Neben dem Preis: Fortbestand des Unternehmens, Standort- und Arbeitsplatzsicherheit sowie der Name — die Gewichtung ist aber offen."),
  ("Wie unterscheiden sich die Angebote preislich?", "Der chinesische Konzern bietet spürbar mehr; PE und Stratege liegen nah beieinander darunter."),
  ("Was würde der Wettbewerber mit der Firma machen?", "Synergien heben — mittelfristig drohen Standortkonsolidierung und Markenverschmelzung."),
  ("Welche Auflagen drohen beim China-Deal?", "Eine Investitionsprüfung nach AWV ist wahrscheinlich; der Technologietransfer wäre politisch sensibel."),
  ("Was plant der PE-Fonds?", "Buy-and-Build mit dem Management, Exit nach fünf bis sieben Jahren — Standortgarantien nur befristet."),
 ],
 "tree": [
  {"t": "Entscheidungskriterien der Familie", "star": True, "b": ["Preis vs. Vermächtnis vs. Arbeitsplätze gewichten", "Kriterien-Scorecard über die 3 Optionen"], "c": [{"t": "Zielbild: Was heißt 'Erfolg' in 10 Jahren?", "b": []}]},
  {"t": "Käufer-Analyse", "b": ["Stratege: Synergien vs. Standortrisiko", "PE: Weiterführung, aber Exit-Logik", "China: Preis + Technologietransfer + AWV-Risiko"]},
  {"t": "Deal-Gestaltung", "b": ["Garantien: Standort, Beschäftigung, Marke", "Rückbeteiligung/Earn-out als Brücke"]},
  {"t": "Prozess & Stakeholder", "b": ["Mitarbeiter & Betriebsrat einbinden", "Regulatorische Zeitachsen (AWV) einplanen"]},
 ],
 "notes": "Kein reiner Bewertungs-Case: Zuerst die Zieldimensionen der Familie strukturieren, dann Optionen dagegen scoren. Vertragsgestaltung (Garantien, Rückbeteiligung) als eigenes Lösungsfeld zeigt Seniorität.",
},

"e8acf5a2": {  # ma: Konzern-Portfolioumbau (Divestiture + Akquisition)
 "qa": [
  ("Was fordern die Aktionäre konkret?", "Fokussierung auf die profitablen Kernbereiche; ein aktivistischer Investor droht mit öffentlichen Forderungen."),
  ("Wie sieht das Verlustsegment aus?", "Stabiler Umsatz, aber strukturell fallendes EBIT — im Konzern fehlt die Investitionsbereitschaft, es weiterzuentwickeln."),
  ("Gibt es Käuferinteresse?", "Erste Sondierungen zeigen Interesse von PE-Fonds und einem ausländischen Strategen."),
  ("Wie teuer wäre das Akquisitionsziel?", "Marktüblich wären zweistellige EBIT-Multiples — finanzierbar nur mit dem Verkaufserlös des Verlustsegments."),
  ("Gibt es Wechselwirkungen zwischen beiden Deals?", "Ja: Timing und Erlös des Verkaufs bestimmen die Finanzierungskraft für den Zukauf; parallel laufende Prozesse überfordern die Organisation womöglich."),
 ],
 "tree": [
  {"t": "Divestiture-Logik", "b": ["Strategischer Fit & Turnaround-Alternativen", "Erlösspanne, Steuern, Kennzahleneffekt"]},
  {"t": "Akquisitions-Logik", "b": ["Fit des Nischenführers: Technologie, Kunden", "Bewertung vs. Synergien quantifizieren"]},
  {"t": "Kapital & Sequenz", "star": True, "b": ["Verkaufserlös finanziert Zukauf: Reihenfolge klären", "Bilanz-/Rating-Wirkung beider Deals"], "c": [{"t": "Parallel vs. sequenziell: Organisationskapazität", "b": []}]},
  {"t": "Stakeholder & Umsetzung", "b": ["Aktionärs-Story: Fokus-Narrativ", "Mitarbeiter/Betriebsrat im Verkaufssegment"]},
 ],
 "notes": "Doppel-Deal mit Abhängigkeit: Die Verzahnung (Erlös finanziert Zukauf, Sequenzfrage) ist der Kern — wer beide Transaktionen isoliert prüft, übersieht das Wesentliche.",
},

"76f4daa1": {  # market_entry: Luxusmode nach China D2C
 "qa": [
  ("Warum D2C statt Handelspartner?", "Volle Marken- und Preiskontrolle sowie Kundendaten; der Vorstand fürchtet Verwässerung über Dritte."),
  ("Wie bekannt ist die Marke in China?", "In Europa stark, in China nur einer kleinen Kennerschicht vertraut — es braucht Markenaufbau von nahezu null."),
  ("Welche Kanäle dominieren im chinesischen Luxusmarkt?", "Tmall Luxury Pavilion und WeChat-Ökosystem sind quasi Pflicht; eigene Flagship-Stores in Tier-1-Städten schaffen Glaubwürdigkeit."),
  ("Was ist mit Daigou und Grauimporten?", "Ein relevanter Teil des China-Umsatzes läuft heute über Grauimporte aus Europa — Preisharmonisierung wäre nötig."),
  ("Welches Budget steht bereit?", "Definiert, aber begrenzt: ein Flagship, digitale Kanäle und drei Jahre Markenaufbau sind gedeckt — kein flächiges Store-Netz."),
 ],
 "tree": [
  {"t": "Markt & Konsument", "b": ["Luxus-Konsumentensegmente & Kaufverhalten", "Wettbewerbsbenchmark internationaler Marken"]},
  {"t": "Kanal-Ökosystem", "star": True, "b": ["Digital: Tmall Luxury, WeChat, Mini-Programs", "Physisch: 1 Flagship Tier-1 als Anker"], "c": [{"t": "KOL-/Social-Strategie für Markenaufbau", "b": []}]},
  {"t": "Marke & Pricing", "b": ["Lokalisierte Markenerzählung ohne Identitätsverlust", "Preisharmonisierung vs. Daigou"]},
  {"t": "Setup & Risiken", "b": ["Eigene Einheit vs. TP-Partner (operative Ausführung)", "Regulatorik, Datenlokalisierung, Geopolitik"]},
 ],
 "notes": "China-Luxus hat eigene Spielregeln: Ohne Tmall/WeChat-Ökosystem und KOL-Aufbau funktioniert D2C nicht. Daigou/Preisharmonisierung zu erkennen unterscheidet starke Antworten.",
},

"53738cb4": {  # market_entry: Vertical-SaaS Bau, USA, Partnerschaft
 "qa": [
  ("Was bietet der US-Partner konkret an?", "Gespräche liefen über eine Vertriebspartnerschaft mit Produktintegration; auch ein Joint Venture wurde erwähnt."),
  ("Wie komplementär sind die Produkte?", "Stark: Der Partner ist bei Kalkulation (Estimating) führend, das eigene Produkt bei Projektmanagement/BIM — Kundenüberlappung gering."),
  ("Wie unterscheidet sich der US-Markt?", "Andere Baunormen und Vertragsmodelle, größere Projektvolumina, konsolidierte Top-Wettbewerber mit hohen Marketingbudgets."),
  ("Was würde ein eigener Markteintritt kosten?", "Aufbau von Vertrieb, Support und Lokalisierung würde Jahre dauern und einen hohen zweistelligen Millionenbetrag binden."),
  ("Was ist das Risiko der Partnerschaft?", "Abhängigkeit: Der Partner könnte nach ein paar Jahren selbst bauen oder von einem Wettbewerber gekauft werden."),
 ],
 "tree": [
  {"t": "Make-or-Ally-Entscheidung", "star": True, "b": ["Eigenaufbau vs. Partnerschaft vs. Akquisition", "Time-to-Market & Kapitalbindung je Option"], "c": [{"t": "Opportunitätskosten: DACH-Kerngeschäft nicht vernachlässigen", "b": []}]},
  {"t": "Partnerschafts-Analyse", "b": ["Produkt-Komplementarität & Kundenzugang", "Deal-Struktur: Reseller, JV, Cross-Licensing, Anteil"]},
  {"t": "Lokalisierung & Produkt", "b": ["US-Baunormen & Workflows abbilden", "Support/Implementierung vor Ort"]},
  {"t": "Risiken & Schutz", "b": ["Abhängigkeit vom Partner (Exklusivität, Laufzeit, IP)", "Exit-/Übernahmeklauseln vordenken"]},
 ],
 "notes": "Make-or-Ally unter Zeit- und Kapitaldruck: Die Partnerschaft ist attraktiv, braucht aber Vertragsschutz gegen Abhängigkeit. Starke Antworten strukturieren die Deal-Optionen explizit.",
},

"77730723": {  # market_entry: Telko nach Afrika, Nigeria vs. Kenia
 "qa": [
  ("Was ist das strategische Motiv?", "Die europäischen Kernmärkte sind gesättigt; Afrika bietet Nutzer- und Umsatzwachstum, das zu Hause fehlt."),
  ("Welche Übernahmeziele stehen konkret an?", "In beiden Ländern je ein mittelgroßer Betreiber mit landesweitem Netz, aber Investitionsstau."),
  ("Wie unterscheiden sich die Risiken?", "Nigeria: Währungsvolatilität und politische Unsicherheit bei großem Markt. Kenia: stabiler, aber Safaricom dominiert mit hohem Marktanteil."),
  ("Wie wichtig ist Mobile Money?", "Zentral — in beiden Märkten läuft ein Großteil des Zahlungsverkehrs mobil; M-Pesa zeigt das Ertragspotenzial."),
  ("Welche Fähigkeiten fehlen dem Konzern?", "Keinerlei Afrika-Erfahrung und kein Mobile-Money-Betrieb — beides müsste mit dem Target einkauft oder aufgebaut werden."),
 ],
 "tree": [
  {"t": "Ländervergleich", "star": True, "b": ["Marktgröße & Wachstum vs. Wettbewerbsposition", "Risikoprofil: Währung, Politik, Regulierung"], "c": [{"t": "Szenario-Bewertung beider Targets (NPV + Risiko)", "b": []}]},
  {"t": "Mobile Money als 2. Standbein", "b": ["Ertragsmodell & Banking-Regulatorik", "Fähigkeitsaufbau: Team aus dem Target halten"]},
  {"t": "Eintritts- & Betriebsmodell", "b": ["Mehrheitsübernahme vs. Beteiligung mit lokalem Partner", "Investitionsplan Netz (Capex-Staffelung)"]},
  {"t": "Risikomanagement", "b": ["Währungs-Hedging & Gewinnrepatriierung", "Exit-Optionen bei Eskalation"]},
 ],
 "notes": "Länder-Vergleichslogik mit expliziten Kriterien ist Pflicht; Mobile Money gehört als eigenes Wertfeld hinein. Wer Nigeria/Kenia nur beschreibt statt zu scoren, bleibt unter dem Anspruch.",
},

"1d85c998": {  # market_entry: Compliance-SaaS USA Build vs. Buy
 "qa": [
  ("Welches Segment ist realistisch?", "Der Enterprise-Markt ist von drei Platzhirschen besetzt — realistisch ist der fragmentierte Mid-Market."),
  ("Wie gut passt das Produkt zum US-Markt?", "Kernfunktionen ja, aber US-spezifische Regulatorik (SEC, HIPAA) ist nur teilweise abgedeckt — Lokalisierungsaufwand ist real."),
  ("Was genau bietet das Akquisitionsziel?", "Rund 20 Mio USD ARR im Mid-Market, profitabel, loyaler Kundenstamm — aber technologisch veraltet und mit begrenztem Produkt-Fit."),
  ("Was würde der Eigenaufbau dauern?", "Intern geschätzt drei bis vier Jahre bis zu relevantem ARR — mit hohem Risiko, ohne lokale Marke nicht durchzudringen."),
  ("Wie ist die Preisvorstellung des Targets?", "Marktübliche ARR-Multiples für profitables SaaS — verhandelbar, aber kein Schnäppchen."),
 ],
 "tree": [
  {"t": "Markt & Zielsegment", "b": ["Enterprise vs. Mid-Market: Wettbewerbsrealität", "Regulatorische Produktlücken (SEC, HIPAA)"]},
  {"t": "Build-Szenario", "b": ["Ramp-up: Vertrieb, Marke, 3-4 Jahre Zeitverlust", "Kapitalbedarf & Durchdringungsrisiko"]},
  {"t": "Buy-Szenario", "star": True, "b": ["Sofortiger Marktzugang: Kunden, Team, Referenzen", "Produkt-Fit-Lücke: Migrations-/Integrationsplan"], "c": [{"t": "Preis vs. Alternative Build quantifizieren", "b": []}]},
  {"t": "Empfehlung & Umsetzung", "b": ["Entscheidungslogik: Zeit vs. Kontrolle vs. Kosten", "100-Tage-Plan für die gewählte Route"]},
 ],
 "notes": "Build vs. Buy sauber gegenüberstellen (Zeit, Kapital, Risiko) und eine begründete Empfehlung geben — inkl. des unbequemen Punkts, dass das Target technisch altert und Migration kostet.",
},

"c9306737": {  # operations: Konsumgüter Supply Chain klimaneutral + Kosten
 "qa": [
  ("Gibt es einen Zielkonflikt zwischen CO2 und Kosten?", "Teilweise — aber viele Maßnahmen (Netzwerkverdichtung, Energieeffizienz, weniger Luftfracht) senken beides gleichzeitig; genau diese sollen zuerst gefunden werden."),
  ("Wie sieht das heutige Netzwerk aus?", "Historisch gewachsen: viele kleine Werke und Läger mit Redundanzen, Kosten deutlich über Branchenbenchmark."),
  ("Was fordern die Handelskunden konkret?", "Produktgenaue CO2-Daten (Product Carbon Footprint) innerhalb der nächsten zwei Jahre — sonst drohen Auslistungsgespräche."),
  ("Wo entstehen die meisten Emissionen?", "Der Großteil ist Scope 3: Rohstoffe aus Schwellenländern und Transporte; eigene Werke (Scope 1+2) sind der kleinere Teil."),
  ("Welche Zielmarken gelten?", "Supply-Chain-Kosten Richtung Branchenbenchmark und ein glaubwürdiger Klimaneutralitätspfad — beides mit messbaren Etappen."),
 ],
 "tree": [
  {"t": "Netzwerk-Redesign", "star": True, "b": ["Footprint-Analyse: Werke/Läger konsolidieren", "Nearshoring & Transportmodi (weniger Luftfracht)"], "c": [{"t": "Doppel-Effekt-Maßnahmen (Kosten UND CO2) priorisieren", "b": []}]},
  {"t": "Dekarbonisierung", "b": ["Scope 1+2: Energie, Elektrifizierung", "Scope 3: Rohstoff-Hotspots & Lieferantenprogramm"]},
  {"t": "Transparenz & Daten", "b": ["PCF-Tracking je Produkt aufbauen", "Kundenreporting für Handelspartner"]},
  {"t": "Umsetzung & Steuerung", "b": ["Roadmap mit Kosten-/CO2-Zielen je Welle", "Governance: wer trägt die Ziele?"]},
 ],
 "notes": "Der Trick ist die Doppel-Effekt-Priorisierung: Erst Maßnahmen, die Kosten UND CO2 senken. Scope-3-Dominanz und die PCF-Kundenanforderung müssen vorkommen.",
},

"b4f00bd3": {  # operations: Kühlkette Logistik
 "qa": [
  ("Wo geht die meiste Ware verloren?", "An den Übergabepunkten (Rampe, Umschlag) und auf langen Touren ohne Sensorik — belastbare Daten gibt es nur für die IoT-Teilflotte."),
  ("Wie ist die Flotte aufgestellt?", "Gemischt: eigene LKW und viele Subunternehmer mit heterogenem Standard; zentrale Tourenplanung fehlt."),
  ("Wie groß ist der Kostenrückstand?", "Die Logistikkosten liegen spürbar über Benchmark — Haupttreiber sind schlechte Auslastung und ineffiziente Routen."),
  ("Welche Investitionen sind denkbar?", "IoT-Vollausstattung und eine Transportplanungssoftware sind budgetierbar, ein Netzwerk-Umbau nur mit Business Case."),
  ("Gibt es Service-Vorgaben?", "Lieferfähigkeit und Frische dürfen nicht leiden — Händler messen die Regalverfügbarkeit."),
 ],
 "tree": [
  {"t": "Netzwerk & Touren", "star": True, "b": ["Verteilzentren & Routen optimieren (Hub vs. direkt)", "Auslastung der Flotte steigern"], "c": [{"t": "Zentrale Transportplanung einführen", "b": []}]},
  {"t": "Kühlketten-Qualität", "b": ["IoT-Sensorik auf 100% der Flotte", "Kritische Übergabepunkte absichern"]},
  {"t": "Partner & Verträge", "b": ["Subunternehmer-Standards & Anreize (Schwund-KPIs)", "Make-or-Buy je Region prüfen"]},
  {"t": "Steuerung", "b": ["Schwund- & Kosten-KPIs in Echtzeit", "Business Case: Einsparung vs. Investition"]},
 ],
 "notes": "Zwei Ziele, ein Netzwerk: Kosten (Planung, Auslastung) und Schwund (Sensorik, Übergabepunkte) brauchen je eigene Hebel. Die Subunternehmer-Steuerung wird oft vergessen.",
},

"72d68811": {  # operations: Chip-Fabrik Europa vs. Südostasien
 "qa": [
  ("Wie groß ist die Investition?", "Ein hoher einstelliger Milliardenbetrag über mehrere Jahre — die größte Einzelentscheidung der Firmengeschichte."),
  ("Wie stark wiegt die EU-Förderung?", "Sie würde einen zweistelligen Prozentsatz der Investition abdecken, ist aber an Auflagen und Clawback-Klauseln gebunden."),
  ("Welche Rolle spielt Geopolitik?", "Zentral: Kunden und Regierungen drängen auf Diversifizierung weg von Asien-Konzentration; das Taiwan-Risiko treibt die Debatte."),
  ("Wie unterscheiden sich die Betriebskosten?", "Südostasien ist bei Energie, Personal und Bau klar günstiger; Europa punktet mit Fördermitteln, Kundennähe und Rechtssicherheit."),
  ("Für welche Kunden ist der Standort relevant?", "Europäische Automobil- und Industriekunden fordern zunehmend regionale Fertigung — teils vertraglich."),
 ],
 "tree": [
  {"t": "Wirtschaftlichkeit (TCO/NPV)", "star": True, "b": ["Capex mit/ohne Förderung, Opex-Differenzen", "20-Jahres-NPV & Sensitivitäten (Energiepreis, Auslastung)"], "c": [{"t": "Förderauflagen & Clawback-Risiken einpreisen", "b": []}]},
  {"t": "Strategische Faktoren", "b": ["Geopolitische Diversifizierung (Taiwan-Risiko)", "Kundennähe & regionale Fertigungszusagen"]},
  {"t": "Umsetzbarkeit", "b": ["Bauzeit, Genehmigungen, Fachkräfte je Standort", "Technologie-Node & Fab-Ökosystem"]},
  {"t": "Entscheidung & Absicherung", "b": ["Szenario-Matrix: Kosten vs. Risiko vs. Strategie", "Phasierung/Modularität als Hedge"]},
 ],
 "notes": "Standortentscheidung = harte TCO-Rechnung PLUS strategische Dimension (Geopolitik, Kundennähe) — beide Ebenen müssen getrennt sichtbar sein. Sensitivitäten zeigen Seniorität.",
},

"05325d4d": {  # pricing: Orphan Drug Deutschland
 "qa": [
  ("Wie viele Patienten gibt es?", "Eine niedrige vierstellige Zahl in Deutschland — klassischer Orphan-Drug-Bereich."),
  ("Wie stark ist die Evidenz?", "Klinisch sehr überzeugend: deutliche Verbesserung gegenüber best-supportive-care, kaum Nebenwirkungen."),
  ("Wie läuft die Preisbildung in Deutschland?", "Erstes Jahr freie Preissetzung, parallel AMNOG-Nutzenbewertung, danach Erstattungsbetrags-Verhandlung mit dem GKV-Spitzenverband."),
  ("Welche Vergleichstherapie gilt?", "Keine direkte — bewertet wird gegen best-supportive-care, was die Zusatznutzen-Argumentation stärkt."),
  ("Welche Erwartungen hat das Unternehmen?", "F&E-Kosten amortisieren und einen Referenzpreis setzen, der internationale Preisverhandlungen nicht beschädigt."),
 ],
 "tree": [
  {"t": "Wertbasis des Preises", "star": True, "b": ["Klinischer Zusatznutzen & Lebensqualität", "Kosten vermiedener Behandlungen/Hospitalisierung"], "c": [{"t": "Health-Economics-Dossier (QALY-Argumentation)", "b": []}]},
  {"t": "Regulatorischer Pfad", "b": ["Jahr-1-Preis strategisch setzen (AMNOG)", "Erstattungsverhandlung & Schiedsstellen-Szenario"]},
  {"t": "Zugang & Ethik", "b": ["Managed-Entry: Pay-for-Performance, Ratenmodelle", "Härtefallprogramme, öffentliche Wahrnehmung"]},
  {"t": "Internationale Wirkung", "b": ["Referenzpreis-Effekte auf andere Länder", "Launch-Sequenz international"]},
 ],
 "notes": "Pharma-Pricing dreht sich um Nutzenbewertung + Verhandlungspfad (AMNOG), nicht um Kosten-plus. Managed-Entry-Modelle und internationale Referenzeffekte adeln die Antwort.",
},

"f3d33a16": {  # pricing: Hotelkette Dynamic Pricing 3 Marken
 "qa": [
  ("Wie wird heute bepreist?", "Halbjährlich fixierte Preislisten je Haus auf Basis historischer Belegung — Marktveränderungen fließen kaum ein."),
  ("Wie groß ist der Rückstand?", "RevPAR liegt spürbar unter Benchmark; Wettbewerber mit KI-Pricing schöpfen Nachfragespitzen deutlich besser ab."),
  ("Woher kommen die Beschwerden über Intransparenz?", "Stammgäste sehen stark schwankende Preise für dasselbe Zimmer und fühlen sich unfair behandelt — vor allem im Luxussegment."),
  ("Welche Daten sind verfügbar?", "Buchungshistorie ja; externe Signale (Events, Flüge, Wetter) werden bisher gar nicht genutzt."),
  ("Gibt es Vorgaben je Marke?", "Der Vorstand will markenspezifische Regeln — was im Budget-Segment funktioniert, darf die Luxusmarke nicht beschädigen."),
 ],
 "tree": [
  {"t": "Segmentierte Pricing-Architektur", "star": True, "b": ["Budget: aggressiv dynamisch", "Business: nachfragebasiert mit Korridoren", "Luxury: wertorientiert, enge Leitplanken"]},
  {"t": "Technologie & Daten", "b": ["Pricing-Engine + externe Signale (Events, Flüge)", "A/B-Tests & Forecast-Qualität"]},
  {"t": "Marken- & Kundenschutz", "b": ["Preiskorridore je Marke", "Transparenz & Loyalty-Vorteile für Stammgäste"]},
  {"t": "Rollout & Steuerung", "b": ["Pilothäuser je Marke, dann Skalierung", "RevPAR-/NPS-Monitoring als Doppelziel"]},
 ],
 "notes": "Dynamic Pricing mit Markenschutz: Die differenzierte Logik je Marke (inkl. Leitplanken im Luxus) ist der Kern. RevPAR UND Kundenwahrnehmung als Doppelmetrik zeigt Reife.",
},

"cceaa705": {  # pricing: Airline Abo-Modell
 "qa": [
  ("Was verspricht sich der Vorstand vom Abo?", "Planbare wiederkehrende Erlöse, Kundenbindung und Datenvorteile — plus PR-Effekt als Innovationsführer."),
  ("Wie voll sind die Flieger heute?", "Load Factor um 93% — freie Sitze sind knapp, echte Zusatzkapazität gibt es kaum."),
  ("Welche Abo-Varianten sind angedacht?", "Inlands-Abo und EU-weites Abo als monatliche Pauschale, Buchung mit Vorlauffenster, Test in zwei Märkten."),
  ("Wen würde das Abo anziehen?", "Analysen deuten auf Vielflieger und flexible Privatreisende — genau die Gruppen mit dem größten Kannibalisierungsrisiko."),
  ("Welche Nebenerlöse sind relevant?", "Gepäck, Sitzplatz, Verpflegung — Abo-Kunden könnten dort sogar mehr ausgeben."),
 ],
 "tree": [
  {"t": "Nachfrage & Kannibalisierung", "star": True, "b": ["Kannibalisierung vs. inkrementelle Nachfrage quantifizieren", "Adverse Selection: Vielflieger-Problem"], "c": [{"t": "Kapazitätsrealität bei 93% Load Factor", "b": []}]},
  {"t": "Ökonomie & Design", "b": ["Break-even-Flüge je Abo-Preis", "Design-Hebel: Blackout-Zeiten, Standby-Logik, Kontingente"]},
  {"t": "Ertrags-Nebeneffekte", "b": ["Ancillary-Umsatz der Abo-Kunden", "CLV- und Bindungseffekt"]},
  {"t": "Pilot & Risiko", "b": ["Test in 2 Märkten mit klaren Abbruchkriterien", "Yield-Management-Konflikte steuern"]},
 ],
 "notes": "Bei 93% Load Factor ist Kannibalisierung + Adverse Selection die Kernfrage — ein Abo verkauft knappe Sitze billiger, wenn das Design (Kontingente, Blackouts, Standby) es nicht verhindert.",
},

"ed4ea0bd": {  # pricing: Robot-as-a-Service
 "qa": [
  ("Warum wollen Kunden RaaS?", "OpEx statt CapEx: keine Anfangsinvestition, Flexibilität bei Auslastungsschwankungen, Service inklusive."),
  ("Was besorgt den CFO konkret?", "Umsatz verschiebt sich von Einmalerlösen in Raten — die GuV bricht optisch ein und die Bilanz trägt die Roboter."),
  ("Welche Kundensegmente sind RaaS-affin?", "KMU und projektbasierte Fertiger; Großserienkunden kaufen tendenziell weiter klassisch."),
  ("Was kostet der Betrieb eines Roboters?", "Wartung, Ersatzteile und Remote-Monitoring sind gut kalkulierbar — die Basis für eine Stunden-/Monatsrate existiert."),
  ("Was machen Wettbewerber?", "Zwei testen RaaS in Pilotprogrammen; Preispunkte sind noch nicht etabliert — es gibt ein Zeitfenster."),
 ],
 "tree": [
  {"t": "Preis- & Finanzmodell", "star": True, "b": ["Rate kalkulieren: Leasing-Logik + Service + Zielrendite", "Revenue-Recognition & Bilanz-Effekt modellieren"], "c": [{"t": "Cash-Flow-Brücke der Übergangsjahre", "b": []}]},
  {"t": "Segment-Strategie", "b": ["RaaS für KMU/Projektfertiger, Kauf für Großserie", "Hybrid: Mietkauf, Mindestlaufzeiten"]},
  {"t": "Risiko & Asset-Management", "b": ["Auslastungs-/Rückgaberisiko bepreisen", "Refurbishing & Zweitvermarktung"]},
  {"t": "Go-to-Market", "b": ["Vertriebsvergütung auf wiederkehrend umstellen", "Pilotkunden & Referenzcases"]},
 ],
 "notes": "RaaS = Pricing + Finanzierung + Risikotransfer in einem: Wer Rate, Bilanz-/Cash-Effekt und Auslastungsrisiko zusammen denkt (und segmentiert statt alles umzustellen), trifft den Kern.",
},

"5b0b36ba": {  # profitability: Industriekonzern 4 Bereiche
 "qa": [
  ("Wie groß sind die vier Bereiche?", "Automotive und Chemicals tragen den Großteil des Umsatzes und das gesamte positive EBIT; Energy und Digital sind kleiner, wachsen aber."),
  ("Warum verlieren Energy und Digital Geld?", "Energy leidet unter Preisdruck und Überkapazität; Digital ist im Aufbau mit hohen Vorlaufkosten und unklarem Geschäftsmodell."),
  ("Gibt es Synergien zwischen den Bereichen?", "Begrenzt — Digital liefert Werkzeuge für die anderen Bereiche, Energy teilt sich Standorte mit Chemicals."),
  ("Was erwartet der Kapitalmarkt?", "Analysten fordern seit Längerem ein klares Portfolio-Statement; ein Konglomeratsabschlag ist im Kurs sichtbar."),
  ("Gibt es Denkverbote?", "Nein — von Turnaround über Verkauf bis Schließung ist alles diskutierbar."),
 ],
 "tree": [
  {"t": "Transparenz je Bereich", "star": True, "b": ["EBIT-Brücken & ROIC je Segment", "Ursachen: strukturell vs. zyklisch vs. Aufbauphase"], "c": [{"t": "Cross-Subsidies & Verrechnungen sichtbar machen", "b": []}]},
  {"t": "Verlustbereiche: Optionen", "b": ["Energy: Restrukturierung vs. Verkauf/Schließung", "Digital: fokussieren, Meilenstein-Finanzierung"]},
  {"t": "Gewinnbereiche stärken", "b": ["Automotive/Chemicals: Cash-Generierung sichern", "Reinvestition nur bei klarem ROIC"]},
  {"t": "Portfolio & Kapitalmarkt", "b": ["Zielportfolio & Sum-of-Parts-Logik", "Kommunikationsfähige Roadmap"]},
 ],
 "notes": "Konzern-Profitabilität = Segmentanalyse + differenzierte Behandlung (Energy ≠ Digital: strukturell vs. Aufbau). Wer alles gleich behandelt, argumentiert am Kern vorbei.",
},

"20d87cca": {  # profitability: Airline-Konzern, Loyalty-IPO
 "qa": [
  ("Warum steht der Loyalty-IPO im Raum?", "Das Programm ist hochprofitabel; ein Teilverkauf würde die Verschuldung senken und den Wert sichtbar machen."),
  ("Wie hängen Loyalty und Passage zusammen?", "Eng: Das Programm lebt von Flugmeilen, Statusvorteilen und der Kreditkartenpartnerschaft — eine Trennung braucht saubere Verträge."),
  ("Wie schlecht steht die Passage da?", "Zurück auf Vorkrisen-Umsatz, aber Marge unter Vorkrise: Treibstoff, Personal und Pünktlichkeitskosten drücken."),
  ("Was ist mit Cargo und MRO?", "Cargo normalisiert sich nach dem Boom, bleibt aber profitabel; MRO ist stabil, aber kapitalintensiv."),
  ("Wie hoch ist der Schuldendruck?", "Nettoverschuldung deutlich über Ziel; das Rating steht unter Beobachtung."),
 ],
 "tree": [
  {"t": "Portfolio-Transparenz", "b": ["ROIC & Marge je Segment", "Cross-Subsidies & interne Verrechnung (Meilen!)"]},
  {"t": "Loyalty-IPO prüfen", "star": True, "b": ["Standalone-Bewertung & Erlösverwendung (Schulden)", "Vertragswerk Meilen/Status nach Teilverkauf"], "c": [{"t": "Risiko: Melkkuh verlieren vs. Wert heben", "b": []}]},
  {"t": "Passage-Turnaround", "b": ["Yield & Streckenportfolio bereinigen", "Kostenprogramm Richtung Vorkrisenmarge"]},
  {"t": "Kapitalstruktur", "b": ["Entschuldungspfad & Rating", "Capex-Priorisierung (Flotte vs. MRO)"]},
 ],
 "notes": "Sum-of-Parts-Case: Loyalty-IPO ist Finanz-Hebel mit strategischem Preis (Abhängigkeiten Passage↔Loyalty). Wer beides verbindet und die Passage-Sanierung nicht vergisst, liegt richtig.",
},

"8fe2d54d": {  # profitability: Tier-1 ICE vs. E-Mobility
 "qa": [
  ("Wie schnell schrumpft das ICE-Geschäft?", "Mittlerer einstelliger Prozentsatz pro Jahr, mit beschleunigtem Rückgang ab Ende des Jahrzehnts erwartet."),
  ("Wann könnte E-Mobility break-even sein?", "Nach interner Planung in vier bis fünf Jahren — wenn Skaleneffekte und zwei Großaufträge kommen."),
  ("Wie ist die Belegschaft verteilt?", "Der Großteil arbeitet im ICE-Bereich; Umqualifizierung ist teilweise möglich, aber nicht für alle."),
  ("Wie reagieren die OEM-Kunden?", "Sie verlangen Liefertreue im ICE bis zum Schluss UND aggressive E-Preise — die Verhandlungsmacht liegt bei ihnen."),
  ("Welche finanziellen Leitplanken gelten?", "Die Konzernmarge darf nicht unter eine kritische Schwelle fallen, sonst drohen Rating- und Covenant-Probleme."),
 ],
 "tree": [
  {"t": "ICE: Ernten", "star": True, "b": ["Cash-Cow-Management: Preise, Kosten, kein Neu-Capex", "Kapazitäten konsolidieren, sozialverträglicher Abbau"]},
  {"t": "E-Mobility: Reifen", "b": ["Break-even-Pfad & Skaleneffekte", "Partnerschaften/Allianzen für Volumen"]},
  {"t": "Übergangssteuerung", "b": ["Cash-Brücke: ICE finanziert E-Ramp-up", "Personal-Transformation (Umqualifizierung)"], "c": [{"t": "Szenarien: schneller/langsamer ICE-Verfall", "b": []}]},
  {"t": "Stakeholder & Leitplanken", "b": ["OEM-Verhandlungen (Liefertreue vs. Preise)", "Margen-/Rating-Schwellen überwachen"]},
 ],
 "notes": "Dual Transformation: ICE ernten, E reifen, Übergang über Cash-Brücke und Szenarien steuern. Die Personal-Dimension gehört bei diesem Case zwingend dazu.",
},

"231370c4": {  # profitability: Medienkonzern Portfolioumbau
 "qa": [
  ("Wie verteilen sich Umsatz und Ergebnis?", "TV trägt stabil, Events wachsen profitabel; Print und Streaming schreiben zusammen deutliche Verluste."),
  ("Wie weit ist Streaming vom Break-even entfernt?", "Bei aktuellem Kurs zwei bis drei Jahre — abhängig von Content-Kosten und Abo-Wachstum."),
  ("Gibt es Interessenten für Print?", "Sondierungen zeigen begrenztes Käuferinteresse zu niedrigen Bewertungen; ein Verkauf wäre eher Befreiung als Erlös."),
  ("Wie hängen die Segmente zusammen?", "TV-Inhalte und -Reichweite stützen Streaming; Events profitieren von den Medienmarken — Print ist weitgehend entkoppelt."),
  ("Welche sozialen Restriktionen gelten?", "Im Print-Segment arbeitet ein großer Teil der Belegschaft; jeder Umbau braucht einen sozialverträglichen Plan."),
 ],
 "tree": [
  {"t": "Portfolio-Diagnose", "star": True, "b": ["Segmente klassifizieren (Cash Cow, Star, Dog...)", "Sum-of-Parts & Verbundeffekte"], "c": [{"t": "Print: Harvest vs. Verkauf durchrechnen", "b": []}]},
  {"t": "Streaming-Turnaround", "b": ["Break-even-Pfad: Content-Kosten, Pricing, Bundles", "TV-Synergien maximal nutzen"]},
  {"t": "Wachstum finanzieren", "b": ["TV-Cash in Streaming/Events lenken", "Events skalieren (Formate, Städte)"]},
  {"t": "Umsetzung & Stakeholder", "b": ["Sozialplan & Kommunikation Print", "Meilensteine & Kapitalmarkt-Story"]},
 ],
 "notes": "Portfolio-Case mit Verbundeffekten: Print-Entscheidung (Harvest vs. Verkauf) und Streaming-Pfad sind die Brennpunkte; TV als Finanzierungsquelle erkennen. Soziale Dimension nicht vergessen.",
},

}
