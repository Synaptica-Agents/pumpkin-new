-- ============================================================
-- Market Sizing: Replace existing cases with 22 hand-curated ones
-- ============================================================
-- 1) Deactivate all existing cases
-- 2) Insert 22 new curated cases with model_answer in reference_structure
--    and summary in key_assumptions_examples
-- ============================================================

UPDATE public.market_sizing_cases SET active = false;

INSERT INTO public.market_sizing_cases (
  difficulty, industry_tag, region, prompt, target_metric,
  unit_hint, allowed_methods, reference_structure, key_assumptions_examples,
  expected_order_of_magnitude_min, expected_order_of_magnitude_max, active
) VALUES
-- ============================================================
-- 1. Hunde in Deutschland
-- ============================================================
('medium', 'pets', 'Deutschland',
 'Wie viele Hunde leben in Deutschland?',
 'Anzahl Hunde', 'Hunde', 'top-down,bottom-up',
 'Zunächst solltest du, wie immer bei Market Sizing Aufgaben, eine Grundlage zur Beantwortung der Frage schaffen. Die Struktur ist in diesem Fall: Anzahl Hunde = Anzahl Menschen × % mit Hunden + weitere Hunde. Die Bevölkerung Deutschlands beläuft sich aktuell auf ca. 80M. Du könntest in Gedanken beispielsweise deinen Bekanntenkreis durchgehen und zählen, wie viele Hunde auf 100 Personen kommen. Dies könnten ca. 10 Hunde sein. Deine Annahme solltest du nun um weitere Überlegungen ergänzen. Wie viele streunende Hunde gibt es in Deutschland? Wie viele Hunde leben in Tierheimen? Mit diesen Annahmen sollte dich deine Schätzung auf +/- 9M Hunde belaufen.

Wichtiger Hinweis: Eine Schätzung über den eigenen Bekanntenkreis ist stets zu vermeiden, hier gibt es allerdings nicht viele andere Möglichkeiten. Das Problem an einer solchen Schätzung ist, dass die wenigsten von uns einen repräsentativen Bekanntenkreis besitzen. Dieses Problem solltest du zumindest gegenüber dem/der Interviewenden kommunizieren.',
 'Bevölkerung (80M) × Hundebesitzquote (~10%) + streunende Hunde + Tierheime → ~9M Hunde',
 4500000, 18000000, true),

-- ============================================================
-- 2. Fahrräder in Deutschland
-- ============================================================
('medium', 'mobility', 'Deutschland',
 'Wie viele Fahrräder gibt es in Deutschland?',
 'Anzahl Fahrräder', 'Fahrräder', 'top-down,bottom-up',
 'Dies errechnet sich aus der Multiplikation der Bevölkerungsanzahl mit der Anzahl an Fahrrädern pro Person. Die Bevölkerung Deutschlands beläuft sich aktuell auf knapp 80M. Um zu demonstrieren, dass du weitere Überlegungen getroffen hast, um diese Zahl zu präzisieren, solltest du explizit weitere Annahmen treffen. So sind in Deutschland beispielsweise über 500.000 Menschen von Wohnungslosigkeit betroffen. Beschreibe für den nächsten Schritt nun die verschiedenen Gruppen in der Bevölkerung: Die allermeisten Personen werden ein Fahrrad haben. Dann gibt es allerdings natürlich Personen, die kein Fahrrad haben, das kann am Alter liegen (zu jung oder zu alt), aber auch an der Freizeit-Beschäftigung oder dem Wohnort (kein Nutzen durch ein Fahrrad). Gleichzeitig gibt es auch einige Personen, die mehr als ein Fahrrad haben z.B. weil sie dem Radsport nachgehen. Es scheint fair zu sein anzunehmen, dass die beiden Gruppen sich ausgleichen. Damit würde es schlussendlich auf ca. 75M Fahrräder hinauslaufen.',
 'Bevölkerung 80M × Fahrräder/Person. Kein-Fahrrad-Gruppe und Mehrfachbesitzer gleichen sich aus → ~75M Fahrräder',
 38000000, 150000000, true),

-- ============================================================
-- 3. Geschenke 01.01. Geburtstag
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Wie viel Umsatz wird mit Geschenken für Deutsche gemacht, die am 01.01. Geburtstag haben?',
 'Jährlicher Umsatz', '€', 'top-down',
 'Das Ergebnis bestimmt sich durch eine Multiplikation der Anzahl an Menschen, die an diesem Tag Geburtstag haben und beschenkt werden, mit dem Umsatz pro Geburtstagskind. In Deutschland leben ca. 80M Menschen, das Jahr hat 365 Tage und nehmen wir nun an, dass die Geburtstage im Jahr gleichverteilt sind. Teilst du die Gesamtbevölkerung durch die Anzahl der Tage, erhältst du eine Größenordnung für die Anzahl an Personen in Deutschland, die am selben Tag Geburtstag haben: ca. 220.000. Allerdings werden nicht alle Personen überhaupt beschenkt. Gehe zum Beispiel davon aus, dass ca. 10% der Leute nicht beschenkt werden, weil sie sich mit anderen darauf geeinigt haben oder das Geld fehlt (220T × 0,9 = ca. 200T). Nun geht es weiter mit dem Umsatz pro Geburtstagskind. Ermittle diesen Wert z.B., indem du einen Durchschnitt aus „Viel-", „Mittel-" und „Wenig-" Beschenkten bildest. Nimm zum Beispiel an, dass ein Viertel besonders stark beschenkt wird (ca. 500 Euro), ein Viertel vergleichsweise wenig Geschenke erhält (ca. 100 Euro) und die Hälfte einen mittleren Geschenkwert bekommt (ca. 200 Euro). Dieses Vorgehen (Aufteilung in 25/50/25) repliziert eine Normalverteilung, die häufig in der Realität zu beobachten ist. Den Wert der Geschenke pro beschenkter Person schätzt du also im Durchschnitt auf 250€. Multipliziere schlussendlich die Zahl der Beschenkten (ca. 200.000) mit dem geschätzten Durchschnittswert. Dies ergibt einen Gesamtumsatz von 50M Euro.',
 '80M ÷ 365 = 220.000 → ×0,9 = 200.000 Beschenkte × Ø 250€ (25/50/25-Methode) = ~50M Euro',
 25000000, 100000000, true),

