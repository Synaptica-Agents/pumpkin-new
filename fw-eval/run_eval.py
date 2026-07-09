# -*- coding: utf-8 -*-
"""Kalibrierungs-Test Frameworks-Drill: 15 medium + 15 hard Cases,
je 3 Eingaben (muster/normal/schlecht) gegen evaluate-drill.
Ergebnis: results.json (fuer make_xlsx.py)."""
import json, re, ssl, os, time, threading
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

# ── Cases holen: je 15 pro Schwierigkeit, neueste zuerst (enthaelt die 8 neuen) ──
def fetch_cases():
    out = []
    for diff in ("medium", "hard"):
        rows = http("GET",
            f"/rest/v1/framework_cases?select=id,difficulty,category,prompt,context_info,"
            f"reference_solution,reference_tree,interviewer_notes"
            f"&active=eq.true&difficulty=eq.{diff}&order=created_at.desc&limit=15")
        out.extend(rows)
    return out

# ── Serialisierung wie frameworkSerializer.serializeFramework ──
def serialize_node(node, path, depth):
    indent = "  " * depth
    label = "Ast" if depth == 0 else "Unterast"
    title = (node.get("title") or "").strip() or "(kein Titel)"
    star = "⭐ " if depth == 0 and node.get("isPriority") else ""
    s = f"{indent}[{label} {path}] {star}{title}\n"
    for bp in node.get("bulletPoints") or []:
        if (bp.get("text") or "").strip():
            s += f"{indent}  - {bp['text'].strip()}\n"
    for j, child in enumerate(node.get("children") or []):
        s += serialize_node(child, f"{path}.{j+1}", depth + 1)
    return s

def serialize_tree(nodes):
    return "\n".join(serialize_node(n, str(i + 1), 0) for i, n in enumerate(nodes)).strip()

# ── Muster/Normal/Schlecht je Case ableiten ──
def parse_reference_solution(text):
    """'• Titel: rest'-Zeilen -> Baumknoten."""
    nodes = []
    for line in (text or "").splitlines():
        line = line.strip().lstrip("•").strip()
        if not line:
            continue
        if ":" in line:
            title, rest = line.split(":", 1)
            bullets = [{"text": p.strip()} for p in re.split(r"[;]", rest) if p.strip()]
        else:
            title, bullets = line, []
        nodes.append({"title": title.strip(), "bulletPoints": bullets[:3], "children": []})
    return nodes[:5]

def build_answers(case):
    tree = case.get("reference_tree")
    nodes = tree if tree else parse_reference_solution(case.get("reference_solution"))
    if not nodes:
        nodes = [{"title": "Analyse", "bulletPoints": [], "children": []}]
    # Muster: inhaltlich aequivalent zur Referenz, aber realistisch umgeformt
    # (ein User sieht die Beispiel-Loesung nie 1:1): Aeste rotiert, letzter
    # Bullet je Ast wird zum Unterast.
    muster_nodes = json.loads(json.dumps(nodes))
    muster_nodes = muster_nodes[1:] + muster_nodes[:1]
    for n in muster_nodes:
        bps = n.get("bulletPoints") or []
        if len(bps) >= 2 and not n.get("children"):
            moved = bps.pop()
            n["children"] = [{"title": moved["text"] if isinstance(moved, dict) else str(moved),
                              "bulletPoints": [], "children": []}]
    if not any(n.get("isPriority") for n in muster_nodes):
        muster_nodes[0]["isPriority"] = True
    muster = serialize_tree(muster_nodes)
    # Normal: erste 3 Aeste, je Ast der erste Bullet, keine Sterne/Kinder
    normal_nodes = []
    for n in json.loads(json.dumps(nodes))[:3]:
        bps = (n.get("bulletPoints") or [])[:1]
        normal_nodes.append({"title": n.get("title", ""), "bulletPoints": bps,
                             "children": [], "isPriority": False})
    normal = serialize_tree(normal_nodes)
    # Schlecht: generisch, vage, kaum Case-Bezug
    schlecht = ("[Ast 1] Allgemeine Analyse\n"
                "  - Zahlen und Daten anschauen\n\n"
                "[Ast 2] Sonstiges\n"
                "  - Mit dem Team besprechen und dann entscheiden")
    return muster, normal, schlecht

# ── Bewertung aufrufen ──
lock = threading.Lock()
done = [0]

def evaluate(case, tier, answer, total):
    body = {
        "drill_type": "frameworks",
        "case_prompt": case["prompt"],
        "answer_text": answer,
        "difficulty": case["difficulty"],
        "context_info": case.get("context_info"),
        "reference_solution": case.get("reference_solution"),
        "framework_guidance": serialize_tree(case["reference_tree"]) if case.get("reference_tree") else None,
        "interviewer_notes": case.get("interviewer_notes"),
        "asked_qa": [],
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
        muster, normal, schlecht = build_answers(c)
        c["_muster"] = muster
        for tier, answer in (("perfekt", muster), ("normal", normal), ("schlecht", schlecht)):
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
                "prompt": c["prompt"], "muster": c["_muster"],
                "input": answer, "tier": tier, "feedback": fb,
                "score": d.get("total_score"),
                "s_framework": sc.get("framework_choice"),
                "s_mece": sc.get("structure_mece"),
                "s_complete": sc.get("completeness"),
                "s_prio": sc.get("prioritization"),
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
