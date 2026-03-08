import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  IntelligenceData,
  DataState,
  SummarySignal,
  IntelligenceObject,
  IntelligenceAction,
} from "@/types/intelligence";
import { actionItems as staticActions } from "@/components/action-impact/data";
import type { ActionItem } from "@/components/action-impact/types";

/* ══════════════════════════════════════════
   STATIC FALLBACK DATA
   Will be replaced by API calls when backend is wired.
   ══════════════════════════════════════════ */

const staticSummarySignals: SummarySignal[] = [
  { id: "sig-prod", label: "Production Health", value: "92%", status: "healthy", trend: "up" },
  { id: "sig-margin", label: "Margin Health", value: "−2.6pp", status: "warning", trend: "down" },
  { id: "sig-supply", label: "Supply Stability", value: "88%", status: "warning", trend: "down" },
  { id: "sig-forecast", label: "Forecast Reliability", value: "87%", status: "healthy", trend: "stable" },
  { id: "sig-profit", label: "Profit Status", value: "+4.1%", status: "healthy", trend: "up" },
  { id: "sig-ai", label: "AI Cost Monitor", value: "€0.034/st", status: "healthy", trend: "stable" },
];

const staticObjects: IntelligenceObject[] = [
  // Production signals
  {
    id: "io-001", source_system: "HBM Production", department_owner: "Productie", sub_department: "Hand",
    signal_type: "production", title: "Lijn H3 under-performance", description: "195 st/p/u – 11% onder norm van 220",
    status: "critical", financial_impact: -54600, recommended_action: "Plan technisch onderhoud en herverdeel personeel",
    data_sources_used: ["HBM Production"], missing_dependencies: [],
  },
  {
    id: "io-002", source_system: "HBM Production", department_owner: "Productie", sub_department: "Band",
    signal_type: "production", title: "Lijn B5 laag rendement", description: "290 st/p/u – 12% onder norm van 330",
    status: "critical", financial_impact: -28800, recommended_action: "Kalibreer sensoren en optimaliseer orderplanning",
    data_sources_used: ["HBM Production"],
  },
  {
    id: "io-003", source_system: "HBM Production", department_owner: "Productie", sub_department: "Band",
    signal_type: "production", title: "Lijn B3 boven norm", description: "350 st/p/u – 6% boven norm. Capaciteit beschikbaar.",
    status: "healthy", financial_impact: 21600, recommended_action: "Verschuif high-margin producten naar B3",
    data_sources_used: ["HBM Production"],
  },
  // Financial / margin signals
  {
    id: "io-010", source_system: "Axerrio DW", department_owner: "Financieel",
    signal_type: "financial", title: "Gerealiseerde marge onder target", description: "32.4% vs target 35% – gap van 2.6pp",
    status: "warning", financial_impact: -89000, recommended_action: "Analyseer kostendrivers per product",
    data_sources_used: ["Axerrio DW"],
  },
  {
    id: "io-011", source_system: "Axerrio DW", department_owner: "Financieel",
    signal_type: "margin", title: "Vomar Boeket Fleur margin gap", description: "Verwachte marge 4.4pp onder target",
    status: "critical", financial_impact: -73000, recommended_action: "Verhoog verkoopprijs en optimaliseer recept",
    data_sources_used: ["Axerrio DW", "Picklist"],
  },
  {
    id: "io-012", source_system: "Axerrio DW", department_owner: "Financieel",
    signal_type: "margin", title: "REWE Monat margin risk", description: "Marge gap van 3.2pp door Kenya rozen prijsstijging",
    status: "critical", financial_impact: -89000, recommended_action: "Heronderhandel leveranciersprijs",
    data_sources_used: ["Axerrio DW"],
  },
  // Procurement signals
  {
    id: "io-020", source_system: "Picklist", department_owner: "Inkoop",
    signal_type: "procurement", title: "Chrysant Ringa Yellow supply gap", description: "Contracted volume dekt slechts 75% van forecast – gap van 30K stelen",
    status: "critical", financial_impact: -42000, recommended_action: "Reserveer extra stelen bij Flora Holland Pool",
    data_sources_used: ["Picklist", "HBM Production"],
  },
  {
    id: "io-021", source_system: "Picklist", department_owner: "Inkoop",
    signal_type: "procurement", title: "Partijprijs variance +4.2%", description: "Gemiddelde partijprijs boven offerteniveau",
    status: "warning", financial_impact: -19200, recommended_action: "Heronderhandel met leveranciers",
    data_sources_used: ["Picklist", "Axerrio DW"],
  },
  // Forecast signals
  {
    id: "io-030", source_system: "HBM Production", department_owner: "Verkoop",
    signal_type: "forecast", title: "Moederdag forecast mismatch", description: "Forecast wijkt 18% af van binnenkomende orders",
    status: "warning", recommended_action: "Herbereken forecast met actuele orderdata",
    data_sources_used: ["HBM Production"],
  },
  // Optimization / opportunity signals
  {
    id: "io-040", source_system: "Axerrio DW", department_owner: "Inkoop",
    signal_type: "optimization", title: "Chrysant Baltica partijprijs voordeel", description: "Partijprijs 9.3% onder verwachte kostprijs",
    status: "healthy", financial_impact: 28800, recommended_action: "Verhoog inkoopvolume voor deze partij",
    data_sources_used: ["Axerrio DW"],
  },
  {
    id: "io-041", source_system: "HBM Production", department_owner: "Verkoop",
    signal_type: "opportunity", title: "BQ Elegance demand surge", description: "Orders 14% boven forecast – directe kans op extra omzet",
    status: "healthy", financial_impact: 45000, recommended_action: "Verhoog productievolume en beveilig extra stelen",
    data_sources_used: ["HBM Production", "Axerrio DW"],
  },
  // Validation signals
  {
    id: "io-050", source_system: "Axerrio DW", department_owner: "Financieel",
    signal_type: "validation", title: "Factuurprijs vs offerte check", description: "Factuurprijs 1.8% lager dan offerteprijs – data validatie vlag",
    status: "warning", recommended_action: "Verifieer factuurprijzen met inkoopafdeling",
    data_sources_used: ["Axerrio DW"],
  },
];