-- ============================================================
-- 4. Tägliche Kaffee-Tassen Deutschland
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Wie hoch ist der tägliche Kaffee-Konsum in Deutschland (in Tassen) an einem Wochentag?',
 'Tägliche Tassen', 'Tassen/Tag', 'top-down',
 'Diese Summe ergibt sich durch die Bevölkerungsanzahl multipliziert mit der Anzahl an konsumierten Kaffee-Tassen pro Tag pro Person. Auch hier könntest du dich über deinen Bekanntenkreis herantasten oder alternativ die 25/50/25-Technik nutzen (s. vorherige Aufgabe). Letzteres ist grundsätzlich zu empfehlen, da die Schätzung neutraler wirkt, auch wenn die individuellen Schätzungen natürlich auch auf persönlichen Erfahrungen basieren. In diesem Fall könntest du z.B. annehmen, dass die Top 25% der Kaffeetrinker 4 Tassen am Tag trinken, die mittleren 50% 2 Tassen und die unteren 25% gar keinen Kaffee trinken. Die Bevölkerung Deutschlands beläuft sich aktuell auf knapp 80M. Du schätzt also, dass täglich 160M Tassen Kaffee getrunken werden.',
 '80M × 25/50/25-Methode: Top 25% = 4 Tassen, Mitte 50% = 2, Unten 25% = 0 → Ø 2 Tassen → ~160M Tassen täglich',
 80000000, 320000000, true),

-- ============================================================
-- 5. TUM Eintritt 1€
-- ============================================================
('medium', 'education', 'Deutschland',
 'Wie viel Umsatz könnten wir in einem Jahr generieren, indem wir jedes Mal beim Betreten der Technischen Universität München 1 Euro verlangen?',
 'Jährlicher Umsatz', '€/Jahr', 'bottom-up',
 'Bevor du in diesen Case startest, ist es wichtig, dass du ein gemeinsames Verständnis von „Betreten" entwickelst. Wann genau wird der Campus betreten? Zählen dazu die Gebäude oder reicht das Gelände? Hier könntest du die Annahme treffen, dass der Campus impliziert, dass der Campus zwischenzeitlich komplett verlassen werden soll. Lediglich zu rauchen fällt somit nicht unter eine Annahme. Mit dieser Information entwirfst du die Struktur. Das Ergebnis bestimmt sich aus der Anzahl der Menschen, die den Campus betreten könnten (Angestellte und Studierende) multipliziert mit der Häufigkeit ihrer Besuche und multipliziert mit einem Euro. Dies könnte man subsegmentieren in die Zeit, in der Vorlesungen sind, und die Zeit, in der keine Vorlesungen sind.

Zunächst überlegst du, wie viele Studierende die gesamte Universität hat. Hier ist es von Vorteil zu wissen, dass die TUM mehrere Campus hat und eine der größten Universitäten Deutschlands ist. Du könntest die Zahl der Studierenden so auf 40T schätzen. Zudem schätzt du die Zahl der Angestellten auf 10T. Wie häufig besuchen diese 50T Personen täglich die TUM? An einem durchschnittlichen Tag geht du davon aus, dass ca. die Hälfte (50%) der Personen die TUM mindestens einmal betritt. Nutze die 25/50/25-Technik, um eine Normalverteilung zu replizieren. An einem durchschnittlichen Vorlesungstag würden so ~50T€ eingenommen werden.

Du musst auch die Wochenenden während des Semesters einbeziehen — schätze ca. 500 Personen, die zweimal täglich die TUM betreten, sodass an beiden Tagen Einnahmen von ~1T€ erzielt werden könnten.

Fahre nun mit den Semesterferien fort. In den Semesterferien sind im Schnitt 1.000 Leute am Tag auf dem Campus, die zweimal täglich die TUM betreten — täglich Einnahmen von ca. 2T€.

Abschließend schätzt du: 22 Wochen Vorlesungszeit, 30 Wochen vorlesungsfreie Zeit.
22 Wochen × 7 Tage × 2T€ + 30 Wochen × 5 Tage × 50T€ + 30 Wochen × 2 Tage × 1T€ = 308T€ + 7.500T€ + 60T€ ≈ 8M€',
 '50T Personen (40T Studierende + 10T Angestellte). Vorlesungszeit Wochentage: ~50T€/Tag. Wochenenden: ~1T€/Tag. Semesterferien: ~2T€/Tag. Gesamt ≈ 8M€/Jahr',
 4000000, 16000000, true),

