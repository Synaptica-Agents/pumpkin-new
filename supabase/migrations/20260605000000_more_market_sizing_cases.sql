-- ============================================================
-- Add 9 more market_sizing_cases (append-only, active = true)
-- Source: Market-Sizing.docx (classic Fermi market sizings
-- not yet imported by 20260508064725_curate_market_sizing_cases.sql)
-- Active total after this migration: 22 + 9 = 31
-- ============================================================

INSERT INTO public.market_sizing_cases (
  difficulty, industry_tag, region, prompt, target_metric,
  unit_hint, allowed_methods, reference_structure, key_assumptions_examples,
  expected_order_of_magnitude_min, expected_order_of_magnitude_max, active
) VALUES
('hard', 'consumer', 'USA',
  'Wie groß ist der Markt für Glühbirnen in privaten Immobilien in den USA?',
  'Jährlicher Absatz Glühbirnen', 'Stück/Jahr', 'top-down,bottom-up',
  'Auf Nachfrage hin, spezifiziert die interviewende Person, dass es um den Absatz in dem Markt geht. Diese Aufgabe löst du am besten, indem wie folgt vorgehst: Bestimme zunächst die Anzahl der Glühbirnen, die jedes Jahr für bestehende Häuser gekauft werden, dann die Anzahl an Glühbirnen, die jedes Jahr für neue Häuser gekauft werden einschätzen. Danach addierst du diese beiden Wert zu der Anzahl an verkauften Glühbirnen pro Jahr in den USA.

Du weißt, dass es in den USA circa 100 Millionen Haushalte gibt. Es gibt zwar einige wenige Haushalte, die auch mehr als ein Haus haben, diesen Faktor hältst du allerdings für nicht relevant genug (dennoch kommunizieren). Es gibt also auch 100 Millionen Häuser/Wohnungen. In einem durchschnittlichen Haus leben circa 3 Personen. Du nimmst also ein durchschnittliches Haus/Wohnung für 3 Personen an. Das durchschnittliche Haus hat 2 bis 3 Schlafzimmer, eine Küche, ein Wohnzimmer, ein sonstiges Zimmer und 2 Badezimmer. Das sind also 8 Zimmer, die jeweils über mehrere Glühbirnen verfügen. Die Anzahl von Glühbirnen unterscheidet sich nach deiner Erfahrung zwischen verschiedenen Räumen. Besonders viel genutzt und größere Räume haben zumeist mehr Glühbirnen. Du nimmst an, dass in den Schlafzimmern jeweils drei Glühbirnen genutzt werden, in der Küche ebenfalls zwei, im Wohnzimmer vier, im sonstigen Raum drei und in den Badezimmern ebenfalls jeweils zwei. Das macht insgesamt 22 Glühbirnen in einem durchschnittlichen Haus.

Dir ist allerdings klar, dass es deutlich größere Häuser gibt, die den Schnitt nochmal deutlich beeinflussen. Du addierst also pauschal 15% drauf. So kommst du auf circa 25 Glühbirnen pro Haushalt. Insgesamt gibt es also 2.500 Millionen Glühbirnen in den bestehenden Haushalten. Jetzt fehlt noch die jährliche Anzahl der gekauften Glühbirnen. Dabei nehmen wir an, dass die Lebensdauer einer Glühbirne fünf Jahre beträgt. Damit werden je Jahr 500 Millionen Glühbirnen gekauft.

Als zweiten Schritt berechnet man die Anzahl der Glühbirnen, die jedes Jahr für neu gebaute Häuser gekauft werden. Wenn die Anzahl der Häuser in den USA nicht wachsen würde, würde die Gesamtzahl der jährlich gekauften Glühbirnen 700 Millionen betragen. Aber jedes Jahr werden zusätzlich neue Häuser gebaut und die Gesamtmarktgröße wächst daher. Dabei nimmst du an, dass die US-Bevölkerung um 1% pro Jahr wächst und gleiches nimmst du der Einfachheit halber für die Wohnhäuser an. 1% von 100 Millionen sind 1 Millionen Häuser. Es gibt pro Haus 25 Glühbirnen. Dies macht 25 Millionen weitere Glühbirnen.

Insgesamt kommst du so auf 525 Millionen Glühbirnen, die pro Jahr gekauft werden.',
  '100M Haushalte × ~25 Glühbirnen = 2.500M Bestand ÷ 5 Jahre Lebensdauer = 500M + 25M Neubau (1% Wachstum) → ~525M Stück/Jahr',
  262500000, 1050000000, true),

