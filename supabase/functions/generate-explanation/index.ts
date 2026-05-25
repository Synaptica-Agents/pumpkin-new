import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { task_type, difficulty } = await req.json();

    if (!task_type || !difficulty) {
      return new Response(
        JSON.stringify({ error: "task_type and difficulty required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if explanation already exists
    const { data: existing } = await supabase
      .from("mental_math_explanations")
      .select("explanation_text")
      .eq("task_type", task_type)
      .eq("difficulty", difficulty)
      .maybeSingle();

    if (existing) {
      return new Response(
        JSON.stringify({ explanation: existing.explanation_text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const typeLabels: Record<string, string> = {
      multiplication: "Multiplikation",
      division: "Division",
      percentage: "Prozentrechnung / Brüche",
      zero_management: "Nullen-Management (k, Mio, Mrd)",
    };
    const diffLabels: Record<string, string> = {
      easy: "einfach",
      medium: "mittel",
      hard: "schwer",
    };

    const prompt = `Du bist ein Mental-Math-Coach für Consulting-Interviews. Schreibe genau 1–2 Sätze auf Deutsch: einen kurzen, praxisnahen Shortcut/Tipp, wie man Aufgaben vom Typ "${typeLabels[task_type] || task_type}" auf Schwierigkeitsstufe "${diffLabels[difficulty] || difficulty}" im Kopf löst. Keine konkrete Beispielrechnung, nur die Methode. Keine Floskeln, keine langen Texte. Direkt den Tipp schreiben.`;

    const aiResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
          stream: false,
        }),
      }
    );

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await aiResponse.json();
    const explanation =
      aiData.choices?.[0]?.message?.content?.trim() || "Keine Erklärung verfügbar.";

    // Save to DB for future reuse
    await supabase.from("mental_math_explanations").upsert(
      { task_type, difficulty, explanation_text: explanation, updated_at: new Date().toISOString() },
      { onConflict: "task_type,difficulty" }
    );

    return new Response(
      JSON.stringify({ explanation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-explanation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