-- ============================================================
-- 6. Sixpacks Bier Deutschland
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Wie viele Sixpacks Bier werden jedes Jahr in Deutschland verkauft?',
 'Jährliche Sixpacks', 'Sixpacks/Jahr', 'top-down',
 'Diese Summe ergibt sich durch die Bevölkerungsanzahl multipliziert mit der Anzahl an konsumierten Sixpacks Bier pro Jahr pro Person (WENN: Angebot = Nachfrage). Die Anzahl der Sixpacks leitest du über den Gesamtkonsum an Bier und deren Anteil daran her. Starte erneut mit der Annahme, dass in Deutschland ca. 80M Menschen leben. Der pro-Kopf Konsum von Bier beläuft sich auf ca. 100L pro Jahr (inkl. Personen, die keinen Alkohol konsumieren dürfen). Nun gilt es zu überlegen, welche sonstigen Optionen zum Bierkonsum entstehen. Neben dem Konsum aus dem Glas/Fass gibt es auch die Möglichkeit, einzelne 0,33L oder 0,5L Bierflaschen zu trinken oder Kästen zu kaufen. Dir ist klar, dass das Restaurant und die Kästen deutlich mehr genutzt werden. Du gehst davon aus, dass die anderen Optionen insgesamt 90% des Konsums ausmachen. Du kommst also darauf, dass pro Person 5 Sixpacks pro Jahr konsumiert werden (0,1 × 100L / 2L). Wenn du dies mit der Anzahl der Personen multiplizierst, kommst du auf 400M Sixpacks pro Jahr.',
 '80M × 100L/Kopf × 10% als Sixpack ÷ 2L/Sixpack = 5 Sixpacks/Person → ~400M Sixpacks',
 200000000, 800000000, true),

-- ============================================================
-- 7. Zartbitterschokolade Deutschland
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Wie viele Tafeln Zartbitterschokolade werden jedes Jahr in Deutschland verkauft?',
 'Jährliche Tafeln', 'Tafeln/Jahr', 'top-down',
 'Diese Summe ergibt sich durch die Anzahl an Menschen, die diese Form der Schokolade essen, multipliziert mit der Anzahl an konsumierten Tafeln Zartbitterschokolade pro Jahr pro Person (WENN: Angebot = Nachfrage). Du beginnst mit der Annahme, dass ca. 80M Menschen in Deutschland leben und stellst dir folgende Fragen: Wie groß ist der Markt für Schokolade und insbesondere für dunkle Schokolade? Wie häufig kaufen die relevanten Konsumenten Schokolade?

Du gehst davon aus, dass ca. 80% der Deutschen Schokolade essen. Allerdings schätzt du aufgrund des Sortiments im Supermarkt, dass lediglich 20% dunkle Schokolade essen. Du schätzt die Anzahl der Personen, die dunkle Schokolade essen, auf ca. 12M (80M × 0,8 × 0,2). Du gehst davon aus, dass diese Konsumenten aufgrund ihres Konsumverhaltens segmentiert werden können. Du teilst die Konsumenten in drei Gruppen: Jene, die selten (eine Tafel alle drei Monate), regelmäßig (eine Tafel pro Monat) oder häufig (eine Tafel pro Woche) dunkle Schokolade kaufen. Du schätzt, dass 50% der 12M regelmäßig und jeweils 25% selten bzw. häufig Schokolade kaufen.

D.h. pro Jahr konsumieren die 12M Konsumenten insgesamt:
- 12M × 50% × 1 Tafel/Monat × 12 = 72M
- 12M × 25% × 1 Tafel/3 Monate × 12 = 12M
- 12M × 25% × 4 Tafeln/Monat × 12 = 144M

Also ca. 230M Tafeln dunkle Schokolade.',
 '80M × 80% Schokolade × 20% dunkel = 12M Konsumenten. 50/25/25-Segmentierung → 72M + 12M + 144M = ~230M Tafeln',
 115000000, 460000000, true),

-- ============================================================
-- 8. Stühle pro Haushalt Deutschland
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Was ist die durchschnittliche Anzahl an Stühlen in einem Haushalt in Deutschland?',
 'Stühle pro Haushalt', 'Stühle', 'top-down',
 'Zunächst solltest du dir überlegen, welche Stühle (Esszimmer-, Büro-, Balkon-, ...) du in deine Schätzung miteinbeziehst. Die Annahmen, die du diesbezüglich triffst, solltest du erneut explizit äußern. Du betrachtest in diesem Fall nur Esszimmer-, Balkon- und Bürostühle und beginnst dein Market Sizing erneut mit der Gesamtbevölkerung. Die Anzahl dieser Stühle lässt sich durch die Anzahl an Haushalten in Deutschland multipliziert mit der Anzahl an Stühlen je Haushalt berechnen. Segmentiere dazu die Haushalte in die verschiedenen Wohnungsgrößen. Die Anzahl an Haushalten in Deutschland beträgt ca. 40M. Du gehst davon aus, dass rund 75% der Haushalte entweder Ein- oder Zweipersonenhaushalte sind und zwischen zwei und acht Stühle besitzen: Mit der (25:2 / 50:5 / 25:8) Technik ergibt sich ein Median von 5 Stühlen. Du schätzt die durchschnittliche Zahl an Stühlen für die übrigen Haushalte mit derselben Methode auf 14. Du resümierst, dass es im Schnitt 0,75 × 5 Stühle + 0,25 × 14 Stühle, d.h. ca. 7 Stühle in einem Haushalt gibt.

Wichtiger Hinweis: Mit einem Case wie diesem kannst du auch deutlich mehr Zeit verbringen.',
 '40M Haushalte. 75% klein: Median 5 Stühle (25:2/50:5/25:8). 25% groß: ~14 Stühle. 0,75×5 + 0,25×14 = ~7 Stühle/Haushalt',
 4, 12, true),