('hard', 'retail', 'Deutschland',
  'Wie groß ist der Markt für Laufschuhe in Deutschland?',
  'Jährlicher Umsatz', '€/Jahr', 'bottom-up',
  'Auf Nachfrage hin, spezifiziert die interviewende Person, dass es um den Umsatz in dem Markt geht. Du gehst wie folgt vor: 1) Arten von Läufern und deren Anteile an der Bevölkerung 2) Anzahl Laufschuhe je Art von Läufern 3) Häufigkeit des Neukaufs je Art von Läufern 4) Investment je Art von Läufern.

In Deutschland leben 80 Millionen Menschen. Einfachheitshalber nimmst du an, dass die Altersklassen in Deutschland gleichmäßig verteilt sind. Die Altersklassen der 0-10-jährigen kannst du dabei ausschließen, weil in dieser Altersklasse noch kaum Laufen als Freizeitsport betrieben wird. Außerdem kannst du die 65-85-Jährigen ausschließen, da die meisten Menschen in diesem Altem keine neuen Laufschuhe mehr zulegen oder gar nicht mehr aktiv laufen. Somit bleibt als potenzielle Zielgruppe die Altersklasse der 11- bis 64-Jährigen. Die potentielle Zielgruppe hat damit eine Größe von 55 Millionen Menschen. Die Zielgruppe lässt sich noch weiter aufteilen. Du nimmst an, dass es Personen gibt, die gar nicht laufen, sowie Gelegenheitsläufer, Freizeitläufer und Wettkampfläufer.

Du weißt, dass Laufen die meist ausgeführte Sportart in Deutschland ist und weißt, dass circa 6,5 Millionen Menschen Fußball in einem Verein spielen. Du gehst davon, dass das ungefähr viermal so viele Leute Laufen nachgehen (darunter natürlich auch zahlreiche Fußballer). Von den übriggebliebenen 26 Millionen, sind 60% Gelegenheitsläufer (unregelmäßiges Laufen alle paar Wochen), 30% Freizeitläufer (regelmäßiges Laufen mit einem klaren Plan) und 10% Wettkampfläufer (Teilnahme an Marathons oder anderen Veranstaltungen). Es gibt also circa 15 Millionen Gelegenheitsläufer, 10 Millionen Freizeitläufer und ca. 2,5 Millionen Wettkampfläufer (auf Rundung hinweisen). Zudem solltest du annehmen, dass Läufer ungern bereits getragene Schuhe wollen, weswegen der Gebrauchtmarkt zu vernachlässigen ist. Einen guten Markenschuh bekommt man im Fachgeschäft ab 80 Euro. Bei Gelegenheitsläufern kann man davon ausgehen, dass sie häufiger zu den günstigeren Modellen ausweichen. In diesem Fall gehst du von einem Kauf von 50 Euro alle 5 Jahre aus. Bei Freizeitläufern nimmst du an, dass sie alle 2 Jahre einen Schuh für 80 Euro kaufen und bei Wettkampfsportlern ein paar Laufschuhe jedes Jahr für 100 Euro.

Als nächsten Schritt kann die Anzahl der verkauften Schuhe und der Händlerumsatz ermittelt werden. Dabei ergibt sich folgende Rechnung für die Anzahl der Schuhe:

Gelegenheitsläufer: 15 Millionen x 50 Euro / 5 Jahre = 150 Millionen Euro / Jahr

Freizeitläufer: 10 Millionen x 80 Euro / 2 Jahre = 400 Millionen Euro / Jahr

Wettkampfläufer: 2,5 Millionen x 100 Euro / 1 Jahre = 250 Millionen Euro / Jahr

Insgesamt beträgt das Marktvolumen also 800 Millionen Euro.',
  'Zielgruppe 11-64J = 55M → 26M Läufer: 15M Gelegenheit (50€/5J) + 10M Freizeit (80€/2J) + 2,5M Wettkampf (100€/1J) = 150M + 400M + 250M → ~800M €',
  400000000, 1600000000, true),

