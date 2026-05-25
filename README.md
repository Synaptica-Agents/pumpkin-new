# Pumpkin Careers — Client (LearningSuite Embed)

Schlanke Client-Variante der Pumpkin Careers Consulting-Drills-Plattform. Wird ueber ein iFrame in **LearningSuite** eingebunden und zeigt nur drei Drills:

1. **Mental Math** (`/mental-math-drill`)
2. **Case Math** (`/case-math-drill`)
3. **Creativity** (`/creativity-drill`)

Die Auswahl erfolgt ueber einen seitlichen Carousel (`/`), in dem immer nur eine Drill-Karte sichtbar ist.

## Tech Stack

- React 18 + TypeScript + Vite 5 + Tailwind + shadcn/ui
- Supabase Backend (geteilt mit Production: Projekt `iorbjccohzkfcdtfhtyp`)
- Vercel Deployment (Account `alejandro-4035`)
- Embla Carousel fuer die Drill-Auswahl

## Embed-Snippet fuer LearningSuite

```html
<iframe
  src="https://<dein-vercel-domain>.vercel.app/"
  width="105%"
  height="800"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

Optional: `?email=<user@example.com>` an `src` haengen, damit Sessions im Backend pro User getrackt werden.

## Lokal entwickeln

```bash
npm install
npm run dev          # http://localhost:5173
npm run build
npm run preview      # http://localhost:4173
npm run test
```

Mit dem mitgelieferten `iframe-test.html` laesst sich der iframe-Einbau lokal testen (preview-Server starten, dann die Datei im Browser oeffnen).

## Verhaeltnis zum Production-Repo

Dieses Repo ist ein **Fork** des Production-Repos. Bugfixes und neue Features muessen ggf. manuell zwischen beiden Repos synchronisiert werden. Production-Repo: `landgrafalejandro-dot/remix-of-pumpkin-consulting-drills`.

Die Edge Functions (`evaluate-drill`, `generate-creativity-case`) leben im **gemeinsamen** Supabase-Projekt und werden nicht aus diesem Repo deployed — sie sind hier nur als Referenz mitkopiert.

## Setup-Schritte fuer Deploy

Siehe [CLIENT_SETUP.md](./CLIENT_SETUP.md) fuer die manuellen Schritte (neues GitHub-Repo, Vercel-Projekt, Supabase Key-Swap).
