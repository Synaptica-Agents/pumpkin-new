# -*- coding: utf-8 -*-
"""Kalibrierungs-Test Diagramme-Drill: 15 easy + 15 hard Cases,
je 3 Eingaben (perfekt/normal/schlecht) gegen evaluate-drill (drill_type=charts).
Eingaben werden deterministisch aus reference_answer + questions abgeleitet
(der User sieht die Referenz nie 1:1 — perfekt = Bullets rotiert wie bei fw-eval).
Ergebnis: results.json (fuer make_xlsx.py). Vorbild: fw-eval/run_eval.py."""
import json, ssl, os, time, threading
import urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
URL = "https://iorbjccohzkfcdtfhtyp.supabase.co"

def read_env(key):
    for line in open(os.path.join(ROOT, ".env"), encoding="utf-8"):
        if line.startswith(key + "="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("missing " + key)

ANON = read_env("VITE_SUPABASE_PUBLISHABLE_KEY")
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE  # Firmen-CA — nur fuer diesen lokalen Test

def http(method, path, body=None, timeout=180):
    req = urllib.request.Request(
        URL + path, method=method,
        headers={"apikey": ANON, "Authorization": "Bearer " + ANON,
                 "Content-Type": "application/json"},
        data=json.dumps(body).encode("utf-8") if body is not None else None)
    with urllib.request.urlopen(req, context=CTX, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))

# ── Cases holen: alle 30 aktiven Exhibit-Cases ──
def fetch_cases():
    out = []
    for diff in ("easy", "hard"):
        rows = http("GET",
            f"/rest/v1/chart_cases?select=id,difficulty,chart_type,title,prompt,"
            f"exhibits,additional_info,questions,reference_answer"
            f"&active=eq.true&difficulty=eq.{diff}&order=chart_type.asc,title.asc")
        out.extend(rows)
    return out

# ── Serialisierung: Python-Port von src/lib/chartsSerializer.ts ──
def table_to_text(t):
    lines = [f"TABELLE: {t['title']}" + (f" ({t['unit_note']})" if t.get("unit_note") else "")]
    lines.append(" | ".join([""] + [str(c) for c in t["columns"]]))
    for row in t["rows"]:
        indent = "  " * (row.get("indent") or 0)
        lines.append(" | ".join([indent + row["label"]] + [str(v) for v in row["values"]]))
    if t.get("footnote"):
        lines.append(f"Fußnote: {t['footnote']}")
    return "\n".join(lines)

def chart_to_text(c):
    type_label = {"line": "LINIENDIAGRAMM", "pie": "KREISDIAGRAMM",
                  "stacked_bar": "GESTAPELTES BALKENDIAGRAMM"}.get(c["type"], "BALKENDIAGRAMM")
    lines = [f"{type_label}: {c['title']}" + (f" (Einheit: {c['unit']})" if c.get("unit") else "")]
    lines.append(" | ".join([""] + [str(l) for l in c["labels"]]))
    for ds in c["datasets"]:
        lines.append(" | ".join([ds["label"]] + [str(v) for v in ds["data"]]))
    if c.get("footnote"):
        lines.append(f"Fußnote: {c['footnote']}")
    return "\n".join(lines)

def exhibits_to_text(case):
    parts = []
    for i, e in enumerate(case.get("exhibits") or []):
        body = table_to_text(e) if e["type"] == "table" else chart_to_text(e)
        parts.append(f"--- EXHIBIT {i + 1} ---\n{body}")
    info = case.get("additional_info") or []
    if info:
        parts.append("--- ZUSATZINFORMATIONEN ---\n" + "\n".join(f"- {b}" for b in info))
    return "\n\n".join(parts)

def build_case_prompt(case):
    parts = []
    if case.get("title"):
        parts.append(case["title"])
    parts.append(case["prompt"])
    qs = case.get("questions") or []
    if qs:
        parts.append(
            "Der Kandidat sollte zuerst das Exhibit interpretieren — explizit gefordert waren: "
            "Hauptaussage, 2-3 Key Insights mit Zahlen, mögliche Ursachen/Hypothesen für auffällige "
            "Entwicklungen und ein kurzes \"So what\" (Business-Implikation) — "
            "und danach folgende Fragen beantworten:\n"
            + "\n".join(f"Frage {i + 1}: {q['text']}" for i, q in enumerate(qs)))
    return "\n\n".join(parts)

def build_reference_solution(case):
    parts = []
    if case.get("reference_answer"):
        parts.append("MUSTER-INTERPRETATION:\n" + case["reference_answer"])
    qs = case.get("questions") or []
    if qs:
        parts.append("KORREKTE ANTWORTEN:\n" + "\n".join(
            f"Frage {i + 1}: {q['solution']}" + (f" — Rechenweg: {q['calc']}" if q.get("calc") else "")
            for i, q in enumerate(qs)))
    return "\n\n".join(parts)

def serialize_answer(interpretation, questions, answers):
    parts = [f"=== INTERPRETATION & KEY INSIGHTS ===\n{interpretation.strip()}"]
    for i, q in enumerate(questions):
        a = (answers[i] if i < len(answers) else "").strip() or "(keine Antwort)"
        parts.append(f"=== FRAGE {i + 1}: {q['text']} ===\nANTWORT: {a}")
    return "\n\n".join(parts)

