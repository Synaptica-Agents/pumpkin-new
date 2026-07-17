# -*- coding: utf-8 -*-
"""Erzeugt die Migration für den Diagramme-Drill (Exhibit-Format v2):
- ALTER TABLE chart_cases (title, exhibits, additional_info, questions; chart_data nullable)
- Deaktiviert alle Alt-Cases (V1-Format ohne Fragen/Exhibits)
- 30 INSERTs (15 easy / 15 hard)
Validiert Exhibit-Struktur, Fragen und Kategorien.

Aufruf: python charts-content/build_sql.py
"""
import json, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(BASE)
sys.path.insert(0, BASE)

from data_cases_easy import EASY_CASES
from data_cases_hard import HARD_CASES

CATS = {"table", "bars", "trend", "share", "combo"}
CHART_TYPES = {"bar", "stacked_bar", "line", "pie"}
# Kategorie -> erlaubte Exhibit-Typen (combo: beliebig)
CAT_EXHIBIT = {
    "table": {"table"},
    "bars": {"bar"},
    "trend": {"line"},
    "share": {"pie", "stacked_bar"},
}


def validate_exhibit(name, e):
    if e["type"] == "table":
        assert e["title"].strip(), f"{name}: Tabelle ohne Titel"
        cols = e["columns"]
        assert len(cols) >= 1, f"{name}: Tabelle ohne Spalten"
        rows = e["rows"]
        assert len(rows) >= 2, f"{name}: Tabelle mit <2 Zeilen"
        for r in rows:
            assert r["label"].strip(), f"{name}: Zeile ohne Label"
            assert len(r["values"]) == len(cols), (
                f"{name}: Zeile '{r['label']}' hat {len(r['values'])} Werte, erwartet {len(cols)}")
            assert r.get("style") in (None, "bold", "total"), f"{name}: style {r.get('style')}"
            assert r.get("indent") in (None, 0, 1, 2), f"{name}: indent {r.get('indent')}"
    else:
        assert e["type"] in CHART_TYPES, f"{name}: Chart-Typ {e['type']}"
        assert e["title"].strip(), f"{name}: Chart ohne Titel"
        labels = e["labels"]
        assert len(labels) >= 2, f"{name}: Chart mit <2 Labels"
        assert len(e["datasets"]) >= 1, f"{name}: Chart ohne Datasets"
        for ds in e["datasets"]:
            assert ds["label"].strip(), f"{name}: Dataset ohne Label"
            assert len(ds["data"]) == len(labels), (
                f"{name}: Dataset '{ds['label']}' hat {len(ds['data'])} Werte, erwartet {len(labels)}")
            assert all(isinstance(v, (int, float)) for v in ds["data"]), (
                f"{name}: Dataset '{ds['label']}' enthält Nicht-Zahlen")


def validate(name, case, difficulty):
    assert case["chart_type"] in CATS, f"{name}: Kategorie {case['chart_type']}"
    assert case["title"].strip(), f"{name}: title fehlt"
    assert len(case["prompt"].strip()) >= 30, f"{name}: prompt zu kurz"

    exhibits = case["exhibits"]
    if case["chart_type"] == "combo":
        assert len(exhibits) == 2, f"{name}: combo braucht genau 2 Exhibits"
    else:
        assert len(exhibits) == 1, f"{name}: {case['chart_type']} braucht genau 1 Exhibit"
        allowed = CAT_EXHIBIT[case["chart_type"]]
        assert exhibits[0]["type"] in allowed, (
            f"{name}: Exhibit-Typ {exhibits[0]['type']} passt nicht zu Kategorie {case['chart_type']}")
    for e in exhibits:
        validate_exhibit(name, e)

    info = case["info"]
    assert info is None or (isinstance(info, list) and all(b.strip() for b in info)), f"{name}: info ungültig"
    if difficulty == "hard":
        assert info, f"{name}: hard-Case ohne Additional Info"

    qs = case["questions"]
    expected_q = 1 if difficulty == "easy" else 2
    assert len(qs) == expected_q, f"{name}: {len(qs)} Fragen, erwartet {expected_q}"
    for q in qs:
        assert q["text"].strip(), f"{name}: Frage ohne Text"
        assert q["solution"].strip(), f"{name}: Frage ohne Lösung"

    assert len(case["reference"].strip()) >= 80, f"{name}: reference zu kurz"


def dq(s):
    """Dollar-Quoting mit Guard."""
    assert "$T$" not in s, "Dollar-Tag-Kollision"
    return f"$T${s}$T$"


def jq(obj):
    s = json.dumps(obj, ensure_ascii=False)
    assert "$J$" not in s, "Dollar-Tag-Kollision"
    return f"$J${s}$J$::jsonb"


sql = ["-- ============================================================",
       "-- Diagramme-Drill v2: Exhibit-Format",
       "-- Neue Spalten (title, exhibits, additional_info, questions),",
       "-- Alt-Cases deaktiviert, 30 neue Cases (15 easy / 15 hard).",
       "-- Exhibit-Stil: Case-Interview-Slides (Tabellen, Charts,",
       "-- Additional Info, 1-2 Fragen mit Musterlösung).",
       "-- Generiert aus charts-content/ via build_sql.py",
       "-- ============================================================",
       "BEGIN;",
       "ALTER TABLE public.chart_cases\n"
       "  ADD COLUMN IF NOT EXISTS title text,\n"
       "  ADD COLUMN IF NOT EXISTS exhibits jsonb,\n"
       "  ADD COLUMN IF NOT EXISTS additional_info jsonb,\n"
       "  ADD COLUMN IF NOT EXISTS questions jsonb;",
       "ALTER TABLE public.chart_cases ALTER COLUMN chart_data DROP NOT NULL;",
       "-- Alt-Cases (V1: ein Freitext-Prompt, keine Fragen/Tabellen) deaktivieren",
       "UPDATE public.chart_cases SET active = false WHERE exhibits IS NULL;"]

n = 0
for difficulty, cases in (("easy", EASY_CASES), ("hard", HARD_CASES)):
    for idx, case in enumerate(cases, 1):
        name = f"{difficulty}-{idx} ({case.get('title', '?')})"
        validate(name, case, difficulty)
        info_sql = jq(case["info"]) if case["info"] else "NULL"
        sql.append(
            "INSERT INTO public.chart_cases\n"
            "  (difficulty, chart_type, title, prompt, exhibits, additional_info, questions, reference_answer, active)\n"
            f"VALUES ('{difficulty}', '{case['chart_type']}', {dq(case['title'])}, {dq(case['prompt'])},\n"
            f"  {jq(case['exhibits'])},\n"
            f"  {info_sql},\n"
            f"  {jq(case['questions'])},\n"
            f"  {dq(case['reference'])}, true);")
        n += 1

sql.append("COMMIT;")
out = os.path.join(ROOT, "supabase", "migrations", "20260716200000_charts_exhibit_format.sql")
open(out, "w", encoding="utf-8", newline="\n").write("\n\n".join(sql) + "\n")

per_cat = {}
for c in EASY_CASES + HARD_CASES:
    per_cat[c["chart_type"]] = per_cat.get(c["chart_type"], 0) + 1
print(f"OK: {n} Cases -> {out}")
print("Kategorien:", dict(sorted(per_cat.items())))
