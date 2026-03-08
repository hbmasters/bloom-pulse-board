import type { Department, ProductionSub } from "@/components/department/DepartmentBadge";

/* ══════════════════════════════════════════
   INTELLIGENCE OBJECT MODEL
   Consumed from:
     GET /api/intelligence/summary
     GET /api/intelligence/objects
     GET /api/intelligence/actions
   ══════════════════════════════════════════ */

/* ── Data loading states ── */

export type DataState = "loading" | "partial" | "unknown" | "complete";

export type SignalStatus = "healthy" | "warning" | "critical" | "unknown";

export type SignalType =
  | "production"
  | "financial"
  | "procurement"
  | "validation"
  | "forecast"
  | "margin"
  | "turnover"
  | "optimization"
  | "opportunity";

/* ── Executive Summary Signal ── */

export interface SummarySignal {
  id: string;
  label: string;
  value: string;
  status: SignalStatus;
  /** Optional trend direction */
  trend?: "up" | "down" | "stable";
}

/* ── Intelligence Object ── */

export interface IntelligenceObject {
  id: string;
  source_system: string;
  department_owner: Department;
  sub_department?: ProductionSub;
  signal_type: SignalType;
  title: string;
  description: string;
  status: SignalStatus;
  financial_impact?: number;
  recommended_action?: string;
  data_sources_used: string[];
  missing_dependencies?: string[];
  /** Timestamp of last refresh */
  updated_at?: string;
}

/* ── Intelligence Action (from /api/intelligence/actions) ── */

export interface IntelligenceAction {
  id: string;
  action_title: string;
  department_owner: Department;
  sub_department?: ProductionSub;
  driver: string;
  flower?: string;
  recommended_action: string;
  expected_impact: string;
  effort_level: "Low" | "Medium" | "High";
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "open" | "in_progress" | "completed";
  probability?: number;
  impact_financial?: number;
  impact_efficiency?: number;
  impact_risk_reduction?: "high" | "medium" | "low" | "none";
  impact_supply_stability?: number;
  data_sources_used: string[];
  source_signal?: string;
  constraints?: string;
}

/* ── Combined Intelligence Data ── */

export interface IntelligenceData {
  summary: {
    state: DataState;
    signals: SummarySignal[];
  };
  objects: {
    state: DataState;
    items: IntelligenceObject[];
  };
  actions: {
    state: DataState;
    items: IntelligenceAction[];
  };
}

/* ── Helpers ── */

/** Filter intelligence objects by signal_type(s) */
export function filterBySignalType(
  objects: IntelligenceObject[],
  types: SignalType[]
): IntelligenceObject[] {
  return objects.filter((o) => types.includes(o.signal_type));
}

/** Filter for risk signals: warning/critical status or negative financial impact */
export function filterRiskSignals(objects: IntelligenceObject[]): IntelligenceObject[] {
  return objects.filter(
    (o) =>
      o.status === "warning" ||
      o.status === "critical" ||
      (o.financial_impact != null && o.financial_impact < 0)
  );
}

/** Filter for opportunity signals: positive financial impact or optimization/opportunity type */
export function filterOpportunitySignals(objects: IntelligenceObject[]): IntelligenceObject[] {
  return objects.filter(
    (o) =>
      (o.financial_impact != null && o.financial_impact > 0) ||
      o.signal_type === "optimization" ||
      o.signal_type === "opportunity"
  );
}

/** Filter for financial signals */
export function filterFinancialSignals(objects: IntelligenceObject[]): IntelligenceObject[] {
  return objects.filter(
    (o) =>
      o.signal_type === "financial" ||
      o.signal_type === "margin" ||
      o.signal_type === "turnover"
  );
}