-- ============================================================
-- 9. Smarties in einem Smart
-- ============================================================
('medium', 'consumer', 'weltweit',
 'Wie viele Smarties passen in einen Smart?',
 'Anzahl Smarties', 'Smarties', 'bottom-up',
 'Die Anzahl an Smarties berechnet sich durch die Größe der verfügbaren Fläche geteilt durch die Größe eines Smarties. Beginnen wir mit dem Smartie. Dazu könntest du das Volumen berechnen. Der Einfachheit halber solltest du annehmen, dass das Smartie Platz in der Form eines Quaders für sich beansprucht. Die Höhe eines Smarties könntest du auf 0,7 Zentimeter schätzen, sodass das Volumen V (Smartie) = 1 × 1 × 0,7 = 0,7 cm³ beträgt. Nun solltest du diesen Wert allerdings noch um die Rundungen bereinigen: 70% × 0,7 cm³ = ca. 0,5 cm³.

Um das Volumen des Smarts zu berechnen, solltest du erneut vereinfachende Annahmen treffen. Ein Smart hat in etwa folgende Maße: Länge = 2,5 m, Breite = 1,5 m, Höhe = 1,5 m. Das Volumen des Smarts: V (Smart) = 2,5 × 1,5 × 1,5 = 5,625 m³. Allerdings musst du davon noch den Platz für den Motor, die Innenausstattung, die Karosserie etc. abziehen. Du kannst davon ausgehen, dass für die Smarties ein freier Raum von ca. 3,5 m³ verbleibt. Nun solltest du beide Größen in die gleiche Einheit ausdrücken (3,5 m³ = 3.500.000 cm³) und abschließend das Volumen des Smarts durch das Volumen eines Smarties dividieren. Du erhältst ein Ergebnis von 3.500.000 ÷ 0,5 = 7.000.000 Smarties.',
 'Smartie ~0,5 cm³ (Quader 1×1×0,7 cm, bereinigt). Smart ~3,5 m³ Nutzraum = 3.500.000 cm³. 3.500.000 ÷ 0,5 = ~7.000.000 Smarties',
 3500000, 14000000, true),

-- ============================================================
-- 10. NYC Gewicht
-- ============================================================
('medium', 'real_estate', 'USA',
 'Wie schwer ist New York City?',
 'Gewicht', 'Tonnen', 'bottom-up',
 'Das Gewicht von New York lässt sich über eine Multiplikation der Fläche mit deren Dichte berechnen. Zunächst solltest du überlegen, welche Faktoren berücksichtigt werden müssen und im wahrsten Sinne des Wortes ins Gewicht fallen. Dazu zählt der Untergrund, allerdings ohne die Gebäude, die Verkehrsmittel sowie die Menschen etc. Gemeinsam mit der interviewenden Person einigst du dich darauf, dass du dich auf den Untergrund fokussierst.

Du könntest damit anfangen, die Fläche New York Citys zu schätzen: Wenn du für die Fläche New Yorks erstmal keinen Anhaltspunkt hast, könntest du zunächst die Fläche Manhattans schätzen. Manhattan von Norden nach Süden hat circa 200 Straßen. Angenommen, zwischen jeder Straße befindet sich ein Häuserblock der etwa 75 Meter lang ist, so erhältst du für die Länge Manhattans einen Wert von 15 Kilometern. Von Osten nach Westen teilt sich Manhattan in zwölf Avenues auf, zwischen denen sich jeweils 330 Meter lange Häuser befinden — Manhattan ist also vier Kilometer breit. Multipliziert man Länge mit Breite ergibt sich die Grundfläche Manhattans: 60 km². New York City besteht aus 5 Boroughs — du schätzt die Gesamtfläche NYC auf das Zehnfache Manhattans: 600 km².

Im zweiten Schritt fügst du die Tiefe hinzu. Du weißt, dass New York ein großes U-Bahn-Netz hat und schätzt gemeinsam mit der interviewenden Person die Tiefe auf 500m. Das unterirdische Volumen New Yorks: 600 km² × 0,5 km = 300 km³.

Das Gewicht wird im dritten Schritt errechnet. New York besteht größtenteils aus Granit. 1 Kubikmeter Granit wiegt ca. 3 Tonnen. Multipliziert mit dem Volumen (300 km³ = 300 × 10⁹ m³) ergibt sich ein Gewicht von circa 1.800 Mrd. Tonnen (= 1,8 × 10¹² Tonnen).',
 'Manhattan 60 km² × 10 Boroughs-Faktor = 600 km². Tiefe 500m → 300 km³ Volumen. Granit 3T/m³ → ~1.800 Mrd. Tonnen',
 900000000000, 3600000000000, true),

-- ============================================================
-- 11. Stiere Bierfest
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Wie viele Stiere braucht man, um die Besucher eines Bierfestes in Oberbayern zu füttern?',
 'Anzahl Stiere', 'Stiere', 'bottom-up',
 'Zunächst ist es wichtig, einige Nachfragen zu stellen: Was verbirgt sich hinter dem Bierfest? Wie groß ist es? Wie lange dauert ein Bierfest? Gehe in diesem Fall davon aus, dass das Bierfest lediglich einen Tag lang stattfindet und an diesem Tag während der Öffnungszeiten von 10 bis 20 Uhr durchgängig besucht ist. Die Anzahl an Stieren berechnet sich dann durch die Anzahl an Personen, subsegmentiert in verschiedene Gruppen, multipliziert mit dem Fleischkonsum in dem jeweiligen Subsegment und dividiert durch die Fleischstücke, die bei der Schlachtung eines Stiers entstehen. Nimm beispielsweise an, dass das Bierfest über den Tag verteilt ungefähr 10T Besucher hat. Um zu schätzen, wie viele Leute Fleisch vom Stier essen, solltest du die 25/50/25-Technik nutzen: ca. ein Viertel der Besucher isst kein Fleisch von Stier, 50 Prozent ein Stück Fleisch und 25 Prozent zwei Stücke Fleisch. Im Schnitt wird somit ein Stück Fleisch pro Bierfestbesucher gegessen. Das Gewicht eines Stücks Fleisch schätzt du auf ca. 250 Gramm, sodass die Besucher insgesamt 10T × 0,25 kg = 2.500 kg Stierfleisch essen. Das Schlachtgewicht eines Stiers schätzt du auf ca. 1 Tonne. Dir ist allerdings bewusst, dass ein erheblicher Teil nicht genutzt wird (Organe, Fell, Wassersammlung, Fett usw.). Du drittlest also das Gewicht auf ca. 300 kg. So erhältst du einen Wert von 2.500 kg ÷ 300 kg und damit ca. 8 benötigte Stiere.',
 '10T Besucher × Ø 1 Stück Fleisch (25/50/25) × 250g = 2.500 kg Bedarf. Schlachtgewicht 1T, nutzbar ~300kg → 2.500 ÷ 300 = ~8 Stiere',
 4, 16, true),

