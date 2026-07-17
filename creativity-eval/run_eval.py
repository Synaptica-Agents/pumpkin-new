# -*- coding: utf-8 -*-
"""Kalibrierungs-Test Creativity-Drill: alle 60 aktiven Cases (30 medium/30 hard),
je 3 Eingaben (perfekt/normal/schlecht) gegen evaluate-drill (drill_type=creativity).
Eingaben deterministisch aus reference_ideas abgeleitet:
- perfekt: alle Ideen-Kategorien als Bloecke, Reihenfolge rotiert
- normal:  3 Kategorien mit je 1 Idee (gruppierte Kurz-Antwort)
- schlecht: vage, unstrukturiert, generisch
Ergebnis: results.json (fuer make_xlsx.py). Vorbild: charts-eval/run_eval.py."""
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

def fetch_cases():
    out = []
    for diff in ("medium", "hard"):
        rows = http("GET",
            f"/rest/v1/creativity_cases?select=id,difficulty,category,prompt,reference_ideas"
            f"&active=eq.true&difficulty=eq.{diff}&order=category.asc,created_at.asc")
        out.extend(rows)
    return out

# ── Referenz parsen: Zeilen "• Kategorie: idee, idee, idee" ──
def split_ideas(s):
    """Kommas nur auf Klammer-Tiefe 0 trennen."""
    out, buf, depth = [], [], 0
    for ch in s:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth = max(0, depth - 1)
        if ch == "," and depth == 0:
            out.append("".join(buf).strip()); buf = []
        else:
            buf.append(ch)
    if "".join(buf).strip():
        out.append("".join(buf).strip())
    return [i for i in out if i]

def parse_ref(ref):
    cats = []
    for line in (ref or "").splitlines():
        line = line.strip().lstrip("•").strip()
        if not line or ":" not in line:
            continue
        cat, rest = line.split(":", 1)
        cats.append({"cat": cat.strip(), "ideas": split_ideas(rest)})
    return cats

def build_answers(case):
    cats = parse_ref(case.get("reference_ideas"))
    if not cats:
        cats = [{"cat": "Ideen", "ideas": ["strukturiert brainstormen"]}]
    # Perfekt: alle Kategorien mit allen Ideen, Reihenfolge rotiert
    rotated = cats[1:] + cats[:1]
    perfekt = "\n\n".join(
        c["cat"] + ":\n" + "\n".join(f"- {i}" for i in c["ideas"]) for c in rotated)
    # Normal: 3 Kategorien, je genau 1 Idee — gruppierte Kurz-Antwort
    normal = "\n\n".join(
        c["cat"] + ":\n- " + c["ideas"][0] for c in cats[:3])
    # Schlecht: vage, unstrukturiert, generisch
    schlecht = ("Mehr Werbung machen und die Preise anpassen. Vielleicht auch online "
                "etwas machen. Am besten erstmal mit dem Team besprechen und ausprobieren.")
    return perfekt, normal, schlecht

lock = threading.Lock()
done = [0]

def evaluate(case, tier, answer, total):
    body = {
        "drill_type": "creativity",
        "case_prompt": case["prompt"],
        "answer_text": answer,
        "difficulty": case["difficulty"],
        "context_info": None,
        "reference_solution": case.get("reference_ideas"),
    }
    last_err = None
    for attempt in range(4):
        try:
            d = http("POST", "/functions/v1/evaluate-drill", body)
            if isinstance(d, dict) and d.get("error"):
                raise RuntimeError(d["error"])
            with lock:
                done[0] += 1
                print(f"[{done[0]}/{total}] {case['difficulty']}/{case['category']} {tier}: {d.get('total_score')}", flush=True)
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
                "difficulty": c["difficulty"], "category": c["category"],
                "prompt": c["prompt"], "muster": c.get("reference_ideas") or "",
                "input": answer, "tier": tier, "feedback": fb,
                "score": d.get("total_score"),
                "s_structure": sc.get("structure"),
                "s_content": sc.get("content"),
                "s_creativity": sc.get("creativity"),
                "flagged": bool(d.get("flagged")),
            })
            json.dump(rows, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    order = {"perfekt": 0, "normal": 1, "schlecht": 2}
    rows.sort(key=lambda r: (r["difficulty"], r["category"], r["prompt"], order[r["tier"]]))
    json.dump(rows, open(os.path.join(BASE, "results.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("results.json geschrieben:", len(rows), "Zeilen", flush=True)

if __name__ == "__main__":
    main()
