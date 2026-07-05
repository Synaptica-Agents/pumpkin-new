# -*- coding: utf-8 -*-
"""Erzeugt die Migration für den Frameworks-Pool-Ausbau:
- 44 UPDATEs (Casebook-Upgrade der Alt-Cases, per UUID aus fw-eval/old_cases.json)
- 40 INSERTs (neue Cases)
Validiert Struktur & erzeugt FrameworkNode-JSON mit stabilen IDs."""
import json, os, sys, re

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
sys.path.insert(0, BASE)

from data_upgrades_medium import UPGRADES_MEDIUM
from data_upgrades_hard import UPGRADES_HARD
from data_new_medium import NEW_MEDIUM
from data_new_hard import NEW_HARD

OLD = json.load(open(os.path.join(ROOT, "fw-eval", "old_cases.json"), encoding="utf-8"))
BY_PREFIX = {c["id"][:8]: c for c in OLD}

CATS = {"profitability", "market_entry", "growth", "ma", "pricing", "operations"}

def expand_tree(tree, prefix):
    """Kompaktformat -> FrameworkNode[] mit IDs."""
    out = []
    for i, n in enumerate(tree, 1):
        node = {
            "id": f"{prefix}n{i}",
            "title": n["t"].strip(),
            "isPriority": bool(n.get("star")),
            "bulletPoints": [{"id": f"{prefix}n{i}b{j}", "text": b.strip()}
                             for j, b in enumerate(n.get("b", []), 1)],
            "children": [{
                "id": f"{prefix}n{i}c{k}",
                "title": c["t"].strip(),
                "bulletPoints": [{"id": f"{prefix}n{i}c{k}b{j}", "text": b.strip()}
                                 for j, b in enumerate(c.get("b", []), 1)],
                "children": [],
            } for k, c in enumerate(n.get("c", []), 1)],
        }
        out.append(node)
    return out

def tree_to_text(tree):
    """Fallback-reference_solution aus dem Baum ableiten."""
    lines = []
    for n in tree:
        bullets = ", ".join(b for b in n.get("b", []))
        childs = "; ".join(c["t"] for c in n.get("c", []))
        seg = f"• {n['t']}: {bullets}" if bullets else f"• {n['t']}"
        if childs:
            seg += f" — Unteräste: {childs}"
        lines.append(seg)
    return "\n".join(lines)

def validate(name, case):
    qa, tree, notes = case["qa"], case["tree"], case["notes"]
    assert 4 <= len(qa) <= 8, f"{name}: {len(qa)} QA-Paare"
    for q, a in qa:
        assert q.strip() and a.strip(), f"{name}: leeres QA"
    assert 3 <= len(tree) <= 6, f"{name}: {len(tree)} Äste"
    stars = sum(1 for n in tree if n.get("star"))
    assert 1 <= stars <= 2, f"{name}: {stars} Sterne"
    for n in tree:
        assert n["t"].strip(), f"{name}: Ast ohne Titel"
        assert len(n.get("b", [])) >= 1 or n.get("c"), f"{name}: Ast '{n['t']}' ohne Inhalt"
    assert len(notes.strip()) > 60, f"{name}: notes zu kurz"

def dq(s):
    """Dollar-Quoting mit Guard."""
    assert "$T$" not in s, "Dollar-Tag-Kollision"
    return f"$T${s}$T$"

def jq(obj):
    s = json.dumps(obj, ensure_ascii=False)
    assert "$J$" not in s, "Dollar-Tag-Kollision"
    return f"$J${s}$J$::jsonb"

sql = ["-- ============================================================",
       "-- Frameworks Pool-Ausbau: 44 Alt-Cases auf Casebook-Format",
       "-- (clarifying_qa, reference_tree, interviewer_notes) + 40 neue",
       "-- Cases (20 medium / 20 hard). Ziel: 100 aktive Cases (50/50).",
       "-- Generiert aus fw-content/ via build_sql.py",
       "-- ============================================================",
       "BEGIN;"]

# --- Upgrades ---
n_up = 0
for prefix, case in list(UPGRADES_MEDIUM.items()) + list(UPGRADES_HARD.items()):
    old = BY_PREFIX.get(prefix)
    assert old, f"Unbekannter Prefix {prefix}"
    validate(prefix, case)
    tree = expand_tree(case["tree"], f"{prefix[:4]}-")
    qa = [{"q": q, "a": a} for q, a in case["qa"]]
    sql.append(
        f"UPDATE public.framework_cases SET\n"
        f"  clarifying_qa = {jq(qa)},\n"
        f"  reference_tree = {jq(tree)},\n"
        f"  interviewer_notes = {dq(case['notes'])}\n"
        f"WHERE id = '{old['id']}';")
    n_up += 1

# --- Neue Cases ---
n_new = 0
for diff, cases in (("medium", NEW_MEDIUM), ("hard", NEW_HARD)):
    for idx, case in enumerate(cases, 1):
        name = f"{diff}-new-{idx}"
        assert case["category"] in CATS, f"{name}: Kategorie {case['category']}"
        validate(name, case)
        tree = expand_tree(case["tree"], f"{diff[0]}{idx}-")
        qa = [{"q": q, "a": a} for q, a in case["qa"]]
        sql.append(
            "INSERT INTO public.framework_cases\n"
            "  (difficulty, category, prompt, context_info, recommended_framework, reference_solution, reference_tree, clarifying_qa, interviewer_notes, active)\n"
            f"VALUES ('{diff}', '{case['category']}', {dq(case['prompt'])}, NULL, {dq(case['framework'])},\n"
            f"  {dq(tree_to_text(case['tree']))},\n"
            f"  {jq(tree)},\n"
            f"  {jq(qa)},\n"
            f"  {dq(case['notes'])}, true);")
        n_new += 1

sql.append("COMMIT;")
out = os.path.join(ROOT, "supabase", "migrations", "20260705220000_frameworks_pool_expansion.sql")
open(out, "w", encoding="utf-8", newline="\n").write("\n\n".join(sql) + "\n")
print(f"OK: {n_up} Upgrades + {n_new} neue Cases -> {out}")