-- ============================================================
-- 12. Autos pro Werktag Besitzerwechsel
-- ============================================================
('medium', 'mobility', 'weltweit',
 'Wie viele Autos wechseln pro Werktag den/die Besitzer*in?',
 'Tägliche Besitzerwechsel', 'Autos/Werktag', 'top-down',
 'Das Ergebnis ergibt sich aus einer Division der Anzahl aller Autos mit der durchschnittlichen Haltedauer (WENN: Angebot = Nachfrage). Beginne mit einer Schätzung der Autos weltweit. Während in Deutschland auf 1.000 Menschen fast 500 Autos kommen, so kommt in etlichen Ländern nur ca. ein Auto auf 100 Personen. Du schätzt, dass 25% der Weltbevölkerung ein ähnlich hohes Verhältnis wie Deutschland aufweist (40%), 25% so gut wie keine Autos besitzen (0%), und 50% der Weltbevölkerung in Ländern leben, in denen 10% der Leute ein Auto besitzen. So schätzt du die Anzahl an Autos auf ca. 1 Mrd. Nun musst du schätzen, wie lange die Lebensdauer eines Autos im Durchschnitt ist. Nutze die 25/50/25-Technik: 25% der Autos haben eine Lebensdauer von ca. 8-10 Jahren, 50% von ca. 10-14 Jahren und 25% von ca. 14-16 Jahren. Ermittelst du den Durchschnitt, so erhältst du einen Wert von rund 12 Jahren. Gehe davon aus, dass ein Auto während seines Lebens 1,5-mal seinen Besitzer wechselt — so würde ein Auto ca. alle acht Jahre seinen Besitzer wechseln. In einem Jahr würden ca. (1 Milliarde ÷ 8 =) 125 Millionen Autos den Besitzer wechseln. Gehe nun von einer 6-Tage Woche aus, da explizit nach Werktagen gefragt wurde, sodass ein Wechsel an rund 200 Tagen im Jahr möglich ist. Demnach würden (125M ÷ 200 Tage =) rund 500T Autos am Tag ihren Besitzer wechseln.',
 '1 Mrd Autos weltweit ÷ 8 Jahre Ø-Haltedauer (12 Jahre × 1,5 Besitzerwechsel) = 125M Wechsel/Jahr ÷ 200 Werktage = ~500T Autos/Tag',
 250000, 1000000, true),

-- ============================================================
-- 13. Zara-Filiale Umsatz
-- ============================================================
('medium', 'retail', 'Deutschland',
 'Wie viel Umsatz macht eine durchschnittliche Zara-Filiale?',
 'Jährlicher Umsatz', '€/Jahr', 'bottom-up',
 'Du sollst den Umsatz einer Zara-Filiale in einem Jahr schätzen. Zunächst solltest du dir eine Herangehensweise überlegen: Hier kannst du dich zwischen Top-Down und Bottom-Up Vorgehensweise entscheiden. Hier sind beide sehr gut umsetzbar. Lasst uns mit dem Bottom-Up Ansatz vorgehen. Der Umsatz errechnet sich durch die Anzahl der Besucher multipliziert mit dem durchschnittlichen Kaufwert.

Die Anzahl der Besucher wird über die Anzahl an durchschnittlich geöffneten Kassen, multipliziert mit der Anzahl an durchschnittlichen Kunden pro Kasse berechnet. Ein Verkäufer braucht im Schnitt 5 Minuten für eine Bestellung — also 12 Bestellungen pro Stunde. Allerdings ist die Auslastung nicht zu jeder Zeit bei 100%. Nehmen wir an, dass der Zara Store von 10-22 Uhr geöffnet hat. Von 18-22 Uhr ist die Auslastung 90%, von 14-18 Uhr 70% und von 10-14 Uhr 50%. Die durchschnittliche Auslastung unter der Woche beträgt also 70%. Am Samstag (und gelegentlich Sonntag) steigt sie auf 75%. Eine Kasse hat also pro Stunde im Schnitt 9 Kunden (75% von 12). Das sind am Tag 108 Kunden — gerundet 110. Multipliziert mit 300 Verkaufstagen kommst du auf 33T Kunden pro Kasse pro Jahr.

Ein durchschnittlicher Zara hat 3 Abteilungen mit je 3 Kassen (im Schnitt die Hälfte geöffnet) — also 4,5 Kassen pro Tag. Ein durchschnittlicher Zara hat also ca. 150T Kunden im Jahr.

Diese Kunden kaufen mal mehr und mal weniger ein: 25% einen Einkaufswert von 20€ (T-Shirt), 50% von 50€, 25% von 80€ (z.B. Jacke). Der durchschnittliche Einkaufswert beträgt also 50 Euro. Das ergibt einen Gesamtumsatz einer durchschnittlichen Zara-Filiale von 7,5M Euro pro Jahr.',
 'Bottom-Up: 4,5 Kassen × 9 Kunden/h × 12h × 300 Tage = 150T Kunden/Jahr × Ø 50€ Einkaufswert (25/50/25) = ~7,5M €/Jahr',
 4000000, 15000000, true),