('hard', 'manufacturing', 'weltweit',
  'Wie schwer ist die benötigte Lackmenge für die Lackierung eines Airbus A380?',
  'Lackgewicht', 'kg', 'bottom-up',
  'Zunächst einmal kannst du klarstellen, dass das Gewicht eines Stoffes das Produkt von Volumen und Dichte ist. Das Volumen einer Schicht ist wiederum das Ergebnis aus Fläche mal Höhe. Damit sind die zu lackierende Fläche, die Dicke der Schicht und die Lackdichte in dieser Reihenfolge zu berechnen. Der Einfachheit halber gehst du nur, davon aus, dass es keine mehrschichtige Lackierung gibt. Bei der Berechnung der zu lackierenden Fläche solltest du segmentweise vorgehen. Dabei ist eine Aufteilung in Rumpf, Seitenflügel, Turbinen und Heckflügel eine schlüssige Variante. Der Rumpf hat die Form eines Zylinders, an den an beiden Enden Kegelförmige Enden aufgesetzt sind. Der Durchmesser des Zylinders lässt sich über die Anzahl der Sitze und Gänge in einer Reihe feststellen. Bei 10 Sesseln und 2 Gängen und einer geschätzten Breite von Sesseln und Gängen von je 60 Zentimetern sowie 15 Zentimetern Außenwanddicke kommt man auf 7,5 Meter Durchmesser. Die Länge des Rumpfes ist ebenso über die Anzahl der Reihen zu berechnen, die in etwa je 90 Zentimeter lang sind. Dabei kannst du dich auf die Maße eines Durchschnittsmenschen beziehen. Geht man von 60 Sitzreihen aus, kommt man auf 54 Meter Rumpflänge. Diese multipliziert mit dem Umfang ergibt die Außenoberfläche des Rumpfes, welche ca. 1350 Quadratmetern entspricht. Wenn du nun Fenster und andere Applikationen abziehst, kommst du auf 1.300 Quadratmetern.

Nachdem du schon 54 Meter Rumpflänge errechnet hast kannst du nun festhalten, dass der Kegel vorne rund 10 Meter und der hintere der Einfachheit halber 16 Meter lang ist, damit kommst du auf 80 Meter Gesamtlänge. Die Seitenflügel können als rechtwinklige Dreiecke angesehen werden, wobei bei geschätzten 9 Metern Breite und je Flügel rund 35 Metern Länge und beidseitiger Lackierung jeweils 315 Quadratmeter zu Buche schlagen. Man kann vereinfacht davon ausgehen, dass die vier Turbinen (4 Meter Durchmesser, 5 Meter Länge) nur außen lackiert sind. Ihre Gesamtfläche ergibt 250 Quadratmeter. Die drei Heckflüge werden als gleich groß und rechtwinklig angenommen, mit 15 Metern Länge und 5 Metern Breite. Daraus ergibt sich eine Fläche von insgesamt 225 Quadratmetern. Als Zwischenergebnis erhalten wir circa 2.400 Quadratmeter (1.300 + 315 x 2 + 250 + 225). Als nächstes beziehst du dich auf die Lackdichte. Deshalb gehst du von 0,4 Millimetern aus. Die Oberfläche multipliziert mit der Dicke ergibt das Lackvolumen 1 Kubikmeter. Um eine Annahme zu treffen, wie dick der Lack ist kannst du dich auf Wasser beziehen, welches bei 1000 Kg auf 100 Liter ein Kubikmeter wiegt. Es gibt verschiedene Grundstoffe für Lack, aber man könnte argumentieren, dass ölhaltiger Lack genauso wie Öl auf Wasser schwimmt, was bedeutet, dass er leichter ist. In diesem Fall nimmst du also an, dass der Lack eine Dichte von 0,9 Tonnen pro Kubikmeter hat. Insgesamt ergeben sich somit 900 Kilogramm Lack für den Airbus, wenn er perfekt lackiert wird.',
  'Fläche ~2.400 m² (Rumpf 1.300 + Flügel 630 + Turbinen 250 + Heck 225) × 0,4mm Schichtdicke = ~1 m³ × 0,9 t/m³ → ~900 kg',
  450, 1800, true),

