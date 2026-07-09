# -*- coding: utf-8 -*-
"""Bewertet die Musterlösung ALLER aktiven Frameworks-Cases und listet
jeden Fall unter 90, damit Ausreißer sichtbar werden."""
import json, ssl, os, sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)
from run_eval import http, serialize_tree, build_answers, evaluate  # reuse

def main():
    cases = []
    for diff in ("medium", "hard"):
        cases += http("GET",
            f"/rest/v1/framework_cases?select=id,difficulty,category,prompt,context_info,"
            f"reference_solution,reference_tree,interviewer_notes"
            f"&active=eq.true&difficulty=eq.{diff}&order=created_at.asc")
    print(f"{len(cases)} aktive Cases", flush=True)
    total = len(cases)
    rows = []
    with ThreadPoolExecutor(max_workers=6) as ex:
        futs = {}
        for c in cases:
            muster, _, _ = build_answers(c)
            c["_muster"] = muster
            futs[ex.submit(evaluate, c, "muster", muster, total)] = c
        for fut in as_completed(futs):
            c = futs[fut]
            d = fut.result()
            sc = d.get("scores") or {}
            rows.append({
                "id": c["id"], "difficulty": c["difficulty"], "category": c["category"],
                "prompt": c["prompt"][:70], "score": d.get("total_score"),
                "fw": sc.get("framework_choice"), "mece": sc.get("structure_mece"),
                "compl": sc.get("completeness"), "prio": sc.get("prioritization"),
                "fb": (d.get("one_line_summary") or "")[:140],
            })
    scores = [r["score"] for r in rows if isinstance(r["score"], (int, float))]
    scores.sort()
    import statistics as st
    print(f"\nMUSTER n={len(scores)} avg={st.mean(scores):.1f} median={st.median(scores):.1f} min={min(scores)} max={max(scores)}", flush=True)
    print(f"unter 88: {[s for s in scores if s < 88]}", flush=True)
    print("\n--- alle < 90 ---", flush=True)
    for r in sorted(rows, key=lambda r: r["score"] or 0):
        if (r["score"] or 0) < 90:
            print(f"{r['score']:3} | fw={r['fw']:2} mece={r['mece']:2} compl={r['compl']:2} prio={r['prio']:2} | {r['difficulty'][:4]}/{r['category'][:11]:11} | {r['id'][:8]}", flush=True)
            print(f"      {r['fb']}", flush=True)
    json.dump(rows, open(os.path.join(BASE, "probe_muster.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    main()