-- ============================================================
-- 14. Lufthansa Hotelnächte
-- ============================================================
('medium', 'travel', 'Deutschland',
 'Wie viele Hotelnächte muss die Lufthansa für ihr Personal buchen?',
 'Jährliche Hotelnächte', 'Übernachtungen/Jahr', 'top-down',
 'Dies berechnet sich aus der Anzahl der Übernachtungs-relevanten Flüge, multipliziert mit der Anzahl an Personal bei einem solchen Flug. Du erfährst auf Nachfrage, dass zum Personal alle Crew-Mitglieder (Piloten, Flugbegleiter usw.) zählen. Beginnen wir damit, die Anzahl an relevanten Flügen, bei denen eine Übernachtung nötig ist, zu schätzen. Gehe davon aus, dass eine Übernachtung lediglich bei Mittel- und Langstreckenflügen nötig ist und nimm an, dass die Lufthansa 25% Kurzstrecke, rund 50% Mittelstrecke und rund 25% Langstrecke fliegt. Demnach müsste die Lufthansa bei 75% ihrer Flüge Hotelnächte für ihr Personal buchen. Vielleicht weißt du, dass die Lufthansa im vergangenen Jahr rund 140 Millionen Passagiere befördert hat und ein Flugzeug eine Kapazität von rund 300 Passagieren hat. Das heißt, dass die Lufthansa in einem Jahr rund 450.000-mal geflogen ist. Wendest du für diese Zahl die 25/50/25-Technik an, so können wir annehmen, dass rund 300.000 Mittel- und Langstreckenflüge erfolgt sind. Schätze das benötigte Personal eines Fluges auf rund 10 Personen, die allesamt eine Übernachtung benötigen. Somit müsste die Lufthansa in einem Jahr ungefähr 3 Millionen Übernachtungen für ihr Personal buchen.',
 '140M Passagiere ÷ 300 Sitzplätze = 450T Flüge × 75% Mittel-/Langstrecke = 300T relevante Flüge × 10 Crew = ~3M Übernachtungen/Jahr',
 1500000, 6000000, true),

-- ============================================================
-- 15. Autoreifen pro Tag Deutschland
-- ============================================================
('medium', 'mobility', 'Deutschland',
 'Wie viele Autoreifen werden pro Tag in Deutschland verkauft?',
 'Tägliche Reifen', 'Reifen/Tag', 'top-down',
 'Auf Nachfrage hin erfährst du, dass du annehmen kannst, dass es nur eine Reifenart gibt. Das Ergebnis ergibt sich über die Anzahl der Autoreifen (Autos × 4) und deren durchschnittliche Lebensdauer (WENN: Angebot = Nachfrage). In Deutschland leben rund 80M Menschen und auf knapp zwei Menschen kommt ein Auto. Gehe davon aus, dass die Lebensdauer von Autoreifen stark von der Benutzung des Autos abhängig ist und teile die Autos in verschiedene Nutzungsgrade ein: hoch (ca. 15.000 km), mittel (10.000 km) und niedrig (ca. 5.000 km pro Jahr). Nimm an, dass Autoreifen eine Lebensdauer von rund 50.000 km haben. Im Median liegen die gefahrenen Kilometer in Deutschland mit den obigen Annahmen also bei 10.000 Kilometern. Das impliziert, dass alle fünf Jahre (50.000 ÷ 10.000) vier Reifen getauscht werden müssen. Du musst die Anzahl der Autos in Deutschland mit der Anzahl an Reifen, die pro Jahr gewechselt werden müssen, multiplizieren und dieses Ergebnis durch die Anzahl der Tage eines Jahres dividieren: 40M Autos × 4 Reifen ÷ 5 Jahre ÷ 200 Werktage = ca. 160T Reifen pro Tag.',
 '40M Autos × 4 Reifen ÷ 5 Jahre Lebensdauer (Ø 10.000 km/Jahr, 50.000 km Reifenleben) ÷ 200 Werktage = ~160T Reifen/Tag',
 80000, 320000, true),

-- ============================================================
-- 16. Teebeutel China
-- ============================================================
('medium', 'consumer', 'China',
 'Wie viele Teebeutel gibt es in China?',
 'Teebeutel-Bestand', 'Teebeutel', 'top-down',
 'Du überlegst initial, welcher Faktor es dir am ehesten erlaubt eine gute, trennscharfe Schätzung abzugeben. Deine Einschätzung: Der Teekonsum korreliert stark mit dem Alter. Damit errechnet sich das Ergebnis aus dem Teebeutelkonsum der einzelnen Bevölkerungsschichten. Dabei sollte man zunächst eine Annahme über die Gesamtbevölkerung in China treffen und diese dann in bestimmte Altersgruppen ordnen, da der Teekonsum zwischen den Altersgruppen variiert, um dann auf den Teebeutelkonsum der Altersgruppen pro Tag zu schließen.

In China leben 1,4 Milliarden Menschen. Davon sind 0,5 Milliarden zwischen 0-20 Jahre, ebenfalls 0,5 Milliarden zwischen 21-40 Jahre und 0,3 Milliarden über 40 Jahre alt. Das Land exportiert 50 Prozent seines vorhandenen Tees. Du nimmst an, dass ein Chinese über einen Teevorrat für eine ganze Woche verfügt. Ein 0-20-jähriger Chinese konsumiert 1 Teebeutel am Tag, ein 21-40 bzw. über 40-jähriger Chinese trinkt 3 Beutel am Tag.

Daraus ergibt sich ein täglicher Verbrauch von 3,2 Milliarden Teebeutel (= 0,5 × 1 + 0,5 × 3 + 0,4 × 3). Der landeseigene Wochenvorrat beläuft sich somit auf 22,4 Milliarden (= 7 × 3,2) Teebeutel. Da das Land 50% exportiert, beläuft sich der Gesamtbestand auf das Doppelte: Insgesamt besitzt China damit einen Teebeutelbestand von 44,8 Milliarden Teebeutel.',
 '1,4 Mrd. nach Alter: 0-20J (0,5 Mrd × 1) + 21-40J (0,5 × 3) + 40J+ (0,4 × 3) = 3,2 Mrd/Tag × 7 Tage = 22,4 Mrd × 2 (Export) = ~44,8 Mrd',
 22000000000, 90000000000, true),