('medium', 'consumer', 'USA',
  'Wie viele Golfbälle werden jedes Jahr in den USA verkauft?',
  'Jährlich verkaufte Golfbälle', 'Stück/Jahr', 'top-down',
  'Das Ergebnis berechnet sich durch die Anzahl an Golfspieler multipliziert mit der Anzahl an Golfbälle je Spieler (Nachfrage = Angebot). In den USA leben 320 Millionen Menschen. Golf wird vor allem in gewissen Altersgruppen gespielt, die auch ein gewisses Vermögen aufweisen und sich zusätzlich für den Sport interessieren müssen.

Golf wird vor allem von Menschen von 25-65 Jahren Golf gespielt. Es wird auch vereinzelt Kinder, Jugendliche und junge Erwachsene geben, der Einfachhalt halber werden sie hier jedoch ausgeschlossen. Das Alter ist nach oben begrenzt, da die Mehrheit der Menschen ab einem bestimmten Alter körperlich nicht mehr in der Lage ist Golf zu spielen. Dabei dürfte es sich bei einer angenommenen Gleichverteilung um 60 Prozent der US-Bevölkerung handeln (320 Millionen x 0,6 = 192 Millionen). Golf ist ein teurer Sport die Ausrüstung alleine kann schnell über tausend Euro kosten, auch Club-Mitgliedschaften sind verhältnismäßig teuer usw.. Damit ordnest du Golf als Sportart für die Top-10% der Vermögenden in den USA ein. Dies begrenzt die potentielle Zielgruppe auf circa 20 Millionen Personen. Du gehst davon aus, dass circa 20% dieser Personen Golf auch als relevante Sportart für sich sehen, da natürlich noch viele weitere relevante Sportarten existieren und du zwar glaubst, dass Golf in dieser Demographie beliebt ist, es aber mit Tennis, Basketball, Laufen, Fitnessstudio usw. viele andere Möglichkeiten gibt.

Nun geht es darum, die benötigten Bälle pro Jahr zu ermitteln. Dazu ermittelst du die Anzahl der Sessions pro Jahr, die Golf gespielt werden und multiplizierst dies mit der Anzahl von Bällen pro Session. Die Personen, die nun noch übrig sind, spielen vermutlich auch regelmäßig Golf, du gehst deshalb von einem Schnitt von einmal pro Woche in der aktiven Saison aus (Golf wird im Winter nicht gespielt). Die Saison im Golf ist dann, wenn es auch angenehm ist, die Zeit draußen zu verbringen. Du gehst von einer Saison von Mitte April bis Mitte Oktober aus. Das sind 6 von 12 Monate im Jahr. Beim Golf spielen gehen regelmäßig Bälle verloren, du gehst davon aus, dass eigentlich jedes Mal mindestens ein Ball verloren geht. Damit kommst du auf 26 Golfbälle pro Jahr.

Die Gesamtzahl an Golfbällen, die pro Jahr verkauft werden, beträgt also 104 Millionen pro Jahr.',
  '320M × 60% (25-65J) = 192M × 10% vermögend = 20M × 20% Golfer = 4M Spieler × 26 Bälle/Jahr (1×/Woche, 6 Monate Saison) → ~104M Stück',
  52000000, 200000000, true),

