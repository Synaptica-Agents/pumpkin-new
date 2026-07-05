# -*- coding: utf-8 -*-
# Casebook-Upgrade der 22 aktiven medium-Alt-Cases.
# Format je Case: qa=[(frage, antwort)], tree=[{t,star?,b:[...],c:[{t,b}]}], notes=str
# Baum-Knoten-IDs vergibt build_sql.py.

UPGRADES_MEDIUM = {

"edc39cc9": {  # growth: Traditioneller Verlag, digitale Wachstumsstrategie
 "qa": [
  ("Was ist das Ziel des Vorstands?", "Den Umsatzrückgang stoppen und in fünf Jahren mindestens ein Drittel des Umsatzes digital erwirtschaften."),
  ("Wie digital ist der Verlag heute?", "Kaum — es gibt einen einfachen Webshop und E-Book-Ausgaben der Topseller, aber keine eigene Plattform und kein Digital-Team."),
  ("Welche Assets bringt der Verlag mit?", "Eine starke, vertrauenswürdige Marke, exklusive Autorenverträge und ein großes Backlist-Archiv an Rechten."),
  ("Wie entwickelt sich der Markt?", "Print schrumpft leicht, Hörbücher und E-Learning wachsen zweistellig, Abo-Modelle setzen sich durch."),
  ("Gibt es Budget für Zukäufe?", "Kleinere Zukäufe oder Beteiligungen wären finanzierbar, ein großer Plattform-Kauf nicht."),
 ],
 "tree": [
  {"t": "Digitale Produkte", "star": True, "b": ["E-Books & Hörbücher aus der Backlist heben", "Abo-/Bundle-Modelle testen"], "c": [{"t": "E-Learning/Kurse zu starken Themenmarken", "b": []}]},
  {"t": "Kanäle & Kundenzugang", "b": ["Eigener D2C-Shop + Newsletter/Community", "Plattform-Partnerschaften (Audible, Spotify)"]},
  {"t": "Fähigkeiten & Organisation", "b": ["Digital-Team aufbauen oder zukaufen", "Datennutzung: Wer sind die Leser überhaupt?"]},
  {"t": "Print-Basis managen", "b": ["Profitables Kerngeschäft stabil halten", "Freiwerdende Mittel in Digital umschichten"]},
 ],
 "notes": "Kern: starke Marke + Rechte-Archiv als Hebel für digitale Produkte (Hörbuch/E-Learning), nicht bloß 'Website verbessern'. Gute Kandidaten trennen Produkt, Kanal und Fähigkeiten und vergessen die Print-Cash-Basis nicht.",
},

"2aaaa59b": {  # growth: B2B-SaaS Supply-Chain, NRR <100%
 "qa": [
  ("Was genau bedeutet die NRR unter 100%?", "Bestandskunden geben pro Jahr netto weniger aus — Abwanderung und Downgrades übersteigen das Upselling."),
  ("Warum kündigen Kunden?", "Exit-Interviews nennen fehlende Funktionen (v.a. KI-Prognosen) und schleppenden Support als Hauptgründe."),
  ("Wie ist der Vertrieb aufgestellt?", "Stark auf Neukunden ausgerichtet; für Bestandskunden gibt es kein dediziertes Customer-Success-Team."),
  ("Wie steht das Produkt im Wettbewerb?", "Funktional solide, aber zwei Wettbewerber haben KI-Features gelauncht, die in Ausschreibungen zunehmend gefordert werden."),
  ("Gibt es Preisspielraum?", "Die Preise wurden seit drei Jahren nicht angefasst; Benchmarks deuten auf moderaten Spielraum bei Enterprise-Kunden."),
 ],
 "tree": [
  {"t": "Retention & Expansion", "star": True, "b": ["Churn-Ursachen quantifizieren (Feature-Gaps, Support)", "Customer-Success-Team für Top-Accounts"], "c": [{"t": "Land-and-Expand in Bestandskunden", "b": []}]},
  {"t": "Produkt & Roadmap", "b": ["KI-Prognose-Features priorisieren", "Feature-Request-Backlog systematisch abarbeiten"]},
  {"t": "Neugeschäft", "b": ["Sales-Cycle verkürzen (Pilotpakete)", "Referenzen & Cases aus Bestandskunden nutzen"]},
  {"t": "Pricing", "b": ["Moderate Preisanpassung bei Enterprise", "Paketierung nach Nutzungsintensität"]},
 ],
 "notes": "NRR<100% heißt: Das Loch im Eimer stopfen kommt vor Neukunden. Starke Antworten priorisieren Retention/Expansion + Produkt (KI-Gap) und behandeln Neugeschäft nachgelagert.",
},

"6f6732e2": {  # growth: IT-Freelancer-Plattform, zweiseitiger Marktplatz
 "qa": [
  ("Welche Seite ist der Engpass?", "Die Freelancer-Seite: Gute Profile wandern ab, weil Vermittlungen zu selten und Konditionen unattraktiv sind."),
  ("Wie verdient die Plattform Geld?", "Provision auf vermittelte Projektumsätze; Unternehmen zahlen zusätzlich für Premium-Zugänge."),
  ("Wie steht es um das Matching?", "Überwiegend manuelle Vorschläge durch Account-Manager, lange Time-to-Match."),
  ("Wer sind die Wettbewerber?", "Zwei internationale Plattformen mit mehr Volumen, aber weniger Spezialisierung auf IT."),
  ("Welche Skills sind am gefragtesten?", "Cloud, Data und KI — genau dort ist das Freelancer-Angebot am dünnsten."),
 ],
 "tree": [
  {"t": "Supply: Freelancer", "star": True, "b": ["Time-to-Match senken (schnellere Vermittlung)", "Konditionen & Zahlungsziele verbessern"], "c": [{"t": "Gezieltes Recruiting für Cloud/KI-Skills", "b": []}]},
  {"t": "Demand: Unternehmen", "b": ["Self-Service für kleine Projekte", "Managed Service für Enterprise-Accounts"]},
  {"t": "Matching & Produkt", "b": ["Matching automatisieren/algorithmisch", "Qualität: Reviews, Zertifizierungen"]},
  {"t": "Ökonomie des Marktplatzes", "b": ["Netzwerkeffekte je Skill-Nische aktivieren", "Take-Rate vs. Liquidität ausbalancieren"]},
 ],
 "notes": "Zweiseitiger Marktplatz: erst den Engpass (Supply/Freelancer) fixen, sonst verpufft alles auf der Demand-Seite. Wer beide Seiten + Matching-Mechanik sauber trennt, liegt vorn.",
},

"e529b943": {  # growth: Premium-Fitnessstudio, Umsatz pro Mitglied
 "qa": [
  ("Warum keine neuen Studios?", "Der Inhaber will kein zusätzliches Kapital binden — Wachstum soll aus der bestehenden Fläche kommen."),
  ("Wie ist die Auslastung?", "Moderat mit klaren Tälern am Vormittag und frühen Nachmittag; Personal Trainer sind stark unterausgelastet."),
  ("Was zahlen Mitglieder heute?", "Eine Premium-Flatrate; Zusatzleistungen wie Personal Training werden selten gebucht und kaum aktiv verkauft."),
  ("Gibt es digitale Angebote?", "Nein, keine App, keine Online-Kurse."),
  ("Wie preissensibel sind die Mitglieder?", "Eher gering — das Publikum ist zahlungskräftig und legt Wert auf Service und Exklusivität."),
 ],
 "tree": [
  {"t": "Upselling bestehender Leistungen", "star": True, "b": ["Personal-Training-Pakete aktiv verkaufen", "Premium-Tiers (Sauna/Wellness, Vorrangbuchung)"], "c": [{"t": "Ernährungs-/Gesundheitscoaching", "b": []}]},
  {"t": "Cross-Selling & Partner", "b": ["Physio, Supplements, Merchandise", "Corporate-Wellness für Firmen in der Nähe"]},
  {"t": "Digitale Erweiterung", "b": ["App mit Trainingsplänen & Challenges", "Hybrid-Mitgliedschaft mit Online-Kursen"]},
  {"t": "Auslastungssteuerung", "b": ["Off-Peak-Angebote (Senioren, Homeoffice-Tarife)", "Kursplan nach Nachfrage optimieren"]},
 ],
 "notes": "ARPU-Wachstum auf Fläche: ungenutzte Trainer-Kapazität ist der offensichtlichste Hebel — aktiv verkaufen statt passiv anbieten. Digital und Off-Peak sind valide Zusatzäste.",
},

"21e118e1": {  # ma: Automobilzulieferer übernimmt Batterie-Startup
 "qa": [
  ("Was ist das strategische Ziel?", "Zugang zu Festkörperbatterie-Technologie, um im E-Mobility-Umbruch relevant zu bleiben — organisch wäre das zu langsam."),
  ("Wie weit ist die Technologie?", "Vielversprechende Prototypen und ein starkes Patentportfolio, aber noch keine Serienreife — Industrialisierung steht aus."),
  ("Wie steht das Startup finanziell da?", "Hoher Cash-Burn, Finanzierung reicht noch etwa 18 Monate; es gibt weitere Interessenten."),
  ("Gibt es Alternativen zur Übernahme?", "Eine Minderheitsbeteiligung mit Entwicklungspartnerschaft oder eine reine Lizenzierung wären denkbar."),
  ("Wie wichtig ist das Team?", "Entscheidend — die Kernkompetenz sitzt bei etwa 20 Schlüsselforschern."),
 ],
 "tree": [
  {"t": "Strategischer Fit", "b": ["Passt Festkörper-Tech zur Produkt-Roadmap?", "Zeitvorteil vs. Eigenentwicklung"]},
  {"t": "Technologie & Team", "star": True, "b": ["Reifegrad & Weg zur Serienreife prüfen", "Patente bewerten"], "c": [{"t": "Schlüsselforscher binden (Retention)", "b": []}]},
  {"t": "Deal-Optionen & Preis", "b": ["Vollübernahme vs. Beteiligung vs. Lizenz", "Bewertung bei negativem Cash-Flow (Optionswert)"]},
  {"t": "Integration & Risiken", "b": ["Startup-Kultur vs. Konzern schützen", "Industrialisierungs-Investitionen einplanen"]},
 ],
 "notes": "Tech-Akquisition: Der Wert liegt in Technologie-Option + Team, nicht in heutigen Umsätzen. Starke Antworten prüfen Reifegrad, denken Deal-Alternativen (Beteiligung/Lizenz) und Retention explizit mit.",
},

"113d3c2c": {  # ma: Versicherer übernimmt InsurTech (Telematik)
 "qa": [
  ("Warum interessiert sich der Versicherer für das InsurTech?", "Telematik-Tarife gewinnen im Kfz-Geschäft Marktanteile, und der eigene Konzern hat die Technologie nicht."),
  ("Wie schlimm ist der Cash-Burn?", "Das Startup verliert monatlich einen mittleren sechsstelligen Betrag; die Runway liegt unter einem Jahr."),
  ("Was ist an der Plattform besonders?", "Proprietäre Fahrdaten-Auswertung mit nachweislich besserer Risikoselektion als Standard-Tarife."),
  ("Wie würden die Kunden übernommen?", "Der Bestand ist klein — der Wert liegt in Technologie und Team, nicht im Kundenbuch."),
  ("Gibt es regulatorische Hürden?", "Die BaFin muss zustimmen; Datenschutz bei Fahrdaten ist ein sensibles Prüfthema."),
 ],
 "tree": [
  {"t": "Strategischer Mehrwert", "star": True, "b": ["Telematik als Differenzierung im Kfz-Segment", "Daten-Assets & Risikoselektion bewerten"], "c": [{"t": "Zugang zu digitalaffiner Zielgruppe", "b": []}]},
  {"t": "Bewertung & Finanzen", "b": ["Cash-Burn & Runway in Kaufpreis einpreisen", "Synergien: Vertrieb, Schadenprävention"]},
  {"t": "Integration", "b": ["Tech-Anbindung an Legacy-Systeme", "Team & Kultur halten"]},
  {"t": "Risiken & Regulatorik", "b": ["BaFin-Freigabe, Datenschutz Fahrdaten", "Was passiert bei Nicht-Kauf? (Wettbewerber)"]},
 ],
 "notes": "Klassische Capability-Akquisition mit Distressed-Note: Runway <1 Jahr stärkt die Verhandlungsposition des Käufers. Wert = Technologie + Daten + Team; Kundenbestand ist irrelevant.",
},

"93a69c43": {  # ma: Logistikkonzern, Last-Mile-Plattform Südostasien
 "qa": [
  ("Was will der Konzern strategisch erreichen?", "Präsenz im wachsenden südostasiatischen E-Commerce-Markt — dort ist er heute praktisch nicht vertreten."),
  ("Wie ernst ist der regulatorische Druck?", "In zwei der fünf Länder liegen Gesetzentwürfe zur Festanstellung von Gig-Fahrern vor; Timing und Ausgang sind offen."),
  ("Was würde Festanstellung kosten?", "Interne Schätzung: Die Zustellkosten je Paket würden um einen zweistelligen Prozentsatz steigen."),
  ("Wie ist die Wettbewerbslage?", "Zwei regionale Player konsolidieren gerade; die Zielplattform ist Nummer zwei oder drei je nach Land."),
  ("Wie ist die Technologie einzuschätzen?", "Routing- und Dispatch-Plattform gilt als modern und wäre auch für andere Konzernmärkte nutzbar."),
 ],
 "tree": [
  {"t": "Strategischer Wert", "b": ["Zugang Last-Mile in Wachstumsregion", "Technologie-Plattform konzernweit nutzbar"]},
  {"t": "Regulatorisches Risiko", "star": True, "b": ["Gig-Worker-Gesetzgebung je Land analysieren", "Kostenszenarien: Status quo vs. Festanstellung vs. Hybrid"], "c": [{"t": "Deal-Schutz: Preis-Anpassung/Earn-out an Szenarien koppeln", "b": []}]},
  {"t": "Standalone-Qualität", "b": ["Unit Economics je Land", "Marktposition & Konsolidierungsdynamik"]},
  {"t": "Integration & Alternativen", "b": ["Standalone führen vs. integrieren", "Alternative: Partnerschaft oder anderes Target"]},
 ],
 "notes": "Der Case dreht sich um das regulatorische Szenario-Risiko — starke Antworten machen es zum eigenen Ast mit Kostenszenarien und koppeln die Deal-Struktur (Preis/Earn-out) daran.",
},

"d2e896dc": {  # ma: Medienkonzern übernimmt Podcast-Netzwerk
 "qa": [
  ("Wie konzentriert ist das Portfolio?", "Die Top-5-Shows liefern rund 60% der Downloads — die Abhängigkeit von wenigen Hosts ist hoch."),
  ("Wie sind die Hosts gebunden?", "Die Mehrheit hat Exklusivverträge, viele laufen aber innerhalb der nächsten zwei Jahre aus."),
  ("Wie verdient das Netzwerk Geld?", "Fast ausschließlich Werbung (Host-Read-Ads); Abo-Erlöse sind minimal."),
  ("Warum verkauft der Eigentümer?", "Die Gründer wollen nach starkem Wachstum Kasse machen; ein Wettbewerbsprozess mit mehreren Bietern läuft."),
  ("Welche Synergien sieht der Konzern?", "Cross-Promotion über Radio/TV, Vermarktung über die eigene Sales-Force und Exklusiv-Content für die Streaming-Plattform."),
 ],
 "tree": [
  {"t": "Content & Verträge", "star": True, "b": ["Konzentration auf Top-Shows quantifizieren", "Host-Verträge: Laufzeiten, Exklusivität"], "c": [{"t": "Retention-Pakete für Schlüssel-Hosts", "b": []}]},
  {"t": "Kommerzielle Synergien", "b": ["Werbevermarktung über Konzern-Sales", "Cross-Promotion & Streaming-Exklusivität"]},
  {"t": "Markt & Monetarisierung", "b": ["Podcast-Werbemarkt: Wachstum vs. Sättigung", "Abo/Paid-Potenzial des Portfolios"]},
  {"t": "Preis & Risiken", "b": ["Bewertung bei negativem EBITDA (Multiples auf Reichweite?)", "Bieterwettbewerb: Walk-away-Preis definieren"]},
 ],
 "notes": "People-Business-M&A: Der Wert hängt an wenigen Hosts mit auslaufenden Verträgen — Retention ist die Deal-Frage. Wer zusätzlich Synergien konkret benennt und einen Walk-away-Preis fordert, punktet.",
},

"cbc8ebd0": {  # market_entry: Fintech nach Brasilien
 "qa": [
  ("Warum gerade Brasilien?", "Großer, mobiler Zahlungsmarkt mit hoher Smartphone-Durchdringung; das Management sieht dort die größte Lücke für das Produkt."),
  ("Wie funktioniert das Produkt genau?", "Mobile-Payment-App mit P2P-Zahlungen und Händlerakzeptanz, in DACH mit solider Nutzerbasis."),
  ("Was ist mit PIX?", "Das brasilianische Instant-Payment-System PIX ist allgegenwärtig und kostenlos — jede Lösung muss darauf aufsetzen statt dagegen zu konkurrieren."),
  ("Welche regulatorischen Anforderungen gibt es?", "Eine Zahlungsinstituts-Lizenz der Zentralbank oder Partnerschaft mit einem lizenzierten Institut ist nötig."),
  ("Wie viel Kapital steht bereit?", "Die Series B erlaubt einen Markteintritt, aber keinen jahrelangen Cash-Burn — nach 24 Monaten sollen erste Deckungsbeiträge stehen."),
 ],
 "tree": [
  {"t": "Markt & Wettbewerb", "b": ["Zahlungsverhalten & PIX-Dominanz verstehen", "Lokale Wallets/Neobanken als Wettbewerber"]},
  {"t": "Produkt-Lokalisierung", "star": True, "b": ["PIX-Integration als Muss", "Use-Case-Differenzierung vs. kostenlose Alternativen"], "c": [{"t": "Monetarisierung: Händlerservices statt P2P-Gebühren", "b": []}]},
  {"t": "Regulatorik & Setup", "b": ["Lizenz vs. Partnerschaft mit lokalem Institut", "Datenschutz/AML-Anforderungen"]},
  {"t": "Go-to-Market & Ökonomie", "b": ["Startregion & Kundenakquise-Kanäle", "CAC/Break-even im 24-Monats-Fenster"]},
 ],
 "notes": "Der Knackpunkt ist PIX: kostenloses Instant-Payment macht das DACH-Geschäftsmodell nicht 1:1 übertragbar. Starke Antworten stellen die Monetarisierungsfrage und wählen Lizenz-/Partnermodell bewusst.",
},

"0f3f9bf6": {  # market_entry: Handwerker-Marktplatz nach Japan
 "qa": [
  ("Was ist das Ziel der Expansion?", "Einen ersten asiatischen Markt erschließen; Japan wurde wegen Marktgröße und Zahlungskraft gewählt."),
  ("Wie läuft die Handwerkervermittlung in Japan heute?", "Überwiegend über persönliche Empfehlungen und lokale Netzwerke; digitale Vermittler spielen kaum eine Rolle."),
  ("Gibt es lokale Wettbewerber?", "Wenige kleine Anbieter ohne dominante Plattform — der Markt ist offen, aber kulturell anspruchsvoll."),
  ("Wie wichtig ist Lokalisierung?", "Sehr: Sprache, Qualitätsnachweise und Vertrauen entscheiden; ein rein übersetztes EU-Produkt gilt intern als aussichtslos."),
  ("Welche Ressourcen stehen bereit?", "Ein Landesbudget für drei Jahre und die Bereitschaft, mit lokalem Partner oder kleinem Zukauf zu starten."),
 ],
 "tree": [
  {"t": "Markt & Kultur", "star": True, "b": ["Vertrauensmechanismen: Empfehlungen ersetzen", "Qualitäts-/Zertifizierungsstandards verstehen"], "c": [{"t": "Zahlungs- & Servicegewohnheiten lokalisieren", "b": []}]},
  {"t": "Wettbewerb & Kunden", "b": ["Lücke: keine dominante Plattform", "Customer Journey je Segment kartieren"]},
  {"t": "Eintrittsmodell", "b": ["Lokaler Partner oder kleiner Zukauf statt Greenfield", "Pilot in einer Metropolregion (z.B. Tokio)"]},
  {"t": "Aufbau der Angebotsseite", "b": ["Handwerker-Akquise & Verifizierung", "Anreize für erste Bewertungen/Referenzen"]},
 ],
 "notes": "Vertrauens- und Kulturfrage schlägt Technik: Wer den Empfehlungs-Mechanismus digital nachbaut (Verifizierung, Zertifikate, Partner) und mit Pilot + lokalem Partner startet, trifft den Kern.",
},

"d4198132": {  # market_entry: Premium-Kaffeemaschinen in die USA
 "qa": [
  ("Welches Segment soll adressiert werden?", "Specialty-Coffee-Enthusiasten im Premium-Segment — preislich deutlich über Kapselmaschinen."),
  ("Wie groß ist das Premium-Segment?", "Klein, aber mit dem Specialty-Trend zweistellig wachsend; verlässliche Zahlen fehlen und wären zu validieren."),
  ("Was unterscheidet das Produkt?", "Siebträger-Qualität mit Automatik-Komfort und Langlebigkeit — in Europa klarer Testsieger."),
  ("Gibt es schon US-Vertrieb oder Service?", "Nein, weder Händlernetz noch Serviceinfrastruktur; Spannungs-/Zertifizierungsanpassung (UL) steht ebenfalls aus."),
  ("Wie stark sind die Wettbewerber?", "Breville, Jura und DeLonghi sind etabliert und besetzen die relevanten Retail-Regale."),
 ],
 "tree": [
  {"t": "Segment & Positionierung", "b": ["Zielgruppe Specialty-Enthusiasten schärfen", "Zahlungsbereitschaft & Segmentgröße validieren"]},
  {"t": "Kanalstrategie", "star": True, "b": ["D2C-Start (Marge, Datenhoheit) vs. Premium-Retail", "Amazon: Sichtbarkeit vs. Preisdruck"], "c": [{"t": "Coffee-Community & Influencer als Einstiegskanal", "b": []}]},
  {"t": "Operations & Service", "b": ["UL-Zertifizierung & 120V-Anpassung", "Service-/Reparaturnetz von Tag 1"]},
  {"t": "Wettbewerb & Business Case", "b": ["Differenzierung vs. Breville/Jura", "Eintrittsinvestition & Break-even-Pfad"]},
 ],
 "notes": "Nischen-Markteintritt: Kanalwahl ist die zentrale Entscheidung (D2C/Community-Start liegt nahe). Service-Infrastruktur wird oft vergessen — starke Antworten haben sie drin.",
},

"da2f093f": {  # market_entry: Smarte Heizsysteme nach Frankreich
 "qa": [
  ("Was verkauft das Unternehmen genau?", "Smart-Thermostate und Steuerungen für Wärmepumpen — in Deutschland über Installateure und Fachgroßhandel vertrieben."),
  ("Warum Frankreich?", "Großer Markt mit strenger Effizienzregulierung (RE2020), die smarte Steuerungen begünstigt."),
  ("Was bedeutet der hohe Elektroheizungs-Anteil?", "Das Produkt muss Elektro-Direktheizungen ansteuern können — dafür ist eine Produktanpassung nötig."),
  ("Wie stark sind Netatmo und Somfy?", "Beide sind lokal etabliert mit starken Handelsbeziehungen; Netatmo gehört zu Legrand."),
  ("Welche Kanäle sind denkbar?", "Installateure, Baumärkte (Leroy Merlin, Castorama) und Online — der Installateurskanal erfordert lokalen Support."),
 ],
 "tree": [
  {"t": "Marktspezifika & Produkt", "star": True, "b": ["Elektroheizungs-Kompatibilität entwickeln", "RE2020 als Verkaufsargument nutzen"], "c": [{"t": "Wärmepumpen-Welle als Timing-Chance", "b": []}]},
  {"t": "Wettbewerbspositionierung", "b": ["Differenzierung vs. Netatmo/Somfy (Effizienz-Expertise)", "Preis-Leistungs-Positionierung"]},
  {"t": "Vertrieb & Partner", "b": ["Installateurs-Netz mit Schulung/Support aufbauen", "Baumarkt- und Online-Listung"]},
  {"t": "Markteintritts-Ökonomie", "b": ["Lokalisierungskosten (Produkt, Support, Marketing)", "Phasenplan & Erfolgskriterien"]},
 ],
 "notes": "Regulierung (RE2020) ist hier Rückenwind — gute Antworten machen sie zum Verkaufsargument statt zur Hürde und erkennen die Produktanpassung an Elektroheizung als Eintrittsvoraussetzung.",
},

"b61fe531": {  # operations: Krankenhaus-Netzwerk Shared Services zentralisieren
 "qa": [
  ("Was ist das Ziel der Zentralisierung?", "Deutliche Kostensenkung und einheitliche Prozessqualität, ohne die Versorgung an den Standorten zu gefährden."),
  ("Wie groß sind die Redundanzen?", "Jeder Standort leistet sich eigene IT-, Einkaufs- und HR-Teams; erste Schätzungen sehen 20-30% Doppelarbeit."),
  ("Wie heterogen ist die IT?", "Sehr — teils unterschiedliche Systeme für dieselben Aufgaben, was jede Konsolidierung erschwert."),
  ("Wie stehen die Standorte dazu?", "Skeptisch bis ablehnend; die Häuser fürchten Kontrollverlust und schlechteren Service."),
  ("Gibt es Vorgaben zum Personal?", "Betriebsbedingte Kündigungen sollen vermieden werden — Abbau über Fluktuation und Umschulung."),
 ],
 "tree": [
  {"t": "Ist-Analyse & Baseline", "b": ["Prozesslandkarte & Kosten je Standort", "Redundanzen quantifizieren, Best Practices finden"]},
  {"t": "Zielmodell", "star": True, "b": ["Shared-Service-Center-Design je Funktion (IT/Einkauf/HR)", "Governance & Service-Level gegenüber Häusern"], "c": [{"t": "Standortwahl & Systemkonsolidierung", "b": []}]},
  {"t": "Umsetzung & Change", "b": ["Phasenplan: Quick Wins (Einkauf bündeln) zuerst", "Mitarbeiter: Umschulung statt Kündigung, Kommunikation"]},
  {"t": "Nutzen & Risiken", "b": ["Einsparziel & KPIs (Kosten, Servicequalität)", "Risiko Servicequalität in Übergangsphase"]},
 ],
 "notes": "SSC-Klassiker mit Stakeholder-Dimension: Neben dem Zielmodell zählen Change-Management und Service-Level-Zusagen an skeptische Standorte. Einkauf ist der typische Quick Win.",
},

"63582979": {  # operations: Krankenversicherer Antragsbearbeitung
 "qa": [
  ("Wie lange dauert die Bearbeitung heute?", "Im Schnitt mehr als doppelt so lang wie der Branchendurchschnitt; Beschwerden und Anrufe binden zusätzlich Kapazität."),
  ("Welche Anträge sind am aufwendigsten?", "Ein großer Teil sind eigentlich Standardfälle — komplex wird es durch fehlende Angaben und Systembrüche."),
  ("Wie hoch ist der Automatisierungsgrad?", "Niedrig: Fast alles läuft über manuelle Prüfung in mehreren, schlecht integrierten Systemen."),
  ("Warum so viele Rückfragen?", "Die Antragsformulare sind unklar, Belege fehlen häufig — jede Rückfrage kostet Tage."),
  ("Gibt es Budget für IT?", "Ja, der Vorstand ist bereit zu investieren, erwartet aber auch kurzfristig sichtbare Verbesserungen."),
 ],
 "tree": [
  {"t": "Prozessdiagnose", "b": ["End-to-End-Prozess kartieren, Engpässe messen", "Fallarten clustern: Standard vs. komplex"]},
  {"t": "Automatisierung", "star": True, "b": ["Dunkelverarbeitung für Standardfälle", "KI-gestützte Beleg-/Dokumentprüfung"], "c": [{"t": "Systembrüche schließen (Integration)", "b": []}]},
  {"t": "Quick Wins", "b": ["Formulare & Upload verbessern → weniger Rückfragen", "Prioritäts-Routing: einfache Fälle sofort"]},
  {"t": "Steuerung & Kunde", "b": ["Durchlaufzeit-KPIs & Transparenz je Team", "Status-Tracking für Kunden (entlastet Hotline)"]},
 ],
 "notes": "Prozess-Case mit klarer Zweiteilung: Quick Wins (Rückfragen, Routing) + strukturelle Automatisierung (Dunkelverarbeitung). Wer Standard- von Komplexfällen trennt, hat den Kern.",
},

"afd1fb89": {  # operations: OEE im Motorenwerk
 "qa": [
  ("Wie setzt sich der OEE-Rückstand zusammen?", "Alle drei Faktoren liegen unter Ziel: Verfügbarkeit wegen ungeplanter Stillstände, Leistung wegen Taktzeitverlusten, Qualität wegen Ausschuss."),
  ("Was verursacht die Stillstände?", "Ein Großteil geht auf wenige Anlagentypen zurück; Wartung ist überwiegend reaktiv."),
  ("Wie laufen die Umrüstungen?", "Unstandardisiert — die Zeiten variieren stark zwischen Schichten und liegen weit über Zielwert."),
  ("Wie sind die Schichten aufgestellt?", "Erfahrene Teams erreichen deutlich bessere Werte — Wissen ist nicht dokumentiert."),
  ("Welche Datenbasis existiert?", "Maschinendaten werden erfasst, aber kaum systematisch ausgewertet."),
 ],
 "tree": [
  {"t": "Verfügbarkeit", "star": True, "b": ["Stillstands-Pareto: wenige Anlagen zuerst", "Predictive/präventive Wartung einführen"], "c": [{"t": "Ersatzteil-Management optimieren", "b": []}]},
  {"t": "Leistung", "b": ["Taktzeitverluste je Linie analysieren", "SMED: Umrüstzeiten standardisieren"]},
  {"t": "Qualität", "b": ["Ausschuss-Ursachen (Pareto) beheben", "Qualitäts-Regelkreise an den Linien"]},
  {"t": "Befähigung & Steuerung", "b": ["Best-Practice-Transfer zwischen Schichten", "OEE-Daten transparent im Shopfloor-Management"]},
 ],
 "notes": "Lehrbuch-OEE-Zerlegung (Verfügbarkeit/Leistung/Qualität) plus Befähigungs-Ebene. Pareto-Denken (wenige Anlagen, wenige Ursachen) unterscheidet starke von generischen Antworten.",
},

"f6738f3e": {  # pricing: HR-SaaS Preiserhöhung
 "qa": [
  ("Wie stark soll erhöht werden?", "Der CFO denkt an 15-20% — final ist das nicht; die Analyse soll die Höhe mitbestimmen."),
  ("Warum jetzt?", "Kosten sind gestiegen, und die Preise wurden seit vier Jahren nicht angepasst; der Vorstand sieht aufgestauten Spielraum."),
  ("Wie ist die Kundenbindung?", "Churn ist niedrig, Wechselkosten sind hoch — die Software ist tief in HR-Prozesse integriert."),
  ("Was machen die Wettbewerber preislich?", "Vergleichbare Anbieter liegen je nach Paket auf ähnlichem oder leicht höherem Niveau."),
  ("Gibt es Preisdifferenzierung?", "Bisher ein Einheitspreis pro Mitarbeiter und Monat, kaum Paketierung."),
 ],
 "tree": [
  {"t": "Zahlungsbereitschaft & Risiko", "star": True, "b": ["Wechselkosten & Churn-Risiko je Segment", "Wettbewerbspreise als Anker"], "c": [{"t": "Preis-Absatz-Wirkung: Szenarien 10/15/20%", "b": []}]},
  {"t": "Struktur statt nur Höhe", "b": ["Paketierung (Basic/Pro/Enterprise)", "Value-Metrik prüfen: pro Mitarbeiter vs. Module"]},
  {"t": "Umsetzung Bestandskunden", "b": ["Staffelung & Ankündigungsfristen", "Grandfathering für Schlüsselkunden"]},
  {"t": "Kommunikation & Flankierung", "b": ["Wertargumentation (neue Features, Support)", "Vertriebs-Playbook für Einwände"]},
 ],
 "notes": "Preiserhöhung bei niedriger Churn = viel Spielraum, aber Umsetzung entscheidet: Segmentierung, Staffelung, Wert-Story. Wer nur 'erhöhen ja/nein' diskutiert, greift zu kurz.",
},

"0c5bb759": {  # pricing: Spezialchemie value-based pricing
 "qa": [
  ("Was heißt kostenbasiert heute konkret?", "Preis = Herstellkosten plus fixer Aufschlag — unabhängig davon, was das Produkt beim Kunden bewirkt."),
  ("Wie unterschiedlich ist der Kundennutzen?", "Enorm: Dieselbe Chemikalie spart je nach Anwendung wenig oder sehr viel Prozesskosten beim Kunden."),
  ("Wovor hat der Vertrieb Angst?", "Vor Kundenverlusten und schwierigen Gesprächen — er hat keine Werkzeuge, den Wert zu argumentieren."),
  ("Welche Daten existieren?", "Kaum systematische Daten über Kundenanwendungen; das Wissen steckt in den Köpfen der Anwendungstechniker."),
  ("Wie schnell soll die Umstellung gehen?", "Der Vorstand will erste Ergebnisse innerhalb eines Jahres, keine Big-Bang-Umstellung."),
 ],
 "tree": [
  {"t": "Wertanalyse", "star": True, "b": ["Kundensegmentierung nach Anwendung & Nutzen", "Value-in-Use quantifizieren (eingesparte Prozesskosten)"], "c": [{"t": "Referenz- vs. Differenzierungswert je Produkt", "b": []}]},
  {"t": "Pilotierung", "b": ["Pilot mit ausgewählten Produkten/Kunden", "Pricing-Tool & Datenbasis aufbauen"]},
  {"t": "Vertrieb & Change", "b": ["Value-Selling-Training & Argumentationshilfen", "Incentives von Volumen auf Marge umstellen"]},
  {"t": "Risiko & Governance", "b": ["Kundenverlust-Risiko je Segment steuern", "Eskalations-/Ausnahmeregeln definieren"]},
 ],
 "notes": "Value-Pricing-Transformation = Analytik + Change: Ohne Vertriebs-Enablement und Pilot scheitert es. Starke Antworten haben beide Seiten, nicht nur die Wertformel.",
},

"e6b9842b": {  # pricing: Cloud-Anbieter Preismodell vereinfachen
 "qa": [
  ("Was genau treibt die Kunden weg?", "Unvorhersehbare Rechnungen: Kunden können ihre Monatskosten nicht prognostizieren und erleben böse Überraschungen."),
  ("Wie viele Preiskomponenten gibt es?", "Mehrere Dutzend einzeln bepreiste Komponenten — historisch gewachsen."),
  ("Was schätzen Kunden am Anbieter?", "Support und persönliche Betreuung werden deutlich besser bewertet als bei den Hyperscalern."),
  ("Wie preissensibel sind die Kunden?", "Mittel — Planbarkeit ist ihnen wichtiger als der letzte Cent."),
  ("Gibt es Constraints für das neue Modell?", "Bestandsumsatz soll nicht kannibalisiert werden; die Migration muss für Kunden attraktiv sein."),
 ],
 "tree": [
  {"t": "Diagnose des Ist-Modells", "b": ["Komponenten clustern, Hauptkostentreiber finden", "Vergleich mit AWS/Azure-Preislogik"]},
  {"t": "Neues Modell", "star": True, "b": ["Wenige Pakete (S/M/L/Enterprise) mit Planbarkeit", "Flatrate-Elemente + transparente Overage-Regeln"], "c": [{"t": "Kostenprognose-Dashboard als Produktfeature", "b": []}]},
  {"t": "Migration", "b": ["Bestandskunden-Mapping auf neue Pakete", "Savings-Garantie/Preisschutz für Wechsler"]},
  {"t": "Positionierung", "b": ["Planbarkeit + Support als Differenzierung vermarkten", "Churn- und Umsatz-Effekt tracken"]},
 ],
 "notes": "Das Problem ist Vorhersagbarkeit, nicht Preishöhe. Gute Antworten bauen das neue Modell um Planbarkeit (Pakete, Garantien, Transparenz) und regeln die Migration aktiv.",
},

"003e9c51": {  # pricing: PM-Software per-user → usage-based
 "qa": [
  ("Was motiviert den Wechsel?", "Viele lizenzierte User nutzen die Software kaum — der Wert korreliert eher mit Projekten und Aktivität als mit Sitzanzahl."),
  ("Wo hängt der Umsatz heute?", "Ein Großteil kommt von Enterprise-Kunden mit großen Sitzpaketen — genau dort wäre reines Usage-Pricing riskant."),
  ("Welche Nutzungsmetriken kommen infrage?", "Aktive Projekte, aktive Nutzer pro Monat oder Aktionen — belastbare Daten liegen vor."),
  ("Was machen Wettbewerber?", "Überwiegend Per-Seat; einzelne Herausforderer testen Hybrid-Modelle."),
  ("Wie schnell soll umgestellt werden?", "Ohne Bestandskunden-Schock — eine Übergangsphase von etwa einem Jahr gilt als akzeptabel."),
 ],
 "tree": [
  {"t": "Impact-Simulation", "star": True, "b": ["Umsatzeffekt je Kunde simulieren (Gewinner/Verlierer)", "Enterprise-Risiko separat quantifizieren"], "c": [{"t": "Metrik-Wahl: aktive Nutzer vs. Projekte", "b": []}]},
  {"t": "Zielmodell", "b": ["Hybrid: Basisgebühr + Nutzungskomponente", "Mindest-Commitment für Planbarkeit"]},
  {"t": "Transition", "b": ["Grandfathering & Wahlrecht für Bestandskunden", "Stufenweise Umstellung, klare Kommunikation"]},
  {"t": "Steuerung", "b": ["Erfolgs-KPIs (NRR, Churn, Neukunden-Conversion)", "Rollback-Kriterien definieren"]},
 ],
 "notes": "Kern ist die Simulation: Wer gewinnt/verliert unter Usage-Pricing — besonders Enterprise. Hybrid-Modell + sanfte Transition ist die naheliegende, gut begründbare Empfehlung.",
},

"edc985ce": {  # profitability: D2C-Matratzen Unit Economics
 "qa": [
  ("Wie sehen die Unit Economics aus?", "LTV/CAC liegt unter 2 und fällt; der CAC ist in zwei Jahren um mehr als die Hälfte gestiegen."),
  ("Warum steigt der CAC so stark?", "Steigende Werbepreise in Social-Kanälen und zunehmende Konkurrenz durch andere D2C-Marken."),
  ("Wie schlimm sind die Retouren?", "Probeschlaf-Retouren liegen deutlich über Plan; zurückgesandte Matratzen sind kaum wiederverwertbar."),
  ("Wie oft kaufen Kunden wieder?", "Fast nie — eine Matratze hält Jahre; Zusatzsortiment (Kissen, Bettwaren) wird kaum mitverkauft."),
  ("Gibt es Offline-Präsenz?", "Nein, reiner Online-Vertrieb."),
 ],
 "tree": [
  {"t": "Unit Economics reparieren", "star": True, "b": ["CAC senken: Kanalmix, Brand vs. Performance", "Retourenquote senken (Beratung, Erwartungsmanagement)"], "c": [{"t": "Retourenkosten in LTV ehrlich einrechnen", "b": []}]},
  {"t": "LTV erhöhen", "b": ["Warenkorb: Bundles & Zusatzsortiment", "Wiederkauf-Kategorien (Bettwaren, Topper)"]},
  {"t": "Wachstumstempo & Fixkosten", "b": ["Wachstum an profitablen Kohorten ausrichten", "Fixkosten-/Overheaddisziplin"]},
  {"t": "Pfad zur Profitabilität", "b": ["Szenarien: Break-even bei welchem CAC/Retourenniveau?", "Meilensteine für Investoren definieren"]},
 ],
 "notes": "D2C-Falle: Wachstum kaschiert kaputte Unit Economics. Starke Antworten arbeiten an CAC UND Retouren, statt nur mehr Marketing zu fordern, und liefern eine Break-even-Logik.",
},

"cbc58191": {  # profitability: Carsharing Städte-P&L
 "qa": [
  ("Wie unterschiedlich sind die Städte?", "Sehr: Die besten Städte sind nahe Break-even, die schwächsten verlieren pro Fahrzeug ein Vielfaches davon."),
  ("Was treibt die Unterschiede?", "Auslastung und Umsatz pro Fahrzeug — beeinflusst von Dichte, Zonenzuschnitt und lokaler Konkurrenz."),
  ("Warum liegen die Wartungskosten über Plan?", "Höhere Schadenquoten und teure Ad-hoc-Reparaturen; Werkstattverträge sind nie neu verhandelt worden."),
  ("Gibt es Preisdifferenzierung?", "Kaum — weitgehend einheitliche Minutenpreise über Städte und Tageszeiten."),
  ("Was erwartet der Investor konkret?", "Einen glaubwürdigen Plan, der den Konzern innerhalb von zwei Jahren auf Break-even bringt — auch um den Preis von Marktaustritten."),
 ],
 "tree": [
  {"t": "Transparenz je Stadt", "star": True, "b": ["P&L pro Stadt aufstellen", "Treiberbaum: Auslastung x Umsatz/Fahrzeug x Kosten"], "c": [{"t": "Break-even-Auslastung je Stadt berechnen", "b": []}]},
  {"t": "Portfolio-Entscheidungen", "b": ["Schwache Städte: sanieren, schrumpfen oder Exit", "Zonen-/Flottengröße je Stadt optimieren"]},
  {"t": "Ertrag & Preis", "b": ["Dynamisches Pricing (Zeit, Zone, Nachfrage)", "B2B-/Abo-Angebote für Grundauslastung"]},
  {"t": "Kostenhebel", "b": ["Wartungs- & Versicherungsverträge neu verhandeln", "Schadenmanagement & Telematik"]},
 ],
 "notes": "Städte-P&L zuerst — ohne Transparenz keine Priorisierung. Gute Antworten trauen sich Portfolio-Entscheidungen (Exit schwacher Städte) und nennen Preis- plus Kostenhebel.",
},

"422aebe7": {  # profitability: Industrieverpackungen Großkunden-Marge
 "qa": [
  ("Wie groß ist der Großkunde inzwischen?", "Er steht für rund ein Drittel des Umsatzes — mit weiter wachsendem Anteil."),
  ("Wie kam der Vertrag zustande?", "Aggressiv verhandelt in einer Wachstumsphase; Preisgleitklauseln für Rohstoffe fehlen."),
  ("Welche versteckten Kosten verursacht er?", "Sonderwünsche, Expresslieferungen, lange Zahlungsziele und dedizierte Kapazitäten, die nirgends bepreist sind."),
  ("Wie entwickeln sich die Rohstoffkosten?", "Deutlich gestiegen und volatil — ohne Gleitklauseln trägt der Hersteller das Risiko allein."),
  ("Wie ist die Verhandlungsposition?", "Der Kunde hat Alternativen, aber ein Wechsel wäre für ihn mit Umstellungskosten und Qualitätsrisiken verbunden."),
 ],
 "tree": [
  {"t": "Kundenprofitabilität", "star": True, "b": ["P&L je Kunde/Segment: Bestands- vs. Neukunden", "Vollkosten des Großkunden inkl. versteckter Kosten"], "c": [{"t": "Konzentrationrisiko (1/3 Umsatz) bewerten", "b": []}]},
  {"t": "Vertrag & Preis", "b": ["Neuverhandlung: Gleitklauseln, Service-Bepreisung", "Walk-away-Szenario durchrechnen"]},
  {"t": "Kosten & Effizienz", "b": ["Rohstoff-Hedging/Einkaufsstrategie", "Komplexitätskosten (Sonderwünsche) reduzieren"]},
  {"t": "Portfolio-Strategie", "b": ["Bestandskunden-Pricing pflegen", "Neukundenmix: Marge vor Volumen"]},
 ],
 "notes": "Wachstum ohne Marge: Der Großkunde ist Umsatzsegen und Margenfluch. Kern sind Kunden-P&L inkl. versteckter Kosten und eine vorbereitete Neuverhandlung mit Walk-away-Logik.",
},

}