-- ============================================================
-- 17. Friseure Berlin
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Wie viele Friseure arbeiten in Deutschlands Hauptstadt Berlin?',
 'Anzahl Friseure', 'Friseure', 'top-down',
 'Um diese Aufgabe zu lösen, sollte man zunächst eine Annahme über die Bevölkerungsgröße in Berlin treffen. Dann sollte man überlegen wie oft die durchschnittliche Person den Friseur aufsucht, wie lange ein Haarschnitt dauert und dann überlegen wie viele Friseure man bei einem durchschnittlichen Arbeitstag benötigen würde und wie oft die Friseure im Jahr geöffnet haben.

In Berlin leben rund 3,4 Millionen Menschen. Angenommen jede Person sucht durchschnittlich 8x im Jahr den Friseur auf. Dies ergibt 27 Millionen Haarschnitte pro Kalenderjahr. Angenommen alle Berliner Friseursalons sind in 50 Wochen im Jahr an sechs Tagen in der Woche geöffnet, damit insgesamt 300 Tage im Jahr. An einem Tag werden somit ca. 90.000 (= 27 Millionen / 300) Haarschnitte durchgeführt. Wenn ein Berliner Friseur durchschnittlich acht Stunden am Tag arbeitet und für einen Haarschnitt etwa 45 Minuten braucht, dann schafft ein Friseur 10 Haarschnitte am Tag. Folglich sollten rund 9.000 (= 90.000 / 10) Friseure in Berlin arbeiten.

Sanity Check: In Deutschland gibt es insgesamt ca. 140.000 beschäftigte Friseure, damit wären 6,4% der Friseure in Berlin. Plausibel da Berlin als Großstadt mehr Friseure pro Einwohner hat.',
 '3,4M Einwohner × 8 Haarschnitte/Jahr = 27M Schnitte/Jahr ÷ 300 Öffnungstage = 90.000/Tag ÷ 10 Schnitte/Friseur/Tag = ~9.000 Friseure',
 4500, 18000, true),

-- ============================================================
-- 18. Wegwerfwindeln China
-- ============================================================
('medium', 'consumer', 'China',
 'Wie groß ist der Markt für Wegwerfwindeln in China?',
 'Anzahl Kinder mit Bedarf', 'Kinder', 'top-down',
 'Auf Nachfrage hin erfährst du, dass es um die Größe der Zielgruppe geht (Volumen). Zunächst sollte man eine Annahme über die Anzahl an Kindern treffen und dann überlegen wie viele von diesen Kindern Windeln benötigen. In China leben 1,4 Milliarden Menschen. Als nächstes schätzt du, dass 2/3 der Chinesen in einem gebärfähigen Alter sind, also 0,9 Milliarden Männer und Frauen. Eine Familie mit Kind besteht zumeist aus einem Mann und einer Frau, die beiden gebärfähig sind. Dabei nimmst du an, dass 2/3 der Familien Kinder besitzt, also 300 Millionen Familien. Da es in China eine Geburtenkontrolle gibt, besitzt jede Familie im Durchschnitt 1,5 Kinder. Schließlich triffst du die Annahme, dass 10 Prozent aller chinesischen Kinder Wegwerfwindeln benötigen (nur im 1. und 2. Lebensjahr). Multipliziert man diese Annahmen (= 300 Millionen × 1,5 × 1/10) erhält man 45 Millionen.',
 '1,4 Mrd. × 2/3 gebärfähig = 0,9 Mrd. → ÷ 2 = 450M Familien × 2/3 mit Kindern = 300M × 1,5 Kinder × 10% = ~45M',
 22000000, 90000000, true),

-- ============================================================
-- 19. Golfbälle in Schulbus
-- ============================================================
('medium', 'consumer', 'weltweit',
 'Wie viele Golfbälle passen in einen Schulbus?',
 'Anzahl Golfbälle', 'Golfbälle', 'bottom-up',
 'Am besten startet man die Fragen mit genaueren Präzisionen und sollte klarstellen, was für einen Bus es sich handelt (z.B. einstöckig oder zweistöckig). Das Ergebnis ergibt sich aus dem Volumen des Bus geteilt durch das Volumen eines Golfballes. Du triffst als Erstes Annahmen über den Bus. Wenn dieser 10 Meter lang, 2 Meter hoch und 3 Meter breit ist, entspricht dies einem Volumen von 60 Kubikmetern. Jedoch sollte man noch etwas Volumen für Stangen, Sitze usw. abziehen (60 Kubikmeter × 10 Prozent = 54 Kubikmeter). Danach triffst du Annahmen über die Golfbälle. Wenn der Golfball einen Durchmesser von 4 cm hat, so hat dieser ca. 33 Kubikzentimeter an Volumen. Möchte man den Bus mit 54 Kubikmetern mit 33 Kubikzentimeter Golfbällen füllen, ergibt sich eine Anzahl von 1.636.363 Golfbällen. Jedoch sollte man noch berücksichtigen, dass diese durch ihre Rundung nur eine ca. 75-prozentige Fülleffizienz besitzen. Also ergibt sich eine Anzahl von 1.227.272 Golfbällen.',
 'Bus: 10m × 2m × 3m = 60 m³ × 90% Nutzraum = 54 m³. Golfball Ø 4cm → ~33 cm³. 54 m³ ÷ 33 cm³ × 75% Fülleffizienz = ~1,2M Golfbälle',
 600000, 2400000, true),

