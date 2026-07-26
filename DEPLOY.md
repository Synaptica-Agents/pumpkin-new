# Deploy – Pumpkin Careers Client

Wie ein Stand live auf Production kommt – inkl. der Windows-/Auth-Stolperfallen.

## TL;DR (Standard-Deploy)

Production wird **automatisch von Vercel gebaut, sobald `main` auf GitHub
gepusht wird.** Es gibt keinen separaten Vercel-Schritt.

```bash
git add <geänderte-dateien>
git commit -m "kurze Beschreibung"

# Push -> löst Vercel-Production-Deploy aus
git -c http.sslBackend=schannel push origin main
```

Auf **diesem Windows-Rechner** sind zwei Zusätze nötig (Details unten):
- `-c http.sslBackend=schannel` (sonst TLS-Zertifikatsfehler)
- ein **Token von `alejandro-synaptica`**, weil der gecachte Git-Login
  (`landgrafalejandro-dot`) **kein Schreibrecht** auf dem Repo hat.

Zuverlässiger Push mit Token (umgeht den gecachten Login):

```bash
git -c http.sslBackend=schannel -c credential.helper= \
  push "https://x-access-token:<GHP_TOKEN>@github.com/Synaptica-Agents/pumpkin-new.git" main
```

> `<GHP_TOKEN>` = **classic** PAT (`ghp_…`) mit `repo`-Scope, erstellt vom Konto
> **alejandro-synaptica**. Danach Token widerrufen oder sicher aufbewahren.

## Wie der Deploy zusammenhängt

| Komponente | Wert |
|---|---|
| GitHub-Repo (origin) | `https://github.com/Synaptica-Agents/pumpkin-new.git` |
| Production-Branch | `main` |
| Vercel-Team | `team_YlV71fTX7wHgiHfdCuH36cN7` (Synaptica-Agents) |
| Vercel-Projekt | `prj_lQgCVDDHN0tUCfzUueAFybb4UKfd` |
| Deploy-Konto (GitHub) | **alejandro-synaptica** (hat Write) |
| Build Command | `vite build` → Output `dist/` (Vercel-Defaults) |
| Env-Variablen | in den **Vercel-Projekt-Einstellungen** (nicht im Repo) |
| Supabase | Projekt `iorbjccohzkfcdtfhtyp` (geteilt mit Prod) |

Ablauf: `git push origin main` → GitHub → Vercel erkennt den Push → baut mit
`vite build` (Env-Vars aus den Projekt-Einstellungen) → published auf die
Production-Domain. Die Erstkonfiguration (Repo, Vercel-Import, Env-Vars,
OpenRouter-Key) steht in [CLIENT_SETUP.md](./CLIENT_SETUP.md).

## Voraussetzungen für den Push (Auth)

- Das Konto muss **Write** auf `Synaptica-Agents/pumpkin-new` haben → das ist
  **alejandro-synaptica**.
- Der Git Credential Manager auf diesem Rechner ist als **landgrafalejandro-dot**
  gecached – dieses Konto hat **kein** Write-Recht (→ `403`). Deshalb mit einem
  alejandro-synaptica-Token pushen (siehe TL;DR).
- **Classic** Token (`ghp_…`, `repo`-Scope) verwenden.
  **Fine-grained** Tokens (`github_pat_…`) werden von der Org **abgelehnt** und
  führen ebenfalls zu `403`.
- Token unter https://github.com/settings/tokens/new erstellen.

## Windows-TLS-Hinweis (Firmen-Zertifikat)

Node und git (Git Bash, OpenSSL-Backend) vertrauen dem lokalen Firmen-Root-CA
nicht → Fehler *„unable to get local issuer certificate"* bzw.
*„unable to verify the first certificate"*.

- **git:** jedem Netzwerk-Befehl `-c http.sslBackend=schannel` voranstellen
  (nutzt den Windows-Zertifikatsspeicher). Beispiel:
  `git -c http.sslBackend=schannel push origin main`
- **Vercel CLI** (falls überhaupt genutzt): `NODE_OPTIONS=--use-system-ca vercel …`

## Verifizieren nach dem Push

1. Vercel-Dashboard → Team **Synaptica-Agents** → Projekt **pumpkin-new** →
   **Deployments** → neuer Build ist grün.
2. Production-URL öffnen und Smoke-Test:
   - Carousel zeigt alle sechs Drills aktiv: **Mental Math, Case Math,
     Market Sizing, Frameworks, Diagramme, Creativity**.
   - Einen Drill durchspielen; bei Market Sizing/Creativity/Diagramme kommt
     eine KI-Bewertung zurück (bestätigt, dass die Edge Functions laufen).
   - Creativity: eine Verständnisfrage stellen (z.B. "Was ist Take-Rate?") —
     der Interviewer antwortet (bestätigt `frameworks-interviewer`).
   - `/fortschritt` zeigt die Session.

## Troubleshooting

| Symptom | Ursache & Fix |
|---|---|
| `unable to get local issuer certificate` | TLS/Firmen-CA → `-c http.sslBackend=schannel` ergänzen. |
| `403 … denied to landgrafalejandro-dot` | Gecachtes Konto ohne Write → mit alejandro-synaptica-**Token** pushen. |
| `403 … denied to alejandro-synaptica` bei `github_pat_…` | Fine-grained Token wird von der Org abgelehnt → **classic** `ghp_`-Token nutzen. |
| `main…origin/main [gone]` | Nur ein veralteter lokaler Tracking-Ref; Remote-`main` existiert. Push mit explizit `origin main`. |
| Vercel CLI: `Could not retrieve Project Settings` / `Not able to load teams` | Der Vercel-Token (Personal, alejandro-4035) hat keinen Zugriff auf das Team. **Nicht** den CLI-Weg nehmen – über GitHub-Push deployen. |

## Vercel-CLI-Weg (Alternative – nicht empfohlen)

Direkter `vercel --prod`-Deploy scheitert hier, weil der Personal-Token
(`alejandro-4035`) das Team-Projekt nicht erreicht („Not able to load teams").
Er bräuchte einen **team-scoped** Vercel-Token. Der **GitHub-Push-Weg oben ist
der zuverlässige Standard.**

## Backend / Edge Functions

Env-Vars (`VITE_SUPABASE_*`) liegen in den Vercel-Projekt-Einstellungen – der
Build auf Vercel zieht sie automatisch. Die Supabase **Edge Functions**
(z. B. `evaluate-drill`, `evaluate-market-sizing`, `frameworks-interviewer`,
`generate-creativity-case`) liegen im gemeinsamen Supabase-Projekt
`iorbjccohzkfcdtfhtyp` und werden **nicht** über diesen Git-Push deployed.

Function-Deploy auf diesem Rechner: `npx supabase` scheitert am Firmen-TLS
(Deno-CLI vertraut der Avast-Interception nicht, alle curl-Varianten ebenso).
Der zuverlässige Weg ist die **Supabase Management API über PowerShell/.NET**
(nutzt den Windows-Zertifikatsspeicher):

```powershell
# Token: https://supabase.com/dashboard/account/tokens (sbp_..., danach widerrufen)
.\scripts\deploy-functions.ps1 -Token "sbp_..." -Functions evaluate-drill,frameworks-interviewer
```
