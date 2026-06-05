-- ============================================================
-- Market Sizing: add question-type category for start-screen grouping
-- 3 categories (+ "Gemischt" = no filter in the app):
--   mengen  = Mengen & Bestände  (Wie viele … gibt es / werden gebraucht?)
--   maerkte = Märkte & Umsätze   (Wie viel Umsatz / pro Jahr verkauft/konsumiert?)
--   physik  = Physik & Geometrie (Wie schwer / wie groß / wie viel passt rein?)
-- ============================================================

ALTER TABLE public.market_sizing_cases
  ADD COLUMN IF NOT EXISTS category text;

-- ① Mengen & Bestände
UPDATE public.market_sizing_cases SET category = 'mengen' WHERE prompt IN (
  'Wie viele Hunde leben in Deutschland?',
  'Wie viele Fahrräder gibt es in Deutschland?',
  'Was ist die durchschnittliche Anzahl an Stühlen in einem Haushalt in Deutschland?',
  'Wie viele Stiere braucht man, um die Besucher eines Bierfestes in Oberbayern zu füttern?',
  'Wie viele Hotelnächte muss die Lufthansa für ihr Personal buchen?',
  'Wie viele Teebeutel gibt es in China?',
  'Wie viele Friseure arbeiten in Deutschlands Hauptstadt Berlin?',
  'Wie viele Klavierstimmer arbeiten in der Stadt Hamburg?',
  'Wie groß ist der Markt für Wegwerfwindeln in China?',
  'Wie viele Tankstellen gibt es in Kalifornien?',
  'Wie viele Schulen gibt es in Berlin?',
  'Wie viele Menschen tragen heute in New York City ein rotes T-Shirt?',
  'Wie viel Geld liegt in einem durchschnittlichen Einkaufszentrum am Ende des Tages auf dem Boden?',
  'Wie viele Autos wechseln pro Werktag den/die Besitzer*in?'
);

-- ② Märkte & Umsätze
UPDATE public.market_sizing_cases SET category = 'maerkte' WHERE prompt IN (
  'Wie viel Umsatz wird mit Geschenken für Deutsche gemacht, die am 01.01. Geburtstag haben?',
  'Wie hoch ist der tägliche Kaffee-Konsum in Deutschland (in Tassen) an einem Wochentag?',
  'Wie viel Umsatz könnten wir in einem Jahr generieren, indem wir jedes Mal beim Betreten der Technischen Universität München 1 Euro verlangen?',
  'Wie viele Sixpacks Bier werden jedes Jahr in Deutschland verkauft?',
  'Wie viele Tafeln Zartbitterschokolade werden jedes Jahr in Deutschland verkauft?',
  'Wie viel Umsatz macht eine durchschnittliche Zara-Filiale?',
  'Wie viele Autoreifen werden pro Tag in Deutschland verkauft?',
  'Wie groß ist der Markt für Glühbirnen in privaten Immobilien in den USA?',
  'Wie groß ist der Markt für Laufschuhe in Deutschland?',
  'Wie viele iPhones werden pro Jahr in Deutschland verkauft?',
  'Wie viele Golfbälle werden jedes Jahr in den USA verkauft?',
  'Wie viele gebrauchte Brautkleider werden in Großbritannien pro Jahr verkauft?'
);

-- ③ Physik & Geometrie
UPDATE public.market_sizing_cases SET category = 'physik' WHERE prompt IN (
  'Wie viele Smarties passen in einen Smart?',
  'Wie schwer ist New York City?',
  'Wie viele Golfbälle passen in einen Schulbus?',
  'Wie viele Quadratmeter Pizza essen die US-Amerikaner innerhalb eines Monats?',
  'Wie schwer ist die benötigte Lackmenge für die Lackierung eines Airbus A380?'
);