-- ============================================================
-- 20. Pizza USA Quadratmeter
-- ============================================================
('medium', 'consumer', 'USA',
 'Wie viele Quadratmeter Pizza essen die US-Amerikaner innerhalb eines Monats?',
 'Quadratmeter Pizza/Monat', 'm²/Monat', 'top-down',
 'Das Ergebnis berechnet sich aus der Anzahl von Amerikanern, die Pizza essen, mit der Anzahl an verzehrten Pizzen pro Monat und der Größe der Pizzen. Als erstes nimmst du an, dass von den 320 Millionen US-Amerikanern 2/3 gerne Pizza mögen. Dabei handelt es sich also ca. 210 Millionen „Pizza-Esser".

Wenn du annimmst, dass die Pizza-Esser sich in eine Normalverteilung nach deren Konsum einteilen lassen, dann nutze 25/50/25. Die 25% mit dem höchsten Konsum essen jede Woche eine ganze Pizza, die Personen mit einem durchschnittlichen Konsum vielleicht einmal alle drei Wochen und Personen, die besonders auf ihre Gesundheit achten, essen vielleicht alle 8 Wochen eine Pizza. Dadurch ergibt sich ein durchschnittlicher Konsum von Pizza alle 3,75 Wochen. Ein Monat hat circa 4,5 Wochen. Du kommst also darauf, dass circa 1,2 Pizzen je Monat je Person gegessen werden.

Als nächstes gilt es die Größe einer durchschnittlichen Pizza zu schätzen. Eine Pizza hat zumeist einen Durchmesser von ca. 28 cm. Damit ergibt sich eine Fläche von circa 600 Quadratzentimeter. Hochgerechnet konsumieren alle US-Amerikaner zusammen circa 15 Millionen ((600 / 10.000) × 1,2 × 210.000.000) Quadratmeter Pizza pro Monat.',
 '320M × 2/3 Pizza-Esser = 210M × 1,2 Pizzen/Monat (25/50/25) × 600 cm² (Ø 28cm) ÷ 10.000 = ~15M m²',
 7500000, 30000000, true),

-- ============================================================
-- 21. Geld auf Boden Einkaufszentrum
-- ============================================================
('medium', 'retail', 'Deutschland',
 'Wie viel Geld liegt in einem durchschnittlichen Einkaufszentrum am Ende des Tages auf dem Boden?',
 'Geld auf Boden', '€', 'bottom-up',
 'Zu Beginn solltest du verstehen, was unter einem durchschnittlichen Einkaufszentrum verstanden wird. Dabei erfährst du, dass es schon eher um wirklich große Einkaufszentren geht. Auch der Wochentag ist entscheidend für das Endergebnis. Du erfährst auf Nachfrage, dass du annehmen sollst, dass circa 20.000 Personen am Wochenende in dem Einkaufszentrum sind. Das Ergebnis berechnet sich hierbei aus der Anzahl an Kunden, die Geld verlieren, minus der Anzahl an Geld, das aufgehoben wird. Du nimmst an, dass ein Prozent der Besucher Geld verliert und glaubst, dass dies durchschnittlich 50 Cent sind. Das ergibt 200 Personen, die Geld verlieren, mit einer Gesamtsumme von 100 Euro. Des Weiteren nimmst du an, dass die Hälfte dieses Geldes von anderen Besuchern gefunden und aufgehoben wird. Letztendlich liegen damit am Abend durchschnittlich 50 Euro auf dem Boden des Einkaufszentrums.',
 '20.000 Besucher × 1% verlieren Geld = 200 Personen × Ø 0,50€ = 100€ Gesamtverlust × 50% nicht aufgehoben = ~50 Euro',
 25, 100, true),

-- ============================================================
-- 22. Klavierstimmer Hamburg
-- ============================================================
('medium', 'consumer', 'Deutschland',
 'Wie viele Klavierstimmer arbeiten in der Stadt Hamburg?',
 'Anzahl Klavierstimmer', 'Klavierstimmer', 'top-down',
 'Die Anzahl der Klavierstimmer bestimmt sich durch eine Multiplikation der Klaviere in Hamburg mit den Stunden an Wartung pro Jahr pro Klavier geteilt durch die effektive Arbeitszeit eines Klavierstimmers (WENN: Nachfrage = Angebot). Um die Anzahl der Klaviere zu bestimmen, nimmst du als erstes an, dass 1,7 Millionen Menschen in Hamburg leben und davon nach deiner Annahme zwei jeweils in einem Haushalt.

Du nimmst an, dass circa 20% der Menschen ein Instrument spielen. Du schätzt, dass 30% der Personen, die ein Instrument spielen, auch Klavier spielen. Du nimmst an, dass 80% auch wirklich ein Klavier besitzen. Insgesamt besitzen also ca. 5% der Hamburger ein Klavier. Das macht circa 85.000 Klaviere in Hamburg.

Ein Klavier muss circa einmal im Jahr gestimmt werden und das dauert circa eine Stunde. Daraus ergeben sich 85.000 Stunden Aufwand pro Jahr. Da Hamburg eine Großstadt mit viel Verkehr ist, nimmst du an, dass die An- und Abreise nochmal eine Stunde benötigt. Der Aufwand steigt also auf 170.000 Stunden pro Jahr. Angenommen ein Hamburger Klavierstimmer arbeitet 8 Stunden am Tag, 5 Tage pro Woche und 50 Wochen im Jahr — das sind 2.000 Stunden pro Jahr. Damit werden in Hamburg 85 Klavierstimmer benötigt.',
 '1,7M Einwohner ÷ 2 = 850T Haushalte × 5% Klavierbesitzer (20% Instrument × 30% Klavier × 80% Eigenbesitz) = 85.000 Klaviere × 2h/Jahr ÷ 2.000h Jahresarbeitszeit = ~85 Stimmer',
 40, 170, true);