('medium', 'mobility', 'USA',
  'Wie viele Tankstellen gibt es in Kalifornien?',
  'Anzahl Tankstellen', 'Stück', 'top-down',
  'Auch hier nimmst du an, dass das Angebot der Nachfrage entspricht. Zunächst solltest du deshalb eine Annahme über die Bevölkerung Kaliforniens und damit auf die Anzahl von Autos in Kalifornien treffen. Danach kannst mit Hilfe der Tankfüllungen pro Woche und der Auslastung auf die benötigte Anzahl an Tankstellen schließen. Konkret entspricht also die Anzahl an Tankstellen, der Anzahl der Autos multipliziert mit der Häufigkeit an Tankvorgängen multipliziert mit der Dauer eines Tankvorgangs (inkl. Warten) geteilt durch die Öffnungszeiten je Woche multipliziert mit der Anzahl an Zapfhähnen.

Beginnen wir mit der Anzahl an Autos. In Kalifornien leben ca. 40 Millionen Menschen. Du triffst die Annahme, dass wie in Deutschland auch auf zwei Personen circa ein Auto kommt. Das macht dann eine Anzahl von 20 Millionen Autos. Diese müssen im Schnitt einmal pro Woche getankt werden, da die Leute durchschnittliche ihre Tankfüllung von 40 bis 60 Liter in der Zeit verbrauchen. Davon gehst du aus, da manche Menschen jeden Tag große Entfernungen zurücklegen und andere nur gelegentlich ihr Auto benutzen. Wenn man für den durchschnittlichen Tankvorgang 5 Minuten benötigt und eine Tankstelle im Schnitt über vier Zapfsäulen verfügt könnten dort pro Tag ca. 1.200 Autos (24 Stunden x 60 Minuten x 4 / 5 Minuten) tanken. Da die Auslastung jedoch nur zu Stoßzeiten Hundert Prozent beträgt und Nacht teilweise bei Null liegt, kann man im Schnitt von einer 50% prozentigen Auslastung ausgehen (1.200 x 50% x 7 Tage= 4.200 Autos pro Woche). Wenn man dann die Anzahl der Autos, die einmal pro Woche tanken müssen auf die Anzahl der Autos, die an einer durchschnittlichen Tankstelle tanken verrechnet erhält man die Anzahl der Tankstellen von circa 2400 Tankstellen (20 Millionen Autos / 4.200 Autos pro Woche). Es gibt in Kalifornien ca. 5.000 Tankstellen.',
  '40M Einwohner ÷ 2 = 20M Autos × 1 Tankvorgang/Woche ÷ Kapazität (4 Zapfsäulen × 50% Auslastung = 4.200 Autos/Woche je Tankstelle) → ~2.400-5.000 Tankstellen',
  2000, 10000, true),

('medium', 'education', 'Deutschland',
  'Wie viele Schulen gibt es in Berlin?',
  'Anzahl Schulen', 'Stück', 'top-down',
  'Als nächstes solltest du klären, welche Schulen denn gesucht sind. Du erfährst, dass in diesem Fall Berufsschulen, Gymnasien, Realschulen usw. alle gemeint sind. Die Anzahl der Schulen ergeben sich durch die Anzahl an Schülern (durch Alter bestimmen) geteilt durch die Anzahl von Schüler je Schule.

In Berlin leben ca. 3,7 Millionen Menschen. Um diese Frage zu beantworten solltest du erst eine Annahme über alle schulpflichtigen Kinder treffen. Kinder sind über 12 Jahre schulpflichtig, das heißt bis sie 18 Jahre sind, allerdings kann man auch an eine Berufsschule wechseln, dann braucht man allerdings auch ähnlich lange. Die Schule beginnt mit 6 Jahren. Kinder im Schul-Alter machen also bei einer gleichmäßigen Verteilung der Altersgruppen damit dann circa 16% (13/80) aus. Es gibt also 600.000 Schüler in Berlin.

Schließlich triffst du eine Annahme über die durchschnittliche Größe einer Berliner Schule. Da weiterführende Schulen oft große Jahrgänge haben, sind dort oft mehr als 1000 Schüler, während Grundschulen oft kleiner sind und nur 500 Schüler aufweisen. Also kann man im Schnitt von 800 Schülern pro Schule ausgehen (da an weiterführenden Schulen deutlich mehr Schüler sind).

Wenn man die Anzahl der Schüler jetzt durch die Anzahl von Schulpflichtigen Kindern teil (600.000 Schüler / 800 = 750), erhält man 750 Schulen.',
  '3,7M Einwohner × ~16% im Schulalter (6-18J) = 600.000 Schüler ÷ Ø 800 Schüler/Schule → ~750 Schulen',
  375, 1500, true),

