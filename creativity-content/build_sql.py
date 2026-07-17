# -*- coding: utf-8 -*-
"""Erzeugt die Migration fuer Creativity v3 (simple Business-Sense-Brainstorms):
- reference_ideas-Spalte wieder anlegen
- 30 medium-Cases: Referenz-Ideen per UPDATE (Schluessel = exakter Prompt)
- alte hard-Cases deaktivieren, 30 neue simple hard-Cases einfuegen

Aufruf: python creativity-content/build_sql.py
"""
import os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
sys.path.insert(0, BASE)

from data_cases import MEDIUM_REFS, HARD_CASES

CATS = {"market_entry", "risks_opportunities", "financial"}


def dq(s):
    assert "$T$" not in s, "Dollar-Tag-Kollision"
    return f"$T${s}$T$"


def validate_ref(name, ref):
    lines = [l for l in ref.splitlines() if l.strip()]
    assert 3 <= len(lines) <= 6, f"{name}: {len(lines)} Referenz-Zeilen"
    for l in lines:
        assert l.startswith("• ") and ":" in l, f"{name}: Referenz-Zeile ohne Kategorie: {l[:40]}"


sql = ["-- ============================================================",
       "-- Creativity v3: simple Business-Sense-Brainstorms",
       "-- - reference_ideas wieder eingefuehrt (Beispiel-Loesung + Grader-Referenz)",
       "-- - 30 medium-Einzeiler behalten, jetzt mit Referenz-Ideen",
       "-- - 30 hard neu: etwas breiter, aber simpel (kein Zahlen-Kontext,",
       "--   nichts zu rechnen), alte kontextlastige hard-Cases deaktiviert",
       "-- Generiert aus creativity-content/ via build_sql.py",
       "-- ============================================================",
       "BEGIN;",
       "ALTER TABLE public.creativity_cases ADD COLUMN IF NOT EXISTS reference_ideas text;"]

n_up = 0
seen_prompts = set()
for item in MEDIUM_REFS:
    p, ref = item["prompt"], item["ref"]
    assert p not in seen_prompts, f"Doppelter medium-Prompt: {p[:50]}"
    seen_prompts.add(p)
    validate_ref(p[:40], ref)
    sql.append(
        "UPDATE public.creativity_cases SET reference_ideas = "
        f"{dq(ref)}\nWHERE difficulty = 'medium' AND prompt = {dq(p)};")
    n_up += 1
assert n_up == 30, f"{n_up} medium-Refs, erwartet 30"

sql.append("-- Alte hard-Cases (kontextlastig) deaktivieren")
sql.append("UPDATE public.creativity_cases SET active = false "
           "WHERE difficulty = 'hard' AND reference_ideas IS NULL;")

n_new = 0
for idx, case in enumerate(HARD_CASES, 1):
    name = f"hard-{idx}"
    assert case["category"] in CATS, f"{name}: Kategorie {case['category']}"
    p = case["prompt"].strip()
    assert 40 <= len(p) <= 260, f"{name}: Prompt-Laenge {len(p)} (soll simpel bleiben)"
    validate_ref(name, case["ref"])
    sql.append(
        "INSERT INTO public.creativity_cases (difficulty, category, prompt, reference_ideas, active)\n"
        f"VALUES ('hard', '{case['category']}', {dq(p)},\n"
        f"  {dq(case['ref'])}, true);")
    n_new += 1
assert n_new == 30, f"{n_new} neue hard-Cases, erwartet 30"

per_cat = {}
for c in HARD_CASES:
    per_cat[c["category"]] = per_cat.get(c["category"], 0) + 1
assert all(v == 10 for v in per_cat.values()), f"hard-Verteilung: {per_cat}"

sql.append("COMMIT;")
out = os.path.join(ROOT, "supabase", "migrations", "20260717090000_creativity_v3_simple.sql")
open(out, "w", encoding="utf-8", newline="\n").write("\n\n".join(sql) + "\n")
print(f"OK: {n_up} medium-Updates + {n_new} neue hard-Cases -> {out}")
