# Client-Variante: Setup-Schritte fuer Deploy

Diese Datei listet die Aktionen auf, die **manuell** ausgefuehrt werden muessen — die Code-Aenderungen im Repo sind bereits gemacht.

## 1. GitHub-Repo anlegen

```powershell
# Im Verzeichnis Pumpkin-careers-client/
git init
git add .
git commit -m "Initial commit: client variant of Pumpkin Careers drill platform"
```

Dann ueber GitHub UI ein neues **Public** Repo anlegen (Name z.B. `pumpkin-careers-client`).

```powershell
git remote add origin https://github.com/<dein-user>/pumpkin-careers-client.git
git branch -M main
git push -u origin main
```

> **Wichtig:** Public-Repo ist Pflicht fuer den Vercel Free Plan.

## 2. Vercel-Projekt auf neuem Account

1. Bei https://vercel.com/alejandro-4035 einloggen.
2. **Add New** -> **Project** -> Git-Repository **importieren**.
   - Falls das neue GitHub-Repo nicht auftaucht: Vercel die noetigen GitHub-Berechtigungen geben.
3. **Framework Preset:** Vite (wird automatisch erkannt)
4. **Build & Output Settings:** defaults belassen
   - Build Command: `vite build`
   - Output Directory: `dist`
5. **Environment Variables** (alle drei Environments: Production, Preview, Development):
   ```
   VITE_SUPABASE_URL=https://iorbjccohzkfcdtfhtyp.supabase.co
   VITE_SUPABASE_PROJECT_ID=iorbjccohzkfcdtfhtyp
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcmJqY2NvaHprZmNkdGZodHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTg5ODksImV4cCI6MjA4OTc3NDk4OX0.22cFZj9l_JAsx7GRh2mv_59b9hJx3SzrmmVP0SuDsAw
   ```
6. **Deploy** klicken.
7. Resultierende `*.vercel.app`-Domain notieren -> die wird im Iframe-Snippet verwendet.

## 3. OpenRouter-Key in Supabase austauschen

Der neue Key gilt **gleichzeitig fuer Production und Client** (gemeinsame Edge Functions).

**Option A — Dashboard (empfohlen):**
1. https://supabase.com/dashboard/project/iorbjccohzkfcdtfhtyp/functions oeffnen.
2. Unter **Edge Functions** -> **Secrets** den Eintrag `OPENROUTER_API_KEY` editieren.
3. Wert durch den neuen Key ersetzen (NIEMALS hier einchecken):
   ```
   <DEIN_NEUER_OPENROUTER_KEY>
   ```
4. Speichern. Edge Functions uebernehmen den neuen Key beim naechsten Aufruf automatisch.

**Option B — CLI:**
```powershell
$env:SUPABASE_ACCESS_TOKEN='sbp_...'  # Personal Access Token
npx supabase secrets set OPENROUTER_API_KEY='<DEIN_NEUER_OPENROUTER_KEY>' --project-ref iorbjccohzkfcdtfhtyp
```

Danach den **alten** OpenRouter-Key auf https://openrouter.ai/keys revoken, damit er nicht mehr abgerechnet werden kann.

## 4. LearningSuite Embed

In den LearningSuite-Editor folgenden Snippet einsetzen (URL austauschen):

```html
<iframe
  src="https://<dein-vercel-deploy>.vercel.app/"
  width="105%"
  height="800"
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

Optional fuer User-Tracking:
```html
src="https://<dein-vercel-deploy>.vercel.app/?email={{user.email}}"
```
(Syntax `{{user.email}}` haengt vom LearningSuite-Template-System ab.)

## 5. Smoke-Test nach Deploy

- [ ] Vercel-URL im Browser oeffnen -> Carousel mit 3 Karten ist sichtbar
- [ ] Eine Karte anklicken -> entsprechende Drill-Page laedt
- [ ] **Mental Math:** Sprint starten, Aufgabe loesen, Debrief erscheint
- [ ] **Case Math:** Sprint starten, Aufgabe loesen, Debrief erscheint
- [ ] **Creativity:** Case wird generiert, Antwort einreichen, KI-Bewertung kommt zurueck — bestaetigt, dass der neue OpenRouter-Key in Supabase funktioniert
- [ ] In Supabase Studio (Tabelle `drill_sessions`): nach einem Test-Run sollte ein Session-Eintrag erscheinen
- [ ] **Production-Site** (alter Vercel-Deploy) einmal Creativity-Drill testen, um zu bestaetigen, dass der Key-Swap die Prod nicht gebrochen hat
- [ ] Iframe in LearningSuite-Embed-Vorschau pruefen: Carousel passt in 800px Hoehe, Drill-Pages scrollen ggf. innerhalb, aber Layout passt