('medium', 'consumer', 'Deutschland',
  'Wie viele iPhones werden pro Jahr in Deutschland verkauft?',
  'Jährlich verkaufte iPhones', 'Stück/Jahr', 'top-down',
  'Auf Nachfrage findest du heraus, dass es nur um neue iPhones geht und du gebrauchte Verkäufe ignorieren kannst.

Die Anzahl der iPhones berechnest du durch 1) die Bevölkerung in Deutschland 2) relevante Altersgruppen 3) Anteil Smartphone-Besitzer 4) Nutzungsdauer 5) Anteil neuer Smartphones 6) Anteil iPhones.

In Deutschland leben ca. 80 Millionen Menschen. Also triffst du die Annahme, dass Smartphone-Nutzende zwischen 10 und 70 Jahren alt sind. Das trifft auf 75 Prozent der deutschen Bevölkerung zu (80 Millionen x 75 Prozent = 60 Millionen). Als nächstes triffst du die Annahme, dass innerhalb dieser Altersgruppe 80 Prozent ein Smartphone besitzen. Der Grund dafür ist, dass 100 Prozent der Jugendlichen ein Smartphone nutzen, die Nutzung aber mit steigendem Alter abnimmt. Das macht eine Bevölkerungsgruppe von 48 Millionen Menschen.

Da Deutschland ein Industrieland ist und der Wohlstand relativ hoch ist, kaufen sich die Menschen im Schnitt alle zwei Jahre ein neues Smartphone. Das macht jedes Jahr 24 Millionen Smartphones. Davon werden allerdings circa 1/3 gebraucht gekauft. Es werden also 16 Millionen neue Smartphones verkauft.

Bei dem iPhone handelt es sich um ein Oberklassen Smartphone, weshalb die Anzahl potenzieller Kunden begrenzt ist. Da du jedoch weißt, dass Apple trotzdem die meisten Handys weltweit verkauft. Du schätzt du den Marktanteil auf 25 Prozent. Das macht dann einen iPhone Absatz von 4 Millionen pro Jahr (16 Millionen Smartphones x 25 Prozent Marktanteil).',
  '80M × 75% (10-70J) = 60M × 80% Smartphone = 48M ÷ 2 Jahre Nutzung = 24M × 2/3 neu = 16M × 25% Apple-Marktanteil → ~4M iPhones/Jahr',
  2000000, 8000000, true),

('hard', 'retail', 'Großbritannien',
  'Wie viele gebrauchte Brautkleider werden in Großbritannien pro Jahr verkauft?',
  'Jährlich verkaufte gebrauchte Brautkleider', 'Stück/Jahr', 'top-down',
  'Die Anzahl der verkauften Brautkleider ergibt sich durch 1) Anzahl Frauen, die heiraten 2) Anteil, die ihr Brautkleid verkaufen (WENN: Angebot = Nachfrage) 3) Jahre über die das Brautkleid verkauft wird.

Diese Frage beantwortest du am besten, indem du zunächst Annahmen über die Anzahl an Frauen, die heiraten triffst und dann über die Anzahl derjenigen die ein gebrauchtes Brautkleid verwenden. In Großbritannien leben ca. 60 Millionen Menschen. 50 Prozent der Bevölkerung besteht aus Frauen und Frauen im hairatsfähigen Alter sind zwischen 20 und 60 Jahren alt. Minderjährige Hochzeiten gibt es nur in Ausnahmefällen und im Alter heiraten die Menschen meist auch nicht mehr. Also triffst du die Annahme, dass von den 30 Millionen Frauen 40 Prozent in dem üblichen Alter für eine Hochzeit von 20 bis 50 Jahre sind. Das macht dann eine Anzahl von 12 Millionen Frauen. Innerhalb dieser Altersgruppe heiraten 50 Prozent der Frauen (12 Millionen x 50 Prozent = 6 Millionen) irgendwann (passende Person muss gefunden werden und Heirat muss gewollt sein). Von den Frauen, die geheiratet haben lassen sich wiederum 50 Prozent scheiden (6 Millionen x 50 Prozent = 3 Millionen) (deutlich am Steigen, in deinem Umfeld kennst du so viele mit geschiedenen Eltern, wie mit nicht-geschiedenen Eltern) und verkaufen auf Grund dessen ihr Kleid. Von den Frauen, die sich nicht scheiden lassen, verkaufen 10 Prozent ihr Hochzeitskleid (6 Millionen x 10 Prozent = 0,6 Millionen Hochzeitskleider) (Du kennst kaum Frauen, die das machen würden, da es ja ein wichtiges Erinnerungsstück ist). Das macht eine Anzahl von 3,6 Millionen Brautkleidern, die Frauen im Laufe ihres Lebens verkaufen. Jetzt dividierst du noch die Anzahl an Kleidern durch die Anzahl der Jahre, die Frauen durchschnittlich nach der Hochzeit noch leben (3,6 Millionen / 50 Jahre (die meisten heiraten das erste Mal zwischen 20 und 40 Jahre, Lebenserwartung = 80) = 72.000 Kleider). Es werden in Großbritannien pro Jahr 72.000 gebrauchte Brautkleider verkauft.',
  '60M × 50% Frauen × 40% (20-50J) = 12M × 50% heiraten = 6M → 50% Scheidung verkaufen (3M) + 10% übrige (0,6M) = 3,6M ÷ 50 Jahre → ~72.000 Kleider/Jahr',
  36000, 144000, true),

