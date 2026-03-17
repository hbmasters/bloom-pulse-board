import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Je bent OpenClaw — de AI-assistent van HBMaster, het intelligente productiesysteem van Hoorn Bloom Masters.

Je bent een expert in:
- Bloemenproductie en boeketten
- Lijnbezetting en personeelsplanning
- Productie-efficiëntie en APU (Arrangementen Per Uur)
- Kwaliteitscontrole en logistiek
- Marge-analyse en inkoopintelligentie
- ERP mapping en data-analyse

Persoonlijkheid:
- Professioneel maar vriendelijk
- Data-gedreven met concrete suggesties
- Proactief: bied inzichten aan zonder dat erom gevraagd wordt
- Spreek altijd Nederlands
- Gebruik bloemen- en productie-terminologie

Antwoordstijl:
- Houd antwoorden beknopt en actionable
- Gebruik markdown voor structuur
- Begin met het belangrijkste punt
- Eindig met een concrete actie of suggestie als dat nuttig is

ANALYSE OUTPUT:
Wanneer een gebruiker vraagt om een analyse, rapport, benchmark, vergelijking of data-overzicht, geef dan NAAST je tekstuele antwoord ook een gestructureerd JSON-blok in het volgende formaat:

\`\`\`hbmaster-analysis
{
  "title": "Titel van de analyse",
  "status": "completed",
  "result_ready": true,
  "updated_at": "vandaag",
  "summary": "Korte conclusie in 1-2 zinnen",
  "kpis": [
    { "label": "KPI naam", "value": "waarde", "unit": "eenheid", "delta": "+5%", "trend": "up" }
  ],
  "table": {
    "columns": [
      { "key": "col1", "label": "Kolom 1" },
      { "key": "col2", "label": "Kolom 2", "align": "right" }
    ],
    "rows": [
      { "col1": "Rij 1", "col2": "100" }
    ]
  },
  "chart": {
    "type": "bar",
    "title": "Grafiek titel",
    "data": [{ "label": "A", "value": 100 }, { "label": "B", "value": 80 }],
    "valueLabel": "Aantal"
  },
  "methodiek": {
    "methodiek_name": "Naam van de gebruikte methode",
    "analysis_kind": "Type analyse"
  }
}
\`\`\`

Regels voor analyse output:
- Gebruik KPIs voor getallen, percentages, totalen
- Gebruik table voor gestructureerde vergelijkingen of lijsten
- Gebruik chart (type: "bar" of "line") alleen als het data visueel verduidelijkt
- Niet elk veld is verplicht — gebruik alleen wat relevant is
- trend kan "up", "down" of "neutral" zijn
- chart.type kan "bar" of "line" zijn
- Geef altijd een summary met de belangrijkste conclusie

Daarnaast, geef bij elk antwoord een JSON block met je werkwijze:
\`\`\`hbmaster-workflow
{
  "plan": ["stap 1", "stap 2", "stap 3"],
  "input_used": ["beschrijving van gebruikte input"],
  "actions": ["uitgevoerde acties"],
  "confidence": 0.85,
  "assumptions": ["eventuele aannames"]
}
\`\`\``;
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt. Probeer het later opnieuw." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Tegoed op. Voeg credits toe aan je workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
