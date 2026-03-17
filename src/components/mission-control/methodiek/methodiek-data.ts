import type { Methodiek } from "./methodiek-types";

export const initialMethodieken: Methodiek[] = [
  {
    id: "1",
    methodiek_id: "prod-efficiency",
    name: "Productie Efficiency Analyse",
    description: "Berekent realtime efficiency scores per lijn op basis van output, bezetting en geplande capaciteit.",
    analysis_kind: "production",
    status: "active",
    version: "v3.2",
    base_prompt: `Analyseer de productie-efficiency per lijn.

Vergelijk de gerealiseerde output met de geplande capaciteit en bereken het efficiency percentage. 
Identificeer afwijkingen groter dan 5% en geef mogelijke oorzaken.

Gebruik de volgende bronnen:
- Lijnoutput data (realtime)
- Bezettingsgraden per shift
- Geplande capaciteit uit het weekplan

Structureer het resultaat als:
1. Efficiency score per lijn (%)
2. Top 3 afwijkingen met oorzaakanalyse
3. Aanbeveling voor volgende shift`,
    data_sources: [
      { name: "HBM Control - Lijnoutput", type: "api", required: true },
      { name: "HBM Data - Bezetting", type: "database", required: true },
      { name: "Weekplanning", type: "erp", required: true },
    ],
    output_model: {
      result_summary_template: "Efficiency: {score}% — {afwijkingen} afwijkingen gedetecteerd",
      result_payload_structure: "Gestructureerd rapport met efficiency scores per lijn, afwijkingsanalyse en aanbevelingen.",
      result_ready_behavior: "Markeer als ready wanneer alle lijnen zijn geanalyseerd en score is berekend.",
      sections: [
        { key: "efficiency_score", label: "Efficiency Score", type: "number", required: true },
        { key: "afwijkingen", label: "Afwijkingen", type: "list", required: true },
        { key: "aanbevelingen", label: "Aanbevelingen", type: "text", required: false },
      ],
    },
    updated_at: "2 min geleden",
    created_at: "2024-01-15",
    total_runs: 4280,
    accuracy: 0.96,
  },
  {
    id: "2",
    methodiek_id: "cost-per-stem",
    name: "Arbeid Per Steel Methodiek",
    description: "Analyseert arbeidskosten per steel inclusief overhead, pauzes en indirecte uren per productlijn.",
    analysis_kind: "margin",
    status: "active",
    version: "v2.1",
    base_prompt: `Bereken de arbeidskosten per steel voor elke productlijn.

Neem mee:
- Directe arbeidsuren per lijn
- Overhead percentage
- Pauzetijd en indirecte uren
- Output per lijn in stelen

Vergelijk met de benchmark van vorige maand en markeer lijnen die meer dan 10% afwijken.`,
    data_sources: [
      { name: "HBM Data - Uurregistratie", type: "database", required: true },
      { name: "HBM CRM - Lijnoutput", type: "api", required: true },
      { name: "Overhead tabel", type: "csv", required: false },
    ],
    output_model: {
      result_summary_template: "Kosten/steel: €{kosten} — {afwijkend} lijnen boven benchmark",
      result_payload_structure: "Tabel met kosten per steel per lijn, benchmark vergelijking en trend.",
      result_ready_behavior: "Ready wanneer alle lijnen verwerkt zijn.",
      sections: [
        { key: "kosten_per_steel", label: "Kosten per Steel", type: "number", required: true },
        { key: "benchmark_vergelijking", label: "Benchmark Vergelijking", type: "json", required: true },
      ],
    },
    updated_at: "15 min geleden",
    created_at: "2024-02-20",
    total_runs: 1560,
    accuracy: 0.92,
  },
  {
    id: "3",
    methodiek_id: "waste-analysis",
    name: "Derving & Uitboeking Analyse",
    description: "Monitort dervingspercentages per batch, identificeert patronen en voorspelt uitval.",
    analysis_kind: "quality",
    status: "active",
    version: "v4.0",
    base_prompt: `Analyseer derving per batch en identificeer patronen.

Gebruik historische dervingsdata om voorspellingen te maken voor komende batches.
Correleer met leverancier, seizoen en producttype.

Output structuur:
1. Derving % per batch
2. Patroonherkenning (leverancier, seizoen, product)
3. Voorspelling volgende week
4. Actiepunten voor reductie`,
    data_sources: [
      { name: "HBM Control - Batchdata", type: "api", required: true },
      { name: "HBM Florist - Kwaliteit", type: "api", required: true },
      { name: "HBM Data - Historisch", type: "database", required: true },
    ],
    output_model: {
      result_summary_template: "Derving: {percentage}% — Trend: {trend}",
      result_payload_structure: "Dervingsrapport met patronen, voorspellingen en actiepunten.",
      result_ready_behavior: "Ready na verwerking van alle actieve batches.",
      sections: [
        { key: "derving_percentage", label: "Derving %", type: "number", required: true },
        { key: "patronen", label: "Patronen", type: "list", required: true },
        { key: "voorspelling", label: "Voorspelling", type: "text", required: true },
        { key: "actiepunten", label: "Actiepunten", type: "list", required: false },
      ],
    },
    updated_at: "30 min geleden",
    created_at: "2024-01-08",
    total_runs: 892,
    accuracy: 0.89,
  },
  {
    id: "4",
    methodiek_id: "erp-mapping",
    name: "ERP Mapping Reverse Engineer",
    description: "Mapt de volledige keten van SalesOrder → ProductionOrder → Invoice voor traceerbaarheid.",
    analysis_kind: "mapping",
    status: "active",
    version: "v1.3",
    base_prompt: `Reverse engineer de ERP-keten voor het geselecteerde product of order.

Map de volgende stappen:
1. SalesOrder intake
2. ProductionOrder generatie
3. Picking & packing
4. Invoice creatie
5. Delivery confirmation

Identificeer ontbrekende koppelingen en inconsistenties.`,
    data_sources: [
      { name: "ERP - Sales Orders", type: "erp", required: true },
      { name: "ERP - Production Orders", type: "erp", required: true },
      { name: "ERP - Invoices", type: "erp", required: true },
    ],
    output_model: {
      result_summary_template: "Mapping: {completeness}% compleet — {gaps} gaps gevonden",
      result_payload_structure: "Flow diagram beschrijving met gap-analyse per stap.",
      result_ready_behavior: "Ready wanneer alle ketenstappen zijn gemapt.",
      sections: [
        { key: "completeness", label: "Compleetheid", type: "number", required: true },
        { key: "gaps", label: "Gaps", type: "list", required: true },
        { key: "flow_description", label: "Flow Beschrijving", type: "text", required: true },
      ],
    },
    updated_at: "3 uur geleden",
    created_at: "2024-03-01",
    total_runs: 156,
    accuracy: 0.87,
  },
  {
    id: "5",
    methodiek_id: "purchase-ratio",
    name: "Inkoopverhouding Methodiek",
    description: "Vergelijkt inkoopvolumes met verkoopprognoses en identificeert over- en onderinkoop.",
    analysis_kind: "procurement",
    status: "active",
    version: "v1.6",
    base_prompt: `Analyseer de verhouding tussen inkoop en verkoop per productgroep.

Bereken:
- Inkoopvolume vs. verkoopprognose ratio
- Over-inkoop risico per groep
- Onder-inkoop risico per groep

Markeer afwijkingen > 15% en geef prioriteitsadvies.`,
    data_sources: [
      { name: "HBM CRM - Inkooporders", type: "api", required: true },
      { name: "HBM Florist - Prognose", type: "api", required: true },
      { name: "HBM Data - Historisch", type: "database", required: false },
    ],
    output_model: {
      result_summary_template: "Ratio: {ratio} — {alerts} alerts actief",
      result_payload_structure: "Ratio-rapport per productgroep met risico-indicatie.",
      result_ready_behavior: "Ready na vergelijking van alle actieve productgroepen.",
      sections: [
        { key: "ratio", label: "Inkoop/Verkoop Ratio", type: "number", required: true },
        { key: "alerts", label: "Alerts", type: "list", required: true },
      ],
    },
    updated_at: "2 uur geleden",
    created_at: "2024-02-10",
    total_runs: 376,
    accuracy: 0.88,
  },
  {
    id: "6",
    methodiek_id: "kenya-yield",
    name: "Kenya Opbrengst Analyse",
    description: "Analyseert opbrengst per hectare vanuit Kenya-farms gecorreleerd met weersdata.",
    analysis_kind: "production",
    status: "inactive",
    version: "v1.2",
    base_prompt: `Analyseer de opbrengst per hectare voor Kenya farms.

Correleer met:
- Weersdata (temperatuur, neerslag)
- Seizoenspatronen
- Variëteit performance

Geef prognose voor komende 4 weken.`,
    data_sources: [
      { name: "HBM Data - Farmdata", type: "database", required: true },
      { name: "Weather API", type: "api", required: true },
    ],
    output_model: {
      result_summary_template: "Opbrengst: {yield}/ha — Prognose: {forecast}",
      result_payload_structure: "Opbrengstrapport per farm met weercorrelatie en prognose.",
      result_ready_behavior: "Ready na verwerking van alle farms.",
      sections: [
        { key: "yield_per_ha", label: "Opbrengst/ha", type: "number", required: true },
        { key: "correlatie", label: "Weercorrelatie", type: "json", required: false },
        { key: "prognose", label: "Prognose", type: "text", required: true },
      ],
    },
    updated_at: "1 week geleden",
    created_at: "2024-03-05",
    total_runs: 156,
    accuracy: 0.82,
  },
];