# ── Perfekt/Normal/Schlecht je Case ableiten ──
def ref_bullets(case):
    out = []
    for line in (case.get("reference_answer") or "").splitlines():
        line = line.strip()
        if not line:
            continue
        out.append(line[2:].strip() if line.startswith("- ") else line.lstrip("•").strip())
    return out or ["Das Exhibit zeigt die zentralen Kennzahlen des Klienten."]

def build_answers(case):
    qs = case.get("questions") or []
    bullets = ref_bullets(case)
    # Perfekt: inhaltlich aequivalent zur Referenz, aber realistisch umgeformt
    # (Bullets rotiert — Hauptaussage steht nicht zuerst, Inhalt identisch);
    # Fragen voll korrekt inkl. Rechenweg.
    rotated = bullets[1:] + bullets[:1]
    perfekt_interp = "\n".join(f"- {b}" for b in rotated)
    perfekt_answers = [q["solution"] + (f" ({q['calc']})" if q.get("calc") else "") for q in qs]
    perfekt = serialize_answer(perfekt_interp, qs, perfekt_answers)
    # Normal: nur die Hauptaussage (erster Referenz-Bullet), Fragen korrekt,
    # aber knapp (ohne Rechenweg, ohne Klammer-Belege).
    normal_interp = bullets[0]
    def terse(s):
        out, depth = [], 0
        for ch in s:
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth = max(0, depth - 1)
            elif depth == 0:
                out.append(ch)
        return " ".join("".join(out).split())
    normal_answers = [terse(q["solution"]) for q in qs]
    normal = serialize_answer(normal_interp, qs, normal_answers)
    # Schlecht: vage, keine Zahlen, ausweichende Antworten.
    schlecht_interp = ("Man sieht ein Exhibit mit verschiedenen Zahlen. Manche Werte sind höher "
                       "als andere. Das Unternehmen sollte die Situation weiter beobachten.")
    schlecht = serialize_answer(schlecht_interp, qs,
                                ["Schwer zu sagen, dazu bräuchte man mehr Daten." for _ in qs])
    return perfekt, normal, schlecht

# ── Bewertung aufrufen ──
lock = threading.Lock()
done = [0]

def evaluate(case, tier, answer, total):
    body = {
        "drill_type": "charts",
        "case_prompt": build_case_prompt(case),
        "answer_text": answer,
        "difficulty": case["difficulty"],
        "context_info": exhibits_to_text(case),
        "reference_solution": build_reference_solution(case),
    }
    last_err = None
    for attempt in range(4):
        try:
            d = http("POST", "/functions/v1/evaluate-drill", body)
            if isinstance(d, dict) and d.get("error"):
                raise RuntimeError(d["error"])
            with lock:
                done[0] += 1
                print(f"[{done[0]}/{total}] {case['difficulty']}/{case['chart_type']} "
                      f"{case.get('title', '')} {tier}: {d.get('total_score')}", flush=True)
            return d
        except Exception as e:
            last_err = e
            time.sleep(5 * (attempt + 1))
    with lock:
        done[0] += 1
        print(f"[{done[0]}/{total}] FEHLER {tier}: {last_err}", flush=True)
    return {"total_score": None, "scores": {}, "one_line_summary": f"FEHLER: {last_err}",
            "strengths": [], "improvements": [], "flagged": True}

def main():
    cases = fetch_cases()
    print(f"{len(cases)} Cases geladen", flush=True)
    jobs = []
    for c in cases:
        perfekt, normal, schlecht = build_answers(c)
        c["_reference"] = build_reference_solution(c)
        for tier, answer in (("perfekt", perfekt), ("normal", normal), ("schlecht", schlecht)):
            jobs.append((c, tier, answer))
    total = len(jobs)
    rows = []
    out_path = os.path.join(BASE, "results.json")
    with ThreadPoolExecutor(max_workers=5) as ex:
        futs = {ex.submit(evaluate, c, tier, answer, total): (c, tier, answer)
                for c, tier, answer in jobs}
        for fut in as_completed(futs):
            c, tier, answer = futs[fut]
            d = fut.result()
            sc = d.get("scores") or {}
            fb = d.get("one_line_summary") or ""
            imps = d.get("improvements") or []
            if imps:
                fb += "\nVerbesserungen: " + " | ".join(imps[:3])
            rows.append({
                "difficulty": c["difficulty"], "category": c["chart_type"],
                "prompt": (c.get("title") or "") + " — " + c["prompt"],
                "muster": c["_reference"],
                "input": answer, "tier": tier, "feedback": fb,
                "score": d.get("total_score"),
                "s_data": sc.get("data_reading"),
                "s_trend": sc.get("trend_analysis"),
                "s_biz": sc.get("business_implications"),
                "s_depth": sc.get("depth_of_analysis"),
                "s_comm": sc.get("communication"),
                "flagged": bool(d.get("flagged")),
            })
            # Fortlaufend sichern, damit ein Abbruch keine Daten kostet.
            json.dump(rows, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    order = {"perfekt": 0, "normal": 1, "schlecht": 2}
    rows.sort(key=lambda r: (r["difficulty"], r["category"], r["prompt"], order[r["tier"]]))
    json.dump(rows, open(os.path.join(BASE, "results.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("results.json geschrieben:", len(rows), "Zeilen", flush=True)

if __name__ == "__main__":
    main()