/** Convert ActionItem (action-impact types) to IntelligenceAction */
function mapActionToIntelligence(a: ActionItem): IntelligenceAction {
  return {
    id: a.id,
    action_title: a.action_title,
    department_owner: a.department_owner,
    sub_department: a.sub_department,
    driver: a.driver,
    flower: a.flower,
    recommended_action: a.recommended_action,
    expected_impact: a.expected_impact,
    effort_level: a.effort_level,
    priority: a.priority,
    status: a.status,
    probability: a.probability,
    impact_financial: a.impact_financial,
    impact_efficiency: a.impact_efficiency,
    impact_risk_reduction: a.impact_risk_reduction,
    impact_supply_stability: a.impact_supply_stability,
    data_sources_used: a.data_sources_used,
    source_signal: a.source_signal,
    constraints: a.constraints,
  };
}

/* ══════════════════════════════════════════
   HOOK
   ══════════════════════════════════════════ */

interface UseIntelligenceDataOptions {
  /** Simulate loading delay in ms (0 = instant, used for dev) */
  simulateDelay?: number;
  /** When true, some signals will show "unknown" status */
  simulatePartial?: boolean;
}

export function useIntelligenceData(opts: UseIntelligenceDataOptions = {}): IntelligenceData & { refresh: () => void } {
  const { simulateDelay = 0, simulatePartial = false } = opts;

  const [summaryState, setSummaryState] = useState<DataState>(simulateDelay > 0 ? "loading" : "complete");
  const [objectsState, setObjectsState] = useState<DataState>(simulateDelay > 0 ? "loading" : "complete");
  const [actionsState, setActionsState] = useState<DataState>(simulateDelay > 0 ? "loading" : "complete");

  const [summarySignals, setSummarySignals] = useState<SummarySignal[]>(simulateDelay > 0 ? [] : staticSummarySignals);
  const [objects, setObjects] = useState<IntelligenceObject[]>(simulateDelay > 0 ? [] : staticObjects);
  const [actions, setActions] = useState<IntelligenceAction[]>(
    simulateDelay > 0 ? [] : staticActions.map(mapActionToIntelligence)
  );

  const loadData = useCallback(() => {
    if (simulateDelay > 0) {
      setSummaryState("loading");
      setObjectsState("loading");
      setActionsState("loading");
      setSummarySignals([]);
      setObjects([]);
      setActions([]);

      // Simulate staggered loading
      setTimeout(() => {
        setSummarySignals(
          simulatePartial
            ? staticSummarySignals.map((s, i) =>
                i === 5 ? { ...s, value: "—", status: "unknown" as const } : s
              )
            : staticSummarySignals
        );
        setSummaryState(simulatePartial ? "partial" : "complete");
      }, simulateDelay * 0.4);

      setTimeout(() => {
        setObjects(staticObjects);
        setObjectsState("complete");
      }, simulateDelay * 0.7);

      setTimeout(() => {
        setActions(staticActions.map(mapActionToIntelligence));
        setActionsState("complete");
      }, simulateDelay);
    } else {
      setSummarySignals(staticSummarySignals);
      setSummaryState("complete");
      setObjects(staticObjects);
      setObjectsState("complete");
      setActions(staticActions.map(mapActionToIntelligence));
      setActionsState("complete");
    }
  }, [simulateDelay, simulatePartial]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /*
   * FUTURE: Replace the above with actual API calls:
   *
   * const fetchSummary = async () => {
   *   setSummaryState("loading");
   *   const res = await fetch("/api/intelligence/summary");
   *   const data = await res.json();
   *   setSummarySignals(data.signals);
   *   setSummaryState(data.signals.some(s => s.status === "unknown") ? "partial" : "complete");
   * };
   *
   * const fetchObjects = async () => {
   *   setObjectsState("loading");
   *   const res = await fetch("/api/intelligence/objects");
   *   const data = await res.json();
   *   setObjects(data.items);
   *   setObjectsState("complete");
   * };
   *
   * const fetchActions = async () => {
   *   setActionsState("loading");
   *   const res = await fetch("/api/intelligence/actions");
   *   const data = await res.json();
   *   setActions(data.items);
   *   setActionsState("complete");
   * };
   */

  return useMemo(
    () => ({
      summary: { state: summaryState, signals: summarySignals },
      objects: { state: objectsState, items: objects },
      actions: { state: actionsState, items: actions },
      refresh: loadData,
    }),
    [summaryState, summarySignals, objectsState, objects, actionsState, actions, loadData]
  );
}