('medium', 'consumer', 'USA',
  'Wie viele Menschen tragen heute in New York City ein rotes T-Shirt?',
  'Anzahl Personen mit rotem T-Shirt', 'Personen', 'top-down',
  'Vielleicht klärst du nochmal das Verständnis von New York vs. New York City ab und was noch unter rotes T-Shirt fällt (gestreift auch?) abklären. Außerdem erfährst du, dass die genaue Zeit 16 Uhr an einem Freitag ist (entscheidend für Kleidungswahl). Die Frage beantwortest du, indem du die Anzahl der Personen, die in New York sind, bestimmst, mit der Prozentzahl der Bevölkerung, die ein T-Shirt trägt, multiplizierst und diese Zahl erneut mit dem Prozentanteil multiplizierst, deren T-Shirt rot ist. Als erstes triffst du die Annahme, dass ca. 10 Millionen Menschen in New York City leben. Außerdem rechnest du noch mit circa 20% Aufschlag an Touristen und (geschäftlichen) Besuchern. Insgesamt sind also 12 Millionen Menschen in New York City.

Diese 12 Millionen Menschen lassen sich in Gruppen unterteilen. Du vermutest, dass 70 Prozent noch arbeiten oder auf dem Weg nach Hause sind und 30 Prozent entweder Touristen sind oder nicht mehr arbeiten. Bei den Arbeitenden werden wahrscheinlich nur 5 Prozent ein T-Shirt tragen, da es oft vorschrieben Kleidungsnormen gibt und selbst Kleidung von Firmen (z.B. im Starbucks oder McDonalds) eigentlich nie rot sind. Bei den nicht-arbeitenden nimmst du an, dass 50% ein T-Shirt tragen (vor allem Touristen, Einheimische tragen vermutlich in der Freizeit auch eher ein Polo oder ein Hemd). Als Rechnung (0,7 x 0,05 + 0,3 x 0,5 = 0,185) ergibt das, dass 18,5 Prozent der Menschen derzeit ein T-Shirt in NYC tragen (du rundest auf 20% und merkst an, dass du das Ergebnis um circa 5% nach oben anpasst).

Als nächstes solltest du darüber eine Annahme treffen, wie viele dieser T-Shirts rot sind. Dabei triffst du die Annahme, dass 10 Prozent dieser T-Shirts rot sind. Darauf schließt du, weil es für T-Shirt Farbkategorien wie Rot, Blau, Grün, Schwarz, Weiß usw. gibt und davon auf jeden Fall andere Farben (Weiß, Schwarz und Blau) deutlich beliebter sind und du auch nur ein rotes T-Shirt besitzt. Wenn du dann alle Annahmen zusammenrechnest (12 Millionen Menschen x 20 Prozent T-Shirt x 10 Prozent Rot x 1,05 = 252.000 Menschen), erhältst du eine Anzahl von 252.000 Menschen, die ein rotes T-Shirt tragen.',
  '10M Einwohner + 20% Besucher = 12M × ~20% T-Shirt-Träger (70% Arbeit × 5% + 30% frei × 50% = 18,5%, +5%) × 10% rot → ~252.000 Personen',
  125000, 500000, true);
